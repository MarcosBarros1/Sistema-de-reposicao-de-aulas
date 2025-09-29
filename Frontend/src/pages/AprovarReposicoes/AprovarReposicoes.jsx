import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import './AprovarReposicoes.css';
import { FaSearch, FaCheck, FaTimes } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { buscar_reposicoes_pendentes, avaliar_reposicao } from '../../services/api';
import { SolicitacaoStatus } from '../../constants/SolicitacaoStatus';

const AprovarReposicoes = () => {
  const { usuario, loading: authLoading } = useAuth();
  
  const [reposicoes, set_reposicoes] = useState([]);
  const [carregando, set_carregando] = useState(true);
  const [filtro, set_filtro] = useState('');

  // ✅ 1. ESTADO DE CARREGAMENTO ATUALIZADO: Guarda o ID e a Ação.
  const [submitting_state, set_submitting_state] = useState({ id: null, action: null });

  useEffect(() => {
    const carregar_reposicoes = async () => {
      if (!usuario) return; // Não faz nada se não houver usuário
      set_carregando(true);
      try {
        const dados = await buscar_reposicoes_pendentes();
        set_reposicoes(dados || []);
      } catch (error) {
        alert('Falha ao carregar as reposições pendentes.');
      } finally {
        set_carregando(false);
      }
    };
    
    if (!authLoading) {
      carregar_reposicoes();
    }
  }, [authLoading, usuario]);

  // ✅ 2. FUNÇÃO ATUALIZADA: Recebe o tipo de 'acao' e o salva no estado.
  const handle_avaliacao = async (id_solicitacao, decisao, acao) => {
    let comentario = '';
    if (decisao === SolicitacaoStatus.NEGADA) {
      comentario = prompt("Por favor, informe o motivo da negação:");
      if (!comentario) {
        alert("O motivo é obrigatório para negar uma solicitação.");
        return;
      }
    }

    set_submitting_state({ id: id_solicitacao, action: acao });
    try {
      await avaliar_reposicao(id_solicitacao, decisao, comentario);
      set_reposicoes(lista_atual => lista_atual.filter(r => r.id_solicitacao !== id_solicitacao));
      alert(`Solicitação ${decisao === SolicitacaoStatus.AUTORIZADA ? 'aprovada' : 'negada'} com sucesso!`);
    } catch (error) {
      alert(`Falha ao avaliar a solicitação: ${error.message}`);
    } finally {
      set_submitting_state({ id: null, action: null });
    }
  };

  const reposicoes_filtradas = reposicoes.filter(r =>
    (r.nome_professor || '').toLowerCase().includes(filtro.toLowerCase())
  );

  if (carregando || authLoading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="page-container">
      <Navbar
        userName={usuario ? usuario.nome.toUpperCase() : ''}
        userIdentifier={usuario ? usuario.matriculaCoordenador : ''}
      />
      <div className="content-area">
        <div className="content-wrapper">
          <h1>Aprovar Reposições</h1>
          <div className="search-bar">
            <input 
              type="text" 
              placeholder="Buscar por Professor..."
              value={filtro}
              onChange={(e) => set_filtro(e.target.value)}
            />
            <FaSearch className="search-icon" />
          </div>

          <div className="table-card">
            <table>
              <thead>
                <tr>
                  <th>Professor</th>
                  <th>Turma</th>
                  <th>Data da Reposição</th>
                  <th>Motivo</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {reposicoes_filtradas.length > 0 ? (
                  reposicoes_filtradas.map(reposicao => {
                    // ✅ 3. LÓGICA ATUALIZADA: Verifica qual botão foi clicado.
                    const is_this_row_submitting = submitting_state.id === reposicao.id_solicitacao;
                    const is_approving = is_this_row_submitting && submitting_state.action === 'aprovar';
                    const is_rejecting = is_this_row_submitting && submitting_state.action === 'recusar';

                    return (
                      <tr key={reposicao.id_solicitacao}>
                        <td>{reposicao.nome_professor}</td>
                        <td>{reposicao.nome_turma}</td>
                        <td>{new Date(reposicao.data).toLocaleDateString('pt-BR')}</td>
                        <td>{reposicao.motivo}</td>
                        <td>
                          <div className="action-buttons">
                            <button
                              className="approve-btn"
                              onClick={() => handle_avaliacao(reposicao.id_solicitacao, SolicitacaoStatus.AUTORIZADA, 'aprovar')}
                              disabled={is_this_row_submitting}
                            >
                              {is_approving ? 'Aprovando...' : <><FaCheck /> Aprovar</>}
                            </button>
                            <button
                              className="reject-btn"
                              onClick={() => handle_avaliacao(reposicao.id_solicitacao, SolicitacaoStatus.NEGADA, 'recusar')}
                              disabled={is_this_row_submitting}
                            >
                              {is_rejecting ? 'Recusando...' : <><FaTimes /> Recusar</>}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center' }}>Nenhuma reposição aguardando aprovação.</td>
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

export default AprovarReposicoes;