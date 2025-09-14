// services/AlunoService.js

const AlunoRepository = require('../persistence/AlunoRepository');
const Aluno = require('../models/Aluno');

class AlunoService {
  /**
   * Cadastra um novo aluno no sistema.
   * @param {Object} dadosAluno - Dados para criar o aluno.
   * @returns {Promise<Aluno>}
   */
  async cadastrarAluno(dadosAluno) {
    // Verifica se a matrícula já existe
    const existente = await AlunoRepository.buscarPorMatricula(dadosAluno.matriculaAluno);
    if (existente) {
      throw new Error(`Matrícula ${dadosAluno.matriculaAluno} já cadastrada.`);
    }

    // Cria o objeto Aluno
    const novoAluno = new Aluno(
      dadosAluno.idUsuario,
      dadosAluno.nome,
      dadosAluno.email,
      dadosAluno.senha,
      dadosAluno.matriculaAluno,
      dadosAluno.turmas || []
    );

    // Persiste no banco
    return await AlunoRepository.salvar(novoAluno);
  }

  /**
   * Busca aluno pela matrícula.
   * @param {string} matriculaAluno - Matrícula do aluno.
   * @returns {Promise<Aluno|null>}
   */
  async buscarAluno(matriculaAluno) {
    const aluno = await AlunoRepository.buscarPorMatricula(matriculaAluno);

    if (!aluno) {
      throw new Error(`Aluno com matrícula ${matriculaAluno} não encontrado.`);
    }

    return aluno;
  }

  /**
   * Lista as turmas de um aluno.
   * @param {string} matriculaAluno
   * @returns {Promise<string[]>}
   */
  async listarTurmas(matriculaAluno) {
    const aluno = await this.buscarAluno(matriculaAluno);
    return aluno.turmas;
  }
}

module.exports = new AlunoService();
