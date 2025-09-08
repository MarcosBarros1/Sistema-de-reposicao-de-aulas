// Classe responsável por representar uma Disciplina
class Disciplina {
  /**
   * @param {number} idDisciplina
   * @param {string} codigo
   * @param {string} nome
   * @param {number} cargaHoraria
   * @param {number[]} professores - Lista de IDs dos professores que ministram a disciplina.
   */
  constructor(idDisciplina, codigo, nome, cargaHoraria, professores) {
    this.idDisciplina = idDisciplina;
    this.codigo = codigo;
    this.nome = nome;
    this.cargaHoraria = cargaHoraria;
    this.professores = professores;
  }

  // Método para atualizar os dados da disciplina
  atualizarDados(novosDados) {
    // TODO: Implementar lógica de atualização
  }
}

module.exports = Disciplina;