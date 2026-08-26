-- Central de Achados — schema inicial (MVP 1)
-- Rode este SQL no SQL Editor do Supabase

create table promocoes (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  loja text not null,
  preco_anterior numeric,
  preco_atual numeric not null,
  desconto_percentual numeric generated always as (
    case
      when preco_anterior is not null and preco_anterior > 0
      then round(((preco_anterior - preco_atual) / preco_anterior) * 100, 1)
      else null
    end
  ) stored,
  link text,
  status text not null default 'nova' check (status in ('nova', 'aprovada', 'rejeitada')),
  criado_em timestamptz not null default now()
);

-- Sem RLS por enquanto (uso pessoal, decisão combinada no MVP 1).
-- Quando fizer sentido, ativar RLS + policies aqui.
