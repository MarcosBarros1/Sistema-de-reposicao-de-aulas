// Classe responsável por representar uma Turma
class Turma {
  /**
   * @param {number} idTurma
   * @param {string} nome
   * @param {string} semestre
   * @param {number[]} alunos - Lista de IDs dos alunos na turma.
   */
  constructor(idTurma, nome, semestre, alunos) {
    this.idTurma = idTurma;
    this.nome = nome;
    this.semestre = semestre;
    this.alunos = alunos;
  }

  // Método para adicionar um aluno à turma
  adicionarAluno(aluno) {
    // TODO: Implementar lógica para adicionar aluno
  }

  // Método para remover um aluno da turma
  removerAluno(aluno) {
    // TODO: Implementar lógica para remover aluno
  }
}

module.exports = Turma;