// Classe responsável por representar um Aluno no sistema
// Conceitos de POO usados: herança e sobrescrita

// model/Aluno.js
const Usuario = require('./Usuario');

class Aluno extends Usuario {
  constructor(id_usuario, nome, email, matricula_aluno, turmas) {
    super(id_usuario, nome, email, 'Aluno'); 
    this.matricula_aluno = matricula_aluno;
    this.turmas = turmas;
  }
}

module.exports = Aluno;
