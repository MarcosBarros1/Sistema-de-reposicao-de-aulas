// controller/WebhookController.js
const ReposicaoService = require('../services/ReposicaoService');

class WebhookController {
    async handleGoogleForm(req, res) {
        try {

            console.log('>>> Webhook do Google Form recebido! Corpo da requisição:', req.body);

            const { id_solicitacao, matricula_aluno, concorda } = req.body;

            if (id_solicitacao === undefined || matricula_aluno === undefined || concorda === undefined) {
                return res.status(400).json({ message: 'Dados insuficientes.' });
            }

            // Passamos os dados para o serviço
            await ReposicaoService.registrarAssinatura({
                idSolicitacao: id_solicitacao,
                matriculaAluno: matricula_aluno,
                concorda: concorda
            });

            res.status(200).json({ message: 'Webhook recebido com sucesso.' });
        } catch (error) {
            console.error('Erro no webhook do Google Form:', error);
            res.status(500).json({ message: 'Erro interno no servidor.' });
        }
    }
}
module.exports = new WebhookController();