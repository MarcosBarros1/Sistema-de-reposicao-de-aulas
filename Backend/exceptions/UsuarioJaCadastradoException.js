/**
 * Exceção para quando um usuário tenta se cadastrar com uma matrícula já existente.
 */
class UsuarioJaCadastradoException extends Error {
  constructor(message) {
    super(message);
    this.name = 'UsuarioJaCadastradoException';
  }
}

module.exports = UsuarioJaCadastradoException;