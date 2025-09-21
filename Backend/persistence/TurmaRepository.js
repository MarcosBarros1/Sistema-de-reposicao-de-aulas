// persistence/TurmaRepository.js

const db = require('../config/db');

class TurmaRepository {
  async criar(dados_turma) {
    const { nome, semestre, matriculas_alunos } = dados_turma;
    const client = await db.pool.connect();

    try {
      await client.query('BEGIN');

      const turma_sql = `INSERT INTO turma (nome, semestre) VALUES ($1, $2) RETURNING *;`;
      const result_turma = await client.query(turma_sql, [nome, semestre]);
      const nova_turma = result_turma.rows[0];

      if (matriculas_alunos && matriculas_alunos.length > 0) {
        for (const matricula_aluno of matriculas_alunos) {
          const aluno_turma_sql = `INSERT INTO aluno_turma (id_turma, matricula_aluno) VALUES ($1, $2)`;
          await client.query(aluno_turma_sql, [nova_turma.id_turma, matricula_aluno]);
        }
      }

      await client.query('COMMIT');

      // --- CORREÇÃO DO PROBLEMA #1 ---
      // Após criar, busca a turma completa para retornar ao frontend
      return await this.buscarPorId(nova_turma.id_turma);

    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Erro ao criar turma:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  async buscarPorId(id_turma) {
    const sql = `
      SELECT
        t.id_turma, t.nome, t.semestre,
        COALESCE(
          json_agg(json_build_object('matricula_aluno', a.matricula_aluno, 'nome', u.nome)) FILTER (WHERE u.id_usuario IS NOT NULL),
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

  async buscarTodas() {
    const sql = `
      SELECT
        t.id_turma, t.nome, t.semestre,
        COALESCE(
          json_agg(json_build_object('matricula_aluno', a.matricula_aluno, 'nome', u.nome)) FILTER (WHERE u.id_usuario IS NOT NULL),
          '[]'
        ) as alunos
      FROM turma t
      LEFT JOIN aluno_turma at ON t.id_turma = at.id_turma
      LEFT JOIN aluno a ON at.matricula_aluno = a.matricula_aluno
      LEFT JOIN usuario u ON a.id_usuario = u.id_usuario
      GROUP BY t.id_turma
      ORDER BY t.nome;
    `;
    const result = await db.query(sql);
    return result.rows;
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
    const client = await db.pool.connect();
    try {
      // Usamos uma transação para garantir que todas as deleções ocorram ou nenhuma ocorra
      await client.query('BEGIN');

      // 1. Remover dependências em 'assinatura_solicitacao' (via 'solicitacao_reposicao')
      // Deleta todas as assinaturas que pertencem a solicitações da turma que será removida
      await client.query('DELETE FROM assinatura_solicitacao WHERE id_solicitacao IN (SELECT id_solicitacao FROM solicitacao_reposicao WHERE id_turma = $1)', [id_turma]);

      // 2. Remover dependências em 'solicitacao_reposicao'
      await client.query('DELETE FROM solicitacao_reposicao WHERE id_turma = $1', [id_turma]);

      // 3. Remover dependências em 'aluno_turma'
      await client.query('DELETE FROM aluno_turma WHERE id_turma = $1', [id_turma]);

      // 4. Finalmente, remover a turma em si
      const result = await client.query('DELETE FROM turma WHERE id_turma = $1', [id_turma]);

      await client.query('COMMIT');
      return result.rowCount > 0;
    } catch (error) {
      await client.query('ROLLBACK');
      console.error(`Erro ao remover turma ${id_turma}:`, error);
      throw error;
    } finally {
      client.release();
    }
  }

  async atualizar(id_turma, dados_turma) {
    const { nome, semestre, matriculas_alunos } = dados_turma;
    const client = await db.pool.connect();
    try {
      await client.query('BEGIN');

      // 1. Atualiza os dados principais da turma na tabela 'turma'
      await client.query('UPDATE turma SET nome = $1, semestre = $2 WHERE id_turma = $3', [nome, semestre, id_turma]);

      // 2. Limpa TODAS as associações antigas de alunos para esta turma
      await client.query('DELETE FROM aluno_turma WHERE id_turma = $1', [id_turma]);

      // 3. Insere as NOVAS associações de alunos que vieram do formulário
      if (matriculas_alunos && matriculas_alunos.length > 0) {
        for (const matricula_aluno of matriculas_alunos) {
          const aluno_turma_sql = `INSERT INTO aluno_turma (id_turma, matricula_aluno) VALUES ($1, $2)`;
          await client.query(aluno_turma_sql, [id_turma, matricula_aluno]);
        }
      }

      await client.query('COMMIT');

      // 4. Retorna a turma completa e atualizada, incluindo a nova lista de alunos
      return await this.buscarPorId(id_turma);

    } catch (error) {
      await client.query('ROLLBACK');
      console.error(`Erro ao atualizar turma ${id_turma}:`, error);
      throw error;
    } finally {
      client.release();
    }
  }
}

module.exports = new TurmaRepository();