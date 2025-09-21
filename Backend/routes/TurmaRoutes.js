// routes/TurmaRoutes.js

const express = require('express');
const router = express.Router();
const TurmaController = require('../controller/TurmaController');

// Criar uma nova turma
// POST /turmas 
router.post('/', TurmaController.criar);

// NOVO: Buscar TODAS as turmas
// Esta rota deve vir ANTES da rota de buscar por ID.
router.get('/', TurmaController.buscarTodas);

// Buscar uma turma específica pelo ID
// GET /turmas/1
router.get('/:id_turma', TurmaController.buscarPorId);

// Adicionar um aluno a uma turma
// POST /turmas/1/alunos
router.post('/:id_turma/alunos', TurmaController.adicionarAluno);

// Remover um aluno de uma turma
// DELETE /turmas/1/alunos/12345
router.delete('/:id_turma/alunos/:matricula_aluno', TurmaController.removerAluno);

// Atualizar turma
router.put('/:id_turma', TurmaController.atualizar);

// Deletar turma
router.delete('/:id_turma', TurmaController.remover);

module.exports = router;