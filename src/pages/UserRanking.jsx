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
    <div className="min-h-screen bg-green-900 py-6 px-2 font-sans text-white overflow-x-hidden">
      <div className="max-w-5xl mx-auto">
        
        {/* CABEÇALHO */}
        <div className="flex justify-between items-center mb-16 md:mb-32">
            <button onClick={() => navigate('/')} className="bg-yellow-500 text-green-950 px-4 py-1.5 rounded-full font-black text-[10px] md:text-sm uppercase italic shadow-lg">← VOLTAR</button>
            <h1 className="text-xl md:text-5xl font-black uppercase italic flex-1 text-center tracking-tighter text-yellow-400 drop-shadow-md">
              Ranking <span className="text-white">Elite Ágata</span>
            </h1>
            <div className="w-10 md:w-20"></div>
        </div>

        {/* PÓDIO (LADO A LADO NO MOBILE) */}
        <div className="flex flex-row justify-center items-end gap-1 md:gap-6 mb-20 relative pt-10">
          {podio.map((m, index) => {
            const isFirst = index === 0;
            const rank = index === 0 ? "1º" : index === 1 ? "2º" : "3º";
            const borderCol = index === 0 ? "border-yellow-500" : index === 1 ? "border-gray-400" : "border-orange-500";
            
            return (
              <div key={m._id} className={`flex flex-col items-center relative transition-all ${
                isFirst ? 'order-2 scale-105 z-20 mb-6 md:mb-10 w-[34%]' : 
                index === 1 ? 'order-1 z-10 w-[31%]' : 'order-3 z-10 w-[31%]'
              }`}>
                {/* POSIÇÃO E COROA */}
                <div className="relative mb-2 flex justify-center w-full">
                  {isFirst && <div className="absolute -top-6 md:-top-12 text-2xl md:text-6xl animate-bounce">👑</div>}
                  <img src={m.foto_url} className={`w-12 h-12 md:w-32 md:h-32 rounded-full border-2 md:border-4 ${borderCol} object-cover shadow-2xl`} alt="" />
                  <span className={`absolute -bottom-1 bg-yellow-500 text-green-950 font-black px-1.5 py-0.5 rounded-full text-[8px] md:text-sm shadow-lg`}>{rank}</span>
                </div>

                {/* CARD DO PÓDIO */}
                <div className={`bg-green-800/80 p-2 md:p-6 rounded-[20px] md:rounded-[40px] border-b-4 ${borderCol} w-full text-center shadow-xl`}>
                  <h2 className="font-black text-[9px] md:text-xl uppercase italic truncate mb-1">{m.nome.split(' ')[0]}</h2>
                  <p className="text-[7px] md:text-xs font-bold text-gray-300 uppercase leading-none mb-1">{m.funcao}</p>
                  <p className="text-white font-black text-sm md:text-4xl leading-tight">{m.pontos} <span className="text-[7px] md:text-sm opacity-50">pts</span></p>
                  <div className="mt-1 bg-green-950/50 py-0.5 rounded-full px-1">
                    <p className="text-[5px] md:text-[10px] text-yellow-400 font-bold uppercase truncate">{getPatente(m.pontos).split(' ')[1]}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* CLASSIFICAÇÃO GERAL (4º, 5º...) */}
        <div className="bg-black/30 rounded-[30px] md:rounded-[50px] overflow-hidden shadow-2xl border border-white/5 mb-20">
          <div className="bg-white/5 p-3 text-center font-black text-gray-400 uppercase text-[9px] md:text-sm tracking-widest border-b border-white/5">
            Classificação Geral Ágata
          </div>
          
          <div className="divide-y divide-white/5">
            {geral.map((m, index) => (
              <div key={m._id} className="flex items-center p-4 md:p-8 hover:bg-white/5 transition-all">
                
                {/* LADO ESQUERDO: POSIÇÃO E NOME (BRANCOS) */}
                <div className="flex items-center gap-3 md:gap-12 flex-1 min-w-0">
                  <span className="font-black text-white text-base md:text-5xl w-8 md:w-20 text-center">{index + 4}º</span>
                  <img src={m.foto_url} className="w-10 h-10 md:w-20 md:h-20 rounded-full object-cover border border-white/10 shadow-lg" alt="" />
                  <div className="truncate">
                    <p className="font-black text-sm md:text-3xl text-white uppercase italic tracking-tighter truncate leading-none mb-1">{m.nome}</p>
                    <p className="text-[8px] md:text-sm text-yellow-500/60 font-bold uppercase truncate">{m.funcao} • {getPatente(m.pontos).split(' ')[1]}</p>
                  </div>
                </div>

                {/* LADO DIREITO: PONTOS (AMARELOS) */}
                <div className="text-right ml-4 flex-shrink-0">
                  <p className="font-black text-yellow-400 text-xl md:text-5xl leading-none">{m.pontos}</p>
                  <span className="text-[8px] md:text-xs font-black text-white/20 uppercase tracking-widest block">PONTOS</span>
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
