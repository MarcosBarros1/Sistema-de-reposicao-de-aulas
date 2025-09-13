// routes/professorRoutes.js

const { Router } = require('express');
const ProfessorController = require('../controller/ProfessorController');

const router = Router();

// Define a rota para criar (POST) um novo professor
// A URL será /api/professores
router.post('/cadastrar', ProfessorController.cadastrar);

// Futuramente, outras rotas virão aqui:
// router.get('/professores/:matricula', ProfessorController.buscarPorMatricula);

module.exports = router;