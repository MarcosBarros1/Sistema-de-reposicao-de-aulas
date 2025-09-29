import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import './ConfirmarAula.css';
import { FaSearch } from 'react-icons/fa';
import { buscarReposicoesAutorizadas, confirmarRealizacaoReposicao } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import ConfirmEmailModal from '../../components/ConfirmEmailModal/ConfirmEmailModal.jsx';

const ConfirmarAula = () => {
  const navigate = useNavigate();
  const { usuario } = useAuth();

  const [reposicoes, setReposicoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // 2. NOVOS ESTADOS para controlar o modal de e-mail
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [selectedReposicaoId, setSelectedReposicaoId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await buscarReposicoesAutorizadas();
        setReposicoes(data);
      } catch (err) {
        setError("Não foi possível carregar as reposições autorizadas.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleOpenConfirmModal = (reposicaoId) => {
    setSelectedReposicaoId(reposicaoId); // Guarda o ID da reposição que queremos confirmar
    setIsEmailModalOpen(true);
  };

  const handleFinalConfirm = async (emailCoordenador) => {
    if (!selectedReposicaoId) return;

    try {
      const dadosConfirmacao = {
        email_coordenador: emailCoordenador, // O e-mail que o usuário digitou
        id_professor: usuario.idProfessor // A identificação de quem confirmou
      };

      await confirmarRealizacaoReposicao(selectedReposicaoId, dadosConfirmacao);
      alert('Aula confirmada com sucesso! O coordenador será notificado.');

      setReposicoes(prev => prev.filter(repo => repo.id_solicitacao !== selectedReposicaoId));
    } catch (err) {
      console.error("Erro ao confirmar a aula:", err);
      alert('Não foi possível confirmar a aula. Tente novamente.');
    } finally {
      // Fecha o modal e reseta o ID selecionado
      setIsEmailModalOpen(false);
      setSelectedReposicaoId(null);
    }
  };

  const handleConfirmarAula = async (reposicaoId) => {
    if (window.confirm('Você confirma que esta aula de reposição foi realizada?')) {
      try {
        await confirmarRealizacaoReposicao(reposicaoId);
        alert('Aula confirmada com sucesso! O coordenador será notificado.');
        setReposicoes(prevReposicoes => prevReposicoes.filter(repo => repo.id_solicitacao !== reposicaoId));
      } catch (err) {
        console.error("Erro ao confirmar a aula:", err);
        alert('Não foi possível confirmar a aula. Tente novamente.');
      }
    }
  };

  const handleNavigateToAssinaturas = (reposicaoId) => {
    navigate(`/professor/reposicao/${reposicaoId}/assinaturas`);
  };

  const reposicoesParaConfirmar = reposicoes.filter(repo =>
    (repo.nome_turma || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) { return <div className="loading-error-message">Carregando aulas para confirmação...</div>; }
  if (error) { return <div className="loading-error-message">{error}</div>; }

  return (
    <div className="page-container">
      <Navbar
        userName={usuario ? usuario.nome : ''}
        userIdentifier={usuario ? usuario.matriculaProfessor : ''}
        userAvatarUrl={usuario ? usuario.avatar : ''}
      />
      <div className="content-area">
        <div className="content-wrapper">
          <div className="page-header">
            <h1>Confirmar Acontecimento das Aulas</h1>
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
                {/* --- MUDANÇA: Colunas ajustadas --- */}
                <tr>
                  <th>Data</th>
                  <th>Turma</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {reposicoesParaConfirmar.map((repo) => (
                  // --- MUDANÇA: Chave e dados ajustados ---
                  <tr key={repo.id_solicitacao}>
                    <td>{new Date(repo.data).toLocaleDateString()}</td>
                    <td>{repo.nome_turma}</td>
                    <td>
                      <span className={`status-badge status-${repo.status.toLowerCase().replace(/_/g, '-')}`}>
                        {repo.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="action-button-confirm"
                          onClick={() => handleOpenConfirmModal(repo.id_solicitacao)} // 5. Chama a função que abre o modal
                        >
                          Confirmar
                        </button>
                        <button
                          className="action-button-view"
                          onClick={() => handleNavigateToAssinaturas(repo.id_solicitacao)}
                        >
                          Visualizar
                        </button>
                      </div>

                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <ConfirmEmailModal
          isOpen={isEmailModalOpen}
          onClose={() => setIsEmailModalOpen(false)}
          onConfirm={handleFinalConfirm}
        />
    </div>
  );
};

export default ConfirmarAula;