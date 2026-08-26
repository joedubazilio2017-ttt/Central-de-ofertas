// Pontuação simples baseada apenas na porcentagem de desconto.
// Sem IA, sem pesos extras — regra fixa combinada no MVP 1.

export function getScore(descontoPercentual) {
  if (descontoPercentual === null || descontoPercentual === undefined) {
    return { label: "Sem desconto", emoji: "⚪", tone: "text-white/40" };
  }
  if (descontoPercentual >= 40) {
    return { label: "Oferta excelente", emoji: "🔥", tone: "text-ember" };
  }
  if (descontoPercentual >= 25) {
    return { label: "Boa oferta", emoji: "🟢", tone: "text-good" };
  }
  if (descontoPercentual >= 10) {
    return { label: "Oferta média", emoji: "🟡", tone: "text-mid" };
  }
  return { label: "Oferta fraca", emoji: "🔴", tone: "text-weak" };
}
