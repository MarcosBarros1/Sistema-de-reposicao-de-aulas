import React, { useState } from 'react';
import Navbar from '../../components/NavBar/NavBar';
import './RegistrarReposicoes.css';
import { FaSearch } from 'react-icons/fa';

// 1. Dados atualizados com as novas informações
const mockAulas = [
  { id: 1, data: '22/09/2025', horario: '08:00 - 09:45', turma: '3° Ano Redes', qtdAlunos: 32, status: 'Pendente' },
  { id: 2, data: '22/09/2025', horario: '10:00 - 11:45', turma: '2° Ano Agro', qtdAlunos: 28, status: 'Aguardando Aprovação' },
  { id: 3, data: '23/09/2025', horario: '14:00 - 15:45', turma: '1° Ano Redes', qtdAlunos: 35, status: 'Aceita' },
  { id: 4, data: '24/09/2025', horario: '08:00 - 09:45', turma: '2° Ano Redes', qtdAlunos: 31, status: 'Negada' },
  { id: 5, data: '25/09/2025', horario: '10:00 - 11:45', turma: '3° Ano Agro', qtdAlunos: 29, status: 'Pendente' },
];

const RegistrarReposicoesPage = () => {
  const userData = { name: "NOME DO PROFESSOR", id: "Matrícula do Professor", avatar: "" };

  const [aulas, setAulas] = useState(mockAulas);
  const [searchTerm, setSearchTerm] = useState('');


  const filteredAulas = aulas.filter(aula =>
    aula.turma.toLowerCase().includes(searchTerm.toLowerCase()) ||
    aula.disciplina.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="page-container">
      <Navbar {...userData} />
      <div className="content-area">
        <div className="content-wrapper">
          <div className="page-header">
            <h1>Minhas Reposições</h1>
          </div>
          <div className="search-bar-reposicoes">
            <input
              type="text"
              placeholder="Buscar por Turmas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaSearch className="search-icon" />
          </div>
          <div className="table-container">
            <table className="reposicoes-table-registro">
              {/* 2. Cabeçalho da tabela atualizado */}
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Horário</th>
                  <th>Turma</th>
                  <th>Alunos</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredAulas.map((aula) => (
                  <tr key={aula.id}>
                    {/* 3. Células da tabela atualizadas */}
                    <td>{aula.data}</td>
                    <td>{aula.horario}</td>
                    <td>{aula.turma}</td>
                    <td>{aula.qtdAlunos}</td>
                    <td>
                      {/* Usamos uma função para gerar a classe CSS baseada no status */}
                      <span className={`status-badge status-${aula.status.toLowerCase().replace(' ', '-')}`}>
                        {aula.status}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons-container">
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

export default RegistrarReposicoesPage;