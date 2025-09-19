import React, { useState, useEffect } from 'react';
import Header from '../../components/Header/Header'; // Reutilizando o Header!
import './GerenciarProfessores.css';

// Dados de exemplo. No futuro, você buscará isso de uma API.
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

  // Simula a busca de dados quando o componente é carregado
  useEffect(() => {
    // Aqui você faria a chamada para sua API real
    // Ex: fetch('/api/professores').then(res => res.json()).then(data => setProfessores(data));
    setProfessores(mockProfessores);
  }, []);

  // Filtra os professores com base na busca
  const professoresFiltrados = professores.filter(prof =>
    prof.nome.toLowerCase().includes(filtro.toLowerCase()) ||
    prof.disciplina.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div className="gerenciar-professores-container">
      <Header />
      <main className="main-content">
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
      </main>
    </div>
  );
}

export default GerenciarProfessores;