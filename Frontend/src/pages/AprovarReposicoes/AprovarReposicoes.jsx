import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import './AprovarReposicoes.css';
import { FaSearch, FaCheck, FaTimes } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { buscar_reposicoes_pendentes, avaliar_reposicao } from '../../services/api';
import { SolicitacaoStatus } from '../../constants/SolicitacaoStatus'; // Importe seu enum

const AprovarReposicoes = () => {
  const { usuario } = useAuth();
  const [reposicoes, set_reposicoes] = useState([]);
  const [carregando, set_carregando] = useState(true);

  useEffect(() => {
    const carregar_reposicoes = async () => {
      try {
        const dados = await buscar_reposicoes_pendentes();
        set_reposicoes(dados || []);
      } catch (error) {
        alert('Falha ao carregar as reposições pendentes.');
      } finally {
        set_carregando(false);
      }
    };
    carregar_reposicoes();
  }, []);

  const handle_avaliacao = async (id_solicitacao, decisao) => {
    // Para a negação, podemos pedir um motivo
    let comentario = '';
    if (decisao === SolicitacaoStatus.NEGADA) {
      comentario = prompt("Por favor, informe o motivo da negação:");
      if (comentario === null) return; // O usuário cancelou
    }

    try {
      await avaliar_reposicao(id_solicitacao, decisao, comentario);
      // Remove a reposição da lista na tela para dar feedback imediato
      set_reposicoes(lista_atual => lista_atual.filter(r => r.id_solicitacao !== id_solicitacao));
      alert(`Solicitação ${decisao === SolicitacaoStatus.AUTORIZADA ? 'aprovada' : 'negada'} com sucesso!`);
    } catch (error) {
      alert(`Falha ao avaliar a solicitação: ${error.message}`);
    }
  };

  if (carregando) return <div>Carregando...</div>;

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
            <input type="text" placeholder="Buscar por Professor..." />
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
                {reposicoes.length > 0 ? (
                  reposicoes.map(reposicao => (
                    <tr key={reposicao.id_solicitacao}>
                      <td>{reposicao.nome_professor}</td>
                      <td>{reposicao.nome_turma}</td>
                      <td>{new Date(reposicao.data).toLocaleDateString('pt-BR')}</td>
                      <td>{reposicao.motivo}</td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="approve-btn"
                            onClick={() => handle_avaliacao(reposicao.id_solicitacao, SolicitacaoStatus.AUTORIZADA)}
                          >
                            <FaCheck /> Aprovar
                          </button>
                          <button
                            className="reject-btn"
                            onClick={() => handle_avaliacao(reposicao.id_solicitacao, SolicitacaoStatus.NEGADA)}
                          >
                            <FaTimes /> Recusar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
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