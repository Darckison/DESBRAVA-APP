import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const NovoMembro = () => {
  const [nome, setNome] = useState('');
  const [unidade, setUnidade] = useState('');
  const [funcao, setFuncao] = useState('');
  const [fotoUrl, setFotoUrl] = useState('');
  const navigate = useNavigate();

  // URL CORRIGIDA (Sem o -1 e com o protocolo correto)
  const API_URL = "https://desbrava-app-1.onrender.com";

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Usando FormData para garantir que o servidor receba os dados como campos de formulário
    const formData = new FormData();
    formData.append('nome', nome);
    formData.append('unidade', unidade);
    formData.append('funcao', funcao);
    // Enviamos o link da foto como texto no campo que o servidor espera
    formData.append('foto_url', fotoUrl || "https://via.placeholder.com/150");

    try {
      const response = await fetch(`${API_URL}/membros`, {
        method: 'POST',
        // Note: Quando usamos FormData, NÃO colocamos o Header de Content-Type manual
        body: formData,
      });

      if (response.ok) {
        alert("Desbravador cadastrado com sucesso!");
        navigate('/dashboard');
      } else {
        const erroTxt = await response.text();
        alert("Erro no servidor: " + erroTxt);
      }
    } catch (error) {
      console.error(error);
      alert("Erro ao conectar com o servidor! Verifique sua internet.");
    }
  };

  return (
    <div className="p-8 max-w-md mx-auto bg-white shadow-2xl rounded-[40px] mt-10 border-t-8 border-blue-900">
      <h2 className="text-3xl font-black mb-6 text-blue-900 text-center uppercase italic">Novo Desbravador</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-[10px] font-black text-gray-400 uppercase ml-2 mb-1">Nome Completo</label>
          <input
            type="text"
            value={nome}
            className="w-full border-2 p-4 rounded-2xl focus:border-blue-500 outline-none font-bold uppercase"
            placeholder="Ex: João Silva"
            onChange={(e) => setNome(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-[10px] font-black text-gray-400 uppercase ml-2 mb-1">Unidade</label>
          <input
            type="text"
            value={unidade}
            className="w-full border-2 p-4 rounded-2xl focus:border-blue-500 outline-none font-bold uppercase"
            placeholder="Ex: Águia"
            onChange={(e) => setUnidade(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-[10px] font-black text-gray-400 uppercase ml-2 mb-1">Função</label>
          <input
            type="text"
            value={funcao}
            className="w-full border-2 p-4 rounded-2xl focus:border-blue-500 outline-none font-bold uppercase"
            placeholder="Ex: Capitão"
            onChange={(e) => setFuncao(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-[10px] font-black text-gray-400 uppercase ml-2 mb-1">Link da Foto (URL)</label>
          <input
            type="text"
            value={fotoUrl}
            className="w-full border-2 p-4 rounded-2xl focus:border-blue-500 outline-none font-bold"
            placeholder="Cole o link da imagem aqui"
            onChange={(e) => setFotoUrl(e.target.value)}
          />
        </div>

        <div className="flex gap-4 pt-4">
          <button type="submit" className="flex-1 bg-blue-900 text-white py-4 rounded-2xl font-black uppercase shadow-lg hover:bg-blue-800 transition-all active:scale-95">
            Salvar Registro
          </button>
          <button 
            type="button" 
            onClick={() => navigate('/dashboard')} 
            className="flex-1 bg-gray-200 text-gray-700 py-4 rounded-2xl font-black uppercase hover:bg-gray-300"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default NovoMembro;

