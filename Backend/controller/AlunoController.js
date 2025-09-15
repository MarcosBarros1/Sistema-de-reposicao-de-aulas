// controller/AlunoController.js
const AlunoService = require('../services/AlunoService');

class AlunoController {
  async cadastrar(req, res) {
    try {
      const dadosAluno = req.body;
      const novoAluno = await AlunoService.cadastrarAluno(dadosAluno);
      res.status(201).json(novoAluno);
    } catch (error) {
      if (error.name === 'RegraDeNegocioException') {
        res.status(400).json({ message: error.message });
      } else {
        console.error(error);
        res.status(500).json({ message: 'Ocorreu um erro inesperado no servidor.' });
      }
    }
  }

  async buscarPorMatricula(req, res) {
    try {
      // Extrai a matrícula dos parâmetros da URL (ex: /alunos/12345)
      const { matricula } = req.params;

      // Chama o serviço para buscar o aluno
      const aluno = await AlunoService.buscarAluno(matricula);
      
      // Retorna o aluno encontrado com status 200 (OK)
      res.status(200).json(aluno);
    } catch (error) {
      // Se o serviço lançar uma exceção (aluno não encontrado), retorna erro 404
      res.status(404).json({ erro: error.message });
    }
  }
}

module.exports = new AlunoController();
