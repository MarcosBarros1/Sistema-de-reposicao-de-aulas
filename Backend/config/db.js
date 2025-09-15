// config/db.js
// Padrão Singleton

require('dotenv').config();
const { Pool } = require('pg');

class Database {
  constructor() {
    if (!Database.instance) {
      
      this.pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: {
          rejectUnauthorized: false
        }
      });

      console.log('Pool de conexões com o PostgreSQL inicializado.');
      Database.instance = this;
    }
    return Database.instance;
  }

  async query(sql, params) {
    try {
      const result = await this.pool.query(sql, params);
      return result;
    } catch (error) {
      console.error('Erro ao executar a query:', { sql, params, error });
      throw error;
    }
  }
}

module.exports = new Database();