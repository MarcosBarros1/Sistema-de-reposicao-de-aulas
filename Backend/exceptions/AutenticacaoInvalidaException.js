/**
 * Exceção para erros de autenticação.
 * Cobre credenciais inválidas e contas bloqueadas.
 */
class AutenticacaoInvalidaException extends Error {
  constructor(message) {
    super(message);
    this.name = 'AutenticacaoInvalidaException';
  }
}

module.exports = AutenticacaoInvalidaException;