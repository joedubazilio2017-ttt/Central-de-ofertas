const LOJAS_CONHECIDAS = {
  "shopee.com.br": "Shopee",
  "shopee.com": "Shopee",
  "mercadolivre.com.br": "Mercado Livre",
  "mercadolivre.com": "Mercado Livre",
  "amazon.com.br": "Amazon",
  "amazon.com": "Amazon",
  "magazineluiza.com.br": "Magazine Luiza",
  "aliexpress.com": "AliExpress",
};

export function detectarLoja(link) {
  try {
    const hostname = new URL(link).hostname.replace(/^www\./, "");
    if (LOJAS_CONHECIDAS[hostname]) return LOJAS_CONHECIDAS[hostname];

    // fallback: usa o domínio principal como nome (ex: "loja.com" -> "Loja")
    const dominio = hostname.split(".")[0];
    return dominio.charAt(0).toUpperCase() + dominio.slice(1);
  } catch {
    return "Não identificada";
  }
}
