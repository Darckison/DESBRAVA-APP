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
    <div className="min-h-screen bg-[#064e3b] p-4 md:p-8 overflow-x-hidden">
      {/* Botão Voltar */}
      <div className="flex items-center gap-4 mb-8">
        <button className="bg-white/20 text-white text-[10px] px-4 py-2 rounded-lg uppercase font-bold">
          ← Voltar
        </button>
        <h1 className="text-white text-xl font-black italic uppercase tracking-wider">
          Ranking do Clube
        </h1>
      </div>

      {/* CONTAINER DOS CARDS: Ajuste para não cortar */}
      <div className="flex overflow-x-auto gap-4 pb-10 snap-x scrollbar-hide md:justify-center md:flex-wrap">
        {membros.map((m, index) => (
          <div 
            key={m._id} 
            className={`
              /* Define que o card ocupa 85% da largura no mobile para não cortar */
              min-w-[85vw] sm:min-w-[320px] 
              rounded-[40px] p-6 snap-center flex-shrink-0 relative flex flex-col items-center text-center shadow-2xl
              ${index === 0 ? 'bg-[#fbbf24]' : 'bg-white/10 backdrop-blur-md border border-white/10'}
            `}
          >
            {/* Posição no Ranking */}
            <div className={`text-6xl font-black italic mb-2 ${index === 0 ? 'text-black/10' : 'text-white/10'}`}>
              {index + 1}º
            </div>

            {/* Foto de Perfil */}
            <div className="w-28 h-28 rounded-full border-4 border-white overflow-hidden mb-4 shadow-lg">
              <img src={m.foto_url} alt={m.nome} className="w-full h-full object-cover" />
            </div>

            <h2 className={`text-xl font-black uppercase leading-tight mb-1 ${index === 0 ? 'text-black' : 'text-white'}`}>
              {m.nome}
            </h2>
            <p className={`text-[10px] font-bold uppercase italic mb-6 ${index === 0 ? 'text-black/60' : 'text-gray-400'}`}>
              {m.funcao}
            </p>

            {/* Badge de Patente */}
            <div className="bg-[#064e3b] text-white px-6 py-2 rounded-full text-[10px] font-black uppercase italic mb-6">
              🌱 Aspirante
            </div>

            {/* Placar de Pontos */}
            <div className={`${index === 0 ? 'bg-black/5' : 'bg-white/5'} rounded-3xl p-6 w-full`}>
              <p className={`text-5xl font-black leading-none ${index === 0 ? 'text-black' : 'text-white'}`}>
                {m.pontos}
              </p>
              <p className={`text-[10px] font-black uppercase mt-2 ${index === 0 ? 'text-black/40' : 'text-gray-400'}`}>
                Pontos Totais
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Rodapé fixo ou informativo */}
      <div className="bg-white rounded-t-[40px] p-6 mt-4 text-center">
        <p className="text-[#064e3b] font-black uppercase text-xs tracking-widest">
          Classificação Geral
        </p>
      </div>
    </div>
  );
};

export default RankingClube;
