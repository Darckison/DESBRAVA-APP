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
        
        {/* CABEÇALHO - Aumentei a margem inferior (mb-44 no desktop) */}
        <div className="flex justify-between items-center mb-16 md:mb-44 px-2">
            <button onClick={() => navigate('/')} className="z-50 bg-yellow-500 hover:bg-yellow-600 text-green-950 px-3 py-1.5 md:px-6 md:py-2 rounded-full font-black shadow-lg transition-all text-[9px] md:text-xs uppercase italic">← Voltar</button>
            <h1 className="text-xl md:text-6xl font-black uppercase italic flex-1 text-center tracking-tighter text-yellow-500 drop-shadow-[0_2px_15px_rgba(234,179,8,0.5)]">
              Ranking <span className="text-white">Elite Ágata</span>
            </h1>
            <div className="w-8 md:w-20"></div>
        </div>

        {/* PÓDIO - Adicionei preenchimento superior (pt-12) para afastar do título */}
        <div className="flex flex-row justify-center items-end gap-1.5 md:gap-10 mb-20 w-full max-w-5xl mx-auto px-1 relative pt-12 md:pt-20">
          
          {/* 2º LUGAR */}
          {podio[1] && (
            <div className="flex-1 max-w-[110px] md:max-w-[280px] order-1 z-10 transition-transform hover:-translate-y-2">
              <div className="bg-white/10 backdrop-blur-xl border-t-2 md:border-t-4 border-gray-400 p-2 md:p-8 rounded-t-[15px] md:rounded-t-[30px] rounded-b-[40px] md:rounded-b-[80px] shadow-2xl text-center relative border-x border-white/5">
                <div className="relative -mt-10 md:-mt-24 mb-3 flex justify-center">
                  <img src={podio[1].foto_url} className="w-12 h-12 md:w-32 md:h-32 rounded-full border-2 md:border-4 border-gray-400 object-cover shadow-2xl" alt="" />
                  <span className="absolute -bottom-1 bg-gray-400 text-green-950 font-black px-2 py-0.5 rounded-full text-[8px] md:text-sm shadow-lg">2º</span>
                </div>
                <h2 className="font-black text-[9px] md:text-2xl uppercase italic truncate leading-tight mb-1">{podio[1].nome.split(' ')[0]}</h2>
                <p className="text-[6px] md:text-xs font-bold text-yellow-500/80 uppercase tracking-widest mb-2 border-b border-white/10 pb-1">{podio[1].funcao}</p>
                <p className="text-white font-black text-xs md:text-4xl mt-1">{podio[1].pontos} <span className="text-[6px] md:text-sm font-normal text-white/50">PTS</span></p>
                <div className="mt-2 bg-gray-400/10 py-1 rounded-full">
                   <p className="text-[5px] md:text-xs text-gray-300 font-bold uppercase tracking-tighter">{getPatente(podio[1].pontos).split(' ')[1]}</p>
                </div>
              </div>
              <div className="h-2 w-full bg-gray-400/10 blur-md mt-2 rounded-full"></div>
            </div>
          )}

          {/* 1º LUGAR - Reduzi um pouco a margem negativa (-mt-24) */}
          {podio[0] && (
            <div className="flex-1 max-w-[135px] md:max-w-[340px] order-2 z-20 scale-110 mb-6 md:mb-16">
              <div className="bg-green-800/40 backdrop-blur-2xl border-t-4 border-yellow-500 p-3 md:p-12 rounded-t-[25px] md:rounded-t-[40px] rounded-b-[50px] md:rounded-b-[100px] shadow-[0_20px_50px_rgba(234,179,8,0.3)] text-center relative border-x border-yellow-500/20">
                <div className="relative -mt-14 md:-mt-32 mb-4 flex justify-center">
                  <div className="absolute -top-6 md:-top-12 text-2xl md:text-6xl animate-bounce drop-shadow-md">👑</div>
                  <img src={podio[0].foto_url} className="w-14 h-14 md:w-40 md:h-40 rounded-full border-2 md:border-4 border-yellow-500 object-cover shadow-[0_0_30px_rgba(234,179,8,0.4)]" alt="" />
                  <span className="absolute -bottom-2 bg-yellow-500 text-green-950 font-black px-3 py-1 rounded-full text-[10px] md:text-xl shadow-xl">1º</span>
                </div>
                <h2 className="font-black text-[11px] md:text-3xl uppercase italic tracking-tighter text-white truncate leading-tight mb-1">{podio[0].nome.split(' ')[0]}</h2>
                <p className="text-[7px] md:text-sm font-bold text-yellow-400 uppercase mb-2 tracking-widest border-b border-yellow-500/20 pb-1">{podio[0].funcao}</p>
                <p className="text-white font-black text-lg md:text-6xl mt-1 drop-shadow-sm">{podio[0].pontos} <span className="text-[8px] md:text-xl font-normal text-white/50">PTS</span></p>
                <div className="mt-3 bg-yellow-500/20 py-1.5 rounded-full border border-yellow-500/30">
                  <p className="text-[6px] md:text-sm text-yellow-400 font-black uppercase italic tracking-widest">{getPatente(podio[0].pontos).split(' ')[1]}</p>
                </div>
              </div>
              <div className="h-3 w-full bg-yellow-500/20 blur-xl mt-4 rounded-full animate-pulse"></div>
            </div>
          )}

          {/* 3º LUGAR */}
          {podio[2] && (
            <div className="flex-1 max-w-[110px] md:max-w-[280px] order-3 z-10">
              <div className="bg-white/10 backdrop-blur-xl border-t-2 md:border-t-4 border-amber-700 p-2 md:p-8 rounded-t-[15px] md:rounded-t-[30px] rounded-b-[40px] md:rounded-b-[60px] shadow-2xl text-center relative border-x border-white/5">
                <div className="relative -mt-10 md:-mt-24 mb-3 flex justify-center">
                  <img src={podio[2].foto_url} className="w-12 h-12 md:w-32 md:h-32 rounded-full border-2 md:border-4 border-amber-700 object-cover shadow-2xl" alt="" />
                  <span className="absolute -bottom-1 bg-amber-700 text-white font-black px-2 py-0.5 rounded-full text-[8px] md:text-sm shadow-lg">3º</span>
                </div>
                <h2 className="font-black text-[9px] md:text-2xl uppercase italic truncate leading-tight mb-1">{podio[2].nome.split(' ')[0]}</h2>
                <p className="text-[6px] md:text-xs font-bold text-yellow-500/80 uppercase tracking-widest mb-2 border-b border-white/10 pb-1">{podio[2].funcao}</p>
                <p className="text-white font-black text-xs md:text-4xl mt-1">{podio[2].pontos} <span className="text-[6px] md:text-sm font-normal text-white/50">PTS</span></p>
                <div className="mt-2 bg-white/5 py-1 rounded-full">
                   <p className="text-[5px] md:text-xs text-orange-400 font-bold uppercase tracking-tighter">{getPatente(podio[2].pontos).split(' ')[1]}</p>
                </div>
              </div>
              <div className="h-2 w-full bg-amber-700/10 blur-md mt-2 rounded-full"></div>
            </div>
          )}
        </div>

        {/* LISTA GERAL */}
        <div className="bg-black/40 backdrop-blur-md rounded-[30px] md:rounded-[50px] overflow-hidden shadow-2xl border border-white/5 mb-20 mx-2">
          <div className="bg-white/5 p-4 md:p-6 text-center font-black text-yellow-500/40 uppercase text-[9px] md:text-sm tracking-[0.4em]">
            Classificação Geral Ágata
          </div>
          <div className="divide-y divide-white/5 px-2 md:px-10">
            {geral.map((m, index) => (
              <div key={m._id} className="flex items-center justify-between py-4 md:py-8 hover:bg-white/5 transition-all group">
                <div className="flex items-center gap-3 md:gap-12">
                  <span className="font-black text-white/10 text-xl md:text-5xl w-8 md:w-16 text-center group-hover:text-yellow-500 transition-colors">{index + 4}º</span>
                  <img src={m.foto_url} className="w-12 h-12 md:w-20 md:h-20 rounded-full object-cover border-2 border-white/10 shadow-lg" alt="" />
                  <div>
                    <p className="font-black text-sm md:text-2xl text-white uppercase italic tracking-tighter truncate max-w-[140px] md:max-w-none">{m.nome}</p>
                    <p className="text-[8px] md:text-xs text-yellow-500/60 font-bold uppercase tracking-widest">{m.funcao} • {getPatente(m.pontos)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-black text-yellow-500 text-2xl md:text-5xl leading-none drop-shadow-sm">{m.pontos}</p>
                  <span className="text-[8px] md:text-xs font-black text-white/20 uppercase tracking-widest">PONTOS</span>
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
