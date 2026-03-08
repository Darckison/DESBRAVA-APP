import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [membros, setMembros] = useState([]);
  const [view, setView] = useState('tabela'); 

  useEffect(() => {
    fetch('https://desbrava-app.onrender.com/membros')
      .then(res => res.json())
      .then(data => setMembros(Array.isArray(data) ? data : []));
  }, []);

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto bg-gray-50 min-h-screen font-sans">
      <div className="bg-white p-6 rounded-3xl shadow-lg mb-8 text-center border-t-8 border-green-700">
        <h1 className="text-3xl font-black text-green-800 italic uppercase mb-6 tracking-tighter">DASHBOARD ÁGATA</h1>
        <div className="flex justify-center gap-4">
          <button onClick={() => navigate('/admin-unidades')} className="bg-yellow-500 text-green-950 px-6 py-2 rounded-2xl font-black shadow-md uppercase text-sm">🛡️ UNIDADES</button>
          <button onClick={() => navigate('/')} className="bg-red-600 text-white px-6 py-2 rounded-2xl font-black shadow-md uppercase text-sm">SAIR</button>
        </div>
      </div>

      {view === 'tabela' && (
        <button onClick={() => setView('cadastro')} className="mb-8 bg-green-700 text-white px-8 py-4 rounded-3xl font-black shadow-xl uppercase tracking-widest active:scale-95 transition-all">
          + NOVO DESBRAVADOR
        </button>
      )}

      {/* Tabela de Membros (Visual image_a9a3ab) */}
      <div className="bg-white rounded-[40px] shadow-xl overflow-hidden border border-gray-100">
        <table className="w-full text-left">
          <thead className="bg-green-800 text-white uppercase text-xs font-black">
            <tr>
              <th className="p-6">MEMBRO</th>
              <th className="p-6 text-center">UNIDADE</th>
              <th className="p-6 text-center">PONTOS</th>
              <th className="p-6 text-center">AÇÕES</th>
            </tr>
          </thead>
          <tbody>
            {membros.map(m => (
              <tr key={m._id} className="border-b last:border-0 hover:bg-green-50">
                <td className="p-6 flex items-center gap-4">
                  <img src={m.foto_url} className="w-14 h-14 rounded-full object-cover border-2 border-green-200" />
                  <span className="font-black text-gray-800 uppercase">{m.nome}</span>
                </td>
                <td className="p-6 text-center font-bold text-gray-500 uppercase">{m.unidade}</td>
                <td className="p-6 text-center"><span className="bg-green-100 text-green-800 px-4 py-2 rounded-xl font-black text-xl">{m.pontos}</span></td>
                <td className="p-6 text-center">
                   {/* Botões de Ação originais */}
                   <div className="flex justify-center gap-2">
                     <button className="bg-blue-600 text-white px-4 py-2 rounded-xl font-black text-[10px] uppercase">⭐ PONTUAR</button>
                     <button className="bg-amber-400 text-white p-2 rounded-xl">✏️</button>
                     <button className="bg-red-500 text-white p-2 rounded-xl">🗑️</button>
                   </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
