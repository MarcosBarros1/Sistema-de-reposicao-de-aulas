import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

// Importando os componentes e páginas
import App from './App.jsx';
import LoginPage from './pages/LoginPage.jsx';
import InicioPage from './pages/InicioPage.jsx';
import CoordenadorDashboard from './pages/CoordenadorDashboard/CoordenadorDashboard.jsx'; 
import GerenciarProfessores from './pages/GerenciarProfessores/GerenciarProfessores.jsx'; // A importação já estava aqui, tudo certo.
import './index.css';

// Aqui criamos nossas rotas
const router = createBrowserRouter([
  {
    path: '/', // Rota raiz
    element: <App />, // O elemento principal (nosso layout)
    children: [ // Rotas "filhas" que serão renderizadas dentro do <Outlet>
      {
        path: '/', // Quando a URL for exatamente "/",
        element: <LoginPage />, // renderize a LoginPage.
      },
      {
        path: '/inicio', // Quando a URL for "/inicio",
        element: <InicioPage />, // renderize a InicioPage.
      },
      {
        path: '/coordenador/dashboard',
        element: <CoordenadorDashboard />,
      },
      // 👇 ADICIONE ESTE NOVO OBJETO DE ROTA AQUI
      {
        path: '/coordenador/professores', // Novo caminho para a página
        element: <GerenciarProfessores />, // Componente a ser renderizado
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);