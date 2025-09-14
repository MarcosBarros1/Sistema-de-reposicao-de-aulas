// controllers/DisciplinaController.js

const DisciplinaService = require('../services/DisciplinaService');

class DisciplinaController {
  async criar(req, res) {
    try {
      const disciplina = await DisciplinaService.criarDisciplina(req.body);
      return res.status(201).json(disciplina);
    } catch (err) {
      console.error('Erro ao criar disciplina:', err.message);
      return res.status(400).json({ erro: err.message });
    }
  }

  async buscarPorCodigo(req, res) {
    try {
      const { codigo } = req.params;
      const disciplina = await DisciplinaService.buscarPorCodigo(codigo);

      if (!disciplina) {
        return res.status(404).json({ erro: 'Disciplina não encontrada.' });
      }

      return res.json(disciplina);
    } catch (err) {
      console.error('Erro ao buscar disciplina:', err.message);
      return res.status(500).json({ erro: 'Erro interno ao buscar disciplina.' });
    }
  }

  async listarTodos(req, res) {
    try {
      const disciplinas = await DisciplinaService.listarTodos();
      return res.json(disciplinas);
    } catch (err) {
      console.error('Erro ao listar disciplinas:', err.message);
      return res.status(500).json({ erro: 'Erro interno ao listar disciplinas.' });
    }
  }
}

module.exports = new DisciplinaController();
