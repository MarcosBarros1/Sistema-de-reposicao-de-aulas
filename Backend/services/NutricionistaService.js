// services/NutricionistaService.js

const NutricionistaRepository = require('../persistence/NutricionistaRepository');
const RegraDeNegocioException = require('../exceptions/RegraDeNegocioException');

class NutricionistaService {
  async criarNutricionista(dadosNutricionista) {
    // REGRA: O e-mail não pode estar em uso.
    const emailExistente = await NutricionistaRepository.buscarPorEmail(dadosNutricionista.email);
    if (emailExistente) {
      throw new RegraDeNegocioException('O e-mail informado já está em uso.');
    }
    return await NutricionistaRepository.criar(dadosNutricionista);
  }

  async atualizarNutricionista(id_nutricionista, dadosNutricionista) {
    // REGRA: A nutricionista deve existir para ser atualizada.
    const nutricionistaAtual = await NutricionistaRepository.buscarPorId(id_nutricionista);
    if (!nutricionistaAtual) {
      throw new RegraDeNegocioException('Nutricionista não encontrada.');
    }

    // REGRA: O novo e-mail não pode pertencer a OUTRA nutricionista.
    const emailExistente = await NutricionistaRepository.buscarPorEmail(dadosNutricionista.email);
    if (emailExistente && emailExistente.id_nutricionista.toString() !== id_nutricionista.toString()) {
      throw new RegraDeNegocioException('O e-mail informado já está em uso por outro registro.');
    }

    return await NutricionistaRepository.atualizar(id_nutricionista, dadosNutricionista);
  }
}

module.exports = new NutricionistaService();