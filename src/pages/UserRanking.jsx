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
    <div className="min-h-screen bg-gray-100 py-6 md:py-10 px-2 md:px-4 font-sans text-gray-800 overflow-x-hidden">
      <div className="max-w-5xl mx-auto">
        
        {/* CABEÇALHO LIMPO */}
        <div className="flex justify-between items-center mb-12 md:mb-20">
            <button onClick={() => navigate('/')} className="bg-green-800 hover:bg-green-900 text-white px-5 py-2 rounded-2xl font-black shadow-md transition-all text-xs md:text-sm uppercase italic">← Voltar</button>
            <h1 className="text-2xl md:text-4xl font-black uppercase italic flex-1 text-center tracking-tighter text-green-900">
              Ranking <span className="text-yellow-500">Geral</span>
            </h1>
            <div className="w-10 md:w-20"></div>
        </div>

        {/* PÓDIO EM CARDS (ESTILO A FOTO QUE VOCÊ MANDOU) */}
        <div className="flex flex-col md:flex-row justify-center items-end gap-6 mb-20 px-4">
          {podio.map((m, index) => {
            const isFirst = index === 0;
            const isSecond = index === 1;

            // Cores baseadas na posição para os detalhes
            const rankColor = isFirst ? 'border-yellow-500' : isSecond ? 'border-gray-300' : 'border-orange-400';
            const badgeBg = isFirst ? 'bg-yellow-500' : isSecond ? 'bg-gray-300' : 'bg-orange-400';

            return (
              <div key={m._id} className={`w-full md:flex-1 flex flex-col items-center transition-all duration-500 ${
                isFirst ? 'order-1 md:order-2 md:scale-110 z-20 mb-4 md:mb-10' : 
                isSecond ? 'order-2 md:order-1 z-10' : 
                'order-3 z-10'
              }`}>
                
                {/* CARD BRANCO FLUTUANTE */}
                <div className={`bg-white w-full max-w-[280px] p-6 rounded-[40px] shadow-2xl border-b-[10px] ${rankColor} relative transform hover:-translate-y-2 transition-transform`}>
                  
                  {/* NÚMERO DA POSIÇÃO NO TOPO */}
                  <div className={`absolute -top-5 left-1/2 -translate-x-1/2 ${badgeBg} text-white px-6 py-1 rounded-full font-black text-sm shadow-lg`}>
                    {index + 1}º LUGAR
                  </div>

                  {/* FOTO CIRCULAR COM BORDA */}
                  <div className="flex justify-center mt-4 mb-4">
                    <img 
                      src={m.foto_url} 
                      className={`w-24 h-24 md:w-32 md:h-32 rounded-full border-4 ${rankColor} object-cover shadow-md`} 
                      alt={m.nome} 
                    />
                  </div>

                  {/* NOME E FUNÇÃO */}
                  <div className="text-center mb-4">
                    <h2 className="font-black text-lg md:text-xl text-green-900 uppercase truncate px-2">
                      {m.nome.split(' ')[0]}
                    </h2>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      {m.funcao}
                    </p>
                  </div>

                  {/* PATENTE CENTRALIZADA */}
                  <div className="bg-gray-50 py-2 px-3 rounded-2xl border border-gray-100 mb-6 text-center">
                    <span className="text-[10px] font-black text-green-700 italic">
                      {getPatente(m.pontos)}
                    </span>
                  </div>

                  {/* PONTUAÇÃO DESTAQUE */}
                  <div className="text-center">
                    <p className="text-3xl md:text-4xl font-black text-gray-800 leading-none">
                      {m.pontos}
                    </p>
                    <span className="text-[10px] font-black text-gray-300 uppercase italic">Pontos Totais</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* CLASSIFICAÇÃO GERAL (LISTA ABAIXO) */}
        <div className="bg-white rounded-[40px] shadow-xl overflow-hidden max-w-4xl mx-auto border border-gray-100">
          <div className="bg-green-800 p-4 text-center text-white font-black uppercase text-xs tracking-widest italic">
            Demais Classificações
          </div>
          
          <div className="divide-y divide-gray-50">
            {geral.map((m, index) => (
              <div key={m._id} className="flex items-center justify-between p-5 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <span className="font-black text-gray-200 text-2xl w-8 text-center">{index + 4}º</span>
                  <img src={m.foto_url} className="w-12 h-12 rounded-full object-cover border-2 border-gray-100" alt="" />
                  <div>
                    <p className="font-black text-green-900 uppercase text-sm italic">{m.nome}</p>
                    <p className="text-[9px] text-gray-400 font-bold uppercase">{m.funcao}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-black text-green-700 text-2xl leading-none">{m.pontos}</p>
                  <span className="text-[8px] font-black text-gray-300 uppercase">Pts</span>
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
