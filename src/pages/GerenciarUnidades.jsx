import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [membros, setMembros] = useState([]);
  const [view, setView] = useState('tabela'); 
  const [pontuandoId, setPontuandoId] = useState('');
  const [membroParaEditar, setMembroParaEditar] = useState(null); // Aqui guardamos o objeto para edição
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
      } catch (err) { alert("Erro ao excluir."); }
    }
  };

  // COPIEI A LÓGICA DO "GerenciarUnidades" QUE VOCÊ DISSE QUE FUNCIONA
  const handleSalvar = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const data = new FormData();
    data.append('nome', nome);
    data.append('unidade', unidade);
    data.append('funcao', funcao);
    if (arquivo) data.append('foto', arquivo);

    // IGUAL AO GERENCIAR UNIDADES:
    // Se tem objeto no "membroParaEditar", ele usa o ID dele na URL e método PUT
    const url = membroParaEditar ? `${API_URL}/membros/${membroParaEditar._id}` : `${API_URL}/membros`;
    const method = membroParaEditar ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method: method,
        body: data,
      });

      if (response.ok) {
        alert(membroParaEditar ? "✅ Cadastro atualizado!" : "✅ Novo desbravador salvo!");
        limparFormulario();
        carregarMembros();
      } else {
        alert("❌ Erro ao salvar. Verifique os dados.");
      }
    } catch (error) {
      alert("❌ Erro de conexão.");
    } finally {
      setLoading(false);
    }
  };

  const abrirEdicao = (m) => {
    setMembroParaEditar(m); // Guarda o membro selecionado para pegar o _id depois
    setNome(m.nome);
    setUnidade(m.unidade);
    setFuncao(m.funcao);
    setView('edicao');
    setMenuLateralAberto(false);
  };

  const limparFormulario = () => {
    setNome(''); setUnidade(''); setFuncao(''); setArquivo(null); 
    setView('tabela'); setMembroParaEditar(null);
    setMenuLateralAberto(false);
  };

  // Funções de pontos mantidas
  const salvarPontos = async (id) => {
    if (!inputPontos || !inputMotivo) return alert("Preencha tudo!");
    const data = new FormData();
    data.append('valor', inputPontos);
    data.append('motivo', inputMotivo);
    try {
      const res = await fetch(`${API_URL}/membros/${id}/pontos`, { method: 'PATCH', body: data });
      if (res.ok) { setPontuandoId(''); setInputPontos(''); setInputMotivo(''); carregarMembros(); }
    } catch (err) { alert("Erro ao pontuar."); }
  };

  return (
    <div className="relative min-h-screen bg-[#f1f5f2] font-sans text-gray-800 flex flex-col">
      <header className="fixed top-0 left-0 right-0 z-40 bg-white shadow-md p-4 flex items-center gap-4 border-b-4 border-green-800 h-20">
          <button onClick={() => setMenuLateralAberto(true)} className="bg-green-800 text-white p-3 rounded-xl shadow-lg flex-shrink-0 active:scale-95 transition-all">
            <div className="space-y-1.5"><div className="w-6 h-1 bg-white rounded-full"></div><div className="w-6 h-1 bg-white rounded-full"></div><div className="w-6 h-1 bg-white rounded-full"></div></div>
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

      {/* SIDEBAR */}
      <div className={`fixed inset-y-0 left-0 z-50 w-72 bg-white/70 backdrop-blur-md shadow-2xl transform transition-transform duration-300 ${menuLateralAberto ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 text-center text-green-900 flex flex-col h-full overflow-y-auto">
            <div className="flex justify-end"><button onClick={() => setMenuLateralAberto(false)} className="text-gray-400 text-2xl font-black">✕</button></div>
            <h2 className="text-xl font-black uppercase italic mb-8 mt-2 tracking-tighter">Navegação</h2>
            <div className="flex flex-col gap-4">
                <button onClick={() => { setView('cadastro'); setMenuLateralAberto(false); }} className="bg-green-600 text-white p-4 rounded-2xl font-black uppercase text-xs active:scale-95 shadow-md">+ NOVO DESBRAVADOR</button>
                <button onClick={() => { navigate('/admin-unidades'); setMenuLateralAberto(false); }} className="bg-yellow-50 text-green-950 p-4 rounded-2xl font-black uppercase text-xs hover:bg-yellow-100 shadow-md">🛡️ GERENCIAR UNIDADES</button>
                <button onClick={() => { navigate('/chamada'); setMenuLateralAberto(false); }} className="bg-blue-600 text-white p-4 rounded-2xl font-black uppercase text-xs">📅 FREQUÊNCIA "CHAMADA"</button>
            </div>
            <div className="mt-auto pb-6"><button onClick={() => navigate('/')} className="w-full bg-red-600 text-white p-4 rounded-2xl font-black uppercase text-xs">SAIR</button></div>
        </div>
      </div>

      {menuLateralAberto && <div onClick={() => setMenuLateralAberto(false)} className="fixed inset-0 bg-black/20 z-40"></div>}

      <main className="flex-1 p-2 md:p-8 mt-24 max-w-7xl mx-auto w-full overflow-y-auto">
        {historicoAberto && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <div className="bg-white rounded-[32px] w-full max-w-md shadow-2xl border-4 border-green-800 p-6 animate-in zoom-in-95">
              <div className="flex justify-between items-center mb-4">
                <div><h3 className="font-black uppercase italic text-sm text-green-900">Histórico de Pontos</h3><p className="text-[10px] opacity-70 uppercase font-bold">{historicoAberto.nome}</p></div>
                <button onClick={() => setHistoricoAberto(null)} className="text-gray-400 font-black">✕</button>
              </div>
              <div className="max-h-[400px] overflow-y-auto space-y-4 pr-2">
                {(!historicoAberto.historico_pontos || historicoAberto.historico_pontos.length === 0) ? <p className="text-center text-gray-400 py-10 uppercase text-[10px] font-black">Vazio</p> : 
                  historicoAberto.historico_pontos.map((h, i) => (
                    <div key={i} className="flex justify-between items-center p-3 bg-gray-50 rounded-2xl border-l-4 border-yellow-500 shadow-sm">
                      <div className="flex-1 pr-3"><p className="text-[10px] font-black uppercase text-green-900 leading-none mb-1">{h.motivo}</p><p className="text-[8px] text-gray-400 font-bold">{h.data}</p></div>
                      <div className="bg-green-800 text-white px-3 py-1 rounded-lg font-black text-xs">+{h.valor}</div>
                    </div>
                  ))
                }
              </div>
            </div>
          </div>
        )}

        {view === 'tabela' ? (
          <div className="bg-white rounded-[40px] shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in duration-500">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-green-800 text-white uppercase text-xs font-black tracking-widest">
                  <tr><th className="p-8">Membro / Função</th><th className="p-8 text-center">Unidade</th><th className="p-8 text-center">Pontos</th><th className="p-8 text-center">Ações</th></tr>
                </thead>
                <tbody>
                  {membros.map(m => (
                    <tr key={m._id} className="border-b last:border-0 hover:bg-green-50 transition-colors">
                      <td className="p-6">
                        <div className="flex items-center gap-4">
                          <img src={m.foto_url && m.foto_url !== "" ? m.foto_url : FOTO_PADRAO} className="w-16 h-16 rounded-full object-cover border-4 border-green-100 shadow-sm" alt="" onError={(e) => { e.target.src = FOTO_PADRAO; }} />
                          <div><p className="font-black text-gray-800 uppercase text-sm md:text-base leading-none mb-1">{m.nome}</p><p className="text-[10px] font-bold text-gray-400 uppercase italic tracking-wider">{m.funcao}</p></div>
                        </div>
                      </td>
                      <td className="p-6 text-center font-bold text-gray-500 uppercase">{m.unidade}</td>
                      <td className="p-6 text-center"><button onClick={() => setHistoricoAberto(m)} className="bg-green-100 text-green-800 px-6 py-3 rounded-2xl font-black text-2xl border border-green-200 active:scale-90">{m.pontos}</button></td>
                      <td className="p-6 text-center">
                        {pontuandoId === m._id ? (
                          <div className="flex flex-col gap-2 bg-yellow-50 p-4 rounded-2xl border-2 border-yellow-400 min-w-[200px]">
                            <input type="number" placeholder="Qtd" className="p-2 border rounded-lg font-bold" value={inputPontos} onChange={e => setInputPontos(e.target.value)} />
                            <input type="text" placeholder="Motivo" className="p-2 border rounded-lg text-xs" value={inputMotivo} onChange={e => setInputMotivo(e.target.value)} />
                            <div className="flex gap-2"><button onClick={() => salvarPontos(m._id)} className="bg-green-600 text-white flex-1 py-1 rounded-lg font-black text-[10px]">OK</button><button onClick={() => setPontuandoId('')} className="bg-red-500 text-white px-2 rounded-lg font-black">✕</button></div>
                          </div>
                        ) : (
                          <div className="flex justify-center gap-2">
                            <button onClick={() => setPontuandoId(m._id)} className="bg-blue-600 text-white px-4 py-2 rounded-xl font-black text-[10px] uppercase active:scale-95 shadow-md">⭐ Pontuar</button>
                            <button onClick={() => abrirEdicao(m)} className="bg-amber-400 text-white p-2.5 rounded-xl active:scale-95 shadow-md transition-colors hover:bg-amber-500">✏️</button>
                            <button onClick={() => deletarMembro(m._id)} className="bg-red-600 text-white p-2.5 rounded-xl active:scale-95 shadow-md transition-colors">🗑️</button>
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
          <div className="bg-white p-8 md:p-10 rounded-[40px] shadow-2xl border-4 border-green-800 mb-10 animate-in zoom-in-95 duration-300">
            <h2 className="text-2xl font-black mb-8 text-green-800 uppercase italic tracking-tight">{membroParaEditar ? 'Editar Informações' : 'Novo Desbravador'}</h2>
            <form onSubmit={handleSalvar} className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <input type="text" placeholder="NOME COMPLETO" className="border-2 p-4 rounded-2xl font-black uppercase outline-none focus:border-green-600" value={nome} onChange={e => setNome(e.target.value)} required />
               <input type="text" placeholder="UNIDADE" className="border-2 p-4 rounded-2xl font-black uppercase outline-none focus:border-green-600" value={unidade} onChange={e => setUnidade(e.target.value)} required />
               <input type="text" placeholder="FUNÇÃO" className="border-2 p-4 rounded-2xl font-black uppercase outline-none focus:border-green-600" value={funcao} onChange={e => setFuncao(e.target.value)} required />
               <div className="flex flex-col gap-2"><label className="text-[10px] font-black text-gray-400 uppercase ml-4">Foto</label><input type="file" className="border-2 p-3 rounded-2xl bg-gray-50 text-xs font-bold" onChange={e => setArquivo(e.target.files[0])} /></div>
               <div className="md:col-span-2 flex gap-4 mt-4 border-t pt-6">
                  <button type="submit" disabled={loading} className="bg-green-700 text-white p-5 rounded-2xl font-black flex-1 shadow-xl uppercase transition-all active:scale-95 hover:bg-green-800">
                    {loading ? "PROCESSANDO..." : "Salvar Registro"}
                  </button>
                  <button type="button" onClick={limparFormulario} className="bg-gray-400 text-white px-10 rounded-2xl font-black uppercase transition-all hover:bg-gray-500">
                    Cancelar
                  </button>
               </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
