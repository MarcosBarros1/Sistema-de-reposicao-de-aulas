import React, { useState, useEffect } from 'react';
// 1. Importações atualizadas
import Navbar from '../../components/Navbar/NavBar'; // Trocamos Header por Navbar
import './GerenciarProfessores.css';

// Dados de exemplo
const mockProfessores = [
  { id: 1, nome: 'Rafael Maciel', disciplina: 'IHC', email: 'rafaelmaciel@gmail.com', status: 'Ativo' },
  { id: 2, nome: 'Erlano Benevides', disciplina: 'Eng. de Software', email: 'erlano10@gmail.com', status: 'Ativo' },
  { id: 3, nome: 'Rafael Maciel', disciplina: 'IHC', email: 'rafaelmaciel@gmail.com', status: 'Ativo' },
  { id: 4, nome: 'Rafael Maciel', disciplina: 'IHC', email: 'rafaelmaciel@gmail.com', status: 'Ativo' },
  { id: 5, nome: 'Erlano Benevides', disciplina: 'Eng. de Software', email: 'erlano10@gmail.com', status: 'Ativo' },
];

function GerenciarProfessores() {
  const [professores, setProfessores] = useState([]);
  const [filtro, setFiltro] = useState('');

  // 2. Adicionamos os dados do usuário para a Navbar
  const userData = {
    name: "ERLANO BENEVIDES DE SOUSA",
    id: "20241283000219",
    avatar: ""
  };

  useEffect(() => {
    setProfessores(mockProfessores);
  }, []);

  const professoresFiltrados = professores.filter(prof =>
    prof.nome.toLowerCase().includes(filtro.toLowerCase()) ||
    prof.disciplina.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    // 3. Aplicamos a nossa estrutura de layout padrão
    <div className="page-container">
      <Navbar 
        userName={userData.name}
        userIdentifier={userData.id}
        userAvatarUrl={userData.avatar}
      />
      <div className="content-area">
        <div className="content-wrapper">

          {/* Todo o conteúdo da página antiga agora fica aqui dentro */}
          <div className="page-header">
            <h1>Gerenciar Professores</h1>
            <button className="add-button">+ Adicionar Professor</button>
          </div>

          <div className="search-bar">
            <input
              type="text"
              placeholder="Buscar por nome ou disciplina..."
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
            />
          </div>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Disciplina</th>
                  <th>E-mail</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {professoresFiltrados.map((professor) => (
                  <tr key={professor.id}>
                    <td>{professor.nome}</td>
                    <td>{professor.disciplina}</td>
                    <td>{professor.email}</td>
                    <td>
                      <span className={`status status-${professor.status.toLowerCase()}`}>
                        {professor.status}
                      </span>
                    </td>
                    <td className="actions-cell">
                      <button className="action-button edit-button">Editar</button>
                      <button className="action-button delete-button">Excluir</button>
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
}

export default GerenciarProfessores;