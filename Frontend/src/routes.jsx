// src/routes.jsx (Atualizado)

import { createBrowserRouter } from "react-router-dom";

// Importando o layout principal e todas as páginas
import App from "./App.jsx";
import InicioPage from "./pages/InicioPage.jsx";
import CoordenadorDashboard from "./pages/CoordenadorDashboard/CoordenadorDashboard.jsx";
import GerenciarProfessores from "./pages/GerenciarProfessores/GerenciarProfessores.jsx";
import ProfessorDashboard from "./pages/ProfessorDashboard/ProfessorDashboard.jsx";
import GerenciarTurmas from './pages/GerenciarTurmas/GerenciarTurmas.jsx';
import AprovarReposicoes from './pages/AprovarReposicoes/AprovarReposicoes.jsx';
import MinhasReposicoesPage from "./pages/MinhasReposicoesPage/MinhasReposicoesPage.jsx";
import VisualizarAssinaturasPage from './pages/VisualizarAssinaturasPage/VisualizarAssinaturasPage.jsx';
import RegistrarReposicoes from './pages/RegistrarReposicoes/RegistrarReposicoes.jsx'
import Login from './pages/Login/Login.jsx'

// Criamos o roteador centralizado aqui
export const router = createBrowserRouter([
  // GRUPO 1: Rotas DENTRO do layout principal (com Navbar)
  {
    path: "/",
    element: <App />, // App.jsx é o nosso layout principal
    // As rotas aninhadas (children) serão renderizadas dentro do <Outlet /> do App.jsx
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
        path: '/professor/assinaturas',
        element: <VisualizarAssinaturasPage />,
      },
      { 
        path: '/professor/registrar-reposicao',
        element: <RegistrarReposicoes />,
      },
      {
        path: '/coordenador/turmas',
        element: <GerenciarTurmas />,
      },
      {
        path: '/coordenador/aprovar-reposicoes', // Corrigi o nome da rota para ser mais descritivo
        element: <AprovarReposicoes />,
      },
      {
        path: "/login/:tipo_usuario", // ex: /login/coordenador ou /login/professor
        element: <Login />,
      },
    ],
  },
]);