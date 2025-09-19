import React from 'react';
import './Header.css';
// Supondo que você tenha o logo na pasta assets
import logo from '../../assets/logo-instituicao-web.png'; // CRIE OU COLOQUE O LOGO AQUI!

const Header = ({ userName }) => {
  return (
    <header className="app-header">
      <img src={logo} alt="Logo IFCE" className="header-logo" />
      <span className="welcome-message">
        Seja Bem-Vindo, <strong>{userName}</strong>
      </span>
      <button className="logout-button">Sair</button>
    </header>
  );
};

export default Header;