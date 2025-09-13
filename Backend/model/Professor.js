// Classe responsável por representar um Professor no sistema
// Conceitos de POO usados: herança e sobrescrita

const Usuario = require('./Usuario');

/**
 * Representa a entidade de um Professor, que herda de Usuário.
 * Define a estrutura de dados completa de um professor no sistema.
 */
class Professor extends Usuario {
  /**
   * @param {number} idUsuario - ID da tabela 'usuario'.
   * @param {string} nome
   * @param {string} email
   * @param {number} matriculaProfessor - Matrícula específica do professor.
   * @param {string} senha - Senha do professor (geralmente o hash da senha).
   * @param {number[]} [disciplinasMinistradas=[]] - Array de IDs das disciplinas que o professor ministra.
   */
  constructor(idUsuario, nome, email, matriculaProfessor, senha, disciplinasMinistradas = []) {
    // Chama o construtor da classe pai (Usuario)
    super(idUsuario, nome, email, 'Professor');
    
    this.matriculaProfessor = matriculaProfessor;
    this.senha = senha; // A senha só existe no objeto, não na tabela 'usuario'
    this.disciplinasMinistradas = disciplinasMinistradas;
  }
}

module.exports = Professor;