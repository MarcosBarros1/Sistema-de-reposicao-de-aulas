// services/ReposicaoService.js

const AssinaturaRepository = require('../persistence/AssinaturaRepository');
const SolicitacaoReposicao = require('../model/SolicitacaoReposicao');
const SolicitacaoReposicaoRepository = require('../persistence/SolicitacaoReposicaoRepository');
const SolicitacaoStatus = require('../constants/SolicitacaoStatus');
const TurmaRepository = require('../persistence/TurmaRepository');
const NotificacaoRepository = require('../persistence/NotificacaoRepository');
const CoordenadorRepository = require('../persistence/CoordenadorRepository');
const EmailService = require('./EmailService');
const ProfessorRepository = require('../persistence/ProfessorRepository');

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

  // ... (resto da sua classe ReposicaoService) ...

  async buscarAssinaturas(id_solicitacao) {
    const solicitacao = await SolicitacaoReposicaoRepository.buscarPorId(id_solicitacao);
    if (!solicitacao || !solicitacao.idTurma) {
      return null;
    }

    // A busca por todos os alunos da turma continua igual
    const alunosDaTurma = await TurmaRepository.buscarAlunosPorTurmaId(solicitacao.idTurma);
    const totalAlunos = alunosDaTurma.length;

    // ✅ CORREÇÃO: Buscamos as duas contagens do repositório
    const concordancias = await AssinaturaRepository.contarConcordancias(id_solicitacao);
    const discordancias = await AssinaturaRepository.contarDiscordancias(id_solicitacao);

    // ✅ CORREÇÃO: Usamos os valores reais para calcular as estatísticas
    const stats = {
      presentes: concordancias,
      ausentes: discordancias, // <-- Agora usa o valor real
      pendentes: totalAlunos - (concordancias + discordancias)
    };

    const dadosCompletos = {
      reposicao: {
        disciplina: solicitacao.disciplina,
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

  async buscar_autorizadas() {
    return await SolicitacaoReposicaoRepository.buscar_autorizadas();
  }

  async confirmar_realizacao(id_solicitacao, email_coordenador) {
    // ... (as validações de status e data continuam as mesmas)
    const solicitacao = await SolicitacaoReposicaoRepository.buscarPorId(id_solicitacao);
    if (!solicitacao) {
      throw new RegraDeNegocioException('Solicitação não encontrada.');
    }
    if (solicitacao.status !== SolicitacaoStatus.AUTORIZADA) {
      throw new RegraDeNegocioException(`Ação inválida. A solicitação está com o status '${solicitacao.status}'.`);
    }
    const data_aula = new Date(solicitacao.data);
    const hoje = new Date();
    data_aula.setHours(0, 0, 0, 0);
    hoje.setHours(0, 0, 0, 0);
    if (hoje <= data_aula) {
      throw new RegraDeNegocioException('Você só pode confirmar a realização de uma aula após a data agendada.');
    }

    await SolicitacaoReposicaoRepository.atualizarStatus(id_solicitacao, SolicitacaoStatus.CONCLUIDA);

    // --- LÓGICA DE E-MAIL ATUALIZADA ---
    const email_coordenador_notificacao = email_coordenador;
    const coordenador = await CoordenadorRepository.buscarPorEmail(email_coordenador_notificacao);
    const professor = await ProfessorRepository.buscarPorMatricula(solicitacao.idProfessor);
    // 1. BUSCA OS DADOS DA TURMA
    const turma = await TurmaRepository.buscarPorId(solicitacao.idTurma);

    if (coordenador && professor && turma) {
      const assunto = `Confirmação de Aula de Reposição: ${professor.nome}`;
      // 2. ATUALIZA O CORPO DO E-MAIL
      const corpo_html = `
        <p>Olá, Coordenador(a),</p>
        <p>O professor <strong>${professor.nome}</strong> confirmou a realização da seguinte aula de reposição:</p>
        <ul>
          <li><strong>Data:</strong> ${new Date(solicitacao.data).toLocaleDateString('pt-BR')}</li>
          <li><strong>Horário:</strong> ${solicitacao.horario}</li>
          <li><strong>Turma:</strong> ${turma.nome} (${turma.semestre})</li>
        </ul>
        <p>O status da solicitação #${id_solicitacao} foi atualizado para "Concluída".</p>
        <p><strong>Por favor, acesse o sistema para dar baixa na falta do professor correspondente.</strong></p>
      `;
      await EmailService.enviarEmail({ to: coordenador.email, subject: assunto, html: corpo_html });
    } else {
      console.error(`AVISO: Não foi possível enviar e-mail de notificação. Coordenador, professor ou turma não encontrados.`);
    }
  }
}

module.exports = new ReposicaoService();
