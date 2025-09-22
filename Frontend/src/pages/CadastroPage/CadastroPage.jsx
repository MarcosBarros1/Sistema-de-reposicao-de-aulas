import React, { useState } from 'react';
import './CadastroPage.css';
import { useNavigate } from 'react-router-dom';
import MultiSelectModal from '../../components/MultiSelectModal/MultiSelectModal';
import { cadastrarProfessor, cadastrarCoordenador } from '../../services/api'; 

const allDisciplinas = [
  { id: 1, label: 'Programação Orientada a Objetos' },
  { id: 2, label: 'Redes de Computadores' },
  { id: 3, label: 'Interação Humano-Computador' },
  { id: 4, label: 'Banco de Dados' },
  { id: 5, label: 'Engenharia de Software' },
];

const CadastroPage = () => {
  const [role, setRole] = useState('');
  const [disciplinas, setDisciplinas] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    matricula: '',
    departamento: '',
    senha: '',
    confirmarSenha: '',
  });
  const [error, setError] = useState('');

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

    if (formData.senha !== formData.confirmarSenha) {
      setError('As senhas não coincidem!');
      return;
    }

    try {
      if (role === 'professor') {
        const dadosParaEnviar = {
          nome: formData.nome,
          email: formData.email,
          matricula: formData.matricula,
          senha: formData.senha,
          disciplinas: disciplinas,
        };
        await cadastrarProfessor(dadosParaEnviar);
        alert('Professor cadastrado com sucesso!');

      } else if (role === 'coordenador') {
        const dadosParaEnviar = {
          nome: formData.nome,
          email: formData.email,
          matricula: formData.matricula,
          senha: formData.senha,
          departamento: formData.departamento,
        };
        await cadastrarCoordenador(dadosParaEnviar);
        alert('Coordenador cadastrado com sucesso!');
      }

      navigate('/');

    } catch (err) {
      console.error('Erro no cadastro:', err);
      const errorMessage = err.message || `Ocorreu um erro ao cadastrar o ${role}.`;
      setError(errorMessage);
      alert(`Erro: ${errorMessage}`);
    }
  };

  const disciplinasDisplay = disciplinas.length > 0
    ? allDisciplinas
        .filter(d => disciplinas.includes(d.id))
        .map(d => d.label)
        .join(', ')
    : 'Clique para selecionar...';

  return (
    <>
      <div className="cadastro-container">
        <div className="cadastro-card">
          <h1 className="cadastro-title">Cadastre-se</h1>
          {error && <p className="error-message">{error}</p>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="cargo">Selecione seu cargo</label>
              <select id="cargo" value={role} onChange={(e) => setRole(e.target.value)} required>
                <option value="" disabled>Selecione...</option>
                <option value="coordenador">Coordenador</option>
                <option value="professor">Professor</option>
              </select>
            </div>

            {role && (
              <>
                <div className="form-group">
                  <label htmlFor="nome">Nome completo</label>
                  <input type="text" id="nome" name="nome" required 
                    value={formData.nome} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input type="email" id="email" name="email" required 
                    value={formData.email} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label htmlFor="matricula">Matrícula</label>
                  <input type="text" id="matricula" name="matricula" required 
                    value={formData.matricula} onChange={handleInputChange} />
                </div>
                
                {role === 'professor' && (
                  <div className="form-group">
                    <label>Disciplinas ministradas</label>
                    <div className="fake-select" onClick={() => setIsModalOpen(true)}>
                      {disciplinasDisplay}
                    </div>
                  </div>
                )}
                
                {role === 'coordenador' && (
                  <div className="form-group">
                    <label htmlFor="departamento">Departamento</label>
                    <input type="text" id="departamento" name="departamento" required 
                      value={formData.departamento} onChange={handleInputChange} />
                  </div>
                )}

                <div className="form-group">
                  <label htmlFor="senha">Senha</label>
                  <input type="password" id="senha" name="senha" required 
                    value={formData.senha} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label htmlFor="confirmarSenha">Confirmar Senha</label>
                  <input type="password" id="confirmarSenha" name="confirmarSenha" required 
                    value={formData.confirmarSenha} onChange={handleInputChange} />
                </div>

                <button type="submit" className="submit-button">Entrar</button>
              </>
            )}
          </form>
        </div>
      </div>
      
      <MultiSelectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={setDisciplinas}
        options={allDisciplinas.map(d => ({ value: d.id, label: d.label }))}
        selectedValues={disciplinas}
        title="Selecione as Disciplinas"
      />
    </>
  );
};

export default CadastroPage;