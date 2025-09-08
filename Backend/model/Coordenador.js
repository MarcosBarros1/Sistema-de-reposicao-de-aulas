// Classe responsável por representar um Coordenador no sistema
const Usuario = require('./Usuario');

class Coordenador extends Usuario {
  /**
   * @param {number} idUsuario
   * @param {string} nome
   * @param {string} email
   * @param {string} senha
   * @param {string} matriculaCoordenador - Matrícula específica do coordenador.
   * @param {string} departamento - Departamento ao qual o coordenador pertence.
   */
  constructor(idUsuario, nome, email, senha, matriculaCoordenador, departamento) {
    super(idUsuario, nome, email, senha, 'Coordenador');
    this.matriculaCoordenador = matriculaCoordenador;
    this.departamento = departamento;
  }

  // Método para avaliar uma solicitação de reposição
  avaliarSolicitacao(decisao, comentario) {
    // TODO: Implementar lógica de avaliação
  }

  // Método para notificar a falta de um professor
  notificarFaltaProfessor(idProfessor) {
    // TODO: Implementar lógica para notificar o professor
  }

  // Método para cadastrar um professor
  cadastrarProfessor(nome, matricula, email, disciplinas) {
    // TODO: Implementar lógica de cadastro do professor
  }

  // Método para cadastrar uma disciplina
  cadastrarDisciplina(codigo, nome, cargaHoraria) {
    // TODO: Implementar lógica de cadastro da disciplina
  }

  // Método para cadastrar uma turma
  cadastrarTurma(nome, semestre, alunos, idDisciplina) {
    // TODO: Implementar lógica de cadastro da turma
  }
  
  // Método para realizar o cadastro, sobrescrevendo o da classe pai
  cadastrar(dadosCoordenador) {
    // Chama o método da classe pai com os dados básicos
    super.cadastrar(dadosCoordenador);

    // TODO: Implementar lógica de cadastro específica do coordenador.
    // Exemplo: salvar matriculaCoordenador e departamento.
  }
}

module.exports = Coordenador;