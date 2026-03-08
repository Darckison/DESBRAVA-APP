import React, { useState, useEffect } from 'react';

export default function UnitRanking() {
  const [ranking, setRanking] = useState([]);
  const [unidadeAberta, setUnidadeAberta] = useState(null);
  const [membros, setMembros] = useState([]);
  const API_URL = "https://desbrava-app-1.onrender.com";

  useEffect(() => {
    fetch(`${API_URL}/ranking-unidades`)
      .then((res) => res.json())
      .then((data) => setRanking(Array.isArray(data) ? data : []));
  }, []);

  const verMembros = async (uni) => {
    const res = await fetch(`${API_URL}/unidade/${uni.nome}/membros`);
    const data = await res.json();
    setMembros(data);
    setUnidadeAberta(uni);
  };

  return (
    <div className="min-h-screen bg-green-950 p-6 text-white font-sans">
      <h1 className="text-4xl font-black text-center mb-12 text-yellow-500 uppercase italic border-b-4 border-green-800 pb-4 tracking-tighter">
        🏆 Ranking de Unidades
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {ranking.map((uni, idx) => (
          <div
            key={idx}
            onClick={() => verMembros(uni)}
            className="bg-green-900 p-6 rounded-[40px] border-4 border-green-800 cursor-pointer hover:border-yellow-500 transition-all shadow-2xl"
          >
            <div className="flex items-center gap-5 mb-6">
              <img
                src={uni.logo_url}
                className="w-20 h-20 rounded-full object-cover border-4 border-yellow-500 bg-green-950"
                alt="Logo"
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/150";
                }}
              />
              <div>
                <h2 className="text-2xl font-black uppercase italic">{uni.nome}</h2>
                <p className="text-xs text-green-400 font-bold uppercase">
                  {uni.total_membros} MEMBROS
                </p>
              </div>
            </div>
            <div className="bg-green-950 p-4 rounded-3xl text-center border-2 border-green-800">
              <p className="text-3xl font-black text-yellow-500">
                {uni.total} <small className="text-xs">PTS</small>
              </p>
            </div>
          </div>
        ))}
      </div>

      {unidadeAberta && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-50 backdrop-blur-md">
          <div className="bg-green-900 rounded-[50px] w-full max-w-lg border-4 border-yellow-500 overflow-hidden shadow-2xl">
            <div className="p-8 text-center bg-green-800 relative">
              <button
                onClick={() => setUnidadeAberta(null)}
                className="absolute top-6 right-8 text-3xl font-black"
              >
                ✕
              </button>
              <div className="w-32 h-32 mx-auto mb-4">
                <img
                  src={unidadeAberta.logo_url}
                  className="w-full h-full rounded-full object-cover border-4 border-yellow-500 shadow-xl"
                  alt="Logo da Unidade"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/150";
                  }}
                />
              </div>
              <h3 className="text-3xl font-black uppercase italic">
                Unidade {unidadeAberta.nome}
              </h3>
            </div>
            <div className="p-6 space-y-3 max-h-80 overflow-y-auto">
              {membros.map((m) => (
                <div
                  key={m._id}
                  className="flex justify-between bg-green-950 p-4 rounded-2xl border-2 border-green-800"
                >
                  <span className="font-bold uppercase text-sm">{m.nome}</span>
                  <span className="text-yellow-500 font-black">{m.pontos} PTS</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
