// model/Usuario.js

/**
 * Representa a entidade genérica de um Usuário no sistema.
 * Funciona como uma classe base para Aluno, Professor e Coordenador,
 * espelhando a estrutura da tabela 'usuario' no banco de dados.
 */
class Usuario {
  /**
   * @param {number} idUsuario - Identificador único do usuário, correspondente a 'id_usuario' no banco.
   * @param {string} nome - Nome do usuário.
   * @param {string} email - E-mail do usuário, deve ser único.
   * @param {string} tipo - Tipo de usuário ('Professor', 'Coordenador', 'Aluno').
   */
  constructor(idUsuario, nome, email, tipo) {
    this.idUsuario = idUsuario;
    this.nome = nome;
    this.email = email;
    this.tipo = tipo;
  }
}

module.exports = Usuario;