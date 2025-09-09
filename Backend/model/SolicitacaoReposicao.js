// Classe responsável por representar uma Solicitação de Reposição
class SolicitacaoReposicao {
  /**
   * @param {number} idSolicitacao
   * @param {string} motivo
   * @param {string} status - Status da solicitação (ex: pendente, autorizada, negada).
   * @param {Date} data
   * @param {string} horario
   * @param {string} sala
   * @param {number} qtAlunos
   * @param {number} idProfessor - Chave estrangeira do professor.
   */
  constructor(idSolicitacao, motivo, status, data, horario, sala, qtAlunos, idProfessor) {
    this.idSolicitacao = idSolicitacao;
    this.motivo = motivo;
    this.status = status;
    this.data = data;
    this.horario = horario;
    this.sala = sala;
    this.qtAlunos = qtAlunos;
    this.idProfessor = idProfessor;
  }

  // Método para atualizar o status da solicitação
  atualizarStatus(novoStatus) {
    // TODO: Implementar atualização de status
  }
}

module.exports = SolicitacaoReposicao;