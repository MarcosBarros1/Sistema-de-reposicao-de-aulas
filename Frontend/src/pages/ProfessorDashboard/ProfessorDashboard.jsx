import React from 'react';
// 1. IMPORTE O USEAUTH
import { useAuth } from '../../context/AuthContext'; 
import Navbar from '../../components/Navbar/NavBar';
import DashboardCard from '../../components/DashboardCard/DashboardCard';
import './ProfessorDashboard.css';
import { FaClipboardCheck, FaUsers, FaListAlt } from 'react-icons/fa'; // Ícones atualizados
import { useNavigate } from 'react-router-dom';

const ProfessorDashboard = () => {
  const navigate = useNavigate();
  // 2. PEGUE OS DADOS DO USUÁRIO DO CONTEXTO
  const { usuario } = useAuth();

  // 3. ESTRUTURA DE DADOS DOS CARDS ATUALIZADA PARA MAIOR CLAREZA
  const cardsData = [
    {
      titulo: "Solicitar Reposição",
      Icon: FaClipboardCheck,
      link: "/professor/solicitar-reposicao" // Rota para o formulário de nova solicitação
    },
    {
      titulo: "Minhas Reposições",
      Icon: FaListAlt,
      link: "/professor/minhas-reposicoes" // Rota para ver o histórico de solicitações
    },
    {
      titulo: "Visualizar Assinaturas",
      Icon: FaUsers,
      link: "/professor/assinaturas" // Rota para ver o status de assinaturas
    }
  ];

  // 4. VERIFICA SE OS DADOS DO USUÁRIO JÁ FORAM CARREGADOS
  if (!usuario) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="page-container">
      {/* 5. USE OS DADOS REAIS DO USUÁRIO NA NAVBAR */}
      <Navbar
        userName={usuario.nome.toUpperCase()}
        userIdentifier={usuario.matriculaProfessor}
        userAvatarUrl={usuario.avatar || ""}
      />

      <div className="dashboard-content-area">
        <h1 className="dashboard-title">Painel do Professor</h1>
        <main className="cards-grid">
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