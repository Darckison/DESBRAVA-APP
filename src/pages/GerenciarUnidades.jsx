import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const GerenciarUnidades = () => {
  const [nome, setNome] = useState('');
  const [pontosProprios, setPontosProprios] = useState(0);
  const [logoUrl, setLogoUrl] = useState('');
  const [unidades, setUnidades] = useState([]);
  const navigate = useNavigate();

  const API_URL = "https://desbrava-app-1.onrender.com";

  // Carrega as unidades existentes para você ver embaixo
  const carregarUnidades = async () => {
    try {
      const response = await fetch(`${API_URL}/ranking-unidades`);
      const data = await response.json();
      setUnidades(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Erro ao carregar unidades");
    }
  };

  useEffect(() => {
    carregarUnidades();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // MESMA LÓGICA DO NOVO MEMBRO: ENVIA JSON COM A URL
      const response = await fetch(`${API_URL}/unidades/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          nome: nome.toUpperCase(), 
          pontos_proprios: parseInt(pontosProprios), 
          logo_url: logoUrl || "https://via.placeholder.com/150" 
        })
      });

      if (response.ok) {
        alert("Unidade cadastrada com sucesso!");
        setNome('');
        setPontosProprios(0);
        setLogoUrl('');
        carregarUnidades(); // Atualiza a lista
      }
    } catch (error) {
      alert("Erro ao conectar com o servidor!");
    }
  };

  return (
    <div className="p-8 max-w-md mx-auto bg-white shadow-2xl rounded-2xl mt-10 border-t-8 border-green-800">
      <h2 className="text-3xl font-extrabold mb-6 text-green-900 text-center">Gerenciar Unidades</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 font-bold mb-1">Nome da Unidade</label>
          <input
            type="text"
            className="w-full border-2 p-3 rounded-lg focus:border-green-500 outline-none transition"
            placeholder="Ex: ÁGATA / ÔNIX"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-bold mb-1">Pontos Iniciais (Extras)</label>
          <input
            type="number"
            className="w-full border-2 p-3 rounded-lg focus:border-green-500 outline-none transition"
            value={pontosProprios}
            onChange={(e) => setPontosProprios(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-gray-700 font-bold mb-1">Link da Logo (URL do Cloudinary)</label>
          <input
            type="text"
            className="w-full border-2 p-3 rounded-lg focus:border-green-500 outline-none transition"
            placeholder="Cole o link da foto aqui"
            value={logoUrl}
            onChange={(e) => setLogoUrl(e.target.value)}
          />
        </div>

        <div className="flex gap-4 pt-4">
          <button type="submit" className="flex-1 bg-green-800 text-white py-3 rounded-xl font-bold hover:bg-green-700 shadow-lg transition uppercase">
            Salvar Unidade
          </button>
          <button 
            type="button" 
            onClick={() => navigate('/dashboard')} 
            className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-300 transition uppercase"
          >
            Voltar
          </button>
        </div>
      </form>

      {/* Lista rápida apenas para conferência */}
      <div className="mt-10">
        <h3 className="font-bold text-gray-500 mb-4 border-b pb-2 uppercase text-xs tracking-widest">Unidades Cadastradas</h3>
        <div className="space-y-2">
          {unidades.map((u, i) => (
            <div key={i} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border">
              <div className="flex items-center gap-3">
                <img src={u.logo_url} className="w-10 h-10 rounded-full object-cover border" alt="logo" />
                <span className="font-bold text-gray-700">{u.nome}</span>
              </div>
              <span className="text-xs font-black text-green-700">{u.total} PTS</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GerenciarUnidades;
