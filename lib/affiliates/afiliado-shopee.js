// Converte o link bruto do produto em link de afiliado.
//
// MOCK por enquanto: só adiciona um parâmetro de rastreio (?af_id=...)
// pra simular o formato de link de afiliado no fluxo. Quando a Shopee
// liberar App ID + App Secret, troque o corpo desta função pela chamada
// real à API (mutation generateShortLink, GraphQL, autenticada por
// HMAC-SHA256 — ver documentação em open-api.affiliate.shopee.com.br).
//
// O restante do sistema (route.js, dedupe.js, legenda.js) não muda:
// eles só recebem o link já pronto, seja mock ou real.

const AFFILIATE_ID_PLACEHOLDER = process.env.SHOPEE_AFFILIATE_ID || "SEU_ID_AQUI";

export async function gerarLinkAfiliadoShopee(linkOriginal) {
  if (!linkOriginal) return linkOriginal;

  try {
    const url = new URL(linkOriginal);
    url.searchParams.set("af_id", AFFILIATE_ID_PLACEHOLDER);
    return url.toString();
  } catch {
    // link mal formado — devolve como veio, não trava o fluxo
    return linkOriginal;
  }
}
