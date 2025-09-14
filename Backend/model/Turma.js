// Classe responsável por representar uma Turma
class Turma {
  /**
   * @param {number} idTurma
   * @param {string} nome
   * @param {string} semestre
   * @param {number[]} alunos - Lista de IDs dos alunos na turma.
   */
  constructor(idTurma, nome, semestre, alunos = []) {
    this.idTurma = idTurma;
    this.nome = nome;
    this.semestre = semestre;
    this.alunos = alunos;
  }

  // Método para adicionar um aluno à turma
  adicionarAluno(alunoId) {
    if (!this.alunos.includes(alunoId)) {
      this.alunos.push(alunoId);
      console.log(`Aluno ${alunoId} adicionado à turma ${this.nome}`);
    }
  }

  // Método para remover um aluno da turma
  removerAluno(alunoId) {
    this.alunos = this.alunos.filter(id => id !== alunoId);
    console.log(`Aluno ${alunoId} removido da turma ${this.nome}`);
  }
}

module.exports = Turma;
