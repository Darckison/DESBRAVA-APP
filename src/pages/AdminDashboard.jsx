import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [membros, setMembros] = useState([]);
  const [view, setView] = useState('tabela'); 
  const [pontuandoId, setPontuandoId] = useState('');
  const [membroParaEditar, setMembroParaEditar] = useState(null);

  // Estados dos inputs
  const [nome, setNome] = useState('');
  const [unidade, setUnidade] = useState('');
  const [funcao, setFuncao] = useState('');
  const [arquivo, setArquivo] = useState(null);
  const [inputPontos, setInputPontos] = useState('');
  const [inputMotivo, setInputMotivo] = useState('');

  const carregarMembros = () => {
    fetch('https://seu-link-do-render.onrender.com/membros')
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
      ? `http://localhost:8000/membros/${membroParaEditar._id}` 
      : 'http://localhost:8000/membros';
    
    await fetch(url, { method: method, body: data });
    limparFormulario();
    carregarMembros();
  };

  const salvarPontos = async (id) => {
    const data = new FormData();
    data.append('valor', inputPontos);
    data.append('motivo', inputMotivo);

    await fetch(`https://seu-link-do-render.onrender.com/membros/${id}/pontos`, { method: 'PATCH', body: data });
    setPontuandoId(''); setInputPontos(''); setInputMotivo(''); carregarMembros();
  };

  const abrirEdicao = (m) => {
    setMembroParaEditar(m);
    setNome(m.nome);
    setUnidade(m.unidade);
    setFuncao(m.funcao);
    setView('edicao');
  };

  const limparFormulario = () => {
    setNome(''); setUnidade(''); setFuncao(''); setArquivo(null); setView('tabela');
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto bg-gray-50 min-h-screen font-sans">
      {/* Cabeçalho */}
      <div className="flex justify-between items-center mb-8 border-b pb-4">
        <h1 className="text-2xl md:text-3xl font-black text-green-800 italic">Clube de Desbravadores Ágata(Admin)</h1>
        <button onClick={() => navigate('/')} className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-xl font-bold shadow-md transition-all">
          Sair do Sistema
        </button>
      </div>

      {/* Botão de Cadastro */}
      {view === 'tabela' && (
        <button 
          onClick={() => setView('cadastro')}
          className="mb-8 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-2xl font-black shadow-lg transition-transform active:scale-95"
        >
          + Cadastrar Novo Desbravador
        </button>
      )}

      {/* Formulário de Cadastro/Edição */}
      {(view === 'cadastro' || view === 'edicao') && (
        <div className="bg-white p-6 md:p-10 rounded-[32px] shadow-2xl border border-gray-100 mb-10">
          <h2 className="text-2xl font-black mb-8 text-green-800 uppercase italic">
            {view === 'cadastro' ? 'Novo Desbravador' : 'Editar Informações'}
          </h2>
          <form onSubmit={handleSalvar} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
                <label className="text-xs font-black text-gray-400 uppercase ml-2">Nome Completo</label>
                <input type="text" className="border-2 p-4 rounded-2xl outline-none focus:border-green-500 bg-gray-50" value={nome} onChange={e => setNome(e.target.value)} required />
            </div>
            <div className="flex flex-col gap-2">
                <label className="text-xs font-black text-gray-400 uppercase ml-2">Unidade</label>
                <input type="text" className="border-2 p-4 rounded-2xl outline-none focus:border-green-500 bg-gray-50" value={unidade} onChange={e => setUnidade(e.target.value)} required />
            </div>
            <div className="flex flex-col gap-2">
                <label className="text-xs font-black text-gray-400 uppercase ml-2">Função / Cargo</label>
                <input type="text" className="border-2 p-4 rounded-2xl outline-none focus:border-green-500 bg-gray-50" value={funcao} onChange={e => setFuncao(e.target.value)} required />
            </div>
            <div className="flex flex-col gap-2">
                <label className="text-xs font-black text-gray-400 uppercase ml-2">Foto de Perfil</label>
                <input type="file" className="border-2 p-3 rounded-2xl bg-gray-50 text-sm font-bold" onChange={e => setArquivo(e.target.files[0])} />
            </div>
            <div className="md:col-span-2 flex gap-4 mt-4">
               <button className="bg-green-600 hover:bg-green-700 text-white p-5 rounded-2xl font-black flex-1 shadow-xl uppercase tracking-widest">Salvar Registro</button>
               <button type="button" onClick={limparFormulario} className="bg-gray-400 text-white px-8 rounded-2xl font-black uppercase">Cancelar</button>
            </div>
          </form>
        </div>
      )}

      {/* Tabela de Membros Organizada */}
      {view === 'tabela' && (
        <div className="bg-white rounded-[32px] shadow-2xl overflow-hidden border border-gray-100">
          <table className="w-full text-left border-collapse">
            <thead className="bg-green-800 text-white">
              <tr>
                <th className="p-6 uppercase text-sm font-black tracking-widest">Membro / Função</th>
                <th className="p-6 uppercase text-sm font-black tracking-widest text-center">Unidade</th>
                <th className="p-6 uppercase text-sm font-black tracking-widest text-center">Pontos</th>
                <th className="p-6 uppercase text-sm font-black tracking-widest text-center">Ações</th>
              </tr>
            </thead>
            <tbody>
              {membros.map(m => (
                <tr key={m._id} className="border-b last:border-0 hover:bg-green-50 transition-colors">
                  {/* Membro e Função */}
                  <td className="p-6">
                    <div className="flex items-center gap-4">
                      <img src={m.foto_url} className="w-16 h-16 rounded-full object-cover border-4 border-green-100 shadow-sm" alt="" />
                      <div>
                        <p className="font-black text-gray-800 uppercase leading-none mb-1">{m.nome}</p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase italic tracking-wider">{m.funcao}</p>
                      </div>
                    </div>
                  </td>
                  
                  {/* Unidade */}
                  <td className="p-6 text-center font-bold text-gray-500 uppercase text-sm">
                    {m.unidade}
                  </td>

                  {/* Pontos */}
                  <td className="p-6 text-center">
                    <span className="bg-green-100 text-green-800 px-4 py-2 rounded-xl font-black text-xl border border-green-200">
                      {m.pontos}
                    </span>
                  </td>

                  {/* Ações */}
                  <td className="p-6">
                    {pontuandoId === m._id ? (
                      <div className="flex flex-col gap-2 bg-gray-100 p-4 rounded-2xl border-2 border-yellow-400">
                        <input type="number" placeholder="Quantidade" className="p-2 border rounded-lg font-bold" value={inputPontos} onChange={e => setInputPontos(e.target.value)} />
                        <input type="text" placeholder="Motivo" className="p-2 border rounded-lg text-xs font-bold" value={inputMotivo} onChange={e => setInputMotivo(e.target.value)} />
                        <div className="flex gap-2">
                          <button onClick={() => salvarPontos(m._id)} className="bg-green-600 text-white flex-1 py-2 rounded-lg font-black uppercase text-xs shadow-md">OK</button>
                          <button onClick={() => setPontuandoId('')} className="bg-gray-400 text-white px-3 rounded-lg font-black">X</button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-center items-center gap-3">
                        <button onClick={() => setPontuandoId(m._id)} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-xl font-black shadow-md transition-transform active:scale-95 text-xs">⭐ PONTUAR</button>
                        <button onClick={() => abrirEdicao(m)} className="bg-amber-400 hover:bg-amber-500 text-white p-3 rounded-xl shadow-md transition-transform active:scale-95">✏️</button>
                        <button onClick={async () => { if(window.confirm('Excluir?')) { await fetch(`http://localhost:8000/membros/${m._id}`, {method: 'DELETE'}); carregarMembros(); } }} className="bg-red-500 hover:bg-red-600 text-white p-3 rounded-xl shadow-md transition-transform active:scale-95">🗑️</button>
                      </div>
                    )}
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