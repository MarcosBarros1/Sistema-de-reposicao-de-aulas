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

  // Outros métodos do controller para as responsabilidades do coordenador...
}

module.exports = new CoordenadorController();