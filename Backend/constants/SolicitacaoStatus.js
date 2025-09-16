// constants/SolicitacaoStatus.js
// Conceito de POO utilzado: Enum

/**
 * @enum {string}
 * @description Enumeração para os possíveis status de uma solicitação de reposição.
 */
const SolicitacaoStatus = Object.freeze({
  PENDENTE: 'Pendente',
  AGUARDANDO_APROVACAO: 'Aguardando_aprovacao',
  AUTORIZADA: 'Autorizada',
  NEGADA: 'Negada',
  CONCLUIDA: 'Concluída',
});

module.exports = SolicitacaoStatus;