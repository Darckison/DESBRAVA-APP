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

# --- CONEXÃO COM O MONGODB -
client = AsyncIOMotorClient("mongodb+srv://tdarckison_user:1234@cluster0.8nvfgfw.mongodb.net/?retryWrites=true&w=majority")

# BANCO 1: 'desbravadores'
db_principal = client["desbravadores"]
# Verifique no Atlas: se a pasta dentro de 'desbravadores' se chamar 'membros', use:
colecao_membros = db_principal["membros"] 

# BANCO 2: 'unidades'
db_unidades_banco = client["unidades"]
# Na sua imagem, a pasta dentro do banco 'unidades' também se chama 'unidades'
colecao_unidades = db_unidades_banco["unidades"]
#-------------------------------------------------------------------------------------
# --- ROTAS DE MEMBROS (MANTIDAS) ---

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
    url_foto = f"https://desbrava-app.onrender.com/uploads/{nome_arquivo}"
    if foto:
        nome_arquivo = f"{uuid.uuid4()}_{foto.filename}"
        caminho = os.path.join(IMAGENS_DIR, nome_arquivo)
        with open(caminho, "wb") as buffer:
            shutil.copyfileobj(foto.file, buffer)
        # No Render, idealmente usar a URL do projeto, mas mantendo seu padrão:
        url_foto = f"/uploads/{nome_arquivo}"

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
    update_data = {"nome": nome, "unidade": unidade, "funcao": funcao}

    if foto:
        nome_arquivo = f"{uuid.uuid4()}_{foto.filename}"
        caminho = os.path.join(IMAGENS_DIR, nome_arquivo)
        with open(caminho, "wb") as buffer:
            shutil.copyfileobj(foto.file, buffer)
        update_data["foto_url"] = f"/uploads/{nome_arquivo}"

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

# --- NOVAS ROTAS PARA AS UNIDADES (CORRIGIDAS) ---

@app.get("/ranking-unidades")
async def obter_ranking_unidades():
    # 1. Busca no banco db_unidades e na coleção unidades
    unidades_cursor = db_unidades.unidades.find()
    unidades_lista = await unidades_cursor.to_list(length=100)
    
    ranking_final = []

    for unidade in unidades_lista:
        # 2. Busca membros no banco 'desbravadores' (db) na coleção 'membros'
        # O campo 'unidade' no membro deve ser IGUAL ao 'nome' da unidade
        membros_cursor = db.membros.find({"unidade": unidade["nome"]})
        membros_m = await membros_cursor.to_list(length=100)
        
        # 3. Soma os pontos individuais dos membros (campo 'pontos')
        soma_pontos_membros = sum(m.get("pontos", 0) for m in membros_m)
        
        # 4. Monta o objeto com a soma total
        ranking_final.append({
            "nome": unidade["nome"],
            "pontos_unidade": unidade.get("pontos_proprios", 0),
            "pontos_membros": soma_pontos_membros,
            "total": unidade.get("pontos_proprios", 0) + soma_pontos_membros,
            "total_membros": len(membros_m)
        })

    # 5. Ordena do maior para o menor total
    return sorted(ranking_final, key=lambda x: x['total'], reverse=True)

@app.get("/unidade/{nome_unidade}/membros")
async def listar_membros_da_unidade(nome_unidade: str):
    # Busca na coleção 'membros' do banco 'desbravadores' (db)
    membros_cursor = db.membros.find({"unidade": nome_unidade})
    membros_m = await membros_cursor.to_list(length=100)
    
    for m in membros_m:
        m["_id"] = str(m["_id"])
        
    return membros_m

# ROTA PARA ADICIONAR PONTOS DIRETO NA UNIDADE (OPCIONAL)
@app.patch("/unidades/{nome}/pontos")
async def adicionar_pontos_unidade(nome: str, valor: int = Form(...)):
    await db_unidades.unidades.update_one(
        {"nome": nome},
        {"$inc": {"pontos_proprios": valor}}
    )
    return {"message": "Pontos da unidade atualizados"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)



