import os
import shutil
import uuid
from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId

app = FastAPI()

# Configuração do CORS para o React conseguir acessar
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pasta de uploads
IMAGENS_DIR = "uploads"
os.makedirs(IMAGENS_DIR, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=IMAGENS_DIR), name="uploads")

# Conexão com MongoDB Atlas via variável de ambiente do Render
client = AsyncIOMotorClient(os.getenv("MONGODB_URL", "mongodb://localhost:27017"))
db = client["desbravadores"]

@app.get("/membros")
async def listar():
    membros = await db.membros.find().sort("pontos", -1).to_list(100)
    for m in membros:
        m["_id"] = str(m["_id"])
    return membros

@app.post("/membros")
async def criar(
    nome: str = Form(...),
    unidade: str = Form(...),
    funcao: str = Form(...),
    pontos: int = Form(0),
    foto: UploadFile = File(None)
):
    url_foto = "https://placehold.co/400"
    if foto:
        nome_arquivo = f"{uuid.uuid4()}_{foto.filename}"
        caminho = os.path.join(IMAGENS_DIR, nome_arquivo)
        with open(caminho, "wb") as buffer:
            shutil.copyfileobj(foto.file, buffer)
        # CORREÇÃO DE IDENTAÇÃO AQUI:
        url_foto = f"https://desbrava-app-1.onrender.com/uploads/{nome_arquivo}"

    novo_membro = {
        "nome": nome, "unidade": unidade, "funcao": funcao,
        "pontos": pontos, "foto_url": url_foto, "historico_pontos": []
    }
    novo = await db.membros.insert_one(novo_membro)
    return {"id": str(novo.inserted_id)}

@app.put("/membros/{id}")
async def editar(
    id: str,
    nome: str = Form(...),
    unidade: str = Form(...),
    funcao: str = Form(...),
    foto: UploadFile = File(None)
):
    update_data = {
        "nome": nome,
        "unidade": unidade,
        "funcao": funcao
    }

    if foto:
        nome_arquivo = f"{uuid.uuid4()}_{foto.filename}"
        caminho = os.path.join(IMAGENS_DIR, nome_arquivo)
        with open(caminho, "wb") as buffer:
            shutil.copyfileobj(foto.file, buffer)
        # URL correta para o ambiente de produção
        update_data["foto_url"] = f"https://desbrava-app-1.onrender.com/uploads/{nome_arquivo}"

    resultado = await db.membros.update_one(
        {"_id": ObjectId(id)}, 
        {"$set": update_data}
    )
    
    if resultado.matched_count == 0:
        raise HTTPException(status_code=404, detail="Membro não encontrado")
    
    return {"message": "Atualizado com sucesso"}

@app.patch("/membros/{id}/pontos")
async def adicionar_pontos(id: str, valor: int = Form(...), motivo: str = Form(...)):
    await db.membros.update_one(
        {"_id": ObjectId(id)},
        {
            "$inc": {"pontos": valor},
            "$push": {"historico_pontos": {"valor": valor, "motivo": motivo}}
        }
    )
    return {"message": "Pontos salvos"}

@app.delete("/membros/{id}")
async def remover(id: str):
    await db.membros.delete_one({"_id": ObjectId(id)})
    return {"message": "Removido"}
