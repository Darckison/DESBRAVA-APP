import React, { useState, useEffect } from 'react';

export default function GerenciarUnidades() {
    const [unidades, setUnidades] = useState([]);
    const [nome, setNome] = useState('');
    const [pontos, setPontos] = useState(0);
    const [logo, setLogo] = useState(null);
    const [loading, setLoading] = useState(false);
    const API_URL = "https://desbrava-app.onrender.com";

    const carregarUnidades = () => {
        fetch(`${API_URL}/ranking-unidades`).then(res => res.json()).then(setUnidades);
    };

    useEffect(() => carregarUnidades(), []);

    const handleSalvar = async (e) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData();
        formData.append('nome', nome.toUpperCase());
        formData.append('pontos_proprios', pontos);
        if (logo) formData.append('logo', logo);

        await fetch(`${API_URL}/unidades`, { method: 'POST', body: formData });
        alert("Unidade Atualizada!");
        setNome(''); setPontos(0); setLogo(null);
        carregarUnidades();
        setLoading(false);
    };

    return (
        <div className="p-8 bg-gray-100 min-h-screen font-sans">
            <h1 className="text-3xl font-black text-green-800 mb-8 uppercase text-center">Configurações de Unidades</h1>
            
            <form onSubmit={handleSalvar} className="max-w-xl mx-auto bg-white p-8 rounded-[32px] shadow-xl border-2 border-green-800 mb-10">
                <div className="flex flex-col gap-4">
                    <input type="text" placeholder="NOME DA UNIDADE" value={nome} onChange={e => setNome(e.target.value)} className="border-2 p-4 rounded-2xl font-bold uppercase" required />
                    <input type="number" placeholder="PONTOS EXTRAS" value={pontos} onChange={e => setPontos(e.target.value)} className="border-2 p-4 rounded-2xl font-bold" />
                    <input type="file" onChange={e => setLogo(e.target.files[0])} className="border-2 p-4 rounded-2xl bg-gray-50 font-bold" />
                    <button className="bg-green-700 text-white py-5 rounded-2xl font-black uppercase shadow-lg hover:bg-green-800">{loading ? "SALVANDO..." : "Salvar Unidade"}</button>
                </div>
            </form>

            <div className="max-w-2xl mx-auto space-y-4">
                {unidades.map(u => (
                    <div key={u.nome} className="bg-white p-4 rounded-2xl flex items-center justify-between shadow-md border-2 border-gray-200">
                        <div className="flex items-center gap-4">
                            <img src={u.logo_url} className="w-12 h-12 rounded-full object-cover border border-green-700" alt="logo" />
                            <span className="font-black uppercase">{u.nome}</span>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => { setNome(u.nome); setPontos(u.pontos_unidade); }} className="bg-amber-400 p-2 rounded-xl text-white">✏️</button>
                            <button onClick={async () => { if(window.confirm('Excluir?')) { await fetch(`${API_URL}/unidades/${u.nome}`, {method: 'DELETE'}); carregarUnidades(); } }} className="bg-red-500 p-2 rounded-xl text-white">🗑️</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
