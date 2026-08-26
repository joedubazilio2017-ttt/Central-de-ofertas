# Central de Achados — MVP 1

Painel simples de monitoramento de promoções cadastradas manualmente.

## Como rodar

1. **Supabase**: crie um projeto em supabase.com, abra o SQL Editor e rode o conteúdo de `supabase/schema.sql`.
2. **Variáveis de ambiente**: copie `.env.local.example` para `.env.local` e preencha com a URL e a anon key do seu projeto Supabase (Settings → API).
3. **Instalar dependências**:
   ```
   npm install
   ```
4. **Rodar localmente**:
   ```
   npm run dev
   ```
5. **Deploy**: importe o repositório na Vercel, configure as mesmas variáveis de ambiente lá (Settings → Environment Variables).

## O que este MVP faz

- Cadastro manual de promoções (nome, loja, preço anterior, preço atual, link)
- Cálculo automático de desconto (feito pelo próprio banco)
- Pontuação visual do desconto (🔥 excelente / 🟢 boa / 🟡 média / 🔴 fraca)
- Filtros por status, loja e maior desconto
- Aprovar/rejeitar promoções

## O que este MVP NÃO faz (por enquanto)

Login, monitoramento automático de lojas, IA, geração de texto, integração com WhatsApp/Telegram — tudo isso são fases futuras já mapeadas, não implementadas ainda.
