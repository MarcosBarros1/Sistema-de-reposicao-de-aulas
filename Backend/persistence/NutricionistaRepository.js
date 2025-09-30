// persistence/NutricionistaRepository.js

// persistence/NutricionistaRepository.js

const db = require('../config/db');
const Nutricionista = require('../model/Nutricionista');

class NutricionistaRepository {
  async criar(dadosNutricionista) {
    const { nome, email } = dadosNutricionista;
    const sql = `
      INSERT INTO nutricionista (nome, email)
      VALUES ($1, $2)
      RETURNING *;
    `;
    const result = await db.query(sql, [nome, email]);
    return result.rows[0];
  }

  async atualizar(id_nutricionista, dadosNutricionista) {
    const { nome, email } = dadosNutricionista;
    const sql = `
      UPDATE nutricionista
      SET nome = $1, email = $2
      WHERE id_nutricionista = $3
      RETURNING *;
    `;
    const result = await db.query(sql, [nome, email, id_nutricionista]);
    return result.rows[0];
  }

  // Método auxiliar para o serviço validar se o ID existe antes de atualizar
  async buscarPorId(id_nutricionista) {
    const sql = `SELECT * FROM nutricionista WHERE id_nutricionista = $1`;
    const result = await db.query(sql, [id_nutricionista]);
    return result.rows[0];
  }

  // Método auxiliar para o serviço validar se o e-mail já está em uso
  async buscarPorEmail(email) {
    const sql = `SELECT * FROM nutricionista WHERE email = $1`;
    const result = await db.query(sql, [email]);
    return result.rows[0];
  }

  async buscar_todos() {
    try {
      const sql = 'SELECT * FROM nutricionista ORDER BY nome;';
      const result = await db.query(sql);
      return result.rows.map(row => new Nutricionista(row.id_nutricionista, row.nome, row.email));
    } catch (error) {
      console.error('Erro ao buscar nutricionistas:', error);
      throw error;
    }
  }
}

module.exports = new NutricionistaRepository();