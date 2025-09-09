/**
 * Exceção para falhas na comunicação com o banco de dados.
 * Cobre erros de gravação e atualização.
 */
class ErroDePersistenciaException extends Error {
  constructor(message) {
    super(message);
    this.name = 'ErroDePersistenciaException';
  }
}

module.exports = ErroDePersistenciaException;