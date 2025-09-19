import React from 'react';
import Navbar from '../../components/Navbar/NavBar';
import './AprovarReposicoes.css';
import { FaSearch, FaCheck, FaTimes } from 'react-icons/fa';

// Dados de exemplo com status para renderização condicional
const mockReposicoes = [
  { id: 1, nome: 'Maria Silva', disciplina: 'Matemática', data: '2024-04-15', justificativa: 'Viagem', status: 'pending' },
  { id: 2, nome: 'Carlos Souza', disciplina: 'História', data: '2024-04-16', justificativa: 'Problema de saúde', status: 'approved' },
  { id: 3, nome: 'Ana Lima', disciplina: 'Física', data: '2024-04-17', justificativa: 'Acompanhamento', status: 'rejected' },
  { id: 4, nome: 'Pedro Costa', disciplina: 'Química', data: '2024-04-18', justificativa: 'Congresso', status: 'pending' },
];

const AprovarReposicoes = () => {
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
        <div className="content-wrapper">
          <h1>Aprovar Reposições</h1>
          <div className="search-bar">
            <input type="text" placeholder="Buscar por Professor..." />
            <FaSearch className="search-icon" />
          </div>

          <div className="table-card">
            <table>
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Disciplina</th>
                  <th>Data</th>
                  <th>Justificativa</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {mockReposicoes.map(reposicao => (
                  <tr key={reposicao.id}>
                    <td>{reposicao.nome}</td>
                    <td>{reposicao.disciplina}</td>
                    <td>{reposicao.data}</td>
                    <td>{reposicao.justificativa}</td>
                    <td>
                      <div className="action-buttons">
                        {/* Lógica para mostrar botões diferentes com base no status */}
                        {reposicao.status === 'pending' && (
                          <>
                            <button className="approve-btn"><FaCheck /> Aprovar</button>
                            <button className="reject-btn"><FaTimes /> Recusar</button>
                          </>
                        )}
                        {reposicao.status === 'approved' && (
                          <button className="status-btn approved" disabled><FaCheck /> Aprovado</button>
                        )}
                        {reposicao.status === 'rejected' && (
                          <button className="status-btn rejected" disabled><FaTimes /> Recusado</button>
                        )}
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

export default AprovarReposicoes;