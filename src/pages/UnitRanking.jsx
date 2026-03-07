import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UnitRanking = () => {
    const [ranking, setRanking] = useState([]);
    const [unidadeSelecionada, setUnidadeSelecionada] = useState(null);
    const [membros, setMembros] = useState([]);
    const [loading, setLoading] = useState(true);

    // Substitua pela URL do seu backend no Render ou localhost
    const API_URL = "https://desbrava-app.onrender.com"; 

    useEffect(() => {
        buscarRanking();
    }, []);

    const buscarRanking = async () => {
        try {
            const response = await axios.get(`${API_URL}/ranking-unidades`);
            setRanking(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Erro ao buscar ranking:", error);
            setLoading(false);
        }
    };

    const verDetalhesUnidade = async (nomeUnidade) => {
        try {
            const response = await axios.get(`${API_URL}/unidade/${nomeUnidade}/membros`);
            setMembros(response.data);
            setUnidadeSelecionada(nomeUnidade);
        } catch (error) {
            console.error("Erro ao buscar membros:", error);
        }
    };

    if (loading) return <div className="text-center p-10">Carregando Ranking...</div>;

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-bold text-center mb-8 text-blue-800">
                🏆 Classificação por Unidades
            </h1>

            {/* Grid de Cards das Unidades */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {ranking.map((unidade, index) => (
                    <div 
                        key={unidade.nome}
                        onClick={() => verDetalhesUnidade(unidade.nome)}
                        className="bg-white rounded-xl shadow-lg p-5 border-t-4 border-blue-500 cursor-pointer hover:scale-105 transition-transform"
                    >
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-2xl font-bold text-gray-700">#{index + 1}</span>
                            <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                                {unidade.total_membros} Membros
                            </span>
                        </div>
                        <h2 className="text-xl font-bold text-gray-800 uppercase text-center mb-4">
                            Unidade {unidade.nome}
                        </h2>
                        <div className="space-y-2 text-sm text-gray-600">
                            <div className="flex justify-between">
                                <span>Pontos da Unidade:</span>
                                <span className="font-semibold text-blue-600">+{unidade.pontos_unidade}</span>
                            </div>
                            <div className="flex justify-between border-b pb-2">
                                <span>Soma dos Membros:</span>
                                <span className="font-semibold text-green-600">+{unidade.pontos_membros}</span>
                            </div>
                            <div className="flex justify-between pt-2 text-lg font-bold text-gray-900">
                                <span>TOTAL:</span>
                                <span>{unidade.total} pts</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal ou Seção de Detalhes da Unidade */}
            {unidadeSelecionada && (
                <div className="mt-12 bg-white rounded-2xl shadow-2xl p-6 border border-gray-200">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-2xl font-bold text-gray-800">
                            Membros da Unidade: <span className="text-blue-600">{unidadeSelecionada}</span>
                        </h3>
                        <button 
                            onClick={() => setUnidadeSelecionada(null)}
                            className="text-red-500 font-bold hover:underline"
                        >
                            Fechar [x]
                        </button>
                    </div>
                    
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 text-gray-600 uppercase text-xs">
                                    <th className="p-3 border-b">Nome</th>
                                    <th className="p-3 border-b text-right">Pontos Individuais</th>
                                </tr>
                            </thead>
                            <tbody>
                                {membros.map((membro) => (
                                    <tr key={membro._id} className="hover:bg-gray-50">
                                        <td className="p-3 border-b font-medium text-gray-700">{membro.nome}</td>
                                        <td className="p-3 border-b text-right text-green-600 font-bold">{membro.pontos} pts</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UnitRanking;