// persistence/NutricionistaRepository.js

const db = require('./db');
const Nutricionista = require('../models/Nutricionista');

/**
 * Classe Repository para acesso aos dados da entidade Nutricionista.
 * Responsável por buscar as informações da nutricionista para notificações.
 */
class NutricionistaRepository {
  /**
   * Salva uma nova nutricionista no banco de dados.
   * @param {Nutricionista} nutricionista - O objeto Nutricionista a ser salvo.
   */
  async salvar(nutricionista) {
    // TODO: Implementar a lógica de inserção no banco de dados.
  }

  /**
   * Busca uma nutricionista por seu ID.
   * @param {number} id - O ID da nutricionista.
   * @returns {Nutricionista} O objeto Nutricionista encontrado.
   */
  async buscarPorId(id) {
    // TODO: Implementar a lógica de busca no banco de dados.
  }

  /**
   * Busca uma nutricionista por seu e-mail.
   * @param {string} email - O e-mail da nutricionista.
   * @returns {Nutricionista} O objeto Nutricionista encontrado.
   */
  async buscarPorEmail(email) {
    // TODO: Implementar a lógica de busca no banco de dados.
  }
}

module.exports = new NutricionistaRepository();