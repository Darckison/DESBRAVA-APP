import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const NovoMembro = () => {
  const [nome, setNome] = useState('');
  const [unidade, setUnidade] = useState('');
  const [funcao, setFuncao] = useState('');
  const [fotoUrl, setFotoUrl] = useState('');
  const navigate = useNavigate();

  const API_URL = "https://desbrava-app-1.onrender.com";

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/membros/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          nome, 
          unidade, 
          funcao, 
          foto_url: fotoUrl || "https://via.placeholder.com/150",
          status: 'Ativo' 
        })
      });

      if (response.ok) {
        alert("Desbravador cadastrado com sucesso!");
        navigate('/dashboard');
      } else {
        alert("Erro ao salvar no servidor!");
      }
    } catch (error) {
      alert("Erro ao conectar com o servidor!");
    }
  };

  return (
    <div className="p-8 max-w-md mx-auto bg-white shadow-2xl rounded-[40px] mt-10 border-t-8 border-blue-900 font-sans text-gray-800">
      <h2 className="text-3xl font-black mb-6 text-blue-900 text-center uppercase italic">Novo Desbravador</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 font-bold mb-1">Nome Completo</label>
          <input type="text" className="w-full border-2 p-3 rounded-xl outline-none uppercase font-bold" placeholder="Ex: João Silva" onChange={(e) => setNome(e.target.value)} required />
        </div>
        <div>
          <label className="block text-gray-700 font-bold mb-1">Unidade</label>
          <input type="text" className="w-full border-2 p-3 rounded-xl outline-none uppercase font-bold" placeholder="Ex: Águia" onChange={(e) => setUnidade(e.target.value)} required />
        </div>
        <div>
          <label className="block text-gray-700 font-bold mb-1">Função</label>
          <input type="text" className="w-full border-2 p-3 rounded-xl outline-none uppercase font-bold" placeholder="Ex: Capitão" onChange={(e) => setFuncao(e.target.value)} required />
        </div>
        <div>
          <label className="block text-gray-700 font-bold mb-1">Link da Foto (URL)</label>
          <input type="text" className="w-full border-2 p-3 rounded-xl outline-none" placeholder="Cole o link da imagem aqui" onChange={(e) => setFotoUrl(e.target.value)} />
        </div>
        <div className="flex gap-4 pt-4">
          <button type="submit" className="flex-1 bg-blue-900 text-white py-4 rounded-2xl font-black uppercase shadow-lg">Salvar</button>
          <button type="button" onClick={() => navigate('/dashboard')} className="flex-1 bg-gray-200 text-gray-700 py-4 rounded-2xl font-black uppercase">Cancelar</button>
        </div>
      </form>
    </div>
  );
};

export default NovoMembro;
