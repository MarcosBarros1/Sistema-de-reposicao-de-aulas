import React from 'react';
import { Outlet } from 'react-router-dom';

function App() {
  // O Outlet é um componente especial do React Router
  // que renderiza a rota filha correspondente.
  return (
    <div>
      {/* Você poderia ter um Header ou Navbar aqui */}
      <main>
        <Outlet /> 
      </main>
      {/* Você poderia ter um Footer aqui */}
    </div>
  );
}

export default App;