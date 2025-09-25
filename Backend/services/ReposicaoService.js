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


  async registrarAssinatura(dados_assinatura) {
    // 1. Salva a resposta do aluno na tabela de assinaturas.
    // O AssinaturaRepository espera { idSolicitacao, matriculaAluno, concorda }
    // então fazemos a "tradução" aqui.
    await AssinaturaRepository.salvar({
      idSolicitacao: dados_assinatura.id_solicitacao,
      matriculaAluno: dados_assinatura.matricula_aluno,
      concorda: dados_assinatura.concorda
    });

    // 2. Se o aluno concordou, incrementa o contador principal
    if (dados_assinatura.concorda === true) {
      await SolicitacaoReposicaoRepository.incrementar_alunos_concordantes(dados_assinatura.id_solicitacao);
    }

    // 3. Após registrar e incrementar, verifica o quórum
    // Usamos o id_solicitacao (snake_case) que veio corretamente nos dados
    const solicitacao = await SolicitacaoReposicaoRepository.buscarPorId(dados_assinatura.id_solicitacao);
    if (!solicitacao) {
      // Esta é a linha que estava dando erro. Agora deve funcionar.
      throw new Error('Solicitação não encontrada');
    }

    const alunos_da_turma = await TurmaRepository.buscarAlunosPorTurmaId(solicitacao.idTurma);
    const total_alunos = alunos_da_turma.length;
    if (total_alunos === 0) return;

    // A contagem de concordâncias agora vem direto do contador da solicitação, que foi atualizado
    const total_concordancias = solicitacao.qt_alunos;
    const porcentagem = (total_concordancias / total_alunos) * 100;

    if (porcentagem >= 75) {
      await SolicitacaoReposicaoRepository.atualizarStatus(solicitacao.idSolicitacao, 'AGUARDANDO_APROVACAO');

      const coordenador = await CoordenadorRepository.buscarUmCoordenador();
      if (coordenador) {
        await NotificacaoRepository.salvar({
          mensagem: `A solicitação de reposição #${solicitacao.idSolicitacao} atingiu 75% de concordância e aguarda sua aprovação.`,
          idDestinatario: coordenador.idUsuario
        });
      }
    }

    return { message: 'Assinatura registrada com sucesso.' };
  }

  async buscarAssinaturas(id_solicitacao) {
    const solicitacao = await SolicitacaoReposicaoRepository.buscarPorId(id_solicitacao);
    if (!solicitacao || !solicitacao.idTurma) {
      return null; // Retorna nulo se a solicitação não existir ou não tiver turma
    }

    // Busca todos os alunos da turma
    const alunosDaTurma = await TurmaRepository.buscarAlunosPorTurmaId(solicitacao.idTurma);
    const totalAlunos = alunosDaTurma.length;

    // Busca as assinaturas que já foram feitas para esta solicitação
    const concordancias = await AssinaturaRepository.contarConcordancias(id_solicitacao);

    // Calcula as estatísticas
    const stats = {
      presentes: concordancias, // ou "concordaram"
      ausentes: 0, // A lógica de ausentes precisaria ser definida (ex: alunos que não concordaram)
      pendentes: totalAlunos - concordancias // Alunos que ainda não assinaram
    };

    const dadosCompletos = {
      reposicao: {
        disciplina: solicitacao.disciplina, // Supondo que o repositório retorne isso
        data: solicitacao.data
      },
      alunos: alunosDaTurma,
      stats: stats
    };

    return dadosCompletos;
  }

  async buscar_pendentes_aprovacao() {
    return await SolicitacaoReposicaoRepository.buscar_pendentes_aprovacao();
  }
}

module.exports = new ReposicaoService();
