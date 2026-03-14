import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function GerenciarUnidades() {
  const [nome, setNome] = useState('');
  const [pontos, setPontos] = useState(0);
  const [arquivo, setArquivo] = useState(null);
  const [unidades, setUnidades] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mostrandoForm, setMostrandoForm] = useState(false);
  
  // Estados para Pontuação de Unidade
  const [pontuandoNome, setPontuandoNome] = useState('');
  const [inputPontos, setInputPontos] = useState('');
  const [inputMotivo, setInputMotivo] = useState('');

  const navigate = useNavigate();
  const API_URL = "https://desbrava-app.onrender.com";

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

    const data = new FormData();
    data.append('nome', nome.toUpperCase());
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
        alert("✅ Unidade salva com sucesso!");
        setNome('');
        setPontos(0);
        setArquivo(null);
        setMostrandoForm(false);
        carregarUnidades();
      }
    } catch (error) {
      alert("❌ Erro de conexão.");
    } finally {
      setLoading(false);
    }
  };

  const salvarPontosUnidade = async (nomeUnidade) => {
    if (!inputPontos || !inputMotivo) {
      alert("Preencha quantidade e motivo!");
      return;
    }

    const data = new FormData();
    data.append('valor', inputPontos);
    data.append('motivo', inputMotivo);

    try {
      // Usando a rota de pontos própria da unidade (certifique-se que existe no server.py)
      const res = await fetch(`${API_URL}/unidades/${nomeUnidade}/pontos`, {
        method: 'PATCH',
        body: data
      });

      if (res.ok) {
        setPontuandoNome('');
        setInputPontos('');
        setInputMotivo('');
        carregarUnidades();
      }
    } catch (err) {
      alert("Erro ao pontuar unidade.");
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
      <div className="bg-white p-6 rounded-[40px] shadow-lg border-t-8 border-green-800 text-center mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <h1 className="text-2xl font-black text-green-800 italic uppercase tracking-tighter">
          Gerenciar Unidades
        </h1>
        <button 
          onClick={() => navigate('/dashboard')} 
          className="bg-gray-200 text-gray-700 px-6 py-2 rounded-2xl font-black uppercase text-xs hover:bg-gray-300 transition-all"
        >
          VOLTAR
        </button>
      </div>

      {!mostrandoForm && (
        <button 
          onClick={() => setMostrandoForm(true)}
          className="w-full mb-8 bg-green-700 text-white py-5 rounded-[30px] font-black uppercase shadow-xl hover:bg-green-800 transition-all active:scale-95"
        >
          + NOVA UNIDADE
        </button>
      )}

      {mostrandoForm && (
        <form onSubmit={handleSalvar} className="bg-white p-8 rounded-[40px] shadow-2xl border-4 border-green-800 mb-10">
          <div className="space-y-6">
            <h2 className="text-xl font-black text-green-800 uppercase italic">Cadastrar Unidade</h2>
            <input type="text" placeholder="NOME DA UNIDADE" value={nome} onChange={(e) => setNome(e.target.value)} className="w-full border-2 p-4 rounded-2xl font-black uppercase outline-none focus:border-green-600" required />
            <input type="number" placeholder="PONTOS INICIAIS" value={pontos} onChange={(e) => setPontos(e.target.value)} className="w-full border-2 p-4 rounded-2xl font-black outline-none focus:border-green-600" />
            <div className="bg-gray-50 p-4 rounded-2xl border-2 border-dashed border-gray-300">
              <input type="file" accept="image/*" onChange={(e) => setArquivo(e.target.files[0])} className="text-xs font-bold w-full" />
            </div>
            <div className="flex gap-4">
              <button type="submit" disabled={loading} className="flex-1 bg-green-700 text-white py-5 rounded-2xl font-black uppercase shadow-xl">{loading ? "SALVANDO..." : "SALVAR"}</button>
              <button type="button" onClick={() => setMostrandoForm(false)} className="flex-1 bg-red-100 text-red-600 py-5 rounded-2xl font-black uppercase text-xs">CANCELAR</button>
            </div>
          </div>
        </form>
      )}

      {/* LISTA DE UNIDADES COM AÇÕES */}
      <div className="space-y-4">
        <h2 className="text-center font-black text-gray-400 uppercase text-xs tracking-widest mb-2">Unidades no Banco</h2>
        {unidades.map((u, i) => (
          <div key={i} className="bg-white p-4 rounded-[35px] shadow-lg border-2 border-gray-100 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <img 
                  src={u.logo_url} 
                  className="w-14 h-14 rounded
