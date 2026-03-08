import React, { useState, useEffect } from 'react';

export default function UnitRanking() {
    const [ranking, setRanking] = useState([]);
    const [unidadeAberta, setUnidadeAberta] = useState(null);
    const [membrosDaUnidade, setMembrosDaUnidade] = useState([]);
    const [loading, setLoading] = useState(true);

    const API_URL = "https://desbrava-app.onrender.com";

    useEffect(() => {
        fetch(`${API_URL}/ranking-unidades`)
            .then(res => res.json())
            .then(data => {
                setRanking(Array.isArray(data) ? data : []);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const abrirUnidade = async (unidade) => {
        try {
            const res = await fetch(`${API_URL}/unidade/${unidade.nome}/membros`);
            const data = await res.json();
            setMembrosDaUnidade(data);
            setUnidadeAberta(unidade);
        } catch (error) {
            console.error("Erro ao buscar membros");
        }
    };

    if (loading) return <div className="min-h-screen bg-green-950 flex items-center justify-center text-yellow-500 font-black">CARREGANDO RANKING...</div>;

    return (
        <div className="min-h-screen bg-green-950 p-6 text-white font-sans">
            <h1 className="text-4xl font-black text-center mb-12 text-yellow-500 uppercase italic border-b-4 border-green-800 pb-4">Ranking por Unidades</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {ranking.map((uni, idx) => (
                    <div key={idx} onClick={() => abrirUnidade(uni)} className="bg-green-900 p-6 rounded-[40px] border-2 border-green-800 cursor-pointer hover:border-yellow-500 transition-all hover:scale-105 shadow-2xl">
                        <div className="flex items-center gap-5 mb-6">
                            <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-yellow-500 bg-green-950 shadow-lg">
                                <img 
                                    src={uni.logo_url} 
                                    className="w-full h-full object-cover" 
                                    alt="logo" 
                                    onError={(e) => { e.target.src = "https://placehold.co/150?text=LOGO"; }}
                                />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black uppercase italic italic">{uni.nome}</h2>
                                <p className="text-xs text-green-400 font-bold">{uni.total_membros} MEMBROS NO CLUBE</p>
                            </div>
                        </div>
                        <div className="bg-green-950 p-4 rounded-3xl text-center border border-green-800">
                            <p className="text-3xl font-black text-yellow-500">{uni.total} <span className="text-xs uppercase">Pontos</span></p>
                        </div>
                    </div>
                ))}
            </div>

            {/* MODAL COM OS MEMBROS DA UNIDADE */}
            {unidadeAberta && (
                <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
                    <div className="bg-green-900 rounded-[50px] w-full max-w-lg border-4 border-yellow-500 shadow-2xl overflow-hidden">
                        <div className="p-8 text-center bg-green-800 relative">
                            <button onClick={() => setUnidadeAberta(null)} className="absolute top-6 right-8 text-3xl font-black hover:text-red-500">✕</button>
                            <img src={unidadeAberta.logo_url} className="w-24 h-24 rounded-full mx-auto border-4 border-yellow-500 mb-4 object-cover shadow-xl" />
                            <h3 className="text-3xl font-black uppercase italic">Unidade {unidadeAberta.nome}</h3>
                        </div>
                        <div className="p-6 space-y-3 max-h-96 overflow-y-auto">
                            {membrosDaUnidade.map(m => (
                                <div key={m._id} className="flex justify-between items-center bg-green-950 p-4 rounded-2xl border border-green-800">
                                    <span className="font-bold uppercase text-sm tracking-tighter">{m.nome}</span>
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
