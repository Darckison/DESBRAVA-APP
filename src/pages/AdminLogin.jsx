import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    
    // Aqui você define a sua senha de administrador
    if (usuario === 'admin' && senha === '1234') {
      alert('Acesso Autorizado!');
      navigate('/dashboard'); // Te leva para o Painel Master
    } else {
      alert('Usuário ou senha incorretos!');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-900 bg-[url('https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80')] bg-cover">
      <div className="bg-white/90 backdrop-blur-sm p-10 rounded-3xl shadow-2xl w-full max-w-md border-t-8 border-green-700">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-green-800 uppercase italic">Área do Diretor</h1>
          <p className="text-gray-600 font-bold">Acesso ao Painel Administrativo</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">USUÁRIO</label>
            <input 
              type="text" 
              className="w-full p-4 border-2 rounded-xl outline-none focus:border-green-600 transition-all font-bold"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              placeholder="Digite o usuário"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">SENHA</label>
            <input 
              type="password" 
              className="w-full p-4 border-2 rounded-xl outline-none focus:border-green-600 transition-all font-bold"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-green-700 hover:bg-green-800 text-white font-black py-4 rounded-xl shadow-lg transition-transform transform active:scale-95 uppercase"
          >
            Entrar no Painel
          </button>
        </form>
        
        <button 
          onClick={() => navigate('/')} 
          className="w-full mt-4 text-green-800 font-bold text-sm hover:underline"
        >
          ← Voltar para a Página Inicial
        </button>
      </div>
    </div>
  );
};

export default AdminLogin;