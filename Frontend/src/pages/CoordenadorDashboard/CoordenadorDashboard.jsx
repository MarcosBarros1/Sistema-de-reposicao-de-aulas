import React from 'react';
import Header from '../../components/Header/Header';
import DashboardCard from '../../components/DashboardCard/DashboardCard';
import './CoordenadorDashboard.css';

// Importando os ícones que instalamos
import { FaUserTie, FaUsers, FaClipboardCheck } from 'react-icons/fa';

const CoordinatorDashboard = () => {
  // O nome do usuário viria do estado da aplicação ou de uma API
  const userName = "Márcio";

  return (
    <div className="dashboard-container">
      <div className="dashboard-content">
        <Header userName={userName} />

        <h1 className="dashboard-title">Painel do Coordenador</h1>

        <main className="cards-container">
          <DashboardCard title="Gerenciar Professores">
            <FaUserTie />
          </DashboardCard>

          <DashboardCard title="Gerenciar Turma">
            <FaUsers />
          </DashboardCard>

          <DashboardCard title="Aprovar Reposições">
            <FaClipboardCheck />
          </DashboardCard>
        </main>
      </div>
    </div>
  );
};

export default CoordinatorDashboard;