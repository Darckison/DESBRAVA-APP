import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
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
      .then(data => setMembros(Array.isArray(data) ? data : []));
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

  const limparFormulario = () => {
    setNome(''); setUnidade(''); setFuncao(''); setArquivo(null); setView('tabela');
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto bg-gray-50 min-h-screen">
      <div className="bg-white p-6 rounded-3xl shadow-lg mb-8 text-center border-t-8 border-green-700">
        <h1 className="text-3xl font-black text-green-800 italic uppercase mb-6">DASHBOARD ÁGATA</h1>
        <div className="flex justify-center gap-4">
          <button onClick={() => navigate('/admin-unidades')} className="bg-yellow-500 text-green-950 px-6 py-2 rounded-2xl font-black shadow-md uppercase text-sm">🛡️ UNIDADES</button>
          <button onClick={() => navigate('/')} className="bg-red-600 text-white px-6 py-2 rounded-2xl font-black shadow-md uppercase text-sm">SAIR</button>
        </div>
      </div>

      {view === 'tabela' && (
        <button onClick={() => setView('cadastro')} className="mb-8 bg-green-700 text-white px-8 py-4 rounded-3xl font-black shadow-xl uppercase tracking-widest active:scale-95 transition-all">
          + NOVO DESBRAVADOR
        </button>
      )}

      {(view === 'cadastro' || view === 'edicao') && (
        <div className="bg-white p-8 rounded-[40px] shadow-2xl border-4 border-green-700 mb-10">
          <form onSubmit={handleSalvar} className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <input type="text" placeholder="NOME" className="border-2 p-4 rounded-2xl font-bold" value={nome} onChange={e => setNome(e.target.value)} required />
             <input type="text" placeholder="UNIDADE" className="border-2 p-4 rounded-2xl font-bold" value={unidade} onChange={e => setUnidade(e.target.value)} required />
             <input type="text" placeholder="FUNÇÃO" className="border-2 p-4 rounded-2xl font-bold" value={funcao} onChange={e => setFuncao(e.target.value)} required />
             <input type="file" className="border-2 p-4 rounded-2xl font-bold" onChange={e => setArquivo(e.target.files[0])} />
             <button className="bg-green-700 text-white p-5 rounded-2xl font-black uppercase">SALVAR</button>
             <button type="button" onClick={limparFormulario} className="bg-gray-400 text-white p-5 rounded-2xl font-black uppercase">CANCELAR</button>
          </form>
        </div>
      )}

      {view === 'tabela' && (
        <div className="bg-white rounded-[40px] shadow-xl overflow-hidden border border-gray-100">
          <table className="w-full text-left">
            <thead className="bg-green-800 text-white uppercase text-xs font-black">
              <tr>
                <th className="p-6">Membro</th>
                <th className="p-6 text-center">Unidade</th>
                <th className="p-6 text-center">Pontos</th>
                <th className="p-6 text-center">Ações</th>
              </tr>
            </thead>
            <tbody>
              {membros.map(m => (
                <tr key={m._id} className="border-b last:border-0 hover:bg-green-50">
                  <td className="p-6 flex items-center gap-4">
                    <img src={m.foto_url} className="w-14 h-14 rounded-full object-cover border-2 border-green-200" alt="" />
                    <span className="font-black text-gray-800 uppercase">{m.nome}</span>
                  </td>
                  <td className="p-6 text-center font-bold text-gray-500 uppercase">{m.unidade}</td>
                  <td className="p-6 text-center"><span className="bg-green-100 text-green-800 px-4 py-2 rounded-xl font-black text-xl">{m.pontos}</span></td>
                  <td className="p-6 text-center">
                    <div className="flex justify-center gap-2">
                      <button onClick={() => setPontuandoId(m._id)} className="bg-blue-600 text-white px-4 py-2 rounded-xl font-black text-[10px] uppercase">⭐ PONTUAR</button>
                      <button onClick={() => { setMembroParaEditar(m); setNome(m.nome); setUnidade(m.unidade); setFuncao(m.funcao); setView('edicao'); }} className="bg-amber-400 text-white p-2 rounded-xl">✏️</button>
                      <button onClick={async () => { if(window.confirm('Excluir?')) { await fetch(`https://desbrava-app.onrender.com/membros/${m._id}`, {method: 'DELETE'}); carregarMembros(); } }} className="bg-red-500 text-white p-2 rounded-xl">🗑️</button>
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
}
