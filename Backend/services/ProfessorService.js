// services/ProfessorService.js

const ProfessorRepository = require('../persistence/ProfessorRepository');
const UsuarioRepository = require('../persistence/UsuarioRepository');
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

  /**
   * Lógica para um professor solicitar uma reposição de aula.
   * (RF07, RF08)
   */
  async solicitarReposicao(idProfessor, dadosReposicao) {
    // TODO: Implementar lógica de negócio para criar uma solicitação.
    // 1. Buscar o professor para garantir que ele existe (usar ProfessorRepository).
    // 2. Validar se os dados da reposição são válidos (horário, turma, etc.).
    // 3. Chamar o SolicitacaoRepository para salvar a nova solicitação.
    // 4. Disparar o envio do formulário por e-mail para a turma.
    console.log(`Solicitando reposição para o professor ${idProfessor} com os dados:`, dadosReposicao);
  }
}

module.exports = new ProfessorService();