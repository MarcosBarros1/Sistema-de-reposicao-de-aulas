import React from 'react';
// 1. REMOVA a importação do Header antigo, se houver
import Navbar from '../../components/Navbar/NavBar'; // 2. ADICIONE a importação da nova Navbar
import DashboardCard from '../../components/DashboardCard/DashboardCard';
import './ProfessorDashboard.css';
import { BsPersonVcard, BsPeople, BsClipboard2Check } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';

const ProfessorDashboard = () => {
  const navigate = useNavigate();

  // 3. Crie um objeto com os dados do usuário Professor (pode ser um placeholder por enquanto)
  const userData = {
    name: "NOME DO PROFESSOR AQUI",
    id: "Matrícula do Professor",
    avatar: "" // Deixe em branco para usar o avatar padrão
  };

  const cardsData = [
    {
      titulo: "Solicitar Reposições",
      Icon: BsPersonVcard,
      link: "/professor/minhas-reposicoes"
    },
    {
      titulo: "Visualizar Assinaturas",
      Icon: BsPeople,
      link: "/professor/assinaturas"
    },
    {
      titulo: "Minhas Reposições",
      Icon: BsClipboard2Check,
      link: "/professor/registrar-reposicao"
    }
  ];

  return (
    // 4. Use a div principal 'page-container'
    <div className="page-container">
      <Navbar
        userName={userData.name}
        userIdentifier={userData.id}
        userAvatarUrl={userData.avatar}
      />

      {/* 5. Crie o container para o conteúdo específico da página */}
      <div className="dashboard-content-area">
        <h1 className="dashboard-title">Painel do Professor</h1>
        <main className="cards-grid"> {/* Renomeei de cards-container para cards-grid para consistência */}
          {cardsData.map((card, index) => (
            <DashboardCard
              key={index}
              title={card.titulo}
              onButtonClick={() => navigate(card.link)}
            >
              <card.Icon />
            </DashboardCard>
          ))}
        </main>
      </div>
    </div>
  );
};

export default ProfessorDashboard;