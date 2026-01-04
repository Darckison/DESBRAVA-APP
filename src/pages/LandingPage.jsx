import React from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-green-900 to-black animate-gradient flex flex-col items-center justify-center px-4 text-white font-sans overflow-hidden">
      
      {/* Container Principal - Aumentado para max-w-4xl para caber o texto inteiro */}
      <div className="text-center space-y-6 backdrop-blur-md p-8 md:p-12 rounded-[50px] border border-white/10 shadow-2xl bg-black/20 w-full max-w-4xl mx-auto flex flex-col items-center">
        
        {/* LOGO DO CLUBE */}
        <div className="flex justify-center mb-4">
          <div className="relative">
            <div className="absolute inset-0 bg-yellow-500/20 blur-3xl rounded-full"></div>
            <img 
              src="/logo.png" 
              alt="Logo do Clube" 
              className="relative w-32 h-32 md:w-48 md:h-48 object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] hover:scale-110 transition-transform duration-500"
            />
          </div>
        </div>

        {/* Título e Subtítulo - Ajustado o tamanho da fonte e removido quebras */}
        <div className="w-full overflow-visible">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-black italic tracking-tighter uppercase text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600 leading-none whitespace-nowrap px-2">
            Desbravadores
          </h1>
          <p className="text-xs sm:text-sm md:text-lg font-black text-green-400 uppercase tracking-[0.5em] opacity-90 mt-2">
            Unidade e Disciplina
          </p>
        </div>

        {/* Botões - Ajustados para ficarem lado a lado e bem visíveis */}
        <div className="flex flex-col sm:flex-row gap-6 pt-10 w-full max-w-lg justify-center">
          <button 
            onClick={() => navigate('/ranking')}
            className="flex-1 bg-yellow-500 hover:bg-yellow-400 text-green-950 font-black py-4 px-8 rounded-2xl shadow-xl transition-all hover:scale-105 active:scale-95 uppercase tracking-widest text-sm sm:text-base whitespace-nowrap"
          >
            ⭐ Ver Ranking
          </button>

          <button 
            onClick={() => navigate('/login')}
            className="flex-1 bg-white/5 hover:bg-white/10 text-white border border-white/20 font-bold py-4 px-8 rounded-2xl backdrop-blur-md transition-all hover:scale-105 active:scale-95 uppercase tracking-widest text-sm sm:text-base whitespace-nowrap"
          >
            🔒 Admin
          </button>
        </div>
      </div>

      {/* Rodapé */}
      <footer className="mt-12 text-gray-500 text-[10px] font-black uppercase tracking-[0.5em] opacity-90">
        Maranata: O Senhor Logo Vem!
      </footer>
    </div>
  );
};

export default LandingPage;