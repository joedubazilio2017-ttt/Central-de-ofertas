// Busca ofertas na Shopee.
//
// Enquanto SHOPEE_APP_ID / SHOPEE_APP_SECRET não estiverem configurados
// (aguardando aprovação da Shopee), usa dados mock. Assim que a Shopee
// liberar as credenciais, defina as duas variáveis de ambiente na Vercel
// e o sistema passa a tentar a chamada real automaticamente — sem precisar
// mexer no restante do fluxo (dedupe.js, /api/mine-offers).
//
// PENDENTE DE CONFIRMAÇÃO: a query GraphQL abaixo (nome da operação,
// campos do retorno) é um placeholder. Assim que tiver acesso à
// documentação oficial (liberada junto com o App ID), troque a `query`
// e o mapeamento de `dados` para bater com o schema real da Shopee.
// O formato de saída da função (produto_id_externo, nome, loja,
// preco_anterior, preco_atual, link, origem) deve continuar igual,
// pra não quebrar dedupe.js nem a rota /api/mine-offers.

import { shopeeGraphqlRequest, shopeeApiConfigurada } from "./shopee-client";

async function buscarOfertasShopeeMock() {
  const ofertasMock = [
    {
      produto_id_externo: "shopee-mock-1001",
      nome: "Fone de Ouvido Bluetooth TWS com Case Carregador",
      loja: "Shopee",
      preco_anterior: 89.9,
      preco_atual: 34.9,
      link: "https://shopee.com.br/produto-mock-1001",
    },
    {
      produto_id_externo: "shopee-mock-1002",
      nome: "Organizador de Cabos Magnético Kit 5un",
      loja: "Shopee",
      preco_anterior: 29.9,
      preco_atual: 14.9,
      link: "https://shopee.com.br/produto-mock-1002",
    },
    {
      produto_id_externo: "shopee-mock-1003",
      nome: "Luminária de Mesa LED Touch 3 Tons",
      loja: "Shopee",
      preco_anterior: 59.9,
      preco_atual: 27.9,
      link: "https://shopee.com.br/produto-mock-1003",
    },
  ];

  return ofertasMock.map((oferta) => ({ ...oferta, origem: "shopee" }));
}

async function buscarOfertasShopeeReal() {
  // TODO: confirmar nome da query/campos com a documentação oficial
  // assim que ela for liberada. Isto é um placeholder de formato.
  const query = `
    query OfertasShopee {
      productOfferV2 {
        nodes {
          itemId
          productName
          priceMin
          offerLink
        }
      }
    }
  `;

  const dados = await shopeeGraphqlRequest(query);
  const nodes = dados?.productOfferV2?.nodes || [];

  return nodes.map((item) => ({
    produto_id_externo: String(item.itemId),
    nome: item.productName,
    loja: "Shopee",
    preco_anterior: null, // TODO: confirmar campo de preço "de" no schema real
    preco_atual: Number(item.priceMin),
    link: item.offerLink,
    origem: "shopee",
  }));
}

export async function buscarOfertasShopee() {
  if (shopeeApiConfigurada()) {
    return buscarOfertasShopeeReal();
  }
  return buscarOfertasShopeeMock();
}
