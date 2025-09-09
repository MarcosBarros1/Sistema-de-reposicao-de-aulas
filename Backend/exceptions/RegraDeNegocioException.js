/**
 * Exceção para falhas em regras de negócio específicas.
 * Por exemplo, quando o percentual de assinaturas é inferior a 75%.
 */
class RegraDeNegocioException extends Error {
  constructor(message) {
    super(message);
    this.name = 'RegraDeNegocioException';
  }
}

module.exports = RegraDeNegocioException;