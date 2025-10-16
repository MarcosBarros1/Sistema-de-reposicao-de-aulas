// services/AuthService.js

const ProfessorRepository = require('../persistence/ProfessorRepository');
const CoordenadorRepository = require('../persistence/CoordenadorRepository');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const AutenticacaoInvalidaException = require('../exceptions/AutenticacaoInvalidaException');

class AutenticacaoService {

  async login(email, senha) {
    let usuario = null;
    let tipo = null; // Variável para armazenar o tipo de usuário

    // 1. Procura o usuário como Professor
    usuario = await ProfessorRepository.buscarPorEmail(email);
    if (usuario) {
      tipo = 'professor';
    } else {
      // 2. Se não for Professor, procura como Coordenador
      usuario = await CoordenadorRepository.buscarPorEmail(email);
      if (usuario) {
        tipo = 'coordenador';
      }
    }

    // Mensagem genérica para usuário não encontrado ou senha incorreta
    const erroLogin = () => {
      throw new AutenticacaoInvalidaException('E-mail ou senha inválidos.');
    };

    // 3. Se nenhum usuário for encontrado, lança o erro
    if (!usuario) {
      erroLogin();
    }

    // 4. Compara a senha enviada com a senha armazenada no banco
    const senhaValida = await bcrypt.compare(senha, usuario.senha);

    // 5. Se a senha for inválida, lança o mesmo erro
    if (!senhaValida) {
      erroLogin();
    }

    // 6. Se a autenticação for bem-sucedida, gera o token JWT
    const payload = {
      id: usuario.id_usuario,
      // Usamos o operador de coalescência nula para pegar a matrícula correta
      matricula: usuario.matricula_professor ?? usuario.matricula_coordenador,
      nome: usuario.nome,
      email: usuario.email,
      tipo: tipo,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '8h',
    });

    return { token, usuario: payload };
  }
}

module.exports = new AutenticacaoService();