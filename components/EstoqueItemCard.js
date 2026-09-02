"use client";

import { useState } from "react";
import { estoqueRestante, lucroDaVenda } from "@/lib/estoque";
import VendaForm from "./VendaForm";

export default function EstoqueItemCard({ item, vendas, onChanged }) {
  const [mostrarVenda, setMostrarVenda] = useState(false);
  const [mostrarHistorico, setMostrarHistorico] = useState(false);

  const restante = estoqueRestante(item, vendas);
  const esgotado = restante <= 0;
  const totalVendido = vendas.reduce((s, v) => s + Number(v.quantidade), 0);
  const lucroDoItem = vendas.reduce((s, v) => s + lucroDaVenda(v, item), 0);

  return (
    <div className="bg-panel border border-line rounded-lg p-4 flex flex-col gap-2">
      <div className="flex items-start justify-between">
        <h3 className="text-sm font-medium text-white/90">{item.nome}</h3>
        <span
          className={`text-[11px] px-2 py-0.5 rounded-full ${
            esgotado
              ? "bg-weak/10 text-weak"
              : restante <= 2
              ? "bg-mid/10 text-mid"
              : "bg-good/10 text-good"
          }`}
        >
          {esgotado ? "Esgotado" : `${restante} em estoque`}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs text-white/50">
        <span>Custo unitário: R$ {Number(item.custo_unitario).toFixed(2)}</span>
        <span>Comprado: {item.quantidade_comprada} un.</span>
        <span>Vendido: {totalVendido} un.</span>
        <span className={lucroDoItem >= 0 ? "text-good" : "text-weak"}>
          Lucro até agora: R$ {lucroDoItem.toFixed(2)}
        </span>
      </div>

      {item.observacao && (
        <p className="text-[11px] text-white/30 italic">{item.observacao}</p>
      )}

      <div className="flex gap-2 pt-1">
        <button
          onClick={() => setMostrarVenda((v) => !v)}
          disabled={esgotado}
          className="text-xs px-3 py-1.5 rounded-md bg-ember/10 border border-ember/20 hover:bg-ember/20 disabled:opacity-40 disabled:cursor-not-allowed text-ember transition"
        >
          {mostrarVenda ? "Cancelar" : "+ Registrar venda"}
        </button>
        {vendas.length > 0 && (
          <button
            onClick={() => setMostrarHistorico((v) => !v)}
            className="text-xs px-3 py-1.5 rounded-md bg-white/5 hover:bg-white/10 text-white/60 transition"
          >
            {mostrarHistorico ? "Ocultar histórico" : `Ver vendas (${vendas.length})`}
          </button>
        )}
      </div>

      {mostrarVenda && (
        <VendaForm
          item={item}
          estoqueDisponivel={restante}
          onCreated={() => {
            setMostrarVenda(false);
            onChanged();
          }}
          onClose={() => setMostrarVenda(false)}
        />
      )}

      {mostrarHistorico && (
        <div className="flex flex-col gap-1 pt-2 border-t border-line mt-1">
          {vendas
            .slice()
            .sort((a, b) => new Date(b.data_venda) - new Date(a.data_venda))
            .map((venda) => (
              <div
                key={venda.id}
                className="flex items-center justify-between text-[11px] text-white/50"
              >
                <span>
                  {new Date(venda.data_venda).toLocaleDateString("pt-BR")} · {venda.quantidade} un. ·
                  R$ {Number(venda.preco_unitario).toFixed(2)}/un.
                </span>
                <span className={lucroDaVenda(venda, item) >= 0 ? "text-good" : "text-weak"}>
                  R$ {lucroDaVenda(venda, item).toFixed(2)}
                </span>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
