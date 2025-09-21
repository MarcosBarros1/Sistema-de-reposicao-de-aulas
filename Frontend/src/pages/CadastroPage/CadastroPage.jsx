import React, { useState } from 'react';
import './CadastroPage.css';
import { useNavigate } from 'react-router-dom';

const CadastroPage = () => {
  const [role, setRole] = useState(''); // Estado para controlar o cargo selecionado
  const navigate = useNavigate();

  // Função para lidar com a submissão do formulário
  const handleSubmit = (event) => {
    event.preventDefault(); // Previne o recarregamento da página
    // Aqui você adicionaria a lógica para enviar os dados para a sua API
    console.log('Dados do formulário enviados!');
    alert('Cadastro realizado com sucesso! (simulação)');
    navigate('/'); // Navega para a página de login após o cadastro
  };

  return (
    <div className="cadastro-container">
      <div className="cadastro-card">
        <h1 className="cadastro-title">Cadastre-se</h1>
        <form onSubmit={handleSubmit}>
          {/* --- O SELETOR DE CARGO --- */}
          <div className="form-group">
            <label htmlFor="cargo">Selecione seu cargo</label>
            <select 
              id="cargo" 
              value={role} 
              onChange={(e) => setRole(e.target.value)} 
              required
            >
              <option value="" disabled>Selecione...</option>
              <option value="coordenador">Coordenador</option>
              <option value="professor">Professor</option>
            </select>
          </div>

          {/* --- CAMPOS DO FORMULÁRIO (RENDERIZADOS APÓS ESCOLHER UM CARGO) --- */}
          {role && (
            <>
              <div className="form-group">
                <label htmlFor="nome">Nome completo</label>
                <input type="text" id="nome" name="nome" required />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input type="email" id="email" name="email" required />
              </div>
              <div className="form-group">
                <label htmlFor="matricula">Matrícula</label>
                <input type="text" id="matricula" name="matricula" required />
              </div>
              <div className="form-group">
                <label htmlFor="disciplinas">Disciplinas ministradas</label>
                <select id="disciplinas" name="disciplinas" required>
                  {/* Você pode preencher essas opções dinamicamente no futuro */}
                  <option value="" disabled>Selecione...</option>
                  <option value="poo">Programação Orientada a Objetos</option>
                  <option value="redes">Redes de Computadores</option>
                  <option value="ihc">Interação Humano-Computador</option>
                </select>
              </div>

              {/* --- O CAMPO CONDICIONAL --- */}
              {role === 'coordenador' && (
                <div className="form-group">
                  <label htmlFor="departamento">Departamento</label>
                  <input type="text" id="departamento" name="departamento" required />
                </div>
              )}

              <div className="form-group">
                <label htmlFor="senha">Senha</label>
                <input type="password" id="senha" name="senha" required />
              </div>
              <div className="form-group">
                <label htmlFor="confirmarSenha">Confirmar Senha</label>
                <input type="password" id="confirmarSenha" name="confirmarSenha" required />
              </div>

              <button type="submit" className="submit-button">Entrar</button>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default CadastroPage;