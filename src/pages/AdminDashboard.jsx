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

  const API_URL = 'https://desbrava-app.onrender.com/membros';

  const carregarMembros = () => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => setMembros(data))
      .catch(err => console.error("Erro ao carregar:", err));
  };

  useEffect(() => carregarMembros(), []);

  const handleSalvar = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('nome', nome);
    data.append('unidade', unidade);
    data.append('funcao', funcao);
    if (arquivo) data.append('foto', arquivo);

    const url = view === 'edicao' ? `${API_URL}/${membroParaEditar._id}` : API_URL;
    const method = view === 'edicao' ? 'PUT' : 'POST';

    await fetch(url, { method: method, body: data });
    limparFormulario();
    carregarMembros();
  };

  const salvarPontos = async (id) => {
    const data = new FormData();
    data.append('valor', inputPontos);

    await fetch(`${API_URL}/${id}/pontos`, { method: 'PATCH', body: data });
    setPontuandoId(''); setInputPontos(''); carregarMembros();
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
    <div className="p-4 max-w-7xl mx-auto bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8 border-b pb-4">
        <h1 className="text-2xl font-black text-green-800 italic">ÁGATA ADMIN</h1>
        <button onClick={() => navigate('/')} className="bg-red-600 text-white px-5 py-2 rounded-xl font-bold">Sair</button>
      </div>

      {view === 'tabela' && (
        <button onClick={() => setView('cadastro')} className="mb-8 bg-blue-600 text-white px-8 py-3 rounded-2xl font-black shadow-lg">
          + NOVO MEMBRO
        </button>
      )}

      {(view === 'cadastro' || view === 'edicao') && (
        <div className="bg-white p-6 rounded-[32px] shadow-2xl mb-10">
          <form onSubmit={handleSalvar} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input type="text" placeholder="Nome" className="border-2 p-4 rounded-2xl" value={nome} onChange={e => setNome(e.target.value)} required />
            <input type="text" placeholder="Unidade" className="border-2 p-4 rounded-2xl" value={unidade} onChange={e => setUnidade(e.target.value)} required />
            <input type="text" placeholder="Função" className="border-2 p-4 rounded-2xl" value={funcao} onChange={e => setFuncao(e.target.value)} required />
            <input type="file" className="border-2 p-3 rounded-2xl" onChange={e => setArquivo(e.target.files[0])} />
            <button className="bg-green-600 text-white p-5 rounded-2xl font-black md:col-span-2">SALVAR REGISTRO</button>
          </form>
        </div>
      )}

      {view === 'tabela' && (
        <div className="bg-white rounded-[32px] shadow-2xl overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-green-800 text-white">
              <tr>
                <th className="p-6">MEMBRO</th>
                <th className="p-6 text-center">PONTOS</th>
                <th className="p-6 text-center">AÇÕES</th>
              </tr>
            </thead>
            <tbody>
              {membros.map(m => (
                <tr key={m._id} className="border-b">
                  <td className="p-6 font-bold">{m.nome}</td>
                  <td className="p-6 text-center font-black text-xl text-green-700">{m.pontos}</td>
                  <td className="p-6 flex justify-center gap-2">
                    <button onClick={() => setPontuandoId(m._id)} className="bg-blue-500 text-white px-3 py-2 rounded-lg text-xs">⭐ PONTUAR</button>
                    {pontuandoId === m._id && (
                       <div className="absolute bg-white p-2 border shadow-xl rounded-lg">
                         <input type="number" className="border p-1 w-20" value={inputPontos} onChange={e => setInputPontos(e.target.value)} />
                         <button onClick={() => salvarPontos(m._id)} className="bg-green-500 text-white px-2 ml-1">OK</button>
                       </div>
                    )}
                    <button onClick={() => abrirEdicao(m)} className="bg-amber-400 text-white p-2 rounded-lg">✏️</button>
                    <button onClick={async () => { if(window.confirm('Excluir?')) { await fetch(`${API_URL}/${m._id}`, {method: 'DELETE'}); carregarMembros(); } }} className="bg-red-500 text-white p-2 rounded-lg">🗑️</button>
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
