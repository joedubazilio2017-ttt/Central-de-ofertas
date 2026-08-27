"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { detectarLoja } from "@/lib/loja";

const emptyForm = {
  nome: "",
  loja: "",
  preco_anterior: "",
  preco_atual: "",
  link: "",
};

export default function PromoForm({ onCreated, onClose }) {
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [buscando, setBuscando] = useState(false);
  const [error, setError] = useState(null);

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function buscarDadosDoLink() {
    if (!form.link) {
      setError("Cole um link primeiro.");
      return;
    }
    setError(null);
    setBuscando(true);
    try {
      const res = await fetch("/api/fetch-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ link: form.link }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Não consegui buscar os dados desse link.");
      } else {
        update("nome", data.nome);
        if (data.preco_atual) update("preco_atual", String(data.preco_atual));
      }
    } catch {
      setError("Não consegui buscar os dados desse link.");
    }
    setBuscando(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    if (!form.nome || !form.link || !form.preco_atual) {
      setError("Preencha o link, nome e preço atual.");
      return;
    }

    const loja = detectarLoja(form.link);

    setSaving(true);
    const { error: insertError } = await supabase.from("promocoes").insert({
      nome: form.nome,
      loja,
      preco_anterior: form.preco_anterior ? Number(form.preco_anterior) : null,
      preco_atual: Number(form.preco_atual),
      link: form.link || null,
    });
    setSaving(false);

    if (insertError) {
      setError("Erro ao salvar: " + insertError.message);
      return;
    }

    setForm(emptyForm);
    onCreated();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-panel border border-line rounded-lg p-5 flex flex-col gap-3"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold tracking-wide text-white/80">
          Nova promoção
        </h2>
        <button
          type="button"
          onClick={onClose}
          className="text-white/40 hover:text-white/80 text-sm"
        >
          Fechar
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Field label="Link" full>
          <div className="flex gap-2">
            <input
              className="input"
              value={form.link}
              onChange={(e) => update("link", e.target.value)}
              placeholder="https://..."
            />
            <button
              type="button"
              onClick={buscarDadosDoLink}
              disabled={buscando}
              className="whitespace-nowrap text-xs px-3 rounded-md bg-white/10 hover:bg-white/20 disabled:opacity-50 transition"
            >
              {buscando ? "Buscando..." : "Buscar nome"}
            </button>
          </div>
        </Field>

        <Field label="Nome do produto" required>
          <input
            className="input"
            value={form.nome}
            onChange={(e) => update("nome", e.target.value)}
            placeholder="Fone Bluetooth XYZ"
          />
        </Field>

        <Field label="Preço anterior (R$)">
          <input
            className="input"
            type="number"
            step="0.01"
            value={form.preco_anterior}
            onChange={(e) => update("preco_anterior", e.target.value)}
            placeholder="199.00"
          />
        </Field>

        <Field label="Preço atual (R$)" required>
          <input
            className="input"
            type="number"
            step="0.01"
            value={form.preco_atual}
            onChange={(e) => update("preco_atual", e.target.value)}
            placeholder="89.00"
          />
        </Field>
      </div>

      {error && <p className="text-weak text-sm">{error}</p>}

      <button
        type="submit"
        disabled={saving}
        className="mt-1 self-start bg-ember hover:bg-ember/90 disabled:opacity-50 text-black font-medium text-sm px-4 py-2 rounded-md transition"
      >
        {saving ? "Salvando..." : "Salvar promoção"}
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

function Field({ label, children, required, full }) {
  return (
    <label className={`flex flex-col gap-1 text-xs text-white/50 ${full ? "sm:col-span-2" : ""}`}>
      <span>
        {label} {required && <span className="text-ember">*</span>}
      </span>
      {children}
    </label>
  );
}
