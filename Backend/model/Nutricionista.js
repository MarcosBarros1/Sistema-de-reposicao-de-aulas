// Classe responsável por representar a Nutricionista
class Nutricionista {
  /**
   * @param {string} nome
   * @param {string} email
   * @param {string} idNutricionista - Identificador único da nutricionista.
   */
  constructor(nome, email, idNutricionista) {
    this.nome = nome;
    this.email = email;
    this.idNutricionista = idNutricionista;
  }
}

module.exports = Nutricionista;