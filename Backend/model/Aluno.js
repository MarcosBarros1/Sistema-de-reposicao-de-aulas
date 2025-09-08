// Classe responsável por representar um Aluno no sistema
const Usuario = require('./Usuario');

class Aluno extends Usuario {
  /**
   * @param {number} idUsuario
   * @param {string} nome
   * @param {string} email
   * @param {string} senha
   * @param {string} matriculaAluno - Matrícula específica do aluno.
   * @param {string[]} turmas - Lista de IDs das turmas em que o aluno está matriculado.
   */
  constructor(idUsuario, nome, email, senha, matriculaAluno, turmas) {
    super(idUsuario, nome, email, senha, 'Aluno');
    this.matriculaAluno = matriculaAluno;
    this.turmas = turmas;
  }

  // Método para consultar o horário de aulas
  consultarHorario() {
    // TODO: Implementar lógica de consulta
  }

  // Método para receber um formulário de notificação
  receberFormulario(notificacao) {
    // TODO: Implementar lógica para receber o formulário
  }

  // Método para realizar o cadastro, sobrescrevendo o da classe pai
  cadastrar(dadosAluno) {
    // Chama o método da classe pai com os dados básicos
    super.cadastrar(dadosAluno);

    // TODO: Implementar lógica de cadastro específica do aluno.
    // Exemplo: salvar matriculaAluno e turma.
  }
}

module.exports = Aluno;