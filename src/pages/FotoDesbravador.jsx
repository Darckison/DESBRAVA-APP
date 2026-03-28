import React, { useState } from 'react';

// URL de uma imagem placeholder padrão (você pode trocar por uma local se tiver)
const PLACEHOLDER_URL = 'https://via.placeholder.com/150?text=👤'; 

export default function FotoDesbravador({ src, className, alt = 'Desbravador' }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Define a imagem a ser exibida: placeholder se houver erro, caso contrário o src fornecido
  const imageSrc = error ? PLACEHOLDER_URL : src;

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Exibe o placeholder enquanto a imagem carrega, para evitar que o layout pisque */}
      {loading && (
        <img 
          src={PLACEHOLDER_URL}
          className={`absolute inset-0 w-full h-full object-cover ${className}`}
          alt="Carregando..."
        />
      )}
      <img
        src={imageSrc}
        alt={alt}
        className={`w-full h-full object-cover transition-opacity duration-300 ${loading ? 'opacity-0' : 'opacity-100'} ${className}`}
        onLoad={() => setLoading(false)} // Esconde o placeholder quando a imagem carrega
        onError={() => {
          setLoading(false);
          setError(true); // Ativa o placeholder se houver erro
        }}
      />
    </div>
  );
}
