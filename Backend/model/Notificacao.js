// Classe responsável por gerenciar e representar notificações
class Notificacao {
  /**
   * @param {number} idNotificacao
   * @param {number} destinatario - ID do usuário que receberá a notificação.
   * @param {string} mensagem - Conteúdo da notificação.
   * @param {Date} dataEnvio
   * @param {boolean} lida - Status da notificação.
   */
  constructor(idNotificacao, destinatario, mensagem, dataEnvio, lida = false) {
    this.idNotificacao = idNotificacao;
    this.destinatario = destinatario;
    this.mensagem = mensagem;
    this.dataEnvio = dataEnvio;
    this.lida = lida;
  }

  // Método para enviar a notificação
  enviar() {
    // TODO: Implementar lógica de envio (e-mail, push, etc.)
  }

  // Método para marcar a notificação como lida
  marcarComoLida() {
    // TODO: Implementar lógica para marcar como lida
  }
}

module.exports = Notificacao;