// src/routes.jsx (Atualizado e Completo)

import { createBrowserRouter } from "react-router-dom";

// Importando o layout principal e todas as páginas
import App from "./App.jsx";
import InicioPage from "./pages/InicioPage.jsx";
import CoordenadorDashboard from "./pages/CoordenadorDashboard/CoordenadorDashboard.jsx";
import GerenciarProfessores from "./pages/GerenciarProfessores/GerenciarProfessores.jsx";
import ProfessorDashboard from "./pages/ProfessorDashboard/ProfessorDashboard.jsx";
import GerenciarTurmas from './pages/GerenciarTurmas/GerenciarTurmas.jsx';
import AprovarReposicoes from './pages/AprovarReposicoes/AprovarReposicoes.jsx';
import VisualizarAssinaturasPage from './pages/VisualizarAssinaturasPage/VisualizarAssinaturasPage.jsx';
import Login from './pages/Login/Login.jsx'
import CadastroPage from './pages/CadastroPage/CadastroPage.jsx';
import CadastroAlunoPage from './pages/CadastroAlunoPage/CadastroAlunoPage.jsx';
import SolicitarReposicaoPage from './pages/SolicitarReposicoes/SolicitarReposicoes.jsx'
import MinhasReposicoesPage from './pages/MinhasReposicoes/MinhasReposicoes.jsx'

// Criamos o roteador centralizado aqui
export const router = createBrowserRouter([
  // GRUPO 1: Rotas DENTRO do layout principal (com Navbar)
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <InicioPage />,
      },
      {
        path: "/inicio",
        element: <InicioPage />,
      },
      {
        path: "/coordenador/dashboard",
        element: <CoordenadorDashboard />,
      },
      {
        path: "/coordenador/professores",
        element: <GerenciarProfessores />,
      },
      {
        path: "/professor/dashboard",
        element: <ProfessorDashboard />,
      },
      {
        path: "/professor/minhas-reposicoes",
        element: <MinhasReposicoesPage />,
      },
      { 
        path: '/professor/reposicao/:id_solicitacao/assinaturas',
        element: <VisualizarAssinaturasPage />,
      },
      {
        path: "/professor/solicitar-reposicao",
        element: <SolicitarReposicaoPage />,
      },
      {
        path: '/coordenador/turmas',
        element: <GerenciarTurmas />,
      },
      {
        path: '/coordenador/aprovar-reposicoes',
        element: <AprovarReposicoes />,
      },
      {
        path: "/login/:tipo_usuario", // ex: /login/coordenador ou /login/professor
        element: <Login />,
      },
      {
        path: "/cadastro", // <-- Rota de cadastro para Professor/Coordenador
        element: <CadastroPage />
      },
      {
        path: "/cadastro/aluno",
        element: <CadastroAlunoPage />,
      }
    ],
  },
]);