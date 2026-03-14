import React, { useState, useEffect } from 'react';

export default function UnitRanking() {
  const [ranking, setRanking] = useState([]);
  const [unidadeAberta, setUnidadeAberta] = useState(null);
  const [membros, setMembros] = useState([]);
  const API_URL = "https://desbrava-app.onrender.com";

  useEffect(() => {
    fetch(`${API_URL}/ranking-unidades`)
      .then((res) => res.json())
      .then((data) => {
        // Ordena por pontuação total do maior para o menor
        const ordenados = Array.isArray(data) ? data.sort((a, b) => b.total - a.total) : [];
        setRanking(ordenados);
      });
  }, []);

  const verMembros = async (uni) => {
    const res = await fetch(`${API_URL}/unidade/${uni.nome}/membros`);
    const data = await res.json();
    setMembros(data);
    setUnidadeAberta(uni);
  };

  return (
    <div className="min-h-screen bg-black bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-green-950 via-black to-black p-4 md:p-10 text-white font-sans overflow-x-hidden">
      
      {/* TÍTULO ESTILO NEON */}
      <div className="text-center mb-12 relative">
        <h1 className="text-5xl md:text-8xl font-black italic tracking-tighter uppercase text-green-500 drop-shadow-[0_0_15px_rgba(34,197,94,0.8)] leading-none mb-2">
          TABELA
        </h1>
        <p className="text-xl md:text-3xl font-black uppercase italic text-white -mt-4 drop-shadow-md">
           de Unidades
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* CABEÇALHO DA TABELA */}
        <div className="flex px-4 md:px-8 mb-4 text-[10px] md:text-sm font-black text-green-400 uppercase tracking-widest italic">
          <span className="w-12 text-center">POS</span>
          <span className="flex-1 ml-4">UNIDADE</span>
          <span className="w-20 text-center">PTS</span>
        </div>

        {/* LISTA ESTILO TABELA DE PONTOS */}
        <div className="space-y-3">
          {ranking.map((uni, idx) => (
            <div
              key={idx}
              onClick={() => verMembros(uni)}
              className="flex items-center bg-white/5 hover:bg-green-500/20 border border-white/10 hover:border-green-500 transition-all cursor-pointer rounded-full p-1.5 md:p-2 group shadow-lg"
            >
              {/* POSIÇÃO CIRCULAR NEON */}
              <div className="w-10 h-10 md:w-14 md:h-14 flex-shrink-0 bg-green-500 rounded-full flex items-center justify-center font-black text-black text-lg md:text-2xl italic shadow-[0_0_10px_rgba(34,197,94,0.5)]">
                {idx + 1}º
              </div>

              {/* LOGO E NOME */}
              <div className="flex-1 flex items-center ml-4 min-w-0">
                <img
                  src={uni.logo_url}
                  className="w-8 h-8 md:w-12 md:h-12 rounded-full object-cover border-2 border-white/20 group-hover:border-white transition-colors"
                  alt="Logo"
                  onError={(e) => { e.target.src = "https://via.placeholder.com/150"; }}
                />
                <span className="ml-3 font-black uppercase italic text-sm md:text-2xl truncate tracking-tight text-white group-hover:text-green-400">
                  {uni.nome}
                </span>
              </div>

              {/* PONTUAÇÃO CAPSULA NEON */}
              <div className="w-20 md:w-32 h-10 md:h-14 bg-green-500 rounded-full flex items-center justify-center font-black text-black text-xl md:text-3xl italic shadow-[0_0_15px_rgba(34,197,94,0.3)]">
                {uni.total}
              </div>
            </div>
          ))}
        </div>

        <p className="text-center mt-12 font-black text-white/30 uppercase italic text-xs tracking-[0.3em]">
          Parabéns a todos!
        </p>
      </div>

      {/* MODAL DE MEMBROS (MANTIDO) */}
      {unidadeAberta && (
        <div className="fixed inset-0 bg-black/95 flex items-center justify-center p-4 z-50 backdrop-blur-xl transition-all">
          <div className="bg-zinc-900 rounded-[40px] w-full max-w-lg border-2 border-green-500 overflow-hidden shadow-[0_0_50px_rgba(34,197,94,0.3)]">
            <div className="p-8 text-center bg-gradient-to-b from-green-900/50 to-zinc-900 relative border-b border-white/5">
              <button
                onClick={() => setUnidadeAberta(null)}
                className="absolute top-6 right-8 text-3xl font-black text-green-500 hover:scale-125 transition-transform"
              >
                ✕
              </button>
              <img
                src={unidadeAberta.logo_url}
                className="w-28 h-28 mx-auto mb-4 rounded-full object-cover border-4 border-green-500 shadow-2xl"
                alt="Logo"
                onError={(e) => { e.target.src = "https://via.placeholder.com/150"; }}
              />
              <h3 className="text-3xl font-black uppercase italic text-green-500 tracking-tighter">
                Unidade {unidadeAberta.nome}
              </h3>
            </div>
            <div className="p-6 space-y-3 max-h-80 overflow-y-auto custom-scrollbar">
              {membros.length === 0 ? (
                <p className="text-center text-white/20 font-bold uppercase py-10 tracking-widest">Sem membros registrados</p>
              ) : (
                membros.map((m) => (
                  <div
                    key={m._id}
                    className="flex justify-between items-center bg-white/5 p-4 rounded-2xl border border-white/10"
                  >
                    <span className="font-black uppercase text-sm italic tracking-tight">{m.nome}</span>
                    <span className="text-green-500 font-black text-lg italic">{m.pontos} PTS</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
