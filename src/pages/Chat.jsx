import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import styled from 'styled-components'
import { useRealtimeChats, useRealtimeMessages } from '../hooks/useRealtime'
import { sendMessage, getContacts } from '../services/api'
import Loader from '../components/Loader'

function Chat() {
  const { instanceId } = useParams()
  const navigate = useNavigate()
  
  // Log para debug
  console.log('📱 Chat page loaded with instanceId:', instanceId)
  
  const [selectedChat, setSelectedChat] = useState(null)
  const [messageInput, setMessageInput] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [showMessages, setShowMessages] = useState(false) // Para controle mobile
  const [isSending, setIsSending] = useState(false)
  const [contactsMap, setContactsMap] = useState({}) // Mapa de telefone -> nome do contato

  // Usar hooks de Realtime
  const { chats, isLoading: isLoadingChats, error: chatsError } = useRealtimeChats(instanceId)
  const { messages, isLoading: isLoadingMessages, error: messagesError } = useRealtimeMessages(selectedChat?.id)

  // Buscar lista de contatos ao carregar
  useEffect(() => {
    const loadContacts = async () => {
      try {
        const response = await getContacts()
        console.log('📞 Contacts API response:', response)
        if (response.success) {
          // Criar mapa de telefone -> nome
          const map = {}
          response.data.forEach(contact => {
            console.log('👤 Contact:', contact)
            // O campo correto é phoneNumber, não phone
            if (contact.phoneNumber) {
              // Normalizar telefone removendo caracteres especiais
              const normalizedPhone = contact.phoneNumber.replace(/[^0-9]/g, '')
              map[normalizedPhone] = contact.name
              console.log(`  → Mapped: ${normalizedPhone} => ${contact.name}`)
            }
          })
          setContactsMap(map)
          console.log('📇 Contacts map loaded:', map)
        }
      } catch (error) {
        console.error('Error loading contacts:', error)
      }
    }
    loadContacts()
  }, [])

  // Dados da instância (posteriormente virá da API)
  const instance = {
    id: instanceId,
    name: 'Vendas Principal',
    phone: '+244 923 456 789'
  }

  const handleSendMessage = async () => {
    if (messageInput.trim() && selectedChat) {
      try {
        setIsSending(true)
        
        const response = await sendMessage(selectedChat.id, {
          text: messageInput
        })

        if (response.success) {
          setMessageInput('')
          // A mensagem será adicionada automaticamente via Realtime
        } else {
          console.error('Erro ao enviar mensagem:', response.error)
          alert(response.error?.message || 'Erro ao enviar mensagem')
        }
      } catch (error) {
        console.error('Erro ao enviar mensagem:', error)
        alert('Erro ao enviar mensagem')
      } finally {
        setIsSending(false)
      }
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const filteredChats = chats.filter(chat => {
    const clientPhone = chat.clientPhone || ''
    const contactName = chat.contact?.name || ''
    const query = searchQuery.toLowerCase()
    
    return clientPhone.toLowerCase().includes(query) ||
           contactName.toLowerCase().includes(query)
  })

  const handleSelectChat = (chat) => {
    console.log('📞 Selected chat:', chat)
    setSelectedChat(chat)
    setShowMessages(true) // Mostra mensagens no mobile
  }

  const handleBackToList = () => {
    setShowMessages(false) // Volta para lista no mobile
  }

  // Função helper para obter nome de exibição consistente
  const getDisplayInfo = (chat) => {
    const clientPhone = chat?.clientPhone || 'Desconhecido'
    // Buscar nome do contato no mapa (fonte de verdade)
    const normalizedPhone = clientPhone.replace(/[^0-9]/g, '')
    let contactName = contactsMap[normalizedPhone] || null
    
    // Fallback: se não encontrar no mapa, usar o nome que vem do chat
    if (!contactName && chat?.contact?.name) {
      contactName = chat.contact.name
    }
    
    const displayName = contactName || `+${clientPhone}`
    
    console.log(`🔍 Display info for ${clientPhone}:`, { normalizedPhone, contactName, fromMap: !!contactsMap[normalizedPhone], fromChat: !!chat?.contact?.name })
    
    return { clientPhone, contactName, displayName }
  }

  // Função helper para obter nome do contato por telefone
  const getContactNameByPhone = (phone) => {
    if (!phone) return null
    const normalizedPhone = phone.replace(/[^0-9]/g, '')
    return contactsMap[normalizedPhone] || null
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 flex flex-col h-screen">
        {/* Header - Visível na lista e sempre no desktop */}
        {(!showMessages || window.innerWidth >= 1024) && (
          <div className="bg-white border-b border-gray-200 p-4 lg:p-6 pt-20 lg:pt-6">
            <div className="flex items-center gap-4">
              {/* Botão voltar para instâncias */}
              <button
                onClick={() => navigate('/instances')}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition flex-shrink-0"
              >
                <span>←</span>
                <span className="hidden sm:inline">Voltar</span>
              </button>
              {/* Título */}
              <div className="flex-1 min-w-0">
                <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 truncate">
                  {instance.name}
                </h1>
                <p className="text-sm text-gray-600 truncate">{instance.phone}</p>
              </div>
            </div>
          </div>
        )}

        {/* Chat Container */}
        <div className="flex-1 flex overflow-hidden">
          {/* Chat List Sidebar */}
          <ChatListContainer $showMessages={showMessages}>
            <div className="p-4 border-b border-gray-200 bg-white">
              <input
                type="text"
                placeholder="Pesquisar conversas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-whatsapp-primary focus:border-transparent outline-none"
              />
            </div>

            <div className="overflow-y-auto flex-1">
              {isLoadingChats ? (
                <div className="flex items-center justify-center py-8">
                  <Loader />
                </div>
              ) : chatsError ? (
                <div className="p-4 text-center text-red-500">
                  <p>⚠️ {chatsError}</p>
                </div>
              ) : filteredChats.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <p>Nenhuma conversa encontrada</p>
                </div>
              ) : (
                filteredChats.map((chat) => {
                  // Se o clientPhone estiver incorreto, tenta buscar das mensagens
                  let actualClientPhone = chat.clientPhone || 'Desconhecido'
                  
                  // Se tiver mensagens deste chat carregadas, pegar o telefone real
                  if ((actualClientPhone === 'Desconhecido' || !actualClientPhone) && messages.length > 0 && selectedChat?.id === chat.id) {
                    const clientMessage = messages.find(m => m.instanceChat?.clientPhone)
                    if (clientMessage) {
                      actualClientPhone = clientMessage.instanceChat.clientPhone
                    }
                  }
                  
                  // Buscar nome do contato usando o telefone real
                  const normalizedPhone = actualClientPhone.replace(/[^0-9]/g, '')
                  const contactName = contactsMap[normalizedPhone] || chat.contact?.name || null
                  const displayName = contactName || `+${actualClientPhone}`
                  const createdAt = chat.createdAt
                  
                  return (
                    <ChatItem
                      key={chat.id}
                      $active={selectedChat?.id === chat.id}
                      onClick={() => handleSelectChat(chat)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="relative">
                          <div className="w-12 h-12 rounded-full bg-whatsapp-primary text-white flex items-center justify-center text-lg font-bold">
                            {displayName.charAt(0).toUpperCase()}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-baseline mb-1">
                            <h3 className="font-semibold text-gray-900 truncate">
                              {displayName}
                            </h3>
                            <span className="text-xs text-gray-500 ml-2">
                              {createdAt ? new Date(createdAt).toLocaleDateString('pt-AO', { day: '2-digit', month: '2-digit' }) : ''}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <p className="text-sm text-gray-500">
                              {contactName ? `+${actualClientPhone}` : 'Clique para ver mensagens'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </ChatItem>
                  )
                })
              )}
            </div>
          </ChatListContainer>

          {/* Messages Area */}
          <MessagesContainer $showMessages={showMessages}>
            {selectedChat ? (
              <>
                {/* Chat Header */}
                <div className="bg-white border-b border-gray-200 p-4 pt-20 lg:pt-4 flex items-center gap-3">
                  {/* Botão Voltar (apenas mobile) */}
                  <button
                    onClick={handleBackToList}
                    className="lg:hidden flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition"
                  >
                    <span className="text-2xl">←</span>
                  </button>
                  
                  {(() => {
                    // Tentar obter o telefone real das mensagens se o chat estiver incorreto
                    let actualClientPhone = selectedChat.clientPhone
                    if (messages.length > 0 && (actualClientPhone === 'Desconhecido' || !actualClientPhone)) {
                      // Pegar o telefone da primeira mensagem do cliente
                      const clientMessage = messages.find(m => m.instanceChat?.clientPhone)
                      if (clientMessage) {
                        actualClientPhone = clientMessage.instanceChat.clientPhone
                      }
                    }
                    
                    // Buscar nome do contato usando o telefone real
                    const normalizedPhone = actualClientPhone?.replace(/[^0-9]/g, '') || ''
                    const contactName = contactsMap[normalizedPhone] || selectedChat.contact?.name || null
                    const displayName = contactName || (actualClientPhone ? `+${actualClientPhone}` : 'Desconhecido')
                    
                    return (
                      <>
                        <div className="w-10 h-10 rounded-full bg-whatsapp-primary text-white flex items-center justify-center text-lg font-bold">
                          {displayName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h2 className="font-semibold text-gray-900">
                            {displayName}
                          </h2>
                          <p className="text-xs text-gray-500">
                            {contactName ? `+${actualClientPhone}` : `Chat ID: ${selectedChat.id}`}
                          </p>
                        </div>
                      </>
                    )
                  })()}
                </div>

                {/* Messages */}
                <MessagesArea>
                  {isLoadingMessages ? (
                    <div className="flex-1 flex items-center justify-center">
                      <div className="text-gray-500 text-center">
                        <div className="mb-3">
                          <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-gray-300 border-t-whatsapp-primary"></div>
                        </div>
                        <p className="text-sm">Carregando as mensagens...</p>
                      </div>
                    </div>
                  ) : messagesError ? (
                    <div className="flex-1 flex items-center justify-center text-red-500">
                      <p>⚠️ {messagesError}</p>
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="flex-1 flex items-center justify-center text-gray-500">
                      <p>Nenhuma mensagem ainda. Inicie a conversa!</p>
                    </div>
                  ) : (
                    messages.map((message) => {
                      // Obter o telefone do cliente da mensagem se selectedChat não tiver
                      const actualClientPhone = selectedChat.clientPhone || message.instanceChat?.clientPhone || ''
                      
                      // Normalizar telefones para comparação
                      const normalizedSender = message.senderPhone?.replace(/[^0-9]/g, '') || ''
                      const normalizedClient = actualClientPhone.replace(/[^0-9]/g, '')
                      
                      // Determinar quem é o remetente comparando telefones normalizados
                      const isFromClient = normalizedSender === normalizedClient
                      const sender = isFromClient ? 'client' : 'agent'
                      
                      console.log('📨 Message sender check:', {
                        messageId: message.id,
                        content: message.content?.substring(0, 30) + '...',
                        senderPhone: message.senderPhone,
                        normalizedSender,
                        selectedChatClientPhone: selectedChat.clientPhone,
                        actualClientPhone: actualClientPhone,
                        normalizedClient,
                        comparison: `${normalizedSender} === ${normalizedClient}`,
                        isFromClient,
                        sender,
                        willRender: isFromClient ? '⬅️ LEFT (client)' : '➡️ RIGHT (agent)'
                      })
                      
                      return (
                        <MessageBubble key={message.id} sender={sender}>
                          <div className="message-content">
                            {message.content || ''}
                          </div>
                          <div className="message-time">
                            {message.createdAt 
                              ? new Date(message.createdAt).toLocaleTimeString('pt-AO', { hour: '2-digit', minute: '2-digit' }) 
                              : ''}
                          </div>
                        </MessageBubble>
                      )
                    })
                  )}
                </MessagesArea>

                {/* Input Area */}
                <InputArea>
                  <input
                    type="text"
                    placeholder="Digite sua mensagem..."
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-whatsapp-primary focus:border-transparent outline-none"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!messageInput.trim() || isSending}
                    className="bg-whatsapp-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-whatsapp-secondary transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                      <line x1="22" y1="2" x2="11" y2="13"></line>
                      <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                    </svg>
                    {isSending ? 'Enviando...' : 'Enviar'}
                  </button>
                </InputArea>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <img src="/icon/chat.png" alt="Chat" className="w-20 h-20 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">Selecione uma conversa para começar</p>
                </div>
              </div>
            )}
          </MessagesContainer>
        </div>
      </main>
    </div>
  )
}

// Styled Components
const ChatListContainer = styled.div`
  width: 100%;
  max-width: 380px;
  background: white;
  border-right: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  
  @media (max-width: 1024px) {
    max-width: 100%;
    border-right: none;
    display: ${props => props.$showMessages ? 'none' : 'flex'};
  }
`

const ChatItem = styled.div`
  padding: 16px;
  border-bottom: 1px solid #f3f4f6;
  cursor: pointer;
  transition: background-color 0.2s;
  background-color: ${props => props.$active ? '#f0fdf4' : 'white'};

  &:hover {
    background-color: ${props => props.$active ? '#f0fdf4' : '#f9fafb'};
  }
`

const MessagesContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #f9fafb;
  
  @media (max-width: 1024px) {
    display: ${props => props.$showMessages ? 'flex' : 'none'};
  }
`

const MessagesArea = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`

const MessageBubble = styled.div`
  display: flex;
  flex-direction: column;
  align-items: ${props => props.sender === 'agent' ? 'flex-end' : 'flex-start'};
  max-width: 70%;
  align-self: ${props => props.sender === 'agent' ? 'flex-end' : 'flex-start'};

  .message-content {
    background: ${props => props.sender === 'agent' ? '#25D366' : 'white'};
    color: ${props => props.sender === 'agent' ? 'white' : '#323232'};
    padding: 12px 16px;
    border-radius: 12px;
    border-bottom-right-radius: ${props => props.sender === 'agent' ? '4px' : '12px'};
    border-bottom-left-radius: ${props => props.sender === 'client' ? '4px' : '12px'};
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
    word-wrap: break-word;
  }

  .message-time {
    font-size: 11px;
    color: #9ca3af;
    margin-top: 4px;
    padding: 0 8px;
  }
`

const InputArea = styled.div`
  background: white;
  border-top: 1px solid #e5e7eb;
  padding: 16px;
  display: flex;
  gap: 12px;

  @media (max-width: 640px) {
    flex-direction: column;
    
    button {
      width: 100%;
    }
  }
`

export default Chat
