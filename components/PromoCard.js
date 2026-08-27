"use client";

import { useState } from "react";
import { getScore } from "@/lib/score";
import { gerarLegenda } from "@/lib/legenda";
import { supabase } from "@/lib/supabaseClient";

const statusLabel = {
  nova: "Nova",
  aprovada: "Aprovada",
  rejeitada: "Rejeitada",
};

const statusStyle = {
  nova: "bg-white/10 text-white/70",
  aprovada: "bg-good/15 text-good",
  rejeitada: "bg-weak/15 text-weak",
};

export default function PromoCard({ promo, onChanged }) {
  const score = getScore(promo.desconto_percentual);
  const [copiado, setCopiado] = useState(false);

  async function copiarLegenda() {
    await navigator.clipboard.writeText(gerarLegenda(promo));
    setCopiado(true);
    setTimeout(() => setCopiado(false), 1500);
  }

  async function updateStatus(status) {
    await supabase.from("promocoes").update({ status }).eq("id", promo.id);
    onChanged();
  }

  const criadoEm = new Date(promo.criado_em).toLocaleString("pt-BR");

  return (
    <div className="bg-panel border border-line rounded-lg p-4 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-medium text-white/90">{promo.nome}</p>
          <p className="text-xs text-white/40">{promo.loja}</p>
        </div>
        <span className={`text-[11px] px-2 py-0.5 rounded-full whitespace-nowrap ${statusStyle[promo.status]}`}>
          {statusLabel[promo.status]}
        </span>
      </div>

      <div className="flex items-end gap-2">
        <span className="text-2xl font-mono font-semibold text-white">
          R$ {Number(promo.preco_atual).toFixed(2)}
        </span>
        {promo.preco_anterior && (
          <span className="text-sm text-white/40 line-through font-mono">
            R$ {Number(promo.preco_anterior).toFixed(2)}
          </span>
        )}
      </div>

      <div className={`flex items-center gap-1.5 text-sm ${score.tone}`}>
        <span>{score.emoji}</span>
        <span>{score.label}</span>
        {promo.desconto_percentual !== null && (
          <span className="text-white/40">
            ({promo.desconto_percentual}% off)
          </span>
        )}
      </div>

      <div className="flex items-center justify-between text-xs text-white/30 pt-1 border-t border-line">
        <span>{criadoEm}</span>
        {promo.link && (
          <a
            href={promo.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-ember hover:underline"
          >
            Ver produto ↗
          </a>
        )}
      </div>

      <div className="flex gap-2 pt-1">
        <button
          onClick={() => updateStatus("aprovada")}
          className="flex-1 text-xs py-1.5 rounded-md bg-good/10 text-good hover:bg-good/20 transition"
        >
          Aprovar
        </button>
        <button
          onClick={() => updateStatus("rejeitada")}
          className="flex-1 text-xs py-1.5 rounded-md bg-weak/10 text-weak hover:bg-weak/20 transition"
        >
          Rejeitar
        </button>
      </div>

      <button
        onClick={copiarLegenda}
        className="text-xs py-1.5 rounded-md bg-ember/10 text-ember hover:bg-ember/20 transition"
      >
        {copiado ? "Copiado ✓" : "Copiar legenda"}
      </button>
    </div>
  );
}
