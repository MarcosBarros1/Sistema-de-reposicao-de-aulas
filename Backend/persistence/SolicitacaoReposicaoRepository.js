// persistence/SolicitacaoReposicaoRepository.js

const db = require('../config/db');
const SolicitacaoReposicao = require('../model/SolicitacaoReposicao');
const SolicitacaoStatus = require('../constants/SolicitacaoStatus');

/**
 * Classe Repository para acesso aos dados da entidade SolicitacaoReposicao.
 */
class SolicitacaoReposicaoRepository {
  /**
   * Salva uma nova solicitação de reposição no banco de dados.
   * @param {SolicitacaoReposicao} solicitacao - O objeto SolicitacaoReposicao a ser salvo.
   * @returns {Promise<SolicitacaoReposicao>}
   */
  async salvar(solicitacao) {
    const query = `
      INSERT INTO solicitacao_reposicao (motivo, status, data, horario, sala, qt_alunos, id_turma, matricula_professor)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING id_solicitacao, motivo, status, data, horario, sala, qt_alunos, id_turma, matricula_professor AS id_professor;
    `;

    const values = [
      solicitacao.motivo,
      solicitacao.status || SolicitacaoStatus.PENDENTE, // padrão inicial
      solicitacao.data,
      solicitacao.horario,
      solicitacao.sala,
      solicitacao.qt_alunos,
      solicitacao.idTurma,
      solicitacao.idProfessor
    ];

    const result = await db.query(query, values);
    return SolicitacaoReposicao.fromDatabase(result.rows[0]);
  }

  /**
   * Atualiza o status de uma solicitação.
   * @param {number} id - O ID da solicitação.
   * @param {string} status - O novo status.
   * @returns {Promise<SolicitacaoReposicao|null>}
   */
  async atualizarStatus(id, status) {
    const statusPermitidos = Object.values(SolicitacaoStatus);
    if (!statusPermitidos.includes(status)) {
      throw new Error(`Status inválido: ${status}`);
    }

    const query = `
      UPDATE solicitacao_reposicao
      SET status = $1
      WHERE id_solicitacao = $2
      RETURNING *;
    `;

    const result = await db.query(query, [status, id]);

    if (result.rows.length === 0) {
      return null;
    }

    return SolicitacaoReposicao.fromDatabase(result.rows[0]);
  }

  /**
   * Busca uma solicitação por seu ID.
   * @param {number} id - O ID da solicitação.
   * @returns {Promise<SolicitacaoReposicao|null>}
   */
  async buscarPorId(id) {
    const query = `
      SELECT *
      FROM solicitacao_reposicao
      WHERE id_solicitacao = $1;
    `;

    const result = await db.query(query, [id]);

    if (result.rows.length === 0) {
      return null;
    }

    return SolicitacaoReposicao.fromDatabase(result.rows[0]);
  }

  /**
   * Lista todas as solicitações, incluindo o nome da turma.
   * @returns {Promise<Object[]>}
   */
  async listarTodos() {
    // ✅ SQL CORRIGIDO: Adicionamos o JOIN com a tabela 'turma'
    const query = `
      SELECT 
        sr.*, 
        t.nome AS nome_turma 
      FROM 
        solicitacao_reposicao sr
      JOIN 
        turma t ON sr.id_turma = t.id_turma
      ORDER BY 
        sr.data DESC;
    `;
    const result = await db.query(query);

    // ✅ RETORNO CORRIGIDO: Retornando as linhas brutas com o nome da turma
    return result.rows;
  }

  async atualizarContagemAlunos(id_solicitacao, novaContagem) {
    try {
      const sql = `
        UPDATE solicitacao_reposicao 
        SET qt_alunos = $1 
        WHERE id_solicitacao = $2;
      `;
      await db.query(sql, [novaContagem, id_solicitacao]);
    } catch (error) {
      console.error(`Erro ao ATUALIZAR contador para solicitação ${id_solicitacao}:`, error);
      throw error;
    }
  }

  async buscar_pendentes_aprovacao() {
    try {
      const sql = `
        SELECT 
          sr.id_solicitacao,
          sr.motivo,
          sr.status,
          sr.data,
          u.nome AS nome_professor,
          t.nome AS nome_turma
        FROM solicitacao_reposicao sr
        JOIN professor p ON sr.matricula_professor = p.matricula_professor
        JOIN usuario u ON p.id_usuario = u.id_usuario
        JOIN turma t ON sr.id_turma = t.id_turma
        WHERE sr.status = 'AGUARDANDO_APROVACAO'
        ORDER BY sr.data ASC;
      `;
      const result = await db.query(sql);
      return result.rows;
    } catch (error) {
      console.error('Erro ao buscar solicitações pendentes de aprovação:', error);
      throw error;
    }
  }

  async buscar_autorizadas() {
    try {
      // Adicionamos a condição "sr.data < NOW()" para pegar apenas aulas cuja data já passou
      const sql = `
        SELECT 
          sr.id_solicitacao,
          sr.motivo,
          sr.status,
          sr.data,
          t.nome AS nome_turma
        FROM solicitacao_reposicao sr
        JOIN turma t ON sr.id_turma = t.id_turma
        WHERE sr.status = 'AUTORIZADA' AND sr.data <= NOW()
        ORDER BY sr.data DESC;
      `;
      const result = await db.query(sql);
      return result.rows;
    } catch (error) {
      console.error('Erro ao buscar solicitações autorizadas:', error);
      throw error;
    }
  }

  /**
   * Busca todas as solicitações de reposição de um professor específico.
   * @param {number} matriculaProfessor
   * @returns {Promise<any[]>}
   */
  async listarPorProfessor(matriculaProfessor) {
    const query = `
      SELECT 
        sr.*, 
        t.nome AS nome_turma 
      FROM solicitacao_reposicao sr
      LEFT JOIN turma t ON sr.id_turma = t.id_turma
      WHERE sr.matricula_professor = $1
      ORDER BY sr.data DESC;
    `;
    try {
      const { rows } = await db.query(query, [matriculaProfessor]);
      // Note que aqui não usamos o 'fromDatabase' pois o frontend precisa do nome_turma também
      return rows;
    } catch (error) {
      console.error('Erro ao buscar reposições por professor no repositório:', error);
      throw error;
    }
  }

  /**
   * Lista todas as solicitações de um professor específico.
   * @param {number} matriculaProfessor - A matrícula do professor.
   * @returns {Promise<Object[]>}
   */
  async buscarPorProfessor(matriculaProfessor) {
    const query = `
      SELECT 
        sr.id_solicitacao,
        sr.motivo,
        sr.status,
        sr.data,
        sr.horario,
        sr.sala,
        sr.qt_alunos,
        t.nome AS nome_turma 
      FROM 
        solicitacao_reposicao sr
      JOIN 
        turma t ON sr.id_turma = t.id_turma
      WHERE 
        sr.matricula_professor = $1
      ORDER BY 
        sr.data DESC;
    `;
    const result = await db.query(query, [matriculaProfessor]);
    return result.rows;
  }

}

module.exports = new SolicitacaoReposicaoRepository();
