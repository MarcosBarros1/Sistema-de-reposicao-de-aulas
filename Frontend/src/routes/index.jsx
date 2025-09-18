// Arquivo: src/routes/index.jsx

import { BrowserRouter, Routes, Route } from "react-router-dom";

// 1. Importando todas as suas páginas
import LoginPage from "../pages/LoginPage";
import InicioPage from "../pages/InicioPage";
// A importação da nossa nova página. Note o caminho completo para o arquivo .jsx
import CoordenadorDashboard from "../pages/CoordenadorDashboard/CoordenadorDashboard"; 

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Suas rotas existentes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<InicioPage />} />

        {/* A NOVA ROTA: É ESSA LINHA QUE FAZ A MÁGICA
          Ela diz: "Quando a URL for '/coordenador/dashboard', renderize o componente CoordenadorDashboard"
        */}
        <Route 
          path="/coordenador/dashboard" 
          element={<CoordenadorDashboard />} 
        />

        {/* Opcional, mas recomendado: Uma rota para URLs que não existem */}
        <Route path="*" element={<div><h1>404 - Página Não Encontrada</h1></div>} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;