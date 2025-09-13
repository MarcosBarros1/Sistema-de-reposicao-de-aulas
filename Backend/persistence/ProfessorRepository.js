// persistence/ProfessorRepository.js

const db = require('../config/db');
const UsuarioRepository = require('./UsuarioRepository');
const Professor = require('../model/Professor');

/**
 * Classe Repository para acesso aos dados da entidade Professor.
 * Orquestra operações nas tabelas 'usuario', 'professor' e 'professor_disciplina'.
 */
class ProfessorRepository {

  /**
   * Salva um novo professor no banco de dados de forma transacional.
   * @param {object} professorData - Dados do professor: { nome, email, matricula, senha, disciplinas (array de IDs) }.
   * @returns {Promise<Professor>} O objeto Professor que foi salvo.
   */
  async salvar(professorData) {
    const { nome, email, matricula, senha, disciplinas } = professorData;
    const client = await db.pool.connect();

    try {
      await client.query('BEGIN');

      // 1. Cria a entrada na tabela 'usuario' reutilizando o UsuarioRepository
      const usuarioSalvo = await UsuarioRepository.salvar({ nome, email, tipo: 'Professor' }, client);

      // 2. Insere na tabela 'professor' usando o id_usuario retornado
      const professorSql = 'INSERT INTO professor (matricula_professor, id_usuario, senha) VALUES ($1, $2, $3)';
      await client.query(professorSql, [matricula, usuarioSalvo.idUsuario, senha]);
      
      // 3. Insere as associações na tabela 'professor_disciplina'
      if (disciplinas && disciplinas.length > 0) {
        for (const idDisciplina of disciplinas) {
          const profDiscSql = 'INSERT INTO professor_disciplina (id_disciplina, matricula_professor) VALUES ($1, $2)';
          await client.query(profDiscSql, [idDisciplina, matricula]);
        }
      }

      await client.query('COMMIT');
      return new Professor(usuarioSalvo.idUsuario, nome, email, matricula, senha, disciplinas);

    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Erro ao salvar professor (transação revertida):', error);
      throw new Error('Falha ao salvar professor. A operação foi revertida.');
    } finally {
      client.release();
    }
  }

  /**
   * Busca um professor por sua matrícula, juntando dados do usuário e disciplinas.
   * @param {number} matricula - A matrícula do professor.
   * @returns {Promise<Professor|null>} O objeto Professor encontrado ou null.
   */
  async buscarPorMatricula(matricula) {
    try {
      const sql = `
        SELECT
          u.id_usuario, u.nome, u.email,
          p.matricula_professor, p.senha,
          COALESCE(array_agg(pd.id_disciplina) FILTER (WHERE pd.id_disciplina IS NOT NULL), '{}') AS disciplinas
        FROM professor p
        JOIN usuario u ON p.id_usuario = u.id_usuario
        LEFT JOIN professor_disciplina pd ON p.matricula_professor = pd.matricula_professor
        WHERE p.matricula_professor = $1
        GROUP BY u.id_usuario, p.matricula_professor;
      `;
      
      const result = await db.query(sql, [matricula]);

      if (result.rows.length > 0) {
        const row = result.rows[0];
        return new Professor(row.id_usuario, row.nome, row.email, row.matricula_professor, row.senha, row.disciplinas);
      }
      return null;
    } catch (error) {
      console.error(`Erro ao buscar professor por matrícula ${matricula}:`, error);
      throw error;
    }
  }
}

module.exports = new ProfessorRepository();