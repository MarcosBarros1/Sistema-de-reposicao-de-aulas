// controller/NutricionistaController.js

const NutricionistaService = require('../services/NutricionistaService');

class NutricionistaController {
  async criar(req, res) {
    try {
      const novaNutricionista = await NutricionistaService.criarNutricionista(req.body);
      res.status(201).json(novaNutricionista);
    } catch (error) {
      res.status(400).json({ erro: error.message });
    }
  }

  async atualizar(req, res) {
    try {
      const { id } = req.params;
      const nutricionistaAtualizada = await NutricionistaService.atualizarNutricionista(id, req.body);
      res.status(200).json(nutricionistaAtualizada);
    } catch (error) {
      // Se o serviço não encontrar a nutricionista, pode retornar 404
      if (error.message === 'Nutricionista não encontrada.') {
        return res.status(404).json({ erro: error.message });
      }
      res.status(400).json({ erro: error.message });
    }
  }
}

module.exports = new NutricionistaController();