import os
import shutil
import uuid
import cloudinary
import cloudinary.uploader 
from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId

app = FastAPI()

# --- CONFIGURAÇÃO DO CLOUDINARY (ADICIONE SUAS CHAVES AQUI) ---
cloudinary.config( 
  cloud_name = "Root", 
  api_key = "723664166637722", 
  api_secret = "lB5BVenoLxnyx9Vx3KfPrQEKL5I", # Substitua pela sua Secret real se for diferente
  secure = True
)

# Configuração do CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pasta de uploads (Mantida para compatibilidade, mas agora usaremos Cloudinary)
IMAGENS_DIR = "uploads"
os.makedirs(IMAGENS_DIR, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=IMAGENS_DIR), name="uploads")

# --- CONEXÃO COM O MONGODB ---
uri = "mongodb+srv://tdarckison_user:Clube2026@cluster0.8nvfgfw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
client = AsyncIOMotorClient(uri)

# Bancos e Coleções
db_principal = client["desbravadores"]
colecao_membros = db_principal["membros"]

db_unidades_banco = client["unidades"]
colecao_unidades = db_unidades_banco["unidades"]

# --- ROTAS DE MEMBROS (AGORA COM CLOUDINARY) ---

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
    url_foto = "https://placehold.co/400?text=SEM+FOTO"
    if foto:
        # Envia a foto do desbravador para o Cloudinary
        resultado = cloudinary.uploader.upload(foto.file)
        url_foto = resultado["secure_url"]

    novo_membro = {
        "nome": nome, 
        "unidade": unidade, 
        "funcao": funcao,
        "pontos": pontos, 
        "foto_url": url_foto, 
        "historico_pontos": []
    }
    novo = await colecao_membros.insert_one(novo_membro)
    return {"id": str(novo.inserted_id), "url": url_foto}

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
        resultado = cloudinary.uploader.upload(foto.file)
        update_data["foto_url"] = resultado["secure_url"]

    await colecao_membros.update_one(
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

# --- ROTAS DE UNIDADES (CORRIGIDAS E COMPLETAS) ---

@app.post("/unidades")
async def criar_unidade(
    nome: str = Form(...),
    pontos_proprios: int = Form(0),
    logo: UploadFile = File(None)
):
    url_final = "https://placehold.co/200?text=SEM+LOGO"
    
    if logo:
        # Upload da Logo para o Cloudinary
        resultado = cloudinary.uploader.upload(logo.file)
        url_final = resultado["secure_url"] 

    nova_unidade = {
        "nome": nome.upper().strip(),
        "pontos_proprios": int(pontos_proprios),
        "logo_url": url_final 
    }
    
    await colecao_unidades.update_one(
        {"nome": nova_unidade["nome"]},
        {"$set": nova_unidade},
        upsert=True
    )
    return {"status": "sucesso", "url": url_final}

@app.get("/ranking-unidades")
async def obter_ranking_unidades():
    unidades_cursor = colecao_unidades.find()
    unidades_lista = await unidades_cursor.to_list(length=100)
    
    ranking_final = []
    for unidade in unidades_lista:
        nome_uni = unidade["nome"].strip()
        
        # Busca membros ignorando maiúsculas/minúsculas
        membros_cursor = colecao_membros.find({
            "unidade": {"$regex": f"^{nome_uni}$", "$options": "i"}
        })
        membros_m = await membros_cursor.to_list(length=100)
        
        soma_membros = sum(m.get("pontos", 0) for m in membros_m)
        
        ranking_final.append({
            "nome": nome_uni,
            "logo_url": unidade.get("logo_url", "https://placehold.co/200"),
            "pontos_unidade": unidade.get("pontos_proprios", 0),
            "pontos_membros": soma_membros,
            "total": unidade.get("pontos_proprios", 0) + soma_membros,
            "total_membros": len(membros_m)
        })

    return sorted(ranking_final, key=lambda x: x['total'], reverse=True)

@app.get("/unidade/{nome_unidade}/membros")
async def listar_membros_da_unidade(nome_unidade: str):
    membros_cursor = colecao_membros.find({
        "unidade": {"$regex": f"^{nome_unidade}$", "$options": "i"}
    })
    membros_m = await membros_cursor.to_list(length=100)
    for m in membros_m:
        m["_id"] = str(m["_id"])
    return membros_m

@app.delete("/unidades/{nome}")
async def deletar_unidade(nome: str):
    await colecao_unidades.delete_one({"nome": nome.upper().strip()})
    return {"message": "Unidade removida"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
