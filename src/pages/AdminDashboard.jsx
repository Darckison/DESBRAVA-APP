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
        const res = await fetch(`${API_URL}/membros/${id}`, {
          method: 'DELETE',
        });
        if (res.ok) {
          carregarMembros();
        } else {
          alert("Erro ao excluir membro no servidor.");
        }
      } catch (err) {
        alert("Erro de conexão ao excluir.");
      }
    }
  };

  const handleSalvar = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    data.append('nome', nome);
    data.append('unidade', unidade);
    data.append('funcao', funcao);
    
    if (arquivo) {
      data.append('foto', arquivo);
    }

    const isEdicao = view === 'edicao';
    const method = isEdicao ? 'PUT' : 'POST';
    const url = isEdicao 
      ? `${API_URL}/membros/${membroParaEditar._id}` 
      : `${API_URL}/membros`;
    
    try {
      const res = await fetch(url, { 
        method: method, 
        body: data 
      });

      if (res.ok) {
        alert(isEdicao ? "✅ Cadastro atualizado!" : "✅ Novo desbravador salvo!");
        limparFormulario();
        carregarMembros();
      } else {
        alert("❌ Erro no servidor ao salvar o membro.");
      }
    } catch (err) {
      alert("❌ ERRO DE CONEXÃO: Verifique o servidor.");
    } finally {
      setLoading(false);
    }
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
      const res = await fetch(`${API_URL}/membros/${id}/pontos`, { 
        method: 'PATCH', 
        body: data 
      });

      if (res.ok) {
        setPontuandoId(''); 
        setInputPontos(''); 
        setInputMotivo(''); 
        carregarMembros();
      } else {
        alert("Erro ao salvar pontos no servidor.");
      }
    } catch (err) {
      alert("Erro de conexão ao salvar pontos.");
    }
  };

  const abrirEdicao = (m) => {
    setMembroParaEditar(m); 
    setNome(m.nome); 
    setUnidade(m.unidade); 
    setFuncao(m.funcao); 
    setView('edicao');
  };

  const limparFormulario = () => {
    setNome(''); 
    setUnidade(''); 
    setFuncao(''); 
    setArquivo(null); 
    setView('tabela');
    setMembroParaEditar(null);
  };

  return (
    <div className="flex min-h-screen bg-gray-100 font-sans text-gray-800 overflow-hidden">
      
      {/* SIDEBAR ESTILO SCORA */}
      <aside className="w-20 md:w-64 bg-[#0a2614] text-white flex flex-col shadow-2xl border-r border-white/5">
        <div className="p-6">
           <h2 className="text-xl md:text-2xl font-black italic text-[#f2c00d] tracking-tighter uppercase leading-none">Ágata</h2>
           <p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] mt-1">Admin Panel</p>
        </div>

        <nav className="flex-1 px-3 space-y-2">
          <button 
            onClick={() => setView('tabela')}
            className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all ${view === 'tabela' ? 'bg-[#f2c00d] text-[#0a2614] shadow-lg shadow-[#f2c00d]/20' : 'hover:bg-white/5 text-white/70'}`}
          >
            <span className="text-xl">📋</span>
            <span className="hidden md:block font-black text-xs uppercase tracking-widest">Dashboard</span>
          </button>

          <button 
            onClick={() => setView('cadastro')}
            className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all ${view === 'cadastro' ? 'bg-[#f2c00d] text-[#0a2614] shadow-lg shadow-[#f2c00d]/20' : 'hover:bg-white/5 text-white/70'}`}
          >
            <span className="text-xl">➕</span>
            <span className="hidden md:block font-black text-xs uppercase tracking-widest">Novo Membro</span>
          </button>

          <button 
            onClick={() => navigate('/admin-unidades')}
            className="w-full flex items-center gap-4 p-4 rounded-2xl text-white/70 hover:bg-white/5 transition-all"
          >
            <span className="text-xl">🛡️</span>
            <span className="hidden md:block font-black text-xs uppercase tracking-widest">Unidades</span>
          </button>
        </nav>

        <div className="p-4 border-t border-white/5">
           <button 
            onClick={() => navigate('/')}
            className="w-full flex items-center gap-4 p-4 rounded-2xl text-red-400 hover:bg-red-400/10 transition-all"
          >
            <span className="text-xl">🚪</span>
            <span className="hidden md:block font-black text-xs uppercase tracking-widest">Sair</span>
          </button>
        </div>
      </aside>

      {/* CONTEÚDO PRINCIPAL */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8 h-screen bg-[#f8fafc]">
        
        {/* MODAL DE HISTÓRICO (FLUTUANTE) */}
        {historicoAberto && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <div className="bg-white rounded-[40px] w-full max-w-md shadow-2xl overflow-hidden border-b-8 border-[#0a2614]">
                <div className="bg-[#0a2614] p-8 text-white flex justify-between items-center">
                <div>
                    <h3 className="font-black uppercase italic leading-none text-xl">Extrato de Pontos</h3>
                    <p className="text-[10px] opacity-50 mt-1 uppercase font-bold tracking-widest">{historicoAberto.nome}</p>
                </div>
                <button onClick={() => setHistoricoAberto(null)} className="bg-white/10 hover:bg-white/20 w-10 h-10 rounded-full font-black text-sm transition-all">✕</button>
                </div>
                <div className="p-8 max-h-[450px] overflow-y-auto bg-gray-50">
                {!historicoAberto.historico_pontos || historicoAberto.historico_pontos.length === 0 ? (
                    <p className="text-center text-gray-400 font-bold py-12 uppercase text-[10px] tracking-widest">Nenhum registro encontrado</p>
                ) : (
                    <div className="space-y-4">
                    {[...historicoAberto.historico_pontos].reverse().map((h, i) => (
                        <div key={i} className="flex justify-between items-center p-5 bg-white rounded-3xl border-l-8 border-[#f2c00d] shadow-sm">
                        <div className="flex-1 pr-4">
                            <p className="text-xs font-black uppercase text-[#0a2614] leading-tight mb-1">{h.motivo}</p>
                            <p className="text-[9px] text-gray-400 font-bold uppercase">{h.data}</p>
                        </div>
                        <div className="bg-[#0a2614] text-[#f2c00d] px-4 py-2 rounded-2xl font-black text-sm">+{h.valor}</div>
                        </div>
                    ))}
                    </div>
                )}
                </div>
            </div>
            </div>
        )}

        {view === 'tabela' ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                <div>
                    <h1 className="text-3xl md:text-5xl font-black text-[#0a2614] uppercase italic tracking-tighter">Membros</h1>
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Controle Geral do Clube</p>
                </div>
            </div>

            <div className="bg-white rounded-[45px] shadow-xl overflow-hidden border border-gray-100">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-[#0a2614] text-white uppercase text-[10px] font-black tracking-[0.2em]">
                    <tr>
                      <th className="p-8">Desbravador</th>
                      <th className="p-8 text-center">Unidade</th>
                      <th className="p-8 text-center">Saldo</th>
                      <th className="p-8 text-center">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {membros.map(m => (
                      <tr key={m._id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors group">
                        <td className="p-6">
                          <div className="flex items-center gap-5">
                            <div className="relative">
                                <img src={m.foto_url} className="w-14 h-14 md:w-20 md:h-20 rounded-full object-cover border-4 border-white shadow-md transition-transform group-hover:scale-105" alt="foto" onError={(e) => e.target.src = "https://via.placeholder.com/150"} />
                                <div className="absolute -bottom-1 -right-1 bg-[#f2c00d] w-6 h-6 rounded-full flex items-center justify-center text-[10px] shadow-md border-2 border-white font-black">★</div>
                            </div>
                            <div>
                              <p className="font-black text-[#0a2614] uppercase text-sm md:text-xl leading-none mb-1">{m.nome}</p>
                              <p className="text-[10px] font-bold text-gray-400 uppercase italic tracking-widest">{m.funcao}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-6 text-center">
                            <span className="px-5 py-2 bg-gray-100 rounded-full text-[10px] font-black text-gray-600 uppercase tracking-widest border border-gray-200">{m.unidade}</span>
                        </td>
                        <td className="p-6 text-center">
                          <button onClick={() => setHistoricoAberto(m)} className="bg-[#0a2614]/5 hover:bg-[#0a2614] text-[#0a2614] hover:text-[#f2c00d] px-6 py-3 rounded-2xl font-black text-xl md:text-3xl transition-all active:scale-90 border-2 border-[#0a2614]/10">{m.pontos}</button>
                        </td>
                        <td className="p-6">
                          {pontuandoId === m._id ? (
                            <div className="flex flex-col gap-2 bg-[#f2c00d]/10 p-5 rounded-[30px] border-2 border-[#f2c00d] min-w-[200px] animate-in zoom-in-95 duration-200">
                              <input type="number" placeholder="Quantidade" className="p-4 border-2 border-white rounded-2xl font-black outline-none focus:border-[#0a2614]" value={inputPontos} onChange={e => setInputPontos(e.target.value)} />
                              <input type="text" placeholder="Motivo da Pontuação" className="p-4 border-2 border-white rounded-2xl text-xs font-bold outline-none focus:border-[#0a2614]" value={inputMotivo} onChange={e => setInputMotivo(e.target.value)} />
                              <div className="flex gap-2">
                                <button onClick={() => salvarPontos(m._id)} className="bg-[#0a2614] text-[#f2c00d] flex-1 py-4 rounded-2xl font-black uppercase text-xs shadow-lg active:scale-95 transition-all">OK</button>
                                <button onClick={() => setPontuandoId('')} className="bg-red-500 text-white px-6 rounded-2xl font-black transition-all hover:bg-red-600 active:scale-95">✕</button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex justify-center gap-3">
                              <button onClick={() => setPontuandoId(m._id)} className="bg-[#0a2614] hover:bg-black text-[#f2c00d] px-6 py-3 rounded-2xl font-black shadow-lg text-[10px] uppercase tracking-widest transition-all active:scale-95">⭐ Pontuar</button>
                              <button onClick={() => abrirEdicao(m)} className="bg-[#f2c00d] hover:brightness-110 text-[#0a2614] p-3 rounded-2xl shadow-md transition-all active:scale-95">✏️</button>
                              <button onClick={() => deletarMembro(m._id)} className="bg-red-500 hover:bg-red-600 text-white p-3 rounded-2xl shadow-md transition-all active:scale-95">🗑️</button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white p-10 rounded-[50px] shadow-2xl border-b-8 border-[#0a2614] animate-in zoom-in-95 duration-300">
            <div className="flex justify-between items-center mb-10">
                <h2 className="text-3xl font-black text-[#0a2614] uppercase italic tracking-tighter">{view === 'cadastro' ? 'Novo Desbravador' : 'Editar Informações'}</h2>
                <button type="button" onClick={limparFormulario} className="text-gray-300 hover:text-red-500 font-black text-2xl transition-all">✕</button>
            </div>
            <form onSubmit={handleSalvar} className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="space-y-2">
                 <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Nome Completo</label>
                 <input type="text" placeholder="NOME DO DESBRAVADOR" className="w-full bg-gray-50 border-2 border-gray-100 p-5 rounded-3xl font-black outline-none focus:border-[#0a2614] transition-all uppercase" value={nome} onChange={e => setNome(e.target.value)} required />
               </div>
               <div className="space-y-2">
                 <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Unidade</label>
                 <input type="text" placeholder="EX: ÔNIX" className="w-full bg-gray-50 border-2 border-gray-100 p-5 rounded-3xl font-black outline-none focus:border-[#0a2614] transition-all uppercase" value={unidade} onChange={e => setUnidade(e.target.value)} required />
               </div>
               <div className="space-y-2">
                 <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Função / Cargo</label>
                 <input type="text" placeholder="EX: CONSELHEIRO" className="w-full bg-gray-50 border-2 border-gray-100 p-5 rounded-3xl font-black outline-none focus:border-[#0a2614] transition-all uppercase" value={funcao} onChange={e => setFuncao(e.target.value)} required />
               </div>
               <div className="space-y-2">
                 <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Foto de Perfil</label>
                 <div className="relative group">
                    <input type="file" className="w-full bg-gray-50 border-2 border-dashed border-gray-200 p-4 rounded-3xl font-bold text-xs cursor-pointer hover:border-[#f2c00d] transition-all" onChange={e => setArquivo(e.target.files[0])} />
                 </div>
               </div>
               <div className="md:col-span-2 flex gap-4 mt-6">
                  <button disabled={loading} className="bg-[#0a2614] hover:bg-black text-[#f2c00d] p-6 rounded-[30px] font-black flex-1 shadow-xl uppercase tracking-[0.2em] transition-all active:scale-95 disabled:opacity-50">
                    {loading ? "PROCESSANDO..." : "Confirmar Registro"}
                  </button>
               </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
