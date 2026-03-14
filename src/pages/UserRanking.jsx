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
    <div className="min-h-screen bg-black bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-green-950 via-black to-black py-4 md:py-10 px-1 md:px-4 font-sans text-white overflow-x-hidden">
      <div className="max-w-5xl mx-auto flex flex-col min-h-screen">
        
        {/* HEADER */}
        <div className="flex justify-between items-center mb-16 md:mb-40 px-2 pt-4">
            <button onClick={() => navigate('/')} className="bg-green-500 text-black px-4 py-1.5 rounded-full font-black text-[10px] md:text-sm uppercase italic shadow-[0_0_15px_rgba(34,197,94,0.5)] transition-all active:scale-95">← VOLTAR</button>
            <h1 className="text-xl md:text-5xl font-black uppercase italic flex-1 text-center tracking-tighter text-green-500 drop-shadow-[0_0_10px_rgba(34,197,94,0.8)]">
              RANKING <span className="text-white">ELITE ÁGATA</span>
            </h1>
            <div className="w-10 md:w-20"></div>
        </div>

        {/* PÓDIO */}
        <div className="flex flex-row justify-center items-end gap-1 md:gap-6 mb-24 relative px-1">
          {podio.map((m, index) => {
            const isFirst = index === 0;
            const rank = index === 0 ? "1º" : index === 1 ? "2º" : "3º";
            const borderCol = index === 0 ? "border-green-500 shadow-[0_0_20px_rgba(34,197,94,0.4)]" : index === 1 ? "border-white/50" : "border-green-800";
            
            return (
              <div key={m._id} className={`flex flex-col items-center relative transition-all ${
                isFirst ? 'order-2 scale-105 z-20 mb-8 w-[36%]' : 
                index === 1 ? 'order-1 z-10 w-[31%]' : 'order-3 z-10 w-[31%]'
              }`}>
                <div className="relative mb-0 flex justify-center w-full z-30">
                  {isFirst && <div className="absolute -top-10 md:-top-16 text-3xl md:text-6xl drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">👑</div>}
                  <img src={m.foto_url} className={`w-14 h-14 md:w-36 md:h-36 rounded-full border-2 md:border-4 ${borderCol} object-cover shadow-2xl`} alt="" />
                  <span className={`absolute -bottom-2 bg-green-500 text-black font-black px-2 py-0.5 rounded-full text-[9px] md:text-sm shadow-md`}>{rank}</span>
                </div>

                <div className={`bg-green-900/40 backdrop-blur-md pt-10 md:pt-20 pb-6 md:pb-12 px-2 md:px-8 rounded-t-[20px] md:rounded-t-[30px] rounded-b-[50px] md:rounded-b-[100px] border-b-4 ${index === 0 ? 'border-green-500' : 'border-white/20'} w-full text-center -mt-8 md:-mt-16 shadow-2xl`}>
                  <h2 className="font-black text-[10px] md:text-2xl uppercase italic truncate mb-1 text-white">{m.nome.split(' ')[0]}</h2>
                  <p className="text-[7px] md:text-sm font-bold text-green-400/70 uppercase leading-none mb-3">{m.funcao}</p>
                  <div className="w-full h-[1px] bg-white/10 mb-2"></div>
                  <p className="text-[6px] md:text-[10px] text-green-400 font-black uppercase mb-2 tracking-tighter">{getPatente(m.pontos)}</p>
                  <p className="text-white font-black text-xl md:text-6xl leading-none drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">{m.pontos}</p>
                  <p className="text-[6px] md:text-[xs] font-black text-white/30 uppercase mt-1 tracking-widest">PONTOS</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* CLASSIFICAÇÃO GERAL */}
        <div className="max-w-4xl mx-auto flex-1">
          <div className="flex px-4 md:px-8 mb-4 text-[10px] md:text-sm font-black text-green-500 uppercase tracking-widest italic">
            <span className="w-12 text-center text-white/40">POS</span>
            <span className="flex-1 ml-4 text-white/40">DESBRAVADOR</span>
            <span className="w-20 text-center text-white/40">PTS</span>
          </div>

          <div className="space-y-3 pb-10">
            {geral.map((m, index) => (
              <div 
                key={m._id} 
                className="flex items-center bg-white/5 hover:bg-green-500/20 border border-white/10 hover:border-green-500 transition-all rounded-full p-1.5 md:p-2 group shadow-lg"
              >
                <div className="w-10 h-10 md:w-14 md:h-14 flex-shrink-0 bg-green-500 rounded-full flex items-center justify-center font-black text-black text-lg md:text-2xl italic">
                  {index + 4}º
                </div>

                <div className="flex-1 flex items-center ml-4 min-w-0">
                  <img 
                    src={m.foto_url} 
                    className="w-8 h-8 md:w-12 md:h-12 rounded-full object-cover border-2 border-white/20 group-hover:border-white transition-colors" 
                    alt="" 
                  />
                  <div className="ml-3 truncate">
                    <p className="font-black text-xs md:text-2xl text-white uppercase italic tracking-tighter truncate leading-none">
                      {m.nome}
                    </p>
                    <p className="text-[7px] md:text-sm text-green-400/60 font-bold uppercase truncate">
                      {m.funcao} • {getPatente(m.pontos).split(' ')[1]}
                    </p>
                  </div>
                </div>

                <div className="w-20 md:w-32 h-10 md:h-14 bg-green-500 rounded-full flex items-center justify-center font-black text-black text-xl md:text-3xl italic">
                  {m.pontos}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RODAPÉ INTEGRADO (AO FINAL DA LISTA) */}
        <div className="py-12 mt-auto">
          <p className="text-center font-black text-green-500 uppercase italic text-sm md:text-3xl tracking-[0.3em] drop-shadow-[0_0_10px_rgba(34,197,94,0.6)] animate-pulse">
            PARABÉNS A TODOS!
          </p>
        </div>

      </div>
    </div>
  );
};

export default UserRanking;
