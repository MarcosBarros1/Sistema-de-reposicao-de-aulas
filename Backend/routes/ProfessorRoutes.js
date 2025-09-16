// routes/professorRoutes.js

const { Router } = require('express');
const ProfessorController = require('../controller/ProfessorController');

const router = Router();


/* Rotas de CRUD */

// Create
router.post('/cadastrar', ProfessorController.cadastrar);

// Read
router.get('/', ProfessorController.listarTodos);
router.get('/:matricula', ProfessorController.buscarPorMatricula);

// Update
router.put('/:matricula', ProfessorController.atualizar);

// Delete
router.delete('/:matricula', ProfessorController.deletar);


/* Rotas de ação */

// Rota para um professor iniciar o processo de solicitação
router.post('/solicitar-reposicao', ProfessorController.iniciarSolicitacao);

module.exports = router;