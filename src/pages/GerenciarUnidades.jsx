import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function GerenciarUnidades() {
  const [nome, setNome] = useState('');
  const [pontos, setPontos] = useState(0);
  const [arquivo, setArquivo] = useState(null);
  const [unidades, setUnidades] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const API_URL = "https://desbrava-app-1.onrender.com";

  const carregarUnidades = () => {
    fetch(`${API_URL}/ranking-unidades`)
      .then((res) => res.json())
      .then((data) => setUnidades(Array.isArray(data) ? data : []));
  };

  useEffect(() => {
    carregarUnidades();
  }, []);

  const handleSalvar = async (e) => {
    e.preventDefault();
    setLoading(true);
    const data = new FormData();
    data.append('nome', nome);
    data.append('pontos_proprios', pontos);
    if (arquivo) data.append('logo', arquivo);

    try {
      await fetch(`${API_URL}/unidades`, { method: 'POST', body: data });
      alert("Unidade e Logo salvas com sucesso!");
      setNome('');
      setPontos(0);
      setArquivo(null);
      carregarUnidades();
    } catch (error) {
      alert("Erro ao salvar unidade.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-2xl mx-auto bg-gray-50 min-h-screen font-sans">
      <div className="bg-white p-8 rounded-[40px] shadow-2xl border-t-8 border-green-800 text-center mb-10">
        <h1 className="text-3xl font-black text-green-800 italic uppercase tracking-tighter">
          Gerenciar Unidades
        </h1>
      </div>

      <form
        onSubmit={handleSalvar}
        className="bg-white p-10 rounded-[40px] shadow-2xl border-4 border-green-800 mb-10"
      >
        <div className="space-y-6">
          <input
            type="text"
            placeholder="NOME DA UNIDADE"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="w-full border-2 p-4 rounded-2xl font-black uppercase outline-none focus:border-green-600"
            required
          />
          <input
            type="number"
            placeholder="PONTOS EXTRAS"
            value={pontos}
            onChange={(e) => setPontos(e.target.value)}
            className="w-full border-2 p-4 rounded-2xl font-black outline-none focus:border-green-600"
          />
          <div className="bg-gray-50 p-4 rounded-2xl border-2 border-dashed border-gray-300">
            <input
              type="file"
              onChange={(e) => setArquivo(e.target.files[0])}
              className="text-xs font-bold w-full"
            />
          </div>
          <div className="flex gap-4">
            <button className="flex-1 bg-green-700 text-white py-5 rounded-2xl font-black uppercase shadow-xl hover:bg-green-800 transition-all">
              {loading ? "SALVANDO..." : "SALVAR"}
            </button>
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="flex-1 bg-gray-300 text-gray-700 py-5 rounded-2xl font-black uppercase"
            >
              VOLTAR
            </button>
          </div>
        </div>
      </form>

      <div className="space-y-4">
        {unidades.map((u, i) => (
          <div
            key={i}
            className="bg-white p-5 rounded-[30px] shadow-lg flex items-center justify-between border-2 border-gray-100"
          >
            <div className="flex items-center gap-5">
              <img
                src={u.logo_url}
                className="w-16 h-16 rounded-full object-cover border-4 border-green-100 shadow-md"
                alt="Logo"
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/100?text=LOGO";
                }}
              />
              <span className="font-black uppercase text-xl text-gray-800 italic">
                {u.nome}
              </span>
            </div>
            <button
              onClick={async () => {
                if (window.confirm('Excluir unidade?')) {
                  await fetch(`${API_URL}/unidades/${u.nome}`, { method: 'DELETE' });
                  carregarUnidades();
                }
              }}
              className="bg-red-500 text-white p-3 rounded-2xl shadow-md hover:bg-red-600"
            >
              🗑️
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
