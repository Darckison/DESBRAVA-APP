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

client = AsyncIOMotorClient("mongodb://localhost:27017")
db = client["desbravadores"]
db_unidades = client["unidades"]

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
        # URL completa para o React encontrar a imagem
        url_foto = f"http://localhost:8000/uploads/{nome_arquivo}"

    novo_membro = {
        "nome": nome, "unidade": unidade, "funcao": funcao,
        "pontos": pontos, "foto_url": url_foto, "historico_pontos": []
    }
    novo = await db.membros.insert_one(novo_membro)
    return {"id": str(novo.inserted_id)}

# NOVA ROTA: Implementação da Edição (PUT)
@app.put("/membros/{id}")
async def editar(
    id: str,
    nome: str = Form(...),
    unidade: str = Form(...),
    funcao: str = Form(...),
    foto: UploadFile = File(None)
):
    # Prepara os dados básicos para atualizar
    update_data = {
        "nome": nome,
        "unidade": unidade,
        "funcao": funcao
    }

    # Se uma nova foto for enviada, processa e atualiza a URL
    if foto:
        nome_arquivo = f"{uuid.uuid4()}_{foto.filename}"
        caminho = os.path.join(IMAGENS_DIR, nome_arquivo)
        with open(caminho, "wb") as buffer:
            shutil.copyfileobj(foto.file, buffer)
        update_data["foto_url"] = f"http://localhost:8000/uploads/{nome_arquivo}"

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
            "$inc": {"pontos": valor}, # Incrementa os pontos
            "$push": {"historico_pontos": {"valor": valor, "motivo": motivo}} # Salva histórico
        }
    )
    return {"message": "Pontos salvos"}

@app.delete("/membros/{id}")
async def remover(id: str):
    await db.membros.delete_one({"_id": ObjectId(id)})
    return {"message": "Removido"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

# --- NOVAS ROTAS PARA AS UNIDADES ---

@app.get("/ranking-unidades")
async def obter_ranking_unidades():
    # 1. Busca todas as unidades cadastradas
    unidades_cursor = db.unidades.find()
    unidades = await unidades_cursor.to_list(length=100)
    
    ranking_final = []

    for unidade in unidades:
        # 2. Para cada unidade, busca os membros dela
        # Importante: o campo "unidade" no Desbravador deve ser igual ao "nome" da Unidade
        membros_cursor = db.desbravadores.find({"unidade": unidade["nome"]})
        membros = await membros_cursor.to_list(length=100)
        
        # 3. Soma os pontos individuais dos membros
        soma_pontos_membros = sum(m.get("points", 0) for m in membros) # Verifique se o campo é 'points' ou 'pontos'
        
        # 4. Monta o objeto com a soma total
        ranking_final.append({
            "nome": unidade["nome"],
            "pontos_base_unidade": unidade.get("pontos_proprios", 0),
            "pontos_dos_membros": soma_pontos_membros,
            "total_geral": unidade.get("pontos_proprios", 0) + soma_pontos_membros,
            "qtd_membros": len(membros)
        })

    # 5. Ordena do maior para o menor
    return sorted(ranking_final, key=lambda x: x['total_geral'], reverse=True)

@app.get("/unidade/{nome_unidade}/membros")
async def listar_membros_da_unidade(nome_unidade: str):
    # Busca apenas os desbravadores daquela unidade específica
    membros_cursor = db.desbravadores.find({"unidade": nome_unidade})
    membros = await membros_cursor.to_list(length=100)
    
    # Converte o ID do MongoDB para string para o React não dar erro
    for m in membros:
        m["_id"] = str(m["_id"])
        
    return membros

