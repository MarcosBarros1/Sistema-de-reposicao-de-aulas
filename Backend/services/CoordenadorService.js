// services/CoordenadorService.js

const CoordenadorRepository = require('../persistence/CoordenadorRepository');
const UsuarioRepository = require('../persistence/UsuarioRepository');
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
   * Avalia uma solicitação de reposição. (RF10)
   */
  async avaliarSolicitacao(idSolicitacao, decisao, comentario) {
    // TODO: Implementar lógica
    // 1. Buscar a solicitação pelo ID.
    // 2. Verificar se o status da solicitação permite avaliação.
    // 3. Atualizar o status da solicitação com a decisão e comentário.
    // 4. Se aprovado, disparar notificações para professor, turma e nutricionista (RF11).
    // 5. Se reprovado, notificar o professor (RF10.1).
    console.log(`Avaliando solicitação ${idSolicitacao} com decisão: ${decisao}`);
  }

  /**
   * Cadastra uma nova turma no sistema. (RF05)
   */
  async cadastrarTurma(dadosTurma) {
    // TODO: Implementar lógica
    // 1. Validar os dados da turma.
    // 2. Chamar o TurmaRepository para salvar a turma e suas disciplinas/horários.
    console.log('Cadastrando nova turma:', dadosTurma);
  }

  // ... outros métodos de serviço para as demais responsabilidades do coordenador.
}

module.exports = new CoordenadorService();