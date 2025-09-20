import React from 'react';
import Navbar from '../../components/Navbar/NavBar';
import './GerenciarTurmas.css';
import { FaSearch } from 'react-icons/fa'; // Ícone para a barra de busca

// Dados de exemplo para a tabela. No futuro, isso virá da sua API.
const mockTurmas = [
  { id: 1, turma: '1 ano', curso: 'Eng. Soft', semestre: '2024/1', alunos: 30 },
  { id: 2, turma: '2 ano', curso: 'Redes', semestre: '2024/1', alunos: 25 },
  { id: 3, turma: '3 ano', curso: 'Sistemas', semestre: '2023/2', alunos: 32 },
  { id: 4, turma: 'Técnico 1', curso: 'Informática', semestre: '2024/1', alunos: 40 },
  { id: 5, turma: 'Técnico 2', curso: 'Eletrônica', semestre: '2023/2', alunos: 35 },
];

const GerenciarTurmas = () => {
  // Dados do usuário para a Navbar (você pode gerenciar isso de forma global depois)
  const userData = {
    name: "ERLANO BENEVIDES DE SOUSA",
    id: "20241283000219",
    avatar: ""
  };

  return (
    <div className="page-container">
      <Navbar 
        userName={userData.name}
        userIdentifier={userData.id}
        userAvatarUrl={userData.avatar}
      />
      <div className="content-area">
        {/* 👇 ADICIONAMOS ESTE WRAPPER PARA CENTRALIZAR O CONTEÚDO 👇 */}
        <div className="content-wrapper">
          <div className="page-header">
            <h1>Gerenciar Turmas</h1>
            <button className="add-button">+ Adicionar Turmas</button>
          </div>

          <div className="search-bar">
            <input type="text" placeholder="Buscar por nome ou disciplina..." />
            <FaSearch className="search-icon" />
          </div>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Turma</th>
                  <th>Curso</th>
                  <th>Ano/Semestre</th>
                  <th>Qtd de alunos</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {mockTurmas.map((turma) => (
                  <tr key={turma.id}>
                    <td>{turma.turma}</td>
                    <td>{turma.curso}</td>
                    <td>{turma.semestre}</td>
                    <td>{turma.alunos}</td>
                    <td>
                      <div className="action-buttons">
                        <button className="edit-btn">Editar</button>
                        <button className="remove-btn">Remover</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div> {/* Fim do content-wrapper */}
      </div>
    </div>
  );
};

export default GerenciarTurmas;