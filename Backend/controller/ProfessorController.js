// controller/ProfessorController.js

const ProfessorService = require('../services/ProfessorService');

class ProfessorController {

  /**
   * Lida com a requisição de cadastro de um novo professor.
   * (RF04, RF04.1)
   */
  async cadastrar(req, res) {
    try {
      // 1. Extrai os dados do corpo da requisição
      const dadosProfessor = req.body;

      // 2. Chama a camada de serviço para executar a lógica de negócio
      const novoProfessor = await ProfessorService.cadastrarProfessor(dadosProfessor);

      // 3. Retorna a resposta de sucesso
      // O status 201 Created é o mais apropriado para criação de recursos.
      res.status(201).json(novoProfessor);

    } catch (error) {
      // 4. Lida com erros
      // Se for um erro de regra de negócio, retorna 400 Bad Request.
      if (error.name === 'RegraDeNegocioException') {
        res.status(400).json({ message: error.message });
      } else {
        // Para outros erros, retorna 500 Internal Server Error.
        console.error(error); // É uma boa prática logar o erro no servidor.
        res.status(500).json({ message: 'Ocorreu um erro inesperado no servidor.' });
      }
    }
  }

  // Futuramente, outros métodos do controller virão aqui:
  // async buscarPorMatricula(req, res) { ... }
  // async listarTodos(req, res) { ... }
}

module.exports = new ProfessorController();