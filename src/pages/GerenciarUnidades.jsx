import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function NovoMembro() {
  const [nome, setNome] = useState('');
  const [unidade, setUnidade] = useState('');
  const [funcao, setFuncao] = useState('');
  const [arquivo, setArquivo] = useState(null);
  const navigate = useNavigate();

  const API_URL = "https://desbrava-app.onrender.com"; 

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('nome', nome);
    formData.append('unidade', unidade);
    formData.append('funcao', funcao);
    if (arquivo) formData.append('foto', arquivo);

    try {
      const response = await fetch(`${API_URL}/membros`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        alert("✅ Desbravador cadastrado com sucesso!");
        navigate('/dashboard');
      } else {
        alert("❌ Erro ao salvar no servidor.");
      }
    } catch (error) {
      alert("❌ ERRO DE CONEXÃO: Verifique o link do servidor.");
    }
  };

  return (
    <div className="p-8 max-w-md mx-auto bg-white shadow-2xl rounded-[40px] mt-10 border-t-8 border-blue-900 font-sans">
      <h2 className="text-3xl font-black mb-6 text-blue-900 text-center uppercase italic">Novo Desbravador</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" placeholder="NOME" className="w-full border-2 p-4 rounded-2xl font-bold uppercase" onChange={e => setNome(e.target.value)} required />
        <input type="text" placeholder="UNIDADE" className="w-full border-2 p-4 rounded-2xl font-bold uppercase" onChange={e => setUnidade(e.target.value)} required />
        <input type="text" placeholder="FUNÇÃO" className="w-full border-2 p-4 rounded-2xl font-bold uppercase" onChange={e => setFuncao(e.target.value)} required />
        <input type="file" className="w-full border-2 p-4 rounded-2xl bg-gray-50 text-xs font-bold" onChange={e => setArquivo(e.target.files[0])} />
        <div className="flex gap-4 pt-4">
          <button type="submit" className="flex-1 bg-blue-900 text-white py-4 rounded-2xl font-black uppercase shadow-lg">SALVAR</button>
          <button type="button" onClick={() => navigate('/dashboard')} className="flex-1 bg-gray-200 text-gray-700 py-4 rounded-2xl font-black uppercase">CANCELAR</button>
        </div>
      </form>
    </div>
  );
}
