// Classe responsável por representar um Professor no sistema
const Usuario = require('./Usuario');

class Professor extends Usuario {
  /**
   * @param {number} idUsuario
   * @param {string} nome
   * @param {string} email
   * @param {string} senha
   * @param {string} matriculaProfessor - Matrícula específica do professor.
   * @param {string[]} disciplinasMinistradas - Lista de IDs das disciplinas que o professor ministra.
   */
  constructor(idUsuario, nome, email, senha, matriculaProfessor, disciplinasMinistradas) {
    super(idUsuario, nome, email, senha, 'Professor');
    this.matriculaProfessor = matriculaProfessor;
    this.disciplinasMinistradas = disciplinasMinistradas;
  }

  // Método para criar uma solicitação de reposição
  criarSolicitacaoReposicao(motivo, data, horario, sala, qtAlunos, idProfessor) {
    // TODO: Implementar lógica para criar a solicitação
  }

  // Método para consultar o agendamento
  consultarAgendamento() {
    // TODO: Implementar consulta de agendamento
  }

  // Método para realizar o cadastro, sobrescrevendo o da classe pai
  cadastrar(dadosProfessor) {
    // Chama o método da classe pai com os dados básicos
    super.cadastrar(dadosProfessor);

    // TODO: Implementar lógica de cadastro específica do professor.
    // Exemplo: salvar matriculaProfessor e disciplinasMinistradas.
  }
}

module.exports = Professor;