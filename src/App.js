import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import NovoMembro from './pages/NovoMembro';
import UserRanking from './pages/UserRanking'; 
import UnitRanking from './pages/UnitRanking'; 
import GerenciarUnidades from './pages/GerenciarUnidades';
import Chamada from './pages/Chamada'; 

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<AdminLogin />} />
        <Route path="/dashboard" element={<AdminDashboard />} />
        <Route path="/novo-membro" element={<NovoMembro />} />
        <Route path="/ranking" element={<UserRanking />} /> 
        <Route path="/ranking-unidades" element={<UnitRanking />} /> 
        <Route path="/admin-unidades" element={<GerenciarUnidades />} />
        <Route path="/chamada" element={<Chamada />} />
      </Routes>
    </Router>
  );
}

export default App;
