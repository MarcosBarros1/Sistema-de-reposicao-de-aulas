// persistence/DisciplinaRepository.js

const db = require('./db');
const Disciplina = require('../models/Disciplina');

/**
 * Classe Repository para acesso aos dados da entidade Disciplina.
 */
class DisciplinaRepository {
  /**
   * Salva uma nova disciplina no banco de dados.
   * @param {Disciplina} disciplina - O objeto Disciplina a ser salvo.
   */
  async salvar(disciplina) {
    // TODO: Implementar a lógica de inserção no banco de dados.
  }

  /**
   * Busca uma disciplina por seu código.
   * @param {string} codigo - O código da disciplina.
   * @returns {Disciplina} O objeto Disciplina encontrado.
   */
  async buscarPorCodigo(codigo) {
    // TODO: Implementar a lógica de busca no banco de dados.
  }
}

module.exports = new DisciplinaRepository();