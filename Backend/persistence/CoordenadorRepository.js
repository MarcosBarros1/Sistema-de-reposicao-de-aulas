// persistence/CoordenadorRepository.js

const db = require('../config/db');
const UsuarioRepository = require('./UsuarioRepository');
const Coordenador = require('../model/Coordenador');

/**
 * Classe Repository para acesso aos dados da entidade Coordenador.
 */
class CoordenadorRepository {

  /**
   * Salva um novo coordenador no banco de dados de forma transacional.
   * @param {object} coordenadorData - Dados do coordenador: { nome, email, matricula, senha, departamento }.
   * @returns {Promise<Coordenador>} O objeto Coordenador que foi salvo.
   */
  async salvar(coordenadorData) {
    const { nome, email, matricula, senha, departamento } = coordenadorData;
    const client = await db.pool.connect();

    try {
      await client.query('BEGIN');

      // 1. Cria a entrada na tabela 'usuario'
      const usuarioSalvo = await UsuarioRepository.salvar({ nome, email, tipo: 'Coordenador' }, client);

      // 2. Insere na tabela 'coordenador'
      const coordenadorSql = 'INSERT INTO coordenador (matricula_coordenador, id_usuario, departamento, senha) VALUES ($1, $2, $3, $4)';
      await client.query(coordenadorSql, [matricula, usuarioSalvo.idUsuario, departamento, senha]);

      await client.query('COMMIT');
      return new Coordenador(usuarioSalvo.idUsuario, nome, email, matricula, senha, departamento);

    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Erro ao salvar coordenador (transação revertida):', error);
      throw new Error('Falha ao salvar coordenador. A operação foi revertida.');
    } finally {
      client.release();
    }
  }

  /**
   * Busca um coordenador por sua matrícula.
   * @param {number} matricula - A matrícula do coordenador.
   * @returns {Promise<Coordenador|null>} O objeto Coordenador encontrado ou null.
   */
  async buscarPorMatricula(matricula) {
    try {
      const sql = `
        SELECT
          u.id_usuario, u.nome, u.email,
          c.matricula_coordenador, c.senha, c.departamento
        FROM coordenador c
        JOIN usuario u ON c.id_usuario = u.id_usuario
        WHERE c.matricula_coordenador = $1;
      `;

      const result = await db.query(sql, [matricula]);

      if (result.rows.length > 0) {
        const row = result.rows[0];
        return new Coordenador(row.id_usuario, row.nome, row.email, row.matricula_coordenador, row.senha, row.departamento);
      }
      return null;
    } catch (error) {
      console.error(`Erro ao buscar coordenador por matrícula ${matricula}:`, error);
      throw error;
    }
  }

  /**
   * Busca um coordenador pelo seu email, juntando dados do usuário.
   * @param {string} email - O email do coordenador.
   * @returns {Promise<Coordenador|null>}
   */
  async buscarPorEmail(email) {
    try {
      const sql = `
        SELECT
          u.id_usuario, u.nome, u.email,
          c.matricula_coordenador, c.senha, c.departamento
        FROM coordenador c
        JOIN usuario u ON c.id_usuario = u.id_usuario
        WHERE u.email = $1;
      `;
      const result = await db.query(sql, [email]);
      if (result.rows.length > 0) {
        const row = result.rows[0];
        return new Coordenador(row.id_usuario, row.nome, row.email, row.matricula_coordenador, row.senha, row.departamento);
      }
      return null;
    } catch (error) {
      console.error(`Erro ao buscar coordenador por email ${email}:`, error);
      throw error;
    }
  }
}

module.exports = new CoordenadorRepository();