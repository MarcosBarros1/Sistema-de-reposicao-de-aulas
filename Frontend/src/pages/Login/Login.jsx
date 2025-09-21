import React from 'react';
import LoginForm from '../../components/LoginForm/LoginForm';
import SideBanner from '../../components/SideBanner/SideBanner';
import './Login.css'; // Criaremos este arquivo para o layout

const Login = () => {
  return (
    <div className="login-page-container">
      <div className="side-banner-container">
        <SideBanner />
      </div>
      <div className="login-form-area">
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;