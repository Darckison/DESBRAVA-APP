import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [membros, setMembros] = useState([]);
  const [view, setView] = useState('tabela'); 
  const [pontuandoId, setPontuandoId] = useState('');
  const [membroParaEditar, setMembroParaEditar] = useState(null);
  const [loading, setLoading] = useState(false);
  const [historicoAberto, setHistoricoAberto] = useState(null);
  
  const [menuLateralAberto, setMenuLateralAberto] = useState(false);

  const [nome, setNome] = useState('');
  const [unidade, setUnidade] = useState('');
  const [funcao, setFuncao] = useState('');
  const [arquivo, setArquivo] = useState(null);
  const [inputPontos, setInputPontos] = useState('');
  const [inputMotivo, setInputMotivo] = useState('');

  const API_URL = "https://desbrava-app.onrender.com";

  const carregarMembros = () => {
    fetch(`${API_URL}/membros`)
      .then(res => res.json())
      .then(data => setMembros(Array.isArray(data) ? data : []))
      .catch(err => console.error("Erro ao carregar membros:", err));
  };

  useEffect(() => carregarMembros(), []);

  const deletarMembro = async (id) => {
    if (window.confirm("Deseja realmente excluir este desbravador?")) {
      try {
        const res = await fetch(`${API_URL}/membros/${id}`, { method: 'DELETE' });
        if (res.ok) carregarMembros();
      } catch (err) { alert("Erro de conexão ao excluir."); }
    }
  };

  const handleSalvar = async (e) => {
    e.preventDefault();
    setLoading(true);
    const data = new FormData();
    data.append('nome', nome);
    data.append('unidade', unidade);
    data.append('funcao', funcao);
    if (arquivo) data.append('foto', arquivo);

    const isEdicao = view === 'edicao';
    const method = isEdicao ? 'PUT' : 'POST';
    const url = isEdicao ? `${API_URL}/membros/${membroParaEditar._id}` : `${API_URL}/membros`;
    
    try {
      const res = await fetch(url, { method: method, body: data });
      if (res.ok) {
        alert(isEdicao ? "✅ Cadastro atualizado!" : "✅ Novo desbravador salvo!");
        limparFormulario();
        carregarMembros();
      }
    } catch (err) { alert("❌ ERRO DE CONEXÃO."); }
    finally { setLoading(false); }
  };

  const salvarPontos = async (id) => {
    if (!inputPontos || !inputMotivo) {
      alert("Preencha a quantidade e o motivo!");
      return;
    }
    const data = new FormData();
    data.append('valor', inputPontos);
    data.append('motivo', inputMotivo);
    
    try {
      const res = await fetch(`${API_URL}/membros/${id}/pontos`, { method: 'PATCH', body: data });
      if (res.ok) {
        setPontuandoId(''); setInputPontos(''); setInputMotivo('');
        carregarMembros();
      }
    } catch (err) { alert("Erro ao salvar pontos."); }
  };

  const abrirEdicao = (m) => {
    setMembroParaEditar(m); setNome(m.nome); setUnidade(m.unidade); setFuncao(m.funcao);
    setView('edicao');
  };

  const limparFormulario = () => {
    setNome(''); setUnidade(''); setFuncao(''); setArquivo(null); setView('tabela'); setMembroParaEditar(null);
    setMenuLateralAberto(false);
  };

  return (
    // COR DE FUNDO AJUSTADA PARA VERDE QUE COMBINA
    <div className="relative min-h-screen bg-[#f1f5f2] font-sans text-gray-800">
      
      {/* CABEÇALHO COM TÍTULO E SUBTÍTULO AO LADO DO BOTÃO */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-white shadow-md p-4 flex items-center gap-4 border-b-4 border-green-800">
          <button 
            onClick={() => setMenuLateralAberto(true)}
            className="bg-green-800 text-white p-3 rounded-xl shadow-lg active:scale-95 transition-all flex-shrink-0"
          >
            <div className="space-y-1.5">
              <div className="w-6 h-1 bg-white rounded-full"></div>
              <div className="w-6 h-1 bg-white rounded-full"></div>
              <div className="w-6 h-1 bg-white rounded-full"></div>
            </div>
          </button>

          <div>
              <h1 className="text-xl md:text-2xl font-black text-green-800 uppercase italic leading-none tracking-tighter">Clube Ágata</h1>
