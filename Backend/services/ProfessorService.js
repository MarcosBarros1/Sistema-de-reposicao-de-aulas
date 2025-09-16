// services/ProfessorService.js

const ProfessorRepository = require('../persistence/ProfessorRepository');
const UsuarioRepository = require('../persistence/UsuarioRepository');
const TurmaRepository = require('../persistence/TurmaRepository');
const SolicitacaoReposicaoRepository = require('../persistence/SolicitacaoReposicaoRepository');
const EmailService = require('./EmailService');
const SolicitacaoStatus = require('../constants/SolicitacaoStatus')
const bcrypt = require('bcrypt');
const { RegraDeNegocioException } = require('../exceptions/RegraDeNegocioException');

/**
 * Camada de Serviço para a lógica de negócio de Professores.
 */

class ProfessorService {

  /**
   * Orquestra o cadastro de um novo professor, aplicando as regras de negócio.
   * @param {object} dadosProfessor - Dados do professor vindo do Controller { nome, email, matricula, senha, disciplinas }.
   * @returns {Promise<Professor>} O objeto do novo professor, sem a senha.
   */
  async cadastrarProfessor(dadosProfessor) {
    // 1. Validação da regra de negócio: Verificar se o e-mail já existe
    const usuarioExistente = await UsuarioRepository.buscarPorEmail(dadosProfessor.email);
    if (usuarioExistente) {
      // Lança um erro de negócio específico
      throw new RegraDeNegocioException('O e-mail informado já está em uso.');
    }

    // 2. Lógica de negócio: Criptografar a senha
    const salt = await bcrypt.genSalt(10);
    const senhaHash = await bcrypt.hash(dadosProfessor.senha, salt);

    const dadosParaSalvar = {
      ...dadosProfessor,
      senha: senhaHash // Substitui a senha original pela versão criptografada
    };

    // 3. Delegação: Pede para a camada de persistência salvar os dados
    const novoProfessor = await ProfessorRepository.salvar(dadosParaSalvar);

    // 4. Regra de apresentação: Nunca retornar a senha (mesmo o hash) para o controller
    delete novoProfessor.senha;

    return novoProfessor;
  }

  async buscarPorMatricula(matricula) {
    const professor = await ProfessorRepository.buscarPorMatricula(matricula);
    if (professor) {
      delete professor.senha;
    }
    return professor;
  }

  async buscarTodos() {
    const professores = await ProfessorRepository.buscarTodos();
    // Remover a senha de todos os objetos antes de retornar
    professores.forEach(p => delete p.senha);
    return professores;
  }

  async atualizarProfessor(matricula, dados) {
    const professorAtualizado = await ProfessorRepository.atualizar(matricula, dados);
    if (professorAtualizado) {
      delete professorAtualizado.senha;
    }
    return professorAtualizado;
  }

  async deletarProfessor(matricula) {
    return await ProfessorRepository.deletarPorMatricula(matricula);
  }

  /**
   * Inicia o processo de solicitação de reposição, criando o registro
   * e enviando os e-mails de convocação para os alunos da turma.
   * @param {object} dadosSolicitacao - { motivo, data, horario, sala, qt_alunos, idTurma, idProfessor }
   */
  async iniciarSolicitacaoReposicao(dados_solicitacao) {
    // 1. Cria a solicitação de reposição no banco com status PENDENTE
    const nova_solicitacao = await SolicitacaoReposicaoRepository.salvar({
      ...dados_solicitacao,
      status: SolicitacaoStatus.PENDENTE
    });

    // 2. Busca todos os alunos da turma informada
    const alunos_da_turma = await TurmaRepository.buscarAlunosPorTurmaId(dados_solicitacao.idTurma);
    if (alunos_da_turma.length === 0) {
      console.log(`Nenhum aluno encontrado para a turma ${dados_solicitacao.idTurma}. Nenhum e-mail enviado.`);
      return nova_solicitacao;
    }

    // 3. Preparar e enviar um e-mail para cada aluno
    for (const aluno of alunos_da_turma) {
      // Monta o link dinâmico com os dados reais
      const link_formulario =
        `https://docs.google.com/forms/d/e/1FAIpQLSdKSi1MRhtkEYlPA7kib63xXcqVMhzffwvkUy41MWmZG39g2Q/viewform?usp=pp_url` +
        `&entry.1310486159=${nova_solicitacao.idSolicitacao}` + // Campo para o ID da Solicitação
        `&entry.476576271=${aluno.matricula_aluno}`;           // Campo para a Matrícula do Aluno

      const subject = `Convite para Aula de Reposição`;
      const html = `
        <p>Olá, ${aluno.nome},</p>
        <p>Uma aula de reposição foi proposta para sua turma com os seguintes detalhes:</p>
        <ul>
          <li><strong>Data:</strong> ${new Date(nova_solicitacao.data).toLocaleDateString('pt-BR')}</li>
          <li><strong>Horário:</strong> ${nova_solicitacao.horario}</li>
          <li><strong>Sala:</strong> ${nova_solicitacao.sala}</li>
        </ul>
        <p>Por favor, confirme sua presença ou ausência através do formulário abaixo. Sua resposta é muito importante!</p>
        <p><a href="${link_formulario}">Responder Formulário</a></p>
      `;

      await EmailService.enviarEmail({
        to: aluno.email,
        subject: subject,
        html: html
      });
    }

    return nova_solicitacao;
  }
}

module.exports = new ProfessorService();