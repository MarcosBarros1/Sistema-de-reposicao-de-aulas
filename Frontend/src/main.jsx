// src/main.jsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';

// 1. Importa o roteador
import { router } from './routes.jsx'; 

// 2. Importa os estilos globais
import './index.css';
import './styles/global.css';

// 3. Inicia a aplicação
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);