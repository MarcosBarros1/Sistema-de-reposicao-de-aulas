/**
 * Exceção para falhas na comunicação com APIs externas.
 */
class APIException extends Error {
  constructor(message) {
    super(message);
    this.name = 'APIException';
  }
}

module.exports = APIException;