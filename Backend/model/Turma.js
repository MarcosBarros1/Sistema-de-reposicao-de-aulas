// Classe responsável por representar uma Turma
// model/Turma.js

class Turma {
  // CORREÇÃO: Removido ano, periodo, id_disciplina. Adicionado semestre.
  constructor(id_turma, nome, semestre, alunos = []) {
    this.id_turma = id_turma;
    this.nome = nome;
    this.semestre = semestre;
    this.alunos = alunos;
  }
}

module.exports = Turma;