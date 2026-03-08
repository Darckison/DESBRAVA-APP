import React, { useState, useEffect } from 'react';

const UnitRanking = () => {
    const [ranking, setRanking] = useState([]);
    const [unidadeSelecionada, setUnidadeSelecionada] = useState(null);
    const [membros, setMembros] = useState([]);
    const [loading, setLoading] = useState(true);

    const API_URL = "https://desbrava-app.onrender.com"; 

    useEffect(() => {
        buscarRanking();
    }, []);

    const buscarRanking = async () => {
        try {
            const response = await fetch(`${API_URL}/ranking-unidades`);
            const data = await response.json();
            setRanking(Array.isArray(data) ? data : []);
            setLoading(false);
        } catch (error) {
            console.error("Erro ao buscar ranking:", error);
            setLoading(false);
        }
    };

    const verDetalhesUnidade = async (unidade) => {
        try {
            const response = await fetch(`${API_URL}/unidade/${unidade.nome}/membros`);
            const data = await response.json();
            setMembros(Array.isArray(data) ? data : []);
            setUnidadeSelecionada(unidade); // Salva o objeto da unidade completo
        } catch (error) {
            console.error("Erro ao buscar membros:", error);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center">
                <div className="text-yellow-500 text-2xl font-bold animate-pulse">Carregando Ranking Real...</div>
            </div>
        );
    }

    return (
        <div className="p-6 bg-slate-900 min-h-screen text-white">
            <h1 className="text-4xl font-black text-center mb-12 text-yellow-500 uppercase tracking-widest border-b-4 border-yellow-600 inline-block mx-auto w-full pb-4">
                🏆 Ranking de Unidades
            </h1>

            {/* Grid de Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                {ranking.map((unidade, index) => (
                    <div 
                        key={index}
                        onClick={() => verDetalhesUnidade(unidade)}
                        className="bg-slate-800 rounded-2xl shadow-2xl overflow-hidden border border-slate-700 cursor-pointer hover:border-yellow-500 hover:scale-105 transition-all duration-300 group"
                    >
                        {/* Cabeçalho do Card com Posição */}
                        <div className="bg-slate-700 p-4 flex justify-between items-center group-hover:bg-yellow-600 transition-colors">
                            <span className="text-3xl font-black text-yellow-500 group-hover:text-white">#{index + 1}</span>
                            <span className="bg-slate-900 text-yellow-500 text-xs font-bold px-3 py-1 rounded-full border border-yellow-500">
                                {unidade.total_membros} MEMBROS
                            </span>
                        </div>

                        {/* Logo e Nome */}
                        <div className="p-6 text-center">
                            <div className="w-24 h-24 mx-auto mb-4 relative">
                                <img 
                                    src={unidade.logo_url ? `${API_URL}${unidade.logo_url}` : "https://placehold.co/100x100?text=LOGO"} 
                                    alt={unidade.nome}
                                    className="w-full h-full rounded-full object-cover border-4 border-slate-700 shadow-lg group-hover:border-yellow-400"
                                    onError={(e) => e.target.src = "https://placehold.co/100x100?text=UNIDADE"}
                                />
                            </div>
                            <h2 className="text-2xl font-bold uppercase tracking-tight text-white group-hover:text-yellow-500">
                                Unidade {unidade.nome}
                            </h2>
                        </div>

                        {/* Pontuação Rápida */}
                        <div className="bg-slate-900 p-4 flex justify-around border-t border-slate-700">
                            <div className="text-center">
                                <p className="text-xs text-slate-400 uppercase font-bold">Total</p>
                                <p className="text-xl font-black text-yellow-500">{unidade.total} pts</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* MODAL DE DETALHES (A Janela que abre) */}
            {unidadeSelecionada && (
                <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
                    <div className="bg-slate-800 rounded-3xl w-full max-w-2xl overflow-hidden border-2 border-yellow-500 shadow-[0_0_50px_rgba(234,179,8,0.3)]">
                        
                        {/* Topo do Modal */}
                        <div className="relative p-8 text-center bg-gradient-to-b from-slate-700 to-slate-800">
                            <button 
                                onClick={() => setUnidadeSelecionada(null)}
                                className="absolute top-4 right-4 text-slate-400 hover:text-red-500 text-2xl font-bold"
                            >
                                ✕
                            </button>
                            
                            <img 
                                src={unidadeSelecionada.logo_url ? `${API_URL}${unidadeSelecionada.logo_url}` : "https://placehold.co/100"} 
                                className="w-28 h-28 rounded-full mx-auto border-4 border-yellow-500 shadow-xl mb-4 object-cover"
                            />
                            <h3 className="text-3xl font-black text-white uppercase tracking-tighter">
                                Unidade {unidadeSelecionada.nome}
                            </h3>
                            
                            <div className="grid grid-cols-3 gap-4 mt-6">
                                <div className="bg-slate-900 p-3 rounded-xl border border-slate-700">
                                    <p className="text-[10px] text-slate-400 uppercase font-bold">Unidade</p>
                                    <p className="text-lg font-bold text-blue-400">+{unidadeSelecionada.pontos_unidade}</p>
                                </div>
                                <div className="bg-slate-900 p-3 rounded-xl border border-slate-700">
                                    <p className="text-[10px] text-slate-400 uppercase font-bold">Membros</p>
                                    <p className="text-lg font-bold text-green-400">+{unidadeSelecionada.pontos_membros}</p>
                                </div>
                                <div className="bg-slate-900 p-3 rounded-xl border border-yellow-500/50 bg-yellow-500/5">
                                    <p className="text-[10px] text-yellow-600 uppercase font-bold">Geral</p>
                                    <p className="text-lg font-bold text-yellow-500">{unidadeSelecionada.total}</p>
                                </div>
                            </div>
                        </div>

                        {/* Tabela de Membros */}
                        <div className="p-6 max-h-[400px] overflow-y-auto">
                            <h4 className="text-sm font-bold text-slate-400 uppercase mb-4 border-l-4 border-yellow-500 pl-2">Membros e Pontuações</h4>
                            <div className="space-y-2">
                                {membros.map((membro) => (
                                    <div key={membro._id} className="flex justify-between items-center bg-slate-900 p-3 rounded-lg border border-slate-700">
                                        <span className="font-semibold text-slate-200">{membro.nome}</span>
                                        <span className="bg-green-900/30 text-green-400 px-3 py-1 rounded-full text-sm font-bold border border-green-500/20">
                                            {membro.pontos} pts
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UnitRanking;
