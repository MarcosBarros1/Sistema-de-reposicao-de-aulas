// controller/ReposicaoController.js

const ReposicaoService = require('../services/ReposicaoService');
const SolicitacaoStatus = require('../constants/SolicitacaoStatus');

class ReposicaoController {
  /**
   * Cria uma nova solicitação de reposição
   */
  async criar(req, res) {
    try {
      const dados = req.body;

      // validação básica
      if (!dados.motivo || !dados.data || !dados.horario || !dados.sala || !dados.idProfessor || !dados.idTurma) {
        return res.status(400).json({ erro: 'Campos obrigatórios não informados.' });
      }

      const solicitacao = await ReposicaoService.criarSolicitacao(dados);
      return res.status(201).json(solicitacao);
    } catch (err) {
      console.error('Erro ao criar solicitação:', err);
      return res.status(500).json({ erro: 'Erro interno ao criar solicitação.' });
    }
  }

  /**
   * Atualiza o status de uma solicitação
   */
  async atualizarStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!Object.values(SolicitacaoStatus).includes(status)) {
        return res.status(400).json({ erro: 'Status inválido.' });
      }

      const solicitacaoAtualizada = await ReposicaoService.atualizarStatus(Number(id), status);

      if (!solicitacaoAtualizada) {
        return res.status(404).json({ erro: 'Solicitação não encontrada.' });
      }

      return res.json(solicitacaoAtualizada);
    } catch (err) {
      console.error('Erro ao atualizar status:', err);
      return res.status(500).json({ erro: 'Erro interno ao atualizar status.' });
    }
  }

  /**
   * Buscar solicitação por ID
   */
  async buscarPorId(req, res) {
    try {
      const { id_solicitacao } = req.params;

      const solicitacao = await ReposicaoService.buscarPorId(Number(id_solicitacao));

      if (!solicitacao) {
        return res.status(404).json({ erro: 'Solicitação não encontrada.' });
      }

      return res.json(solicitacao);
    } catch (err) {
      console.error('Erro ao buscar solicitação:', err);
      return res.status(500).json({ erro: 'Erro interno ao buscar solicitação.' });
    }
  }

  /**
   * Listar todas as solicitações
   */
  async listarTodos(req, res) {
    try {
      const solicitacoes = await ReposicaoService.listarTodos();
      return res.json(solicitacoes);
    } catch (err) {
      console.error('Erro ao listar solicitações:', err);
      return res.status(500).json({ erro: 'Erro interno ao listar solicitações.' });
    }
  }

  async buscarAssinaturas(req, res) {
    try {
      const { id_solicitacao } = req.params;
      const dadosAssinaturas = await ReposicaoService.buscarAssinaturas(Number(id_solicitacao));

      if (!dadosAssinaturas) {
        return res.status(404).json({ erro: 'Reposição não encontrada ou não possui turma associada.' });
      }

      return res.json(dadosAssinaturas);
    } catch (err) {
      console.error('Erro ao buscar assinaturas:', err);
      return res.status(500).json({ erro: 'Erro interno ao buscar assinaturas.' });
    }
  }

  async listar_pendentes(req, res) {
    try {
      const solicitacoes = await ReposicaoService.buscar_pendentes_aprovacao();
      res.status(200).json(solicitacoes);
    } catch (err) {
      res.status(500).json({ erro: 'Erro interno ao listar solicitações pendentes.' });
    }
  }

  async listar_autorizadas(req, res) {
    try {
      const solicitacoes = await ReposicaoService.buscar_autorizadas();
      res.status(200).json(solicitacoes);
    } catch (err) {
      res.status(500).json({ erro: 'Erro interno ao listar solicitações autorizadas.' });
    }
  }

  async confirmar_realizacao(req, res) {
    try {
      const { id_solicitacao } = req.params;
      // 1. EXTRAI O E-MAIL DO CORPO DA REQUISIÇÃO
      const { email_coordenador } = req.body;

      // 2. VALIDAÇÃO: Garante que o e-mail foi enviado
      if (!email_coordenador) {
        return res.status(400).json({ erro: 'O e-mail do coordenador é obrigatório no corpo da requisição.' });
      }

      // 3. PASSA O E-MAIL PARA O SERVIÇO
      await ReposicaoService.confirmar_realizacao(Number(id_solicitacao), email_coordenador);

      res.status(200).json({ message: 'Confirmação de aula realizada com sucesso.' });
    } catch (err) {
      const status = err.name === 'RegraDeNegocioException' ? 400 : 500;
      res.status(status).json({ erro: err.message });
    }
  }

}



module.exports = new ReposicaoController();
