// routes/reposicaoRoutes.js

const express = require('express');
const ReposicaoController = require('../controller/ReposicaoController');

const router = express.Router();

// Criar uma nova solicitação de reposição
router.post('/', (req, res) => ReposicaoController.criar(req, res));

// Atualizar status de uma solicitação
router.put('/:id/status', (req, res) => ReposicaoController.atualizarStatus(req, res));

// Buscar solicitação por ID
router.get('/:id', (req, res) => ReposicaoController.buscarPorId(req, res));

// Listar todas as solicitações
router.get('/', (req, res) => ReposicaoController.listarTodos(req, res));

module.exports = router;
