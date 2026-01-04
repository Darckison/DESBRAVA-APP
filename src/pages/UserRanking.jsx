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
    <div className="min-h-screen bg-gradient-to-b from-green-900 to-black p-4 md:p-10 overflow-x-hidden">
      <h1 className="text-white text-2xl md:text-4xl font-black italic mb-10 text-center uppercase tracking-widest">
        Ranking do Clube
      </h1>

      {/* CONTAINER INTELIGENTE: 
          Mobile: flex-row com scroll lateral
          Desktop (md:): flex-wrap para quebrar linha e justify-center */}
      <div className="flex overflow-x-auto md:overflow-x-visible gap-6 pb-10 snap-x md:flex-wrap md:justify-center">
        {membros.map((m, index) => (
          <div 
            key={m._id} 
            className="
              /* Mobile: Ocupa 80% da tela */
              min-w-[80vw] 
              /* Desktop: Tamanho fixo de 300px */
              md:min-w-[300px] md:w-[300px] 
              bg-white/10 backdrop-blur-md rounded-[40px] p-6 border border-white/10 
              snap-center flex-shrink-0 flex flex-col items-center text-center shadow-2xl
            "
          >
            {/* Posição */}
            <div className="text-5xl font-black text-white/20 italic mb-2">{index + 1}º</div>

            {/* Foto */}
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-yellow-400 overflow-hidden mb-4 shadow-lg">
              <img src={m.foto_url} alt={m.nome} className="w-full h-full object-cover" />
            </div>

            <h2 className="text-lg md:text-xl font-black text-white uppercase leading-tight mb-1">{m.nome}</h2>
            <p className="text-[9px] md:text-xs font-bold text-gray-400 uppercase italic mb-6">{m.funcao}</p>

            {/* Patente */}
            <div className="bg-green-800 text-white px-6 py-1.5 rounded-full text-[10px] font-black uppercase italic mb-6">
              🌱 Aspirante
            </div>

            {/* Placar */}
            <div className="bg-white/5 rounded-3xl p-6 w-full border border-white/5 mt-auto">
              <p className="text-4xl font-black text-yellow-400 leading-none">{m.pontos}</p>
              <p className="text-[9px] font-black text-gray-400 uppercase mt-2">Pontos Totais</p>
            </div>
          </div>
        ))}
      </div>

      {/* Mensagem que só aparece no Celular */}
      <p className="text-center text-white/30 text-[10px] font-bold uppercase md:hidden">
        ← Deslize para ver os outros membros →
      </p>
    </div>
  );
};

export default UserRanking;
