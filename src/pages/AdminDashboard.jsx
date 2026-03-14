import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [membros, setMembros] = useState([]);
  const [view, setView] = useState('tabela'); 
  const [pontuandoId, setPontuandoId] = useState('');
  const [membroParaEditar, setMembroParaEditar] = useState(null);
  const [loading, setLoading] = useState(false);

  const [nome, setNome] = useState('');
  const [unidade, setUnidade] = useState('');
  const [funcao, setFuncao] = useState('');
  const [arquivo, setArquivo] = useState(null);
  const [inputPontos, setInputPontos] = useState('');
  const [inputMotivo, setInputMotivo] = useState('');

  const API_URL = "https://desbrava-app.onrender.com";

  const carregarMembros = () => {
    fetch(`${API_URL}/membros`)
      .then(res => res.json())
      .then(data => setMembros(Array.isArray(data) ? data : []))
      .catch(err => console.error("Erro ao carregar membros:", err));
  };

  useEffect(() => carregarMembros(), []);

  const handleSalvar = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    data.append('nome', nome);
    data.append('unidade', unidade);
    data.append('funcao', funcao);
    
    if (arquivo) {
      data.append('foto', arquivo);
    }

    const isEdicao = view === 'edicao';
    const method = isEdicao ? 'PUT' : 'POST';
    const url = isEdicao 
      ? `${API_URL}/membros/${membroParaEditar._id}` 
      : `${API_URL}/membros`;
    
    try {
      const res = await fetch(url, { 
        method: method, 
        body: data 
      });

      if (res.ok) {
        alert(isEdicao ? "✅ Cadastro atualizado!" : "✅ Novo desbravador salvo!");
        limparFormulario();
        carregarMembros();
      } else {
        alert("❌ Erro no servidor ao salvar o membro.");
      }
    } catch (err) {
      alert("❌ ERRO DE CONEXÃO: Verifique o servidor.");
    } finally {
      setLoading(false);
    }
  };

  // --- FUNÇÃO ATUALIZADA COM MOTIVO E DATA ---
  const salvarPontos = async (id) => {
    if (!inputPontos || !inputMotivo) {
      alert("Preencha a quantidade e o motivo!");
      return;
    }

    const data = new FormData();
    data.append('valor', inputPontos);
    data.append('motivo', inputMotivo);
    // A data é gerada automaticamente no servidor (new Date()), 
    // mas enviamos os campos que o banco de dados vai registrar.
    
    try {
      const res = await fetch(`${API_URL}/membros/${id}/pontos`, { 
        method: 'PATCH', 
        body: data 
      });

      if (res.ok) {
        setPontuandoId(''); 
        setInputPontos(''); 
        setInputMotivo(''); 
        carregarMembros();
      } else {
        alert("Erro ao salvar pontos no servidor.");
      }
    } catch (err) {
      alert("Erro de conexão ao salvar pontos.");
    }
  };

  const abrirEdicao = (m) => {
    setMembroParaEditar(m); 
    setNome(m.nome); 
    setUnidade(m.unidade); 
    setFuncao(m.funcao); 
    setView('edicao');
  };

  const limparFormulario = () => {
    setNome(''); 
    setUnidade(''); 
    setFuncao(''); 
    setArquivo(null); 
    setView('tabela');
    setMembroParaEditar(null);
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto bg-gray-50 min-h-screen font-sans text-gray-800">
      
      {/* CABEÇALHO */}
      <div className="bg-white p-6 rounded-[32px] shadow-lg mb-8 text-center border-t-8 border-green-800">
        <h1 className="text-3xl font-black text-green-800 italic uppercase mb-6 tracking-tighter">Clube de desbravadores Ágata (Admin)</h1>
        <div className="flex justify-center gap-4 flex-wrap">
          <button 
            onClick={() => navigate('/admin-unidades')} 
            className="bg-yellow-500 hover:bg-yellow-600 text-green-950 px-6 py-2 rounded-2xl font-black shadow-md uppercase text-xs flex items-center gap-2 transition-all"
          >
            🛡️ Gerenciar Unidades
          </button>
          <button 
            onClick={() => navigate('/')} 
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-2xl font-black shadow-md uppercase text-xs transition-all"
          >
            Sair do Sistema
          </button>
        </div>
      </div>

      {/* CONTEÚDO DINÂMICO */}
      {view === 'tabela' ? (
        <>
          <button 
            onClick={() => setView('cadastro')} 
            className="mb-8 bg-green-700 hover:bg-green-800 text-white px-8 py-4 rounded-[25px] font-black shadow-xl uppercase tracking-widest active:scale-95 transition-all"
          >
            + Novo Desbravador
          </button>

          <div className="bg-white rounded-[40px] shadow-2xl overflow-hidden border border-gray-100">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-green-800 text-white uppercase text-xs font-black tracking-widest">
                  <tr>
                    <th className="p-6">Membro / Função</th>
                    <th className="p-6 text-center">Unidade</th>
                    <th className="p-6 text-center">Pontos</th>
                    <th className="p-6 text-center">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {membros.map(m => (
                    <tr key={m._id} className="border-b last:border-0 hover:bg-green-50 transition-colors">
                      <td className="p-6">
                        <div className="flex items-center gap-4">
                          <img 
                            src={m.foto_url} 
                            className="w-16 h-16 rounded-full object-cover border-4 border-green-100 shadow-sm" 
                            alt="foto" 
                            onError={(e) => e.target.src = "https://via.placeholder.com/150"}
                          />
                          <div>
                            <p className="font-black text-gray-800 uppercase leading-none mb-1">{m.nome}</p>
                            <p className="text-[10px] font-bold text-gray-400 uppercase italic">{m.funcao}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-6 text-center font-bold text-gray-500 uppercase">{m.unidade}</td>
                      <td className="p-6 text-center">
                        <span className="bg-green-100 text-green-800 px-4 py-2 rounded-xl font-black text-xl border border-green-200">
                          {m.pontos}
                        </span>
                      </td>
                      <td className="p-6 text-center">
                        {pontuandoId === m._id ? (
                          <div className="flex flex-col gap-2 bg-yellow-50 p-4 rounded-2xl border-2 border-yellow-400">
                            <input type="number" placeholder="Quantidade" className="p-2 border rounded-lg font-bold" value={inputPontos} onChange={e => setInputPontos(e.target.value)} />
                            <input type="text" placeholder="Motivo" className="p-2 border rounded-lg text-xs" value={inputMotivo} onChange={e => setInputMotivo(e.target.value)} />
                            <div className="flex gap-2">
                              <button onClick={() => salvarPontos(m._id)} className="bg-green-600 text-white flex-1 py-1 rounded-lg font-black uppercase text-[10px]">OK</button>
                              <button onClick={() => setPontuandoId('')} className="bg-red-500 text-white px-2 rounded-lg font-black">X</button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex justify-center gap-2">
                            <button onClick={() => setPontuandoId(m._id)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-black shadow-md text-[10px] uppercase">⭐ Pontuar</button>
                            <button onClick={() => abrirEdicao(m)} className="bg-amber-400 hover:bg-amber-500 text-white p-2 rounded-xl shadow-md">✏️</button>
                            <button onClick={async () => { if(window.confirm('Excluir?')) { await fetch(`${API_URL}/membros/${m._id}`, {method: 'DELETE'}); carregarMembros(); } }} className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-xl shadow-md">🗑️</button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <div className="bg-white p-8 rounded-[40px] shadow-2xl border-4 border-green-800 mb-10 animate-in fade-in zoom-in duration-300">
          <h2 className="text-2xl font-black mb-8 text-green-800 uppercase italic">
            {view === 'cadastro' ? 'Novo Desbravador' : 'Editar Informações'}
          </h2>
          <form onSubmit={handleSalvar} className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <input type="text" placeholder="NOME COMPLETO" className="border-2 p-4 rounded-2xl font-bold outline-none focus:border-green-600 uppercase" value={nome} onChange={e => setNome(e.target.value)} required />
             <input type="text" placeholder="UNIDADE" className="border-2 p-4 rounded-2xl font-bold outline-none focus:border-green-600 uppercase" value={unidade} onChange={e => setUnidade(e.target.value)} required />
             <input type="text" placeholder="FUNÇÃO / CARGO" className="border-2 p-4 rounded-2xl font-bold outline-none focus:border-green-600 uppercase" value={funcao} onChange={e => setFuncao(e.target.value)} required />
             <div className="flex flex-col gap-2">
               <label className="text-xs font-black text-gray-400 ml-2">FOTO (OPCIONAL)</label>
               <input type="file" className="border-2 p-3 rounded-2xl bg-gray-50 font-bold text-xs" onChange={e => setArquivo(e.target.files[0])} />
             </div>
             <div className="md:col-span-2 flex gap-4 mt-4">
                <button disabled={loading} className="bg-green-700 hover:bg-green-800 text-white p-5 rounded-2xl font-black flex-1 shadow-xl uppercase tracking-widest">
                  {loading ? "PROCESSANDO..." : "Salvar Registro"}
                </button>
                <button type="button" onClick={limparFormulario} className="bg-gray-400 text-white px-10 rounded-2xl font-black uppercase">Cancelar</button>
             </div>
          </form>
        </div>
      )}
    </div>
  );
}
