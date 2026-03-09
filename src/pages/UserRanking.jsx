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
        <div className="flex justify-between items-center mb-16 md:mb-44 px-2">
            <button onClick={() => navigate('/')} className="z-50 bg-yellow-500 text-green-950 px-3 py-1 md:px-6 md:py-2 rounded-full font-black text-[10px] md:text-xs uppercase italic">← Voltar</button>
            <h1 className="text-xl md:text-5xl font-black uppercase italic flex-1 text-center text-yellow-500">Ranking Elite</h1>
            <div className="w-8 md:w-20"></div>
        </div>

        {/* PÓDIO (LADO A LADO) */}
        <div className="flex flex-row justify-center items-end gap-1 md:gap-8 mb-20 px-1 relative pt-10">
          {podio.map((m, index) => {
            const isFirst = index === 0;
            const rank = index === 0 ? "1º" : index === 1 ? "2º" : "3º";
            const borderCol = index === 0 ? "border-yellow-500" : index === 1 ? "border-gray-400" : "border-amber-700";
            return (
              <div key={m._id} className={`flex-1 ${isFirst ? 'max-w-[130px] md:max-w-[340px] scale-110 z-20 mb-5' : 'max-w-[100px] md:max-w-[280px] z-10'} order-${index === 1 ? '1' : index === 0 ? '2' : '3'}`}>
                <div className={`bg-white/10 backdrop-blur-md border-t-2 md:border-t-4 ${borderCol} p-1.5 md:p-8 rounded-t-[15px] md:rounded-t-[40px] rounded-b-[30px] md:rounded-b-[100px] shadow-2xl text-center relative`}>
                  <div className={`relative ${isFirst ? '-mt-10 md:-mt-32 mb-2' : '-mt-8 md:-mt-24 mb-2'} flex justify-center`}>
                    <img src={m.foto_url} className={`${isFirst ? 'w-12 h-12 md:w-36 md:h-36' : 'w-10 h-10 md:w-28 md:h-28'} rounded-full border-2 md:border-4 ${borderCol} object-cover`} alt="" />
                    <span className="absolute -bottom-1 bg-white text-black font-black px-1.5 py-0.5 rounded-full text-[8px] md:text-sm">{rank}</span>
                  </div>
                  <h2 className="font-black text-[9px] md:text-xl uppercase truncate leading-none">{m.nome.split(' ')[0]}</h2>
                  <p className="text-white font-black text-[10px] md:text-3xl mt-1">{m.pontos} <span className="text-[6px] md:text-sm opacity-50">PTS</span></p>
                </div>
              </div>
            );
          })}
        </div>

        {/* LISTA GERAL - AJUSTE DE TAMANHO REAL */}
        <div className="bg-black/40 backdrop-blur-md rounded-[20px] md:rounded-[50px] overflow-hidden shadow-2xl border border-white/5 mb-20 mx-2">
          <div className="bg-white/5 p-3 text-center font-black text-yellow-500 uppercase text-[9px] md:text-sm tracking-widest">Geral</div>
          
          <div className="divide-y divide-white/5 px-2 md:px-10">
            {geral.map((m, index) => (
              <div key={m._id} className="flex items-center py-3 md:py-6">
                
                {/* 1. POSIÇÃO (TAMANHO FIXO) */}
                <div className="w-8 md:w-20 flex-shrink-0 text-center">
                  <span className="font-black text-white text-sm md:text-4xl italic">
                    {index + 4}º
                  </span>
                </div>
                
                {/* 2. FOTO (TAMANHO FIXO) */}
                <div className="flex-shrink-0 mr-3">
                  <img src={m.foto_url} className="w-10 h-10 md:w-16 md:h-16 rounded-full object-cover border border-white/10" alt="" />
                </div>
                
                {/* 3. NOME (FLEXÍVEL - OCUPA O CENTRO) */}
                <div className="flex-1 min-w-0 mr-2">
                  <p className="font-black text-[11px] md:text-2xl text-white uppercase italic truncate">
                    {m.nome}
                  </p>
                  <p className="text-[8px] md:text-sm text-yellow-500/70 font-bold uppercase truncate">
                    {m.funcao}
                  </p>
                </div>

                {/* 4. PONTOS (TAMANHO FIXO NA DIREITA) */}
                <div className="w-14 md:w-32 flex-shrink-0 text-right">
                  <p className="font-black text-yellow-500 text-sm md:text-4xl leading-none">
                    {m.pontos}
                  </p>
                  <span className="text-[7px] md:text-xs font-black text-white/30 uppercase block">PONTOS</span>
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
