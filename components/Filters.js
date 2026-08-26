"use client";

export default function Filters({ lojas, filters, setFilters }) {
  return (
    <div className="flex flex-wrap gap-3 items-center">
      <select
        className="filter-select"
        value={filters.status}
        onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}
      >
        <option value="todos">Todos os status</option>
        <option value="nova">Nova</option>
        <option value="aprovada">Aprovada</option>
        <option value="rejeitada">Rejeitada</option>
      </select>

      <select
        className="filter-select"
        value={filters.loja}
        onChange={(e) => setFilters((f) => ({ ...f, loja: e.target.value }))}
      >
        <option value="todas">Todas as lojas</option>
        {lojas.map((loja) => (
          <option key={loja} value={loja}>
            {loja}
          </option>
        ))}
      </select>

      <select
        className="filter-select"
        value={filters.ordenar}
        onChange={(e) => setFilters((f) => ({ ...f, ordenar: e.target.value }))}
      >
        <option value="recentes">Mais recentes</option>
        <option value="maior_desconto">Maior desconto</option>
      </select>

      <style jsx>{`
        .filter-select {
          background: #171a21;
          border: 1px solid #262b35;
          border-radius: 6px;
          padding: 6px 10px;
          font-size: 13px;
          color: white;
        }
        .filter-select:focus {
          outline: none;
          border-color: #ff7a45;
        }
      `}</style>
    </div>
  );
}
