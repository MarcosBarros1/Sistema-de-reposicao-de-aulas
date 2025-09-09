// persistence/CoordenadorRepository.js

const db = require('./db');
const Coordenador = require('../models/Coordenador');

/**
 * Classe Repository para acesso aos dados da entidade Coordenador.
 * Implementa métodos para salvar e buscar coordenadores no banco de dados.
 */
class CoordenadorRepository {
  /**
   * Salva um novo coordenador no banco de dados.
   * @param {Coordenador} coordenador - O objeto Coordenador a ser salvo.
   */
  async salvar(coordenador) {
    // TODO: Implementar a lógica de inserção no banco de dados.
    // Exemplo: INSERT INTO coordenadores (matriculaCoordenador, departamento) VALUES (?, ?)
  }

  /**
   * Busca um coordenador por sua matrícula.
   * @param {string} matricula - A matrícula do coordenador.
   * @returns {Coordenador} O objeto Coordenador encontrado.
   */
  async buscarPorMatricula(matricula) {
    // TODO: Implementar a lógica de busca no banco de dados.
  }
}

module.exports = new CoordenadorRepository();