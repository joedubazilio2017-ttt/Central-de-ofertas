"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

const emptyForm = {
  nome: "",
  quantidade_comprada: "",
  custo_unitario: "",
  data_compra: new Date().toISOString().slice(0, 10),
  observacao: "",
};

export default function ItemCompraForm({ onCreated, onClose }) {
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    if (!form.nome || !form.quantidade_comprada || !form.custo_unitario) {
      setError("Preencha nome, quantidade e custo unitário.");
      return;
    }

    setSaving(true);
    const { error: insertError } = await supabase.from("estoque_itens").insert({
      nome: form.nome,
      quantidade_comprada: Number(form.quantidade_comprada),
      custo_unitario: Number(form.custo_unitario),
      data_compra: form.data_compra,
      observacao: form.observacao.trim() || null,
    });
    setSaving(false);

    if (insertError) {
      setError("Erro ao salvar: " + insertError.message);
      return;
    }

    setForm(emptyForm);
    onCreated();
  }

  const custoTotal =
    form.quantidade_comprada && form.custo_unitario
      ? (Number(form.quantidade_comprada) * Number(form.custo_unitario)).toFixed(2)
      : null;

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-panel border border-line rounded-lg p-5 flex flex-col gap-4"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold tracking-wide text-white/80">
          Nova compra (item pra revenda)
        </h2>
        <button
          type="button"
          onClick={onClose}
          className="text-white/40 hover:text-white/80 text-sm"
        >
          Fechar
        </button>
      </div>

      <Field label="Nome do item" required>
        <input
          className="input"
          value={form.nome}
          onChange={(e) => update("nome", e.target.value)}
          placeholder="Ex: Caixa de som portátil"
        />
      </Field>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Field label="Quantidade comprada" required>
          <input
            className="input"
            type="number"
            step="1"
            min="1"
            value={form.quantidade_comprada}
            onChange={(e) => update("quantidade_comprada", e.target.value)}
            placeholder="10"
          />
        </Field>

        <Field label="Custo unitário (R$)" required>
          <input
            className="input"
            type="number"
            step="0.01"
            value={form.custo_unitario}
            onChange={(e) => update("custo_unitario", e.target.value)}
            placeholder="15.00"
          />
        </Field>

        <Field label="Data da compra">
          <input
            className="input"
            type="date"
            value={form.data_compra}
            onChange={(e) => update("data_compra", e.target.value)}
          />
        </Field>
      </div>

      {custoTotal && (
        <p className="text-xs text-white/40">
          Total investido nessa compra: <span className="text-white/70">R$ {custoTotal}</span>
        </p>
      )}

      <Field label="Observação (opcional)">
        <input
          className="input"
          value={form.observacao}
          onChange={(e) => update("observacao", e.target.value)}
          placeholder="Ex: comprado no atacado, fornecedor X"
        />
      </Field>

      {error && <p className="text-weak text-sm">{error}</p>}

      <button
        type="submit"
        disabled={saving}
        className="mt-1 self-start bg-ember hover:bg-ember/90 disabled:opacity-50 text-black font-medium text-sm px-4 py-2 rounded-md transition"
      >
        {saving ? "Salvando..." : "Salvar compra"}
      </button>

      <style jsx>{`
        .input {
          background: #0f1115;
          border: 1px solid #262b35;
          border-radius: 6px;
          padding: 8px 10px;
          font-size: 14px;
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

function Field({ label, children, required }) {
  return (
    <label className="flex flex-col gap-1 text-xs text-white/50">
      <span>
        {label} {required && <span className="text-ember">*</span>}
      </span>
      {children}
    </label>
  );
}
