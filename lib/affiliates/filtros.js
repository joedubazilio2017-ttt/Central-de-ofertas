// Filtra a lista de ofertas antes de checar duplicidade e inserir.
// Regras simples e explícitas — fácil de ajustar conforme o robô
// trouxer mais "lixo" (descontos fracos, preços quebrados, etc).

const DESCONTO_MINIMO_PADRAO = 20; // em %

export function filtrarOfertasValidas(ofertas, { descontoMinimo = DESCONTO_MINIMO_PADRAO } = {}) {
  return ofertas.filter((oferta) => {
    // preço atual precisa existir e ser positivo
    if (!oferta.preco_atual || oferta.preco_atual <= 0) return false;

    // sem preço anterior não dá pra calcular desconto real — descarta
    // (evita "oferta" que na verdade não tem comparação nenhuma)
    if (!oferta.preco_anterior || oferta.preco_anterior <= oferta.preco_atual) {
      return false;
    }

    const desconto = ((oferta.preco_anterior - oferta.preco_atual) / oferta.preco_anterior) * 100;

    return desconto >= descontoMinimo;
  });
}
