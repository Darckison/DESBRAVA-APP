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
        <div className="flex justify-between items-center mb-12 md:mb-32 px-2">
            <button onClick={() => navigate('/')} className="bg-yellow-500 hover:bg-yellow-600 text-green-950 px-3 py-1.5 md:px-6 md:py-2 rounded-full font-black shadow-lg transition-all text-[9px] md:text-xs uppercase italic">← Voltar</button>
            <h1 className="text-xl md:text-5xl font-black uppercase italic flex-1 text-center tracking-tighter text-yellow-500 drop-shadow-[0_2px_10px_rgba(234,179,8,0.4)]">
              Ranking <span className="text-white">Elite Ágata</span>
            </h1>
            <div className="w-8 md:w-20"></div>
        </div>

        {/* PÓDIO FUTURISTA - SEMPRE LADO A LADO (flex-row) */}
        <div className="flex flex-row justify-center items-end gap-1 md:gap-8 mb-20 w-full max-w-5xl mx-auto px-1 relative">
          
          {/* 2º LUGAR */}
          {podio[1] && (
            <div className="flex-1 max-w-[110px] md:max-w-[280px] order-1 z-10 transition-transform">
              <div className="relative">
                <div className="bg-green-900/40 backdrop-blur-xl border-t-2 md:border-t-4 border-gray-400 p-2 md:p-8 rounded-t-[15px] md:rounded-t-[20px] rounded-b-[40px] md:rounded-b-[60px] shadow-2xl text-center">
                  <div className="relative -mt-8 md:-mt-20 mb-2 md:mb-4 flex justify-center">
                    <img src={podio[1].foto_url} className="w-10 h-10 md:w-28 md:h-28 rounded-full border-2 md:border-4 border-gray-400 object-cover shadow-2xl" alt="" />
                    <span className="absolute -bottom-1 bg-gray-400 text-green-950 font-black px-2 py-0.5 rounded-full text-[7px] md:text-sm shadow-lg">2º</span>
                  </div>
                  <h2 className="font-black text-[8px] md:text-xl uppercase italic truncate">{podio[1].nome.split(' ')[0]}</h2>
                  <p className="text-yellow-500 font-black text-xs md:text-3xl mt-0.5 md:mt-1">{podio[1].pontos}</p>
                  <p className="text-[5px] md:text-[10px] text-white/50 font-bold uppercase leading-none mt-1">{getPatente(podio[1].pontos).split(' ')[1]}</p>
                </div>
                <div className="h-1.5 w-full bg-gray-400/20 blur-sm mt-1 rounded-full"></div>
              </div>
            </div>
          )}

          {/* 1º LUGAR (MAIOR E CENTRAL) */}
          {podio[0] && (
            <div className="flex-1 max-w-[130px] md:max-w-[320px] order-2 z-20 scale-110 mb-4 md:mb-12">
              <div className="relative">
                <div className="bg-green-800/60 backdrop-blur-2xl border-t-2 md:border-t-4 border-yellow-500 p-3 md:p-10 rounded-t-[20px] md:rounded-t-[30px] rounded-b-[50px] md:rounded-b-[80px] shadow-[0_15px_45px_rgba(234,179,8,0.25)] text-center relative overflow-hidden">
                  <div className="relative -mt-10 md:-mt-24 mb-3 md:mb-6 flex justify-center">
                    <div className="absolute -top-4 text-lg md:text-5xl animate-bounce">👑</div>
                    <img src={podio[0].foto_url} className="w-12 h-12 md:w-36 md:h-36 rounded-full border-2 md:border-4 border-yellow-500 object-cover shadow-[0_0_20px_rgba(234,179,8,0.4)]" alt="" />
                    <span className="absolute -bottom-2 bg-yellow-500 text-green-950 font-black px-2 py-0.5 rounded-full text-[9px] md:text-lg shadow-xl">1º</span>
                  </div>
                  <h2 className="font-black text-[9px] md:text-2xl uppercase italic tracking-tight text-white truncate">{podio[0].nome.split(' ')[0]}</h2>
                  <p className="text-yellow-400 font-black text-sm md:text-5xl mt-1 md:mt-2 drop-shadow-md">{podio[0].pontos}</p>
                  <div className="mt-1 md:mt-2 inline-block bg-yellow-500/10 px-2 md:px-3 py-0.5 rounded-full border border-yellow-500/20">
                    <span className="text-[5px] md:text-xs text-yellow-500 font-black uppercase italic leading-none">{getPatente(podio[0].pontos).split(' ')[1]}</span>
                  </div>
                </div>
                <div className="h-2 w-full bg-yellow-500/30 blur-lg mt-3 rounded-full animate-pulse"></div>
              </div>
            </div>
          )}

          {/* 3º LUGAR */}
          {podio[2] && (
            <div className="flex-1 max-w-[110px] md:max-w-[280px] order-3 z-10">
              <div className="relative">
                <div className="bg-green-900/40 backdrop-blur-xl border-t-2 md:border-t-4 border-amber-700 p-2 md:p-8 rounded-t-[15px] md:rounded-t-[20px] rounded-b-[40px] md:rounded-b-[60px] shadow-2xl text-center">
                  <div className="relative -mt-8 md:-mt-20 mb-2 md:mb-4 flex justify-center">
                    <img src={podio[2].foto_url} className="w-10 h-10 md:w-28 md:h-28 rounded-full border-2 md:border-4 border-amber-700 object-cover shadow-2xl" alt="" />
                    <span className="absolute -bottom-1 bg-amber-700 text-white font-black px-2 py-0.5 rounded-full text-[7px] md:text-sm shadow-lg">3º</span>
                  </div>
                  <h2 className="font-black text-[8px] md:text-xl uppercase italic truncate">{podio[2].nome.split(' ')[0]}</h2>
                  <p className="text-yellow-500 font-black text-xs md:text-3xl mt-0.5 md:mt-1">{podio[2].pontos}</p>
                  <p className="text-[5px] md:text-[10px] text-white/50 font-bold uppercase leading-none mt-1">{getPatente(podio[2].pontos).split(' ')[1]}</p>
                </div>
                <div className="h-1.5 w-full bg-amber-700/20 blur-sm mt-1 rounded-full"></div>
              </div>
            </div>
          )}
        </div>

        {/* LISTA GERAL (DARK) */}
        <div className="bg-black/40 backdrop-blur-md rounded-[30px] md:rounded-[40px] overflow-hidden shadow-2xl border border-white/5 mb-10 mx-2">
          <div className="bg-white/5 p-3 md:p-4 text-center font-black text-yellow-500/50 uppercase text-[8px] md:text-[10px] tracking-[0.2em] md:tracking-[0.3em]">
            Classificação Geral Ágata
          </div>
          <div className="divide-y divide-white/5 px-2 md:px-6">
            {geral.map((m, index) => (
              <div key={m._id} className="flex items-center justify-between py-3 md:py-5 hover:bg-white/5 transition-all">
                <div className="flex items-center gap-2 md:gap-8">
                  <span className="font-black text-white/20 text-base md:text-4xl w-6 md:w-12 text-center">{index + 4}º</span>
                  <img src={m.foto_url} className="w-10 h-10 md:w-16 md:h-16 rounded-full object-cover border border-white/10" alt="" />
                  <div>
                    <p className="font-black text-xs md:text-xl text-white uppercase italic truncate max-w-[100px] md:max-w-none">{m.nome}</p>
                    <p className="text-[7px] md:text-[10px] text-yellow-500/60 font-bold uppercase truncate">{getPatente(m.pontos)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-black text-yellow-500 text-lg md:text-3xl leading-none">{m.pontos}</p>
                  <span className="text-[7px] md:text-[8px] font-black text-white/30 uppercase">PTS</span>
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
