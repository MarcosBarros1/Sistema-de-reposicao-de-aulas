// services/TurmaService.js

const TurmaRepository = require('../persistence/TurmaRepository');
const AlunoRepository = require('../persistence/AlunoRepository');
const RegraDeNegocioException = require('../exceptions/RegraDeNegocioException');

class TurmaService {
  async criarTurma(dadosTurma) {
    // CORREÇÃO: Removida a validação de disciplina, pois não temos mais o id_disciplina.
    // A lógica de negócio agora é mais simples.
    return await TurmaRepository.criar(dadosTurma);
  }

  async buscarTurma(id_turma) {
    const turma = await TurmaRepository.buscarPorId(id_turma);
    if (!turma) {
      throw new RegraDeNegocioException('Turma não encontrada.');
    }
    return turma;
  }

  // NOVO MÉTODO
  async buscarTodasTurmas() {
    // Por enquanto, não há regras de negócio complexas,
    // então apenas repassamos a chamada para o repositório.
    return await TurmaRepository.buscarTodas();
  }

  // O restante dos métodos (adicionarAluno, removerAluno) pode continuar igual,
  // pois a lógica de validação deles ainda é válida.
  async adicionarAluno(id_turma, matricula_aluno) {
    const turma = await this.buscarTurma(id_turma); // Usa o buscarTurma já corrigido
    const aluno = await AlunoRepository.buscarPorMatricula(matricula_aluno);
    if (!aluno) {
      throw new RegraDeNegocioException('Aluno não encontrado.');
    }

    const alunoJaNaTurma = turma.alunos.some(a => a.matricula_aluno.toString() === aluno.matricula_aluno.toString());
    if (alunoJaNaTurma) {
      throw new RegraDeNegocioException('Este aluno já está na turma.');
    }

    await TurmaRepository.adicionarAluno(id_turma, matricula_aluno);
    return this.buscarTurma(id_turma);
  }

  async removerAluno(id_turma, matricula_aluno) {
    await this.buscarTurma(id_turma);
    const aluno = await AlunoRepository.buscarPorMatricula(matricula_aluno);
    if (!aluno) {
      throw new RegraDeNegocioException('Aluno não encontrado.');
    }
    
    const sucesso = await TurmaRepository.removerAluno(id_turma, matricula_aluno);
    if (!sucesso) {
      throw new RegraDeNegocioException('O aluno informado não faz parte desta turma.');
    }
    return this.buscarTurma(id_turma);
  }
}

module.exports = new TurmaService();