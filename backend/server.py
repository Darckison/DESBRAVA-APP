import os
import shutil
import uuid
from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId

app = FastAPI()

# Configuração do CORS
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

# --- CONEXÃO COM O MONGODB ---
# COLOQUE SUA SENHA ABAIXO (substitua SUA_SENHA_AQUI)
uri = "mongodb+srv://tdarckison_user:Clube2026@cluster0.8nvfgfw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

client = AsyncIOMotorClient(uri)

# AJUSTE EXATO CONFORME SEUS PRINTS DO ATLAS
# Banco 'desbravadores' -> Coleção 'membros'
db_principal = client["desbravadores"]
colecao_membros = db_principal["membros"]

# Banco 'unidades' -> Coleção 'unidades'
db_unidades_banco = client["unidades"]
colecao_unidades = db_unidades_banco["unidades"]

# --- ROTAS DE MEMBROS ---

@app.get("/membros")
async def listar():
    membros = await colecao_membros.find().sort("pontos", -1).to_list(100)
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
        # Caminho relativo para funcionar no Render
        url_foto = f"/uploads/{nome_arquivo}"

    novo_membro = {
        "nome": nome, "unidade": unidade, "funcao": funcao,
        "pontos": pontos, "foto_url": url_foto, "historico_pontos": []
    }
    novo = await colecao_membros.insert_one(novo_membro)
    return {"id": str(novo.inserted_id)}

@app.put("/membros/{id}")
async def editar(
    id: str,
    nome: str = Form(...),
    unidade: str = Form(...),
    funcao: str = Form(...),
    foto: UploadFile = File(None)
):
    update_data = {"nome": nome, "unidade": unidade, "funcao": funcao}
    if foto:
        nome_arquivo = f"{uuid.uuid4()}_{foto.filename}"
        caminho = os.path.join(IMAGENS_DIR, nome_arquivo)
        with open(caminho, "wb") as buffer:
            shutil.copyfileobj(foto.file, buffer)
        update_data["foto_url"] = f"/uploads/{nome_arquivo}"

    resultado = await colecao_membros.update_one(
        {"_id": ObjectId(id)}, 
        {"$set": update_data}
    )
    return {"message": "Atualizado com sucesso"}

@app.delete("/membros/{id}")
async def remover(id: str):
    await colecao_membros.delete_one({"_id": ObjectId(id)})
    return {"message": "Removido"}

@app.patch("/membros/{id}/pontos")
async def adicionar_pontos(id: str, valor: int = Form(...), motivo: str = Form(...)):
    await colecao_membros.update_one(
        {"_id": ObjectId(id)},
        {
            "$inc": {"pontos": valor}, 
            "$push": {"historico_pontos": {"valor": valor, "motivo": motivo}} 
        }
    )
    return {"message": "Pontos salvos"}

# --- ROTAS DE RANKING DE UNIDADES ---

# --- ROTAS DE RANKING DE UNIDADES (CORRIGIDAS) ---

@app.get("/ranking-unidades")
async def obter_ranking_unidades():
    unidades_cursor = colecao_unidades.find()
    unidades_lista = await unidades_cursor.to_list(length=100)
    
    ranking_final = []
    for unidade in unidades_lista:
        nome_unidade = unidade["nome"].strip() # Remove espaços bobos
        
        # BUSCA INTELIGENTE: O '$options': 'i' ignora maiúsculas/minúsculas
        membros_cursor = colecao_membros.find({
            "unidade": {"$regex": f"^{nome_unidade}$", "$options": "i"}
        })
        membros_m = await membros_cursor.to_list(length=100)
        
        soma_membros = sum(m.get("pontos", 0) for m in membros_m)
        
        ranking_final.append({
            "nome": unidade["nome"],
            "pontos_unidade": unidade.get("pontos_proprios", 0),
            "pontos_membros": soma_membros,
            "total": unidade.get("pontos_proprios", 0) + soma_membros,
            "total_membros": len(membros_m)
        })

    return sorted(ranking_final, key=lambda x: x['total'], reverse=True)

@app.get("/unidade/{nome_unidade}/membros")
async def listar_membros_da_unidade(nome_unidade: str):
    # Também ignora maiúsculas/minúsculas ao listar detalhes
    membros_cursor = colecao_membros.find({
        "unidade": {"$regex": f"^{nome_unidade}$", "$options": "i"}
    })
    membros_m = await membros_cursor.to_list(length=100)
    for m in membros_m:
        m["_id"] = str(m["_id"])
    return membros_m

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)



