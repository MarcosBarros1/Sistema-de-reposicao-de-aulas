const express = require('express');
const ReposicaoController = require('../controller/ReposicaoController');
const AssinaturaController = require('../controller/AssinaturaController');
const router = express.Router();

// Rotas Específicas
router.get('/autorizadas', ReposicaoController.listar_autorizadas);
router.get('/pendentes-aprovacao', ReposicaoController.listar_pendentes);
router.post('/:id_solicitacao/assinar', AssinaturaController.criarAssinatura);

// Rotas Principais
router.post('/', ReposicaoController.criar);
router.get('/', ReposicaoController.listarTodos);

// Rotas com ID (genéricas, vêm por último)
router.get('/:id_solicitacao', ReposicaoController.buscarPorId);
router.put('/:id_solicitacao/status', ReposicaoController.atualizarStatus);
router.get('/:id_solicitacao/assinaturas', ReposicaoController.buscarAssinaturas);
router.post('/:id_solicitacao/confirmar-realizacao', ReposicaoController.confirmar_realizacao);

module.exports = router;