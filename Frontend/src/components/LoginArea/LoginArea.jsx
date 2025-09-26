import React from 'react';
// 1. Importe o useNavigate
import { useNavigate } from 'react-router-dom';
import './LoginArea.css';

import { Link } from 'react-router-dom';

function LoginArea() {
  // 2. Inicialize o hook
  const navigate = useNavigate();

  const handleCoordenadorClick = () => {
    // Navega para a página de login, passando 'coordenador' na URL
    navigate('/login/coordenador');
  };

  const handleProfessorClick = () => {
    // Navega para a página de login, passando 'professor' na URL
    navigate('/login/professor');
  };

  return (
    // ... o resto do seu JSX continua o mesmo
    <div className="login-form-wrapper">
      <div className="login-card">
        <h1>Faça login como:</h1>

        <button className="login-button" onClick={handleCoordenadorClick}>
          Coordenador
        </button>
        <button className="login-button" onClick={handleProfessorClick}>
          Professor
        </button>

        <Link to="/cadastro" className="signup-link">Cadastre-se</Link>
      </div>
      <p className="footer-text">
        O sistema foi desenvolvido por alunos do IFCE, para facilitar o gerenciamento de faltas.
      </p>
    </div>
  );
}

export default LoginArea;