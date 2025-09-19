import React from 'react';
// 1. REMOVA a importação do Header antigo, se houver
// import Header from '../../components/Header/Header'; 
import Navbar from '../../components/NavBar/NavBar'; // 2. ADICIONE a importação da nova Navbar
import DashboardCard from '../../components/DashboardCard/DashboardCard';
import './ProfessorDashboard.css';
import { FaAddressBook, FaUsers, FaClipboardCheck } from 'react-icons/fa';
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
      titulo: "Minhas Reposições",
      Icon: FaAddressBook,
      link: "/professor/minhas-reposicoes"
    },
    {
      titulo: "Visualizar Assinaturas",
      Icon: FaUsers,
      link: "/professor/assinaturas"
    },
    {
      titulo: "Registrar Reposições",
      Icon: FaClipboardCheck,
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