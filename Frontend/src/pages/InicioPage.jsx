import React from 'react';
import SideBanner from '../components/SideBanner/SideBanner';
import LoginArea from '../components/LoginArea/LoginArea';
import './InicioPage.css'; // 1. Importe o novo arquivo CSS

function InicioPage() {
  // 2. Removemos o 'const styles' que estava aqui
  return (
    // 3. Trocamos 'style={styles}' por 'className="login-page-container"'
    <div className="login-page-container">
      <SideBanner />
      <LoginArea />
    </div>
  );
}

export default InicioPage;