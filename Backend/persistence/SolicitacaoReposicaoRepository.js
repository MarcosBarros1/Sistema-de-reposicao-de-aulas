// persistence/SolicitacaoReposicaoRepository.js

const db = require('../config/db');
const SolicitacaoReposicao = require('../model/SolicitacaoReposicao');
const SolicitacaoStatus = require('../constants/SolicitacaoStatus');

/**
 * Classe Repository para acesso aos dados da entidade SolicitacaoReposicao.
 */
class SolicitacaoReposicaoRepository {
  /**
   * Salva uma nova solicitação de reposição no banco de dados.
   * @param {SolicitacaoReposicao} solicitacao - O objeto SolicitacaoReposicao a ser salvo.
   * @returns {Promise<SolicitacaoReposicao>}
   */
  async salvar(solicitacao) {
    const query = `
      INSERT INTO solicitacao_reposicao 
        (motivo, status, data, horario, sala, id_turma, matricula_professor)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
    `;

    const values = [
      solicitacao.motivo,
      solicitacao.status || SolicitacaoStatus.PENDENTE, // padrão inicial
      solicitacao.data,
      solicitacao.horario,
      solicitacao.sala,
      solicitacao.idTurma,
      solicitacao.idProfessor
    ];

    const result = await db.query(query, values);
    return SolicitacaoReposicao.fromDatabase(result.rows[0]);
  }

  /**
   * Atualiza o status de uma solicitação.
   * @param {number} id - O ID da solicitação.
   * @param {string} status - O novo status.
   * @returns {Promise<SolicitacaoReposicao|null>}
   */
  async atualizarStatus(id, status) {
    const statusPermitidos = Object.values(SolicitacaoStatus);
    if (!statusPermitidos.includes(status)) {
      throw new Error(`Status inválido: ${status}`);
    }

    const query = `
      UPDATE solicitacao_reposicao
      SET status = $1
      WHERE id_solicitacao = $2
      RETURNING *;
    `;

    const result = await db.query(query, [status, id]);

    if (result.rows.length === 0) {
      return null;
    }

    return SolicitacaoReposicao.fromDatabase(result.rows[0]);
  }

  /**
   * Busca uma solicitação por seu ID.
   * @param {number} id - O ID da solicitação.
   * @returns {Promise<SolicitacaoReposicao|null>}
   */
  async buscarPorId(id) {
    const query = `
      SELECT *
      FROM solicitacao_reposicao
      WHERE id_solicitacao = $1;
    `;

    const result = await db.query(query, [id]);

    if (result.rows.length === 0) {
      return null;
    }

    return SolicitacaoReposicao.fromDatabase(result.rows[0]);
  }

  /**
   * Lista todas as solicitações.
   * @returns {Promise<SolicitacaoReposicao[]>}
   */
  async listarTodos() {
    const query = `SELECT * FROM solicitacao_reposicao ORDER BY data DESC;`;
    const result = await db.query(query);
    return result.rows.map(row => SolicitacaoReposicao.fromDatabase(row));
  }
}

module.exports = new SolicitacaoReposicaoRepository();
