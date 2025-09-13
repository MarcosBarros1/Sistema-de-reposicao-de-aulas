// model/SolicitacaoReposicao.js

const SolicitacaoStatus = require('../constants/SolicitacaoStatus');

// Classe responsável por representar uma Solicitação de Reposição
class SolicitacaoReposicao {
  /**
   * @param {number} idSolicitacao
   * @param {string} motivo
   * @param {string} status - Status da solicitação (ex: pendente, autorizada, negada).
   * @param {Date} data
   * @param {string} horario
   * @param {string} sala
   * @param {number} qt_alunos
   * @param {number} idProfessor - Chave estrangeira do professor (matrícula).
   * @param {number} idTurma - Chave estrangeira da turma.
   */
  constructor(
    idSolicitacao,
    motivo,
    status,
    data,
    horario,
    sala,
    qt_alunos,
    idProfessor,
    idTurma
  ) {
    this.idSolicitacao = idSolicitacao;
    this.motivo = motivo;
    this.status = status;
    this.data = data;
    this.horario = horario;
    this.sala = sala;
    this.qt_alunos = qt_alunos;
    this.idProfessor = idProfessor;
    this.idTurma = idTurma;
  }

  // Atualiza o status da solicitação validando com as constantes
  atualizarStatus(novoStatus) {
    const statusPermitidos = Object.values(SolicitacaoStatus);
    if (!statusPermitidos.includes(novoStatus)) {
      throw new Error(`Status inválido: ${novoStatus}`);
    }
    this.status = novoStatus;
  }

  // Constrói um objeto a partir de um registro do banco
  static fromDatabase(row) {
    return new SolicitacaoReposicao(
      row.id_solicitacao,
      row.motivo,
      row.status,
      row.data,
      row.horario,
      row.sala,
      row.qt_alunos,
      row.matricula_professor,
      row.id_turma
    );
  }
}

module.exports = SolicitacaoReposicao;
