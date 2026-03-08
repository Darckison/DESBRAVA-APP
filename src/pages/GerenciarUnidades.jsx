import React, { useState, useEffect } from 'react';

const GerenciarUnidades = () => {
    const [unidades, setUnidades] = useState([]);
    const [nome, setNome] = useState('');
    const [pontos, setPontos] = useState(0);
    const [logo, setLogo] = useState(null);
    const [loading, setLoading] = useState(false);

    const API_URL = "https://desbrava-app.onrender.com";

    useEffect(() => { buscarUnidades(); }, []);

    const buscarUnidades = async () => {
        try {
            const response = await fetch(`${API_URL}/ranking-unidades`);
            const data = await response.json();
            setUnidades(Array.isArray(data) ? data : []);
        } catch (error) { console.error(error); }
    };

    const handleSalvar = async (e) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData();
        formData.append('nome', nome);
        formData.append('pontos_proprios', pontos);
        if (logo) formData.append('logo', logo);

        try {
            const response = await fetch(`${API_URL}/unidades`, {
                method: 'POST',
                body: formData,
            });
            if (response.ok) {
                alert("Salvo com sucesso!");
                setNome(''); setPontos(0); setLogo(null);
                buscarUnidades();
            }
        } catch (error) { alert("Erro ao salvar"); }
        finally { setLoading(false); }
    };

    return (
        <div className="min-h-screen bg-green-950 text-white p-6">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-black mb-8 text-green-400 uppercase italic">🌳 Gerenciar Unidades</h1>

                <form onSubmit={handleSalvar} className="bg-green-900 p-6 rounded-[32px] border-2 border-green-800 mb-10 shadow-2xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <input type="text" placeholder="NOME DA UNIDADE" value={nome} onChange={e => setNome(e.target.value)} className="bg-green-800 p-4 rounded-2xl outline-none border-2 border-green-700 focus:border-yellow-500 font-bold" required />
                        <input type="number" placeholder="PONTOS INICIAIS" value={pontos} onChange={e => setPontos(e.target.value)} className="bg-green-800 p-4 rounded-2xl outline-none border-2 border-green-700 focus:border-yellow-500 font-bold" />
                        <input type="file" onChange={e => setLogo(e.target.files[0])} className="md:col-span-2 bg-green-950 p-4 rounded-2xl border-2 border-dashed border-green-700 text-sm" accept="image/*" />
                    </div>
                    <button type="submit" disabled={loading} className="mt-6 w-full bg-yellow-500 text-green-950 font-black py-4 rounded-2xl uppercase tracking-widest shadow-lg active:scale-95 transition-all">
                        {loading ? "PROCESSANDO..." : "Confirmar Cadastro"}
                    </button>
                </form>

                <div className="space-y-4">
                    {unidades.map((uni) => (
                        <div key={uni.nome} className="flex items-center justify-between bg-white/10 p-4 rounded-3xl border border-white/5">
                            <div className="flex items-center gap-4">
                                <img 
                                    src={uni.logo_url} // LINK DIRETO DO CLOUDINARY
                                    className="w-16 h-16 rounded-full object-cover border-4 border-green-500 shadow-md"
                                    onError={(e) => e.target.src = "https://placehold.co/100?text=LOGO"}
                                />
                                <h3 className="font-black text-xl uppercase italic">{uni.nome}</h3>
                            </div>
                            <span className="bg-green-800 px-6 py-2 rounded-2xl text-yellow-400 font-black">{uni.total} pts</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default GerenciarUnidades;
