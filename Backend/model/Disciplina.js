// model/Disciplina.js

/**
 * Classe responsável por representar uma Disciplina
 */
class Disciplina {
  /**
   * @param {number} idDisciplina - Identificador único da disciplina
   * @param {string} codigo - Código da disciplina (ex: MAT101)
   * @param {string} nome - Nome da disciplina
   * @param {number} cargaHoraria - Carga horária da disciplina
   * @param {number[]} professores - Lista de matrículas dos professores que ministram a disciplina
   */
  constructor(idDisciplina, codigo, nome, cargaHoraria, professores = []) {
    this.idDisciplina = idDisciplina;
    this.codigo = codigo;
    this.nome = nome;
    this.cargaHoraria = cargaHoraria;
    this.professores = professores;
  }

  /**
   * Atualiza os dados da disciplina
   * @param {Object} novosDados - Objeto contendo dados a serem atualizados
   */
  atualizarDados(novosDados) {
    if (novosDados.codigo) this.codigo = novosDados.codigo;
    if (novosDados.nome) this.nome = novosDados.nome;
    if (novosDados.cargaHoraria) this.cargaHoraria = novosDados.cargaHoraria;
    if (Array.isArray(novosDados.professores)) {
      this.professores = novosDados.professores;
    }
  }
}

module.exports = Disciplina;
