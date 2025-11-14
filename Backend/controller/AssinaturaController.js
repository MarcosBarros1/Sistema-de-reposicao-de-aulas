// controller/AssinaturaController.js
const ReposicaoService = require('../services/ReposicaoService');

class AssinaturaController {

    async criarAssinatura(req, res) {
        try {
            // 1. O ID da solicitação vem da URL
            const { id_solicitacao } = req.params;

            // 2. O 'concorda' E a 'matricula_aluno' vêm do CORPO da requisição
            const { concorda, matricula_aluno } = req.body;

            // 3. Validação
            if (id_solicitacao === undefined || matricula_aluno === undefined || concorda === undefined) {
                return res.status(400).json({ message: 'Dados insuficientes (id_solicitacao, matricula_aluno, concorda).' });
            }

            // 4. Chamamos o serviço
            await ReposicaoService.registrarAssinatura({
                id_solicitacao: parseInt(id_solicitacao, 10),
                matricula_aluno: parseInt(matricula_aluno, 10),
                concorda: concorda
            });

            res.status(201).json({ message: 'Assinatura registrada com sucesso.' });

        } catch (error) {
            console.error('Erro ao registrar assinatura:', error);
            res.status(500).json({ message: error.message || 'Erro interno no servidor.' });
        }
    }
}

module.exports = new AssinaturaController();