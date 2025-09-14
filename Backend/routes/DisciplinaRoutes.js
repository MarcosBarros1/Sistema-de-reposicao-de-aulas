// routes/disciplinaRoutes.js

const express = require('express');
const DisciplinaController = require('../controller/DisciplinaController');

const router = express.Router();

// Criar disciplina
router.post('/', (req, res) => DisciplinaController.criar(req, res));

// Buscar disciplina por código
router.get('/:codigo', (req, res) => DisciplinaController.buscarPorCodigo(req, res));

// Listar todas as disciplinas
router.get('/', (req, res) => DisciplinaController.listarTodos(req, res));

module.exports = router;
