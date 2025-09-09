// persistence/ProfessorRepository.js

/**
 * Classe Repository para acesso aos dados da entidade Professor.
 * Implementa métodos para salvar e buscar professores no banco de dados.
 */
class ProfessorRepository {
  /**
   * Salva um novo professor no banco de dados.
   * @param {Object} professor - O objeto Professor a ser salvo.
   */
  async save(professor) {
    // TODO: Implementar a lógica de inserção no banco de dados.
  }

  /**
   * Busca um professor por sua matrícula.
   * @param {string} matricula - A matrícula do professor.
   * @returns {Object} O objeto Professor encontrado ou null.
   */
  async findByMatricula(matricula) {
    // TODO: Implementar a lógica de busca no banco de dados.
  }
}

module.exports = ProfessorRepository;