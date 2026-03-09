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
    <div className="min-h-screen bg-green-950 bg-gradient-to-b from-green-900 via-green-950 to-black py-4 md:py-12 px-1 md:px-6 font-sans text-white overflow-x-hidden">
      <div className="max-w-7xl mx-auto">
        
        {/* CABEÇALHO - Aumentado para o PC não cortar a coroa */}
        <div className="flex justify-between items-center mb-16 md:mb-64 px-4">
            <button onClick={() => navigate('/')} className="z-50 bg-yellow-500 hover:bg-yellow-600 text-green-950 px-3 py-1.5 md:px-8 md:py-3 rounded-full font-black shadow-2xl transition-all text-[10px] md:text-sm uppercase italic active:scale-95">← Voltar</button>
            <h1 className="text-xl md:text-7xl font-black uppercase italic flex-1 text-center tracking-tighter text-yellow-500 drop-shadow-[0_5px_15px_rgba(234,179,8,0.5)]">
              Ranking <span className="text-white">Elite Ágata</span>
            </h1>
            <div className="w-10 md:w-32"></div>
        </div>

        {/* PÓDIO - SEMPRE LADO A LADO E BLINDADO */}
        <div className="flex flex-row justify-center items-end gap-1 md:gap-12 mb-24 w-full max-w-6xl mx-auto px-1 relative pt-10 md:pt-24">
          
          {/* 2º LUGAR */}
          {podio[1] && (
            <div className="flex-1 max-w-[105px] md:max-w-[320px] order-1 z-10">
              <div className="bg-white/10 backdrop-blur-xl border-t-2 md:border-t-[6px] border-gray-400 p-1.5 md:p-10 rounded-t-[15px] md:rounded-t-[40px] rounded-b-[40px] md:rounded-b-[100px] shadow-2xl text-center relative border-x border-white/5 overflow-hidden">
                <div className="relative -mt-10 md:-mt-28 mb-3 flex justify-center">
                  <img src={podio[1].foto_url} className="w-10 h-10 md:w-36 md:h-36 rounded-full border-2 md:border-4 border-gray-400 object-cover shadow-2xl" alt="" />
                  <span className="absolute -bottom-2 bg-gray-400 text-green-950 font-black px-2.5 py-1 md:py-1.5 rounded-full text-[10px] md:text-2xl shadow-lg border border-white/20">2º</span>
                </div>
                <div className="w-full px-1 overflow-hidden">
                  <h2 className="font-black text-[9px] md:text-3xl uppercase italic truncate leading-tight mb-1">{podio[1].nome.split(' ')[0]}</h2>
                  <p className="text-[6px] md:text-sm font-bold text-yellow-500/80 uppercase tracking-widest mb-2 border-b border-white/10 pb-1 truncate">{podio[1].funcao}</p>
                </div>
                <p className="text-white font-black text-sm md:text-5xl mt-1 truncate">{podio[1].pontos} <span className="text-[6px] md:text-xl font-normal opacity-50">PTS</span></p>
                <div className="mt-2 md:mt-4 bg-gray-400/10 py-1 md:py-2 rounded-full border border-white/5 mx-1">
                   <p className="text-[5px] md:text-xs text-gray-300 font-bold uppercase tracking-widest truncate">{getPatente(podio[1].pontos).split(' ')[1]}</p>
                </div>
              </div>
            </div>
          )}

          {/* 1º LUGAR */}
          {podio[0] && (
            <div className="flex-1 max-w-[125px] md:max-w-[380px] order-2 z-20 scale-110 md:scale-125 mb-6 md:mb-20">
              <div className="bg-green-800/40 backdrop-blur-2xl border-t-2 md:border-t-[8px] border-yellow-500 p-2 md:p-14 rounded-t-[20px] md:rounded-t-[40px] rounded-b-[50px] md:rounded-b-[120px] shadow-[0_20px_60px_rgba(234,179,8,0.4)] text-center relative border-x border-yellow-500/20 overflow-hidden">
                <div className="relative -mt-14 md:-mt-40 mb-4 flex justify-center">
                  <div className="absolute -top-6 md:-top-16 text-2xl md:text-7xl animate-bounce drop-shadow-[0_0_15px_rgba(234,179,8,0.8)]">👑</div>
                  <img src={podio[0].foto_url} className="w-13 h-13 md:w-48 md:h-48 rounded-full border-2 md:border-[6px] border-yellow-500 object-cover shadow-[0_0_40px_rgba(234,179,8,0.5)]" alt="" />
                  <span className="absolute -bottom-3 md:-bottom-5 bg-yellow-500 text-green-950 font-black px-3 py-1 md:py-2 rounded-full text-[12px] md:text-3xl shadow-xl border-2 border-yellow-300">1º</span>
                </div>
                <div className="w-full px-1 overflow-hidden">
                  <h2 className="font-black text-[10px] md:text-4xl uppercase italic tracking-tighter text-white truncate leading-tight mb-1">{podio[0].nome.split(' ')[0]}</h2>
                  <p className="text-[7px] md:text-base font-bold text-yellow-400 uppercase mb-3 tracking-widest border-b border-yellow-500/30 pb-1 truncate">{podio[0].funcao}</p>
                </div>
                <p className="text-white font-black text-lg md:text-7xl mt-1 truncate">{podio[0].pontos} <span className="text-[9px] md:text-2xl font-normal opacity-50">PTS</span></p>
                <div className="mt-3 md:mt-6 bg-yellow-500/20 py-1 md:py-3 rounded-full border border-yellow-500/30 mx-1">
                  <p className="text-[6px] md:text-sm text-yellow-400 font-black uppercase italic tracking-widest truncate">{getPatente(podio[0].pontos).split(' ')[1]}</p>
                </div>
              </div>
            </div>
          )}

          {/* 3º LUGAR */}
          {podio[2] && (
            <div className="flex-1 max-w-[105px] md:max-w-[320px] order-3 z-10">
              <div className="bg-white/10 backdrop-blur-xl border-t-2 md:border-t-[6px] border-amber-700 p-1.5 md:p-10 rounded-t-[15px] md:rounded-t-[40px] rounded-b-[40px] md:rounded-b-[100px] shadow-2xl text-center relative border-x border-white/5 overflow-hidden">
                <div className="relative -mt-10 md:-mt-28 mb-3 flex justify-center">
                  <img src={podio[2].foto_url} className="w-10 h-10 md:w-36 md:h-36 rounded-full border-2 md:border-4 border-amber-700 object-cover shadow-2xl" alt="" />
                  <span className="absolute -bottom-2 bg-amber-700 text-white font-black px-3 py-1 md:py-1.5 rounded-full text-[10px] md:text-2xl shadow-lg border border-white/20">3º</span>
                </div>
                <div className="w-full px-1 overflow-hidden">
                  <h2 className="font-black text-[9px] md:text-3xl uppercase italic truncate leading-tight mb-1">{podio[2].nome.split(' ')[0]}</h2>
                  <p className="text-[6px] md:text-sm font-bold text-yellow-500/80 uppercase tracking-widest mb-2 border-b border-white/10 pb-1 truncate">{podio[2].funcao}</p>
                </div>
                <p className="text-white font-black text-sm md:text-5xl mt-1 truncate">{podio[2].pontos} <span className="text-[6px] md:text-xl font-normal opacity-50">PTS</span></p>
                <div className="mt-2 md:mt-4 bg-white/5 py-1 md:py-2 rounded-full border border-white/5 mx-1">
                   <p className="text-[5px] md:text-xs text-orange-400 font-bold uppercase tracking-widest truncate">{getPatente(podio[2].pontos).split(' ')[1]}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* LISTA GERAL - TÍTULO BRANCO E LISTA LIMPA */}
        <div className="bg-black/40 backdrop-blur-md rounded-[30px] md:rounded-[60px] overflow-hidden shadow-2xl border border-white/5 mb-20 mx-2 md:mx-0">
          <div className="bg-white/10 p-4 md:p-8 text-center font-black text-white uppercase text-[10px] md:text-base tracking-[0.5em]">
            Classificação Geral Ágata
          </div>
          <div className="divide-y divide-white/5 px-4 md:px-16">
            {geral.map((m, index) => (
              <div key={m._id} className="flex items-center justify-between py-4 md:py-10 hover:bg-white/5 transition-all">
                <div className="flex items-center gap-3 md:gap-16">
                  <span className="font-black text-white/10 text-xl md:text-6xl w-8 md:w-20 text-center">{index + 4}º</span>
                  <div className="relative">
                    {/* Foto sem o badge amarelo de rank */}
                    <img src={m.foto_url} className="w-12 h-12 md:w-24 md:h-24 rounded-full object-cover border-2 border-white/10 shadow-xl" alt="" />
                  </div>
                  <div className="overflow-hidden">
                    <p className="font-black text-sm md:text-3xl text-white uppercase italic tracking-tighter truncate max-w-[130px] md:max-w-none leading-none">{m.nome}</p>
                    <p className="text-[8px] md:text-sm text-yellow-500/60 font-bold uppercase tracking-[0.2em] mt-1 truncate max-w-[130px] md:max-w-none">{m.funcao} • {getPatente(m.pontos).split(' ')[1]}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-black text-yellow-500 text-2xl md:text-6xl leading-none drop-shadow-md">{m.pontos}</p>
                  <span className="text-[8px] md:text-sm font-black text-white/20 uppercase tracking-[0.3em]">PONTOS</span>
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
