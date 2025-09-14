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
    const sql = `
      INSERT INTO alunos (matriculaAluno, idUsuario)
      VALUES (?, ?)
    `;
    const params = [aluno.matriculaAluno, aluno.idUsuario];

    try {
      await db.run(sql, params);
      console.log(`Aluno ${aluno.nome} salvo com sucesso.`);
      return aluno;
    } catch (error) {
      console.error("Erro ao salvar aluno:", error);
      throw error;
    }
  }

  /**
   * Busca um aluno por sua matrícula.
   * @param {string} matricula - A matrícula do aluno.
   * @returns {Aluno|null} O objeto Aluno encontrado ou null.
   */
  async buscarPorMatricula(matricula) {
    const sql = `
      SELECT a.matriculaAluno, u.idUsuario, u.nome, u.email, u.senha
      FROM alunos a
      JOIN usuarios u ON u.idUsuario = a.idUsuario
      WHERE a.matriculaAluno = ?
    `;

    try {
      const row = await db.get(sql, [matricula]);

      if (!row) return null;

      // Retorna um objeto Aluno instanciado
      return new Aluno(
        row.idUsuario,
        row.nome,
        row.email,
        row.senha,
        row.matriculaAluno,
        [] // Turmas podem ser buscadas em outra query se necessário
      );
    } catch (error) {
      console.error("Erro ao buscar aluno:", error);
      throw error;
    }
  }
}

module.exports = new AlunoRepository();
