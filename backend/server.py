import os
import cloudinary
import cloudinary.uploader
from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from bson.objectid import ObjectId
from datetime import datetime

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
colecao_presenca = db_principal["presencas"]

# ==========================================
#         ROTAS DE UNIDADES
# ==========================================

@app.post("/unidades")
async def criar_unidade(
    nome: str = Form(...),
    pontos_proprios: int = Form(0),
    logo: UploadFile = File(None)
):
    url_logo = "https://via.placeholder.com/150?text=LOGO"
    if logo:
        try:
            res = cloudinary.uploader.upload(logo.file)
            url_logo = res["secure_url"]
        except Exception as e:
            url_logo = "https://via.placeholder.com/150?text=ERRO+FOTO"

    nome_formatated = nome.upper().strip()
    await colecao_unidades.update_one(
        {"nome": nome_formatated},
        {"$set": {
            "nome": nome_formatated, 
            "pontos_proprios": int(pontos_proprios), 
            "logo_url": url_logo,
            "historico_pontos": [] 
        }},
        upsert=True
    )
    return {"status": "sucesso", "url": url_logo}

# NOVA ROTA: EDITAR UNIDADE (PARA FUNCIONAR O SALVAR DA EDIÇÃO)
@app.put("/unidades/{id}")
async def editar_unidade(
    id: str,
    nome: str = Form(...),
    pontos_proprios: int = Form(0),
    logo: UploadFile = File(None)
):
    dados_update = {
        "nome": nome.upper().strip(),
        "pontos_proprios": int(pontos_proprios)
    }
    
    if logo:
        res = cloudinary.uploader.upload(logo.file)
        dados_update["logo_url"] = res["secure_url"]

    await colecao_unidades.update_one({"_id": ObjectId(id)}, {"$set": dados_update})
    return {"status": "sucesso"}

@app.patch("/unidades/{nome}/pontos")
async def adicionar_pontos_unidade(nome: str, valor: int = Form(...), motivo: str = Form(...)):
    nome_formatated = nome.upper().strip()
    novo_ponto = {
        "valor": valor,
        "motivo": motivo,
        "data": datetime.now().strftime("%d/%m/%Y %H:%M")
    }
    await colecao_unidades.update_one(
        {"nome": nome_formatated},
        {
            "$inc": {"pontos_proprios": valor},
            "$push": {"historico_pontos": novo_ponto}
        }
    )
    return {"message": "ok"}

# ==========================================
#         ROTAS DE MEMBROS
# ==========================================

@app.post("/membros")
async def criar_membro(
    nome: str = Form(...),
    unidade: str = Form(...),
    funcao: str = Form(...),
    foto: UploadFile = File(None)
):
    url_foto = "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"
    if foto:
        try:
            res = cloudinary.uploader.upload(foto.file)
            url_foto = res["secure_url"]
        except:
            pass

    await colecao_membros.insert_one({
        "nome": nome.upper(), 
        "unidade": unidade.upper(), 
        "funcao": funcao.upper(),
        "foto_url": url_foto, 
        "pontos": 0, 
        "historico_pontos": []
    })
    return {"status": "sucesso"}

# ROTA QUE FALTAVA: EDITAR MEMBRO (O MOTIVO DO ERRO 405)
@app.put("/membros/{id}")
async def editar_membro(
    id: str,
    nome: str = Form(...),
    unidade: str = Form(...),
    funcao: str = Form(...),
    foto: UploadFile = File(None)
):
    dados_update = {
        "nome": nome.upper(),
        "unidade": unidade.upper(),
        "funcao": funcao.upper()
    }
    
    if foto:
        try:
            res = cloudinary.uploader.upload(foto.file)
            dados_update["foto_url"] = res["secure_url"]
        except:
            pass

    await colecao_membros.update_one({"_id": ObjectId(id)}, {"$set": dados_update})
    return {"status": "sucesso"}

@app.patch("/membros/{id}/pontos")
async def adicionar_pontos_membro(id: str, valor: int = Form(...), motivo: str = Form(...)):
    novo_ponto = {
        "valor": valor,
        "motivo": motivo,
        "data": datetime.now().strftime("%d/%m/%Y %H:%M")
    }
    await colecao_membros.update_one(
        {"_id": ObjectId(id)},
        {
            "$inc": {"pontos": valor},
            "$push": {"historico_pontos": novo_ponto}
        }
    )
    return {"message": "ok"}

# --- ROTAS DE LISTAGEM ---
@app.get("/ranking-unidades")
async def obter_ranking():
    unidades = await colecao_unidades.find().to_list(100)
    ranking = []
    for uni in unidades:
        nome_uni = uni["nome"]
        membros_m = await colecao_membros.find({"unidade": {"$regex": f"^{nome_uni}$", "$options": "i"}}).to_list(100)
        soma = sum(m.get("pontos", 0) for m in membros_m)
        uni_id = str(uni["_id"])
        ranking.append({
            "_id": uni_id,
            "nome": nome_uni,
            "logo_url": uni.get("logo_url", ""),
            "pontos_unidade": uni.get("pontos_proprios", 0),
            "total": uni.get("pontos_proprios", 0) + soma,
            "historico_pontos": uni.get("historico_pontos", []) 
        })
    return ranking

@app.get("/membros")
async def listar_membros():
    membros = await colecao_membros.find().sort("pontos", -1).to_list(100)
    for m in membros: m["_id"] = str(m["_id"])
    return membros

# --- ROTAS DE DELETE ---

@app.delete("/unidades/{nome}")
async def deletar_unidade(nome: str):
    await colecao_unidades.delete_one({"nome": nome.upper().strip()})
    return {"message": "Removido"}

@app.delete("/membros/{id}")
async def deletar_membro(id: str):
    await colecao_membros.delete_one({"_id": ObjectId(id)})
    return {"status": "sucesso"}

# --- CHAMADA ---

@app.post("/chamada")
async def salvar_chamada(dados: dict):
    await colecao_presenca.update_one(
        {"data": dados["data"]},
        {"$set": dados},
        upsert=True
    )
    return {"status": "sucesso"}

@app.get("/chamada-historico")
async def historico_chamada():
    historico = await colecao_presenca.find().sort("data", -1).to_list(100)
    for h in historico: h["_id"] = str(h["_id"])
    return historico

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
