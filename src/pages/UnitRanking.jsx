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

    // FUNÇÃO QUE ABRE OS DETALHES (O QUE TINHA SUMIDO)
    const verDetalhesUnidade = async (unidade) => {
        try {
            const response = await fetch(`${import React, { useState, useEffect } from 'react';

const GerenciarUnidades = () => {
    const [unidades, setUnidades] = useState([]);
    const [nome, setNome] = useState('');
    const [pontos, setPontos] = useState(0);
    const [logo, setLogo] = useState(null);
    const [loading, setLoading] = useState(false);

    const API_URL = "https://desbrava-app.onrender.com";

    useEffect(() => { buscarUnidades(); }, []);

    const buscarUnidades = async () => {
        const res = await fetch(`${API_URL}/ranking-unidades`);
        const data = await res.json();
        setUnidades(data);
    };

    const handleSalvar = async (e) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData();
        formData.append('nome', nome.toUpperCase());
        formData.append('pontos_proprios', pontos);
        if (logo) formData.append('logo', logo);

        await fetch(`${API_URL}/unidades`, { method: 'POST', body: formData });
        alert("Unidade Salva!");
        setNome(''); setPontos(0); setLogo(null);
        buscarUnidades();
        setLoading(false);
    };

    return (
        <div className="p-8 bg-green-950 min-h-screen text-white">
            <h1 className="text-3xl font-black text-center mb-8 text-yellow-500 uppercase italic">🛡️ Gerenciar Unidades</h1>
            
            <form onSubmit={handleSalvar} className="max-w-2xl mx-auto bg-green-900 p-8 rounded-[40px] border-4 border-green-800 shadow-2xl mb-12">
                <div className="grid grid-cols-1 gap-6">
                    <input type="text" placeholder="NOME DA UNIDADE (EX: ÔNIX)" value={nome} onChange={e => setNome(e.target.value)} className="bg-green-800 p-4 rounded-2xl outline-none border-2 border-green-700 font-bold" required />
                    <input type="number" placeholder="PONTOS PRÓPRIOS DA UNIDADE" value={pontos} onChange={e => setPontos(e.target.value)} className="bg-green-800 p-4 rounded-2xl outline-none border-2 border-green-700 font-bold" />
                    <input type="file" onChange={e => setLogo(e.target.files[0])} className="bg-green-950 p-4 rounded-2xl border-2 border-dashed border-green-700" />
                    <button className="bg-yellow-500 text-green-950 font-black py-5 rounded-2xl uppercase shadow-xl tracking-widest">{loading ? "SALVANDO..." : "✅ SALVAR UNIDADE"}</button>
                </div>
            </form>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
                {unidades.map(u => (
                    <div key={u.nome} className="flex items-center justify-between bg-white/10 p-4 rounded-3xl border border-white/10">
                        <div className="flex items-center gap-4">
                            <img src={u.logo_url} className="w-14 h-14 rounded-full object-cover border-2 border-yellow-500" alt="logo" />
                            <span className="font-black uppercase italic">{u.nome}</span>
                        </div>
                        <button onClick={async () => { if(window.confirm('Excluir Unidade?')) { await fetch(`${API_URL}/unidades/${u.nome}`, {method: 'DELETE'}); buscarUnidades(); } }} className="bg-red-600 p-2 rounded-xl">🗑️</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GerenciarUnidades;API_URL}/unidade/${unidade.nome}/membros`);
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                {ranking.map((unidade, index) => (
                    <div 
                        key={index}
                        onClick={() => verDetalhesUnidade(unidade)} // CLIQUE PARA ABRIR O CADASTRO DE MEMBROS
                        className="bg-green-900 rounded-[32px] shadow-2xl overflow-hidden border-2 border-green-800 cursor-pointer hover:border-yellow-500 hover:scale-105 transition-all duration-300 group"
                    >
                        <div className="bg-green-800 p-4 flex justify-between items-center group-hover:bg-yellow-500 transition-colors">
                            <span className="text-3xl font-black text-yellow-500 group-hover:text-green-950">#{index + 1}</span>
                            <span className="bg-green-950 text-green-400 text-[10px] font-black px-3 py-1 rounded-full border border-green-700 uppercase">
                                {unidade.total_membros} MEMBROS
                            </span>
                        </div>

                        <div className="p-6 text-center">
                            <div className="w-28 h-28 mx-auto mb-4">
                                <img 
                                    src={unidade.logo_url} 
                                    alt={unidade.nome}
                                    className="w-full h-full rounded-full object-cover border-4 border-green-700 shadow-xl group-hover:border-yellow-400"
                                    onError={(e) => { e.target.src = "https://placehold.co/150x150?text=LOGO"; }}
                                />
                            </div>
                            <h2 className="text-2xl font-black uppercase italic text-white group-hover:text-yellow-400">
                                {unidade.nome}
                            </h2>
                        </div>

                        <div className="bg-green-950 p-4 flex justify-center border-t border-green-800">
                            <p className="text-2xl font-black text-yellow-500">{unidade.total} <small className="text-xs font-bold text-green-500">PTS</small></p>
                        </div>
                    </div>
                ))}
            </div>

            {/* MODAL (A JANELA QUE MOSTRA OS MEMBROS) */}
            {unidadeSelecionada && (
                <div className="fixed inset-0 bg-green-950/90 flex items-center justify-center p-4 z-50 backdrop-blur-md">
                    <div className="bg-green-900 rounded-[40px] w-full max-w-2xl overflow-hidden border-4 border-yellow-500 shadow-2xl">
                        
                        <div className="relative p-8 text-center bg-green-800">
                            <button onClick={() => setUnidadeSelecionada(null)} className="absolute top-6 right-6 text-green-300 hover:text-red-500 text-3xl font-black">✕</button>
                            <img src={unidadeSelecionada.logo_url} className="w-28 h-28 rounded-full mx-auto border-4 border-yellow-500 shadow-2xl mb-4 object-cover" onError={(e) => e.target.src="https://placehold.co/100"} />
                            <h3 className="text-3xl font-black text-white uppercase italic">Unidade {unidadeSelecionada.nome}</h3>
                            
                            <div className="grid grid-cols-2 gap-4 mt-6">
                                <div className="bg-green-950 p-3 rounded-2xl border border-green-700">
                                    <p className="text-[10px] text-green-500 uppercase font-black">Membros</p>
                                    <p className="text-xl font-black text-green-400">+{unidadeSelecionada.pontos_membros}</p>
                                </div>
                                <div className="bg-yellow-500 p-3 rounded-2xl border border-yellow-600">
                                    <p className="text-[10px] text-green-900 uppercase font-black">Total</p>
                                    <p className="text-xl font-black text-green-950">{unidadeSelecionada.total}</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 max-h-[300px] overflow-y-auto">
                            <h4 className="text-xs font-black text-green-400 uppercase mb-4 border-l-4 border-yellow-500 pl-3">Pontuação por Membro</h4>
                            <div className="space-y-2">
                                {membros.map((m) => (
                                    <div key={m._id} className="flex justify-between items-center bg-green-950 p-3 rounded-xl border border-green-800">
                                        <span className="font-bold text-white text-sm uppercase">{m.nome}</span>
                                        <span className="text-yellow-500 font-black">{m.pontos} pts</span>
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

