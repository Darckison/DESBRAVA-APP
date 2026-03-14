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

  // Estados para controle do Swipe Mobile
  const [touchStartX, setTouchStartX] = useState(0);
  const [menuAbertoId, setMenuAbertoId] = useState(null);

  const API_URL = "https://desbrava-app.onrender.com";

  const carregarMembros = () => {
    fetch(`${API_URL}/membros`)
      .then(res => res.json())
      .then(data => setMembros(Array.isArray(data) ? data : []))
      .catch(err => console.error("Erro ao carregar membros:", err));
  };

  useEffect(() => carregarMembros(), []);

  // --- FUNÇÕES DE TOQUE (SWIPE) PARA MOBILE ---
  const handleTouchStart = (e) => {
    setTouchStartX(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e, id) => {
    const touchCurrentX = e.targetTouches[0].clientX;
    const distance = touchStartX - touchCurrentX;

    // Se arrastar mais de 50px para a esquerda, abre o menu
    if (distance > 70) {
      setMenuAbertoId(id);
    } 
    // Se arrastar para a direita, fecha o menu
    else if (distance < -50) {
      setMenuAbertoId(null);
    }
  };

  const deletarMembro = async (id) => {
    if (window.confirm("Deseja realmente excluir este desbravador?")) {
      try {
        const res = await fetch(`${API_URL}/membros/${id}`, {
          method: 'DELETE',
        });
        if (res.ok) {
          carregarMembros();
          setMenuAbertoId(null); // Fecha o menu após excluir
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
        setMenuAbertoId(null); // Fecha o menu mobile
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
    setMenuAbertoId(null); // Fecha o menu mobile antes de editar
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
    <div className="p-2 md:p-8 max-w-7xl mx-auto bg-gray-50 min-h-screen font-sans text-gray-800 overflow-x-hidden">
      
      {/* MODAL DE HISTÓRICO (FLUTUANTE) */}
      {historicoAberto && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] w-full max-w-md shadow-2xl overflow-hidden border-4 border-green-800">
            <div className="bg-green-800 p-6 text-white flex justify-between items-center">
              <div>
                <h3 className="font-black uppercase italic leading-none">Histórico de Pontos</h3>
                <p className="text-[10px] opacity-70 mt-1 uppercase font-bold">{historicoAberto.nome}</p>
              </div>
              <button onClick={() => setHistoricoAberto(null)} className="bg-white/20 hover:bg-white/30 w-8 h-8 rounded-full font-black text-sm transition-all">✕</button>
            </div>
            <div className="p-6 max-h-[400px] overflow-y-auto">
              {!historicoAberto.historico_pontos || historicoAberto.historico_pontos.length === 0 ? (
                <p className="text-center text-gray-400 font-bold py-10 uppercase text-xs tracking-widest">Nenhum registro encontrado</p>
              ) : (
                <div className="space-y-4">
                  {[...historicoAberto.historico_pontos].reverse().map((h, i) => (
                    <div key={i} className="flex justify-between items-center p-3 bg-gray-50 rounded-2xl border-l-4 border-yellow-500 shadow-sm">
                      <div className="flex-1 pr-4">
                        <p className="text-[10px] font-black uppercase text-green-900 leading-none mb-1">{h.motivo}</p>
                        <p className="text-[8px] text-gray-400 font-bold uppercase">{h.data}</p>
                      </div>
                      <div className="bg-green-800 text-white px-3 py-1 rounded-lg font-black text-xs">
                        +{h.valor}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* CABEÇALHO CLARO */}
      <div className="bg-white p-6 rounded-[32px] shadow-lg mb-8 text-center border-t-8 border-green-800 transition-all">
        <h1 className="text-xl md:text-3xl font-black text-green-800 italic uppercase mb-6 tracking-tighter">Clube de desbravadores Ágata (Admin)</h1>
        <div className="flex justify-center gap-4 flex-wrap">
          <button onClick={() => navigate('/admin-unidades')} className="bg-yellow-500 hover:bg-yellow-600 text-green-950 px-6 py-2.5 rounded-2xl font-black shadow-md uppercase text-xs transition-all flex items-center gap-2">🛡️ Gerenciar Unidades</button>
          <button onClick={() => navigate('/')} className="bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-2xl font-black shadow-md uppercase text-xs transition-all">Sair do Sistema</button>
        </div>
      </div>

      {view === 'tabela' ? (
        <>
          <button onClick={() => setView('cadastro')} className="mb-8 w-full md:w-auto bg-green-700 hover:bg-green-800 text-white px-10 py-5 rounded-[25px] font-black shadow-xl uppercase tracking-widest transition-all active:scale-95 text-xs md:text-sm">+ Novo Desbravador</button>

          {/* VISUAL TABLET/DESKTOP MANTIDO */}
          <div className="hidden md:block bg-white rounded-[40px] shadow-2xl overflow-hidden border border-gray-100">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-green-800 text-white uppercase text-xs font-black tracking-widest">
                  <tr>
                    <th className="p-8">Membro / Função</th>
                    <th className="p-8 text-center">Unidade</th>
                    <th className="p-8 text-center">Pontos</th>
                    <th className="p-8 text-center">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {membros.map(m => (
                    <tr key={m._id} className="border-b last:border-0 hover:bg-green-50 transition-colors">
                      <td className="p-6">
                        <div className="flex items-center gap-4">
                          <img src={m.foto_url} className="w-16 h-16 rounded-full object-cover border-4 border-green-100 shadow-sm" alt="foto" onError={(e) => e.target.src = "https://via.placeholder.com/150"} />
                          <div>
                            <p className="font-black text-gray-800 uppercase leading-none mb-1">{m.nome}</p>
                            <p className="text-[10px] font-bold text-gray-400 uppercase italic">{m.funcao}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-6 text-center font-bold text-gray-500 uppercase">{m.unidade}</td>
                      <td className="p-6 text-center">
                        <button onClick={() => setHistoricoAberto(m)} className="bg-green-100 hover:bg-green-200 text-green-800 px-6 py-3 rounded-2xl font-black text-2xl border border-green-200 active:scale-90 transition-all cursor-pointer">{m.pontos}</button>
                      </td>
                      <td className="p-6 text-center">
                        {pontuandoId === m._id ? (
                          <div className="flex flex-col gap-2 bg-yellow-50 p-4 rounded-2xl border-2 border-yellow-400 min-w-[200px]">
                            <input type="number" placeholder="Quantidade" className="p-2 border rounded-lg font-bold" value={inputPontos} onChange={e => setInputPontos(e.target.value)} />
                            <input type="text" placeholder="Motivo" className="p-2 border rounded-lg text-xs" value={inputMotivo} onChange={e => setInputMotivo(e.target.value)} />
                            <div className="flex gap-2">
                              <button onClick={() => salvarPontos(m._id)} className="bg-green-600 text-white flex-1 py-1 rounded-lg font-black uppercase text-[10px]">OK</button>
                              <button onClick={() => setPontuandoId('')} className="bg-red-500 text-white px-2 rounded-lg font-black">✕</button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex justify-center gap-2">
                            <button onClick={() => setPontuandoId(m._id)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-black shadow-md text-[10px] uppercase transition-all active:scale-95">⭐ Pontuar</button>
                            <button onClick={() => abrirEdicao(m)} className="bg-amber-400 hover:bg-amber-500 text-white p-2.5 rounded-xl shadow-md transition-all active:scale-95">✏️</button>
                            <button onClick={() => deletarMembro(m._id)} className="bg-red-600 hover:bg-red-700 text-white p-2.5 rounded-xl shadow-md transition-all active:scale-95">🗑️</button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* VISUAL NOVO MOBILE (LISTA DE CARTÕES COM SWIPE) */}
          <div className="md:hidden space-y-4">
            {membros.map(m => (
              <div 
                key={m._id} 
                className="relative bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden transition-all"
                onTouchStart={handleTouchStart}
                onTouchMove={(e) => handleTouchMove(e, m._id)}
              >
                {/* CONTEÚDO PRINCIPAL DO CARTÃO */}
                <div className={`p-5 flex items-center justify-between gap-3 transition-transform duration-300 ease-out ${menuAbertoId === m._id ? '-translate-x-[160px]' : 'translate-x-0'}`}>
                    <div className="flex items-center gap-3">
                        <img src={m.foto_url} className="w-14 h-14 rounded-full object-cover border-2 border-green-100 shadow-sm" alt="foto" onError={(e) => e.target.src = "https://via.placeholder.com/150"} />
                        <div className="truncate">
                            <p className="font-black text-gray-800 uppercase leading-none mb-1 text-sm truncate">{m.nome}</p>
                            <p className="text-[9px] font-bold text-gray-400 uppercase italic truncate">{m.funcao} • {m.unidade}</p>
                        </div>
                    </div>
                    
                    <button onClick={() => setHistoricoAberto(m)} className="bg-green-100 text-green-800 w-14 h-14 rounded-2xl flex flex-col items-center justify-center font-black text-xl border border-green-200 flex-shrink-0">
                        {m.pontos}
                        <span className="text-[6px] uppercase tracking-widest">PTS</span>
                    </button>
                </div>

                {/* MENU DE AÇÕES QUE APARECE NO SWIPE (LADO ESQUERDO) */}
                <div className={`absolute top-0 right-0 h-full flex items-center gap-2 p-3 bg-gray-100 transition-transform duration-300 ease-out ${menuAbertoId === m._id ? 'translate-x-0' : 'translate-x-full'}`}>
                    <button onClick={() => setPontuandoId(m._id)} className="bg-blue-600 text-white h-16 w-16 rounded-2xl flex flex-col items-center justify-center font-black text-[10px] uppercase shadow-md transition-all active:scale-95">
                        <span className="text-xl">⭐</span>
                        Pontuar
                    </button>
                    <button onClick={() => abrirEdicao(m)} className="bg-amber-400 text-white h-16 w-16 rounded-2xl flex flex-col items-center justify-center font-black transition-all active:scale-95">
                        <span className="text-xl">✏️</span>
                        Editar
                    </button>
                    <button onClick={() => deletarMembro(m._id)} className="bg-red-600 text-white h-16 w-16 rounded-2xl flex flex-col items-center justify-center font-black transition-all active:scale-95">
                        <span className="text-xl">🗑️</span>
                        Excluir
                    </button>
                </div>

                {/* AREA DE PONTUAÇÃO FLUTUANTE NO MOBILE */}
                {pontuandoId === m._id && (
                  <div className="absolute inset-0 bg-yellow-50/95 p-4 z-20 flex flex-col gap-2 border-l-8 border-yellow-400">
                    <input type="number" placeholder="Quantidade" className="p-3 border rounded-xl font-black w-full" value={inputPontos} onChange={e => setInputPontos(e.target.value)} />
                    <input type="text" placeholder="Motivo" className="p-3 border rounded-xl text-xs w-full" value={inputMotivo} onChange={e => setInputMotivo(e.target.value)} />
                    <div className="flex gap-2">
                        <button onClick={() => salvarPontos(m._id)} className="bg-green-600 text-white flex-1 py-3 rounded-xl font-black uppercase text-xs">Confirmar</button>
                        <button onClick={() => setPontuandoId('')} className="bg-red-500 text-white px-4 rounded-xl font-black">✕</button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="bg-white p-6 md:p-10 rounded-[35px] md:rounded-[50px] shadow-2xl border-4 border-green-800 mb-10 animate-in fade-in zoom-in duration-300">
          <h2 className="text-xl md:text-3xl font-black mb-10 text-green-800 uppercase italic tracking-tight">
            {view === 'cadastro' ? 'Novo Desbravador' : 'Editar Informações'}
          </h2>
          <form onSubmit={handleSalvar} className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
             <input type="text" placeholder="NOME COMPLETO" className="border-2 p-4 md:p-5 rounded-2xl font-black outline-none focus:border-green-600 uppercase text-sm md:text-base transition-all" value={nome} onChange={e => setNome(e.target.value)} required />
             <input type="text" placeholder="UNIDADE" className="border-2 p-4 md:p-5 rounded-2xl font-black outline-none focus:border-green-600 uppercase text-sm md:text-base transition-all" value={unidade} onChange={e => setUnidade(e.target.value)} required />
             <input type="text" placeholder="FUNÇÃO / CARGO" className="border-2 p-4 md:p-5 rounded-2xl font-black outline-none focus:border-green-600 uppercase text-sm md:text-base transition-all" value={funcao} onChange={e => setFuncao(e.target.value)} required />
             <div className="flex flex-col gap-2">
               <label className="text-[10px] font-black text-gray-400 ml-4 tracking-widest uppercase">Foto de Perfil (Opcional)</label>
               <input type="file" className="border-2 p-3.5 rounded-2xl bg-gray-50 font-bold text-xs" onChange={e => setArquivo(e.target.files[0])} />
             </div>
             <div className="md:col-span-2 flex gap-4 mt-6">
                <button disabled={loading} className="bg-green-700 hover:bg-green-800 text-white p-5 md:p-6 rounded-2xl md:rounded-3xl font-black flex-1 shadow-xl uppercase tracking-widest transition-all active:scale-95 disabled:opacity-50 text-xs md:text-base">
                  {loading ? "PROCESSANDO..." : "Salvar Registro"}
                </button>
                <button type="button" onClick={limparFormulario} className="bg-gray-400 hover:bg-gray-500 text-white px-8 md:px-12 rounded-2xl md:rounded-3xl font-black uppercase text-xs md:text-sm transition-all active:scale-95">Cancelar</button>
             </div>
          </form>
        </div>
      )}
    </div>
  );
}
