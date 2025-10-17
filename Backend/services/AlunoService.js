// services/AlunoService.js
const AlunoRepository = require('../persistence/AlunoRepository');
const UsuarioRepository = require('../persistence/UsuarioRepository');
const Aluno = require('../model/Aluno');
const RegraDeNegocioException = require('../exceptions/RegraDeNegocioException');

class AlunoService {
  async cadastrarAluno(dadosAluno) {
    // 1. Regra de negócio: verificar se o e-mail já existe
    const usuarioExistente = await UsuarioRepository.buscarPorEmail(dadosAluno.email);
    if (usuarioExistente) {
      throw new RegraDeNegocioException('O e-mail informado já está em uso.');
    }

    // 2. Regra de negócio: verificar se a matrícula já existe
    const alunoComMesmaMatricula = await AlunoRepository.buscarPorMatricula(dadosAluno.matricula_aluno);
    if (alunoComMesmaMatricula) {
      throw new RegraDeNegocioException('Já existe um aluno com esta matrícula.');
    }

    // 3. Delegação: pede para a camada de persistência salvar
    const novoAluno = await AlunoRepository.salvar(dadosAluno);

    return novoAluno;
  }

  async buscarAluno(matricula_aluno) {
    const aluno = await AlunoRepository.buscarPorMatricula(matricula_aluno);
    if (!aluno) {
      throw new RegraDeNegocioException(`Aluno com matrícula ${matricula_aluno} não encontrado.`);
    }
    return aluno;
  }
}

module.exports = new AlunoService();
