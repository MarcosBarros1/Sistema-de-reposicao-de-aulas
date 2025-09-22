// persistence/AlunoRepository.js
const db = require('../config/db');
const UsuarioRepository = require('./UsuarioRepository');
const Aluno = require('../model/Aluno');

class AlunoRepository {
  async salvar(alunoData) {
    // Esta é a versão corrigida, sem a senha
    const { nome, email, matricula_aluno, id_turma } = alunoData;
    const client = await db.pool.connect();

    try {
      await client.query('BEGIN');

      const usuarioSalvo = await UsuarioRepository.salvar(
        { nome, email, tipo: 'Aluno' },
        client
      );

      const alunoSql = `
        INSERT INTO aluno (matricula_aluno, id_usuario)
        VALUES ($1, $2)
      `;
      await client.query(alunoSql, [
        matricula_aluno,
        usuarioSalvo.idUsuario,
      ]);

      if (id_turma) {
        const associacaoSql = `INSERT INTO aluno_turma (id_turma, matricula_aluno) VALUES ($1, $2)`;
        await client.query(associacaoSql, [id_turma, matricula_aluno]);
      }

      await client.query('COMMIT');

      return new Aluno(usuarioSalvo.idUsuario, nome, email, matricula_aluno, [id_turma]);
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Erro ao salvar aluno (transação revertida):', error);
      throw new Error('Falha ao salvar aluno. A operação foi revertida.');
    } finally {
      client.release();
    }
  }

  // 👇 SUA FUNÇÃO ORIGINAL RESTAURADA E COMPLETA 👇
  async buscarPorMatricula(matricula_aluno) {
    const sql = `
      SELECT a.matricula_aluno, u.id_usuario, u.nome, u.email, u.tipo
      FROM aluno a
      JOIN usuario u ON a.id_usuario = u.id_usuario
      WHERE a.matricula_aluno = $1
    `;
    
    const result = await db.query(sql, [matricula_aluno]);

    if (result.rows.length === 0) {
      return null;
    }

    const row = result.rows[0];
    return new Aluno(row.id_usuario, row.nome, row.email, row.matricula_aluno, []);
  }
}

module.exports = new AlunoRepository();