// src/routes.jsx (Atualizado)

import { createBrowserRouter } from "react-router-dom";

// Importando o layout principal e todas as páginas
import App from "./App.jsx";
import LoginPage from "./pages/Login/Login.jsx"; // Note que mudei o nome da importação para corresponder ao novo nome do arquivo
import InicioPage from "./pages/InicioPage.jsx";
import CoordenadorDashboard from "./pages/CoordenadorDashboard/CoordenadorDashboard.jsx";
import GerenciarProfessores from "./pages/GerenciarProfessores/GerenciarProfessores.jsx";
import ProfessorDashboard from "./pages/ProfessorDashboard/ProfessorDashboard.jsx";
import GerenciarTurmas from './pages/GerenciarTurmas/GerenciarTurmas.jsx';
import AprovarReposicoes from './pages/AprovarReposicoes/AprovarReposicoes.jsx';
import CadastroPage from './pages/CadastroPage/CadastroPage.jsx'; // 1. IMPORTANDO A PÁGINA DE CADASTRO

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
        path: '/coordenador/turmas',
        element: <GerenciarTurmas />,
      },
      {
        path: '/coordenador/aprovar-reposicoes', // Corrigi o nome da rota para ser mais descritivo
        element: <AprovarReposicoes />,
      },
    ],
  },
  // GRUPO 2: Rotas FORA do layout principal (tela cheia, sem Navbar)
  {
    path: "/login", // Rota de login principal
    element: <LoginPage />,
  },
  {
    path: "/login/:tipo_usuario", // ex: /login/coordenador ou /login/professor
    element: <LoginPage />,
  },
  // 2. ADICIONANDO A NOVA ROTA DE CADASTRO FORA DO LAYOUT
  {
    path: "/cadastro",
    element: <CadastroPage />
  }
]);