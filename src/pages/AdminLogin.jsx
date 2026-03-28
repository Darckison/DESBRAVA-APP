import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    
    // Suas credenciais definidas
    if (usuario === 'ClubeAgata@Oficial' && senha === 'Clube2026') {
      navigate('/dashboard');
    } else {
      alert('❌ Usuário ou senha incorretos!');
    }
  };

  return (
    <div className="min-h-screen bg-[#061a0d] flex items-center justify-center p-4 font-sans relative overflow-hidden">
      
      {/* EFEITO DE LUZ AO FUNDO */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-green-900/30 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-green-800/20 blur-[120px] rounded-full"></div>

      <div className="bg-white/10 backdrop-blur-2xl p-8 md:p-12 rounded-[50px] shadow-2xl border-2 border-white/10 w-full max-w-md animate-in fade-in zoom-in duration-500 relative z-10">
        
        {/* LOGO E TÍTULO */}
        <div className="text-center mb-10">
          <img src="/logo.png" className="w-24 h-24 mx-auto mb-6 drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]" alt="Logo" />
          <h1 className="text-3xl font-black text-white uppercase italic tracking-tighter leading-none">Área do Diretor</h1>
          <p className="text-green-400 font-bold uppercase text-[10px] tracking-[0.3em] mt-2 opacity-80">Acesso ao Painel Administrativo</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <input 
              type="text" 
              className="w-full bg-white/5 border-2 border-white/10 p-5 rounded-[25px] text-white font-black text-center outline-none focus:border-green-500 focus:bg-white/10 transition-all placeholder:text-white/20 tracking-widest text-sm"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              placeholder="USUÁRIO"
              required
            />
          </div>

          <div>
            <input 
              type="password" 
              className="w-full bg-white/5 border-2 border-white/10 p-5 rounded-[25px] text-white font-black text-center outline-none focus:border-green-500 focus:bg-white/10 transition-all placeholder:text-white/20 tracking-widest text-sm"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="SENHA"
              required
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-green-500 hover:bg-green-400 text-[#061a0d] py-5 rounded-[25px] font-black uppercase tracking-[0.2em] shadow-[0_10px_30px_rgba(34,197,94,0.3)] transition-all active:scale-95 text-sm"
          >
            Entrar no Painel
          </button>
        </form>
        
        <div className="mt-8 text-center">
          <button 
            onClick={() => navigate('/')} 
            className="text-white/40 hover:text-white font-bold uppercase text-[10px] tracking-widest transition-colors flex items-center justify-center gap-2 mx-auto"
          >
            ← Voltar para o Ranking
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
