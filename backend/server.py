import os
import cloudinary
import cloudinary.uploader
from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId

app = FastAPI()

# --- AQUI ESTÁ O SEGREDO: LIBERAR A CONEXÃO ---
# Isso impede que o erro de conexão aconteça quando você clica em salvar
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configuração do Cloudinary (Automático)
cloudinary.config( 
  cloud_name = "dihv9y0o8", 
  api_key = "499596956247957", 
  api_secret = "mZ9uU0N6y9mX3R7u0vRz2F0fXkM",
  secure = True
)

# Conexão MongoDB
uri = "mongodb+srv://tdarckison_user:Clube2026@cluster0.8nvfgfw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
client = AsyncIOMotorClient(uri)
db_principal = client["desbravadores"]
colecao_membros = db_principal["membros"]
db_unidades_banco = client["unidades"]
colecao_unidades = db_unidades_banco["unidades"]

# --- ROTA DE UNIDADES (CORRIGIDA) ---
# --- ROTA DE UNIDADES (CORRIGIDA) ---
@app.post("/unidades")
async def criar_unidade(
    nome: str = Form(...),
    pontos_proprios: int = Form(0),
    logo: UploadFile = File(None)
):
    url_logo = "https://via.placeholder.com/150?text=LOGO"
    if logo:
        res = cloudinary.uploader.upload(logo.file)
        url_logo = res["secure_url"]

    nome_formatado = nome.upper().strip()
    await colecao_unidades.update_one(
        {"nome": nome_formatado},
        {"$set": {"nome": nome_formatado, "pontos_proprios": int(pontos_proprios), "logo_url": url_logo}},
        upsert=True
    )
    # IMPORTANTE: Retorne um dicionário {}, nunca uma lista [] ou texto solto
    return {"status": "sucesso", "url": url_logo}

# --- ROTA DE RANKING (LIMPA) ---
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
            "total": uni.get("pontos_proprios", 0) + soma
        })
    return ranking # Retorna apenas a lista final

# Outras rotas (Membros e Delete)
@app.post("/membros")
async def criar_membro(
    nome: str = Form(...),
    unidade: str = Form(...),
    funcao: str = Form(...),
    foto: UploadFile = File(None)
):
    url_foto = "https://via.placeholder.com/150"
    if foto:
        res = cloudinary.uploader.upload(foto.file)
        url_foto = res["secure_url"]

    await colecao_membros.insert_one({
        "nome": nome, 
        "unidade": unidade, 
        "funcao": funcao,
        "foto_url": url_foto, 
        "pontos": 0, 
        "historico_pontos": []
    })
    return {"status": "sucesso"}


