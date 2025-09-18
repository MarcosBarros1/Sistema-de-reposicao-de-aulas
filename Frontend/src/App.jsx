import React from 'react';
import { Outlet } from 'react-router-dom'; // 1. Importe o Outlet

function App() {
  return (
    <div>
      {/* Aqui você pode colocar elementos que se repetem em todas as páginas, 
        como um menu de navegação ou um rodapé. 
        Por enquanto, vamos deixar apenas o Outlet.
      */}

      <main>
        <Outlet /> {/* 2. Adicione o Outlet aqui */}
      </main>
    </div>
  );
}

export default App;