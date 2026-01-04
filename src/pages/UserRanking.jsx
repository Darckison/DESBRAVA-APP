import React, { useState, useEffect } from 'react';

const UserRanking = () => {
  const [membros, setMembros] = useState([]);

  useEffect(() => {
    fetch('https://desbrava-app.onrender.com/membros')
      .then(res => res.json())
      .then(data => {
        const ordenados = data.sort((a, b) => b.pontos - a.pontos);
        setMembros(ordenados);
      });
  }, []);

  const top3 = membros.slice(0, 3);
  const restante = membros.slice(3);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-700 to-green-900 p-4 md:p-10 overflow-x-hidden font-sans">
      <h1 className="text-white text-2xl md:text-4xl font-black italic mb-12 text-center uppercase tracking-widest">
        Ranking do Clube
      </h1>

      {/* SEÇÃO DO PÓDIO (TOP 3) */}
      <div className="flex justify-center items-end gap-2 md:gap-8 mb-16 h-80">
        {/* 2º LUGAR */}
        {top3[1] && (
          <div className="flex flex-col items-center animate-bounce" style={{ animationDuration: '3s' }}>
            <span className="text-white text-3xl font-black italic opacity-50">2º</span>
            <div className="bg-white/20 backdrop-blur-md p-4 rounded-t-[40px] border-x border-t border-white/30 w-28 md:w-48 text-center flex flex-col items-center h-56 shadow-2xl">
              <img src={top3[1].foto_url} className="w-16 h-16 md:w-24 md:h-24 rounded-full border-4 border-white mb-2 object-cover" alt="" />
              <p className="text-white font-black text-[10px] md:text-xs uppercase truncate w-full">{top3[1].nome}</p>
              <p className="text-yellow-400 font-black text-lg">{top3[1].pontos}</p>
            </div>
          </div>
        )}

        {/* 1º LUGAR (MAIS ALTO) */}
        {top3[0] && (
          <div className="flex flex-col items-center animate-bounce" style={{ animationDuration: '2s' }}>
            <span className="text-yellow-400 text-5xl font-black italic mb-2">1º</span>
            <div className="bg-yellow-500 p-4 rounded-t-[40px] w-32 md:w-56 text-center flex flex-col items-center h-64 shadow-[0_0_50px_rgba(234,179,8,0.5)]">
              <img src={top3[0].foto_url} className="w-20 h-20 md:w-32 md:h-32 rounded-full border-4 border-white mb-2 object-cover" alt="" />
              <p className="text-white font-black text-xs md:text-sm uppercase truncate w-full">{top3[0].nome}</p>
              <p className="text-green-900 font-black text-2xl">{top3[0].pontos}</p>
              <div className="mt-2 bg-green-900 text-white px-3 py-1 rounded-full text-[8px] font-bold uppercase">Líder Absoluto</div>
            </div>
          </div>
        )}

        {/* 3º LUGAR */}
        {top3[2] && (
          <div className="flex flex-col items-center animate-bounce" style={{ animationDuration: '3.5s' }}>
            <span className="text-white text-2xl font-black italic opacity-40">3º</span>
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-t-[40px] border-x border-t border-white/20 w-24 md:w-44 text-center flex flex-col items-center h-48 shadow-xl">
              <img src={top3[2].foto_url} className="w-14 h-14 md:w-20 md:h-20 rounded-full border-4 border-white mb-2 object-cover" alt="" />
              <p className="text-white font-black text-[10px] uppercase truncate w-full">{top3[2].nome}</p>
              <p className="text-yellow-400 font-black text-base">{top3[2].pontos}</p>
            </div>
          </div>
        )}
      </div>

      {/* RESTANTE DOS MEMBROS (CARDS DESLIZANTES) */}
      <div className="bg-black/20 p-6 rounded-[50px] border border-white/10 shadow-inner">
        <p className="text-white/40 text-[10px] font-black uppercase mb-6 text-center tracking-widest">Classificação Geral</p>
        
        <div className="flex overflow-x-auto gap-4 pb-4 snap-x md:flex-wrap md:justify-center scrollbar-hide">
          {restante.map((m, index) => (
            <div key={m._id} className="min-w-[240px] md:w-64 bg-white rounded-[40px] p-6 snap-center flex-shrink-0 flex flex-col items-center text-center shadow-xl">
              <span className="text-gray-200 font-black italic text-3xl mb-2">{index + 4}º</span>
              <img src={m.foto_url} className="w-20 h-20 rounded-full border-4 border-green-100 mb-3 object-cover shadow-md" alt="" />
              <h3 className="text-green-800 font-black uppercase text-sm leading-tight">{m.nome}</h3>
              <div className="mt-4 bg-gray-100 rounded-2xl p-3 w-full">
                <p className="text-2xl font-black text-green-600">{m.pontos}</p>
                <p className="text-[8px] font-bold text-gray-400 uppercase">Pontos Totais</p>
              </div>
            </div>
          ))}
        </div>
        <p className="text-center text-white/20 text-[8px] font-bold mt-4 uppercase md:hidden">← Deslize para ver todos →</p>
      </div>
    </div>
  );
};

export default UserRanking;
