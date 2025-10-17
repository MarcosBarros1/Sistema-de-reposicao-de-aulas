import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar/Navbar';
import './MinhasReposicoes.css';
import { FaSearch } from 'react-icons/fa';
import { buscarMinhasReposicoes } from '../../services/api';

const MinhasReposicoesPage = () => {
  const navigate = useNavigate();
  const { usuario, loading: authLoading } = useAuth();

  const [reposicoes, setReposicoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      if (usuario && usuario.matriculaProfessor) {
        setLoading(true);
        try {
          const data = await buscarMinhasReposicoes(usuario.matriculaProfessor);
          setReposicoes(data || []);
        } catch (err) {
          setError("Não foi possível carregar suas reposições.");
        } finally {
          setLoading(false);
        }
      } else if (!authLoading) {
        setLoading(false);
      }
    };
    fetchData();
  }, [usuario, authLoading]);

  const handleNavigateToAssinaturas = (reposicaoId) => {
    navigate(`/professor/reposicao/${reposicaoId}/assinaturas`);
  };

  const filteredReposicoes = reposicoes.filter(repo =>
    (repo.nome_turma || '').toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  if (loading || authLoading) {
    return <div>Carregando...</div>; 
  }

  return (
    <div className="page-container">
      <Navbar 
        userName={usuario ? usuario.nome.toUpperCase() : ''}
        userIdentifier={usuario ? usuario.matriculaProfessor : ''}
      />
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

          <div className="table-container-white">
            <table>
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
                {filteredReposicoes.length > 0 ? (
                  filteredReposicoes.map((repo) => (
                    <tr key={repo.id_solicitacao} onClick={() => handleNavigateToAssinaturas(repo.id_solicitacao)} className="clickable-row">
                      <td>{new Date(repo.data).toLocaleDateString()}</td>
                      <td>{repo.horario}</td>
                      <td>{repo.nome_turma}</td>
                      <td>{repo.qt_alunos}</td>
                      <td>
                        <span className={`status-badge status-${repo.status.toLowerCase().replace(/_/g, '-')}`}>
                          {repo.status.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td>
                        <button className="action-button-view">
                          Visualizar
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center' }}>Nenhuma reposição encontrada.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

// AQUI ESTÁ A CORREÇÃO
export default MinhasReposicoesPage;