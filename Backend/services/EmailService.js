// services/EmailService.js

const sgMail = require('@sendgrid/mail');
require('dotenv').config();

// Configura a biblioteca do SendGrid com sua chave de API do .env
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

class EmailService {
  /**
   * Envia um e-mail usando a API do SendGrid.
   * @param {object} mailOptions - Opções do e-mail { to, subject, text, html }.
   */
  async enviarEmail(mailOptions) {
    // O SendGrid exige que o e-mail do remetente tenha sido verificado na plataforma.
    const remetente_verificado = 'repoaula@gmail.com'; // O e-mail que você verificou no Passo 2.

    const msg = {
      to: mailOptions.to, // Pode ser um e-mail único ou um array de e-mails
      from: {
        name: 'Sistema de Reposição de Aulas',
        email: remetente_verificado,
      },
      subject: mailOptions.subject,
      text: mailOptions.text, // Conteúdo em texto puro (opcional, para clientes de e-mail sem HTML)
      html: mailOptions.html, // Conteúdo em HTML
    };

    try {
      console.log(`Enviando e-mail via SendGrid para: ${msg.to}`);
      await sgMail.send(msg);
      console.log('E-mail enviado com sucesso via SendGrid.');
    } catch (error) {
      // O erro do SendGrid é bem detalhado, é bom registrá-lo por completo
      console.error('Erro ao enviar e-mail via SendGrid:', error.response.body);
      throw new Error('Falha no serviço de envio de e-mail.');
    }
  }
}

module.exports = new EmailService();