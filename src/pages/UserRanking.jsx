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
    if (pontos >= 200)  return "🎖️ OURO";
    if (pontos >= 100)  return "🎖️ PRATA";
    if (pontos >= 50)  return "🎖️ BRONZE";
    return "🌱 ASPIRANTE";
  };

  const podio = membros.slice(0, 3);
  const geral = membros.slice(3);

  return (
    <div className="min-h-screen bg-green-900 bg-fixed py-10 px-2 font-sans text-white overflow-x-hidden">
      {/* CSS DA MOVIMENTAÇÃO */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        .animate-float { animation: float 4s ease-in-out infinite; }
      `}</style>

      <div className="max-w-5xl mx-auto">
        
        {/* CABEÇALHO */}
        <div className="flex justify-between items-center mb-20 gap-2">
            <button onClick={() => navigate('/')} className="bg-white/10 text-white px-3 py-2 rounded-lg font-bold border border-white/20 text-[10px] sm:text-base">← VOLTAR</button>
            <h1 className="text-xl sm:text-4xl font-black uppercase italic flex-1 text-center">Ranking do Clube</h1>
            <div className="w-8 sm:w-20"></div>
        </div>

        {/* PÓDIO - CARDS BEM PEQUENOS NO MOBILE PARA NÃO CORTAR */}
        <div className="flex overflow-x-auto sm:overflow-visible sm:justify-center items-end gap-2 md:gap-8 mb-24 pb-12 snap-x scrollbar-hide px-4">
          {podio.map((m, index) => {
            const isFirst = index === 0;
            const isSecond = index === 1;

            return (
              <div key={m._id} className={`flex flex-col items-center relative flex-shrink-0 snap-center animate-float ${
                isFirst ? 'order-2 scale-105 z-20 mb-10' : isSecond ? 'order-1 z-10' : 'order-3 z-10'
              }`}>
                
                {/* POSIÇÃO */}
                <div className={`absolute -top-12 text-4xl sm:text-7xl font-black italic drop-shadow-2xl z-30 ${
                    isFirst ? 'text-yellow-400' : isSecond ? 'text-gray-300' : 'text-orange-500'
                }`}>
                    {index + 1}º
                </div>

                {/* LARGURA MÍNIMA PARA NÃO CORTAR: 50vw e 45vw */}
                <div className={`flex flex-col items-center p-4 rounded-t-[35px] border-x-4 border-t-4 shadow-2xl relative ${
                  isFirst ? 'bg-yellow-500 border-yellow-300 w-[50vw] sm:w-72 min-h-[380px] sm:min-h-[480px]' : 
                  'bg-white/10 backdrop-blur-md border-white/20 w-[45vw] sm:w-60 min-h-[300px] sm:min-h-[380px]'
                } ${index === 1 ? 'bg-gray-400 border-gray-300' : index === 2 ? 'bg-orange-600 border-orange-400' : ''}`}>
                  
                  {/* FOTO REDUZIDA NO MOBILE */}
                  <div className="relative mb-3">
                    <img src={m.foto_url} className="w-16 h-16 sm:w-28 sm:h-28 rounded-full border-2 sm:border-4 border-white object-cover shadow-xl" alt="" />
                  </div>
                  
                  <h2 className="font-black text-center text-[12px] sm:text-xl leading-tight text-white uppercase mb-1 truncate w-full px-1">
                    {m.nome}
                  </h2>
                  
                  <p className="text-[8px] sm:text-[11px] font-bold text-black/40 uppercase italic mb-4">
                    {m.funcao}
                  </p>
                  
                  <div className="bg-green-950 text-yellow-400 px-2 py-1 rounded-xl shadow-xl border border-green-800 mb-4 w-full max-w-[95%]">
                    <p className="text-[7px] sm:text-[10px] font-black text-center uppercase">
                      {getPatente(m.pontos)}
                    </p>
                  </div>
                  
                  <div className="mt-auto bg-black/20 w-full py-3 rounded-2xl flex flex-col items-center">
                    <p className="text-xl sm:text-4xl font-black text-white">{m.pontos}</p>
                    <span className="text-[6px] sm:text-[9px] font-black text-white/70 uppercase">Pontos Totais</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* LISTA GERAL */}
        <div className="bg-white rounded-[25px] sm:rounded-[40px] overflow-hidden shadow-2xl border-2 sm:border-4 border-white mb-10">
          <div className="bg-gray-100 p-4 text-center font-black text-gray-400 uppercase text-[8px] sm:text-xs tracking-widest">
            Classificação Geral
          </div>
          <div className="overflow-x-auto">
              {geral.map((m, index) => (
                <div key={m._id} className="flex items-center justify-between p-3 sm:p-6 border-b min-w-[300px]">
                  <div className="flex items-center gap-2 sm:gap-6">
                    <span className="font-black text-gray-200 text-lg sm:text-3xl w-6 sm:w-10 text-center">{index + 4}º</span>
                    <img src={m.foto_url} className="w-8 h-8 sm:w-16 sm:h-16 rounded-full object-cover shadow-sm" alt="" />
                    <div>
                      <p className="font-black text-gray-900 text-[12px] sm:text-xl leading-none">{m.nome}</p>
                      <p className="text-[7px] sm:text-[10px] text-gray-400 font-bold uppercase">{m.funcao}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-green-700 text-lg sm:text-3xl leading-none">{m.pontos}</p>
                    <span className="text-[7px] sm:text-[10px] font-black text-gray-400 uppercase">PONTOS</span>
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
