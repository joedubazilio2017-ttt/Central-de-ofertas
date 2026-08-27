import { buscarOfertasShopee } from "@/lib/affiliates/shopee";
import { jaFoiEnviado } from "@/lib/affiliates/dedupe";
import { supabase } from "@/lib/supabaseClient";

// Disparado manualmente pelo botão "Buscar novas ofertas" na home.
// Quando a Evolution API estiver pronta, dá pra reaproveitar essa mesma
// rota (ou uma cópia dela) num cron/agendador externo — a lógica de
// mineração + dedupe + inserção não muda.
export async function POST() {
  try {
    const ofertas = await buscarOfertasShopee();

    const inseridas = [];
    const ignoradasDuplicadas = [];
    const erros = [];

    for (const oferta of ofertas) {
      const duplicado = await jaFoiEnviado(
        oferta.produto_id_externo,
        oferta.origem
      );

      if (duplicado) {
        ignoradasDuplicadas.push(oferta.produto_id_externo);
        continue;
      }

      const { data, error } = await supabase
        .from("promocoes")
        .insert({
          nome: oferta.nome,
          loja: oferta.loja,
          preco_anterior: oferta.preco_anterior,
          preco_atual: oferta.preco_atual,
          link: oferta.link,
          origem: oferta.origem,
          produto_id_externo: oferta.produto_id_externo,
          status: "nova",
        })
        .select()
        .single();

      if (error) {
        console.error("Erro ao inserir oferta:", error);
        erros.push({ produto: oferta.produto_id_externo, mensagem: error.message });
        continue;
      }

      inseridas.push(data);
    }

    return Response.json({
      total_encontradas: ofertas.length,
      inseridas: inseridas.length,
      ignoradas_duplicadas: ignoradasDuplicadas.length,
      erros,
    });
  } catch (err) {
    console.error("Erro no mine-offers:", err);
    return Response.json(
      { error: "Falha ao buscar ofertas." },
      { status: 500 }
    );
  }
}
