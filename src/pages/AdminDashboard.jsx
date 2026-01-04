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
    <div className="p-2 md:p-8 max-w-7xl mx-auto bg-gray-50 min-h-screen font-sans overflow-x-hidden">
      {/* Cabeçalho Ajustado para Mobile */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 border-b pb-4">
        <h1 className="text-xl md:text-3xl font-black text-green-800 italic leading-tight">
          Clube de Desbravadores Ágata(Admin)
        </h1>
        <button onClick={() => navigate('/')} className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-xl font-bold shadow-md transition-all text-sm">
          Sair do Sistema
        </button>
      </div>

      {/* Botão de Cadastro Ajustado */}
      {view === 'tabela' && (
        <button 
          onClick={() => setView('cadastro')}
          className="w-full sm:w-auto mb-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-black shadow-lg transition-transform active:scale-95 text-sm uppercase"
        >
          + Novo Desbravador
        </button>
      )}

      {/* Formulário Responsivo */}
      {(view === 'cadastro' || view === 'edicao') && (
        <div className="bg-white p-4 md:p-10 rounded-3xl shadow-2xl border border-gray-100 mb-6">
          <h2 className="text-xl font-black mb-6 text-green-800 uppercase italic">
            {view === 'cadastro' ? 'Novo Desbravador' : 'Editar Informações'}
          </h2>
          <form onSubmit={handleSalvar} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
                <label className="text-[10px] font-black text-gray-400 uppercase ml-2">Nome Completo</label>
                <input type="text" className="border-2 p-3 rounded-xl outline-none focus:border-green-500 bg-gray-50 text-sm" value={nome} onChange={e => setNome(e.target.value)} required />
            </div>
            <div className="flex flex-col gap-1">
                <label className="text-[10px] font-black text-gray-400 uppercase ml-2">Unidade</label>
                <input type="text" className="border-2 p-3 rounded-xl outline-none focus:border-green-500 bg-gray-50 text-sm" value={unidade} onChange={e => setUnidade(e.target.value)} required />
            </div>
            <div className="flex flex-col gap-1">
                <label className="text-[10px] font-black text-gray-400 uppercase ml-2">Função</label>
                <input type="text" className="border-2 p-3 rounded-xl outline-none focus:border-green-500 bg-gray-50 text-sm" value={funcao} onChange={e => setFuncao(e.target.value)} required />
            </div>
            <div className="flex flex-col gap-1">
                <label className="text-[10px] font-black text-gray-400 uppercase ml-2">Foto</label>
                <input type="file" className="border-2 p-2 rounded-xl bg-gray-50 text-xs font-bold" onChange={e => setArquivo(e.target.files[0])} />
            </div>
            <div className="md:col-span-2 flex flex-col sm:flex-row gap-3 mt-4">
                <button className="bg-green-600 hover:bg-green-700 text-white p-4 rounded-xl font-black flex-1 shadow-xl uppercase text-sm">Salvar Registro</button>
                <button type="button" onClick={limparFormulario} className="bg-red-600 hover:bg-red-700 text-white p-4 rounded-xl font-black uppercase text-sm">Cancelar</button>
            </div>
          </form>
        </div>
      )}

      {/* Tabela com Rolagem Lateral para Mobile */}
      {view === 'tabela' && (
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
          <div className="overflow-x-auto"> {/* ESSA DIV RESOLVE O CORTE LATERAL */}
            <table className="w-full text-left border-collapse min-w-[600px]"> 
              <thead className="bg-green-800 text-white text-xs md:text-sm">
                <tr>
                  <th className="p-4 uppercase font-black tracking-widest">Membro</th>
                  <th className="p-4 uppercase font-black tracking-widest text-center">Unidade</th>
                  <th className="p-4 uppercase font-black tracking-widest text-center">Pontos</th>
                  <th className="p-4 uppercase font-black tracking-widest text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {membros.map(m => (
                  <tr key={m._id} className="border-b last:border-0 hover:bg-green-50">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img src={m.foto_url} className="w-10 h-10 md:w-16 md:h-16 rounded-full object-cover border-2 border-green-100 shadow-sm" alt="" />
                        <div>
                          <p className="font-black text-gray-800 uppercase leading-tight text-xs md:text-sm">{m.nome}</p>
                          <p className="text-[9px] font-bold text-gray-400 uppercase italic tracking-wider">{m.funcao}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-center font-bold text-gray-500 uppercase text-xs">{m.unidade}</td>
                    <td className="p-4 text-center">
                      <span className="bg-green-100 text-green-800 px-3 py-1 md:px-4 md:py-2 rounded-lg font-black text-base md:text-xl">
                        {m.pontos}
                      </span>
                    </td>
                    <td className="p-4">
                      {pontuandoId === m._id ? (
                        <div className="flex flex-col gap-2 bg-gray-100 p-2 rounded-xl border-2 border-yellow-400 min-w-[150px]">
                          <input type="number" className="p-2 border rounded-lg font-bold text-xs" value={inputPontos} onChange={e => setInputPontos(e.target.value)} />
                          <div className="flex gap-2">
                            <button onClick={() => salvarPontos(m._id)} className="bg-green-600 text-white flex-1 py-1 rounded-lg font-black uppercase text-[10px]">OK</button>
                            <button onClick={() => setPontuandoId('')} className="bg-gray-400 text-white px-2 rounded-lg font-black">X</button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex justify-center items-center gap-2">
                          <button onClick={() => setPontuandoId(m._id)} className="bg-blue-500 text-white p-2 rounded-lg font-black text-[10px] shadow-sm uppercase">⭐</button>
                          <button onClick={() => abrirEdicao(m)} className="bg-amber-400 text-white p-2 rounded-lg shadow-sm">✏️</button>
                          <button onClick={async () => { if(window.confirm('Excluir?')) { await fetch(`https://desbrava-app.onrender.com/membros/${m._id}`, {method: 'DELETE'}); carregarMembros(); } }} className="bg-red-500 text-white p-2 rounded-lg shadow-sm">🗑️</button>
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
