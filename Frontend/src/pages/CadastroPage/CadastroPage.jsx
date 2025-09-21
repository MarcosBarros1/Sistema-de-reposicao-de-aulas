import React, { useState } from 'react';
import './CadastroPage.css';
import { useNavigate } from 'react-router-dom';
import MultiSelectModal from '../../components/MultiSelectModal/MultiSelectModal';

// Lista de todas as disciplinas disponíveis
const allDisciplinas = [
  { value: 'poo', label: 'Programação Orientada a Objetos' },
  { value: 'redes', label: 'Redes de Computadores' },
  { value: 'ihc', label: 'Interação Humano-Computador' },
  { value: 'bd', label: 'Banco de Dados' },
  { value: 'es', label: 'Engenharia de Software' },
];

const CadastroPage = () => {
  const [role, setRole] = useState('');
  const [disciplinas, setDisciplinas] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('Dados do formulário enviados!', { role, disciplinas });
    alert('Cadastro realizado com sucesso! (simulação)');
    navigate('/');
  };

  // Monta o texto a ser exibido no campo "fake"
  const disciplinasDisplay = disciplinas.length > 0
    ? allDisciplinas
        .filter(d => disciplinas.includes(d.value))
        .map(d => d.label)
        .join(', ')
    : 'Clique para selecionar...';

  return (
    <>
      <div className="cadastro-container">
        <div className="cadastro-card">
          <h1 className="cadastro-title">Cadastre-se</h1>
          <form onSubmit={handleSubmit}>
            {/* Seletor de cargo */}
            <div className="form-group">
              <label htmlFor="cargo">Selecione seu cargo</label>
              <select id="cargo" value={role} onChange={(e) => setRole(e.target.value)} required>
                <option value="" disabled>Selecione...</option>
                <option value="coordenador">Coordenador</option>
                <option value="professor">Professor</option>
              </select>
            </div>

            {/* Renderiza o resto do formulário apenas quando um cargo é selecionado */}
            {role && (
              <>
                {/* --- CAMPOS RESTAURADOS --- */}
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
                
                {/* --- CAMPO CONDICIONAL PARA PROFESSOR (com modal) --- */}
                {role === 'professor' && (
                  <div className="form-group">
                    <label>Disciplinas ministradas</label>
                    <div className="fake-select" onClick={() => setIsModalOpen(true)}>
                      {disciplinasDisplay}
                    </div>
                  </div>
                )}
                
                {/* --- CAMPO CONDICIONAL PARA COORDENADOR --- */}
                {role === 'coordenador' && (
                  <div className="form-group">
                    <label htmlFor="departamento">Departamento</label>
                    <input type="text" id="departamento" name="departamento" required />
                  </div>
                )}

                {/* --- CAMPOS RESTAURADOS --- */}
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
      
      {/* O Modal continua aqui, funcionando da mesma forma */}
      <MultiSelectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={setDisciplinas}
        options={allDisciplinas}
        selectedValues={disciplinas}
        title="Selecione as Disciplinas"
      />
    </>
  );
};

export default CadastroPage;