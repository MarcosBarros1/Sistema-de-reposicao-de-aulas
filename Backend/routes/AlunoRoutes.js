const express = require('express');
const router = express.Router();
const AlunoController = require('../controller/AlunoController');

// Criar aluno
router.post('/', (req, res) => AlunoController.cadastrar(req, res));

// Buscar aluno por matrícula
router.get('/:matricula', (req, res) => AlunoController.buscarPorMatricula(req, res));

// Listar turmas do aluno
router.get('/:matricula/turmas', async (req, res) => {
  try {
    const turmas = await AlunoController.listarTurmas(req, res);
    res.json(turmas);
  } catch (error) {
    res.status(400).json({ erro: error.message });
  }
});

module.exports = router;
