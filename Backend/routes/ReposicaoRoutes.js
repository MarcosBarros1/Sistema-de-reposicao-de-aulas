const express = require('express');
const ReposicaoController = require('../controller/ReposicaoController');
const router = express.Router();

// Rotas Específicas
router.get('/pendentes-aprovacao', ReposicaoController.listar_pendentes);

// Rotas Principais
router.post('/', ReposicaoController.criar);
router.get('/', ReposicaoController.listarTodos);

// Rotas com ID (genéricas, vêm por último)
router.get('/:id_solicitacao', ReposicaoController.buscarPorId);
router.put('/:id_solicitacao/status', ReposicaoController.atualizarStatus); // Padronizado
router.get('/:id_solicitacao/assinaturas', ReposicaoController.buscarAssinaturas); // Padronizado

module.exports = router;