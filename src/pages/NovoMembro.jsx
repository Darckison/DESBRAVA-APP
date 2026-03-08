import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const NovoMembro = () => {
  const [nome, setNome] = useState('');
  const [unidade, setUnidade] = useState('');
  const [funcao, setFuncao] = useState('');
  const [arquivo, setArquivo] = useState(null); // Estado para o arquivo do PC
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Use o link do seu servidor (ajuste se for o que tem o -1)
  const API_URL = "https://desbrava-app.onrender.com";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // LÓGICA DO FORM DATA: Prepara o pacote com o arquivo para o servidor
    const formData = new FormData();
    formData.append('nome', nome);
    formData.append('unidade', unidade);
    formData.append('funcao', funcao);
    
    // Se você selecionou uma foto no PC, ela entra no pacote
    if (arquivo) {
      formData.append('foto', arquivo);
    }

    try {
      const response = await fetch(`${API_URL}/membros`, {
        method: 'POST',
        body: formData, // Envia o arquivo e os textos juntos
      });

      if (response.ok) {
        alert("Desbravador cadastrado e foto salva no Cloudinary!");
        navigate('/dashboard');
      } else {
        alert("Erro ao salvar no servidor. Verifique os campos.");
      }
    } catch (error) {
      alert("Erro de conexão com o servidor!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-md mx-auto bg-white shadow-2xl rounded-[40px] mt-10 border-t-8 border-blue-900 font-sans">
      <h2 className="text-3xl font-black mb-6 text-blue-900 text-center uppercase italic tracking-tighter">
        Novo Desbravador
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 font-bold mb-1 ml-2">Nome Completo</label>
          <input
            type="text"
            className="w-full border-2 p-3 rounded-2xl outline-none focus:border-blue-500 font-bold uppercase"
            placeholder="Ex: João Silva"
            onChange={(e) => setNome(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-bold mb-1 ml-2">Unidade</label>
          <input
            type="text"
            className="w-full border-2 p-3 rounded-2xl outline-none focus:border-blue-500 font-bold uppercase"
            placeholder="Ex: Águia"
            onChange={(e) => setUnidade(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-bold mb-1 ml-2">Função</label>
          <input
            type="text"
            className="w-full border-2 p-3 rounded-2xl outline-none focus:border-blue-500 font-bold uppercase"
            placeholder="Ex: Capitão"
            onChange={(e) => setFuncao(e.target.value)}
            required
          />
        </div>

        <div className="bg-gray-50 p-4 rounded-2xl border-2 border-dashed border-gray-300">
          <label className="block text-xs font-black text-gray-400 mb-2 uppercase">Selecione a foto no seu PC</label>
          <input
            type="file"
            accept="image/*"
            className="text-xs font-bold w-full"
            onChange={(e) => setArquivo(e.target.files[0])} // Captura o arquivo
          />
        </div>

        <div className="flex gap-4 pt-4">
          <button 
            type="submit" 
            disabled={loading}
            className="flex-1 bg-blue-900 text-white py-4 rounded-2xl font-black uppercase shadow-lg hover:bg-blue-800 transition-all active:scale-95"
          >
            {loading ? "SALVANDO..." : "Salvar Registro"}
          </button>
          <button 
            type="button" 
            onClick={() => navigate('/dashboard')} 
            className="flex-1 bg-gray-200 text-gray-700 py-4 rounded-2xl font-black uppercase"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default NovoMembro;
