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
    <div className="min-h-screen bg-[#061a0d] font-sans text-gray-800 p-3 md:p-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* COLUNA PRINCIPAL */}
        <div className="lg:col-span-8 space-y-6">
          {!mostrarLista ? (
            <div className="bg-white/10 backdrop-blur-2xl p-12 rounded-[50px] shadow-2xl text-center border-2 border-white/10 flex flex-col items-center justify-center min-h-[450px] animate-in fade-in zoom-in duration-500 relative">
               
               {/* BOTÃO VOLTAR FIXADO NA BORDA ESQUERDA DO CONTEINER */}
               <button 
                  onClick={() => navigate('/dashboard')} 
                  className="absolute top-8 left-8 bg-white/10 hover:bg-white/20 text-white w-14 h-14 rounded-2xl flex items-center justify-center transition-all shadow-lg border border-white/10 text-2xl active:scale-90"
               >
                  ←
               </button>

               {/* SEÇÃO DA LOGO AO LADO DO TÍTULO E SUBTÍTULO */}
               <div className="flex items-center gap-6 mb-10 border-l-2 border-white/20 pl-6">
                  <img src="/logo.png" className="w-24 h-24 drop-shadow-2xl" alt="Logo" />
                  <div className="text-left">
                    <h2 className="text-2xl md:text-4xl font-black text-white uppercase italic leading-none tracking-tighter">Clube Ágata</h2>
                    <p className="text-[10px] md:text-xs font-bold text-green-400 uppercase tracking-[0.2em] mt-2 opacity-80">Painel Administrativo</p>
                  </div>
               </div>

               <h2 className="text-2xl md:text-4xl font-black text-white/40 uppercase italic tracking-tighter mb-4">Frequência</h2>
               <button 
                onClick={() => setMostrarLista(true)}
                className="bg-green-500 hover:bg-green-400 text-[#0a2614] px-16 py-6 rounded-[30px] font-black uppercase tracking-widest shadow-[0_15px_40px_rgba(34,197,94,0.3)] transition-all active:scale-95 text-sm"
               >
                 📝 Realizar Chamada de Hoje
               </button>
            </div>
          ) : (
            <div className="bg-white rounded-[50px] shadow-2xl overflow-hidden border border-white/20 animate-in slide-in-from-bottom-6 duration-500">
              
              {/* HEADER DA LISTA COM LOGO AO LADO DO TÍTULO E SUBTÍTULO */}
              <div className="bg-gradient-to-br from-green-800 to-[#061a0d] p-8 text-white relative">
                <div className="flex items-center">
                  
                  {/* BOTÃO VOLTAR NA BORDA ESQUERDA */}
                  <button 
                    onClick={() => setMostrarLista(false)} 
                    className="bg-white/10 hover:bg-white/20 w-12 h-12 rounded-2xl flex items-center justify-center transition-all border border-white/10"
                  >
                    <span className="text-2xl">←</span>
                  </button>

                  {/* LOGO E TÍTULOS JUNTOS E CENTRALIZADOS */}
                  <div className="flex items-center gap-4 ml-auto mr-auto border-l-2 border-white/20 pl-4">
                    <img src="/logo.png" className="w-14 h-14 object-contain bg-white/10 backdrop-blur-md rounded-2xl p-1 shadow-xl border border-white/20" alt="Logo" />
                    <div>
                      <h2 className="text-2xl md:text-3xl font-black text-white uppercase italic leading-none tracking-tighter">Clube Ágata</h2>
                      <p className="text-[10px] font-bold text-yellow-400 uppercase tracking-widest opacity-90 mt-1">Painel Administrativo</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-black/20 p-4 rounded-[25px] border border-white/5 text-center mt-8">
                   <p className="text-[11px] font-black text-white uppercase tracking-widest underline decoration-yellow-500 decoration-2 underline-offset-8">Lista de Frequência • {hoje}</p>
                </div>
              </div>

              {/* LISTA DE MEMBROS */}
              <div className="p-6 space-y-4 max-h-[550px] overflow-y-auto custom-scrollbar bg-gray-50/50">
                {membros.map(m => (
                  <div key={m._id} className="flex items-center justify-between p-4 bg-white rounded-[35px] shadow-sm border border-gray-100 transition-all hover:shadow-xl hover:scale-[1.01]">
                    <div className="flex items-center gap-4">
                      <img src={m.foto_url} className="w-16 h-16 rounded-full object-cover border-4 border-gray-100 shadow-md" alt="" onError={(e) => e.target.src = "https://via.placeholder.com/150"} />
                      <div className="truncate">
                        <p className="font-black text-sm md:text-lg uppercase leading-none text-gray-800 tracking-tighter">{m.nome.split(' ')[0]}</p>
                        <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-1.5">{m.unidade}</p>
                      </div>
                    </div>

                    <div className="flex bg-gray-100 p-1.5 rounded-[25px] gap-1 shadow-inner border border-gray-200">
                      <button 
                        onClick={() => alternarPresenca(m._id, 'P')}
                        className={`px-4 md:px-7 py-3 rounded-[20px] text-[10px] font-black transition-all ${presencas[m._id] === 'P' ? 'bg-green-600 text-white shadow-lg shadow-green-900/20' : 'text-gray-400 hover:bg-white'}`}
                      >P</button>
                      <button 
                        onClick={() => alternarPresenca(m._id, 'F')}
                        className={`px-4 md:px-7 py-3 rounded-[20px] text-[10px] font-black transition-all ${presencas[m._id] === 'F' ? 'bg-red-600 text-white shadow-lg shadow-red-900/20' : 'text-gray-400 hover:bg-white'}`}
                      >F</button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-8 bg-white border-t border-gray-100 text-center">
                <button 
                  onClick={salvarChamada}
                  disabled={loading}
                  className="w-full bg-[#061a0d] hover:bg-black text-white py-6 rounded-[30px] font-black uppercase tracking-[0.3em] shadow-2xl active:scale-95 transition-all text-xs border-b-4 border-green-800"
                >
                  {loading ? "PROCESSANDO..." : "CONCLUIR FREQUÊNCIA"}
                </button>
              </div>
            </div>
          )}

          {chamadaSelecionada && (
            <div className="bg-white/95 backdrop-blur-xl p-8 rounded-[50px] shadow-2xl border-t-[12px] border-yellow-500 animate-in zoom-in-95 duration-500 mt-6">
              <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-100">
                <div>
                  <h3 className="font-black text-green-900 uppercase italic text-2xl tracking-tighter">Relatório de Presença</h3>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{chamadaSelecionada.data}</p>
                </div>
                <button onClick={() => setChamadaSelecionada(null)} className="bg-gray-100 hover:bg-red-500 hover:text-white text-gray-400 w-12 h-12 rounded-full font-black flex items-center justify-center transition-all">✕</button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {chamadaSelecionada.lista.map((item, idx) => (
                  <div key={idx} className={`p-4 rounded-[30px] border-2 flex items-center gap-3 ${item.status === 'P' ? 'bg-green-50/50 border-green-100' : 'bg-red-50/50 border-red-100'}`}>
                    <img src={item.foto} className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm" alt="" />
                    <div className="min-w-0">
                       <p className="text-[10px] font-black uppercase truncate text-gray-800">{item.nome.split(' ')[0]}</p>
                       <p className={`text-[8px] font-black ${item.status === 'P' ? 'text-green-600' : 'text-red-600'}`}>
                         {item.status === 'P' ? 'P' : 'F'}
                       </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* COLUNA HISTÓRICO */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white/10 backdrop-blur-lg p-8 rounded-[50px] shadow-2xl border-t-[12px] border-yellow-500 sticky top-10 border border-white/10 relative">
            
            {/* LOGO AO LADO DO TÍTULO NO HISTÓRICO */}
            <div className="flex items-center gap-4 mb-10 border-l-2 border-yellow-500 pl-4">
              <img src="/logo.png" className="w-12 h-12 object-contain bg-white/10 backdrop-blur-md rounded-xl p-1 border border-white/20" alt="Logo" />
              <h3 className="font-black text-white uppercase italic text-xl tracking-tighter">Histórico</h3>
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
                    <div className="bg-white/10 w-12 h-12 rounded-full flex items-center justify-center shadow-lg group-hover:bg-yellow-500 group-hover:text-[#0a2614] transition-all text-white font-black text-xs">VER</div>
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
