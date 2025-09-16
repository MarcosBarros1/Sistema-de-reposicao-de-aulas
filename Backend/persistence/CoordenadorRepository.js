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

  /**
   * Lista todos os coordenadores cadastrados.
   * @returns {Promise<Coordenador[]>}
   */
  async buscarTodos() {
    try {
      const sql = `
        SELECT u.id_usuario, u.nome, u.email, c.matricula_coordenador, c.senha, c.departamento
        FROM coordenador c
        JOIN usuario u ON c.id_usuario = u.id_usuario
        ORDER BY u.nome;
      `;
      const result = await db.query(sql);
      return result.rows.map(row => new Coordenador(
        row.id_usuario, row.nome, row.email, row.matricula_coordenador, row.senha, row.departamento
      ));
    } catch (error) {
      console.error('Erro ao buscar todos os coordenadores:', error);
      throw error;
    }
  }

  /**
   * Atualiza os dados de um coordenador (nome, email, departamento).
   * @param {number} matricula - Matrícula do coordenador.
   * @param {object} dados - Dados a serem atualizados { nome, email, departamento }.
   * @returns {Promise<Coordenador|null>}
   */
  async atualizar(matricula, dados) {
    const client = await db.pool.connect();
    try {
      await client.query('BEGIN');

      const coordenadorResult = await client.query('SELECT id_usuario FROM coordenador WHERE matricula_coordenador = $1', [matricula]);
      if (coordenadorResult.rows.length === 0) {
        throw new Error('Coordenador não encontrado.');
      }
      const { id_usuario } = coordenadorResult.rows[0];

      // Atualiza os dados na tabela 'usuario'
      await UsuarioRepository.atualizar(id_usuario, { nome: dados.nome, email: dados.email, tipo: 'Coordenador' }, client);

      // Atualiza o departamento na tabela 'coordenador'
      const coordSql = 'UPDATE coordenador SET departamento = $1 WHERE matricula_coordenador = $2';
      await client.query(coordSql, [dados.departamento, matricula]);

      await client.query('COMMIT');
      return await this.buscarPorMatricula(matricula);
    } catch (error) {
      await client.query('ROLLBACK');
      console.error(`Erro ao atualizar coordenador com matrícula ${matricula}:`, error);
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Deleta um coordenador pela matrícula.
   * @param {number} matricula - Matrícula do coordenador.
   * @returns {Promise<boolean>} Retorna true se a deleção foi bem-sucedida.
   */
  async deletarPorMatricula(matricula) {
    const client = await db.pool.connect();
    try {
      await client.query('BEGIN');
      const coordenadorResult = await client.query('SELECT id_usuario FROM coordenador WHERE matricula_coordenador = $1', [matricula]);
      if (coordenadorResult.rows.length === 0) {
        return false; // Não encontrado
      }
      const { id_usuario } = coordenadorResult.rows[0];

      // Deleta da tabela 'coordenador'
      await client.query('DELETE FROM coordenador WHERE matricula_coordenador = $1', [matricula]);

      // Deleta da tabela 'usuario'
      await client.query('DELETE FROM usuario WHERE id_usuario = $1', [id_usuario]);

      await client.query('COMMIT');
      return true;
    } catch (error) {
      await client.query('ROLLBACK');
      console.error(`Erro ao deletar coordenador com matrícula ${matricula}:`, error);
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Busca um coordenador (o primeiro que encontrar) para ser o destinatário de notificações.
   * Em um sistema real, aqui teríamos uma lógica mais complexa para achar o coordenador correto.
   * @returns {Promise<Coordenador|null>}
   */
  async buscarUmCoordenador() {
    try {
      // Pega o primeiro coordenador que encontrar na tabela de usuários
      const sql = `
        SELECT u.id_usuario, u.nome, u.email, c.matricula_coordenador, c.senha, c.departamento
        FROM coordenador c
        JOIN usuario u ON c.id_usuario = u.id_usuario
        LIMIT 1;
      `;
      const result = await db.query(sql);
      if (result.rows.length > 0) {
        const row = result.rows[0];
        return new Coordenador(row.id_usuario, row.nome, row.email, row.matricula_coordenador, row.senha, row.departamento);
      }
      return null;
    } catch (error) {
      console.error('Erro ao buscar um coordenador:', error);
      throw error;
    }
  }
}

module.exports = new CoordenadorRepository();