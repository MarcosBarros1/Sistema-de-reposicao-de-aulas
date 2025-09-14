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

  /**
     * Busca um professor pelo seu email, juntando dados do usuário.
     * @param {string} email - O email do professor.
     * @returns {Promise<Professor|null>}
  */
  async buscarPorEmail(email) {
    try {
      const sql = `
        SELECT
          u.id_usuario, u.nome, u.email,
          p.matricula_professor, p.senha,
          COALESCE(array_agg(pd.id_disciplina) FILTER (WHERE pd.id_disciplina IS NOT NULL), '{}') AS disciplinas
        FROM professor p
        JOIN usuario u ON p.id_usuario = u.id_usuario
        LEFT JOIN professor_disciplina pd ON p.matricula_professor = pd.matricula_professor
        WHERE u.email = $1
        GROUP BY u.id_usuario, p.matricula_professor;
      `;
      const result = await db.query(sql, [email]);
      if (result.rows.length > 0) {
        const row = result.rows[0];
        return new Professor(row.id_usuario, row.nome, row.email, row.matricula_professor, row.senha, row.disciplinas);
      }
      return null;
    } catch (error) {
      console.error(`Erro ao buscar professor por email ${email}:`, error);
      throw error;
    }
  }

  /**
   * Lista todos os professores.
   * @returns {Promise<Professor[]>}
   */
  async buscarTodos() {
    try {
      const sql = `
        SELECT u.id_usuario, u.nome, u.email, p.matricula_professor, p.senha
        FROM professor p
        JOIN usuario u ON p.id_usuario = u.id_usuario
        ORDER BY u.nome;
      `;
      const result = await db.query(sql);
      return result.rows.map(row => new Professor(row.id_usuario, row.nome, row.email, row.matricula_professor, row.senha));
    } catch (error) {
      console.error('Erro ao buscar todos os professores:', error);
      throw error;
    }
  }

  /**
   * Atualiza os dados de um professor.
   * @param {number} matricula - Matrícula do professor a ser atualizado.
   * @param {object} dados - Dados a serem atualizados { nome, email }.
   * @returns {Promise<Professor|null>}
   */
  async atualizar(matricula, dados) {
    const client = await db.pool.connect();
    try {
      await client.query('BEGIN');
      const professorResult = await client.query('SELECT id_usuario FROM professor WHERE matricula_professor = $1', [matricula]);
      if (professorResult.rows.length === 0) {
        throw new Error('Professor não encontrado.');
      }
      const { id_usuario } = professorResult.rows[0];

      const usuarioAtualizado = await UsuarioRepository.atualizar(id_usuario, { nome: dados.nome, email: dados.email, tipo: 'Professor' }, client);

      await client.query('COMMIT');
      // Retornar um objeto Professor completo após a atualização
      return await this.buscarPorMatricula(matricula);
    } catch (error) {
      await client.query('ROLLBACK');
      console.error(`Erro ao atualizar professor com matrícula ${matricula}:`, error);
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Deleta um professor pela matrícula.
   * @param {number} matricula - Matrícula do professor a ser deletado.
   * @returns {Promise<boolean>} Retorna true se a deleção foi bem-sucedida.
   */
  async deletarPorMatricula(matricula) {
    const client = await db.pool.connect();
    try {
      await client.query('BEGIN');
      const professorResult = await client.query('SELECT id_usuario FROM professor WHERE matricula_professor = $1', [matricula]);
      if (professorResult.rows.length === 0) {
        return false; // Professor não encontrado
      }
      const { id_usuario } = professorResult.rows[0];

      // Deletar da tabela professor (o CASCADE no banco pode cuidar disso, mas é mais seguro ser explícito)
      await client.query('DELETE FROM professor_disciplina WHERE matricula_professor = $1', [matricula]);
      await client.query('DELETE FROM professor WHERE matricula_professor = $1', [matricula]);

      // Deletar da tabela usuario
      await client.query('DELETE FROM usuario WHERE id_usuario = $1', [id_usuario]);

      await client.query('COMMIT');
      return true;
    } catch (error) {
      await client.query('ROLLBACK');
      console.error(`Erro ao deletar professor com matrícula ${matricula}:`, error);
      throw error;
    } finally {
      client.release();
    }
  }
}

module.exports = new ProfessorRepository();