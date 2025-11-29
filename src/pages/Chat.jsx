import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import styled from 'styled-components'

function Chat() {
  const { instanceId } = useParams()
  const navigate = useNavigate()
  
  const [selectedChat, setSelectedChat] = useState(null)
  const [messageInput, setMessageInput] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [showMessages, setShowMessages] = useState(false) // Para controle mobile

  // Dados de exemplo (posteriormente virão da API)
  const instance = {
    id: instanceId,
    name: 'Vendas Principal',
    phone: '+244 923 456 789'
  }

  const [chats] = useState([
    {
      id: 'chat-001',
      clientNumber: '+244 912 345 678',
      clientName: 'Cliente 1',
      lastMessage: 'Obrigado pelo atendimento!',
      lastMessageTime: '10:30',
      unreadCount: 2,
      isOnline: true
    },
    {
      id: 'chat-002',
      clientNumber: '+244 923 456 789',
      clientName: 'Cliente 2',
      lastMessage: 'Quanto custa esse produto?',
      lastMessageTime: '09:15',
      unreadCount: 0,
      isOnline: false
    },
    {
      id: 'chat-003',
      clientNumber: '+244 934 567 890',
      clientName: 'Cliente 3',
      lastMessage: 'Está disponível para entrega?',
      lastMessageTime: 'Ontem',
      unreadCount: 5,
      isOnline: true
    },
    {
      id: 'chat-004',
      clientNumber: '+244 945 678 901',
      clientName: 'Cliente 4',
      lastMessage: 'Perfeito, vou fazer o pedido',
      lastMessageTime: 'Ontem',
      unreadCount: 0,
      isOnline: false
    },
    {
      id: 'chat-005',
      clientNumber: '+244 956 789 012',
      clientName: 'Cliente 5',
      lastMessage: 'Bom dia! Gostaria de saber...',
      lastMessageTime: '15/10',
      unreadCount: 1,
      isOnline: false
    }
  ])

  const [messages, setMessages] = useState({
    'chat-001': [
      {
        id: 'msg-001',
        text: 'Olá! Gostaria de saber mais sobre os produtos.',
        sender: 'client',
        time: '10:20',
        date: '30/10/2024'
      },
      {
        id: 'msg-002',
        text: 'Olá! Claro, temos vários produtos disponíveis. O que você procura?',
        sender: 'agent',
        time: '10:22',
        date: '30/10/2024'
      },
      {
        id: 'msg-003',
        text: 'Estou interessado em smartphones.',
        sender: 'client',
        time: '10:25',
        date: '30/10/2024'
      },
      {
        id: 'msg-004',
        text: 'Temos o Smartphone Galaxy X por 250.000 AOA com 128GB de memória.',
        sender: 'agent',
        time: '10:27',
        date: '30/10/2024'
      },
      {
        id: 'msg-005',
        text: 'Obrigado pelo atendimento!',
        sender: 'client',
        time: '10:30',
        date: '30/10/2024'
      }
    ],
    'chat-002': [
      {
        id: 'msg-006',
        text: 'Quanto custa esse produto?',
        sender: 'client',
        time: '09:15',
        date: '30/10/2024'
      }
    ],
    'chat-003': [
      {
        id: 'msg-007',
        text: 'Está disponível para entrega?',
        sender: 'client',
        time: '08:45',
        date: '29/10/2024'
      }
    ]
  })

  const handleSendMessage = () => {
    if (messageInput.trim() && selectedChat) {
      const newMessage = {
        id: `msg-${Date.now()}`,
        text: messageInput,
        sender: 'agent',
        time: new Date().toLocaleTimeString('pt-AO', { hour: '2-digit', minute: '2-digit' }),
        date: new Date().toLocaleDateString('pt-AO')
      }

      setMessages({
        ...messages,
        [selectedChat.id]: [...(messages[selectedChat.id] || []), newMessage]
      })

      setMessageInput('')
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const filteredChats = chats.filter(chat =>
    chat.clientNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.clientName.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleSelectChat = (chat) => {
    setSelectedChat(chat)
    setShowMessages(true) // Mostra mensagens no mobile
  }

  const handleBackToList = () => {
    setShowMessages(false) // Volta para lista no mobile
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
              {filteredChats.map((chat) => (
                <ChatItem
                  key={chat.id}
                  $active={selectedChat?.id === chat.id}
                  onClick={() => handleSelectChat(chat)}
                >
                  <div className="flex items-start gap-3">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-white font-bold">
                        {chat.clientName.charAt(0)}
                      </div>
                      {chat.isOnline && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline mb-1">
                        <h3 className="font-semibold text-gray-900 truncate">
                          {chat.clientNumber}
                        </h3>
                        <span className="text-xs text-gray-500 ml-2">
                          {chat.lastMessageTime}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <p className="text-sm text-gray-600 truncate">
                          {chat.lastMessage}
                        </p>
                        {chat.unreadCount > 0 && (
                          <span className="ml-2 bg-whatsapp-primary text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                            {chat.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </ChatItem>
              ))}

              {filteredChats.length === 0 && (
                <div className="p-8 text-center text-gray-500">
                  <p>Nenhuma conversa encontrada</p>
                </div>
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
                  
                  <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-white font-bold">
                    {selectedChat.clientName.charAt(0)}
                  </div>
                  <div>
                    <h2 className="font-semibold text-gray-900">
                      {selectedChat.clientNumber}
                    </h2>
                    <p className="text-xs text-gray-500">
                      {selectedChat.isOnline ? 'Online' : 'Offline'}
                    </p>
                  </div>
                </div>

                {/* Messages */}
                <MessagesArea>
                  {(messages[selectedChat.id] || []).map((message) => (
                    <MessageBubble key={message.id} sender={message.sender}>
                      <div className="message-content">
                        {message.text}
                      </div>
                      <div className="message-time">
                        {message.time}
                      </div>
                    </MessageBubble>
                  ))}

                  {(!messages[selectedChat.id] || messages[selectedChat.id].length === 0) && (
                    <div className="flex-1 flex items-center justify-center text-gray-500">
                      <p>Nenhuma mensagem ainda. Inicie a conversa!</p>
                    </div>
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
                    disabled={!messageInput.trim()}
                    className="bg-whatsapp-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-whatsapp-secondary transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                      <line x1="22" y1="2" x2="11" y2="13"></line>
                      <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                    </svg>
                    Enviar
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
