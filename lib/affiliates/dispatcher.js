// Dispara uma legenda formatada pra uma lista de grupos do WhatsApp,
// via uma instância própria da Evolution API rodando num VPS.
//
// VARIÁVEIS DE AMBIENTE NECESSÁRIAS (configurar na Vercel):
// - EVOLUTION_API_URL      → URL base da sua instância, ex: https://evolution.seudominio.com
// - EVOLUTION_API_KEY      → a apikey da sua instância (definida quando você sobe a Evolution API)
// - EVOLUTION_INSTANCE     → o nome da instância conectada ao WhatsApp (ex: "central-ofertas")
// - WHATSAPP_GROUP_IDS     → lista de IDs de grupo separados por vírgula,
//                            no formato JID (ex: "1203630...@g.us,1203987...@g.us")
//                            Pra pegar o ID de um grupo: GET {EVOLUTION_API_URL}/group/fetchAllGroups/{instance}
//                            com header apikey, e usar o campo "id" do grupo desejado.
//
// Enquanto essas variáveis não estiverem configuradas, dispararParaGrupos()
// lança um erro claro em vez de falhar silenciosamente ou travar o fluxo
// de outras partes do sistema.

function lerConfiguracao() {
  const baseUrl = process.env.EVOLUTION_API_URL;
  const apiKey = process.env.EVOLUTION_API_KEY;
  const instance = process.env.EVOLUTION_INSTANCE;
  const gruposRaw = process.env.WHATSAPP_GROUP_IDS;

  if (!baseUrl || !apiKey || !instance || !gruposRaw) {
    throw new Error(
      "Evolution API não configurada. Defina EVOLUTION_API_URL, EVOLUTION_API_KEY, " +
        "EVOLUTION_INSTANCE e WHATSAPP_GROUP_IDS nas variáveis de ambiente da Vercel."
    );
  }

  const grupos = gruposRaw
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);

  return { baseUrl: baseUrl.replace(/\/$/, ""), apiKey, instance, grupos };
}

async function enviarParaUmGrupo({ baseUrl, apiKey, instance }, groupId, legenda) {
  const res = await fetch(`${baseUrl}/message/sendText/${instance}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: apiKey,
    },
    body: JSON.stringify({
      number: groupId,
      text: legenda,
    }),
  });

  if (!res.ok) {
    const corpo = await res.text().catch(() => "");
    throw new Error(
      `Falha ao enviar pro grupo ${groupId}: ${res.status} ${res.statusText} ${corpo}`
    );
  }

  return res.json();
}

// Dispara a legenda pra todos os grupos configurados.
// Retorna um resumo com sucessos e falhas por grupo (não lança erro
// se só alguns grupos falharem — assim um grupo com problema não
// impede o envio pros demais).
export async function dispararParaGrupos(legenda) {
  const config = lerConfiguracao();

  const resultados = await Promise.allSettled(
    config.grupos.map((groupId) => enviarParaUmGrupo(config, groupId, legenda))
  );

  const resumo = resultados.map((resultado, i) => ({
    groupId: config.grupos[i],
    sucesso: resultado.status === "fulfilled",
    erro: resultado.status === "rejected" ? String(resultado.reason) : null,
  }));

  return resumo;
}
