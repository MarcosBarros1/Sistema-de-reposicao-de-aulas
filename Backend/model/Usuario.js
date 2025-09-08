// Classe responsável por representar um Usuário no sistema
class Usuario {
  /**
   * @param {number} idUsuario - Identificador único do usuário.
   * @param {string} nome - Nome do usuário.
   * @param {string} email - E-mail do usuário.
   * @param {string} senha - Senha do usuário.
   * @param {string} tipo - Tipo de usuário (Professor, Coordenador, Aluno).
   */
  constructor(idUsuario, nome, email, senha, tipo) {
    this.idUsuario = idUsuario;
    this.nome = nome;
    this.email = email;
    this.senha = senha;
    this.tipo = tipo;
  }

  // Método para autenticar o usuário
  autenticar() {
    // TODO: Implementar lógica de autenticação
  }

  // Método para realizar o cadastro
  cadastrar() {
    // TODO: Implementar lógica de cadastro
  }
}

module.exports = Usuario;