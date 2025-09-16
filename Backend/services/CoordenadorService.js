// services/CoordenadorService.js

const CoordenadorRepository = require('../persistence/CoordenadorRepository');
const UsuarioRepository = require('../persistence/UsuarioRepository');
const SolicitacaoReposicaoRepository = require('../persistence/SolicitacaoReposicaoRepository');
const ProfessorRepository = require('../persistence/ProfessorRepository');
const TurmaRepository = require('../persistence/TurmaRepository');
const EmailService = require('./EmailService');
const bcrypt = require('bcrypt');
const { RegraDeNegocioException } = require('../exceptions/RegraDeNegocioException');

/**
 * Camada de Serviço para a lógica de negócio de Coordenadores.
 */
class CoordenadorService {

  /**
   * Orquestra o cadastro de um novo coordenador.
   * @param {object} dadosCoordenador - Dados do coordenador { nome, email, matricula, senha, departamento }.
   * @returns {Promise<Coordenador>} O objeto do novo coordenador, sem a senha.
   */
  async cadastrarCoordenador(dadosCoordenador) {
    // 1. Validação da regra de negócio: Verificar se o e-mail já existe
    const usuarioExistente = await UsuarioRepository.buscarPorEmail(dadosCoordenador.email);
    if (usuarioExistente) {
      throw new RegraDeNegocioException('O e-mail informado já está em uso.');
    }

    // 2. Lógica de negócio: Criptografar a senha
    const salt = await bcrypt.genSalt(10);
    const senhaHash = await bcrypt.hash(dadosCoordenador.senha, salt);

    const dadosParaSalvar = {
      ...dadosCoordenador,
      senha: senhaHash
    };

    // 3. Delegação: Pede para a camada de persistência salvar
    const novoCoordenador = await CoordenadorRepository.salvar(dadosParaSalvar);

    // 4. Regra de apresentação: Nunca retornar a senha
    delete novoCoordenador.senha;

    return novoCoordenador;
  }

  async buscarPorMatricula(matricula) {
    const coordenador = await CoordenadorRepository.buscarPorMatricula(matricula);
    if (coordenador) {
      delete coordenador.senha;
    }
    return coordenador;
  }

  async buscarTodos() {
    const coordenadores = await CoordenadorRepository.buscarTodos();
    coordenadores.forEach(c => delete c.senha);
    return coordenadores;
  }

  async atualizarCoordenador(matricula, dados) {
    // Validação básica para garantir que campos essenciais não sejam nulos
    if (!dados.nome || !dados.email || !dados.departamento) {
      throw new Error('Nome, email e departamento são obrigatórios para atualização.');
    }
    const coordenadorAtualizado = await CoordenadorRepository.atualizar(matricula, dados);
    if (coordenadorAtualizado) {
      delete coordenadorAtualizado.senha;
    }
    return coordenadorAtualizado;
  }

  async deletarCoordenador(matricula) {
    return await CoordenadorRepository.deletarPorMatricula(matricula);
  }

  /**
   * Notifica um professor sobre uma ausência e envia o link para o formulário de reposição.
   * (RF07)
   * @param {number} matriculaProfessor - A matrícula do professor a ser notificado.
   * @returns {Promise<void>}
   */
  async notificarFalta(matriculaProfessor) {
    // 1. Buscar os dados do professor para obter o e-mail
    const professor = await ProfessorRepository.buscarPorMatricula(matriculaProfessor);
    if (!professor) {
      throw new Error('Professor não encontrado.');
    }

    // 2. Preparar o conteúdo do e-mail
    const linkFront = `https://docs.google.com/forms/d/e/1FAIpQLSfLNxEnLQOkrJbeBvb45yGeEqzONmLKsy2iUI7APh_hd7J8og/viewform?usp=header`;

    const subject = 'Notificação de Ausência e Solicitação de Reposição';
    const text = `
      Olá, Prof(a). ${professor.nome},

      Constatamos sua ausência na data de hoje.
      Por favor, acesse o link abaixo e faça uma solicitação de repoisção da aula:
      ${linkFront}

      Atenciosamente,
      Coordenação - Sistema de Reposição de Aulas.
    `;
    const html = `
      <p>Olá, Prof(a). <strong>${professor.nome}</strong>,</p>
      <p>Constatamos sua ausência na data de hoje.</p>
      <p>Por favor, acesse o link abaixo e faça uma solicitação de repoisção da aula:</p>
      <p><a href="${linkFront}">Sistema de reposição de aulas</a></p>
      <br>
      <p>Atenciosamente,</p>
      <p><strong>Coordenação - Sistema de Reposição de Aulas.</strong></p>
    `;

    // 3. Chamar o EmailService para enviar o e-mail
    await EmailService.enviarEmail({
      to: professor.email,
      subject: subject,
      text: text,
      html: html,
    });
  }

  /**
   * Avalia uma solicitação de reposição. (RF10)
   */
  async avaliar_solicitacao(id_solicitacao, nova_decisao, comentario) {
    // 1. Buscar a solicitação para garantir que ela existe e está no status correto
    const solicitacao = await SolicitacaoReposicaoRepository.buscarPorId(id_solicitacao);
    if (!solicitacao) {
      throw new Error('Solicitação de reposição não encontrada.');
    }
    if (solicitacao.status !== SolicitacaoStatus.AGUARDANDO_APROVACAO) {
      throw new Error(`Esta solicitação não pode ser avaliada, pois seu status atual é '${solicitacao.status}'.`);
    }

    // 2. Atualizar o status da solicitação no banco de dados
    await SolicitacaoReposicaoRepository.atualizarStatus(id_solicitacao, nova_decisao);

    // 3. Buscar dados adicionais para os e-mails
    const professor = await ProfessorRepository.buscarPorMatricula(solicitacao.idProfessor);
    const alunos = await TurmaRepository.buscarAlunosPorTurmaId(solicitacao.idTurma);
    const emails_alunos = alunos.map(aluno => aluno.email);

    // 4. Disparar e-mails com base na decisão
    if (nova_decisao === SolicitacaoStatus.AUTORIZADA) {
      // -- FLUXO DE APROVAÇÃO --
      const assunto = `Reposição Aprovada: Aula do dia ${new Date(solicitacao.data).toLocaleDateDateString('pt-BR')}`;
      const corpo_html_confirmacao = `<p>A aula de reposição solicitada foi <strong>APROVADA</strong>.</p>
                                      <p><strong>Detalhes:</strong></p>
                                      <ul>
                                        <li>Data: ${new Date(solicitacao.data).toLocaleDateString('pt-BR')}</li>
                                        <li>Horário: ${solicitacao.horario}</li>
                                        <li>Sala: ${solicitacao.sala}</li>
                                      </ul>`;

      // E-mail para Professor e Alunos
      await EmailService.enviarEmail({ to: [professor.email, ...emails_alunos], subject: assunto, html: corpo_html_confirmacao });

      // E-mail para Nutricionista (RF11.2)
      await EmailService.enviarEmail({
        to: 'email.nutricionista@ifce.edu.br', // Substituir por um e-mail real
        subject: `Solicitação de Merenda para Reposição`,
        html: `<p>Solicitação de merenda para uma aula de reposição aprovada.</p>
               <p><strong>Detalhes:</strong></p>
               <ul>
                 <li>Data: ${new Date(solicitacao.data).toLocaleDateString('pt-BR')}</li>
                 <li>Horário: ${solicitacao.horario}</li>
                 <li>Quantidade de Alunos: ${solicitacao.qt_alunos}</li>
               </ul>`
      });

    } else { // Se for SolicitacaoStatus.NEGADA
      // -- FLUXO DE NEGAÇÃO --
      const assunto = `Reposição Não Autorizada`;
      const corpo_html_negacao = `<p>A aula de reposição solicitada para o dia ${new Date(solicitacao.data).toLocaleDateString('pt-BR')} foi <strong>NÃO AUTORIZADA</strong>.</p>
                                  <p><strong>Motivo (Coordenador):</strong> ${comentario || 'Não especificado.'}</p>
                                  <p>Por favor, professor, inicie uma nova solicitação com data/horário alternativos.</p>`;

      // E-mail para Professor e Alunos
      await EmailService.enviarEmail({ to: [professor.email, ...emails_alunos], subject: assunto, html: corpo_html_negacao });
    }
  }

}

module.exports = new CoordenadorService();