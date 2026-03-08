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
        if (!logo) return alert("Por favor, selecione uma logo!");
        
        setLoading(true);
        const formData = new FormData();
        formData.append('nome', nome.toUpperCase());
        formData.append('pontos_proprios', pontos);
        formData.append('logo', logo); // Aqui enviamos o arquivo

        try {
            const response = await fetch(`${API_URL}/unidades`, {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                alert("Unidade e Logo salvas com sucesso!");
                setNome(''); setPontos(0); setLogo(null);
                buscarUnidades();
            } else {
                const erro = await response.json();
                alert("Erro: " + (erro.detail || "Falha ao salvar"));
            }
        } catch (error) {
            alert("Erro de conexão com o servidor.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-green-950 text-white p-6 font-sans">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-black mb-8 text-green-400 border-b-4 border-green-600 pb-2 uppercase italic">
                    🌳 Gerenciar Unidades
                </h1>

                {/* Formulário Verde */}
                <form onSubmit={handleSalvar} className="bg-green-900 p-6 rounded-[32px] shadow-2xl mb-10 border-2 border-green-800">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-black text-green-300 uppercase ml-2">Nome da Unidade</label>
                            <input 
                                type="text" value={nome} onChange={(e) => setNome(e.target.value)}
                                className="bg-green-800 border-2 border-green-700 rounded-2xl p-4 outline-none focus:border-yellow-500 text-white font-bold"
                                placeholder="EX: ÔNIX" required
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-black text-green-300 uppercase ml-2">Pontos Iniciais</label>
                            <input 
                                type="number" value={pontos} onChange={(e) => setPontos(e.target.value)}
                                className="bg-green-800 border-2 border-green-700 rounded-2xl p-4 outline-none focus:border-yellow-500 text-white font-bold"
                            />
                        </div>
                        <div className="md:col-span-2 flex flex-col gap-2">
                            <label className="text-xs font-black text-green-300 uppercase ml-2">Logo (Imagem)</label>
                            <input 
                                type="file" onChange={(e) => setLogo(e.target.files[0])}
                                className="bg-green-950 p-4 rounded-2xl border-2 border-dashed border-green-700 text-sm font-bold file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-700 file:text-white"
                                accept="image/*"
                            />
                        </div>
                    </div>
                    <button 
                        type="submit" disabled={loading}
                        className="mt-8 w-full bg-yellow-500 hover:bg-yellow-400 text-green-950 font-black py-5 rounded-2xl shadow-xl uppercase tracking-widest transition-transform active:scale-95"
                    >
                        {loading ? "SALVANDO..." : "Confirmar Cadastro"}
                    </button>
                </form>

                {/* Lista de Unidades */}
                <div className="space-y-4">
                    {unidades.map((uni) => (
                        <div key={uni.nome} className="flex items-center justify-between bg-white/10 p-4 rounded-3xl border border-white/5 backdrop-blur-md">
                            <div className="flex items-center gap-4">
                                <img 
                                    src={uni.logo_url} 
                                    className="w-16 h-16 rounded-full object-cover border-4 border-green-500 shadow-lg"
                                    alt="Logo"
                                    onError={(e) => e.target.src = "https://placehold.co/100x100?text=LOGO"}
                                />
                                <div>
                                    <h3 className="font-black text-xl uppercase italic text-white">{uni.nome}</h3>
                                    <p className="text-[10px] font-bold text-green-400 uppercase tracking-widest">{uni.total_membros} Membros</p>
                                </div>
                            </div>
                            <div className="text-right bg-green-800 px-6 py-2 rounded-2xl border-2 border-green-600">
                                <span className="text-yellow-400 font-black text-xl">{uni.total} pts</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default GerenciarUnidades;

