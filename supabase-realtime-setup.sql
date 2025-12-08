-- ============================================
-- SUPABASE REALTIME SETUP
-- Execute este script no Supabase SQL Editor
-- ============================================

-- Passo 1: Habilitar REPLICA IDENTITY para Realtime
ALTER TABLE instance_chat REPLICA IDENTITY FULL;
ALTER TABLE instance_message REPLICA IDENTITY FULL;

-- Passo 2: Adicionar tabelas à publicação Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE instance_chat;
ALTER PUBLICATION supabase_realtime ADD TABLE instance_message;

-- Passo 3: Verificar se foi configurado corretamente
SELECT 
    schemaname,
    tablename,
    pubname
FROM pg_publication_tables 
WHERE pubname = 'supabase_realtime'
AND tablename IN ('instance_chat', 'instance_message');
-- Deve retornar 2 linhas (uma para cada tabela)

-- ============================================
-- OPÇÃO A: Desabilitar RLS (APENAS DESENVOLVIMENTO)
-- ⚠️ USE ISSO SOMENTE EM AMBIENTE DE DESENVOLVIMENTO
-- ============================================

-- Descomente as linhas abaixo se quiser desabilitar RLS:
-- ALTER TABLE instance_chat DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE instance_message DISABLE ROW LEVEL SECURITY;

-- ============================================
-- OPÇÃO B: Configurar RLS (RECOMENDADO PARA PRODUÇÃO)
-- ============================================

-- Habilitar RLS
ALTER TABLE instance_chat ENABLE ROW LEVEL SECURITY;
ALTER TABLE instance_message ENABLE ROW LEVEL SECURITY;

-- Permitir leitura pública (ajuste conforme necessidade)
-- Esta política permite que qualquer usuário autenticado leia todos os chats
CREATE POLICY "Allow authenticated read access on chats"
ON instance_chat FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Allow authenticated read access on messages"
ON instance_message FOR SELECT
TO authenticated
USING (true);

-- OU use políticas mais restritivas:
-- Descomentar e ajustar conforme sua estrutura de dados

/*
-- Apenas chats da própria instância do usuário
CREATE POLICY "Users can view their instance chats"
ON instance_chat FOR SELECT
USING (
  instance_id IN (
    SELECT id FROM instances WHERE user_id = auth.uid()
  )
);

-- Apenas mensagens de chats que o usuário tem acesso
CREATE POLICY "Users can view their chat messages"
ON instance_message FOR SELECT
USING (
  instance_chat_id IN (
    SELECT ic.id 
    FROM instance_chat ic
    INNER JOIN instances i ON i.id = ic.instance_id
    WHERE i.user_id = auth.uid()
  )
);
*/

-- ============================================
-- VERIFICAÇÃO FINAL
-- ============================================

-- Verificar políticas RLS criadas
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies
WHERE tablename IN ('instance_chat', 'instance_message')
ORDER BY tablename, policyname;

-- ============================================
-- ⚠️ IMPORTANTE: PRÓXIMOS PASSOS
-- ============================================
-- 1. Após executar este script, vá para:
--    Supabase Dashboard → Database → Replication
-- 2. Clique em "Restart Realtime" ou recarregue as configurações
-- 3. Aguarde 10-30 segundos para o serviço reiniciar
-- 4. Teste a aplicação e verifique os logs do console do browser
-- ============================================
