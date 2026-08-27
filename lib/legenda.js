ARQUIVO: lib/legenda.js
AÇÃO: Criar arquivo NOVO nesse caminho
======================================================================

import { getScore } from "@/lib/score";

// Gera um texto pronto pra colar em grupos, a partir de uma promoção salva.
export function gerarLegenda(promo) {
  const score = getScore(promo.desconto_percentual);
  const precoAtual = `R$ ${Number(promo.preco_atual).toFixed(2)}`;
  const precoAnterior = promo.preco_anterior
    ? `De R$ ${Number(promo.preco_anterior).toFixed(2)} por `
    : "";
  const desconto =
    promo.desconto_percentual !== null
      ? ` (${promo.desconto_percentual}% OFF)`
      : "";

  return [
    `${score.emoji} ${score.label.toUpperCase()}!`,
    promo.nome,
    `${precoAnterior}${precoAtual}${desconto}`,
    promo.link ? `👉 ${promo.link}` : null,
  ]
    .filter(Boolean)
    .join("\n");
}
