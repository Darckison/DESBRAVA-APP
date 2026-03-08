import React, { useState, useEffect } from 'react';

export default function GerenciarUnidades() {
    const [unidades, setUnidades] = useState([]);
    const [nome, setNome] = useState('');
    const [pontos, setPontos] = useState(0);
    const [logo, setLogo] = useState(null);
    const [loading, setLoading] = useState(false);
    
    const API_URL = "https://desbrava-app.onrender.com";

    const carregarUnidades = () => {
        fetch(`${API_URL}/ranking-unidades`).then(res => res.json()).then(data => setUnidades(Array.isArray(data) ? data : []));
    };

    useEffect(() => carregarUnidades(), []);

    const handleSalvar = async (e) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData();
        formData.append('nome', nome.toUpperCase());
        formData.append('pontos_proprios', pontos);
        if (logo) formData.append('logo', logo);

        try {
            await fetch(`${API_URL}/unidades`, { method: 'POST', body: formData });
            alert("Unidade cadastrada com sucesso!");
            setNome(''); setPontos(0); setLogo(null);
            carregarUnidades();
        } catch (err) {
            alert("Erro ao salvar unidade");
        } finally {
            setLoading(false);
        }
    };

    const deletarUnidade = async (nomeUnidade) => {
        if (window.confirm(`Deseja excluir a unidade ${nomeUnidade}?`)) {
            await fetch(`${API_URL}/unidades/${nomeUnidade}`, { method: 'DELETE' });
            carregarUnidades();
        }
    };

    return (
        <div className="p-8 bg-gray-100 min-h-screen font-sans">
            <h1 className="text-3xl font-black text-green-800 mb-10 uppercase text-center italic">Gerenciamento de Unidades</h1>
            
            {/* FORMULÁRIO DE CADASTRO */}
            <form onSubmit={handleSalvar} className="max-w-xl mx-auto bg-white p-10 rounded-[40px] shadow-2xl border-t-8 border-green-800 mb-12">
                <div className="flex flex-col gap-5">
                    <label className="text-[10px] font-black uppercase text-gray-400 ml-2">Nome da Unidade</label>
                    <input type="text" placeholder="EX: ÔNIX" value={nome} onChange={e => setNome(e.target.value)} className="border-2 p-4 rounded-2xl font-bold bg-gray-50 outline-none focus:border-green-600" required />
                    
                    <label className="text-[10px] font-black uppercase text-gray-400 ml-2">Pontos da Unidade (Extras)</label>
                    <input type="number" placeholder="0" value={pontos} onChange={e => setPontos(e.target.value)} className="border-2 p-4 rounded-2xl font-bold bg-gray-50 outline-none focus:border-green-600" />
                    
                    <label className="text-[10px] font-black uppercase text-gray-400 ml-2">Logo da Unidade (Cloudinary)</label>
                    <input type="file" onChange={e => setLogo(e.target.files[0])} className="border-2 p-4 rounded-2xl bg-gray-50 font-bold" />
                    
                    <button disabled={loading} className="bg-green-700 hover:bg-green-800 text-white py-5 rounded-2xl font-black uppercase shadow-xl transition-all active:scale-95">
                        {loading ? "PROCESSANDO..." : "✅ Salvar Unidade / Logo"}
                    </button>
                </div>
            </form>

            {/* LISTA DE UNIDADES CADASTRADAS */}
            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
                {unidades.map(u => (
                    <div key={u.nome} className="bg-white p-5 rounded-3xl flex items-center justify-between shadow-lg border border-gray-100">
                        <div className="flex items-center gap-4">
                            <img 
                                src={u.logo_url} 
                                className="w-16 h-16 rounded-full object-cover border-4 border-green-100 shadow-md" 
                                alt="logo"
                                onError={(e) => { e.target.src = "https://placehold.co/100?text=LOGO"; }}
                            />
                            <div>
                                <span className="font-black uppercase text-lg text-green-900 leading-none block">{u.nome}</span>
                                <span className="text-xs font-bold text-gray-400 italic">{u.total} PONTOS TOTAIS</span>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => { setNome(u.nome); setPontos(u.pontos_unidade); }} className="bg-amber-400 p-3 rounded-2xl text-white shadow-md">✏️</button>
                            <button onClick={() => deletarUnidade(u.nome)} className="bg-red-600 p-3 rounded-2xl text-white shadow-md">🗑️</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
