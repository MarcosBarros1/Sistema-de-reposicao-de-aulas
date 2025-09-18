import React from 'react';
import SideBanner from '../components/SideBanner/SideBanner';
import LoginForm from '../components/LoginForm/LoginForm';
import './LoginPage.css'; // 1. Importe o novo arquivo CSS

function LoginPage() {
  // 2. Removemos o 'const styles' que estava aqui
  return (
    // 3. Trocamos 'style={styles}' por 'className="login-page-container"'
    <div className="login-page-container">
      <SideBanner />
      <LoginForm />
    </div>
  );
}

export default LoginPage;