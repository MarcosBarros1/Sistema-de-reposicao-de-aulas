// services/DisciplinaService.js

const Disciplina = require('../model/Disciplina');
const DisciplinaRepository = require('../persistence/DisciplinaRepository');

class DisciplinaService {
  /**
   * Cria uma nova disciplina
   * @param {Object} dados
   * @returns {Promise<Disciplina>}
   */
  async criarDisciplina(dados) {
    // validações simples
    if (!dados.codigo || !dados.nome || !dados.cargaHoraria) {
      throw new Error('Campos obrigatórios não informados.');
    }

    // instancia a disciplina
    const disciplina = new Disciplina(
      null,
      dados.codigo,
      dados.nome,
      dados.cargaHoraria,
      dados.professores || []
    );

    return await DisciplinaRepository.salvar(disciplina);
  }

  /**
   * Busca disciplina pelo código
   * @param {string} codigo
   * @returns {Promise<Disciplina|null>}
   */
  async buscarPorCodigo(codigo) {
    return await DisciplinaRepository.buscarPorCodigo(codigo);
  }

  /**
   * Lista todas as disciplinas
   * @returns {Promise<Disciplina[]>}
   */
  async listarTodos() {
    return await DisciplinaRepository.listarTodos();
  }
}

module.exports = new DisciplinaService();
