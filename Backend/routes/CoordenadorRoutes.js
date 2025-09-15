// routes/coordenadorRoutes.js

const { Router } = require('express');
const CoordenadorController = require('../controller/CoordenadorController');

const router = Router();


/* Rotas de CRUD */

// Create
router.post('/cadastrar', CoordenadorController.cadastrar);

// Read
router.get('/', CoordenadorController.listarTodos);
router.get('/:matricula', CoordenadorController.buscarPorMatricula);

// Update
router.put('/:matricula', CoordenadorController.atualizar);

// Delete
router.delete('/:matricula', CoordenadorController.deletar);



/* Rotas de ação */

// Esta rota aciona o envio de notificação de falta para um professor específico
router.post('/professores/:matricula/notificar-falta', CoordenadorController.notificarFalta);

module.exports = router;