import { useEffect, useState } from 'react'
import { supabase } from '../services/supabase'
import { getChats, getMessages } from '../services/api'

/**
 * Hook para escutar mudanças em tempo real nos chats de uma instância
 * @param {number} instanceId - ID da instância do WhatsApp
 * @returns {Object} { chats, isLoading, error }
 */
export const useRealtimeChats = (instanceId) => {
  const [chats, setChats] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!instanceId) {
      setIsLoading(false)
      return
    }

    let channel = null
    let mounted = true

    const initializeChats = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // 1. Buscar dados iniciais do backend
        console.log('🔍 Fetching chats for instanceId:', instanceId)
        const response = await getChats(instanceId)
        console.log('📦 Chats response:', response)
        
        if (!mounted) return

        if (response.success) {
          console.log('💾 Chats data structure:', response.data.length > 0 ? response.data[0] : 'No chats')
          setChats(response.data)
        } else {
          setError(response.error?.message || 'Erro ao carregar chats')
        }
      } catch (err) {
        if (!mounted) return
        setError('Erro ao carregar chats')
        console.error('Error loading chats:', err)
      } finally {
        if (mounted) setIsLoading(false)
      }

      // 2. Subscrever para mudanças em tempo real
      if (!mounted) return

      channel = supabase
        .channel(`public:instance_chat:instance_id=eq.${instanceId}`)
        .on(
          'postgres_changes',
          {
            event: '*', // Listen for INSERT, UPDATE, DELETE
            schema: 'public',
            table: 'instance_chat',
            filter: `instance_id=eq.${instanceId}`
          },
          (payload) => {
            if (!mounted) return
            console.log('Chat change received:', payload)
            handleRealtimeEvent(payload)
          }
        )
        .subscribe((status) => {
          if (!mounted) return
          console.log('Chat subscription status:', status)
          
          if (status === 'SUBSCRIBED') {
            console.log('✅ Chat realtime connected')
            setError(null)
          } else if (status === 'CHANNEL_ERROR') {
            console.error('❌ Chat realtime error')
            setError('Erro na conexão Realtime')
          } else if (status === 'CLOSED') {
            console.warn('⚠️ Chat realtime closed')
          }
        })
    }

    initializeChats()

    // Cleanup: remover channel ao desmontar
    return () => {
      mounted = false
      if (channel) {
        channel.unsubscribe()
        supabase.removeChannel(channel)
      }
    }
  }, [instanceId])

  const handleRealtimeEvent = (payload) => {
    const { eventType, new: newRecord, old: oldRecord } = payload

    if (eventType === 'INSERT') {
      // Adicionar novo chat no início da lista
      setChats((prev) => [newRecord, ...prev])
    } else if (eventType === 'UPDATE') {
      // Atualizar chat existente
      setChats((prev) =>
        prev.map((chat) => (chat.id === newRecord.id ? newRecord : chat))
      )
    } else if (eventType === 'DELETE') {
      // Remover chat deletado
      setChats((prev) => prev.filter((chat) => chat.id !== oldRecord.id))
    }
  }

  return { chats, isLoading, error }
}

/**
 * Hook para escutar mudanças em tempo real nas mensagens de um chat
 * @param {number} chatId - ID do chat
 * @returns {Object} { messages, isLoading, error }
 */
export const useRealtimeMessages = (chatId) => {
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!chatId) {
      setIsLoading(false)
      setMessages([])
      return
    }

    let channel = null
    let mounted = true

    const initializeMessages = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // 1. Buscar mensagens iniciais do backend
        console.log('🔍 Fetching messages for chatId:', chatId)
        const response = await getMessages(chatId)
        console.log('📦 Messages response:', response)
        
        if (!mounted) return

        if (response.success) {
          setMessages(response.data)
        } else {
          setError(response.error?.message || 'Erro ao carregar mensagens')
        }
      } catch (err) {
        if (!mounted) return
        setError('Erro ao carregar mensagens')
        console.error('Error loading messages:', err)
      } finally {
        if (mounted) setIsLoading(false)
      }

      // 2. Subscrever para novas mensagens
      if (!mounted) return

      channel = supabase
        .channel(`public:instance_message:instance_chat_id=eq.${chatId}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'instance_message',
            filter: `instance_chat_id=eq.${chatId}`
          },
          async (payload) => {
            if (!mounted) return
            console.log('New message received:', payload)
            
            // Recarregar todas as mensagens para garantir dados completos
            try {
              const response = await getMessages(chatId)
              if (response.success && mounted) {
                setMessages(response.data)
              }
            } catch (error) {
              console.error('Error reloading messages:', error)
            }
          }
        )
        .subscribe((status) => {
          if (!mounted) return
          console.log('Messages subscription status:', status)
          
          if (status === 'SUBSCRIBED') {
            console.log('✅ Messages realtime connected')
            setError(null)
          } else if (status === 'CHANNEL_ERROR') {
            console.error('❌ Messages realtime error')
            setError('Erro na conexão Realtime de mensagens')
          } else if (status === 'CLOSED') {
            console.warn('⚠️ Messages realtime closed')
          }
        })
    }

    initializeMessages()

    // Cleanup: remover channel ao desmontar
    return () => {
      mounted = false
      if (channel) {
        channel.unsubscribe()
        supabase.removeChannel(channel)
      }
    }
  }, [chatId])

  return { messages, isLoading, error }
}
