import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const GerenciarUnidades = () => {
  const [nome, setNome] = useState('');
  const [pontosProprios, setPontosProprios] = useState(0);
  const [logoUrl, setLogoUrl] = useState('');
  const [unidades, setUnidades] = useState([]);
  const navigate = useNavigate();

  const API_URL = "https://desbrava-app-1.onrender.com";

  const carregarUnidades = async () => {
    try {
      const response = await fetch(`${API_URL}/ranking-unidades`);
      const data = await response.json();
      setUnidades(Array.isArray(data) ? data : []);
    } catch (e) { console.error(e); }
  };

  useEffect(() => { carregarUnidades(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // USANDO A MESMA LÓGICA DE JSON QUE FUNCIONA NO NOVO MEMBRO
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
        setNome(''); setLogoUrl(''); setPontosProprios(0);
        carregarUnidades();
      }
    } catch (error) {
      alert("Erro ao conectar com o servidor!");
    }
  };

  return (
    <div className="p-8 max-w-md mx-auto bg-white shadow-2xl rounded-[40px] mt-10 border-t-8 border-green-800 font-sans text-gray-800">
      <h2 className="text-3xl font-black mb-6 text-green-900 text-center uppercase italic">Gerenciar Unidades</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 font-bold mb-1">Nome da Unidade</label>
          <input type="text" value={nome} className="w-full border-2 p-3 rounded-xl outline-none font-bold uppercase" placeholder="EX: ÁGATA" onChange={(e) => setNome(e.target.value)} required />
        </div>
        <div>
          <label className="block text-gray-700 font-bold mb-1">Pontos Iniciais</label>
          <input type="number" value={pontosProprios} className="w-full border-2 p-3 rounded-xl outline-none font-bold" onChange={(e) => setPontosProprios(e.target.value)} />
        </div>
        <div>
          <label className="block text-gray-700 font-bold mb-1">Link da Logo (URL)</label>
          <input type="text" value={logoUrl} className="w-full border-2 p-3 rounded-xl outline-none" placeholder="Link da foto no Cloudinary" onChange={(e) => setLogoUrl(e.target.value)} />
        </div>
        <div className="flex gap-4 pt-4">
          <button type="submit" className="flex-1 bg-green-800 text-white py-4 rounded-2xl font-black uppercase shadow-lg">Salvar</button>
          <button type="button" onClick={() => navigate('/dashboard')} className="flex-1 bg-gray-200 text-gray-700 py-4 rounded-2xl font-black uppercase">Voltar</button>
        </div>
      </form>
    </div>
  );
};

export default GerenciarUnidades;
