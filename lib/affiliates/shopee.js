// MOCK — troque o conteúdo desta função pela chamada real à Shopee
// Affiliate API (GraphQL, https://open-api.affiliate.shopee.com.br/graphql)
// assim que App ID e App Secret forem liberados.
//
// O formato de retorno abaixo já é o formato final esperado pelo resto
// do sistema (dedupe.js e a rota /api/mine-offers), então trocar o mock
// pela chamada real não deve exigir mudar mais nada no fluxo — só essa
// função por dentro.

export async function buscarOfertasShopee() {
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
