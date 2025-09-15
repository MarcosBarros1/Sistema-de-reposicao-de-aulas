// persistence/AlunoRepository.js
const db = require('../config/db');
const UsuarioRepository = require('./UsuarioRepository');
const Aluno = require('../model/Aluno');

class AlunoRepository {
  async salvar(alunoData) {
    const { nome, email, matricula_aluno, turmas } = alunoData;
    const client = await db.pool.connect();

    try {
      await client.query('BEGIN');

      // 1. Cria entrada na tabela 'usuario'
      const usuarioSalvo = await UsuarioRepository.salvar(
        { nome, email, tipo: 'Aluno' },
        client
      );

      // 2. Cria entrada na tabela 'aluno'
      const alunoSql = `
        INSERT INTO aluno (matricula_aluno, id_usuario)
        VALUES ($1, $2)
        RETURNING matricula_aluno
      `;
      const alunoResult = await client.query(alunoSql, [
        matricula_aluno,
        usuarioSalvo.idUsuario,
      ]);
      const matriculaAluno = alunoResult.rows[0].matricula_aluno;


      // 3. Relaciona aluno às turmas (se houver)
      if (turmas && turmas.length > 0) {
        for (const id_turma of turmas) {
          await client.query(
            `INSERT INTO aluno_turma (id_turma, matricula_aluno) VALUES ($1, $2)`,
            [id_turma, matriculaAluno]
          );
        }
      }


      await client.query('COMMIT');

      return new Aluno(usuarioSalvo.idUsuario, nome, email, matricula_aluno, turmas);
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Erro ao salvar aluno (transação revertida):', error);
      throw new Error('Falha ao salvar aluno. A operação foi revertida.');
    } finally {
      client.release();
    }
  }

  async buscarPorMatricula(matricula_aluno) {
    // CORREÇÃO: Removida a coluna "a.id_aluno" do SELECT, pois ela não existe na tabela "aluno".
    const sql = `
      SELECT a.matricula_aluno, u.id_usuario, u.nome, u.email, u.tipo
      FROM aluno a
      JOIN usuario u ON a.id_usuario = u.id_usuario
      WHERE a.matricula_aluno = $1
    `;
    
    // A conexão com o banco aqui deveria usar o pool, assim como no método salvar.
    // Vou usar db.query por simplicidade, mas o ideal é usar o pool.
    const result = await db.query(sql, [matricula_aluno]);

    if (result.rows.length === 0) {
      return null;
    }

    const row = result.rows[0];
    // OBS: Note que aqui estamos retornando as turmas como um array vazio.
    // Para buscar as turmas do aluno, a query precisaria ser mais complexa (veja sugestão de melhoria no final).
    return new Aluno(row.id_usuario, row.nome, row.email, row.matricula_aluno, []);
  }
}

module.exports = new AlunoRepository();
