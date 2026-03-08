import os
import cloudinary
import cloudinary.uploader
from fastapi import FastAPI, UploadFile, File, Form, Body
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId

app = FastAPI()

# --- CONFIGURAÇÃO DE SEGURANÇA (CORS) ---
# Isso libera tanto o seu site oficial quanto os testes locais
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- CONFIGURAÇÃO DO CLOUDINARY ---
cloudinary.config( 
  cloud_name = "dihv9y0o8", 
  api_key = "499596956247957", 
  api_secret = "mZ9uU0N6y9mX3R7u0vRz2F0fXkM",
  secure = True
)

# --- CONEXÃO MONGODB ---
uri = "mongodb+srv://tdarckison_user:Clube2026@cluster0.8nvfgfw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
client = AsyncIOMotorClient(uri)
db_principal = client["desbravadores"]
colecao_membros = db_principal["membros"]
db_unidades_banco = client["unidades"]
colecao_unidades = db_unidades_banco["unidades"]

# --- ROTA DE UNIDADES (CORRIGIDA) ---
@app.post("/unidades")
async def criar_unidade(
    nome: str = Form(...),
    pontos_proprios: int = Form(0),
    logo: UploadFile = File(None)
):
    url_logo = "https://via.placeholder.com/150?text=SEM+LOGO"
    
    if logo:
        # Envia o arquivo do seu PC direto pro Cloudinary
        res = cloudinary.uploader.upload(logo.file)
        url_logo = res["secure_url"]

    nome_formatado = nome.upper().strip()
    
    await colecao_unidades.update_one(
        {"nome": nome_formatado},
        {"$set": {
            "nome": nome_formatado, 
            "pontos_proprios": int(pontos_proprios), 
            "logo_url": url_logo
        }},
        upsert=True
    )
    return {"status": "sucesso", "url": url_logo}

# --- ROTA DE RANKING ---
@app.get("/ranking-unidades")
async def obter_ranking():
    unidades = await colecao_unidades.find().to_list(100)
    ranking = []
    for uni in unidades:
        nome_uni = uni["nome"]
        membros_m = await colecao_membros.find({"unidade": {"$regex": f"^{nome_uni}$", "$options": "i"}}).to_list(100)
        soma = sum(m.get("pontos", 0) for m in membros_m)
        ranking.append({
            "nome": nome_uni,
            "logo_url": uni.get("logo_url", "https://via.placeholder.com/150"),
            "pontos_unidade": uni.get("pontos_proprios", 0),
            "pontos_membros": soma,
            "total": uni.get("pontos_proprios", 0) + soma,
            "total_membros": len(membros_m)
        })
    return sorted(ranking, key=lambda x: x['total'], reverse=True)

# --- OUTRAS ROTAS NECESSÁRIAS ---
@app.get("/membros")
async def listar_membros():
    membros = await colecao_membros.find().sort("pontos", -1).to_list(100)
    for m in membros: m["_id"] = str(m["_id"])
    return membros

@app.delete("/unidades/{nome}")
async def deletar_unidade(nome: str):
    await colecao_unidades.delete_one({"nome": nome.upper().strip()})
    return {"message": "Removido"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
