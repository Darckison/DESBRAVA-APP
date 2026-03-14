import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Chamada() {
  const navigate = useNavigate();
  const [membros, setMembros] = useState([]);
  const [presencas, setPresencas] = useState({});
  const [historico, setHistorico] = useState([]);
  const [loading, setLoading] = useState(false);
  const API_URL = "https://desbrava-app.onrender.com";
  const hoje = new Date().toLocaleDateString('pt-BR');

  useEffect(() => {
    // Carrega membros e já define todos como PRESENTE (P) por padrão
    fetch(`${API_URL}/membros`)
      .then(res => res.json())
      .then(data => {
        setMembros(data);
        const inicial = {};
        data.forEach(m => inicial[m._id] = 'P');
        setPresencas(inicial);
      });

    // Carrega o histórico de chamadas passadas
    fetch(`${API_URL}/chamada-historico`)
      .then(res => res.json())
      .then(data => setHistorico(data));
  }, []);

  const alternarPresenca = (id, status) => {
    setPresencas(prev => ({ ...prev, [id]: status }));
  };

  const salvarChamada = async () => {
    setLoading(true);
    const listaFinal = membros.map(m => ({
      nome: m.nome,
      foto: m.foto_url,
      status: presencas[m._id]
    }));

    try {
      const res = await fetch(`${API_URL}/chamada`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: hoje, lista: listaFinal })
      });
      if (res.ok) alert("✅ Chamada de hoje salva com sucesso!");
    } catch (err) {
      alert("Erro ao salvar.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f1f5f2] font-sans text-gray-800 p-4 md:p-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* COLUNA DA CHAMADA (ESQUERDA/CENTRO) */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-[40px] shadow-2xl overflow-hidden border-b-8 border-green-800">
            <div className="bg-green-800 p-8 text-white flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-black uppercase italic italic">Chamada do Dia</h2>
                <p className="text-xs font-bold text-yellow-500 uppercase tracking-[0.2em]">{hoje}</p>
              </div>
              <button onClick={() => navigate('/admin')} className="bg-white/10 p-3 rounded-xl font-bold text-xs uppercase">Voltar</button>
            </div>

            <div className="p-4 space-y-3">
              {membros.map(m => (
                <div key={m._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-3xl border border-gray-100 shadow-sm transition-all hover:shadow-md">
                  <div className="flex items-center gap-4">
                    <img src={m.foto_url} className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm" alt="" />
                    <div className="truncate w-32 md:w-auto">
                      <p className="font-black text-xs md:text-sm uppercase leading-none">{m.nome.split(' ')[0]}</p>
                      <p className="text-[9px] text-gray-400 font-bold uppercase">{m.unidade}</p>
                    </div>
                  </div>

                  <div className="flex bg-gray-200 p-1 rounded-2xl">
                    <button 
                      onClick={() => alternarPresenca(m._id, 'P')}
                      className={`px-4 py-2 rounded-xl text-[10px] font-black transition-all ${presencas[m._id] === 'P' ? 'bg-green-600 text-white shadow-lg' : 'text-gray-400'}`}
                    >PRESENTE</button>
                    <button 
                      onClick={() => alternarPresenca(m._id, 'F')}
                      className={`px-4 py-2 rounded-xl text-[10px] font-black transition-all ${presencas[m._id] === 'F' ? 'bg-red-600 text-white shadow-lg' : 'text-gray-400'}`}
                    >FALTA</button>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-8">
              <button 
                onClick={salvarChamada}
                disabled={loading}
                className="w-full bg-green-800 text-white p-6 rounded-[30px] font-black uppercase tracking-widest shadow-xl active:scale-95 transition-all"
              >
                {loading ? "SALVANDO..." : "FINALIZAR CHAMADA DE HOJE"}
              </button>
            </div>
          </div>
        </div>

        {/* COLUNA HISTÓRICO (DIREITA) */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-[40px] shadow-xl border-t-8 border-yellow-500">
            <h3 className="font-black text-green-800 uppercase italic mb-4">Chamadas Anteriores</h3>
            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
              {historico.length === 0 ? (
                <p className="text-xs text-gray-400 font-bold text-center py-10">Nenhum registro</p>
              ) : (
                historico.map((h, i) => (
                  <div key={i} className="p-4 bg-gray-50 rounded-2xl border-l-4 border-green-800 flex justify-between items-center group">
                    <div>
                      <p className="text-xs font-black text-green-900">{h.data}</p>
                      <p className="text-[9px] font-bold text-gray-400">{h.lista.length} Membros</p>
                    </div>
                    <span className="bg-green-100 text-green-800 p-2 rounded-lg text-[10px] font-black">✔</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
