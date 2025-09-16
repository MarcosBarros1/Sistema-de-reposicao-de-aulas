// model/Notificacao.js

/**
 * Representa a entidade de uma Notificação no sistema.
 * Esta é a versão de classe simples, que não depende do Sequelize.
 */
class Notificacao {
  /**
   * @param {number} idNotificacao - ID da notificação.
   * @param {string} mensagem - Conteúdo da notificação.
   * @param {Date} dataEnvio - Data de envio da notificação.
   * @param {boolean} lida - Status de leitura (lida/não lida).
   * @param {number} idDestinatario - ID do usuário que recebeu a notificação.
   */
  constructor(idNotificacao, mensagem, dataEnvio, lida, idDestinatario) {
    this.idNotificacao = idNotificacao;
    this.mensagem = mensagem;
    this.dataEnvio = dataEnvio;
    this.lida = lida;
    this.idDestinatario = idDestinatario;
  }
}

module.exports = Notificacao;