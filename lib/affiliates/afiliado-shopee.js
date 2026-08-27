// Converte o link bruto do produto em link de afiliado.
//
// Enquanto SHOPEE_APP_ID / SHOPEE_APP_SECRET não estiverem configurados,
// usa o mock (parâmetro ?af_id=). Assim que a Shopee liberar as
// credenciais, define as variáveis de ambiente na Vercel e o sistema
// passa a tentar a mutation real automaticamente.
//
// PENDENTE DE CONFIRMAÇÃO: nome da mutation e dos campos abaixo
// (generateShortLink) é um placeholder — confirmar com a documentação
// oficial assim que liberada.

import { shopeeGraphqlRequest, shopeeApiConfigurada } from "./shopee-client";

const AFFILIATE_ID_PLACEHOLDER = process.env.SHOPEE_AFFILIATE_ID || "SEU_ID_AQUI";

function gerarLinkAfiliadoMock(linkOriginal) {
  try {
    const url = new URL(linkOriginal);
    url.searchParams.set("af_id", AFFILIATE_ID_PLACEHOLDER);
    return url.toString();
  } catch {
    return linkOriginal;
  }
}

async function gerarLinkAfiliadoReal(linkOriginal) {
  // TODO: confirmar nome da mutation/campos com a documentação oficial.
  const query = `
    mutation GerarLinkAfiliado($link: String!) {
      generateShortLink(originUrl: $link) {
        shortLink
      }
    }
  `;

  const dados = await shopeeGraphqlRequest(query, { link: linkOriginal });
  return dados?.generateShortLink?.shortLink || linkOriginal;
}

export async function gerarLinkAfiliadoShopee(linkOriginal) {
  if (!linkOriginal) return linkOriginal;

  if (shopeeApiConfigurada()) {
    try {
      return await gerarLinkAfiliadoReal(linkOriginal);
    } catch {
      // se a chamada real falhar, não trava o fluxo — cai pro mock
      return gerarLinkAfiliadoMock(linkOriginal);
    }
  }

  return gerarLinkAfiliadoMock(linkOriginal);
}
