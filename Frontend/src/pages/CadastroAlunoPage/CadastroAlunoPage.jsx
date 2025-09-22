import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './CadastroAlunoPage.css';
import { buscar_turmas, cadastrar_aluno } from '../../services/api';

const CadastroAlunoPage = () => {
  const navigate = useNavigate();
  const [turmasDisponiveis, setTurmasDisponiveis] = useState([]);
  
  const [formData, setFormData] = useState({
    nome: '',
    matricula_aluno: '', // Nome corrigido
    email: '',
    id_turma: '',      // Nome corrigido
  });
  const [error, setError] = useState('');

  useEffect(() => {
    const carregarTurmas = async () => {
      try {
        const turmas = await buscar_turmas();
        setTurmasDisponiveis(turmas);
      } catch (err) {
        console.error("Erro ao carregar turmas:", err);
        setError("Não foi possível carregar a lista de turmas.");
      }
    };
    carregarTurmas();
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    try {
      await cadastrar_aluno(formData);
      alert('Aluno cadastrado com sucesso! (simulação)');
      navigate('/');
    } catch (err) {
      console.error("Erro ao cadastrar aluno:", err);
      const errorMessage = err.message || "Ocorreu um erro no cadastro.";
      setError(errorMessage);
      alert(`Erro: ${errorMessage}`);
    }
  };

  return (
    <div className="cadastro-container">
      <div className="cadastro-card">
        <h1 className="cadastro-title">Cadastro de Aluno</h1>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="nome">Nome completo</label>
            <input 
              type="text" id="nome" name="nome" required 
              value={formData.nome} onChange={handleInputChange} 
            />
          </div>

          <div className="form-group">
            <label htmlFor="matricula_aluno">Matrícula</label>
            <input 
              type="text" id="matricula_aluno" name="matricula_aluno" required
              value={formData.matricula_aluno} onChange={handleInputChange}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input 
              type="email" id="email" name="email" required
              value={formData.email} onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="id_turma">Turma</label>
            <select 
              id="id_turma" name="id_turma" required
              value={formData.id_turma} onChange={handleInputChange}
            >
              <option value="" disabled>Selecione uma turma...</option>
              {turmasDisponiveis.map((turma) => (
                <option key={turma.id_turma} value={turma.id_turma}>
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