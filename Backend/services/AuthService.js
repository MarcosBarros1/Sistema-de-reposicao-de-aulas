// services/AutenticacaoService.js

const ProfessorRepository = require('../persistence/ProfessorRepository');
const CoordenadorRepository = require('../persistence/CoordenadorRepository');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { AutenticacaoInvalidaException } = require('../exceptions/AutenticacaoInvalidaException');

class AutenticacaoService {

  async login(email, senha) {
    // 1. Procura o usuário primeiro como Professor, depois como Coordenador
    let usuario = await ProfessorRepository.buscarPorEmail(email);
    if (!usuario) {
      usuario = await CoordenadorRepository.buscarPorEmail(email);
    }

    // 2. Se não encontrar o usuário por e-mail, lança um erro
    if (!usuario) {
      throw new AutenticacaoInvalidaException('Credenciais inválidas.');
    }

    // 3. Compara a senha enviada com o hash salvo no banco
    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) {
      throw new AutenticacaoInvalidaException('Credenciais inválidas.');
    }

    // 4. Se a senha for válida, gera o Token JWT
    const payload = {
      id: usuario.idUsuario,
      email: usuario.email,
      tipo: usuario.tipo
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '8h' // Token expira em 8 horas
    });

    // 5. Retorna o token e os dados do usuário (sem a senha)
    delete usuario.senha;
    return { token, usuario };
  }
}

module.exports = new AutenticacaoService();