import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Chamada() {
  const navigate = useNavigate();
  const [membros, setMembros] = useState([]);
  const [presencas, setPresencas] = useState({});
  const [historico, setHistorico] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mostrarLista, setMostrarLista] = useState(false);
  const [chamadaSelecionada, setChamadaSelecionada] = useState(null);

  const API_URL = "https://desbrava-app.onrender.com";
  const hoje = new Date().toLocaleDateString('pt-BR');

  const carregarDados = () => {
    fetch(`${API_URL}/membros`)
      .then(res => res.json())
      .then(data => {
        setMembros(data);
        const inicial = {};
        data.forEach(m => inicial[m._id] = 'P');
        setPresencas(inicial);
      });

    fetch(`${API_URL}/chamada-historico`)
      .then(res => res.json())
      .then(data => setHistorico(data));
  };

  useEffect(() => carregarDados(), []);

  const alternarPresenca = (id, status) => {
    setPresencas(prev => ({ ...prev, [id]: status }));
  };

  const salvarChamada = async () => {
    setLoading(true);
    const listaFinal = membros.map(m => ({
      nome: m.nome,
      foto: m.foto_url,
      status: presencas[m._id],
      unidade: m.unidade
    }));

    try {
      const res = await fetch(`${API_URL}/chamada`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: hoje, lista: listaFinal })
      });
      if (res.ok) {
        alert("✅ Chamada de hoje salva com sucesso!");
        setMostrarLista(false);
        carregarDados();
      }
    } catch (err) {
      alert("Erro ao salvar.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans text-gray-800 p-3 md:p-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* COLUNA PRINCIPAL - CHAMADA (LARGURA 8/12) */}
        <div className="lg:col-span-8 space-y-6">
          {!mostrarLista ? (
            <div className="bg-white p-12 rounded-[50px] shadow-2xl text-center border-2 border-green-100 flex flex-col items-center justify-center min-h-[400px] transition-all hover:border-green-300">
               <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center text-4xl mb-6 shadow-inner">📋</div>
               <h2 className="text-3xl md:text-4xl font-black text-green-900 uppercase italic tracking-tighter mb-2">Frequência</h2>
               <p className="text-gray-400 font-bold uppercase text-[10px] tracking-[0.3em] mb-8">Gestão de Presença Diária</p>
               <button 
                onClick={() => setMostrarLista(true)}
                className="group relative bg-green-600 hover:bg-green-700 text-white px-12 py-5 rounded-[25px] font-black uppercase tracking-widest shadow-[0_15px_30px_rgba(22,101,52,0.2)] transition-all active:scale-95 overflow-hidden"
               >
                 <span className="relative z-10">📝 Iniciar Chamada de Hoje</span>
                 <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform"></div>
               </button>
            </div>
          ) : (
            <div className="bg-white rounded-[50px] shadow-[0_30px_60px_rgba(0,0,0,0.1)] overflow-hidden border border-gray-100 animate-in fade-in zoom-in duration-500">
              <div className="bg-gradient-to-r from-green-800 to-green-900 p-8 text-white flex justify-between items-end">
                <div>
                  <h2 className="text-2xl md:text-3xl font-black uppercase italic leading-none tracking-tighter">Chamada do Dia</h2>
                  <p className="text-[11px] font-black text-yellow-400 uppercase mt-2 tracking-widest opacity-90">{hoje}</p>
                </div>
                <button onClick={() => setMostrarLista(false)} className="bg-white/10 hover:bg-red-500/20 px-5 py-2.5 rounded-2xl font-black text-[10px] uppercase transition-all border border-white/10">Cancelar</button>
              </div>

              <div className="p-6 space-y-3 max-h-[600px] overflow-y-auto custom-scrollbar bg-gray-50/50">
                {membros.map(m => (
                  <div key={m._id} className="group flex items-center justify-between p-4 bg-white rounded-[30px] shadow-sm border border-gray-100 transition-all hover:shadow-md hover:scale-[1.01]">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <img src={m.foto_url} className="w-14 h-14 rounded-full object-cover border-4 border-gray-50 shadow-md group-hover:border-green-100 transition-all" alt="" onError={(e) => e.target.src = "https://via.placeholder.com/150"} />
                        <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white shadow-sm ${presencas[m._id] === 'P' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      </div>
                      <div className="truncate">
                        <p className="font-black text-sm md:text-base uppercase leading-none text-gray-800">{m.nome.split(' ')[0]}</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter mt-1">{m.unidade}</p>
                      </div>
                    </div>

                    <div className="flex bg-gray-100 p-1.5 rounded-[20px] gap-1">
                      <button 
                        onClick={() => alternarPresenca(m._id, 'P')}
                        className={`px-5 py-2.5 rounded-2xl text-[10px] font-black transition-all ${presencas[m._id] === 'P' ? 'bg-green-600 text-white shadow-lg shadow-green-900/20' : 'text-gray-400 hover:text-gray-600'}`}
                      >P</button>
                      <button 
                        onClick={() => alternarPresenca(m._id, 'F')}
                        className={`px-5 py-2.5 rounded-2xl text-[10px] font-black transition-all ${presencas[m._id] === 'F' ? 'bg-red-600 text-white shadow-lg shadow-red-900/20' : 'text-gray-400 hover:text-gray-600'}`}
                      >F</button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-8 bg-white border-t border-gray-50">
                <button 
                  onClick={salvarChamada}
                  disabled={loading}
                  className="w-full bg-green-800 hover:bg-black text-white py-5 rounded-[25px] font-black uppercase tracking-[0.2em] shadow-2xl active:scale-95 transition-all text-sm disabled:opacity-50"
                >
                  {loading ? "PROCESSANDO..." : "CONCLUIR CHAMADA"}
                </button>
              </div>
            </div>
          )}

          {/* DETALHES DO RELATÓRIO SELECIONADO */}
          {chamadaSelecionada && (
            <div className="bg-white p-8 rounded-[50px] shadow-2xl border-t-[12px] border-blue-600 animate-in slide-in-from-top-6 duration-500">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h3 className="font-black text-blue-900 uppercase italic text-xl tracking-tighter">Relatório Geral</h3>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">{chamadaSelecionada.data}</p>
                </div>
                <button onClick={() => setChamadaSelecionada(null)} className="bg-gray-100 hover:bg-gray-200 text-gray-400 w-10 h-10 rounded-full font-black flex items-center justify-center transition-all">✕</button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {chamadaSelecionada.lista.map((item, idx) => (
                  <div key={idx} className={`p-3 rounded-3xl border-2 flex items-center gap-3 transition-all ${item.status === 'P' ? 'bg-green-50/50 border-green-100' : 'bg-red-50/50 border-red-100'}`}>
                    <img src={item.foto} className="w-8 h-8 rounded-full object-cover shadow-sm" alt="" />
                    <div className="min-w-0">
                       <p className="text-[10px] font-black uppercase truncate text-gray-700">{item.nome.split(' ')[0]}</p>
                       <p className={`text-[8px] font-bold ${item.status === 'P' ? 'text-green-600' : 'text-red-600'}`}>{item.status === 'P' ? 'PRESENTE' : 'FALTA'}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* COLUNA HISTÓRICO (LARGURA 4/12) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-8 rounded-[50px] shadow-2xl border-t-[12px] border-yellow-500 sticky top-28">
            <div className="flex justify-between items-center mb-8">
                <h3 className="font-black text-green-900 uppercase italic text-lg tracking-tighter">Histórico</h3>
                <button onClick={() => navigate('/dashboard')} className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-5 py-2.5 rounded-2xl font-black text-[10px] uppercase transition-all">← Voltar</button>
            </div>
            
            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
              {historico.length === 0 ? (
                <div className="text-center py-16">
                   <p className="text-4xl mb-4 opacity-20">📭</p>
                   <p className="text-[10px] text-gray-300 font-black uppercase tracking-widest">Sem registros</p>
                </div>
              ) : (
                historico.map((h, i) => (
                  <button 
                    key={i} 
                    onClick={() => setChamadaSelecionada(h)}
                    className="w-full p-5 bg-gray-50 hover:bg-white rounded-[30px] border-l-8 border-green-800 flex justify-between items-center transition-all group active:scale-95 shadow-sm hover:shadow-xl hover:-translate-y-1 border border-transparent hover:border-gray-100"
                  >
                    <div className="text-left">
                      <p className="text-sm font-black text-green-950 mb-1 group-hover:text-green-600 transition-colors">{h.data}</p>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{h.lista.length} Membros registrados</p>
                    </div>
                    <div className="bg-white w-10 h-10 rounded-full flex items-center justify-center shadow-md group-hover:bg-green-800 group-hover:text-white transition-all text-xs">👁️</div>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
