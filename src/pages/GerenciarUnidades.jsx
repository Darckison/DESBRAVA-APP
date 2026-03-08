import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const GerenciarUnidades = () => {
  const [nome, setNome] = useState('');
  const [pontos, setPontos] = useState(0);
  const [arquivo, setArquivo] = useState(null);
  const [unidades, setUnidades] = useState([]);
  const navigate = useNavigate();

  const API_URL = "https://desbrava-app.onrender.com";

  const carregarUnidades = () => {
    fetch(`${API_URL}/ranking-unidades`).then(res => res.json()).then(setUnidades);
  };

  useEffect(() => carregarUnidades(), []);

  const handleSalvar = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('nome', nome);
    data.append('pontos_proprios', pontos);
    if (arquivo) data.append('logo', arquivo); // Pega o arquivo do PC

    await fetch(`${API_URL}/unidades`, { method: 'POST', body: data });
    
    alert("Unidade e Logo salvas com sucesso!");
    setNome(''); setPontos(0); setArquivo(null);
    carregarUnidades();
  };

  return (
    <div className="p-8 max-w-md mx-auto bg-white shadow-2xl rounded-2xl mt-10 border-t-8 border-green-800">
      <h2 className="text-3xl font-black mb-6 text-green-900 text-center uppercase">Gerenciar Unidades</h2>
      
      <form onSubmit={handleSalvar} className="space-y-4">
        <input type="text" placeholder="NOME DA UNIDADE" className="w-full border-2 p-3 rounded-lg font-bold" value={nome} onChange={e => setNome(e.target.value)} required />
        <input type="number" placeholder="PONTOS EXTRAS" className="w-full border-2 p-3 rounded-lg font-bold" value={pontos} onChange={e => setPontos(e.target.value)} />
        <input type="file" className="w-full border-2 p-3 rounded-lg bg-gray-50 text-xs font-bold" onChange={e => setArquivo(e.target.files[0])} />
        
        <div className="flex gap-4">
          <button type="submit" className="flex-1 bg-green-800 text-white py-3 rounded-xl font-bold uppercase">Salvar</button>
          <button type="button" onClick={() => navigate('/dashboard')} className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-bold uppercase">Voltar</button>
        </div>
      </form>

      <div className="mt-8 space-y-2">
        {unidades.map((u, i) => (
          <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
            <div className="flex items-center gap-3">
              <img src={u.logo_url} className="w-10 h-10 rounded-full object-cover border" alt="logo" />
              <span className="font-bold uppercase text-xs">{u.nome}</span>
            </div>
            <button onClick={async () => { if(window.confirm('Excluir?')) { await fetch(`${API_URL}/unidades/${u.nome}`, {method: 'DELETE'}); carregarUnidades(); } }} className="text-red-500">🗑️</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GerenciarUnidades;
