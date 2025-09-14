// routes/professorRoutes.js

const { Router } = require('express');
const ProfessorController = require('../controller/ProfessorController');

const router = Router();

// Create
router.post('/cadastrar', ProfessorController.cadastrar);

// Read
router.get('/', ProfessorController.listarTodos);
router.get('/:matricula', ProfessorController.buscarPorMatricula);

// Update
router.put('/:matricula', ProfessorController.atualizar);

// Delete
router.delete('/:matricula', ProfessorController.deletar);

module.exports = router;