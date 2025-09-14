// controller/AuthController.js

const AutenticacaoService = require('../services/AuthService');

class AutenticacaoController {

  async login(req, res) {
    try {
      const { email, senha } = req.body;
      if (!email || !senha) {
        return res.status(400).json({ message: 'Email e senha são obrigatórios.' });
      }

      const resultado = await AutenticacaoService.login(email, senha);
      res.status(200).json(resultado);

    } catch (error) {
      if (error.name === 'AutenticacaoInvalidaException') {
        // Para erros de login, usamos o status 401 Unauthorized
        res.status(401).json({ message: error.message });
      } else {
        console.error(error);
        res.status(500).json({ message: 'Ocorreu um erro inesperado no servidor.' });
      }
    }
  }
}

module.exports = new AutenticacaoController();