// constants/SolicitacaoStatus.js
// Conceito de POO utilzado: Enum

/**
 * @enum {string}
 * @description Enumeração para os possíveis status de uma solicitação de reposição.
 */
const SolicitacaoStatus = Object.freeze({
PENDENTE: 'PENDENTE',
  AGUARDANDO_APROVACAO: 'AGUARDANDO_APROVACAO',
  AUTORIZADA: 'AUTORIZADA',
  NEGADA: 'NEGADA',
  CONCLUIDA: 'CONCLUIDA',
});

module.exports = SolicitacaoStatus;