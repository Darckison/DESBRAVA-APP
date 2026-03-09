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
    <div className="min-h-screen bg-green-950 bg-gradient-to-b from-green-900 via-green-950 to-black py-4 md:py-10 px-1 md:px-4 font-sans text-white overflow-x-hidden">
      <div className="max-w-6xl mx-auto">
        
        {/* CABEÇALHO */}
        <div className="flex justify-between items-center mb-16 md:mb-40 px-2">
            <button onClick={() => navigate('/')} className="z-50 bg-yellow-500 hover:bg-yellow-600 text-green-950 px-3 py-1.5 md:px-6 md:py-2 rounded-full font-black shadow-lg transition-all text-[9px] md:text-xs uppercase italic">← Voltar</button>
            <h1 className="text-xl md:text-6xl font-black uppercase italic flex-1 text-center tracking-tighter text-yellow-500 drop-shadow-[0_2px_15px_rgba(234,179,8,0.5)]">
              Ranking <span className="text-white">Elite Ágata</span>
            </h1>
            <div className="w-8 md:w-20"></div>
        </div>

        {/* --- PÓDIO DESIGN DE ELITE (SIDE-BY-SIDE) --- */}
        <div className="flex flex-row justify-center items-end gap-1.5 md:gap-8 mb-20 w-full max-w-5xl mx-auto px-1 relative pt-10 md:pt-20">
          
          {podio.map((m, index) => {
            const isFirst = index === 0;
            const rankLabel = index === 0 ? "1º" : index === 1 ? "2º" : "3º";
            
            const themeColor = isFirst ? "text-yellow-400" : index === 1 ? "text-slate-300" : "text-amber-600";
            const borderCol = isFirst ? "border-yellow-500" : index === 1 ? "border-slate-400" : "border-amber-800";
            const bgGradient = isFirst ? "from-yellow-600/20 to-green-900/60" : "from-slate-500/10 to-green-900/60";

            return (
              <div key={m._id} className={`flex-1 flex flex-col items-center transition-all duration-500 ${
                isFirst ? 'order-2 scale-110 z-20 mb-6 md:mb-16' : 
                index === 1 ? 'order-1 z-10' : 'order-3 z-10'
              }`}>
                
                <div className={`relative w-full bg-gradient-to-b ${bgGradient} backdrop-blur-xl border-t-2 md:border-t-4 ${borderCol} p-2 md:p-8 rounded-t-[20px] md:rounded-t-[40px] rounded-b-[40px] md:rounded-b-[100px] shadow-[0_10px_40px_rgba(0,0,0,0.6)] text-center overflow-visible`}>
                  
                  <div className="relative -mt-10 md:-mt-28 mb-3 flex justify-center">
                    {isFirst && <div className="absolute -top-6 md:-top-14 text-2xl md:text-6xl animate-bounce">👑</div>}
                    <div className={`p-1 rounded-full bg-gradient-to-b ${isFirst ? 'from-yellow-400 to-transparent' : 'from-white/20 to-transparent'}`}>
                      <img src={m.foto_url} className="w-11 h-11 md:w-36 md:h-36 rounded-full border-2 md:border-4 border-green-900 object-cover shadow-2xl" alt="" />
                    </div>
                    <span className={`absolute -bottom-1 ${isFirst ? 'bg-yellow-500' : 'bg-white/90'} text-green-950 font-black px-2 py-0.5 rounded-full text-[8px] md:text-sm shadow-xl`}>
                      {rankLabel}
                    </span>
                  </div>

                  <div className="min-h-[50px] md:min-h-[100px] flex flex-col justify-center">
                    <h2 className="font-black text-[9px] md:text-2xl uppercase italic tracking-tighter leading-none mb-1 text-white">
                      {m.nome.split(' ')[0]}
                    </h2>
                    <p className="text-[6px] md:text-xs font-bold text-yellow-500/70 uppercase tracking-widest mb-2 truncate px-1">
                      {m.funcao}
                    </p>
                  </div>

                  <div className="mt-auto pt-2 border-t border-white/5">
                    <p className={`font-black text-sm md:text-5xl leading-none ${themeColor}`}>
                      {m.pontos}
                    </p>
                    <span className="text-[5px] md:text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">PONTOS</span>
                  </div>
                </div>
                <div className={`h-1.5 md:h-3 w-full opacity-20 blur-md mt-2 rounded-full ${isFirst ? 'bg-yellow-500' : 'bg-white'}`}></div>
              </div>
            );
          })}
        </div>

        {/* --- LISTA GERAL (4º LUGAR EM DIANTE) --- */}
        <div className="bg-black/30 backdrop-blur-md rounded-[30px] md:rounded-[60px] overflow-hidden shadow-2xl border border-white/5 mb-20 mx-2">
          <div className="bg-white/5 p-4 text-center font-black text-white/20 uppercase text-[10px] md:text-sm tracking-[0.4em]">
            Classificação Geral
          </div>
          
          <div className="divide-y divide-white/5 px-2 md:px-10">
            {geral.map((m, index) => (
              <div key={m._id} className="flex items-center justify-between py-4 md:py-8 transition-all group">
                <div className="flex items-center gap-3 md:gap-10 flex-1 min-w-0">
                  {/* NÚMERO EM BRANCO */}
                  <span className="font-black text-white text-lg md:text-5xl w-8 md:w-20 text-center opacity-40 group-hover:opacity-100 transition-all italic">
                    {index + 4}º
                  </span>
                  <img src={m.foto_url} className="w-12 h-12 md:w-20 md:h-20 rounded-full object-cover border-2 border-white/10 shadow-lg flex-shrink-0" alt="" />
                  <div className="truncate">
                    {/* NOME EM BRANCO */}
                    <p className="font-black text-sm md:text-3xl text-white uppercase italic tracking-tighter truncate leading-none mb-1">{m.nome}</p>
                    <p className="text-[8px] md:text-xs text-yellow-500/60 font-bold uppercase tracking-widest">{m.funcao} • {getPatente(m.pontos).split(' ')[1]}</p>
                  </div>
                </div>

                <div className="text-right flex-shrink-0 ml-4">
                  <p className="font-black text-yellow-500 text-xl md:text-5xl leading-none drop-shadow-md">{m.pontos}</p>
                  <span className="text-[8px] md:text-xs font-black text-white/20 uppercase tracking-widest block">TOTAL</span>
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
