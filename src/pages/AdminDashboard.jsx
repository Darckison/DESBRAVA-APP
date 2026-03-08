import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [membros, setMembros] = useState([]);
  const [view, setView] = useState('tabela'); // 'tabela', 'cadastro' ou 'edicao'
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
      
      {/* CABEÇALHO COM NAVEGAÇÃO */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 border-b-2 border-green-800 pb-4 gap-4">
        <h1 className="text-2xl md:text-3xl font-black text-green-800 italic uppercase">Dashboard Ágata</h1>
        
        <div className="flex gap-2">
          {/* BOTÃO PARA IR PARA GERENCIAR LOGOS/UNIDADES */}
          <button 
            onClick={() => navigate('/admin-unidades')} 
            className="bg-yellow-500 hover:bg-yellow-600 text-green-950 px-4 py-2 rounded-xl font-black shadow-md text-xs uppercase"
          >
            🛡️ Unidades
          </button>

          <button onClick={() => navigate('/')} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl font-bold shadow-md text-xs uppercase">
            Sair
          </button>
        </div>
      </div>

      {/* BOTÃO DE CADASTRAR (Só aparece quando estamos vendo a tabela) */}
      {view === 'tabela' && (
        <button 
          onClick={() => setView('cadastro')}
          className="mb-8 bg-green-700 hover:bg-green-800 text-white px-8 py-4 rounded-2xl font-black shadow-lg transition-transform active:scale-95 uppercase tracking-widest"
        >
          + Novo Desbravador
        </button>
      )}

      {/* FORMULÁRIO DE CADASTRO OU EDIÇÃO */}
      {(view === 'cadastro' || view === 'edicao') && (
        <div className="bg-white p-6 md:p-10 rounded-[32px] shadow-2xl border-4 border-green-800 mb-10">
          <h2 className="text-2xl font-black mb-8 text-green-800 uppercase italic">
            {view === 'cadastro' ? 'Novo Registro' : 'Editar Registro'}
          </h2>
          <form onSubmit={handleSalvar} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black text-gray-400 uppercase ml-2">Nome Completo</label>
                <input type="text" className="border-2 p-4 rounded-2xl outline-none focus:border-green-500 bg-gray-50 font-bold" value={nome} onChange={e => setNome(e.target.value)} required />
            </div>
            <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black text-gray-400 uppercase ml-2">Unidade</label>
                <input type="text" className="border-2 p-4 rounded-2xl outline-none focus:border-green-500 bg-gray-50 font-bold" value={unidade} onChange={e => setUnidade(e.target.value)} required />
            </div>
            <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black text-gray-400 uppercase ml-2">Função / Cargo</label>
                <input type="text" className="border-2 p-4 rounded-2xl outline-none focus:border-green-500 bg-gray-50 font-bold" value={funcao} onChange={e => setFuncao(e.target.value)} required />
            </div>
            <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black text-gray-400 uppercase ml-2">Foto de Perfil</label>
                <input type="file" className="border-2 p-3 rounded-2xl bg-gray-50 text-xs font-bold" onChange={e => setArquivo(e.target.files[0])} />
            </div>
            <div className="md:col-span-2 flex gap-4 mt-4">
                <button className="bg-green-700 hover:bg-green-800 text-white p-5 rounded-2xl font-black flex-1 shadow-xl uppercase tracking-widest">Confirmar</button>
                <button type="button" onClick={limparFormulario} className="bg-gray-400 hover:bg-gray-500 text-white px-8 rounded-2xl font-black uppercase">Voltar</button>
            </div>
          </form>
        </div>
      )}

      {/* TABELA DE MEMBROS */}
      {view === 'tabela' && (
        <div className="bg-white rounded-[32px] shadow-2xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-green-800 text-white font-black uppercase text-xs">
                <tr>
                  <th className="p-6 tracking-widest">Membro</th>
                  <th className="p-6 text-center">Unidade</th>
                  <th className="p-6 text-center">Pontos</th>
                  <th className="p-6 text-center">Ações</th>
                </tr>
              </thead>
              <tbody>
                {membros.map(m => (
                  <tr key={m._id} className="border-b hover:bg-green-50 transition-colors">
                    <td className="p-6">
                      <div className="flex items-center gap-4">
                        <img src={m.foto_url} className="w-14 h-14 rounded-full object-cover border-2 border-green-200" alt="" />
                        <div>
                          <p className="font-black text-gray-800 uppercase text-sm leading-none">{m.nome}</p>
                          <p className="text-[9px] font-bold text-gray-400 uppercase italic">{m.funcao}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-6 text-center font-bold text-gray-500 uppercase text-xs">{m.unidade}</td>
                    <td className="p-6 text-center">
                      <span className="bg-green-100 text-green-800 px-4 py-1 rounded-lg font-black text-lg border border-green-200">
                        {m.pontos}
                      </span>
                    </td>
                    <td className="p-6">
                      {pontuandoId === m._id ? (
                        <div className="flex flex-col gap-2 bg-yellow-50 p-3 rounded-xl border-2 border-yellow-400">
                          <input type="number" placeholder="Pts" className="p-2 border rounded-lg font-bold text-sm" value={inputPontos} onChange={e => setInputPontos(e.target.value)} />
                          <input type="text" placeholder="Motivo" className="p-2 border rounded-lg text-[10px] font-bold" value={inputMotivo} onChange={e => setInputMotivo(e.target.value)} />
                          <div className="flex gap-2">
                            <button onClick={() => salvarPontos(m._id)} className="bg-green-600 text-white flex-1 py-1 rounded-lg font-black text-[10px] uppercase">Salvar</button>
                            <button onClick={() => setPontuandoId('')} className="bg-red-500 text-white px-2 rounded-lg">X</button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex justify-center gap-2">
                          <button onClick={() => setPontuandoId(m._id)} className="bg-blue-600 text-white p-2 rounded-xl text-[10px] font-black shadow-md uppercase">⭐ Pontuar</button>
                          <button onClick={() => abrirEdicao(m)} className="bg-amber-400 text-white p-2 rounded-xl text-xs">✏️</button>
                          <button onClick={async () => { if(window.confirm('Excluir?')) { await fetch(`https://desbrava-app.onrender.com/membros/${m._id}`, {method: 'DELETE'}); carregarMembros(); } }} className="bg-red-500 text-white p-2 rounded-xl text-xs">🗑️</button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
