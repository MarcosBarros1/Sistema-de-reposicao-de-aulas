// Arquivo: src/pages/CoordenadorDashboard/CoordenadorDashboard.jsx (Atualizado)
import { Link } from 'react-router-dom';
import React from 'react';
// 1. REMOVA a importação do Header antigo
// import Header from '../../components/Header/Header'; 
import Navbar from '../../components/Navbar/NavBar'; // 2. ADICIONE a importação da nova Navbar
import DashboardCard from '../../components/DashboardCard/DashboardCard';
import './CoordenadorDashboard.css';
import { BsPersonVcard, BsPeople, BsClipboard2Check } from 'react-icons/bs';

const CoordinatorDashboard = () => {
  // 3. Crie um objeto com os dados do usuário para passar para a Navbar
  const userData = {
    name: "ERLANO BENEVIDES DE SOUSA",
    id: "20241283000219",
    avatar: "" // Deixe em branco para usar o avatar padrão
  };

  return (
    // 4. Esta é a div principal que organiza a página inteira
    <div className="page-container"> 
      <Navbar 
        userName={userData.name}
        userIdentifier={userData.id}
        userAvatarUrl={userData.avatar}
      />

      {/* 5. Criamos um container apenas para o conteúdo do painel */}
      <div className="dashboard-content-area">
        <h1 className="dashboard-title">Painel do Coordenador</h1>
        <main className="cards-container">
          <DashboardCard title="Gerenciar Professores">
            <BsPersonVcard />
          </DashboardCard>

          <DashboardCard title="Gerenciar Turma">
            <BsPeople />
          </DashboardCard>

          <DashboardCard title="Aprovar Reposições">
            <BsClipboard2Check />
          </DashboardCard>
        </main>
      </div>
    </div>
  );
};

export default CoordinatorDashboard;