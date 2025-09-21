// persistence/TurmaRepository.js

const db = require('../config/db');
// const Turma = require('../model/Turma'); // O modelo não é estritamente necessário aqui

class TurmaRepository {
  async criar(turmaData) {
    // CORREÇÃO: Recebe 'semestre' e insere apenas 'nome' e 'semestre'.
    const { nome, semestre } = turmaData;
    const sql = `
      INSERT INTO turma (nome, semestre)
      VALUES ($1, $2)
      RETURNING *;
    `;
    const result = await db.query(sql, [nome, semestre]);
    return result.rows[0];
  }

  async buscarPorId(id_turma) {
    // CORREÇÃO: Removido o JOIN com a tabela 'disciplina', pois não há como relacioná-las.
    const sql = `
      SELECT
        t.id_turma, t.nome, t.semestre,
        COALESCE(
          json_agg(json_build_object('matricula_aluno', u.id_usuario, 'nome', u.nome)) FILTER (WHERE u.id_usuario IS NOT NULL),
          '[]'
        ) as alunos
      FROM turma t
      LEFT JOIN aluno_turma at ON t.id_turma = at.id_turma
      LEFT JOIN aluno a ON at.matricula_aluno = a.matricula_aluno
      LEFT JOIN usuario u ON a.id_usuario = u.id_usuario
      WHERE t.id_turma = $1
      GROUP BY t.id_turma;
    `;
    const result = await db.query(sql, [id_turma]);
    return result.rows[0];
  }

  // NOVO MÉTODO
  async buscarTodas() {
    // A query é muito parecida com a de buscarPorId, mas sem o "WHERE"
    // para que traga todas as turmas.
    const sql = `
      SELECT
        t.id_turma, t.nome, t.semestre,
        COALESCE(
          json_agg(json_build_object('matricula_aluno', u.id_usuario, 'nome', u.nome)) FILTER (WHERE u.id_usuario IS NOT NULL),
          '[]'
        ) as alunos
      FROM turma t
      LEFT JOIN aluno_turma at ON t.id_turma = at.id_turma
      LEFT JOIN aluno a ON at.matricula_aluno = a.matricula_aluno
      LEFT JOIN usuario u ON a.id_usuario = u.id_usuario
      GROUP BY t.id_turma
      ORDER BY t.nome; -- Opcional: ordenar as turmas por nome
    `;
    const result = await db.query(sql);
    return result.rows; // Retorna um array com todas as turmas
  }

  /**
   * Busca todos os alunos (com matrícula, nome e email) associados a um ID de turma.
   * ESSENCIAL para a funcionalidade de notificação.
   * @param {number} idTurma - O ID da turma.
   * @returns {Promise<any[]>} Uma lista de objetos de alunos.
   */
  async buscarAlunosPorTurmaId(idTurma) {
    try {
      const sql = `
        SELECT a.matricula_aluno, u.nome, u.email
        FROM aluno_turma at
        JOIN aluno a ON at.matricula_aluno = a.matricula_aluno
        JOIN usuario u ON a.id_usuario = u.id_usuario
        WHERE at.id_turma = $1;
      `;
      const result = await db.query(sql, [idTurma]);
      return result.rows;
    } catch (error) {
      console.error(`Erro ao buscar alunos da turma ${idTurma}:`, error);
      throw error;
    }
  }

  // Os métodos adicionarAluno e removerAluno não precisam de alteração,
  // pois eles interagem com a tabela 'aluno_turma' que está correta.
  async adicionarAluno(id_turma, matricula_aluno) {
    const sql = `
      INSERT INTO aluno_turma (id_turma, matricula_aluno)
      VALUES ($1, $2);
    `;
    await db.query(sql, [id_turma, matricula_aluno]);
  }

  async removerAluno(id_turma, matricula_aluno) {
    const sql = `
      DELETE FROM aluno_turma
      WHERE id_turma = $1 AND matricula_aluno = $2;
    `;
    const result = await db.query(sql, [id_turma, matricula_aluno]);
    return result.rowCount > 0;
  }

    async remover(id_turma) {
    // Primeiro, removemos as associações na tabela aluno_turma
    await db.query('DELETE FROM aluno_turma WHERE id_turma = $1', [id_turma]);
    // Depois, removemos a turma
    const result = await db.query('DELETE FROM turma WHERE id_turma = $1', [id_turma]);
    return result.rowCount > 0;
  }
}

module.exports = new TurmaRepository();