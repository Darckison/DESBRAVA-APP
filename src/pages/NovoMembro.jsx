import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const NovoMembro = () => {
  const [nome, setNome] = useState('');
  const [unidade, setUnidade] = useState('');
  const [funcao, setFuncao] = useState('');
  const [fotoUrl, setFotoUrl] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://127.0.0.1:8000/membros', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          nome, 
          unidade, 
          funcao, 
          foto_url: fotoUrl || "https://via.placeholder.com/150", // Foto padrão se estiver vazio
          status: 'Ativo' 
        })
      });

      if (response.ok) {
        alert("Desbravador cadastrado com sucesso!");
        navigate('/dashboard');
      }
    } catch (error) {
      alert("Erro ao conectar com o servidor!");
    }
  };

  return (
    <div className="p-8 max-w-md mx-auto bg-white shadow-2xl rounded-2xl mt-10 border-t-8 border-blue-900">
      <h2 className="text-3xl font-extrabold mb-6 text-blue-900 text-center">Novo Desbravador</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 font-bold mb-1">Nome Completo</label>
          <input
            type="text"
            className="w-full border-2 p-3 rounded-lg focus:border-blue-500 outline-none transition"
            placeholder="Ex: João Silva"
            onChange={(e) => setNome(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-bold mb-1">Unidade</label>
          <input
            type="text"
            className="w-full border-2 p-3 rounded-lg focus:border-blue-500 outline-none transition"
            placeholder="Ex: Águia / Sentinela"
            onChange={(e) => setUnidade(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-bold mb-1">Função</label>
          <input
            type="text"
            className="w-full border-2 p-3 rounded-lg focus:border-blue-500 outline-none transition"
            placeholder="Ex: Capitão / Conselheiro"
            onChange={(e) => setFuncao(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-bold mb-1">Link da Foto (URL)</label>
          <input
            type="text"
            className="w-full border-2 p-3 rounded-lg focus:border-blue-500 outline-none transition"
            placeholder="Cole o link da imagem aqui"
            onChange={(e) => setFotoUrl(e.target.value)}
          />
        </div>

        <div className="flex gap-4 pt-4">
          <button type="submit" className="flex-1 bg-blue-900 text-white py-3 rounded-xl font-bold hover:bg-blue-800 shadow-lg transition">
            Salvar Registro
          </button>
          <button 
            type="button" 
            onClick={() => navigate('/dashboard')} 
            className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-300 transition"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default NovoMembro;