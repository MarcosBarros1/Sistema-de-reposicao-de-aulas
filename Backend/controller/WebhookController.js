// controller/WebhookController.js
const ReposicaoService = require('../services/ReposicaoService');

class WebhookController {
  async handleGoogleForm(req, res) {
    try {
      const { idSolicitacao, matriculaAluno, concorda } = req.body;
      // Validação básica
      if (idSolicitacao === undefined || matriculaAluno === undefined || concorda === undefined) {
        return res.status(400).json({ message: 'Dados insuficientes.' });
      }

      await ReposicaoService.registrarAssinatura({ idSolicitacao, matriculaAluno, concorda });
      res.status(200).json({ message: 'Webhook recebido com sucesso.' });
    } catch (error) {
      console.error('Erro no webhook do Google Form:', error);
      res.status(500).json({ message: 'Erro interno no servidor.' });
    }
  }
}
module.exports = new WebhookController();