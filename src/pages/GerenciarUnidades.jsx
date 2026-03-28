import React, { useState, useEffect } from 'react';

import { useNavigate } from 'react-router-dom';



export default function GerenciarUnidades() {

  const [nome, setNome] = useState('');

  const [pontos, setPontos] = useState(0);

  const [arquivo, setArquivo] = useState(null);

  const [unidades, setUnidades] = useState([]);

  const [loading, setLoading] = useState(false);

  const [mostrandoForm, setMostrandoForm] = useState(false);

  const [editandoId, setEditandoId] = useState(null); // Estado para controlar edição

  

  const [pontuandoNome, setPontuandoNome] = useState('');

  const [inputPontos, setInputPontos] = useState('');

  const [inputMotivo, setInputMotivo] = useState('');

  const [historicoAberto, setHistoricoAberto] = useState(null);



  const navigate = useNavigate();

  const API_URL = "https://desbrava-app.onrender.com";



  const carregarUnidades = async () => {

    try {

      const res = await fetch(`${API_URL}/ranking-unidades`);

      const data = await res.json();

      setUnidades(Array.isArray(data) ? data : []);

    } catch (error) {

      console.error("Erro ao carregar unidades:", error);

    }

  };



  useEffect(() => {

    carregarUnidades();

  }, []);



  const handleSalvar = async (e) => {

    e.preventDefault();

    setLoading(true);

    const data = new FormData();

    data.append('nome', nome.toUpperCase());

    data.append('pontos_proprios', pontos);

    if (arquivo) { data.append('logo', arquivo); }



    // Define se é criação ou edição

    const url = editandoId ? `${API_URL}/unidades/${editandoId}` : `${API_URL}/unidades`;

    const method = editandoId ? 'PUT' : 'POST';



    try {

      const response = await fetch(url, {

        method: method,

        body: data,

      });

      if (response.ok) {

        alert(editandoId ? "✅ Unidade atualizada!" : "✅ Unidade salva!");

        limparFormulario();

        carregarUnidades();

      }

    } catch (error) {

      alert("❌ Erro de conexão.");

    } finally {

      setLoading(false);

    }

  };



  const abrirEdicao = (u) => {

    setEditandoId(u._id); // Assume que o banco retorna o ID em _id

    setNome(u.nome);

    setPontos(u.pontos_proprios || 0);

    setMostrandoForm(true);

  };



  const limparFormulario = () => {

    setNome(''); setPontos(0); setArquivo(null); setMostrandoForm(false); setEditandoId(null);

  };



  const salvarPontosUnidade = async (nomeUnidade) => {

    if (!inputPontos || !inputMotivo) {

      alert("Preencha quantidade e motivo!");

      return;

    }

    const data = new FormData();

    data.append('valor', inputPontos);

    data.append('motivo', inputMotivo);



    try {

      const res = await fetch(`${API_URL}/unidades/${nomeUnidade}/pontos`, {

        method: 'PATCH',

        body: data

      });

      if (res.ok) {

        setPontuandoNome(''); setInputPontos(''); setInputMotivo('');

        carregarUnidades();

      }

    } catch (err) {

      alert("Erro ao pontuar unidade.");

    }

  };



  const deletarUnidade = async (nomeUnidade) => {

    if (window.confirm(`Deseja excluir a unidade ${nomeUnidade}?`)) {

      try {

        await fetch(`${API_URL}/unidades/${nomeUnidade}`, { method: 'DELETE' });

        carregarUnidades();

      } catch (error) {

        alert("Erro ao deletar.");

      }

    }

  };



  return (

    <div className="p-4 md:p-8 max-w-2xl mx-auto bg-gray-50 min-h-screen font-sans text-gray-800">

      

      {historicoAberto && (

        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">

          <div className="bg-white rounded-[32px] w-full max-w-md shadow-2xl overflow-hidden border-4 border-green-800">

            <div className="bg-green-800 p-6 text-white flex justify-between items-center">

              <div>

                <h3 className="font-black uppercase italic leading-none text-lg tracking-tighter">Histórico da Unidade</h3>

                <p className="text-[10px] opacity-70 mt-1 uppercase font-bold tracking-widest">{historicoAberto.nome}</p>

              </div>

              <button onClick={() => setHistoricoAberto(null)} className="bg-white/20 hover:bg-white/30 w-8 h-8 rounded-full font-black text-sm">X</button>

            </div>

            <div className="p-6 max-h-[400px] overflow-y-auto bg-gray-50">

              {!historicoAberto.historico_pontos || historicoAberto.historico_pontos.length === 0 ? (

                <p className="text-center text-gray-400 font-bold py-10 uppercase text-[10px] tracking-[0.2em]">Nenhum ponto registrado</p>

              ) : (

                <div className="space-y-3">

                  {[...historicoAberto.historico_pontos].reverse().map((h, i) => (

                    <div key={i} className="flex justify-between items-center p-4 bg-white rounded-2xl border-l-4 border-yellow-500 shadow-sm">

                      <div className="flex-1 pr-4">

                        <p className="text-[10px] font-black uppercase text-green-900 leading-tight mb-1">{h.motivo}</p>

                        <p className="text-[8px] text-gray-400 font-bold uppercase italic">{h.data}</p>

                      </div>

                      <div className="bg-green-800 text-white px-3 py-1 rounded-lg font-black text-xs">+ {h.valor}</div>

                    </div>

                  ))}

                </div>

              )}

            </div>

          </div>

        </div>

      )}



      <div className="bg-white p-6 rounded-[40px] shadow-lg border-t-8 border-green-800 text-center mb-8 flex flex-col md:flex-row items-center justify-between gap-4">

        <h1 className="text-2xl font-black text-green-800 italic uppercase tracking-tighter">Gerenciar Unidades</h1>

        <button onClick={() => navigate('/dashboard')} className="bg-gray-200 text-gray-700 px-6 py-2 rounded-2xl font-black uppercase text-xs">VOLTAR</button>

      </div>



      {!mostrandoForm && (

        <button onClick={() => setMostrandoForm(true)} className="w-full mb-8 bg-green-700 text-white py-5 rounded-[30px] font-black uppercase shadow-xl hover:bg-green-800 active:scale-95 transition-all">

          + NOVA UNIDADE

        </button>

      )}



      {mostrandoForm && (

        <form onSubmit={handleSalvar} className="bg-white p-8 rounded-[40px] shadow-2xl border-4 border-green-800 mb-10 animate-in zoom-in-95 duration-200">

          <div className="space-y-6">

            <h2 className="text-xl font-black text-green-800 uppercase italic">{editandoId ? 'Editar Unidade' : 'Cadastrar Unidade'}</h2>

            <input type="text" placeholder="NOME DA UNIDADE" value={nome} onChange={(e) => setNome(e.target.value)} className="w-full border-2 p-4 rounded-2xl font-black uppercase outline-none focus:border-green-600" required />

            <input type="number" placeholder="PONTOS ADICIONAIS" value={pontos} onChange={(e) => setPontos(e.target.value)} className="w-full border-2 p-4 rounded-2xl font-black outline-none focus:border-green-600" />

            <div className="bg-gray-50 p-4 rounded-2xl border-2 border-dashed border-gray-300">

              <label className="text-[10px] font-black uppercase text-gray-400 block mb-2">Logo da Unidade</label>

              <input type="file" accept="image/*" onChange={(e) => setArquivo(e.target.files[0])} className="text-xs font-bold w-full" />

            </div>

            <div className="flex gap-4">

              <button type="submit" disabled={loading} className="flex-1 bg-green-700 text-white py-5 rounded-2xl font-black uppercase shadow-xl">{loading ? "SALVANDO..." : "SALVAR ALTERAÇÕES"}</button>

              <button type="button" onClick={limparFormulario} className="flex-1 bg-red-100 text-red-600 py-5 rounded-2xl font-black uppercase text-xs">CANCELAR</button>

            </div>

          </div>

        </form>

      )}



      <div className="space-y-4">

        <h2 className="text-center font-black text-gray-400 uppercase text-[10px] tracking-widest mb-2">Unidades no Banco</h2>

        {unidades.map((u, i) => (

          <div key={i} className="bg-white p-4 rounded-[35px] shadow-lg border-2 border-gray-100 flex flex-col gap-4 transition-all hover:border-green-100">

            <div className="flex items-center justify-between">

              <div className="flex items-center gap-4">

                <img src={u.logo_url} className="w-14 h-14 rounded-full object-cover border-4 border-green-100 shadow-sm" alt="logo" onError={(e) => { e.target.src = "https://via.placeholder.com/100?text=LOGO"; }} />

                <div>

                    <span className="font-black uppercase text-lg text-gray-800 italic leading-none">{u.nome}</span>

                    <p onClick={() => setHistoricoAberto(u)} className="text-[10px] font-bold text-green-700 uppercase cursor-pointer hover:underline">Pontos: {u.total} 🔍</p>

                </div>

              </div>



              {pontuandoNome === u.nome ? (

                  <div className="flex flex-col gap-2 bg-yellow-50 p-3 rounded-2xl border-2 border-yellow-400 w-full max-w-[200px]">

                      <input type="number" placeholder="Qtd" className="p-2 border rounded-lg font-bold text-xs" value={inputPontos} onChange={e => setInputPontos(e.target.value)} />

                      <input type="text" placeholder="Motivo" className="p-2 border rounded-lg text-[10px]" value={inputMotivo} onChange={e => setInputMotivo(e.target.value)} />

                      <div className="flex gap-2">

                          <button onClick={() => salvarPontosUnidade(u.nome)} className="bg-green-600 text-white flex-1 py-1 rounded-lg font-black uppercase text-[9px]">OK</button>

                          <button onClick={() => setPontuandoNome('')} className="bg-red-500 text-white px-2 rounded-lg font-black text-xs">X</button>

                      </div>

                  </div>

              ) : (

                  <div className="flex gap-2">

                    <button onClick={() => setPontuandoNome(u.nome)} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-xl font-black shadow-md text-[9px] uppercase">⭐ PONTUAR</button>

                    <button onClick={() => abrirEdicao(u)} className="bg-amber-400 hover:bg-amber-500 text-white p-2.5 rounded-xl shadow-md transition-all">✏️</button>

                    <button onClick={() => deletarUnidade(u.nome)} className="bg-red-500 hover:bg-red-600 text-white p-2.5 rounded-xl shadow-md">🗑️</button>

                  </div>

              )}

            </div>

          </div>

        ))}

      </div>

    </div>

  );

}
