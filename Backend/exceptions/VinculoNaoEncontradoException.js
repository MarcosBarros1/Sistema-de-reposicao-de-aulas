/**
 * Exceção para quando um vínculo entre entidades não é encontrado.
 * Por exemplo, um professor não vinculado a uma turma.
 */
class VinculoNaoEncontradoException extends Error {
  constructor(message) {
    super(message);
    this.name = 'VinculoNaoEncontradoException';
  }
}

module.exports = VinculoNaoEncontradoException;