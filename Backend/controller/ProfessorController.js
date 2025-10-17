// controller/ProfessorController.js

const ProfessorService = require('../services/ProfessorService');

class ProfessorController {

  /**
   * Lida com a requisição de cadastro de um novo professor.
   * (RF04, RF04.1)
   */
  async cadastrar(req, res) {
    try {
      // 1. Extrai os dados do corpo da requisição
      const dadosProfessor = req.body;

      // 2. Chama a camada de serviço para executar a lógica de negócio
      const novoProfessor = await ProfessorService.cadastrarProfessor(dadosProfessor);

      // 3. Retorna a resposta de sucesso
      // O status 201 Created é o mais apropriado para criação de recursos.
      res.status(201).json(novoProfessor);

    } catch (error) {
      // 4. Lida com erros
      // Se for um erro de regra de negócio, retorna 400 Bad Request.
      if (error.name === 'RegraDeNegocioException') {
        res.status(400).json({ message: error.message });
      } else {
        // Para outros erros, retorna 500 Internal Server Error.
        console.error(error); // É uma boa prática logar o erro no servidor.
        res.status(500).json({ message: 'Ocorreu um erro inesperado no servidor.' });
      }
    }
  }

  async buscarPorMatricula(req, res) {
    try {
      const { matricula } = req.params;
      const professor = await ProfessorService.buscarPorMatricula(Number(matricula));
      if (!professor) {
        return res.status(404).json({ message: 'Professor não encontrado.' });
      }
      res.status(200).json(professor);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async listarTodos(req, res) {
    try {
      const professores = await ProfessorService.buscarTodos();
      res.status(200).json(professores);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async atualizar(req, res) {
    try {
      const { matricula } = req.params;
      const dados = req.body;
      const professor = await ProfessorService.atualizarProfessor(Number(matricula), dados);
      if (!professor) {
        return res.status(404).json({ message: 'Professor não encontrado.' });
      }
      res.status(200).json(professor);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async deletar(req, res) {
    try {
      const { matricula } = req.params;
      const sucesso = await ProfessorService.deletarProfessor(Number(matricula));
      if (!sucesso) {
        return res.status(404).json({ message: 'Professor não encontrado.' });
      }
      // 204 No Content é o status ideal para respostas de delete bem-sucedidas
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async iniciarSolicitacao(req, res) {
    try {
      const dados = req.body;

      // Adicionamos uma validação para garantir que o idProfessor foi enviado
      if (!dados.idProfessor) {
        return res.status(400).json({ message: 'O campo idProfessor é obrigatório no corpo da requisição.' });
      }

      const solicitacaoCriada = await ProfessorService.iniciarSolicitacaoReposicao(dados);
      res.status(201).json(solicitacaoCriada);

    } catch (error) {

      console.error('Erro ao iniciar solicitação:', error);
      res.status(500).json({ message: 'Erro interno ao iniciar solicitação.' });
      
    }
  }

  async associarDisciplinas(req, res) {
    try {
      const { matricula } = req.params;
      const { disciplinaIds } = req.body;

      if (!disciplinaIds || !Array.isArray(disciplinaIds)) {
        return res.status(400).json({ message: 'O campo "disciplinaIds" é obrigatório e deve ser um array.' });
      }

      const resultado = await ProfessorService.associarDisciplinas(Number(matricula), disciplinaIds);
      res.status(200).json(resultado);

    } catch (error) {
      if (error.name === 'RegraDeNegocioException') {
        res.status(400).json({ message: error.message });
      } else {
        console.error(error);
        res.status(500).json({ message: 'Ocorreu um erro inesperado no servidor.' });
      }
    }
  }

  async listarReposicoes(req, res) {
    try {
      const { matricula } = req.params;
      const reposicoes = await ReposicaoService.listarPorProfessor(matricula);
      return res.status(200).json(reposicoes);
    } catch (error) {
      console.error('Erro ao listar reposições do professor:', error);
      return res.status(500).json({ erro: 'Erro interno ao buscar reposições.' });
    }
  }

}

module.exports = new ProfessorController();