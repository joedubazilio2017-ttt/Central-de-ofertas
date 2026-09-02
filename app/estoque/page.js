"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { agruparVendasPorItem, resumoFinanceiro } from "@/lib/estoque";
import ItemCompraForm from "@/components/ItemCompraForm";
import EstoqueItemCard from "@/components/EstoqueItemCard";

export default function EstoquePage() {
  const [itens, setItens] = useState([]);
  const [vendas, setVendas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  async function loadDados() {
    setLoading(true);
    const [itensRes, vendasRes] = await Promise.all([
      supabase.from("estoque_itens").select("*").order("criado_em", { ascending: false }),
      supabase.from("estoque_vendas").select("*"),
    ]);
    setItens(itensRes.data || []);
    setVendas(vendasRes.data || []);
    setLoading(false);
  }

  useEffect(() => {
    loadDados();
  }, []);

  const vendasPorItem = useMemo(() => agruparVendasPorItem(vendas), [vendas]);
  const resumo = useMemo(() => resumoFinanceiro(itens, vendas), [itens, vendas]);

  return (
    <main className="max-w-5xl mx-auto px-4 py-8 flex flex-col gap-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold tracking-tight">Revenda</h1>
          <p className="text-xs text-white/40">
            Controle de compras, estoque e vendas locais
          </p>
        </div>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="bg-ember hover:bg-ember/90 text-black text-sm font-medium px-4 py-2 rounded-md transition"
        >
          {showForm ? "Cancelar" : "+ Nova compra"}
        </button>
      </header>

      {/* Dashboard financeiro */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Cartao titulo="Gasto total" valor={resumo.gastoTotal} tom="neutro" />
        <Cartao titulo="Faturamento" valor={resumo.faturamentoTotal} tom="neutro" />
        <Cartao titulo="Lucro realizado" valor={resumo.lucroRealizado} tom="lucro" />
        <Cartao titulo="Valor em estoque" valor={resumo.valorEmEstoque} tom="neutro" />
      </div>

      {showForm && (
        <ItemCompraForm
          onCreated={() => {
            setShowForm(false);
            loadDados();
          }}
          onClose={() => setShowForm(false)}
        />
      )}

      {loading ? (
        <p className="text-white/40 text-sm">Carregando...</p>
      ) : itens.length === 0 ? (
        <p className="text-white/40 text-sm">
          Nenhum item cadastrado ainda. Clique em "Nova compra" pra começar.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {itens.map((item) => (
            <EstoqueItemCard
              key={item.id}
              item={item}
              vendas={vendasPorItem[item.id] || []}
              onChanged={loadDados}
            />
          ))}
        </div>
      )}
    </main>
  );
}

function Cartao({ titulo, valor, tom }) {
  const cor =
    tom === "lucro" ? (valor >= 0 ? "text-good" : "text-weak") : "text-white/90";

  return (
    <div className="bg-panel border border-line rounded-lg p-3 flex flex-col gap-1">
      <span className="text-[11px] text-white/40">{titulo}</span>
      <span className={`text-lg font-semibold ${cor}`}>
        R$ {valor.toFixed(2)}
      </span>
    </div>
  );
}
