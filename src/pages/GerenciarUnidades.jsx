import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function GerenciarUnidades() {
  const [nome, setNome] = useState('');
  const [pontos, setPontos] = useState(0);
  const [arquivo, setArquivo] = useState(null);
  const [unidades, setUnidades] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // URL DO SEU SERVIDOR NO RENDER (CONFIRMADO)
  const API_URL = "https://desbrava-app.onrender.com";

  // Busca as unidades cadastradas no banco
  const carregarUnidades = async () => {
    try {
      const res = await fetch(`${API_URL}/ranking-unidades`);
      const data = await res.json();
      setUnidades(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Erro ao carregar unidades:", error);
    }
  };

  useEffect(() => {
    carregarUnidades();
  }, []);

  const handleSalvar = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Prepara o formulário para enviar o arquivo do PC
    const data = new FormData();
    data.append('nome', nome.toUpperCase());
    data.append('pontos_proprios', pontos);
    if (arquivo) {
      data.append('logo', arquivo);
    }

    try {
      const response = await fetch(`${API_URL}/unidades`, {
        method: 'POST',
        body: data, // O servidor recebe o arquivo e manda pro Cloudinary
      });

      if (response.ok) {
        alert("✅ Unidade e Logo salvas com sucesso!");
        setNome('');
        setPontos(0);
        setArquivo(null);
        carregarUnidades(); // Atualiza a lista embaixo
      } else {
        alert("❌ Erro no servidor ao salvar.");
      }
    } catch (error) {
      alert("❌ ERRO DE CONEXÃO: Verifique se o link do servidor está certo.");
    } finally {
      setLoading(false);
    }
  };

  const deletarUnidade = async (nomeUnidade) => {
    if (window.confirm(`Deseja excluir a unidade ${nomeUnidade}?`)) {
      try {
        await fetch(`${API_URL}/unidades/${nomeUnidade}`, { method: 'DELETE' });
        carregarUnidades();
      } catch (error) {
        alert("Erro ao deletar.");
      }
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-2xl mx-auto bg-gray-50 min-h-screen font-sans">
      
      {/* CABEÇALHO */}
      <div className="bg-white p-8 rounded-[40px] shadow-2xl border-t-8 border-green-800 text-center mb-10">
        <h1 className="text-3xl font-black text-green-800 italic uppercase tracking-tighter">
          Gerenciar Unidades
        </h1>
      </div>

      {/* FORMULÁRIO DE CADASTRO */}
      <form onSubmit={handleSalvar} className="bg-white p-10 rounded-[40px] shadow-2xl border-4 border-green-800 mb-10">
        <div className="space-y-6">
          <div>
            <label className="block text-xs font-black text-gray-400 mb-2 uppercase ml-2">Nome da Unidade</label>
            <input
              type="text"
              placeholder="EX: ÔNIX / ÁGATA"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="w-full border-2 p-4 rounded-2xl font-black uppercase outline-none focus:border-green-600"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-black text-gray-400 mb-2 uppercase ml-2">Pontos Iniciais (da Unidade)</label>
            <input
              type="number"
              placeholder="0"
              value={pontos}
              onChange={(e) => setPontos(e.target.value)}
              className="w-full border-2 p-4 rounded-2xl font-black outline-none focus:border-green-600"
            />
          </div>
          
          <div className="bg-gray-50 p-4 rounded-2xl border-2 border-dashed border-gray-300">
            <label className="block text-xs font-black text-gray-400 mb-2 uppercase">Logo da Unidade (Arquivo do PC)</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setArquivo(e.target.files[0])}
              className="text-xs font-bold w-full"
            />
          </div>

          <div className="flex gap-4">
            <button 
              type="submit"
              disabled={loading}
              className="flex-1 bg-green-700 text-white py-5 rounded-2xl font-black uppercase shadow-xl hover:bg-green-800 transition-all active:scale-95"
            >
              {loading ? "SALVANDO..." : "SALVAR UNIDADE"}
            </button>
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="flex-1 bg-gray-300 text-gray-700 py-5 rounded-2xl font-black uppercase text-xs"
            >
              VOLTAR
            </button>
          </div>
        </div>
      </form>

      {/* LISTA DE UNIDADES REGISTRADAS */}
      <div className="space-y-4">
        <h2 className="text-center font-black text-gray-400 uppercase text-xs tracking-widest mb-2">Unidades no Banco</h2>
        {unidades.map((u, i) => (
          <div key={i} className="bg-white p-5 rounded-[30px] shadow-lg flex items-center justify-between border-2 border-gray-100">
            <div className="flex items-center gap-5">
              <img 
                src={u.logo_url} 
                className="w-16 h-16 rounded-full object-cover border-4 border-green-100 shadow-sm" 
                alt="logo"
                onError={(e) => { e.target.src = "https://via.placeholder.com/100?text=LOGO"; }}
              />
              <span className="font-black uppercase text-xl text-gray-800 italic">{u.nome}</span>
            </div>
            <button 
              onClick={() => deletarUnidade(u.nome)}
              className="bg-red-500 text-white p-4 rounded-2xl shadow-md hover:bg-red-600 transition-colors"
            >
              🗑️
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
