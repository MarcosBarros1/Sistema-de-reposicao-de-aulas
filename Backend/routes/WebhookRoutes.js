// routes/webhookRoutes.js
const { Router } = require('express');
const WebhookController = require('../controller/WebhookController');
const router = Router();

// Rota que o Google Apps Script irá chamar
router.post('/google-form', WebhookController.handleGoogleForm);

module.exports = router;