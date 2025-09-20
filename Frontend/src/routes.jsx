// src/routes.jsx

import { createBrowserRouter } from "react-router-dom";

// Importando o layout principal e todas as páginas
import App from "./App.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import InicioPage from "./pages/InicioPage.jsx";
import CoordenadorDashboard from "./pages/CoordenadorDashboard/CoordenadorDashboard.jsx";
import GerenciarProfessores from "./pages/GerenciarProfessores/GerenciarProfessores.jsx";
import ProfessorDashboard from "./pages/ProfessorDashboard/ProfessorDashboard.jsx";

// Criamos o roteador centralizado aqui
export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />, // App.jsx é o nosso layout principal (com header, navbar, etc.)

    // As rotas aninhadas (children) serão renderizadas dentro do <Outlet /> do App.jsx
    children: [
      {
        path: "/",
        element: <LoginPage />,
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
    ],
  },
]);