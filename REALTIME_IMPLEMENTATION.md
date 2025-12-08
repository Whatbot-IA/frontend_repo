# Supabase Realtime Integration

Este documento explica como a integração com Supabase Realtime foi implementada para comunicação em tempo real nos chats do WhatsApp.

## 📋 Estrutura da Implementação

### 1. Cliente Supabase (`src/services/supabase.js`)
Cliente configurado para conectar ao Supabase e escutar mudanças em tempo real.

```javascript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

### 2. API Endpoints (`src/services/api.js`)
Funções para interagir com o backend NestJS:

- `getChats(instanceId)` - Buscar chats de uma instância
- `getChatById(chatId)` - Buscar chat específico
- `getMessages(chatId)` - Buscar mensagens de um chat
- `sendMessage(chatId, messageData)` - Enviar nova mensagem

### 3. Hooks Customizados (`src/hooks/useRealtime.js`)

#### `useRealtimeChats(instanceId)`
Hook para escutar mudanças nos chats de uma instância.

**Funcionalidades:**
- ✅ Carrega chats iniciais do backend
- ✅ Escuta INSERT de novos chats
- ✅ Escuta UPDATE de chats existentes
- ✅ Escuta DELETE de chats removidos
- ✅ Gerencia estados de loading e erro

**Retorno:**
```javascript
const { chats, isLoading, error } = useRealtimeChats(instanceId)
```

#### `useRealtimeMessages(chatId)`
Hook para escutar novas mensagens em um chat.

**Funcionalidades:**
- ✅ Carrega mensagens iniciais do backend
- ✅ Escuta INSERT de novas mensagens
- ✅ Atualiza lista automaticamente
- ✅ Gerencia estados de loading e erro

**Retorno:**
```javascript
const { messages, isLoading, error } = useRealtimeMessages(chatId)
```

### 4. Página de Chat (`src/pages/Chat.jsx`)
Integração completa dos hooks na interface.

**Recursos implementados:**
- ✅ Lista de chats em tempo real
- ✅ Mensagens em tempo real
- ✅ Envio de mensagens
- ✅ Estados de loading/erro
- ✅ Filtro de busca
- ✅ Layout responsivo (mobile/desktop)

## 🚀 Como Usar

### 1. Configurar Variáveis de Ambiente

Crie um arquivo `.env` baseado no `.env.example`:

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua_chave_anon_aqui
```

### 2. Habilitar Realtime no Supabase

Execute o script SQL no Supabase SQL Editor para habilitar Realtime nas tabelas:

```sql
-- Habilitar Realtime para instance_chat
ALTER TABLE instance_chat REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE instance_chat;

-- Habilitar Realtime para instance_message
ALTER TABLE instance_message REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE instance_message;
```

**⚠️ IMPORTANTE:** Após executar o SQL acima, você precisa **reiniciar o servidor Realtime** no Supabase:
1. Vá para o Supabase Dashboard
2. Navegue para **Database → Replication**
3. Clique em **Restart Realtime** ou recarregue as configurações
4. Aguarde alguns segundos para o serviço reiniciar

**Verificar se o Realtime está habilitado:**
```sql
-- Verificar publicação
SELECT * FROM pg_publication_tables WHERE pubname = 'supabase_realtime';

-- Deve mostrar instance_chat e instance_message na lista
```

### 3. Usar na Aplicação

```jsx
import { useRealtimeChats, useRealtimeMessages } from '../hooks/useRealtime'

function MyComponent() {
  const { chats, isLoading, error } = useRealtimeChats(instanceId)
  const { messages } = useRealtimeMessages(selectedChatId)
  
  // Componente atualiza automaticamente quando há mudanças
}
```

## 🔒 Segurança (RLS - Row Level Security)

⚠️ **CRÍTICO:** Por padrão, Supabase Realtime requer que as tabelas tenham políticas RLS configuradas. Se você está vendo erros `CHANNEL_ERROR` ou `CLOSED`, verifique:

### Opção 1: Desabilitar RLS temporariamente (APENAS DESENVOLVIMENTO)
```sql
-- ⚠️ ATENÇÃO: Use isso APENAS em desenvolvimento/teste
ALTER TABLE instance_chat DISABLE ROW LEVEL SECURITY;
ALTER TABLE instance_message DISABLE ROW LEVEL SECURITY;
```

### Opção 2: Configurar políticas RLS (RECOMENDADO PARA PRODUÇÃO)
```sql
-- Habilitar RLS
ALTER TABLE instance_chat ENABLE ROW LEVEL SECURITY;
ALTER TABLE instance_message ENABLE ROW LEVEL SECURITY;

-- Permitir leitura pública (ajuste conforme sua necessidade)
CREATE POLICY "Allow public read access on chats"
ON instance_chat FOR SELECT
USING (true);

CREATE POLICY "Allow public read access on messages"
ON instance_message FOR SELECT
USING (true);

-- OU com autenticação:
-- Permitir leitura apenas de chats do usuário autenticado
CREATE POLICY "Users can view their own chats"
ON instance_chat FOR SELECT
USING (
  auth.uid() IS NOT NULL 
  AND instance_id IN (
    SELECT id FROM instances WHERE user_id = auth.uid()
  )
);

-- Permitir leitura apenas de mensagens de chats do usuário
CREATE POLICY "Users can view messages from their chats"
ON instance_message FOR SELECT
USING (
  instance_chat_id IN (
    SELECT ic.id FROM instance_chat ic
    INNER JOIN instances i ON i.id = ic.instance_id
    WHERE i.user_id = auth.uid()
  )
);
```

## 📊 Estrutura das Tabelas Esperadas

### `instance_chat`
```
- id (bigint, primary key)
- instance_id (bigint)
- client_number (text)
- client_name (text)
- last_message (text)
- last_message_time (timestamp)
- unread_count (integer)
- is_online (boolean)
- created_at (timestamp)
- updated_at (timestamp)
```

### `instance_message`
```
- id (bigint, primary key)
- instance_chat_id (bigint, foreign key)
- text (text)
- body (text)
- sender (text) ou from_me (boolean)
- timestamp (timestamp)
- created_at (timestamp)
```

## 🔍 Debugging

Para visualizar eventos Realtime no console:

```javascript
// Os hooks já incluem logs
console.log('Chat change received:', payload)
console.log('New message received:', payload)
console.log('Subscription status:', status)
```

## ⚠️ Notas Importantes

1. **Nome do Canal**: Agora usando formato `public:table_name:filter` para melhor organização e evitar conflitos.

2. **Cleanup**: Os hooks fazem cleanup automático com `channel.unsubscribe()` + `supabase.removeChannel()`.

3. **Flag `mounted`**: Previne race conditions quando o componente desmonta antes de completar operações assíncronas.

4. **Retry Logic Removido**: Simplificado para evitar loops infinitos. Se houver erro de conexão, verifique:
   - Credenciais Supabase corretas no `.env`
   - Realtime habilitado nas tabelas
   - RLS configurado corretamente
   - Servidor Realtime reiniciado após mudanças

5. **Fallback**: Se Realtime falhar, os dados iniciais ainda carregam do backend via REST API.

6. **Status Logs**: Console mostra emojis para facilitar debug:
   - ✅ `SUBSCRIBED` - Conectado com sucesso
   - ❌ `CHANNEL_ERROR` - Erro na conexão
   - ⚠️ `CLOSED` - Canal fechado

## 📚 Referências

- [Supabase Realtime Docs](https://supabase.com/docs/guides/realtime)
- [Supabase RLS](https://supabase.com/docs/guides/auth/row-level-security)
- [React Hooks Best Practices](https://react.dev/reference/react)

---

## 🔧 Troubleshooting

### Problema: `CHANNEL_ERROR` ou `CLOSED` constante

**Possíveis causas e soluções:**

1. **Credenciais inválidas**
   ```bash
   # Verifique no .env:
   VITE_SUPABASE_URL=https://xxx.supabase.co  # URL correta?
   VITE_SUPABASE_ANON_KEY=eyJ...              # Chave correta?
   ```

2. **Realtime não habilitado nas tabelas**
   ```sql
   -- Execute no Supabase SQL Editor:
   ALTER TABLE instance_chat REPLICA IDENTITY FULL;
   ALTER PUBLICATION supabase_realtime ADD TABLE instance_chat;
   
   ALTER TABLE instance_message REPLICA IDENTITY FULL;
   ALTER PUBLICATION supabase_realtime ADD TABLE instance_message;
   
   -- ⚠️ IMPORTANTE: Depois, reinicie o Realtime no Dashboard!
   ```

3. **RLS bloqueando acesso**
   ```sql
   -- Opção rápida para desenvolvimento:
   ALTER TABLE instance_chat DISABLE ROW LEVEL SECURITY;
   ALTER TABLE instance_message DISABLE ROW LEVEL SECURITY;
   
   -- OU configure políticas RLS adequadas (veja seção RLS acima)
   ```

4. **Servidor Realtime não reiniciado**
   - Vá para Supabase Dashboard → Database → Replication
   - Clique em "Restart Realtime"
   - Aguarde 10-30 segundos

5. **Tabelas não existem ou têm nomes diferentes**
   ```sql
   -- Verifique se as tabelas existem:
   SELECT tablename FROM pg_tables 
   WHERE schemaname = 'public' 
   AND tablename IN ('instance_chat', 'instance_message');
   ```

### Problema: Loop infinito de conexões

**Solução aplicada:** O código foi atualizado para usar flag `mounted` e evitar chamadas após unmount.

### Problema: Mensagens não aparecem em tempo real

1. **Verifique se INSERT está funcionando**
   ```sql
   -- Teste inserindo manualmente:
   INSERT INTO instance_message (instance_chat_id, text, sender, timestamp)
   VALUES (1, 'Teste', 'agent', NOW());
   ```

2. **Verifique o console do browser**
   - Deve mostrar: `✅ Messages realtime connected`
   - Ao inserir: `New message received: {...}`

3. **Verifique o filtro**
   ```javascript
   // O chatId usado no hook corresponde ao instance_chat_id no banco?
   const { messages } = useRealtimeMessages(chatId)
   ```

### Problema: Dados não carregam do backend

**Verifique os endpoints da API:**
```bash
# Teste no browser ou Postman:
GET http://localhost:3000/chats?instanceId=1
GET http://localhost:3000/messages?chatId=1
```

Se retornar erro 404/500, o problema está no backend, não no Realtime.
