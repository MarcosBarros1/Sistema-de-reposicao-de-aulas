// Arquivo: src/pages/CoordenadorDashboard/CoordenadorDashboard.jsx (Atualizado)
import { Link } from 'react-router-dom';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar/Navbar';
import DashboardCard from '../../components/DashboardCard/DashboardCard';
import './CoordenadorDashboard.css';
import { BsPersonVcard, BsPeople, BsClipboard2Check } from 'react-icons/bs';

const CoordinatorDashboard = () => {
  const navigate = useNavigate();
  const { usuario } = useAuth();

  // VERIFICA SE O USUÁRIO EXISTE ANTES DE TENTAR RENDERIZAR
  if (!usuario) {
    // Pode mostrar um loader ou simplesmente não renderizar nada até ter os dados
    return <div>Carregando...</div>;
  }

  return (
    // 4. Esta é a div principal que organiza a página inteira
    <div className="page-container">
      <Navbar
        userName={usuario.nome.toUpperCase()}
        userIdentifier={usuario.matriculaCoordenador}
        userAvatarUrl="" // O avatar ainda pode ser um placeholder
      />

      {/* 5. Criamos um container apenas para o conteúdo do painel */}
      <div className="dashboard-content-area">
        <h1 className="dashboard-title">Painel do Coordenador</h1>
        <main className="cards-container">
          <DashboardCard
            title="Gerenciar Professores"
            onButtonClick={() => navigate('/coordenador/professores')}
          >
            <BsPersonVcard />
          </DashboardCard>

          <DashboardCard
            title="Gerenciar Turma"
            onButtonClick={() => navigate('/coordenador/turmas')}
          >
            <BsPeople />
          </DashboardCard>

          <DashboardCard
            title="Aprovar Reposições"
            onButtonClick={() => navigate('/coordenador/aprovar-reposicoes')}
          >
            <BsClipboard2Check />
          </DashboardCard>
        </main>
      </div>
    </div>
  );
};

export default CoordinatorDashboard;