import os
import cloudinary
import cloudinary.uploader
from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId
from typing import List, Optional

app = FastAPI()

# Configuração de CORS para permitir acesso da Vercel ao Render
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configuração do Cloudinary (Puxa as chaves que você colocou no Render)
cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET"),
    secure=True
)

# Conexão com MongoDB Atlas via Variável de Ambiente
link_mongo = os.getenv("MONGODB_URL")
client = AsyncIOMotorClient(link_mongo)
db = client.get_database("desbravadores")
collection = db.get_collection("membros")

# Helper para converter dados do banco para JSON
def membro_helper(membro) -> dict:
    return {
        "_id": str(membro["_id"]),
        "nome": membro.get("nome"),
        "unidade": membro.get("unidade"),
        "funcao": membro.get("funcao"),
        "foto_url": membro.get("foto_url", ""),
        "pontos": membro.get("pontos", 0)
    }

# ROTA: Listar Membros
@app.get("/membros")
async def listar_membros():
    membros = []
    cursor = collection.find()
    async for membro in cursor:
        membros.append(membro_helper(membro))
    return membros

# ROTA: Criar Membro com Foto no Cloudinary
@app.post("/membros")
async def criar_membro(
    nome: str = Form(...),
    unidade: str = Form(...),
    funcao: str = Form(...),
    foto: Optional[UploadFile] = File(None)
):
    foto_url = "https://via.placeholder.com/150"
    
    # Se uma foto for enviada, faz o upload para o Cloudinary
    if foto:
        try:
            upload_result = cloudinary.uploader.upload(foto.file)
            foto_url = upload_result.get("secure_url")
        except Exception as e:
            print(f"Erro no Cloudinary: {e}")

    novo_membro = {
        "nome": nome,
        "unidade": unidade,
        "funcao": funcao,
        "pontos": 0,
        "foto_url": foto_url
    }
    result = await collection.insert_one(novo_membro)
    return {"id": str(result.inserted_id)}

# ROTA: Adicionar Pontos
@app.patch("/membros/{id}/pontos")
async def adicionar_pontos(id: str, valor: int = Form(...)):
    await collection.update_one(
        {"_id": ObjectId(id)},
        {"$inc": {"pontos": valor}}
    )
    return {"status": "pontos atualizados"}

# ROTA: Excluir Membro
@app.delete("/membros/{id}")
async def excluir_membro(id: str):
    await collection.delete_one({"_id": ObjectId(id)})
    return {"status": "membro removido"}

# ROTA: Editar Membro
@app.put("/membros/{id}")
async def editar_membro(
    id: str,
    nome: str = Form(...),
    unidade: str = Form(...),
    funcao: str = Form(...)
):
    await collection.update_one(
        {"_id": ObjectId(id)},
        {"$set": {"nome": nome, "unidade": unidade, "funcao": funcao}}
    )
    return {"status": "atualizado"}
