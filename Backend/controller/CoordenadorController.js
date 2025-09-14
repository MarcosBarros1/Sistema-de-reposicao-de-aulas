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
}

module.exports = new CoordenadorController();