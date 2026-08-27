// Cliente HTTP genérico pra Shopee Affiliate API (GraphQL).
//
// Isola a parte de autenticação num só lugar, pra shopee.js e
// afiliado-shopee.js só chamarem shopeeGraphqlRequest(query, variables)
// sem se preocupar com assinatura/headers.
//
// ATENÇÃO — CONFIRMAR ANTES DE USAR EM PRODUÇÃO:
// O esquema de assinatura abaixo (SHA256 de AppId + Timestamp + Payload + AppSecret,
// enviado no header Authorization) é o padrão documentado publicamente pela Shopee
// Affiliate Open API, mas a Shopee pode ajustar detalhes (nome exato do header,
// ordem dos campos, formato do timestamp) na documentação que vier junto da
// aprovação do App ID. Assim que a aprovação sair, confira o guia oficial em
// https://open-api.affiliate.shopee.com.br (seção de autenticação) e ajuste
// a função `assinar()` abaixo se algo estiver diferente. O resto do arquivo
// (a chamada fetch em si) não deve precisar mudar.

import crypto from "crypto";

const ENDPOINT = "https://open-api.affiliate.shopee.com.br/graphql";

function estaConfigurado() {
  return Boolean(process.env.SHOPEE_APP_ID && process.env.SHOPEE_APP_SECRET);
}

function assinar(payload, timestamp) {
  const appId = process.env.SHOPEE_APP_ID;
  const appSecret = process.env.SHOPEE_APP_SECRET;
  const base = `${appId}${timestamp}${payload}${appSecret}`;
  return crypto.createHash("sha256").update(base).digest("hex");
}

async function shopeeGraphqlRequest(query, variables = {}) {
  if (!estaConfigurado()) {
    throw new Error(
      "SHOPEE_APP_ID / SHOPEE_APP_SECRET não configurados — ainda não temos acesso à API real da Shopee."
    );
  }

  const appId = process.env.SHOPEE_APP_ID;
  const timestamp = Math.floor(Date.now() / 1000);
  const payload = JSON.stringify({ query, variables });
  const assinatura = assinar(payload, timestamp);

  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `SHA256 Credential=${appId}, Timestamp=${timestamp}, Signature=${assinatura}`,
    },
    body: payload,
  });

  const data = await res.json();

  if (!res.ok || data.errors) {
    throw new Error(
      "Erro na chamada à Shopee Affiliate API: " +
        (data.errors ? JSON.stringify(data.errors) : res.statusText)
    );
  }

  return data.data;
}

export { shopeeGraphqlRequest, estaConfigurado as shopeeApiConfigurada };
