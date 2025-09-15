// services/ReposicaoService.js

const SolicitacaoReposicao = require('../model/SolicitacaoReposicao');
const SolicitacaoReposicaoRepository = require('../persistence/SolicitacaoReposicaoRepository');
const SolicitacaoStatus = require('../constants/SolicitacaoStatus');

class ReposicaoService {
  /**
   * Cria uma nova solicitação de reposição
   * @param {Object} dados - Dados vindos do controller
   * @returns {Promise<SolicitacaoReposicao>}
   */
  async criarSolicitacao(dados) {
    const solicitacao = new SolicitacaoReposicao(
      null, // id gerado pelo banco
      dados.motivo,
      SolicitacaoStatus.PENDENTE, // sempre começa como pendente
      dados.data,
      dados.horario,
      dados.sala,
      dados.qtAlunos,
      dados.idProfessor,
      dados.idTurma
    );

    return await SolicitacaoReposicaoRepository.salvar(solicitacao);
  }

  /**
   * Atualiza o status de uma solicitação
   * @param {number} id - ID da solicitação
   * @param {string} novoStatus - Novo status (usar SolicitacaoStatus)
   * @returns {Promise<SolicitacaoReposicao|null>}
   */
  async atualizarStatus(id, novoStatus) {
    return await SolicitacaoReposicaoRepository.atualizarStatus(id, novoStatus);
  }

  /**
   * Busca uma solicitação pelo ID
   * @param {number} id - ID da solicitação
   * @returns {Promise<SolicitacaoReposicao|null>}
   */
  async buscarPorId(id) {
    return await SolicitacaoReposicaoRepository.buscarPorId(id);
  }

  /**
   * Lista todas as solicitações
   * @returns {Promise<SolicitacaoReposicao[]>}
   */
  async listarTodos() {
    return await SolicitacaoReposicaoRepository.listarTodos();
  }

  /**
   * Registra a assinatura de um aluno e verifica se o quórum foi atingido.
   * @param {object} dadosAssinatura - { idSolicitacao, matriculaAluno, concorda }
   */
  async registrarAssinatura(dadosAssinatura) {
    // 1. Salva a resposta do aluno no banco de dados
    await AssinaturaRepository.salvar(dadosAssinatura);

    // 2. Após salvar, verifica o quórum (RN02)
    const solicitacao = await SolicitacaoReposicaoRepository.buscarPorId(dadosAssinatura.idSolicitacao);
    if (!solicitacao) throw new Error('Solicitação não encontrada');

    // 3. Busca o total de alunos na turma
    const alunosDaTurma = await TurmaRepository.buscarAlunosPorTurmaId(solicitacao.idTurma);
    const totalAlunos = alunosDaTurma.length;

    // 4. Busca o total de assinaturas de concordância
    // (Precisaríamos de um novo método no AssinaturaRepository para contar as assinaturas 'true')
    // Por simplicidade, vamos imaginar que ele retorna um número.
    const totalConcordancias = await AssinaturaRepository.contarConcordancias(solicitacao.idSolicitacao); // Método a ser criado

    // 5. Calcula a porcentagem
    const porcentagem = (totalConcordancias / totalAlunos) * 100;

    // 6. Aplica a regra de negócio (RF10)
    if (porcentagem >= 75) {
      // QUÓRUM ATINGIDO!
      // Atualiza o status da solicitação
      await SolicitacaoReposicaoRepository.atualizarStatus(solicitacao.idSolicitacao, 'AGUARDANDO_APROVACAO');

      // Envia notificação para o coordenador
      // (Precisamos buscar o coordenador para saber o id_destinatario)
      const coordenador = await CoordenadorRepository.buscarCoordenadorDoCurso(); // Método a ser criado
      await NotificacaoRepository.salvar({
        mensagem: `A solicitação de reposição #${solicitacao.idSolicitacao} atingiu 75% de concordância e aguarda sua aprovação.`,
        idDestinatario: coordenador.id_usuario
      });
    }

    return { message: 'Assinatura registrada com sucesso.' };
  }
}

module.exports = new ReposicaoService();
