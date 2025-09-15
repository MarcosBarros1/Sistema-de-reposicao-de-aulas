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
}

module.exports = new AssinaturaRepository();