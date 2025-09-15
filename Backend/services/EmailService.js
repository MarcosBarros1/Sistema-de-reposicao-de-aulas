// services/EmailService.js

const nodemailer = require('nodemailer');
require('dotenv').config();

class EmailService {
  constructor() {
    // Configura o "transportador" de e-mail com as credenciais do .env
    // Este transportador é o objeto que realmente envia os e-mails.
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_PORT == 465, // true para porta 465, false para outras
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  /**
   * Envia um e-mail.
   * @param {object} mailOptions - Opções do e-mail { to, subject, text, html }.
   */
  async enviarEmail(mailOptions) {
    try {
      // Adiciona o remetente padrão
      const options = {
        from: `"Sistema de Reposição de Aulas" <${process.env.SMTP_USER}>`,
        ...mailOptions,
      };

      console.log(`Enviando e-mail para: ${options.to}`);
      const info = await this.transporter.sendMail(options);
      console.log(`E-mail enviado com sucesso: ${info.messageId}`);
      return info;
    } catch (error) {
      console.error('Erro ao enviar e-mail:', error);
      // Em uma aplicação real, você poderia adicionar um sistema de log mais robusto aqui.
      throw new Error('Falha no serviço de envio de e-mail.');
    }
  }
}

module.exports = new EmailService();