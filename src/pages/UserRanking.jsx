import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const UserRanking = () => {
  const [membros, setMembros] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('https://desbrava-app.onrender.com/membros')
      .then(res => res.json())
      .then(data => {
        const ordenados = data.sort((a, b) => b.pontos - a.pontos);
        setMembros(ordenados);
      });
  }, []);

  const getPatente = (pontos) => {
    if (pontos >= 500) return "💎 EXCELÊNCIA";
    if (pontos >= 400) return "🥇 DIAMANTE";
    if (pontos >= 200) return "🎖️ OURO";
    if (pontos >= 100) return "🎖️ PRATA";
    if (pontos >= 50)  return "🎖️ BRONZE";
    return "🌱 ASPIRANTE";
  };

  const podio = membros.slice(0, 3);
  const geral = membros.slice(3);

  return (
    <div className="min-h-screen bg-green-950 bg-gradient-to-b from-green-900 to-black py-6 px-2 font-sans text-white overflow-x-hidden">
      <div className="max-w-5xl mx-auto">
        
        {/* BOTÃO VOLTAR E TÍTULO */}
        <div className="flex justify-between items-center mb-20 md:mb-44 px-2">
            <button onClick={() => navigate('/')} className="bg-yellow-500 text-green-950 px-4 py-1.5 rounded-full font-black text-[10px] md:text-sm uppercase italic shadow-lg">← VOLTAR</button>
            <h1 className="text-xl md:text-5xl font-black uppercase italic flex-1 text-center text-yellow-400 drop-shadow-lg">
              Ranking <span className="text-white">Elite Ágata</span>
            </h1>
            <div className="w-10 md:w-20"></div>
        </div>

        {/* PÓDIO - LADO A LADO IGUAL AO SEU PRINT */}
        <div className="flex flex-row justify-center items-end gap-1 md:gap-6 mb-24 relative pt-10">
          {podio.map((m, index) => {
            const isFirst = index === 0;
            const rank = index === 0 ? "1º" : index === 1 ? "2º" : "3º";
            const borderCol = index === 0 ? "border-yellow-500" : index === 1 ? "border-gray-400" : "border-orange-500";
            
            return (
              <div key={m._id} className={`flex flex-col items-center relative transition-all ${
                isFirst ? 'order-2 scale-110 z-20 mb-8 md:mb-12 w-[35%]' : 
                index === 1 ? 'order-1 z-10 w-[30%]' : 'order-3 z-10 w-[30%]'
              }`}>
                {/* FOTO E POSIÇÃO */}
                <div className="relative mb-3 flex justify-center w-full">
                  {isFirst && <div className="absolute -top-10 md:-top-16 text-3xl md:text-6xl animate-bounce">👑</div>}
                  <img src={m.foto_url} className={`w-14 h-14 md:w-36 md:h-36 rounded-full border-2 md:border-4 ${borderCol} object-cover shadow-2xl`} alt="" />
                  <span className={`absolute -bottom-2 bg-yellow-500 text-green-950 font-black px-2 py-0.5 rounded-full text-[9px] md:text-sm shadow-lg border border-white/20`}>{rank}</span>
                </div>

                {/* CARD VERDE DO PÓDIO */}
                <div className={`bg-green-800/90 p-3 md:p-8 rounded-[25px] md:rounded-[45px] border-b-8 ${borderCol} w-full text-center shadow-[0_10px_30px_rgba(0,0,0,0.5)]`}>
                  <h2 className="font-black text-[10px] md:text-2xl uppercase italic truncate mb-1">{m.nome.split(' ')[0]}</h2>
                  <p className="text-[7px] md:text-sm font-bold text-gray-400 uppercase leading-none mb-2">{m.funcao}</p>
                  <p className="text-white font-black text-sm md:text-5xl leading-none">{m.pontos}</p>
                  <p className="text-[6px] md:text-xs font-black text-white/30 uppercase mt-1">PONTOS</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* LISTA GERAL - NOMES E NÚMEROS EM BRANCO TOTAL */}
        <div className="bg-black/40 rounded-[35px] md:rounded-[60px] overflow-hidden shadow-2xl border border-white/5 mb-20 mx-2">
          <div className="bg-white/5 p-4 text-center font-black text-white uppercase text-[10px] md:text-sm tracking-[0.4em] border-b border-white/5">
            Classificação Geral
          </div>
          
          <div className="divide-y divide-white/5 px-4 md:px-12">
            {geral.map((m, index) => (
              <div key={m._id} className="flex items-center justify-between py-5 md:py-10 transition-all">
                
                {/* LADO ESQUERDO: POSIÇÃO E NOME (BRANCOS) */}
                <div className="flex items-center gap-3 md:gap-14 flex-1 min-w-0">
                  {/* Número em Branco */}
                  <span className="font-black text-white text-xl md:text-6xl w-10 md:w-24 text-center flex-shrink-0 italic">
                    {index + 4}º
                  </span>
                  
                  <img src={m.foto_url} className="w-12 h-12 md:w-24 md:h-24 rounded-full object-cover border-2 border-white/10 shadow-xl flex-shrink-0" alt="" />
                  
                  <div className="min-w-0 flex-1 ml-1">
                    {/* Nome em Branco */}
                    <p className="font-black text-[12px] md:text-4xl text-white uppercase italic tracking-tighter truncate leading-none mb-2">
                      {m.nome}
                    </p>
                    <p className="text-[8px] md:text-lg text-yellow-500/80 font-bold uppercase tracking-widest truncate">
                      {m.funcao} • {getPatente(m.pontos).split(' ')[1]}
                    </p>
                  </div>
                </div>

                {/* LADO DIREITO: PONTUAÇÃO COMPLETA */}
                <div className="text-right flex-shrink-0 ml-4">
                  <p className="font-black text-yellow-500 text-2xl md:text-6xl leading-none drop-shadow-md">
                    {m.pontos}
                  </p>
                  <span className="text-[8px] md:text-sm font-black text-white/20 uppercase tracking-widest block mt-1">
                    TOTAL
                  </span>
                </div>

              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserRanking;
