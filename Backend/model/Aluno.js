// Classe responsável por representar um Aluno no sistema
// Conceitos de POO usados: herança e sobrescrita

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
    return this.turmas; 
  }

  // Método para receber um formulário de notificação
  receberFormulario(notificacao) {
    // TODO: Implementar lógica para receber o formulário
    console.log(`Aluno ${this.nome} recebeu notificação: ${notificacao}`);
    // Poderia armazenar notificações recebidas em um array, se necessário
  }

  // Método para realizar o cadastro, sobrescrevendo o da classe pai
  cadastrar(dadosAluno) {
    // Chama o método da classe pai com os dados básicos
    super.cadastrar(dadosAluno);

    // Adiciona lógica específica de aluno
    this.matriculaAluno = dadosAluno.matriculaAluno;
    this.turmas = dadosAluno.turmas || [];

    console.log(`Aluno ${this.nome} cadastrado com matrícula ${this.matriculaAluno}`);
    return this;

    // TODO: Implementar lógica de cadastro específica do aluno.
    // Exemplo: salvar matriculaAluno e turma.
  }
}

module.exports = Aluno;