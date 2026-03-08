import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [membros, setMembros] = useState([]);
  const [view, setView] = useState('tabela'); 
  const [pontuandoId, setPontuandoId] = useState('');
  const [membroParaEditar, setMembroParaEditar] = useState(null);

  const [nome, setNome] = useState('');
  const [unidade, setUnidade] = useState('');
  const [funcao, setFuncao] = useState('');
  const [arquivo, setArquivo] = useState(null);
  const [inputPontos, setInputPontos] = useState('');
  const [inputMotivo, setInputMotivo] = useState('');

  const carregarMembros = () => {
    fetch('https://desbrava-app.onrender.com/membros')
      .then(res => res.json())
      .then(data => setMembros(data));
  };

  useEffect(() => carregarMembros(), []);

  const handleSalvar = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('nome', nome);
    data.append('unidade', unidade);
    data.append('funcao', funcao);
    if (arquivo) data.append('foto', arquivo);

    const method = view === 'edicao' ? 'PUT' : 'POST';
    const url = view === 'edicao'  
      ? `https://desbrava-app.onrender.com/membros/${membroParaEditar._id}` 
      : 'https://desbrava-app.onrender.com/membros';
    
    await fetch(url, { method: method, body: data });
    limparFormulario();
    carregarMembros();
  };

  const salvarPontos = async (id) => {
    const data = new FormData();
    data.append('valor', inputPontos);
    data.append('motivo', inputMotivo);

    await fetch(`https://desbrava-app.onrender.com/membros/${id}/pontos`, { method: 'PATCH', body: data });
    setPontuandoId(''); setInputPontos(''); setInputMotivo(''); carregarMembros();
  };

  const abrirEdicao = (m) => {
    setMembroParaEditar(m); setNome(m.nome); setUnidade(m.unidade); setFuncao(m.funcao); setView('edicao');
  };

  const limparFormulario = () => {
    setNome(''); setUnidade(''); setFuncao(''); setArquivo(null); setView('tabela');
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto bg-gray-50 min-h-screen font-sans">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-black text-green-800 italic uppercase mb-6">Dashboard Ágata</h1>
        <div className="flex justify-center gap-4">
          <button onClick={() => navigate('/admin-unidades')} className="bg-yellow-500 hover:bg-yellow-600 text-green-900 px-6 py-2 rounded-2xl font-black shadow-md flex items-center gap-2">
            🛡️ UNIDADES
          </button>
          <button onClick={() => navigate('/')} className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-2xl font-black shadow-md">
            SAIR
          </button>
        </div>
      </div>

      <hr className="border-green-800 border-2 mb-8" />

      {view === 'tabela' && (
        <button onClick={() => setView('cadastro')} className="mb-8 bg-green-700 hover:bg-green-800 text-white px-8 py-4 rounded-[25px] font-black shadow-lg uppercase tracking-widest transition-transform active:scale-95">
          + NOVO DESBRAVADOR
        </button>
      )}

      {(view === 'cadastro' || view === 'edicao') && (
        <div className="bg-white p-6 rounded-[32px] shadow-2xl border-4 border-green-800 mb-10">
          <form onSubmit={handleSalvar} className="grid grid-cols-1 md:grid-cols-2 gap-6 font-bold">
             <input type="text" placeholder="NOME COMPLETO" className="border-2 p-4 rounded-2xl" value={nome} onChange={e => setNome(e.target.value)} required />
             <input type="text" placeholder="UNIDADE" className="border-2 p-4 rounded-2xl" value={unidade} onChange={e => setUnidade(e.target.value)} required />
             <input type="text" placeholder="FUNÇÃO" className="border-2 p-4 rounded-2xl" value={funcao} onChange={e => setFuncao(e.target.value)} required />
             <input type="file" className="border-2 p-4 rounded-2xl bg-gray-50" onChange={e => setArquivo(e.target.files[0])} />
             <button className="bg-green-700 text-white p-5 rounded-2xl font-black uppercase shadow-xl">Salvar</button>
             <button type="button" onClick={limparFormulario} className="bg-red-600 text-white p-5 rounded-2xl font-black uppercase">Cancelar</button>
          </form>
        </div>
      )}

      {view === 'tabela' && (
        <div className="bg-white rounded-[40px] shadow-2xl overflow-hidden border border-gray-100">
          <table className="w-full text-left">
            <thead className="bg-green-800 text-white">
              <tr>
                <th className="p-6 uppercase font-black">Membro</th>
                <th className="p-6 text-center uppercase font-black">Unidade</th>
                <th className="p-6 text-center uppercase font-black">Pontos</th>
                <th className="p-6 text-center uppercase font-black">Ações</th>
              </tr>
            </thead>
            <tbody>
              {membros.map(m => (
                <tr key={m._id} className="border-b last:border-0 hover:bg-green-50 transition-colors">
                  <td className="p-6">
                    <div className="flex items-center gap-4">
                      <img src={m.foto_url} className="w-16 h-16 rounded-full object-cover border-4 border-green-100 shadow-sm" alt="" />
                      <div>
                        <p className="font-black text-gray-800 uppercase leading-none mb-1">{m.nome}</p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase italic tracking-wider">{m.funcao}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-6 text-center font-bold text-gray-500 uppercase">{m.unidade}</td>
                  <td className="p-6 text-center">
                    <span className="bg-green-100 text-green-800 px-4 py-2 rounded-xl font-black text-xl border border-green-200">{m.pontos}</span>
                  </td>
                  <td className="p-6 text-center">
                    <div className="flex justify-center gap-2">
                       <button onClick={() => setPontuandoId(m._id)} className="bg-blue-600 text-white px-4 py-2 rounded-xl font-black shadow-md text-xs uppercase">⭐ Pontuar</button>
                       <button onClick={() => abrirEdicao(m)} className="bg-amber-400 text-white p-2 rounded-xl text-lg">✏️</button>
                       <button onClick={async () => { if(window.confirm('Excluir?')) { await fetch(`https://desbrava-app.onrender.com/membros/${m._id}`, {method: 'DELETE'}); carregarMembros(); } }} className="bg-red-600 text-white p-2 rounded-xl text-lg">🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
