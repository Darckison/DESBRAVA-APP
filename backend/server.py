import os
import cloudinary
import cloudinary.uploader
from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId

app = FastAPI()

# --- LIBERAÇÃO DE CONEXÃO (CORS) ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- CONFIGURAÇÃO CLOUDINARY ---
cloudinary.config( 
  cloud_name = "dkuqdscin", 
  api_key = "723664166637722", 
  api_secret = "lB5BVenoLxnyx9Vx3KfPrQEKL5I",
  secure = True
)

# --- CONEXÃO MONGODB ---
uri = "mongodb+srv://tdarckison_user:Clube2026@cluster0.8nvfgfw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
client = AsyncIOMotorClient(uri)
db_principal = client["desbravadores"]
colecao_membros = db_principal["membros"]
db_unidades_banco = client["unidades"]
colecao_unidades = db_unidades_banco["unidades"]

# --- ROTA DE UNIDADES (MODIFICADA COM PROTEÇÃO) ---
@app.post("/unidades")
async def criar_unidade(
    nome: str = Form(...),
    pontos_proprios: int = Form(0),
    logo: UploadFile = File(None)
):
    url_logo = "https://via.placeholder.com/150?text=LOGO"
    
    if logo:
        try:
            # Tenta fazer o upload
            res = cloudinary.uploader.upload(logo.file)
            url_logo = res["secure_url"]
        except Exception as e:
            # Se der erro no Cloudinary, avisa o log mas NÃO trava o salvamento
            print(f"ERRO CLOUDINARY UNIDADES: {e}")
            url_logo = "https://via.placeholder.com/150?text=ERRO+FOTO"

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

# --- ROTA DE MEMBROS (MODIFICADA COM PROTEÇÃO) ---
@app.post("/membros")
async def criar_membro(
    nome: str = Form(...),
    unidade: str = Form(...),
    funcao: str = Form(...),
    foto: UploadFile = File(None)
):
    url_foto = "https://via.placeholder.com/150"
    
    if foto:
        try:
            res = cloudinary.uploader.upload(foto.file)
            url_foto = res["secure_url"]
        except Exception as e:
            print(f"ERRO CLOUDINARY MEMBROS: {e}")
            url_foto = "https://via.placeholder.com/150?text=ERRO+FOTO"

    await colecao_membros.insert_one({
        "nome": nome, 
        "unidade": unidade, 
        "funcao": funcao,
        "foto_url": url_foto, 
        "pontos": 0, 
        "historico_pontos": []
    })
    return {"status": "sucesso", "url": url_foto}

# --- ROTAS DE LISTAGEM ---
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
    return ranking

@app.get("/membros")
async def listar_membros():
    membros = await colecao_membros.find().sort("pontos", -1).to_list(100)
    for m in membros: m["_id"] = str(m["_id"])
    return membros

@app.delete("/unidades/{nome}")
async def deletar_unidade(nome: str):
    await colecao_unidades.delete_one({"nome": nome.upper().strip()})
    return {"message": "Removido"}

@app.patch("/membros/{id}/pontos")
async def adicionar_pontos(id: str, valor: int = Form(...), motivo: str = Form(...)):
    await colecao_membros.update_one({"_id": ObjectId(id)}, {"$inc": {"pontos": valor}})
    return {"message": "ok"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

