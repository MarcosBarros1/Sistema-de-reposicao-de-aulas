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
router.get('/:matricula/reposicoes', (req, res) => ProfessorController.listarReposicoes(req, res));

// Update
router.put('/:matricula', ProfessorController.atualizar);

// Delete
router.delete('/:matricula', ProfessorController.deletar);


/* Rotas de ação */

// Rota para um professor iniciar o processo de solicitação
router.post('/solicitar-reposicao', ProfessorController.iniciarSolicitacao);

// ... (no final do arquivo, antes do module.exports)
router.post('/:matricula/disciplinas', ProfessorController.associarDisciplinas);

module.exports = router;