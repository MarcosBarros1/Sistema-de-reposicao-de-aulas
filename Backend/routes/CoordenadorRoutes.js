// routes/coordenadorRoutes.js

const { Router } = require('express');
const CoordenadorController = require('../controller/CoordenadorController');

const router = Router();

// Create
router.post('/cadastrar', CoordenadorController.cadastrar);

// Read
router.get('/', CoordenadorController.listarTodos);
router.get('/:matricula', CoordenadorController.buscarPorMatricula);

// Update
router.put('/:matricula', CoordenadorController.atualizar);

// Delete
router.delete('/:matricula', CoordenadorController.deletar);

module.exports = router;