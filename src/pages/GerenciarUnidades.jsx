import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function GerenciarUnidades() {
  const [nome, setNome] = useState('');
  const [pontos, setPontos] = useState(0);
  const [arquivo, setArquivo] = useState(null);
  const [unidades, setUnidades] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // MUITO IMPORTANTE: Verifique se este link abre no seu navegador
  const API_URL = "https://desbrava-app-1.onrender.com"; 

  const carregarUnidades = async () => {
    try {
      const res = await fetch(`${API_URL}/ranking-unidades`);
      const data = await res.json();
      setUnidades(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Erro ao carregar lista:", error);
    }
  };

  useEffect(() => { carregarUnidades(); }, []);

  const handleSalvar = async (e) => {
    e.preventDefault();
    console.log("Botão clicado! Iniciando envio..."); // Isso aparece no F12
    setLoading(true);

    const data = new FormData();
    data.append('nome', nome);
    data.append('pontos_proprios', pontos);
    if (arquivo) {
      data.append('logo', arquivo);
    }

    try {
      const response = await fetch(`${API_URL}/unidades`, {
        method: 'POST',
        body: data,
      });

      if (response.ok) {
        alert("✅ SUCESSO! Unidade salva.");
        setNome('');
        setPontos(0);
        setArquivo(null);
        carregarUnidades();
      } else {
        const txtErro = await response.text();
        alert("❌ ERRO NO SERVIDOR: " + txtErro);
      }
    } catch (error) {
      console.error("Erro na conexão:", error);
      alert("❌ ERRO DE CONEXÃO: Verifique se o link do servidor está certo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-2xl mx-auto bg-gray-50 min-h-screen font-sans">
      <div className="bg-white p-8 rounded-[40px] shadow-2xl border-t-8 border-green-800 text-center mb-10">
        <h1 className="text-3xl font-black text-green-800 italic uppercase">Gerenciar Unidades</h1>
      </div>

      <form onSubmit={handleSalvar} className="bg-white p-10 rounded-[40px] shadow-2xl border-4 border-green-800 mb-10">
        <div className="space-y-6">
          <input 
            type="text" 
            placeholder="NOME DA UNIDADE" 
            value={nome} 
            onChange={e => setNome(e.target.value)} 
            className="w-full border-2 p-4 rounded-2xl font-black uppercase outline-none focus:border-green-600" 
            required 
          />
          <input 
            type="number" 
            placeholder="PONTOS EXTRAS" 
            value={pontos} 
            onChange={e => setPontos(e.target.value)} 
            className="w-full border-2 p-4 rounded-2xl font-black" 
          />
          <div className="bg-gray-50 p-4 rounded-2xl border-2 border-dashed border-gray-300">
            <input 
              type="file" 
              onChange={e => setArquivo(e.target.files[0])} 
              className="text-xs font-bold w-full" 
            />
          </div>
          <div className="flex gap-4">
            <button 
              type="submit"
              disabled={loading}
              className="flex-1 bg-green-700 text-white py-5 rounded-2xl font-black uppercase shadow-xl hover:bg-green-800"
            >
              {loading ? "SALVANDO..." : "SALVAR AGORA"}
            </button>
            <button type="button" onClick={() => navigate('/dashboard')} className="flex-1 bg-gray-300 text-gray-700 py-5 rounded-2xl font-black uppercase text-xs">VOLTAR</button>
          </div>
        </div>
      </form>

      {/* Lista para conferir se salvou */}
      <div className="space-y-4">
        {unidades.map((u, i) => (
          <div key={i} className="bg-white p-4 rounded-[30px] shadow flex items-center justify-between border">
            <div className="flex items-center gap-4">
              <img src={u.logo_url} className="w-12 h-12 rounded-full object-cover border-2 border-green-100" />
              <span className="font-black uppercase text-gray-700">{u.nome}</span>
            </div>
            <button 
                onClick={async () => { if(window.confirm('Excluir?')) { await fetch(`${API_URL}/unidades/${u.nome}`, {method: 'DELETE'}); carregarUnidades(); } }}
                className="text-red-500 font-bold"
            >🗑️</button>
          </div>
        ))}
      </div>
    </div>
  );
}
