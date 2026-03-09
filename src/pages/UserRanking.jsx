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
    <div className="min-h-screen bg-green-950 bg-gradient-to-b from-green-900 to-black py-6 md:py-10 px-2 md:px-4 font-sans text-white overflow-x-hidden">
      <div className="max-w-5xl mx-auto">
        
        {/* CABEÇALHO COM ESTILO DO CLUBE */}
        <div className="flex justify-between items-center mb-16 md:mb-24 border-b border-yellow-500/30 pb-4">
            <button onClick={() => navigate('/')} className="bg-yellow-500 hover:bg-yellow-600 text-green-950 px-4 py-2 rounded-full font-black shadow-lg transition-all text-[10px] md:text-sm">← VOLTAR</button>
            <h1 className="text-2xl md:text-5xl font-black uppercase italic flex-1 text-center tracking-tighter text-yellow-500 drop-shadow-lg">
              Ranking <span className="text-white">do Clube</span>
            </h1>
            <div className="w-10 md:w-20"></div>
        </div>

        {/* PÓDIO ORGANIZADO COM PALETA DO CLUBE */}
        <div className="flex justify-center items-end gap-1 md:gap-6 mb-20 w-full max-w-4xl mx-auto pt-10">
          {podio.map((m, index) => {
            const isFirst = index === 0;
            const isSecond = index === 1;

            return (
              <div key={m._id} className={`flex flex-col items-center relative transition-all ${
                isFirst ? 'order-2 scale-110 z-20 mb-8 md:mb-12' : 
                isSecond ? 'order-1 z-10' : 
                'order-3 z-10'
              }`}>
                
                {/* NÚMERO DA POSIÇÃO COM BRILHO */}
                <div className={`absolute -top-12 md:-top-20 text-5xl md:text-8xl font-black italic z-30 drop-shadow-[0_5px_15px_rgba(0,0,0,0.5)] ${
                    isFirst ? 'text-yellow-400' : isSecond ? 'text-gray-300' : 'text-orange-400'
                }`}>
                    {index + 1}º
                </div>

                {/* CARD DO PÓDIO - CORES DE MEDALHA + VERDE CLUBE */}
                <div className={`flex flex-col items-center p-2 md:p-6 rounded-t-[40px] md:rounded-t-[60px] border-x-4 md:border-x-8 border-t-4 md:border-t-8 shadow-[0_20px_50px_rgba(0,0,0,0.6)] relative overflow-hidden ${
                  isFirst ? 'bg-gradient-to-t from-green-900 to-yellow-600 border-yellow-400 w-[32vw] md:w-80 min-h-[320px] md:min-h-[520px]' : 
                  isSecond ? 'bg-gradient-to-t from-green-950 to-gray-500 border-gray-300 w-[28vw] md:w-64 min-h-[260px] md:min-h-[420px]' :
                  'bg-gradient-to-t from-green-950 to-orange-800 border-orange-500 w-[28vw] md:w-64 min-h-[260px] md:min-h-[420px]'
                }`}>
                  
                  {/* FOTO COM BORDA DESTACADA */}
                  <div className="relative mb-3 md:mb-6 mt-4">
                    <img src={m.foto_url} className={`w-14 h-14 md:w-32 md:h-32 rounded-full border-4 md:border-8 object-cover shadow-2xl ${
                      isFirst ? 'border-yellow-400' : 'border-white/50'
                    }`} alt="" />
                    {isFirst && <span className="absolute -top-4 -right-2 text-2xl md:text-5xl">👑</span>}
                  </div>
                  
                  {/* NOME E FUNÇÃO */}
                  <div className="text-center px-1 mb-4">
                    <h2 className="font-black text-[10px] md:text-2xl leading-tight text-white uppercase drop-shadow-md tracking-tight">
                      {m.nome.split(' ')[0]} {/* Mostra o primeiro nome maior */}
                    </h2>
                    <p className="text-[7px] md:text-[12px] font-bold text-white/60 uppercase italic">
                      {m.funcao}
                    </p>
                  </div>
                  
                  {/* PATENTE ESTILO MILITAR/CLUBE */}
                  <div className="bg-white/10 backdrop-blur-md text-yellow-400 px-1 md:px-4 py-1 md:py-3 rounded-lg md:rounded-2xl border border-white/20 mb-6 w-full max-w-[90%] flex justify-center items-center shadow-inner">
                    <p className="text-[6px] md:text-[11px] font-black text-center uppercase leading-none tracking-widest">
                      {getPatente(m.pontos)}
                    </p>
                  </div>
                  
                  {/* BOX DE PONTOS NO RODAPÉ DO CARD */}
                  <div className={`mt-auto w-full py-3 md:py-6 rounded-2xl md:rounded-3xl flex flex-col items-center ${
                    isFirst ? 'bg-yellow-500 text-green-950' : 'bg-black/40 text-white'
                  }`}>
                    <p className="text-xl md:text-5xl font-black">{m.pontos}</p>
                    <span className="text-[7px] md:text-[11px] font-bold uppercase tracking-widest opacity-80">PONTOS</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* CLASSIFICAÇÃO GERAL COM CORES DO CLUBE */}
        <div className="bg-white rounded-[40px] overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.3)] border-b-8 border-yellow-500 mb-20 text-gray-800">
          <div className="bg-green-800 p-5 text-center font-black text-yellow-500 uppercase text-[11px] md:text-sm tracking-[0.2em]">
            Classificação Geral do Clube
          </div>
          
          <div className="max-h-[600px] overflow-y-auto">
            {geral.map((m, index) => (
              <div key={m._id} className="flex items-center justify-between p-5 border-b border-gray-100 hover:bg-yellow-50 transition-all group">
                <div className="flex items-center gap-3 md:gap-8">
                  <span className="font-black text-gray-200 text-2xl md:text-4xl w-10 md:w-14 text-center group-hover:text-yellow-500 transition-colors">
                    {index + 4}
                  </span>
                  <div className="relative">
                    <img src={m.foto_url} className="w-14 h-14 md:w-20 md:h-20 rounded-full object-cover border-4 border-green-50 shadow-lg" alt="" />
                    <div className="absolute -bottom-1 -right-1 bg-yellow-500 w-5 h-5 md:w-7 md:h-7 rounded-full border-2 border-white flex items-center justify-center text-[8px] md:text-[10px] font-bold text-green-950">
                      {index + 4}
                    </div>
                  </div>
                  <div>
                    <p className="font-black text-sm md:text-2xl leading-none text-green-900 uppercase italic tracking-tighter">{m.nome}</p>
                    <p className="text-[9px] md:text-[11px] text-gray-400 font-bold uppercase mt-1 tracking-widest">{m.funcao}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="bg-green-100 text-green-800 text-[8px] md:text-[10px] px-3 py-1 rounded-full font-black uppercase shadow-sm">
                        {getPatente(m.pontos)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right pr-2">
                  <p className="font-black text-green-700 text-2xl md:text-4xl leading-none drop-shadow-sm">{m.pontos}</p>
                  <span className="text-[9px] md:text-[11px] font-black text-gray-300 uppercase tracking-tighter">PONTOS TOTAL</span>
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
