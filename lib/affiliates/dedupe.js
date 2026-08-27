import { supabase } from "@/lib/supabaseClient";

const DIAS_JANELA_PADRAO = 7;

// Verifica se um produto (pelo id externo + origem) já foi inserido
// em promocoes dentro da janela de dias informada. Usado pra evitar
// que o minerador insira a mesma oferta duas vezes.
export async function jaFoiEnviado(
  produtoIdExterno,
  origem,
  diasJanela = DIAS_JANELA_PADRAO
) {
  if (!produtoIdExterno) return false;

  const desde = new Date();
  desde.setDate(desde.getDate() - diasJanela);

  const { data, error } = await supabase
    .from("promocoes")
    .select("id")
    .eq("produto_id_externo", produtoIdExterno)
    .eq("origem", origem)
    .gte("criado_em", desde.toISOString())
    .limit(1);

  if (error) {
    console.error("Erro ao checar duplicidade:", error);
    // Em caso de falha na checagem, não bloqueia o fluxo — melhor
    // arriscar uma duplicata ocasional do que travar o robô inteiro.
    return false;
  }

  return Boolean(data && data.length > 0);
}
