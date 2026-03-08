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
            setUnidadeSelecionada(unidade); 
        } catch (error) {
            console.error("Erro ao buscar membros:", error);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-green-950 flex items-center justify-center">
                <div className="text-yellow-500 text-2xl font-black animate-pulse uppercase">Carregando Ranking...</div>
            </div>
        );
    }

    return (
        <div className="p-6 bg-green-950 min-h-screen text-white font-sans">
            <h1 className="text-4xl font-black text-center mb-12 text-yellow-500 uppercase italic tracking-tighter border-b-4 border-green-700 pb-4">
                🏆 Ranking de Unidades
            </h1>

            {/* Grid de Cards das Unidades */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                {ranking.map((unidade, index) => (
                    <div 
                        key={index}
                        onClick={() => verDetalhesUnidade(unidade)}
                        className="bg-green-900 rounded-[32px] shadow-2xl overflow-hidden border-2 border-green-800 cursor-pointer hover:border-yellow-500 hover:scale-105 transition-all duration-300 group"
                    >
                        {/* Topo do Card com Posição */}
                        <div className="bg-green-800 p-4 flex justify-between items-center group-hover:bg-yellow-500 transition-colors">
                            <span className="text-3xl font-black text-yellow-500 group-hover:text-green-950">#{index + 1}</span>
                            <span className="bg-green-950 text-green-400 text-[10px] font-black px-3 py-1 rounded-full border border-green-700 uppercase">
                                {unidade.total_membros} Desbravadores
                            </span>
                        </div>

                        {/* Logo e Nome da Unidade */}
                        <div className="p-6 text-center">
                            <div className="w-28 h-28 mx-auto mb-4 relative">
                                <img 
                                    src={unidade.logo_url} 
                                    alt={unidade.nome}
                                    className="w-full h-full rounded-full object-cover border-4 border-green-700 shadow-xl group-hover:border-yellow-400"
                                    onError={(e) => {
                                        e.target.onerror = null; 
                                        e.target.src = "https://placehold.co/150x150?text=UNIDADE";
                                    }}
                                />
                            </div>
                            <h2 className="text-2xl font-black uppercase italic text-white group-hover:text-yellow-400">
                                {unidade.nome}
                            </h2>
                        </div>

                        {/* Pontuação Geral no Card */}
                        <div className="bg-green-950 p-4 flex justify-center border-t border-green-800">
                            <div className="text-center">
                                <p className="text-[10px] text-green-500 uppercase font-black tracking-widest leading-none mb-1">Pontuação Total</p>
                                <p className="text-2xl font-black text-yellow-500">{unidade.total} <small className="text-xs">PTS</small></p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* MODAL DE DETALHES (A Janela que abre ao clicar) */}
            {unidadeSelecionada && (
                <div className="fixed inset-0 bg-green-950/90 flex items-center justify-center p-4 z-50 backdrop-blur-md">
                    <div className="bg-green-900 rounded-[40px] w-full max-w-2xl overflow-hidden border-4 border-yellow-500 shadow-2xl">
                        
                        {/* Cabeçalho do Modal */}
                        <div className="relative p-8 text-center bg-green-800">
                            <button 
                                onClick={() => setUnidadeSelecionada(null)}
                                className="absolute top-6 right-6 text-green-300 hover:text-red-500 text-3xl font-black transition-colors"
                            >
                                ✕
                            </button>
                            
                            <img 
                                src={unidadeSelecionada.logo_url} 
                                className="w-32 h-32 rounded-full mx-auto border-4 border-yellow-500 shadow-2xl mb-4 object-cover"
                                onError={(e) => { e.target.src = "https://placehold.co/150x150?text=LOGO"; }}
                            />
                            <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter">
                                Unidade {unidadeSelecionada.nome}
                            </h3>
                            
                            <div className="grid grid-cols-3 gap-3 mt-8">
                                <div className="bg-green-950 p-4 rounded-2xl border border-green-700">
                                    <p className="text-[10px] text-green-500 uppercase font-black">Unidade</p>
                                    <p className="text-xl font-black text-blue-400">+{unidadeSelecionada.pontos_unidade}</p>
                                </div>
                                <div className="bg-green-950 p-4 rounded-2xl border border-green-700">
                                    <p className="text-[10px] text-green-500 uppercase font-black">Membros</p>
                                    <p className="text-xl font-black text-green-400">+{unidadeSelecionada.pontos_membros}</p>
                                </div>
                                <div className="bg-yellow-500 p-4 rounded-2xl border border-yellow-600 shadow-inner">
                                    <p className="text-[10px] text-green-950 uppercase font-black">Geral</p>
                                    <p className="text-xl font-black text-green-900">{unidadeSelecionada.total}</p>
                                </div>
                            </div>
                        </div>

                        {/* Listagem de Membros no Modal */}
                        <div className="p-8 max-h-[350px] overflow-y-auto bg-green-900">
                            <h4 className="text-xs font-black text-green-400 uppercase mb-4 border-l-4 border-yellow-500 pl-3 tracking-widest">Lista de Pontuação Individual</h4>
                            <div className="space-y-3">
                                {membros.length > 0 ? membros.map((membro) => (
                                    <div key={membro._id} className="flex justify-between items-center bg-green-950 p-4 rounded-2xl border border-green-800">
                                        <span className="font-bold text-green-100 uppercase text-sm">{membro.nome}</span>
                                        <span className="bg-green-800 text-yellow-500 px-4 py-1 rounded-xl text-sm font-black border border-green-700">
                                            {membro.pontos} <small className="text-[10px]">PTS</small>
                                        </span>
                                    </div>
                                )) : (
                                    <p className="text-center text-green-600 italic">Nenhum membro encontrado nesta unidade.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UnitRanking;
