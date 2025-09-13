// persistence/UsuarioRepository.js

const db = require('../config/db');
const Usuario = require('../model/Usuario');

/**
 * Classe Repository para acesso aos dados da tabela 'usuario'.
 * Lida com todas as operações de CRUD para a entidade genérica Usuario.
 */
class UsuarioRepository {

  /**
   * Salva um novo usuário na tabela 'usuario'.
   * @param {object} usuarioData - Um objeto com { nome, email, tipo }.
   * @param {object} [client=null] - Um cliente de banco de dados opcional para uso em transações.
   * @returns {Promise<Usuario>} O objeto Usuario que foi salvo, com o ID gerado pelo banco.
   */
  async salvar(usuarioData, client = null) {
    // Permite que o método seja usado dentro de uma transação externa ou de forma autônoma.
    const dbConnection = client || db;
    const { nome, email, tipo } = usuarioData;
    try {
      const sql = 'INSERT INTO usuario (nome, email, tipo) VALUES ($1, $2, $3) RETURNING id_usuario, nome, email, tipo';
      const params = [nome, email, tipo];
      
      const result = await dbConnection.query(sql, params);
      const row = result.rows[0];

      return new Usuario(row.id_usuario, row.nome, row.email, row.tipo);
    } catch (error) {
      console.error('Erro ao salvar usuário:', error);
      throw error;
    }
  }

  /**
   * Busca um usuário pelo seu ID.
   * @param {number} id - O ID do usuário.
   * @returns {Promise<Usuario|null>} O objeto Usuario encontrado, ou null se não for encontrado.
   */
  async buscarPorId(id) {
    try {
      const sql = 'SELECT id_usuario, nome, email, tipo FROM usuario WHERE id_usuario = $1';
      const result = await db.query(sql, [id]);

      if (result.rows.length > 0) {
        const row = result.rows[0];
        return new Usuario(row.id_usuario, row.nome, row.email, row.tipo);
      }
      return null;
    } catch (error) {
      console.error(`Erro ao buscar usuário por ID ${id}:`, error);
      throw error;
    }
  }
  
  /**
   * Busca um usuário pelo seu email.
   * @param {string} email - O email do usuário.
   * @returns {Promise<Usuario|null>} O objeto Usuario encontrado, ou null se não for encontrado.
   */
  async buscarPorEmail(email) {
    try {
      const sql = 'SELECT id_usuario, nome, email, tipo FROM usuario WHERE email = $1';
      const result = await db.query(sql, [email]);

      if (result.rows.length > 0) {
        const row = result.rows[0];
        return new Usuario(row.id_usuario, row.nome, row.email, row.tipo);
      }
      return null;
    } catch (error) {
      console.error(`Erro ao buscar usuário por email ${email}:`, error);
      throw error;
    }
  }

  /**
   * Atualiza os dados de um usuário existente.
   * @param {number} id - O ID do usuário a ser atualizado.
   * @param {object} usuarioData - O objeto com os dados { nome, email, tipo } a serem atualizados.
   * @returns {Promise<Usuario|null>} O objeto Usuario com os dados atualizados, ou null se não for encontrado.
   */
  async atualizar(id, usuarioData) {
    const { nome, email, tipo } = usuarioData;
    try {
      const sql = 'UPDATE usuario SET nome = $1, email = $2, tipo = $3 WHERE id_usuario = $4 RETURNING id_usuario, nome, email, tipo';
      const params = [nome, email, tipo, id];
      const result = await db.query(sql, params);

      if (result.rows.length > 0) {
        const row = result.rows[0];
        return new Usuario(row.id_usuario, row.nome, row.email, row.tipo);
      }
      return null;
    } catch (error) {
      console.error(`Erro ao atualizar usuário com ID ${id}:`, error);
      throw error;
    }
  }
}

module.exports = new UsuarioRepository();