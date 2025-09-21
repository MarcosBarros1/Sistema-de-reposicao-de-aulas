// src/routes.jsx (Atualizado e Completo)

import { createBrowserRouter } from "react-router-dom";

// Importando o layout principal e todas as páginas
import App from "./App.jsx";
import LoginPage from "./pages/Login/Login.jsx";
import InicioPage from "./pages/InicioPage.jsx";
import CoordenadorDashboard from "./pages/CoordenadorDashboard/CoordenadorDashboard.jsx";
import GerenciarProfessores from "./pages/GerenciarProfessores/GerenciarProfessores.jsx";
import ProfessorDashboard from "./pages/ProfessorDashboard/ProfessorDashboard.jsx";
import GerenciarTurmas from './pages/GerenciarTurmas/GerenciarTurmas.jsx';
import AprovarReposicoes from './pages/AprovarReposicoes/AprovarReposicoes.jsx';
import CadastroPage from './pages/CadastroPage/CadastroPage.jsx';
import CadastroAlunoPage from './pages/CadastroAlunoPage/CadastroAlunoPage.jsx'; // Importação da nova página

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
        path: '/coordenador/turmas',
        element: <GerenciarTurmas />,
      },
      {
        path: '/coordenador/aprovar-reposicoes',
        element: <AprovarReposicoes />,
      },
    ],
  },
  
  // GRUPO 2: Rotas FORA do layout principal (tela cheia, sem Navbar)
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/login/:tipo_usuario",
    element: <LoginPage />,
  },
  {
    path: "/cadastro",
    element: <CadastroPage />
  },
  // 👇 A ÚNICA LINHA QUE FOI REALMENTE ADICIONADA 👇
  {
    path: "/cadastro/aluno",
    element: <CadastroAlunoPage />
  }
]);