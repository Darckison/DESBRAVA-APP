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

  return (
    /* pt-20 garante que o título apareça abaixo da barra do navegador no mobile */
    <div className="min-h-screen bg-green-700 p-4 md:p-8 overflow-x-hidden pt-20">
      
      <div className="flex items-center gap-4 mb-10">
        <button className="bg-white/20 text-white text-[10px] px-4 py-2 rounded-lg uppercase font-bold">
          ← Voltar
        </button>
        <h1 className="text-white text-2xl font-black italic uppercase tracking-widest">
          Ranking do Clube
        </h1>
      </div>

      {/* CONTAINER DOS CARDS: Mantendo o seu estilo original de cores */}
      <div className="flex overflow-x-auto gap-6 pb-10 snap-x scrollbar-hide items-start">
        {membros.map((m, index) => (
          <div 
            key={m._id} 
            /* min-w-[85vw] para o card se ajustar ao tamanho da tela do celular */
            className="min-w-[85vw] sm:min-w-[320px] bg-green-800/40 rounded-[45px] p-8 border border-white/10 snap-center flex-shrink-0 flex flex-col items-center text-center shadow-2xl relative"
          >
            {/* Posição no Ranking */}
            <div className="text-6xl font-black text-white/10 italic absolute top-6 right-8">
              {index + 1}º
            </div>

            {/* Foto de Perfil com a sua borda amarela */}
            <div className="w-32 h-32 rounded-full border-4 border-yellow-400 overflow-hidden mb-4 shadow-xl">
              <img src={m.foto_url} alt={m.nome} className="w-full h-full object-cover" />
            </div>

            <h2 className="text-2xl font-black text-white uppercase leading-tight mb-1">
              {m.nome}
            </h2>
            <p className="text-[10px] font-bold text-green-200 uppercase italic mb-6">
              {m.funcao}
            </p>

            <div className="bg-green-900 text-white px-6 py-2 rounded-full text-[10px] font-black uppercase italic mb-6 border border-green-500">
              🌱 Aspirante
            </div>

            {/* Placar de Pontos original */}
            <div className="bg-green-900/60 rounded-3xl p-6 w-full border border-white/5">
              <p className="text-4xl font-black text-white leading-none">{m.pontos}</p>
              <p className="text-[10px] font-black text-green-300 uppercase mt-2">Pontos Totais</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserRanking;
