import React, { useState } from 'react';
import Navbar from '../../components/NavBar/NavBar';
import './MinhasReposicoesPage.css';

// Importando os ícones necessários
import { FaSearch } from 'react-icons/fa';
import { BsPencilFill, BsTrashFill } from 'react-icons/bs';

// Mantemos os dados de exemplo para as reposições
const mockReposicoes = [
  { id: 1, turma: '3° Ano Redes', disciplina: 'Português', aulasARepor: 0, status: 'Ativo' },
  { id: 2, turma: '2° Ano Agro', disciplina: 'Matemática', aulasARepor: 0, status: 'Ativo' },
  { id: 3, turma: '1° Ano Redes', disciplina: 'História', aulasARepor: 0, status: 'Ativo' },
  { id: 4, turma: '2° Ano Redes', disciplina: 'Geografia', aulasARepor: 0, status: 'Ativo' },
  { id: 5, turma: '3° Ano Agro', disciplina: 'Matemática', aulasARepor: 0, status: 'Ativo' },
];

const MinhasReposicoesPage = () => {
  // Dados do usuário para a Navbar
  const userData = {
    name: "NOME DO PROFESSOR",
    id: "Matrícula do Professor",
    avatar: ""
  };

  const [searchTerm, setSearchTerm] = useState('');

  // Filtro dos dados da tabela
  const filteredReposicoes = mockReposicoes.filter(repo =>
    repo.turma.toLowerCase().includes(searchTerm.toLowerCase()) ||
    repo.disciplina.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="page-container">
      <Navbar
        userName={userData.name}
        userIdentifier={userData.id}
        userAvatarUrl={userData.avatar}
      />
      <div className="content-area">
        <div className="content-wrapper">
          <div className="page-header">
            <h1>Minhas Reposições</h1>
            {/* Opcional: Se precisar de um botão aqui, pode adicionar como o "+ Adicionar Turmas" */}
          </div>

          <div className="search-bar">
            <input
              type="text"
              placeholder="Buscar por Turma ou Disciplina..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaSearch className="search-icon" />
          </div>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Turma</th>
                  <th>Disciplina</th>
                  <th>Total de Aulas a Repor</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredReposicoes.map((repo) => (
                  <tr key={repo.id}>
                    <td>{repo.turma}</td>
                    <td>{repo.disciplina}</td>
                    <td>{repo.aulasARepor}</td>
                    <td>{repo.status}</td>
                    <td>
                      {/* Trocamos os botões por ícones, como no design original */}
                      <div className="action-buttons icon-style">
                        <BsPencilFill className="action-icon edit-icon" />
                        <BsTrashFill className="action-icon remove-icon" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MinhasReposicoesPage;