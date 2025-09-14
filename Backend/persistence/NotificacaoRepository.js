// persistence/NotificacaoRepository.js

const db = require('../config/db');
const Notificacao = require('../model/Notificacao');

class NotificacaoRepository {

  /**
   * Salva uma nova notificação no banco de dados.
   * @param {object} dadosNotificacao - Objeto com { mensagem, idDestinatario }.
   * @returns {Promise<Notificacao>} A notificação que foi criada.
   */
  async salvar(dadosNotificacao) {
    const { mensagem, idDestinatario } = dadosNotificacao;
    try {
      // As colunas data_envio e lida possuem valores padrão no banco de dados
      const sql = `
        INSERT INTO notificacao (mensagem, id_destinatario)
        VALUES ($1, $2)
        RETURNING id_notificacao, mensagem, data_envio, lida, id_destinatario;
      `;
      
      const result = await db.query(sql, [mensagem, idDestinatario]);
      const row = result.rows[0];
      
      return new Notificacao(row.id_notificacao, row.mensagem, row.data_envio, row.lida, row.id_destinatario);
    } catch (error) {
      console.error('Erro ao salvar notificação:', error);
      throw error;
    }
  }

  /**
   * Busca todas as notificações de um usuário específico.
   * @param {number} idDestinatario - O ID do usuário.
   * @returns {Promise<Notificacao[]>} Uma lista de notificações.
   */
  async buscarPorDestinatario(idDestinatario) {
    try {
      const sql = 'SELECT * FROM notificacao WHERE id_destinatario = $1 ORDER BY data_envio DESC';
      const result = await db.query(sql, [idDestinatario]);

      return result.rows.map(row => 
        new Notificacao(row.id_notificacao, row.mensagem, row.data_envio, row.lida, row.id_destinatario)
      );
    } catch (error) {
      console.error(`Erro ao buscar notificações para o usuário ${idDestinatario}:`, error);
      throw error;
    }
  }

  /**
   * Marca uma notificação específica como lida.
   * @param {number} idNotificacao - O ID da notificação.
   * @returns {Promise<Notificacao|null>} A notificação atualizada.
   */
  async marcarComoLida(idNotificacao) {
    try {
      const sql = 'UPDATE notificacao SET lida = TRUE WHERE id_notificacao = $1 RETURNING *';
      const result = await db.query(sql, [idNotificacao]);
      
      if (result.rows.length > 0) {
        const row = result.rows[0];
        return new Notificacao(row.id_notificacao, row.mensagem, row.data_envio, row.lida, row.id_destinatario);
      }
      return null;
    } catch (error) {
      console.error(`Erro ao marcar notificação ${idNotificacao} como lida:`, error);
      throw error;
    }
  }
}

module.exports = new NotificacaoRepository();