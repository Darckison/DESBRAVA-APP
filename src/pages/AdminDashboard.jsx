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
  const FOTO_PADRAO = "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y";

  const carregarMembros = () => {
    fetch(`${API_URL}/membros`)
      .then(res => res.json())
      .then(data => setMembros(Array.isArray(data) ? data : []))
      .catch(err => console.error("Erro ao carregar:", err));
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
    data.append('nome', nome.toUpperCase()); 
    data.append('unidade', unidade.toUpperCase());
    data.append('funcao', funcao.toUpperCase());
    if (arquivo) data.append('foto', arquivo);

    const isEdicao = view === 'edicao' && membroParaEditar;
    const url = isEdicao ? `${API_URL}/membros/${membroParaEditar._id}` : `${API_URL}/membros`;
    const method = isEdicao ? 'PATCH' : 'POST'; 
    
    try {
      let res = await fetch(url, { method: method, body: data });

      if (res.status === 405 && isEdicao) {
        res = await fetch(url, { method: 'PUT', body: data });
      }

      if (res.ok) {
        alert(isEdicao ? "✅ Atualizado com sucesso!" : "✅ Salvo com sucesso!");
        limparFormulario();
        carregarMembros();
      } else {
        alert(`❌ Erro ao salvar.`);
      }
    } catch (err) { 
        alert("❌ ERRO DE CONEXÃO."); 
    } finally { 
        setLoading(false); 
    }
  };

  const salvarPontos = async (id) => {
    if (!inputPontos || !inputMotivo) return alert("Preencha tudo!");
    const data = new FormData();
    data.append('valor', inputPontos);
    data.append('motivo', inputMotivo);
    try {
      const res = await fetch(`${API_URL}/membros/${id}/pontos`, { method: 'PATCH', body: data });
      if (res.ok) {
        setPontuandoId(''); setInputPontos(''); setInputMotivo('');
        carregarMembros();
      }
    } catch (err) { alert("Erro ao pontuar."); }
  };

  const abrirEdicao = (m) => {
    setMembroParaEditar(m); setNome(m.nome); setUnidade(m.unidade); setFuncao(m.funcao);
    setView('edicao'); setMenuLateralAberto(false);
  };

  const limparFormulario = () => {
    setNome(''); setUnidade(''); setFuncao(''); setArquivo(null); 
    setView('tabela'); setMembroParaEditar(null); setMenuLateralAberto(false);
  };

  return (
    <div className="relative min-h-screen bg-[#f1f5f2] font-sans text-gray-800 flex flex-col overflow-x-hidden">
      <header className="fixed top-0 left-0 right-0 z-40 bg-white shadow-md p-4 flex items-center gap-4 border-b-4 border-green-800 h-20">
          <button onClick={() => setMenuLateralAberto(true)} className="bg-green-800 text-white p-3 rounded-xl shadow-lg active:scale-95 transition-all flex-shrink-0">
            <div className="space-y-1.5"><div className="w-6 h-1 bg-white"></div><div className="w-6 h-1 bg-white"></div><div className="w-6 h-1 bg-white"></div></div>
          </button>
          <div className="flex items-center gap-4">
              <img src="/logo.png" className="w-10 h-10 object-contain" alt="Logo" />
              <div className="w-[2px] h-10 bg-gray-300 mx-1"></div> 
              <div className="flex flex-col">
                  <h1 className="text-xl md:text-2xl font-black text-green-800 uppercase italic">Clube Ágata</h1>
                  <p className="text-[9px] md:text-[11px] font-bold text-gray-400 uppercase mt-1">Painel Administrativo</p>
              </div>
          </div>
      </header>

      {/* SIDEBAR COM BOTÃO SAIR LÁ EMBAIXO */}
      <div className={`fixed inset-y-0 left-0 z-50 w-72 bg-white/70 backdrop-blur-md shadow-2xl transform transition-transform duration-300 border-r border-white/20 ${menuLateralAberto ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 text-center h-full flex flex-col">
            <div className="flex justify-end"><button onClick={() => setMenuLateralAberto(false)} className="text-gray-400 text-2xl font-black">✕</button></div>
            <h2 className="text-xl font-black uppercase italic mb-8 mt-2">Navegação</h2>
            <div className="flex flex-col gap-4">
                <button onClick={() => { setView('cadastro'); setMenuLateralAberto(false); }} className="bg-green-600 text-white p-4 rounded-2xl font-black uppercase text-xs active:scale-95 shadow-md">+ NOVO DESBRAVADOR</button>
                <button onClick={() => { navigate('/admin-unidades'); setMenuLateralAberto(false); }} className="bg-yellow-50 text-green-950 p-4 rounded-2xl font-black uppercase text-xs shadow-md">🛡️ GERENCIAR UNIDADES</button>
                <button onClick={() => { navigate('/chamada'); setMenuLateralAberto(false); }} className="bg-blue-600 text-white p-4 rounded-2xl font-black uppercase text-xs shadow-md">📅 CHAMADA</button>
            </div>
            
            {/* BOTÃO SAIR NO FINAL DO MENU */}
            <div className="mt-auto pb-6">
                <button onClick={() => navigate('/')} className="w-full bg-red-600 text-white p-4 rounded-2xl font-black uppercase text-xs shadow-md active:scale-95">SAIR</button>
            </div>
        </div>
      </div>

      {menuLateralAberto && <div onClick={() => setMenuLateralAberto(false)} className="fixed inset-0 bg-black/20 z-40"></div>}

      <main className="flex-1 p-2 md:p-8 mt-24 max-w-7xl mx-auto w-full overflow-y-auto">
        {view === 'tabela' ? (
          <div className="bg-white rounded-[40px] shadow-2xl border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-green-800 text-white uppercase text-xs font-black tracking-widest">
                  <tr><th className="p-8">Membro</th><th className="p-8 text-center">Unidade</th><th className="p-8 text-center">Ações</th></tr>
                </thead>
                <tbody>
                  {membros.map(m => (
                    <tr key={m._id} className="border-b last:border-0 hover:bg-green-50 transition-colors">
                      <td className="p-6">
                        <div className="flex items-center gap-4">
                          <img src={m.foto_url || FOTO_PADRAO} className="w-16 h-16 rounded-full object-cover border-4 border-green-100 shadow-sm" alt="" onError={(e) => { e.target.src = FOTO_PADRAO; }} />
                          <div><p className="font-black text-gray-800 uppercase text-sm">{m.nome}</p><p className="text-[10px] font-bold text-gray-400 uppercase italic">{m.funcao}</p></div>
                        </div>
                      </td>
                      <td className="p-6 text-center font-bold text-gray-500 uppercase">{m.unidade}</td>
                      <td className="p-6 text-center">
                        <div className="flex justify-center gap-2">
                          <button onClick={() => setPontuandoId(m._id)} className="bg-blue-600 text-white px-4 py-2 rounded-xl font-black text-[10px] uppercase shadow-md">⭐ Pontuar</button>
                          <button onClick={() => abrirEdicao(m)} className="bg-amber-400 text-white p-2.5 rounded-xl shadow-md transition-all active:scale-95">✏️</button>
                          <button onClick={() => deletarMembro(m._id)} className="bg-red-600 text-white p-2.5 rounded-xl shadow-md">🗑️</button>
                        </div>
                        {pontuandoId === m._id && (
                          <div className="mt-2 flex flex-col gap-2 bg-yellow-50 p-2 rounded-xl border border-yellow-400">
                             <input type="number" placeholder="Qtd" className="p-1 border rounded text-xs" value={inputPontos} onChange={e => setInputPontos(e.target.value)} />
                             <input type="text" placeholder="Motivo" className="p-1 border rounded text-[10px]" value={inputMotivo} onChange={e => setInputMotivo(e.target.value)} />
                             <button onClick={() => salvarPontos(m._id)} className="bg-green-600 text-white py-1 rounded text-[9px] font-black">OK</button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white p-8 md:p-10 rounded-[40px] shadow-2xl border-4 border-green-800 mb-10">
            <h2 className="text-2xl font-black mb-8 text-green-800 uppercase italic tracking-tight">{membroParaEditar ? 'Editar Desbravador' : 'Novo Desbravador'}</h2>
            <form onSubmit={handleSalvar} className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <input type="text" placeholder="NOME COMPLETO" className="border-2 p-4 rounded-2xl font-black uppercase outline-none focus:border-green-600" value={nome} onChange={e => setNome(e.target.value)} required />
               <input type="text" placeholder="UNIDADE" className="border-2 p-4 rounded-2xl font-black uppercase outline-none focus:border-green-600" value={unidade} onChange={e => setUnidade(e.target.value)} required />
               <input type="text" placeholder="FUNÇÃO" className="border-2 p-4 rounded-2xl font-black uppercase outline-none focus:border-green-600" value={funcao} onChange={e => setFuncao(e.target.value)} required />
               <div className="flex flex-col gap-2"><label className="text-[10px] font-black text-gray-400 uppercase">Foto</label><input type="file" className="border-2 p-3 rounded-2xl bg-gray-50 text-xs font-bold" onChange={e => setArquivo(e.target.files[0])} /></div>
               <div className="md:col-span-2 flex gap-4 mt-4">
                  <button type="submit" disabled={loading} className="bg-green-700 text-white p-5 rounded-2xl font-black flex-1 shadow-xl uppercase active:scale-95 transition-all">{loading ? "PROCESSANDO..." : "Salvar Registro"}</button>
                  <button type="button" onClick={limparFormulario} className="bg-gray-400 text-white px-10 rounded-2xl font-black uppercase transition-all">Cancelar</button>
               </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
