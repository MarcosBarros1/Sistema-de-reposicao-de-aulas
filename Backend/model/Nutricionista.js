// Classe responsável por representar a Nutricionista
// model/Nutricionista.js

class Nutricionista {
  constructor(id_nutricionista, nome, email) {
    this.id_nutricionista = id_nutricionista;
    this.nome = nome;
    this.email = email;
  }
}

module.exports = Nutricionista;