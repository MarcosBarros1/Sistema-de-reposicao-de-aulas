// src/App.jsx

import { Outlet } from 'react-router-dom';

function App() {
  return (
    <>


      <main>
        {/* O <Outlet /> é o espaço onde o React Router irá renderizar a página da rota atual */}
        {/* Ex: se a URL for /inicio, a <InicioPage /> aparecerá aqui */}
        <Outlet />
      </main>
    </>
  );
}

export default App;