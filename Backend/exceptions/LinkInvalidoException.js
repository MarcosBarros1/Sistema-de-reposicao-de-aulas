/**
 * Exceção para links de formulário que estão expirados ou são inválidos.
 */
class LinkInvalidoException extends Error {
  constructor(message) {
    super(message);
    this.name = 'LinkInvalidoException';
  }
}

module.exports = LinkInvalidoException;