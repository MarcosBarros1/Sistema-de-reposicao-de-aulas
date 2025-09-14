// routes/coordenadorRoutes.js

const { Router } = require('express');
const CoordenadorController = require('../controller/CoordenadorController');

const router = Router();

// Define a rota para criar (POST) um novo coordenador
router.post('/cadastrar', CoordenadorController.cadastrar);

module.exports = router;