import React from 'react';
import SideBanner from '../components/SideBanner/SideBanner';
import LoginForm from '../components/LoginForm/LoginForm';

// Um pouco de CSS diretamente aqui para o layout principal
const styles = {
  display: 'flex',
  width: '100vw', 
  height: '100vh', 
  fontFamily: 'sans-serif' 
};

// Renomeamos a função de App para LoginPage
function LoginPage() {
  return (
    <div style={styles}>
      <SideBanner />
      <LoginForm />
    </div>
  );
}

export default LoginPage;