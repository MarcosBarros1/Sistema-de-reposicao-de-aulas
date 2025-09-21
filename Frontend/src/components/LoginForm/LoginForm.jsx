import React, { useState } from 'react';
import { FaUser, FaLock } from 'react-icons/fa'; // Ícones para os campos
import './LoginForm.css';
import logoIFCE from '../../assets/logo-ifce.png'; // Verifique se o caminho está correto

const LoginForm = () => {
  // Estados para armazenar o valor dos inputs
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  // Função que é chamada quando o formulário é enviado
  const handleSubmit = (event) => {
    // Previne o comportamento padrão do formulário de recarregar a página
    event.preventDefault();

    // Por enquanto, vamos apenas mostrar os dados no console
    // Este é o local onde chamaremos a API no futuro
    console.log('Dados para login:', { email, senha });

    // Lógica futura:
    // try {
    //   const data = await login(email, senha);
    //   localStorage.setItem('authToken', data.token);
    //   // Redirecionar para o dashboard
    // } catch (error) {
    //   alert(error.message);
    // }
  };

  return (
    <div className="login-form-container">
      <img src={logoIFCE} alt="Logo do IFCE" className="login-logo" />
      <h2>Acesso ao Sistema</h2>
      <p>Bem-vindo! Por favor, insira suas credenciais.</p>

      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <FaUser className="input-icon" />
          <input
            type="email"
            placeholder="Digite seu e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="input-group">
          <FaLock className="input-icon" />
          <input
            type="password"
            placeholder="Digite sua senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="login-button">
          Entrar
        </button>
      </form>
      
      <a href="#" className="forgot-password-link">
        Esqueceu sua senha?
      </a>
    </div>
  );
};

export default LoginForm;