// config/db.js
// Padrão Singleton

require('dotenv').config(); // Carrega as variáveis do arquivo .env
const { Pool } = require('pg'); // Importa o Pool do driver do PostgreSQL

class Database {
  constructor() {
    // Garante que a instância só seja criada uma vez (Padrão Singleton)
    if (!Database.instance) {
      // O Pool gerencia múltiplas conexões, o que é mais eficiente e seguro.
      this.pool = new Pool({
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_DATABASE,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT,
      });

      console.log('Pool de conexões com o PostgreSQL inicializado.');

      Database.instance = this;
    }
    return Database.instance;
  }

  /**
   * Executa uma query SQL no banco de dados.
   * @param {string} sql O comando SQL a ser executado.
   * @param {Array} params Os parâmetros para a query (para prevenir SQL Injection).
   * @returns {Promise<QueryResult>} O resultado da query.
   */
  async query(sql, params) {
    // Usamos o pool para pegar uma conexão disponível e executar o comando.
    try {
      const result = await this.pool.query(sql, params);
      return result;
    } catch (error) {
      // É uma boa prática logar o erro para facilitar a depuração.
      console.error('Erro ao executar a query:', { sql, params, error });
      throw error;
    }
  }
}

module.exports = new Database();