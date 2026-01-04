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
      })
      .catch(err => console.error("Erro ao carregar ranking:", err));
  }, []);

  const getPatente = (pontos) => {
    if (pontos >= 500) return "💎 EXCELÊNCIA";
    if (pontos >= 400) return "🥇 DIAMANTE";
    if (pontos >= 200)  return "🎖️ OURO";
    if (pontos >= 100)  return "🎖️ PRATA";
    if (pontos >= 50)   return "🎖️ BRONZE";
    return "🌱 ASPIRANTE";
  };

  const podio = membros.slice(0, 3);
  const geral = membros.slice(3);

  return (
    // Adicionado overflow-x-hidden para evitar que a página inteira balance para os lados
    <div className="min-h-screen bg-cover bg-center bg-fixed py-10 px-4 font-sans text-white overflow-x-hidden" style={{ backgroundImage: "url('/FUNDOAPP.png')" }}>
      <div className="max-w-5xl mx-auto">
        
        {/* CABEÇALHO */}
        <div className="flex justify-between items-center mb-16 md:mb-24">
            <button onClick={() => navigate('/')} className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg font-bold border border-white/20 text-xs">← VOLTAR</button>
            <h1 className="text-2xl md:text-4xl font-black uppercase italic flex-1 text-center">Ranking do Clube</h1>
            <div className="w-10 md:w-20"></div>
        </div>

        {/* PÓDIO ADAPTADO PARA MOBILE: Agora desliza para o lado no celular */}
        <div className="flex overflow-x-auto md:overflow-visible gap-4 md:gap-6 mb-24 pb-10 snap-x scrollbar-hide items-end justify-start md:justify-center">
          {podio.map((m, index) => {
            const isFirst = index === 0;
            const isSecond = index === 1;

            return (
              <div key={m._id} className={`flex flex-col items-center relative snap-center flex-shrink-0 ${
                isFirst ? 'order-2 scale-105 mb-10' : isSecond ? 'order-1' : 'order-3'
              }`}>
                
                {/* NÚMERO DA POSIÇÃO */}
                <div className={`absolute -top-12 md:-top-16 text-5xl md:text-7xl font-black italic drop-shadow-2xl z-30 ${
                    isFirst ? 'text-yellow-400' : isSecond ? 'text-gray-300' : 'text-orange-500'
                }`}>
                    {index + 1}º
                </div>

                {/* CARD DINÂMICO - Ajustado larguras para caber no mobile */}
                <div className={`flex flex-col items-center p-6 rounded-t-[45px] border-x-4 border-t-4 shadow-2xl relative ${
                  isFirst ? 'bg-yellow-500 border-yellow-300 w-64 md:w-72 min-h-[440px] md:min-h-[480px]' : 
                  'bg-white/10 backdrop-blur-md border-white/20 w-56 md:w-60 min-h-[340px] md:min-h-[380px]'
                } ${index === 1 ? 'bg-gray-400 border-gray-300' : index === 2 ? 'bg-orange-600 border-orange-400' : ''}`}>
                  
                  <div className="relative mb-4">
                    <img src={m.foto_url || "https://via.placeholder.com/150"} className="w-24 h-24 md:w-28 md:h-28 rounded-full border-4 border-white object-cover shadow-xl" alt="" />
                  </div>
                  
                  <h2 className="font-black text-center text-lg md:text-xl leading-tight text-white uppercase mb-1 drop-shadow-md">
                    {m.nome}
                  </h2>
                  
                  <p className="text-[10px] md:text-[11px] font-bold text-black/50 uppercase italic mb-6">
                    {m.funcao}
                  </p>
                  
                  <div className="bg-green-950 text-yellow-400 px-4 py-2 rounded-2xl shadow-xl border-2 border-green-800 mb-6 w-full flex justify-center items-center">
                    <p className="text-[9px] font-black text-center uppercase leading-none">
                      {getPatente(m.pontos)}
                    </p>
                  </div>
                  
                  <div className="mt-auto bg-black/20 w-full py-4 rounded-3xl flex flex-col items-center">
                    <p className="text-3xl md:text-4xl font-black text-white">{m.pontos}</p>
                    <span className="text-[8px] font-black text-white/70 uppercase tracking-widest text-center">Pontos Totais</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* CLASSIFICAÇÃO GERAL - Container com rolagem lateral para evitar cortes */}
        <div className="bg-white rounded-[32px] md:rounded-[40px] overflow-hidden shadow-2xl border-4 border-white mb-10">
          <div className="bg-gray-100 p-4 text-center font-black text-gray-400 uppercase text-[10px] tracking-[0.2em]">
            Classificação Geral do Clube
          </div>
          <div className="overflow-x-auto"> {/* Garante que a linha não quebre ou suma no mobile */}
              {geral.map((m, index) => (
                <div key={m._id} className="flex items-center justify-between p-4 md:p-6 border-b hover:bg-green-50 transition-all min-w-[320px]">
                  <div className="flex items-center gap-3 md:gap-6">
                    <span className="font-black text-gray-300 text-xl md:text-3xl w-8 md:w-10 text-center">{index + 4}º</span>
                    <img src={m.foto_url || "https://via.placeholder.com/150"} className="w-12 h-12 md:w-16 md:h-16 rounded-full object-cover border-2 md:border-4 border-green-50 shadow-md" alt="" />
                    <div>
                      <p className="font-black text-gray-900 text-sm md:text-xl leading-none">{m.nome}</p>
                      <p className="text-[8px] md:text-[10px] text-gray-400 font-bold uppercase mb-1 md:mb-2">{m.funcao}</p>
                      <span className="bg-green-900 text-white text-[8px] md:text-[10px] px-2 md:px-3 py-1 rounded-full font-black uppercase">
                        {getPatente(m.pontos)}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-green-700 text-2xl md:text-3xl leading-none">{m.pontos}</p>
                    <span className="text-[8px] md:text-[10px] font-black text-gray-400 uppercase">PONTOS</span>
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
