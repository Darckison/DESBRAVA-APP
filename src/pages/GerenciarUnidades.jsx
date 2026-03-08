import React, { useState, useEffect } from 'react';
import axios from 'axios';

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
            setUnidades(data);
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
            await axios.post(`${API_URL}/unidades`, formData);
            alert("Unidade cadastrada com sucesso!");
            setNome('');
            setPontos(0);
            setLogo(null);
            buscarUnidades(); // Atualiza a lista
        } catch (error) {
            alert("Erro ao cadastrar unidade.");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 text-white p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-8 text-yellow-500 border-b-2 border-yellow-500 pb-2">
                    🛡️ Gerenciar Unidades
                </h1>

                {/* Formulário de Cadastro */}
                <form onSubmit={handleSalvar} className="bg-slate-800 p-6 rounded-xl shadow-2xl mb-12 border border-slate-700">
                    <h2 className="text-xl font-semibold mb-4 text-blue-400">Nova Unidade</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm mb-1">Nome da Unidade (Ex: ÁGATA)</label>
                            <input 
                                type="text" 
                                value={nome}
                                onChange={(e) => setNome(e.target.value)}
                                className="w-full bg-slate-700 border border-slate-600 rounded p-2 focus:outline-none focus:border-yellow-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm mb-1">Pontos Iniciais (da Unidade)</label>
                            <input 
                                type="number" 
                                value={pontos}
                                onChange={(e) => setPontos(e.target.value)}
                                className="w-full bg-slate-700 border border-slate-600 rounded p-2 focus:outline-none focus:border-yellow-500"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm mb-1">Logo da Unidade</label>
                            <input 
                                type="file" 
                                onChange={(e) => setLogo(e.target.files[0])}
                                className="w-full text-slate-400 text-sm"
                            />
                        </div>
                    </div>
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="mt-6 bg-yellow-600 hover:bg-yellow-500 text-white font-bold py-2 px-6 rounded transition-colors"
                    >
                        {loading ? "Salvando..." : "Cadastrar Unidade"}
                    </button>
                </form>

                {/* Lista de Unidades Cadastradas */}
                <h2 className="text-xl font-semibold mb-4 text-blue-400">Unidades Atuais</h2>
                <div className="grid grid-cols-1 gap-4">
                    {unidades.map((uni) => (
                        <div key={uni.nome} className="flex items-center justify-between bg-slate-800 p-4 rounded-lg border border-slate-700">
                            <div className="flex items-center gap-4">
                                <img 
                                    src={uni.logo_url ? `${API_URL}${uni.logo_url}` : "https://placehold.co/50"} 
                                    alt="Logo" 
                                    className="w-12 h-12 rounded-full object-cover border-2 border-yellow-500"
                                    onError={(e) => e.target.src = "https://placehold.co/50"}
                                />
                                <div>
                                    <h3 className="font-bold text-lg uppercase">{uni.nome}</h3>
                                    <p className="text-sm text-slate-400">{uni.total_membros} membros cadastrados</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="text-yellow-500 font-bold">{uni.total} pts</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default GerenciarUnidades;