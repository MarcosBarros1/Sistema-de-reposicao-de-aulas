// model/Coordenador.js
// Conceitos de POO usados: herança e sobrescrita

const Usuario = require('./Usuario');

/**
 * Representa a entidade de um Coordenador, que herda de Usuário.
 */
class Coordenador extends Usuario {
  /**
   * @param {number} idUsuario - ID da tabela 'usuario'.
   * @param {string} nome
   * @param {string} email
   * @param {number} matriculaCoordenador - Matrícula específica do coordenador.
   * @param {string} senha - Senha do coordenador (hash).
   * @param {string} departamento - Departamento ao qual o coordenador pertence.
   */
  constructor(idUsuario, nome, email, matriculaCoordenador, senha, departamento) {
    // Chama o construtor da classe pai (Usuario)
    super(idUsuario, nome, email, 'Coordenador');
    
    this.matriculaCoordenador = matriculaCoordenador;
    this.senha = senha;
    this.departamento = departamento;
  }
}

module.exports = Coordenador;