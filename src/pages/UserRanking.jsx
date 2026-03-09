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
        <div className="flex justify-between items-center mb-16 md:mb-52 px-2">
            <button onClick={() => navigate('/')} className="z-50 bg-yellow-500 hover:bg-yellow-600 text-green-950 px-2.5 py-1 md:px-6 md:py-2 rounded-full font-black shadow-lg transition-all text-[8px] md:text-xs uppercase italic">← Voltar</button>
            <h1 className="text-lg md:text-6xl font-black uppercase italic flex-1 text-center tracking-tighter text-yellow-500 drop-shadow-[0_2px_15px_rgba(234,179,8,0.5)]">
              Ranking <span className="text-white">Elite Ágata</span>
            </h1>
            <div className="w-6 md:w-20"></div>
        </div>

        {/* PÓDIO - MANTIDO EXATAMENTE IGUAL */}
        <div className="flex flex-row justify-center items-end gap-1 md:gap-8 mb-20 w-full max-w-5xl mx-auto px-1 relative pt-10 md:pt-20">
          {podio[1] && (
            <div className="flex-1 max-w-[105px] md:max-w-[280px] order-1 z-10">
              <div className="bg-white/10 backdrop-blur-xl border-t-2 md:border-t-4 border-gray-400 p-1.5 md:p-8 rounded-t-[15px] md:rounded-t-[30px] rounded-b-[35px] md:rounded-b-[80px] shadow-2xl text-center relative border-x border-white/5">
                <div className="relative -mt-8 md:-mt-24 mb-2 flex justify-center">
                  <img src={podio[1].foto_url} className="w-9 h-9 md:w-32 md:h-32 rounded-full border-2 md:border-4 border-gray-400 object-cover shadow-2xl" alt="" />
                  <span className="absolute -bottom-1 bg-gray-400 text-green-950 font-black px-1.5 py-0.5 rounded-full text-[6px] md:text-sm shadow-lg">2º</span>
                </div>
                <h2 className="font-black text-[8px] md:text-2xl uppercase italic truncate leading-none mb-0.5">{podio[1].nome.split(' ')[0]}</h2>
                <p className="text-[5px] md:text-xs font-bold text-yellow-500/80 uppercase tracking-tighter mb-1 border-b border-white/10 pb-0.5">{podio[1].funcao}</p>
                <p className="text-white font-black text-[10px] md:text-4xl mt-0.5">{podio[1].pontos} <span className="text-[5px] md:text-sm font-normal text-white/50">PTS</span></p>
                <div className="mt-1 bg-gray-400/10 py-0.5 rounded-full"><p className="text-[5px] md:text-xs text-gray-300 font-bold uppercase scale-90">{getPatente(podio[1].pontos).split(' ')[1]}</p></div>
              </div>
            </div>
          )}

          {podio[0] && (
            <div className="flex-1 max-w-[125px] md:max-w-[340px] order-2 z-20 scale-110 mb-5 md:mb-16">
              <div className="bg-green-800/40 backdrop-blur-2xl border-t-2 md:border-t-4 border-yellow-500 p-2 md:p-12 rounded-t-[20px] md:rounded-t-[40px] rounded-b-[45px] md:rounded-b-[100px] shadow-[0_15px_45px_rgba(234,179,8,0.3)] text-center relative border-x border-yellow-500/20">
                <div className="relative -mt-10 md:-mt-32 mb-3 flex justify-center">
                  <div className="absolute -top-4 md:-top-12 text-lg md:text-6xl animate-bounce drop-shadow-md">👑</div>
                  <img src={podio[0].foto_url} className="w-11 h-11 md:w-40 md:h-40 rounded-full border-2 md:border-4 border-yellow-500 object-cover shadow-[0_0_20px_rgba(234,179,8,0.4)]" alt="" />
                  <span className="absolute -bottom-1.5 bg-yellow-500 text-green-950 font-black px-2 py-0.5 rounded-full text-[8px] md:text-xl shadow-xl">1º</span>
                </div>
                <h2 className="font-black text-[9px] md:text-3xl uppercase italic tracking-tighter text-white truncate leading-none mb-0.5">{podio[0].nome.split(' ')[0]}</h2>
                <p className="text-[6px] md:text-sm font-bold text-yellow-400 uppercase mb-1 tracking-widest border-b border-yellow-500/20 pb-0.5">{podio[0].funcao}</p>
                <p className="text-white font-black text-sm md:text-6xl mt-0.5 leading-none drop-shadow-sm">{podio[0].pontos} <span className="text-[7px] md:text-xl font-normal text-white/50">PTS</span></p>
                <div className="mt-1.5 bg-yellow-500/20 py-0.5 md:py-1.5 rounded-full border border-yellow-500/30"><p className="text-[5px] md:text-sm text-yellow-400 font-black uppercase italic leading-none">{getPatente(podio[0].pontos).split(' ')[1]}</p></div>
              </div>
            </div>
          )}

          {podio[2] && (
            <div className="flex-1 max-w-[105px] md:max-w-[280px] order-3 z-10">
              <div className="bg-white/10 backdrop-blur-xl border-t-2 md:border-t-4 border-amber-700 p-1.5 md:p-8 rounded-t-[15px] md:rounded-t-[30px] rounded-b-[35px] md:rounded-b-[80px] shadow-2xl text-center relative">
                <div className="relative -mt-8 md:-mt-24 mb-2 flex justify-center">
                  <img src={podio[2].foto_url} className="w-9 h-9 md:w-32 md:h-32 rounded-full border-2 md:border-4 border-amber-700 object-cover shadow-2xl" alt="" />
                  <span className="absolute -bottom-1 bg-amber-700 text-white font-black px-1.5 py-0.5 rounded-full text-[6px] md:text-sm shadow-lg">3º</span>
                </div>
                <h2 className="font-black text-[8px] md:text-2xl uppercase italic truncate leading-none mb-0.5">{podio[2].nome.split(' ')[0]}</h2>
                <p className="text-[5px] md:text-xs font-bold text-yellow-500/80 uppercase tracking-tighter mb-1 border-b border-white/10 pb-0.5">{podio[2].funcao}</p>
                <p className="text-white font-black text-[10px] md:text-4xl mt-0.5 leading-none">{podio[2].pontos} <span className="text-[5px] md:text-sm font-normal text-white/50">PTS</span></p>
                <div className="mt-1 bg-white/5 py-0.5 rounded-full"><p className="text-[5px] md:text-xs text-orange-400 font-bold uppercase scale-90">{getPatente(podio[2].pontos).split(' ')[1]}</p></div>
              </div>
            </div>
          )}
        </div>

        {/* --- CLASSIFICAÇÃO GERAL CORRIGIDA: NOMES E NÚMEROS BRANCOS --- */}
        <div className="bg-black/40 backdrop-blur-md rounded-[30px] md:rounded-[50px] overflow-hidden shadow-2xl border border-white/5 mb-20 mx-2">
          <div className="bg-white/5 p-3 md:p-6 text-center font-black text-yellow-500 uppercase text-[8px] md:text-sm tracking-[0.2em] md:tracking-[0.4em]">
            Classificação Geral Ágata
          </div>
          <div className="divide-y divide-white/5 px-3 md:px-10">
            {geral.map((m, index) => (
              <div key={m._id} className="flex items-center justify-between py-4 md:py-8 hover:bg-white/5 transition-all">
                
                {/* LADO ESQUERDO: POSIÇÃO (BRANCA), FOTO E NOME (BRANCO) */}
                <div className="flex items-center gap-2 md:gap-12 flex-1 min-w-0">
                  {/* Número da Posição - Agora BRANCO */}
                  <span className="font-black text-white text-base md:text-5xl w-6 md:w-16 text-center">
                    {index + 4}º
                  </span>
                  
                  <img src={m.foto_url} className="w-10 h-10 md:w-20 md:h-20 rounded-full object-cover border border-white/10 shadow-lg flex-shrink-0" alt="" />
                  
                  <div className="min-w-0 flex-1 pr-2">
                    {/* Nome - Garantido em BRANCO */}
                    <p className="font-black text-[10px] md:text-2xl text-white uppercase italic tracking-tighter truncate leading-none mb-1">
                      {m.nome}
                    </p>
                    <p className="text-[6px] md:text-xs text-yellow-500/60 font-bold uppercase tracking-widest truncate">
                      {m.funcao} • {getPatente(m.pontos).split(' ')[1]}
                    </p>
                  </div>
                </div>

                {/* LADO DIREITO: PONTOS - FIXADO E VISÍVEL */}
                <div className="text-right flex-shrink-0">
                  <p className="font-black text-yellow-500 text-base md:text-5xl leading-none">
                    {m.pontos}
                  </p>
                  <span className="text-[6px] md:text-[8px] font-black text-white/30 uppercase tracking-widest block">
                    PONTOS
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
