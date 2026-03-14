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
    <div className="min-h-screen bg-[#0a2614] font-sans text-gray-800 p-3 md:p-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* COLUNA PRINCIPAL */}
        <div className="lg:col-span-8 space-y-6">
          {!mostrarLista ? (
            <div className="bg-white/10 backdrop-blur-xl p-12 rounded-[50px] shadow-2xl text-center border-2 border-white/20 flex flex-col items-center justify-center min-h-[450px] animate-in fade-in zoom-in duration-500">
               <img src="/logo.png" className="w-32 h-32 mb-8 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]" alt="Logo" />
               <h2 className="text-3xl md:text-5xl font-black text-white uppercase italic tracking-tighter mb-2">Frequência</h2>
               <p className="text-green-400 font-bold uppercase text-[10px] tracking-[0.4em] mb-10 opacity-80">Gestão de Presença Diária</p>
               <button 
                onClick={() => setMostrarLista(true)}
                className="bg-green-500 hover:bg-green-400 text-[#0a2614] px-14 py-6 rounded-[30px] font-black uppercase tracking-widest shadow-[0_10px_30px_rgba(34,197,94,0.4)] transition-all active:scale-95 text-sm"
               >
                 📝 Realizar Chamada de Hoje
               </button>
            </div>
          ) : (
            <div className="bg-white rounded-[50px] shadow-2xl overflow-hidden border border-white/20 animate-in slide-in-from-bottom-6 duration-500">
              
              {/* HEADER DA LISTA COM BOTÃO VOLTAR À ESQUERDA */}
              <div className="bg-gradient-to-r from-green-800 to-[#0a2614] p-8 text-white">
                <div className="flex items-center gap-5 mb-6">
                  {/* BOTÃO VOLTAR À ESQUERDA DA LOGO */}
                  <button 
                    onClick={() => setMostrarLista(false)} 
                    className="bg-white/10 hover:bg-white/20 w-12 h-12 rounded-2xl flex items-center justify-center transition-all group"
                  >
                    <span className="text-2xl group-hover:-translate-x-1 transition-transform">←</span>
                  </button>

                  <img src="/logo.png" className="w-14 h-14 object-contain bg-white rounded-2xl p-1 shadow-xl" alt="Logo" />
                  
                  <div>
                    <h2 className="text-2xl md:text-3xl font-black text-white uppercase italic leading-none tracking-tighter">Clube Ágata</h2>
                    <p className="text-[10px] font-bold text-yellow-400 uppercase tracking-widest opacity-90 mt-1">Painel Administrativo</p>
                  </div>
                </div>
                
                <div className="h-[1px] bg-white/10 w-full mb-4"></div>
                <div className="flex justify-center items-center gap-2 bg-black/20 py-2 rounded-full border border-white/5">
                   <p className="text-[11px] font-black text-white/80 uppercase tracking-widest">Data: {hoje}</p>
                </div>
              </div>

              {/* LISTA DE MEMBROS */}
              <div className="p-6 space-y-4 max-h-[550px] overflow-y-auto custom-scrollbar bg-gray-50/50">
                {membros.map(m => (
                  <div key={m._id} className="flex items-center justify-between p-4 bg-white rounded-[35px] shadow-sm border border-gray-100 transition-all hover:shadow-lg">
                    <div className="flex items-center gap-4">
                      <img src={m.foto_url} className="w-16 h-16 rounded-full object-cover border-4 border-gray-100 shadow-md" alt="" onError={(e) => e.target.src = "https://via.placeholder.com/150"} />
                      <div className="truncate">
                        <p className="font-black text-sm md:text-lg uppercase leading-none text-gray-800 tracking-tighter">{m.nome.split(' ')[0]}</p>
                        <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-1.5">{m.unidade}</p>
                      </div>
                    </div>

                    {/* BOTÕES ESCRITOS PRESENTE E FALTA POR EXTENSO */}
                    <div className="flex bg-gray-100 p-1.5 rounded-[25px] gap-1 shadow-inner border border-gray-200">
                      <button 
                        onClick={() => alternarPresenca(m._id, 'P')}
                        className={`px-4 md:px-7 py-3 rounded-[20px] text-[10px] font-black transition-all ${presencas[m._id] === 'P' ? 'bg-green-600 text-white shadow-lg' : 'text-gray-400 hover:bg-white'}`}
                      >PRESENTE</button>
                      <button 
                        onClick={() => alternarPresenca(m._id, 'F')}
                        className={`px-4 md:px-7 py-3 rounded-[20px] text-[10px] font-black transition-all ${presencas[m._id] === 'F' ? 'bg-red-600 text-white shadow-lg' : 'text-gray-400 hover:bg-white'}`}
                      >FALTA</button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-8 bg-white border-t border-gray-100 text-center">
                <button 
                  onClick={salvarChamada}
                  disabled={loading}
                  className="w-full bg-[#0a2614] hover:bg-black text-white py-6 rounded-[30px] font-black uppercase tracking-[0.3em] shadow-xl active:scale-95 transition-all text-xs"
                >
                  {loading ? "SALVANDO..." : "CONCLUIR FREQUÊNCIA"}
                </button>
              </div>
            </div>
          )}

          {/* RELATÓRIO DO HISTÓRICO */}
          {chamadaSelecionada && (
            <div className="bg-white/95 backdrop-blur-md p-8 rounded-[50px] shadow-2xl border-t-[12px] border-yellow-500 animate-in zoom-in-95 duration-500">
              <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-100">
                <div>
                  <h3 className="font-black text-green-900 uppercase italic text-2xl tracking-tighter">Relatório de Presença</h3>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{chamadaSelecionada.data}</p>
                </div>
                <button onClick={() => setChamadaSelecionada(null)} className="bg-gray-100 text-gray-400 w-12 h-12 rounded-full font-black flex items-center justify-center transition-all hover:bg-red-500 hover:text-white">✕</button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {chamadaSelecionada.lista.map((item, idx) => (
                  <div key={idx} className={`p-4 rounded-[30px] border-2 flex items-center gap-3 ${item.status === 'P' ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'}`}>
                    <img src={item.foto} className="w-10 h-10 rounded-full object-cover shadow-sm border-2 border-white" alt="" />
                    <div className="min-w-0">
                       <p className="text-[10px] font-black uppercase truncate text-gray-800">{item.nome.split(' ')[0]}</p>
                       <p className={`text-[8px] font-black ${item.status === 'P' ? 'text-green-600' : 'text-red-600'}`}>{item.status === 'P' ? 'PRESENTE' : 'FALTOU'}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* COLUNA HISTÓRICO */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white/10 backdrop-blur-lg p-8 rounded-[50px] shadow-2xl border-t-[12px] border-yellow-500 sticky top-10 border border-white/10">
            <div className="flex justify-between items-center mb-10">
                <h3 className="font-black text-white uppercase italic text-xl tracking-tighter">Histórico</h3>
                <button onClick={() => navigate('/dashboard')} className="bg-white/10 hover:bg-white text-white hover:text-[#0a2614] px-6 py-3 rounded-2xl font-black text-[10px] uppercase transition-all shadow-sm border border-white/20">← Dashboard</button>
            </div>
            
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              {historico.length === 0 ? (
                <div className="text-center py-20 opacity-30 text-white">
                   <div className="text-6xl mb-4">📂</div>
                   <p className="text-[10px] font-black uppercase tracking-widest">Vazio</p>
                </div>
              ) : (
                historico.map((h, i) => (
                  <button 
                    key={i} 
                    onClick={() => setChamadaSelecionada(h)}
                    className="w-full p-6 bg-white/5 hover:bg-white/20 rounded-[35px] border-l-8 border-yellow-500 flex justify-between items-center transition-all group active:scale-95 shadow-lg border border-white/5"
                  >
                    <div className="text-left">
                      <p className="text-base font-black text-white mb-1 group-hover:text-yellow-400 transition-colors">{h.data}</p>
                      <p className="text-[11px] font-bold text-white/50 uppercase tracking-tight">{h.lista.length} Membros</p>
                    </div>
                    <div className="bg-white/10 w-12 h-12 rounded-full flex items-center justify-center shadow-lg group-hover:bg-yellow-500 group-hover:text-[#0a2614] transition-all text-white">
                       <span className="text-xs">👁️</span>
                    </div>
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
