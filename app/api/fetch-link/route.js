ARQUIVO: app/api/fetch-link/route.js
AÇÃO: Criar arquivo NOVO nesse caminho (crie também as pastas api/fetch-link dentro de app, se não existirem)
======================================================================

// Busca metadados públicos (og:title / title) de um link.
// Roda no servidor porque o navegador bloqueia fetch cross-origin (CORS).
// Não usa headless browser — só lê o HTML público da página, então
// funciona bem em sites que renderizam o título no HTML inicial
// (Mercado Livre funciona bem; Shopee pode falhar por ser SPA — nesse
// caso o usuário só preenche o nome manualmente, sem travar o fluxo).

export async function POST(req) {
  const { link } = await req.json();

  if (!link) {
    return Response.json({ error: "Link não informado." }, { status: 400 });
  }

  try {
    const res = await fetch(link, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
      },
    });

    const html = await res.text();

    const nome =
      extractMeta(html, "og:title") ||
      extractTag(html, "title") ||
      null;

    if (!nome) {
      return Response.json(
        { error: "Não consegui identificar o nome do produto nesse link." },
        { status: 422 }
      );
    }

    return Response.json({ nome: decodeEntities(nome) });
  } catch (err) {
    return Response.json(
      { error: "Não consegui acessar esse link." },
      { status: 502 }
    );
  }
}

function extractMeta(html, property) {
  const regex = new RegExp(
    `<meta[^>]+property=["']${property}["'][^>]+content=["']([^"']+)["']`,
    "i"
  );
  const match = html.match(regex);
  return match ? match[1] : null;
}

function extractTag(html, tag) {
  const regex = new RegExp(`<${tag}[^>]*>([^<]+)</${tag}>`, "i");
  const match = html.match(regex);
  return match ? match[1].trim() : null;
}

function decodeEntities(text) {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}
