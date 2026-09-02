// Cálculos do módulo de revenda. Centralizado aqui pra UI só exibir,
// sem repetir contas em vários componentes.

// Quanto ainda resta em estoque de um item, dado o total já vendido dele.
export function estoqueRestante(item, vendasDoItem) {
  const vendido = vendasDoItem.reduce((soma, v) => soma + Number(v.quantidade), 0);
  return Number(item.quantidade_comprada) - vendido;
}

// Lucro de uma venda específica: (preço de venda - custo unitário) * quantidade.
export function lucroDaVenda(venda, item) {
  return (Number(venda.preco_unitario) - Number(item.custo_unitario)) * Number(venda.quantidade);
}

// Resumo financeiro geral, juntando todos os itens e vendas.
// - gastoTotal: quanto já foi investido comprando (todos os itens, vendidos ou não)
// - faturamentoTotal: soma de tudo que já entrou vendendo
// - lucroRealizado: lucro só sobre o que já foi vendido (faturamento - custo das unidades vendidas)
// - valorEmEstoque: quanto custou o que ainda não foi vendido (dinheiro parado em estoque)
export function resumoFinanceiro(itens, vendas) {
  const vendasPorItem = agruparVendasPorItem(vendas);

  let gastoTotal = 0;
  let faturamentoTotal = 0;
  let lucroRealizado = 0;
  let valorEmEstoque = 0;

  for (const item of itens) {
    const vendasDoItem = vendasPorItem[item.id] || [];
    const restante = estoqueRestante(item, vendasDoItem);

    gastoTotal += Number(item.custo_total);
    valorEmEstoque += Math.max(restante, 0) * Number(item.custo_unitario);

    for (const venda of vendasDoItem) {
      faturamentoTotal += Number(venda.receita_total);
      lucroRealizado += lucroDaVenda(venda, item);
    }
  }

  return { gastoTotal, faturamentoTotal, lucroRealizado, valorEmEstoque };
}

export function agruparVendasPorItem(vendas) {
  return vendas.reduce((acc, venda) => {
    if (!acc[venda.item_id]) acc[venda.item_id] = [];
    acc[venda.item_id].push(venda);
    return acc;
  }, {});
}
