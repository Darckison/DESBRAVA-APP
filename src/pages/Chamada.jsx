import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Chamada() {
  const navigate = useNavigate();
  const [membros, setMembros] = useState([]);
  const [presencas, setPresencas] = useState({});
  const [historico, setHistorico] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mostrarLista, setMostrarLista] = useState(false); // Estado para mostrar/esconder a chamada
  const [chamadaSelecionada, setChamadaSelecionada] = useState(null); // Para ver detalhes do histórico

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
    <div className="min-h-screen bg-[#f1f5f2] font-sans text-gray-800 p-4 md:p-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* COLUNA PRINCIPAL */}
        <div className="lg:col-span-2 space-y-6">
          {!mostrarLista ? (
            <div className="bg-white p-12 rounded-[40px] shadow-xl text-center border-4 border-dashed border-green-200">
               <h2 className="text-3xl font-black text-green-800 uppercase italic mb-6">Controle de Frequência</h2>
               <button 
                onClick={() => setMostrarLista(true)}
                className="bg-green-600 hover:bg-green-700 text-white px-10 py-5 rounded-3xl font-black uppercase tracking-widest shadow-lg transition-all active:scale-95"
               >
                 📝 Iniciar Chamada de Hoje
               </button>
            </div>
          ) : (
            <div className="bg-white rounded-[40px] shadow-2xl overflow-hidden border-b-8 border-green-800 animate-in fade-in zoom-in duration-300">
              <div className="bg-green-800 p-6 text-white flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-black uppercase italic leading-none">Chamada do Dia</h2>
                  <p className="text-[10px] font-bold text-yellow-500 uppercase mt-1">{hoje}</p>
                </div>
                <button onClick={() => setMostrarLista(false)} className="bg-white/10 p-3 rounded-xl font-bold text-[10px] uppercase">Cancelar</button>
              </div>

              <div className="p-4 space-y-2 max-h-[500px] overflow-y-auto">
                {membros.map(m => (
                  <div key={m._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-3">
                      <img src={m.foto_url} className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm" alt="" />
                      <div className="truncate">
                        <p className="font-black text-xs uppercase leading-none">{m.nome.split(' ')[0]}</p>
                        <p className="text-[8px] text-gray-400 font-bold uppercase">{m.unidade}</p>
                      </div>
                    </div>

                    <div className="flex bg-gray-200 p-1 rounded-xl scale-90">
                      <button 
                        onClick={() => alternarPresenca(m._id, 'P')}
                        className={`px-3 py-1.5 rounded-lg text-[9px] font-black transition-all ${presencas[m._id] === 'P' ? 'bg-green-600 text-white shadow-md' : 'text-gray-400'}`}
                      >PRESENTE</button>
                      <button 
                        onClick={() => alternarPresenca(m._id, 'F')}
                        className={`px-3 py-1.5 rounded-lg text-[9px] font-black transition-all ${presencas[m._id] === 'F' ? 'bg-red-600 text-white shadow-md' : 'text-gray-400'}`}
                      >FALTA</button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-6 bg-gray-50 border-t">
                <button 
                  onClick={salvarChamada}
                  disabled={loading}
                  className="w-full bg-green-800 text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-lg active:scale-95 transition-all text-sm"
                >
                  {loading ? "SALVANDO..." : "FINALIZAR CHAMADA"}
                </button>
              </div>
            </div>
          )}

          {/* DETALHES DA CHAMADA SELECIONADA NO HISTÓRICO */}
          {chamadaSelecionada && (
            <div className="bg-white p-6 rounded-[40px] shadow-xl border-t-8 border-blue-500 animate-in slide-in-from-top-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-black text-blue-900 uppercase italic text-sm">Relatório: {chamadaSelecionada.data}</h3>
                <button onClick={() => setChamadaSelecionada(null)} className="text-gray-400 font-black">✕</button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {chamadaSelecionada.lista.map((item, idx) => (
                  <div key={idx} className={`p-2 rounded-xl border flex items-center gap-2 ${item.status === 'P' ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'}`}>
                    <img src={item.foto} className="w-6 h-6 rounded-full object-cover" alt="" />
                    <span className="text-[9px] font-black uppercase truncate">{item.nome.split(' ')[0]}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* COLUNA HISTÓRICO */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-[40px] shadow-xl border-t-8 border-yellow-500">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-black text-green-800 uppercase italic">Histórico</h3>
                <button onClick={() => navigate('/dashboard')} className="bg-gray-100 text-gray-600 px-4 py-2 rounded-xl font-black text-[10px] uppercase hover:bg-gray-200 transition-all">← Voltar</button>
            </div>
            
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
              {historico.length === 0 ? (
                <p className="text-xs text-gray-400 font-bold text-center py-10">Sem registros</p>
              ) : (
                historico.map((h, i) => (
                  <button 
                    key={i} 
                    onClick={() => setChamadaSelecionada(h)}
                    className="w-full p-4 bg-gray-50 hover:bg-green-50 rounded-2xl border-l-4 border-green-800 flex justify-between items-center transition-all group active:scale-95"
                  >
                    <div className="text-left">
                      <p className="text-xs font-black text-green-900 group-hover:text-green-600">{h.data}</p>
                      <p className="text-[9px] font-bold text-gray-400 uppercase">{h.lista.length} Membros</p>
                    </div>
                    <span className="bg-green-100 text-green-800 w-8 h-8 rounded-full flex items-center justify-center text-xs">👁️</span>
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
