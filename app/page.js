"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import PromoForm from "@/components/PromoForm";
import PromoCard from "@/components/PromoCard";
import Filters from "@/components/Filters";

export default function Home() {
  const [promocoes, setPromocoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [filters, setFilters] = useState({
    status: "todos",
    loja: "todas",
    ordenar: "recentes",
  });

  async function loadPromocoes() {
    setLoading(true);
    const { data } = await supabase
      .from("promocoes")
      .select("*")
      .order("criado_em", { ascending: false });
    setPromocoes(data || []);
    setLoading(false);
  }

  useEffect(() => {
    loadPromocoes();
  }, []);

  const lojas = useMemo(
    () => [...new Set(promocoes.map((p) => p.loja))].sort(),
    [promocoes]
  );

  const listaFiltrada = useMemo(() => {
    let lista = [...promocoes];

    if (filters.status !== "todos") {
      lista = lista.filter((p) => p.status === filters.status);
    }
    if (filters.loja !== "todas") {
      lista = lista.filter((p) => p.loja === filters.loja);
    }
    if (filters.ordenar === "maior_desconto") {
      lista.sort(
        (a, b) => (b.desconto_percentual || 0) - (a.desconto_percentual || 0)
      );
    }

    return lista;
  }, [promocoes, filters]);

  return (
    <main className="max-w-5xl mx-auto px-4 py-8 flex flex-col gap-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold tracking-tight">
            Central de Achados
          </h1>
          <p className="text-xs text-white/40">
            {promocoes.length} promoção(ões) cadastrada(s)
          </p>
        </div>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="bg-ember hover:bg-ember/90 text-black text-sm font-medium px-4 py-2 rounded-md transition"
        >
          {showForm ? "Cancelar" : "+ Nova promoção"}
        </button>
      </header>

      {showForm && (
        <PromoForm
          onCreated={() => {
            setShowForm(false);
            loadPromocoes();
          }}
          onClose={() => setShowForm(false)}
        />
      )}

      <Filters lojas={lojas} filters={filters} setFilters={setFilters} />

      {loading ? (
        <p className="text-white/40 text-sm">Carregando...</p>
      ) : listaFiltrada.length === 0 ? (
        <p className="text-white/40 text-sm">
          Nenhuma promoção encontrada com esses filtros.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {listaFiltrada.map((promo) => (
            <PromoCard key={promo.id} promo={promo} onChanged={loadPromocoes} />
          ))}
        </div>
      )}
    </main>
  );
}
