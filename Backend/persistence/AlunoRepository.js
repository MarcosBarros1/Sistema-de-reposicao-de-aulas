// persistence/AlunoRepository.js

const db = require('./db');
const Aluno = require('../models/Aluno');

/**
 * Classe Repository para acesso aos dados da entidade Aluno.
 * Implementa métodos para salvar e buscar alunos no banco de dados.
 */
class AlunoRepository {
  /**
   * Salva um novo aluno no banco de dados.
   * @param {Aluno} aluno - O objeto Aluno a ser salvo.
   */
  async salvar(aluno) {
    // TODO: Implementar a lógica de inserção no banco de dados.
    // Exemplo: INSERT INTO alunos (matriculaAluno, idUsuario) VALUES (?, ?)
  }

  /**
   * Busca um aluno por sua matrícula.
   * @param {string} matricula - A matrícula do aluno.
   * @returns {Aluno} O objeto Aluno encontrado.
   */
  async buscarPorMatricula(matricula) {
    // TODO: Implementar a lógica de busca no banco de dados.
  }
}

module.exports = new AlunoRepository();