import React from 'react';
// 1. Importe o useNavigate
import { useNavigate } from 'react-router-dom';
import './LoginForm.css';

function LoginForm() {
  // 2. Inicialize o hook
  const navigate = useNavigate();

  const handleCoordenadorClick = () => {
    console.log("Botão 'Coordenador' foi clicado!");
    // 3. Use a função navigate para mudar de página
    navigate('/inicio'); 
  };

  const handleProfessorClick = () => {
    console.log("Botão 'Professor' foi clicado!");
    navigate('/inicio');
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
        
        <a href="#" className="signup-link">Cadastre-se</a>
      </div>
      <p className="footer-text">
        O sistema foi desenvolvido por alunos do IFCE, para facilitar o gerenciamento de faltas.
      </p>
    </div>
  );
}

export default LoginForm;