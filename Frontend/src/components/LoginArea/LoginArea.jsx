import React from 'react';
// 1. Importe o useNavigate
import { useNavigate } from 'react-router-dom';
import './LoginArea.css';

import { Link } from 'react-router-dom';

function LoginArea() {
  const navigate = useNavigate();

  const handle_login_click = () => {
    navigate('/login'); // Navega para a página de login unificada
  };

  return (
    <div className="login-form-wrapper">
      <div className="login-card">
        <h1>Acesso ao Sistema</h1>

        <button className="login-button" onClick={handle_login_click}>
          Fazer Login
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