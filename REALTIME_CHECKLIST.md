# ✅ Checklist de Configuração Supabase Realtime

## Pré-requisitos
- [ ] Conta Supabase criada
- [ ] Projeto Supabase criado
- [ ] Tabelas `instance_chat` e `instance_message` existem no banco

## Passo 1: Configurar Variáveis de Ambiente
- [ ] Copiar `.env.example` para `.env`
- [ ] Preencher `VITE_SUPABASE_URL` com URL do projeto
- [ ] Preencher `VITE_SUPABASE_ANON_KEY` com a chave anônima
  - Encontre em: Supabase Dashboard → Settings → API

## Passo 2: Habilitar Realtime no Supabase
- [ ] Abrir Supabase SQL Editor
- [ ] Executar script `supabase-realtime-setup.sql`
- [ ] Verificar se as 2 linhas apareceram na query de verificação

## Passo 3: Reiniciar Servidor Realtime
- [ ] Ir para: Dashboard → Database → Replication
- [ ] Clicar em "Restart Realtime"
- [ ] Aguardar 10-30 segundos

## Passo 4: Configurar RLS (Escolha uma opção)

### Opção A: Desenvolvimento (Mais Rápido)
- [ ] Executar no SQL Editor:
```sql
ALTER TABLE instance_chat DISABLE ROW LEVEL SECURITY;
ALTER TABLE instance_message DISABLE ROW LEVEL SECURITY;
```

### Opção B: Produção (Mais Seguro)
- [ ] Usar políticas RLS do arquivo `supabase-realtime-setup.sql`
- [ ] Ajustar políticas conforme suas necessidades
- [ ] Testar com usuário autenticado

## Passo 5: Testar a Aplicação
- [ ] Rodar `npm run dev`
- [ ] Abrir browser no `http://localhost:5173`
- [ ] Abrir DevTools → Console
- [ ] Navegar para página de Chat
- [ ] Verificar logs:
  - `✅ Chat realtime connected`
  - `✅ Messages realtime connected`

## Passo 6: Testar Realtime em Tempo Real
- [ ] Abrir Supabase SQL Editor
- [ ] Inserir teste:
```sql
-- Inserir chat de teste
INSERT INTO instance_chat (instance_id, client_number, last_message)
VALUES (1, '+244 999 999 999', 'Teste realtime');

-- Inserir mensagem de teste (ajustar instance_chat_id)
INSERT INTO instance_message (instance_chat_id, text, sender, timestamp)
VALUES (1, 'Olá! Teste de realtime', 'client', NOW());
```
- [ ] Verificar se apareceu automaticamente no frontend
- [ ] Verificar logs no console: `Chat change received:` ou `New message received:`

## 🚨 Problemas Comuns

### Se aparecer `CHANNEL_ERROR` ou `CLOSED`:
1. [ ] Verificar se as credenciais no `.env` estão corretas
2. [ ] Verificar se executou o script SQL
3. [ ] Verificar se reiniciou o Realtime
4. [ ] Verificar RLS (tentar desabilitar temporariamente)
5. [ ] Verificar se as tabelas existem com os nomes corretos

### Se os dados do backend não carregarem:
1. [ ] Verificar se o backend está rodando
2. [ ] Testar endpoints manualmente:
   - `GET http://localhost:3000/chats?instanceId=1`
   - `GET http://localhost:3000/messages?chatId=1`

### Se houver loop infinito de conexões:
- ✅ **Já corrigido no código!** Flag `mounted` previne este problema

## 📝 Notas
- Realtime funciona via WebSocket
- Mudanças no banco são sincronizadas automaticamente
- Console do browser mostra todos os eventos em tempo real
- Para produção, sempre use RLS com políticas adequadas

## 🎉 Sucesso!
Quando ver `✅ Chat realtime connected` e `✅ Messages realtime connected` sem erros, está tudo funcionando!
