import React, { useState, useEffect } from 'react';

const RankingClube = () => {
  const [membros, setMembros] = useState([]);

  useEffect(() => {
    fetch('https://desbrava-app.onrender.com/membros')
      .then(res => res.json())
      .then(data => {
        const ordenados = data.sort((a, b) => b.pontos - a.pontos);
        setMembros(ordenados);
      });
  }, []);

  return (
    /* h-auto e min-h-screen garantem que a página cresça se o conteúdo for grande */
    <div className="min-h-screen h-auto bg-gradient-to-b from-green-900 via-green-800 to-black p-4 pb-20 overflow-y-auto">
      
      {/* Cabeçalho com espaçamento superior garantido */}
      <div className="pt-10 mb-8">
        <button className="bg-white/20 text-white text-[10px] px-4 py-2 rounded-lg mb-6 uppercase font-bold">
          ← Voltar
        </button>
        <h1 className="text-white text-2xl font-black italic text-center uppercase tracking-widest leading-tight">
          Ranking do Clube
        </h1>
      </div>

      {/* CONTAINER DOS CARDS: Ajuste de altura para não cortar em cima */}
      <div className="flex overflow-x-auto gap-6 pb-12 snap-x scrollbar-hide items-start">
        {membros.map((m, index) => (
          <div 
            key={m._id} 
            /* min-w-[80vw] para caber melhor lateralmente no celular */
            className="min-w-[80vw] sm:min-w-[320px] bg-white/10 backdrop-blur-md rounded-[45px] p-8 border border-white/20 snap-center flex-shrink-0 flex flex-col items-center text-center shadow-2xl mt-4"
          >
            {/* Posição no Ranking */}
            <div className="text-6xl font-black text-white/10 italic mb-2 leading-none">
              {index + 1}º
            </div>

            {/* Foto de Perfil */}
            <div className="w-28 h-28 rounded-full border-4 border-yellow-400 overflow-hidden mb-6 shadow-xl">
              <img src={m.foto_url} alt={m.nome} className="w-full h-full object-cover" />
            </div>

            <h2 className="text-xl font-black text-white uppercase leading-tight mb-1">
              {m.nome}
            </h2>
            <p className="text-[10px] font-bold text-gray-400 uppercase italic mb-6">
              {m.funcao}
            </p>

            {/* Patente */}
            <div className="bg-green-900/80 text-white px-8 py-2 rounded-full text-[11px] font-black uppercase italic mb-8 border border-green-500/30">
              🌱 Aspirante
            </div>

            {/* Placar de Pontos */}
            <div className="bg-black/20 rounded-[32px] p-8 w-full border border-white/5">
              <p className="text-5xl font-black text-yellow-400 leading-none">{m.pontos}</p>
              <p className="text-[10px] font-black text-gray-400 uppercase mt-3 tracking-widest">Pontos Totais</p>
            </div>
          </div>
        ))}
      </div>

      {/* Indicador de rolagem */}
      <div className="flex justify-center gap-2 mt-4 md:hidden">
        <div className="w-8 h-1 bg-yellow-400 rounded-full animate-pulse"></div>
        <p className="text-white/30 text-[9px] font-bold uppercase">Arraste para o lado</p>
      </div>
    </div>
  );
};

export default RankingClube;
