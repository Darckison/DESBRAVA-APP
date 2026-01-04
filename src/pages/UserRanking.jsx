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
    <div className="min-h-screen bg-green-900 bg-cover bg-center bg-fixed py-6 md:py-10 px-2 md:px-4 font-sans text-white overflow-x-hidden">
      <div className="max-w-5xl mx-auto">
        
        {/* CABEÇALHO */}
        <div className="flex justify-between items-center mb-16 md:mb-24">
            <button onClick={() => navigate('/')} className="bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-lg font-bold border border-white/20 text-[10px] md:text-base">← VOLTAR</button>
            <h1 className="text-xl md:text-4xl font-black uppercase italic flex-1 text-center tracking-tighter">Ranking do Clube</h1>
            <div className="w-10 md:w-20"></div>
        </div>

        {/* PÓDIO ORGANIZADO (2º - 1º - 3º) */}
        <div className="flex justify-center items-end gap-1 md:gap-6 mb-20 w-full max-w-4xl mx-auto">
          {podio.map((m, index) => {
            const isFirst = index === 0;
            const isSecond = index === 1;

            return (
              <div key={m._id} className={`flex flex-col items-center relative transition-all ${
                isFirst ? 'order-2 scale-105 z-20 mb-6 md:mb-10' : 
                isSecond ? 'order-1 z-10' : 
                'order-3 z-10'
              }`}>
                
                {/* NÚMERO DA POSIÇÃO */}
                <div className={`absolute -top-10 md:-top-16 text-4xl md:text-7xl font-black italic drop-shadow-2xl z-30 ${
                    isFirst ? 'text-yellow-400' : isSecond ? 'text-gray-300' : 'text-orange-500'
                }`}>
                    {index + 1}º
                </div>

                {/* CARD DO PÓDIO */}
                <div className={`flex flex-col items-center p-2 md:p-6 rounded-t-[30px] md:rounded-t-[45px] border-x-2 md:border-x-4 border-t-2 md:border-t-4 shadow-2xl relative ${
                  isFirst ? 'bg-yellow-500 border-yellow-300 w-[31vw] md:w-72 min-h-[300px] md:min-h-[480px]' : 
                  isSecond ? 'bg-gray-400 border-gray-300 w-[27vw] md:w-60 min-h-[250px] md:min-h-[380px]' :
                  'bg-orange-600 border-orange-400 w-[27vw] md:w-60 min-h-[250px] md:min-h-[380px]'
                }`}>
                  
                  {/* FOTO */}
                  <div className="relative mb-2 md:mb-4">
                    <img src={m.foto_url} className="w-12 h-12 md:w-28 md:h-28 rounded-full border-2 md:border-4 border-white object-cover shadow-xl" alt="" />
                  </div>
                  
                  {/* NOME COMPLETO REATIVADO AQUI */}
                  <div className="text-center px-1 mb-2">
                    <h2 className="font-black text-[9px] md:text-xl leading-tight text-white uppercase drop-shadow-md">
                      {m.nome}
                    </h2>
                    <p className="text-[7px] md:text-[11px] font-bold text-black/40 uppercase italic">
                      {m.funcao}
                    </p>
                  </div>
                  
                  {/* PATENTE */}
                  <div className="bg-green-950 text-yellow-400 px-1 md:px-4 py-1 md:py-2 rounded-lg md:rounded-2xl shadow-xl border md:border-2 border-green-800 mb-4 w-full max-w-[95%] flex justify-center items-center">
                    <p className="text-[6px] md:text-[10px] font-black text-center uppercase leading-none">
                      {getPatente(m.pontos)}
                    </p>
                  </div>
                  
                  {/* PONTOS */}
                  <div className="mt-auto bg-black/20 w-full py-2 md:py-4 rounded-2xl md:rounded-3xl flex flex-col items-center">
                    <p className="text-lg md:text-4xl font-black text-white">{m.pontos}</p>
                    <span className="text-[6px] md:text-[9px] font-black text-white/70 uppercase">PONTOS</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* CLASSIFICAÇÃO GERAL */}
        <div className="bg-white rounded-[40px] overflow-hidden shadow-2xl border-4 border-white mb-10 text-gray-800">
          <div className="bg-gray-100 p-4 text-center font-black text-gray-400 uppercase text-[10px] tracking-widest">
            Classificação Geral do Clube
          </div>
          {geral.map((m, index) => (
            <div key={m._id} className="flex items-center justify-between p-4 border-b hover:bg-green-50 transition-all">
              <div className="flex items-center gap-3 md:gap-6">
                <span className="font-black text-gray-300 text-xl md:text-3xl w-8 md:w-10 text-center">{index + 4}º</span>
                <img src={m.foto_url} className="w-12 h-12 md:w-16 md:h-16 rounded-full object-cover border-2 md:border-4 border-green-50 shadow-md" alt="" />
                <div>
                  <p className="font-black text-sm md:text-xl leading-none text-green-900">{m.nome}</p>
                  <p className="text-[9px] md:text-[10px] text-gray-400 font-bold uppercase">{m.funcao}</p>
                  <span className="inline-block mt-1 bg-green-100 text-green-800 text-[8px] md:text-[10px] px-2 py-0.5 rounded-full font-black uppercase">
                    {getPatente(m.pontos)}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <p className="font-black text-green-700 text-xl md:text-3xl leading-none">{m.pontos}</p>
                <span className="text-[8px] md:text-[10px] font-black text-gray-400 uppercase">PONTOS</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserRanking;
