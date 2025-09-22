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
      const { id } = req.params;
      const solicitacao = await ReposicaoService.buscarPorId(Number(id));

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
      const { idReposicao } = req.params;
      const dadosAssinaturas = await ReposicaoService.buscarAssinaturas(Number(idReposicao));
      
      if (!dadosAssinaturas) {
        return res.status(404).json({ erro: 'Reposição não encontrada ou não possui turma associada.' });
      }

      return res.json(dadosAssinaturas);
    } catch (err) {
      console.error('Erro ao buscar assinaturas:', err);
      return res.status(500).json({ erro: 'Erro interno ao buscar assinaturas.' });
    }
  }
}

module.exports = new ReposicaoController();
