// routes/AuthRoutes.js

const { Router } = require('express');
const AutenticacaoController = require('../controller/AuthController');

const router = Router();

router.post('/login', AutenticacaoController.login);

module.exports = router;