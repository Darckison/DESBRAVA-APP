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

# --- CONFIGURAÇÃO DO CLOUDINARY ---
# Usando as chaves que você já tem configuradas no seu ambiente
cloudinary.config( 
  cloud_name = "dihv9y0o8", 
  api_key = "499596956247957", 
  api_secret = "mZ9uU0N6y9mX3R7u0vRz2F0fXkM",
  secure = True
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Conexão MongoDB
uri = "mongodb+srv://tdarckison_user:Clube2026@cluster0.8nvfgfw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
client = AsyncIOMotorClient(uri)
db_principal = client["desbravadores"]
colecao_membros = db_principal["membros"]
db_unidades_banco = client["unidades"]
colecao_unidades = db_unidades_banco["unidades"]

# --- ROTAS DE MEMBROS (IDÊNTICAS AO QUE VOCÊ JÁ TEM) ---

@app.get("/membros")
async def listar():
    membros = await colecao_membros.find().sort("pontos", -1).to_list(100)
    for m in membros: m["_id"] = str(m["_id"])
    return membros

@app.post("/membros")
async def criar(nome: str = Form(...), unidade: str = Form(...), funcao: str = Form(...), pontos: int = Form(0), foto: UploadFile = File(None)):
    url_foto = "https://placehold.co/400?text=SEM+FOTO"
    if foto:
        res = cloudinary.uploader.upload(foto.file)
        url_foto = res["secure_url"]
    novo = await colecao_membros.insert_one({"nome": nome, "unidade": unidade, "funcao": funcao, "pontos": pontos, "foto_url": url_foto, "historico_pontos": []})
    return {"id": str(novo.inserted_id)}

@app.patch("/membros/{id}/pontos")
async def adicionar_pontos(id: str, valor: int = Form(...), motivo: str = Form(...)):
    await colecao_membros.update_one({"_id": ObjectId(id)}, {"$inc": {"pontos": valor}, "$push": {"historico_pontos": {"valor": valor, "motivo": motivo}}})
    return {"message": "Pontos salvos"}

@app.delete("/membros/{id}")
async def remover(id: str):
    await colecao_membros.delete_one({"_id": ObjectId(id)})
    return {"message": "Removido"}

# --- ROTAS DE UNIDADES (CORRIGIDAS PARA USAR A MESMA LÓGICA) ---

@app.post("/unidades")
async def criar_unidade(nome: str = Form(...), pontos_proprios: int = Form(0), logo: UploadFile = File(None)):
    url_final = "https://placehold.co/200?text=SEM+LOGO"
    if logo:
        # AQUI É O SEGREDO: Pegamos o link do Cloudinary igual fazemos nos membros
        res = cloudinary.uploader.upload(logo.file)
        url_final = res["secure_url"] # Isso salva o link completo https://...
        
    await colecao_unidades.update_one(
        {"nome": nome.upper().strip()},
        {"$set": {
            "nome": nome.upper().strip(), 
            "pontos_proprios": int(pontos_proprios), 
            "logo_url": url_final # Agora o banco salva o link certo!
        }},
        upsert=True
    )
    return {"status": "sucesso", "url": url_final}

@app.get("/ranking-unidades")
async def obter_ranking_unidades():
    unidades = await colecao_unidades.find().to_list(100)
    ranking_final = []
    for uni in unidades:
        nome_uni = uni["nome"]
        membros_m = await colecao_membros.find({"unidade": {"$regex": f"^{nome_uni}$", "$options": "i"}}).to_list(100)
        soma = sum(m.get("pontos", 0) for m in membros_m)
        ranking_final.append({
            "nome": nome_uni,
            "logo_url": uni.get("logo_url", "https://placehold.co/200"),
            "pontos_unidade": uni.get("pontos_proprios", 0),
            "pontos_membros": soma,
            "total": uni.get("pontos_proprios", 0) + soma,
            "total_membros": len(membros_m)
        })
    return sorted(ranking_final, key=lambda x: x['total'], reverse=True)

@app.get("/unidade/{nome_unidade}/membros")
async def listar_membros_uni(nome_unidade: str):
    membros = await colecao_membros.find({"unidade": {"$regex": f"^{nome_unidade}$", "$options": "i"}}).to_list(100)
    for m in membros: m["_id"] = str(m["_id"])
    return membros

@app.delete("/unidades/{nome}")
async def deletar_unidade(nome: str):
    await colecao_unidades.delete_one({"nome": nome.upper().strip()})
    return {"message": "Unidade removida"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
