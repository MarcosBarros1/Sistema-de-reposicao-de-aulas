// model/Nutricionista.js

/**
 * Representa a entidade de um Nutricionista no sistema.
 */
class Nutricionista {
  /**
   * @param {number} id_nutricionista
   * @param {string} nome
   * @param {string} email
   */
  constructor(id_nutricionista, nome, email) {
    this.id_nutricionista = id_nutricionista;
    this.nome = nome;
    this.email = email;
  }
}

module.exports = Nutricionista;