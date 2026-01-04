import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import NovoMembro from './pages/NovoMembro';
import UserRanking from './pages/UserRanking'; // Adicione esta linha depois de criar o arquivo

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<AdminLogin />} />
        <Route path="/dashboard" element={<AdminDashboard />} />
        <Route path="/novo-membro" element={<NovoMembro />} />
        <Route path="/ranking" element={<UserRanking />} /> {/* Rota para os usuários verem o placar */}
      </Routes>
    </Router>
  );
}

export default App;