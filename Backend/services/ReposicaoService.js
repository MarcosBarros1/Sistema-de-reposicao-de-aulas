// services/ReposicaoService.js

const AssinaturaRepository = require('../persistence/AssinaturaRepository');
const SolicitacaoReposicao = require('../model/SolicitacaoReposicao');
const SolicitacaoReposicaoRepository = require('../persistence/SolicitacaoReposicaoRepository');
const SolicitacaoStatus = require('../constants/SolicitacaoStatus');
const TurmaRepository = require('../persistence/TurmaRepository');
const NotificacaoRepository = require('../persistence/NotificacaoRepository');
const CoordenadorRepository = require('../persistence/CoordenadorRepository');
const EmailService = require('./EmailService');

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


  async registrar_assinatura(dados_assinatura) {
    await AssinaturaRepository.salvar({
      idSolicitacao: dados_assinatura.id_solicitacao,
      matriculaAluno: dados_assinatura.matricula_aluno,
      concorda: dados_assinatura.concorda 
    });

    if (dados_assinatura.concorda === true) {
      await SolicitacaoReposicaoRepository.incrementar_alunos_concordantes(dados_assinatura.idSolicitacao);
    }

    const solicitacao = await SolicitacaoReposicaoRepository.buscarPorId(dadosAssinatura.idSolicitacao);
    if (!solicitacao) throw new Error('Solicitação não encontrada');

    const alunosDaTurma = await TurmaRepository.buscarAlunosPorTurmaId(solicitacao.idTurma);
    const totalAlunos = alunosDaTurma.length;
    if (totalAlunos === 0) return; // Evita divisão por zero

    const total_concordancias = solicitacao.qt_alunos;
    const porcentagem = (total_concordancias / totalAlunos) * 100;

    if (porcentagem >= 75) {
      await SolicitacaoReposicaoRepository.atualizarStatus(solicitacao.idSolicitacao, 'AGUARDANDO_APROVACAO');

      const coordenador = await CoordenadorRepository.buscarUmCoordenador(); // Chamada corrigida
      if (coordenador) {
        await NotificacaoRepository.salvar({
          mensagem: `A solicitação de reposição #${solicitacao.idSolicitacao} atingiu 75% de concordância e aguarda sua aprovação.`,
          idDestinatario: coordenador.idUsuario
        });
      }
    }

    return { message: 'Assinatura registrada com sucesso.' };
  }
}

module.exports = new ReposicaoService();
