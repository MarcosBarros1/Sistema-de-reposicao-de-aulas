// src/constants/SolicitacaoStatus.js

/**
 * @enum {string}
 * @description Enumeração para os possíveis status de uma solicitação de reposição.
 * Usado no frontend para consistência com o backend.
 */
export const SolicitacaoStatus = Object.freeze({
  PENDENTE: 'PENDENTE',
  AGUARDANDO_APROVACAO: 'AGUARDANDO_APROVACAO',
  AUTORIZADA: 'AUTORIZADA',
  NEGADA: 'NEGADA',
  CONCLUIDA: 'CONCLUIDA',
});