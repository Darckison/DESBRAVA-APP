import React, { useState, useEffect } from 'react';

export default function UnitRanking() {
    const [ranking, setRanking] = useState([]);
    const [unidadeAberta, setUnidadeAberta] = useState(null);
    const [membrosDaUnidade, setMembrosDaUnidade] = useState([]);
    const API_URL = "https://desbrava-app.onrender.com";

    useEffect(() => {
        fetch(`${API_URL}/ranking-unidades`)
            .then(res => res.json())
            .then(data => setRanking(Array.isArray(data) ? data : []));
    }, []);

    const abrirUnidade = async (unidade) => {
        const res = await fetch(`${API_URL}/unidade/${unidade.nome}/membros`);
        const data = await res.json();
        setMembrosDaUnidade(data);
        setUnidadeAberta(unidade);
    };

    return (
        <div className="min-h-screen bg-green-950 p-6 text-white font-sans">
            <h1 className="text-3xl font-black text-center mb-10 text-yellow-500 uppercase italic border-b-4 border-green-800 pb-4">Ranking por Unidades</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {ranking.map((uni, idx) => (
                    <div key={idx} onClick={() => abrirUnidade(uni)} className="bg-green-900 p-6 rounded-[30px] border-2 border-green-800 cursor-pointer hover:scale-105 transition-all">
                        <div className="flex items-center gap-4 mb-4">
                            <img src={uni.logo_url} className="w-16 h-16 rounded-full object-cover border-2 border-yellow-500" alt="logo" />
                            <div>
                                <h2 className="text-xl font-black uppercase">{uni.nome}</h2>
                                <p className="text-xs text-green-400 font-bold">{uni.total_membros} MEMBROS</p>
                            </div>
                        </div>
                        <div className="bg-green-950 p-3 rounded-2xl text-center">
                            <p className="text-2xl font-black text-yellow-500">{uni.total} PTS</p>
                        </div>
                    </div>
                ))}
            </div>

            {unidadeAberta && (
                <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-50">
                    <div className="bg-green-900 rounded-[40px] w-full max-w-lg border-4 border-yellow-500 overflow-hidden">
                        <div className="p-6 text-center bg-green-800 relative">
                            <button onClick={() => setUnidadeAberta(null)} className="absolute top-4 right-6 text-2xl font-black">✕</button>
                            <img src={unidadeAberta.logo_url} className="w-20 h-20 rounded-full mx-auto border-2 border-yellow-500 mb-2" />
                            <h3 className="text-2xl font-black uppercase italic">{unidadeAberta.nome}</h3>
                        </div>
                        <div className="p-6 space-y-2 max-h-80 overflow-y-auto">
                            {membrosDaUnidade.map(m => (
                                <div key={m._id} className="flex justify-between bg-green-950 p-4 rounded-2xl border border-green-800">
                                    <span className="font-bold uppercase text-sm">{m.nome}</span>
                                    <span className="text-yellow-500 font-black">{m.pontos} pts</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
