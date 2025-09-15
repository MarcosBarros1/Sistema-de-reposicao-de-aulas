// routes/NutricionistaRoutes.js

const express = require('express');
const router = express.Router();
const NutricionistaController = require('../controller/NutricionistaController');

// Adicionar uma nova nutricionista
// POST /nutricionistas
router.post('/', NutricionistaController.criar);

// Atualizar uma nutricionista existente
// PUT /nutricionistas/1
router.put('/:id', NutricionistaController.atualizar);

module.exports = router;