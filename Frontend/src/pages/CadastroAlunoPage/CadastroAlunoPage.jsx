import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CadastroAlunoPage.css'; // Vamos reutilizar os estilos da outra página

// Dados de exemplo para o seletor de turmas
const mockTurmas = [
  { id: 'engsoft241', nome: 'Engenharia de Software - 2024.1' },
  { id: 'redes241', nome: 'Redes de Computadores - 2024.1' },
  { id: 'info232', nome: 'Técnico em Informática - 2023.2' },
];

const CadastroAlunoPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nome: '',
    matricula: '',
    email: '',
    turma: '',
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('Dados do Aluno:', formData);
    alert('Aluno cadastrado com sucesso! (simulação)');
    navigate('/'); // Redireciona para uma página principal ou de login
  };

  return (
    <div className="cadastro-container">
      <div className="cadastro-card">
        <h1 className="cadastro-title">Cadastro de Aluno</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="nome">Nome completo</label>
            <input 
              type="text" 
              id="nome" 
              name="nome" 
              value={formData.nome}
              onChange={handleInputChange}
              required 
            />
          </div>

          <div className="form-group">
            <label htmlFor="matricula">Matrícula</label>
            <input 
              type="text" 
              id="matricula" 
              name="matricula" 
              value={formData.matricula}
              onChange={handleInputChange}
              required 
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              value={formData.email}
              onChange={handleInputChange}
              required 
            />
          </div>

          <div className="form-group">
            <label htmlFor="turma">Turma</label>
            <select 
              id="turma" 
              name="turma" 
              value={formData.turma}
              onChange={handleInputChange}
              required
            >
              <option value="" disabled>Selecione uma turma...</option>
              {mockTurmas.map((turma) => (
                <option key={turma.id} value={turma.id}>
                  {turma.nome}
                </option>
              ))}
            </select>
          </div>
          
          <button type="submit" className="submit-button">Cadastrar</button>
        </form>
      </div>
    </div>
  );
};

export default CadastroAlunoPage;