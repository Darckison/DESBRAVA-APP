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
    <div className="min-h-screen bg-[#063215] py-4 md:py-10 px-1 md:px-4 font-sans text-white overflow-x-hidden">
      <div className="max-w-5xl mx-auto">
        
        {/* HEADER */}
        <div className="flex justify-between items-center mb-16 md:mb-40 px-2 pt-4">
            <button onClick={() => navigate('/')} className="bg-[#f2c00d] text-[#063215] px-4 py-1.5 rounded-full font-black text-[10px] md:text-sm uppercase italic shadow-lg">← VOLTAR</button>
            <h1 className="text-xl md:text-5xl font-black uppercase italic flex-1 text-center tracking-tighter text-[#f2c00d] drop-shadow-md">
              RANKING <span className="text-white">ELITE ÁGATA</span>
            </h1>
            <div className="w-10 md:w-20"></div>
        </div>

        {/* PÓDIO */}
        <div className="flex flex-row justify-center items-end gap-1 md:gap-6 mb-20 relative px-1">
          {podio.map((m, index) => {
            const isFirst = index === 0;
            const rank = index === 0 ? "1º" : index === 1 ? "2º" : "3º";
            const borderCol = index === 0 ? "border-[#f2c00d]" : index === 1 ? "border-[#a1a1a1]" : "border-[#cd7f32]";
            
            return (
              <div key={m._id} className={`flex flex-col items-center relative ${
                isFirst ? 'order-2 scale-105 z-20 mb-8 w-[36%]' : 
                index === 1 ? 'order-1 z-10 w-[31%]' : 'order-3 z-10 w-[31%]'
              }`}>
                <div className="relative mb-0 flex justify-center w-full z-30">
                  {isFirst && <div className="absolute -top-10 md:-top-16 text-3xl md:text-6xl">👑</div>}
                  <img src={m.foto_url} className={`w-14 h-14 md:w-36 md:h-36 rounded-full border-2 md:border-4 ${borderCol} object-cover shadow-2xl`} alt="" />
                  <span className={`absolute -bottom-2 bg-[#f2c00d] text-[#063215] font-black px-2 py-0.5 rounded-full text-[9px] md:text-sm shadow-md`}>{rank}</span>
                </div>

                <div className={`bg-[#0d421f] pt-10 md:pt-20 pb-6 md:pb-12 px-2 md:px-8 rounded-t-[20px] md:rounded-t-[30px] rounded-b-[50px] md:rounded-b-[100px] border-b-4 ${borderCol} w-full text-center -mt-8 md:-mt-16 shadow-xl`}>
                  <h2 className="font-black text-[10px] md:text-2xl uppercase italic truncate mb-1">{m.nome.split(' ')[0]}</h2>
                  <p className="text-[7px] md:text-sm font-bold text-gray-400 uppercase leading-none mb-3">{m.funcao}</p>
                  <div className="w-full h-[1px] bg-white/10 mb-3 md:mb-6"></div>
                  <p className="text-white font-black text-xl md:text-6xl leading-none">{m.pontos}</p>
                  <p className="text-[6px] md:text-xs font-black text-gray-500 uppercase mt-1 tracking-widest">PONTOS</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* CLASSIFICAÇÃO GERAL */}
        <div className="bg-[#0b2915] rounded-[30px] md:rounded-[50px] overflow-hidden shadow-2xl border border-white/5 mb-10 mx-2">
          {/* TÍTULO EM BRANCO PURO */}
          <div className="bg-white/5 py-4 text-center font-black text-white uppercase text-[10px] md:text-sm tracking-[0.4em] border-b border-white/5">
            CLASSIFICAÇÃO GERAL
          </div>
          
          <div className="divide-y divide-white/5 px-4 md:px-12">
            {geral.map((m, index) => (
              <div key={m._id} className="flex items-center justify-between py-5 md:py-10">
                <div className="flex items-center gap-4 md:gap-14 flex-1 min-w-0">
                  {/* NÚMERO DA POSIÇÃO EM BRANCO PURO */}
                  <span className="font-black text-white text-xl md:text-6xl w-10 md:w-24 text-center flex-shrink-0 italic">
                    {index + 4}º
                  </span>
                  
                  <img src={m.foto_url} className="w-12 h-12 md:w-24 md:h-24 rounded-full object-cover border border-white/10" alt="" />
                  
                  <div className="min-w-0 flex-1 ml-1">
                    {/* NOME EM BRANCO PURO */}
                    <p className="font-black text-sm md:text-4xl text-white uppercase italic tracking-tighter truncate leading-none mb-2">
                      {m.nome}
                    </p>
                    <p className="text-[8px] md:text-lg text-[#f2c00d]/60 font-bold uppercase truncate tracking-widest">
                      {m.funcao} • {getPatente(m.pontos).split(' ')[1]}
                    </p>
                  </div>
                </div>

                {/* PONTUAÇÃO À DIREITA */}
                <div className="text-right flex-shrink-0 ml-4">
                  <p className="font-black text-[#f2c00d] text-2xl md:text-7xl leading-none">
                    {m.pontos}
                  </p>
                  <span className="text-[8px] md:text-sm font-black text-white/20 uppercase tracking-widest block">
                    TOTAL
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

export default UserRanking;import React, { useEffect, useState } from 'react';
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
    <div className="min-h-screen bg-[#063215] py-4 md:py-10 px-1 md:px-4 font-sans text-white overflow-x-hidden">
      <div className="max-w-5xl mx-auto">
        
        {/* HEADER */}
        <div className="flex justify-between items-center mb-16 md:mb-40 px-2 pt-4">
            <button onClick={() => navigate('/')} className="bg-[#f2c00d] text-[#063215] px-4 py-1.5 rounded-full font-black text-[10px] md:text-sm uppercase italic shadow-lg">← VOLTAR</button>
            <h1 className="text-xl md:text-5xl font-black uppercase italic flex-1 text-center tracking-tighter text-[#f2c00d] drop-shadow-md">
              RANKING <span className="text-white">ELITE ÁGATA</span>
            </h1>
            <div className="w-10 md:w-20"></div>
        </div>

        {/* PÓDIO */}
        <div className="flex flex-row justify-center items-end gap-1 md:gap-6 mb-20 relative px-1">
          {podio.map((m, index) => {
            const isFirst = index === 0;
            const rank = index === 0 ? "1º" : index === 1 ? "2º" : "3º";
            const borderCol = index === 0 ? "border-[#f2c00d]" : index === 1 ? "border-[#a1a1a1]" : "border-[#cd7f32]";
            
            return (
              <div key={m._id} className={`flex flex-col items-center relative ${
                isFirst ? 'order-2 scale-105 z-20 mb-8 w-[36%]' : 
                index === 1 ? 'order-1 z-10 w-[31%]' : 'order-3 z-10 w-[31%]'
              }`}>
                <div className="relative mb-0 flex justify-center w-full z-30">
                  {isFirst && <div className="absolute -top-10 md:-top-16 text-3xl md:text-6xl">👑</div>}
                  <img src={m.foto_url} className={`w-14 h-14 md:w-36 md:h-36 rounded-full border-2 md:border-4 ${borderCol} object-cover shadow-2xl`} alt="" />
                  <span className={`absolute -bottom-2 bg-[#f2c00d] text-[#063215] font-black px-2 py-0.5 rounded-full text-[9px] md:text-sm shadow-md`}>{rank}</span>
                </div>

                <div className={`bg-[#0d421f] pt-10 md:pt-20 pb-6 md:pb-12 px-2 md:px-8 rounded-t-[20px] md:rounded-t-[30px] rounded-b-[50px] md:rounded-b-[100px] border-b-4 ${borderCol} w-full text-center -mt-8 md:-mt-16 shadow-xl`}>
                  <h2 className="font-black text-[10px] md:text-2xl uppercase italic truncate mb-1">{m.nome.split(' ')[0]}</h2>
                  <p className="text-[7px] md:text-sm font-bold text-gray-400 uppercase leading-none mb-3">{m.funcao}</p>
                  <div className="w-full h-[1px] bg-white/10 mb-3 md:mb-6"></div>
                  <p className="text-white font-black text-xl md:text-6xl leading-none">{m.pontos}</p>
                  <p className="text-[6px] md:text-xs font-black text-gray-500 uppercase mt-1 tracking-widest">PONTOS</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* CLASSIFICAÇÃO GERAL */}
        <div className="bg-[#0b2915] rounded-[30px] md:rounded-[50px] overflow-hidden shadow-2xl border border-white/5 mb-10 mx-2">
          {/* TÍTULO EM BRANCO PURO */}
          <div className="bg-white/5 py-4 text-center font-black text-white uppercase text-[10px] md:text-sm tracking-[0.4em] border-b border-white/5">
            CLASSIFICAÇÃO GERAL
          </div>
          
          <div className="divide-y divide-white/5 px-4 md:px-12">
            {geral.map((m, index) => (
              <div key={m._id} className="flex items-center justify-between py-5 md:py-10">
                <div className="flex items-center gap-4 md:gap-14 flex-1 min-w-0">
                  {/* NÚMERO DA POSIÇÃO EM BRANCO PURO */}
                  <span className="font-black text-white text-xl md:text-6xl w-10 md:w-24 text-center flex-shrink-0 italic">
                    {index + 4}º
                  </span>
                  
                  <img src={m.foto_url} className="w-12 h-12 md:w-24 md:h-24 rounded-full object-cover border border-white/10" alt="" />
                  
                  <div className="min-w-0 flex-1 ml-1">
                    {/* NOME EM BRANCO PURO */}
                    <p className="font-black text-sm md:text-4xl text-white uppercase italic tracking-tighter truncate leading-none mb-2">
                      {m.nome}
                    </p>
                    <p className="text-[8px] md:text-lg text-[#f2c00d]/60 font-bold uppercase truncate tracking-widest">
                      {m.funcao} • {getPatente(m.pontos).split(' ')[1]}
                    </p>
                  </div>
                </div>

                {/* PONTUAÇÃO À DIREITA */}
                <div className="text-right flex-shrink-0 ml-4">
                  <p className="font-black text-[#f2c00d] text-2xl md:text-7xl leading-none">
                    {m.pontos}
                  </p>
                  <span className="text-[8px] md:text-sm font-black text-white/20 uppercase tracking-widest block">
                    TOTAL
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
