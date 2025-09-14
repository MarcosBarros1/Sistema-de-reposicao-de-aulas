// controller/CoordenadorController.js

const CoordenadorService = require('../services/CoordenadorService');

class CoordenadorController {

  /**
   * Lida com a requisição de cadastro de um novo coordenador.
   * (RF04, RF04.2)
   */
  async cadastrar(req, res) {
    try {
      const dadosCoordenador = req.body;
      const novoCoordenador = await CoordenadorService.cadastrarCoordenador(dadosCoordenador);
      res.status(201).json(novoCoordenador);
    } catch (error) {
      if (error.name === 'RegraDeNegocioException') {
        res.status(400).json({ message: error.message });
      } else {
        console.error(error);
        res.status(500).json({ message: 'Ocorreu um erro inesperado no servidor.' });
      }
    }
  }

  async buscarPorMatricula(req, res) {
    try {
      const { matricula } = req.params;
      const coordenador = await CoordenadorService.buscarPorMatricula(Number(matricula));
      if (!coordenador) {
        return res.status(404).json({ message: 'Coordenador não encontrado.' });
      }
      res.status(200).json(coordenador);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async listarTodos(req, res) {
    try {
      const coordenadores = await CoordenadorService.buscarTodos();
      res.status(200).json(coordenadores);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async atualizar(req, res) {
    try {
      const { matricula } = req.params;
      const dados = req.body;
      const coordenador = await CoordenadorService.atualizarCoordenador(Number(matricula), dados);
      if (!coordenador) {
        return res.status(404).json({ message: 'Coordenador não encontrado.' });
      }
      res.status(200).json(coordenador);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async deletar(req, res) {
    try {
      const { matricula } = req.params;
      const sucesso = await CoordenadorService.deletarCoordenador(Number(matricula));
      if (!sucesso) {
        return res.status(404).json({ message: 'Coordenador não encontrado.' });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  /**
   * Lida com a requisição para notificar a falta de um professor.
   */
  async notificarFalta(req, res) {
    try {
      // Extrai a matrícula do professor dos parâmetros da URL
      const { matricula } = req.params;

      // Chama o serviço para executar a lógica de negócio
      await CoordenadorService.notificarFalta(Number(matricula));

      // Retorna uma resposta de sucesso
      res.status(200).json({ message: 'Notificação de falta enviada com sucesso para o professor.' });
    } catch (error) {
      console.error('Erro no controller ao notificar falta:', error);
      // Retorna um erro específico se o professor não for encontrado
      if (error.message === 'Professor não encontrado.') {
        return res.status(404).json({ message: error.message });
      }
      // Retorna um erro genérico para outras falhas
      res.status(500).json({ message: 'Ocorreu um erro inesperado no servidor.' });
    }
  }
}

module.exports = new CoordenadorController();