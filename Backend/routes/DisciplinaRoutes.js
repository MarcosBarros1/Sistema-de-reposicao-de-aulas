// routes/disciplinaRoutes.js

const express = require('express');
const DisciplinaController = require('../controller/DisciplinaController');

const router = express.Router();

// Criar disciplina
router.post('/', (req, res) => DisciplinaController.criar(req, res));

// --- CORREÇÃO AQUI ---
// 1. A rota para listar todas as disciplinas vem PRIMEIRO.
router.get('/', (req, res) => DisciplinaController.listarTodos(req, res));

// 2. A rota para buscar por um código específico vem DEPOIS.
router.get('/:codigo', (req, res) => DisciplinaController.buscarPorCodigo(req, res));

module.exports = router;