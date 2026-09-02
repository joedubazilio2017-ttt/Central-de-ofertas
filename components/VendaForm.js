"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function VendaForm({ item, estoqueDisponivel, onCreated, onClose }) {
  const [quantidade, setQuantidade] = useState("1");
  const [precoUnitario, setPrecoUnitario] = useState("");
  const [dataVenda, setDataVenda] = useState(new Date().toISOString().slice(0, 10));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const lucroEstimado =
    precoUnitario && quantidade
      ? (
          (Number(precoUnitario) - Number(item.custo_unitario)) * Number(quantidade)
        ).toFixed(2)
      : null;

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    if (!quantidade || !precoUnitario) {
      setError("Preencha quantidade e preço de venda.");
      return;
    }

    if (Number(quantidade) > estoqueDisponivel) {
      setError(`Você só tem ${estoqueDisponivel} unidade(s) em estoque desse item.`);
      return;
    }

    setSaving(true);
    const { error: insertError } = await supabase.from("estoque_vendas").insert({
      item_id: item.id,
      quantidade: Number(quantidade),
      preco_unitario: Number(precoUnitario),
      data_venda: dataVenda,
    });
    setSaving(false);

    if (insertError) {
      setError("Erro ao salvar: " + insertError.message);
      return;
    }

    onCreated();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-2 bg-base/60 border border-line rounded-md p-3 mt-2"
    >
      <div className="flex items-center justify-between">
        <span className="text-xs text-white/60">Registrar venda</span>
        <button
          type="button"
          onClick={onClose}
          className="text-white/40 hover:text-white/80 text-xs"
        >
          Cancelar
        </button>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <input
          className="input"
          type="number"
          min="1"
          max={estoqueDisponivel}
          value={quantidade}
          onChange={(e) => setQuantidade(e.target.value)}
          placeholder="Qtd"
        />
        <input
          className="input col-span-2"
          type="number"
          step="0.01"
          value={precoUnitario}
          onChange={(e) => setPrecoUnitario(e.target.value)}
          placeholder="Preço de venda (R$)"
        />
      </div>

      <input
        className="input"
        type="date"
        value={dataVenda}
        onChange={(e) => setDataVenda(e.target.value)}
      />

      {lucroEstimado && (
        <p className={`text-[11px] ${Number(lucroEstimado) >= 0 ? "text-good" : "text-weak"}`}>
          Lucro estimado: R$ {lucroEstimado}
        </p>
      )}

      {error && <p className="text-weak text-xs">{error}</p>}

      <button
        type="submit"
        disabled={saving}
        className="self-start bg-ember hover:bg-ember/90 disabled:opacity-50 text-black text-xs font-medium px-3 py-1.5 rounded-md transition"
      >
        {saving ? "Salvando..." : "Confirmar venda"}
      </button>

      <style jsx>{`
        .input {
          background: #0f1115;
          border: 1px solid #262b35;
          border-radius: 6px;
          padding: 6px 8px;
          font-size: 13px;
          color: white;
          width: 100%;
        }
        .input:focus {
          outline: none;
          border-color: #ff7a45;
        }
      `}</style>
    </form>
  );
}
