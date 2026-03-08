import React, { useState, useEffect } from 'react';

const GerenciarUnidades = () => {
    const [unidades, setUnidades] = useState([]);
    const [nome, setNome] = useState('');
    const [pontos, setPontos] = useState(0);
    const [logo, setLogo] = useState(null);
    const [loading, setLoading] = useState(false);

    const API_URL = "https://desbrava-app.onrender.com";

    useEffect(() => {
        buscarUnidades();
    }, []);

    const buscarUnidades = async () => {
        try {
            const response = await fetch(`${API_URL}/ranking-unidades`);
            const data = await response.json();
            setUnidades(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Erro ao buscar unidades:", error);
        }
    };

    const handleSalvar = async (e) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData();
        formData.append('nome', nome);
        formData.append('pontos_proprios', pontos);
        if (logo) formData.append('logo', logo);

        try {
            // USANDO FETCH EM VEZ DE AXIOS PARA EVITAR TELA BRANCA
            const response = await fetch(`${API_URL}/unidades`, {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                alert("Unidade cadastrada com sucesso!");
                setNome('');
                setPontos(0);
                setLogo(null);
                buscarUnidades();
            } else {
                alert("Erro ao cadastrar unidade no servidor.");
            }
        } catch (error) {
            alert("Erro de conexão.");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 text-white p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-8 text-yellow-500 border-b-2 border-yellow-500 pb-2 uppercase tracking-tighter">
                    🛡️ Gerenciar Unidades e Logos
                </h1>

                <form onSubmit={handleSalvar} className="bg-slate-800 p-6 rounded-xl shadow-2xl mb-12 border border-slate-700">
                    <h2 className="text-xl font-semibold mb-4 text-blue-400">Nova Unidade</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm mb-1 font-bold text-slate-400">Nome da Unidade (MAIÚSCULO)</label>
                            <input 
                                type="text" 
                                value={nome}
                                onChange={(e) => setNome(e.target.value)}
                                className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 text-white focus:outline-none focus:border-yellow-500 transition-all"
                                placeholder="Ex: ÁGATA"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm mb-1 font-bold text-slate-400">Pontos Próprios (Iniciais)</label>
                            <input 
                                type="number" 
                                value={pontos}
                                onChange={(e) => setPontos(e.target.value)}
                                className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 text-white focus:outline-none focus:border-yellow-500 transition-all"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm mb-1 font-bold text-slate-400">Logo da Unidade (Foto)</label>
                            <input 
                                type="file" 
                                onChange={(e) => setLogo(e.target.files[0])}
                                className="w-full text-slate-300 text-sm bg-slate-900 p-4 rounded-lg border-2 border-dashed border-slate-600"
                            />
                        </div>
                    </div>
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="mt-6 w-full md:w-auto bg-yellow-600 hover:bg-yellow-500 text-slate-900 font-black py-4 px-10 rounded-2xl transition-all shadow-lg uppercase tracking-widest active:scale-95"
                    >
                        {loading ? "Processando..." : "✅ Salvar Unidade"}
                    </button>
                </form>

                <h2 className="text-xl font-semibold mb-6 text-blue-400 border-l-4 border-blue-500 pl-3">Unidades no Sistema</h2>
                <div className="grid grid-cols-1 gap-4">
                    {unidades.length > 0 ? unidades.map((uni) => (
                        <div key={uni.nome} className="flex items-center justify-between bg-slate-800 p-5 rounded-2xl border border-slate-700 hover:border-yellow-500/50 transition-all">
                            <div className="flex items-center gap-5">
                                <img 
                                    src={uni.logo_url ? `${API_URL}${uni.logo_url}` : "https://placehold.co/60"} 
                                    alt="Logo" 
                                    className="w-16 h-16 rounded-full object-cover border-2 border-yellow-500 shadow-md"
                                    onError={(e) => e.target.src = "https://placehold.co/60"}
                                />
                                <div>
                                    <h3 className="font-black text-xl uppercase italic text-slate-100">{uni.nome}</h3>
                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{uni.total_membros} Desbravadores</p>
                                </div>
                            </div>
                            <div className="bg-slate-900 px-6 py-3 rounded-xl border border-slate-700">
                                <span className="text-yellow-500 font-black text-lg">{uni.total} <small className="text-[10px]">PTS</small></span>
                            </div>
                        </div>
                    )) : (
                        <p className="text-slate-500 italic text-center py-10">Nenhuma unidade cadastrada ainda.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default GerenciarUnidades;
