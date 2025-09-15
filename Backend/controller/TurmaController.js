// controller/TurmaController.js

const TurmaService = require('../services/TurmaService');

class TurmaController {
  async criar(req, res) {
    try {
      const turma = await TurmaService.criarTurma(req.body);
      res.status(201).json(turma);
    } catch (error) {
      res.status(400).json({ erro: error.message });
    }
  }

  async buscarPorId(req, res) {
    try {
      const turma = await TurmaService.buscarTurma(req.params.id_turma);
      res.status(200).json(turma);
    } catch (error) {
      res.status(404).json({ erro: error.message });
    }
  }

  // NOVO MÉTODO
  async buscarTodas(req, res) {
    try {
      const turmas = await TurmaService.buscarTodasTurmas();
      res.status(200).json(turmas);
    } catch (error) {
      // Erros genéricos de servidor (ex: falha de conexão com o BD)
      res.status(500).json({ erro: 'Ocorreu um erro ao buscar as turmas.' });
    }
  }

  async adicionarAluno(req, res) {
    try {
      const { id_turma } = req.params;
      const { matricula_aluno } = req.body; // É melhor prática receber a matrícula no corpo da requisição

      if (!matricula_aluno) {
        return res.status(400).json({ erro: 'A matrícula do aluno é obrigatória.' });
      }

      const turma = await TurmaService.adicionarAluno(id_turma, matricula_aluno);
      res.status(200).json(turma);
    } catch (error) {
      res.status(400).json({ erro: error.message });
    }
  }

  async removerAluno(req, res) {
    try {
      const { id_turma, matricula_aluno } = req.params;
      const turma = await TurmaService.removerAluno(id_turma, matricula_aluno);
      res.status(200).json(turma);
    } catch (error) {
      res.status(400).json({ erro: error.message });
    }
  }
}

module.exports = new TurmaController();