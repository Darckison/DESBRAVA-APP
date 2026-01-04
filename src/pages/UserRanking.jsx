import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const UserRanking = () => {
  const [membros, setMembros] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Certifique-se de substituir pelo seu link real do Render
    fetch('https://desbrava-app.onrender.com/membros')
      .then(res => res.json())
      .then(data => {
        // Ordena por pontos antes de separar o pódio
        const ordenados = data.sort((a, b) => b.pontos - a.pontos);
        setMembros(ordenados);
      });
  }, []);

  const getPatente = (pontos) => {
    if (pontos >= 500) return "💎 EXCELÊNCIA";
    if (pontos >= 400) return "🥇 DIAMANTE";
    if (pontos >= 200) return "🎖️ OURO";
    if (pontos >= 100) return "🎖️ PRATA";
    if (pontos >= 50) return "🎖️ BRONZE";
    return "🌱 ASPIRANTE";
  };

  const podio = membros.slice(0, 3);
  const geral = membros.slice(3);

  return (
    <div className="min-h-screen bg-[#064e3b] bg-cover bg-center bg-fixed py-10 px-4 font-sans text-white overflow-x-hidden">
      <div className="max-w-5xl mx-auto">
        
        {/* CABEÇALHO */}
        <div className="flex justify-between items-center mb-20">
            <button onClick={() => navigate('/')} className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg font-bold border border-white/20 text-xs">← VOLTAR</button>
            <h1 className="text-2xl md:text-4xl font-black uppercase italic flex-1 text-center">Ranking do Clube</h1>
            <div className="w-20 md:block hidden"></div>
        </div>

        {/* SEÇÃO DO PÓDIO COM MOVIMENTO LATERAL NO MOBILE */}
        <div className="flex overflow-x-auto gap-4 pb-12 pt-16 snap-x scrollbar-hide items-end md:justify-center md:flex-wrap mb-10">
          {podio.map((m, index) => {
            const isFirst = index === 0;
            const isSecond = index === 1;

            return (
              <div 
                key={m._id} 
                className={`flex flex-col items-center relative flex-shrink-0 snap-center ${
                  /* Ajuste de largura para não cortar lateralmente */
                  'min-w-[85vw] md:min-w-0 md:w-auto'
                } ${
                  isFirst ? 'md:order-2 md:scale-105 md:mb-10' : isSecond ? 'md:order-1' : 'order-3'
                }`}
              >
                
                {/* NÚMERO DA POSIÇÃO - Ajustado para não cortar no topo */}
                <div className={`absolute -top-12 md:-top-16 text-6xl md:text-7xl font-black italic drop-shadow-2xl z-30 ${
                    isFirst ? 'text-yellow-400' : isSecond ? 'text-gray-300' : 'text-orange-500'
                }`}>
                    {index + 1}º
                </div>

                {/* CARD PRINCIPAL */}
                <div className={`flex flex-col items-center p-6 rounded-t-[45px] border-x-4 border-t-4 shadow-2xl relative ${
                  isFirst ? 'bg-yellow-500 border-yellow-300 w-full md:w-72 min-h-[450px]' : 
                  'bg-white/10 backdrop-blur-md border-white/20 w-full md:w-60 min-h-[380px]'
                } ${index === 1 ? 'bg-gray-400 border-gray-300' : index === 2 ? 'bg-orange-600 border-orange-400' : ''}`}>
                  
                  {/* FOTO */}
                  <div className="relative mb-4 mt-4">
                    <img src={m.foto_url} className="w-28 h-28 rounded-full border-4 border-white object-cover shadow-xl" alt="" />
                  </div>
                  
                  {/* NOME */}
                  <h2 className="font-black text-center text-xl leading-tight text-white uppercase mb-1 drop-shadow-md">
                    {m.nome}
                  </h2>
                  
                  {/* FUNÇÃO */}
                  <p className="text-[11px] font-bold text-black/50 uppercase italic mb-6">
                    {m.funcao}
                  </p>
                  
                  {/* PATENTE */}
                  <div className="bg-green-950 text-yellow-400 px-4 py-2 rounded-2xl shadow-xl border-2 border-green-800 mb-6 w-full max-w-[90%] flex justify-center items-center">
                    <p className="text-[10px] font-black text-center uppercase leading-none">
                      {getPatente(m.pontos)}
                    </p>
                  </div>
                  
                  {/* BOX DE PONTOS */}
                  <div className="mt-auto bg-black/20 w-full py-4 rounded-3xl flex flex-col items-center">
                    <p className="text-4xl font-black text-white">{m.pontos}</p>
                    <span className="text-[9px] font-black text-white/70 uppercase tracking-widest">Pontos Totais</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* AVISO DE DESLIZE (APENAS MOBILE) */}
        <p className="text-center text-white/30 text-[10px] font-bold uppercase mb-10 md:hidden">
            ← Deslize para ver o pódio →
        </p>

        {/* CLASSIFICAÇÃO GERAL */}
        <div className="bg-white rounded-[40px] overflow-hidden shadow-2xl border-4 border-white mb-20">
          <div className="bg-gray-100 p-5 text-center font-black text-gray-400 uppercase text-xs tracking-[0.3em]">
            Classificação Geral do Clube
          </div>
          <div className="divide-y divide-gray-100">
            {geral.map((m, index) => (
              <div key={m._id} className="flex items-center justify-between p-4 md:p-6 hover:bg-green-50 transition-all">
                <div className="flex items-center gap-3 md:gap-6">
                  <span className="font-black text-gray-300 text-2xl md:text-3xl w-8 md:w-10 text-center">{index + 4}º</span>
                  <img src={m.foto_url} className="w-12 h-12 md:w-16 md:h-16 rounded-full object-cover border-2 border-green-50 shadow-md" alt="" />
                  <div>
                    <p className="font-black text-gray-900 text-sm md:text-xl leading-none">{m.nome}</p>
                    <p className="text-[9px] md:text-[10px] text-gray-400 font-bold uppercase mt-1">{m.funcao}</p>
                    <div className="mt-2 inline-block bg-green-900 text-white text-[8px] md:text-[10px] px-2 py-1 rounded-full font-black uppercase">
                      {getPatente(m.pontos)}
                    </div>
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
