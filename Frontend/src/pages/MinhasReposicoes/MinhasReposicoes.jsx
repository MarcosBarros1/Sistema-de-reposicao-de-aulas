import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar'; // Verifique se o caminho está certo
import './MinhasReposicoes.css';
import { FaSearch } from 'react-icons/fa';
import { buscarMinhasReposicoes } from '../../services/api'; // Verifique se o caminho está certo

const MinhasReposicoesPage = () => {
  const navigate = useNavigate();
  const userData = { name: "NOME DO PROFESSOR", id: "Matrícula do Professor", avatar: "" };
  
  const [reposicoes, setReposicoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await buscarMinhasReposicoes();
        setReposicoes(data);
      } catch (err) {
        setError("Não foi possível carregar as reposições.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleNavigateToAssinaturas = (reposicaoId) => {
    navigate(`/professor/reposicao/${reposicaoId}/assinaturas`);
  };

  // 1. Primeiro, filtramos para manter apenas as reposições que estão ativas/pendentes
  const reposicoesAtivas = reposicoes.filter(repo => 
    repo.status === 'PENDENTE' || repo.status === 'AGUARDANDO_APROVACAO'
  );

  // 2. Depois, aplicamos o filtro da barra de busca em cima dessa lista já filtrada
  const filteredReposicoes = reposicoesAtivas.filter(repo =>
    (repo.turma?.nome || `Sala ${repo.sala}`).toLowerCase().includes(searchTerm.toLowerCase()) ||
    (repo.disciplina?.nome || '').toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  if (loading) {  }
  if (error) {  }

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

          {/* 👇 NOVO CONTAINER PARA A TABELA 👇 */}
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
                {filteredReposicoes.map((repo) => (
                  <tr key={repo.idSolicitacao}>
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
                      {/* 👇 BOTÃO DE AÇÃO PARA NAVEGAR 👇 */}
                      <button 
                        className="action-button-view"
                        onClick={() => handleNavigateToAssinaturas(repo.idSolicitacao)}
                      >
                        Visualizar
                      </button>
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