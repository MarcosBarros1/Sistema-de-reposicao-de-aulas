// persistence/DisciplinaRepository.js

const db = require('../config/db');
const Disciplina = require('../model/Disciplina');

/**
 * Classe Repository para acesso aos dados da entidade Disciplina.
 */
class DisciplinaRepository {
  /**
   * Salva uma nova disciplina no banco de dados.
   * @param {Disciplina} disciplina - O objeto Disciplina a ser salvo.
   * @returns {Promise<Disciplina>}
   */
  async salvar(disciplina) {
    const query = `
      INSERT INTO disciplina (codigo, nome, carga_horaria)
      VALUES ($1, $2, $3)
      RETURNING id_disciplina
    `;
    const values = [disciplina.codigo, disciplina.nome, disciplina.cargaHoraria];
    const result = await db.query(query, values);

    disciplina.idDisciplina = result.rows[0].id_disciplina;

    // se tiver professores vinculados, insere na tabela professor_disciplina
    if (disciplina.professores && disciplina.professores.length > 0) {
      for (const matriculaProfessor of disciplina.professores) {
        await db.query(
          `INSERT INTO professor_disciplina (id_disciplina, matricula_professor) VALUES ($1, $2)`,
          [disciplina.idDisciplina, matriculaProfessor]
        );
      }
    }

    return disciplina;
  }

  /**
   * Busca uma disciplina por seu código.
   * @param {string} codigo - O código da disciplina.
   * @returns {Promise<Disciplina|null>}
   */
  async buscarPorCodigo(codigo) {
    const query = `
      SELECT d.id_disciplina, d.codigo, d.nome, d.carga_horaria,
             ARRAY_REMOVE(ARRAY_AGG(pd.matricula_professor), NULL) AS professores
      FROM disciplina d
      LEFT JOIN professor_disciplina pd ON d.id_disciplina = pd.id_disciplina
      WHERE d.codigo = $1
      GROUP BY d.id_disciplina
    `;
    const result = await db.query(query, [codigo]);

    if (result.rows.length === 0) {
      return null;
    }

    const row = result.rows[0];
    return new Disciplina(
      row.id_disciplina,
      row.codigo,
      row.nome,
      row.carga_horaria,
      row.professores || []
    );
  }

  /**
   * Lista todas as disciplinas
   * @returns {Promise<Disciplina[]>}
   */
  async listarTodos() {
    const query = `
      SELECT d.id_disciplina, d.codigo, d.nome, d.carga_horaria,
             ARRAY_REMOVE(ARRAY_AGG(pd.matricula_professor), NULL) AS professores
      FROM disciplina d
      LEFT JOIN professor_disciplina pd ON d.id_disciplina = pd.id_disciplina
      GROUP BY d.id_disciplina
      ORDER BY d.nome
    `;
    const result = await db.query(query);

    return result.rows.map(row => new Disciplina(
      row.id_disciplina,
      row.codigo,
      row.nome,
      row.carga_horaria,
      row.professores || []
    ));
  }

  /**
   * Verifica se todos os IDs de disciplina fornecidos existem no banco.
   * @param {number[]} ids - Um array de IDs de disciplinas.
   * @returns {Promise<boolean>} Retorna true se todos existirem, false caso contrário.
   */
  async verificarExistenciaPorIds(ids) {
    if (!ids || ids.length === 0) {
      return true; // Se não há IDs para verificar, consideramos válido.
    }
    // A cláusula '= ANY($1::int[])' é uma forma eficiente no PostgreSQL
    // de verificar se um valor está presente em um array.
    const query = `
      SELECT COUNT(id_disciplina) AS count
      FROM disciplina
      WHERE id_disciplina = ANY($1::int[])
    `;
    
    const result = await db.query(query, [ids]);
    const count = parseInt(result.rows[0].count, 10);
    
    return count === ids.length;
  }
}


module.exports = new DisciplinaRepository();
