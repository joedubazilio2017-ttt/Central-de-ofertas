import { getScore } from "@/lib/score";

// Frases de chamada usadas no topo da legenda. A escolha é determinística
// por item (baseada no id), então o mesmo item sempre gera a mesma frase
// — evita ficar diferente toda vez que você copiar de novo.
const FRASES_DESTAQUE = [
  "🚨 CORRE QUE ACABA RÁPIDO!",
  "🔥 ACHADO IMPERDÍVEL!",
  "💥 PREÇO ASSIM NÃO DURA!",
  "⚡ OFERTA RELÂMPAGO!",
  "🎯 VALE MUITO A PENA!",
  "🛒 NÃO VAI SE ARREPENDER!",
  "📉 PREÇO DESPENCOU!",
  "✅ OPORTUNIDADE DO DIA!",
];

function escolherFrase(id) {
  if (!id) return FRASES_DESTAQUE[0];
  // hash simples e estável a partir do id, sem dependências externas
  let soma = 0;
  for (const char of String(id)) soma += char.charCodeAt(0);
  return FRASES_DESTAQUE[soma % FRASES_DESTAQUE.length];
}

// Gera um texto pronto pra colar em grupos, no formato:
// 🚨 CORRE QUE ACABA RÁPIDO!
//
// *Nome do produto*
//
// De: ~R$ 65,00~
// Por: R$ 25,85 🔥
//
// 🔗 link
export function gerarLegenda(promo) {
  const score = getScore(promo.desconto_percentual);
  const precoAtual = `R$ ${Number(promo.preco_atual).toFixed(2).replace(".", ",")}`;

  const linhaPreco = promo.preco_anterior
    ? [
        `De: ~R$ ${Number(promo.preco_anterior).toFixed(2).replace(".", ",")}~`,
        `Por: ${precoAtual} ${score.emoji}`,
      ].join("\n")
    : `Por: ${precoAtual} ${score.emoji}`;

  return [
    escolherFrase(promo.id),
    "",
    `*${promo.nome}*`,
    "",
    linhaPreco,
    "",
    promo.link ? `🔗 ${promo.link}` : null,
  ]
    .filter((linha) => linha !== null)
    .join("\n");
}
