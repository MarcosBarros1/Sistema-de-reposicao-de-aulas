// persistence/AssinaturaRepository.js
const db = require('../config/db');

class AssinaturaRepository {
  /**
   * Salva a assinatura (resposta) de um aluno para uma solicitação.
   * @param {object} dadosAssinatura - { idSolicitacao, matriculaAluno, concorda }
   */
  async salvar(dadosAssinatura) {
    const { idSolicitacao, matriculaAluno, concorda } = dadosAssinatura;
    const sql = `
      INSERT INTO assinatura_solicitacao (id_solicitacao, matricula_aluno, concorda)
      VALUES ($1, $2, $3)
      ON CONFLICT (id_solicitacao, matricula_aluno)
      DO UPDATE SET concorda = $3, data_assinatura = CURRENT_TIMESTAMP;
    `;
    // ON CONFLICT ... DO UPDATE garante que se o aluno mudar de ideia e votar de novo, a resposta será atualizada.
    await db.query(sql, [idSolicitacao, matriculaAluno, concorda]);
  }

  /**
   * Conta quantas assinaturas de concordância uma solicitação recebeu.
   * @param {number} id_solicitacao - O ID da solicitação.
   * @returns {Promise<number>} O número de alunos que concordaram.
   */
  async contarConcordancias(id_solicitacao) {
    try {
      const sql = 'SELECT COUNT(*) FROM assinatura_solicitacao WHERE id_solicitacao = $1 AND concorda = TRUE';
      const result = await db.query(sql, [id_solicitacao]);
      return parseInt(result.rows[0].count, 10);
    } catch (error) {
      console.error(`Erro ao contar concordâncias para solicitação ${id_solicitacao}:`, error);
      throw error;
    }
  }

   /**
   * Conta quantas assinaturas de DISCORDÂNCIA uma solicitação recebeu.
   * @param {number} id_solicitacao - O ID da solicitação.
   * @returns {Promise<number>} O número de alunos que discordaram.
   */
  async contarDiscordancias(id_solicitacao) {
    try {
      // A única diferença é 'concorda = FALSE'
      const sql = 'SELECT COUNT(*) FROM assinatura_solicitacao WHERE id_solicitacao = $1 AND concorda = FALSE';
      const result = await db.query(sql, [id_solicitacao]);
      return parseInt(result.rows[0].count, 10);
    } catch (error) {
      console.error(`Erro ao contar discordâncias para solicitação ${id_solicitacao}:`, error);
      throw error;
    }
  }

}

module.exports = new AssinaturaRepository();