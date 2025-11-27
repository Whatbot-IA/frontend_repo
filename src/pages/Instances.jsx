import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import styled from 'styled-components'
import io from 'socket.io-client'

function Instances() {
  const navigate = useNavigate()
  const [showAddModal, setShowAddModal] = useState(false)
  const [showInfoModal, setShowInfoModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedInstance, setSelectedInstance] = useState(null)
  
  // Socket.io states
  const [qrCodeUrl, setQrCodeUrl] = useState(null)
  const [connectionStatus, setConnectionStatus] = useState('disconnected')
  const socketRef = useRef(null)
  const [userData, setUserData] = useState(null)
  const [isSocketConnected, setIsSocketConnected] = useState(false)

  // Dados de exemplo (posteriormente virão da API)
  const instances = [
    {
      id: 'session-001',
      sessionId: 'whatsapp-vendas-01',
      status: 'connected',
      phone: '+244 923 456 789',
      name: 'Vendas Principal',
      connectedAt: '2024-10-28 14:30',
      lastActivity: '2024-10-30 10:15'
    },
    {
      id: 'session-002',
      sessionId: 'whatsapp-suporte-01',
      status: 'disconnected',
      phone: '+244 912 345 678',
      name: 'Suporte Técnico',
      connectedAt: '2024-10-25 09:20',
      lastActivity: '2024-10-29 18:45'
    },
    {
      id: 'session-003',
      sessionId: 'whatsapp-marketing-01',
      status: 'connected',
      phone: '+244 934 567 890',
      name: 'Marketing',
      connectedAt: '2024-10-27 11:15',
      lastActivity: '2024-10-30 09:30'
    }
  ]

  // Fetch user profile for userId
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Try to get from API first
        const { getUserProfile } = await import('../services/api')
        const result = await getUserProfile()
        if (result.success) {
          console.log('User data loaded:', result.data)
          setUserData(result.data)
        } else {
          console.error('Failed to load user profile:', result.error)
        }
      } catch (error) {
        console.error('Error loading user data:', error)
      }
    }
    fetchUserData()
  }, [])

  // Socket.io connection - only when modal opens
  useEffect(() => {
    if (!showAddModal) return

    // Initialize socket connection with proper config
    const newSocket = io('http://localhost:3000', {
      transports: ['websocket'],
      autoConnect: true,
    })

    // Evento: Conexão estabelecida
    newSocket.on('connect', () => {
      console.log('Conectado ao WebSocket! Socket ID:', newSocket.id)
      console.log('Socket connected:', newSocket.connected)
      setIsSocketConnected(true) // ✅ Atualiza o state
    })

    // Evento: QR Code recebido
    newSocket.on('qr_code', (data) => {
      console.log('📱 QR Code recebido do backend!')
      console.log('QR Code URL:', data.qrCodeUrl ? data.qrCodeUrl.substring(0, 50) + '...' : 'null')
      console.log('Tamanho do QR Code:', data.qrCodeUrl ? data.qrCodeUrl.length : 0, 'caracteres')
      setQrCodeUrl(data.qrCodeUrl) // Data URI (base64)
    })

    // Evento: Status da conexão
    newSocket.on('connection_status', (data) => {
      console.log('Status:', data.status)
      setConnectionStatus(data.status)
      
      // Limpar QR code após conectar
      if (data.status === 'ready' || data.status === 'authenticated') {
        setQrCodeUrl(null)
      }
    })

    // Evento: Desconectado
    newSocket.on('disconnect', () => {
      console.log('Desconectado do WebSocket')
      setIsSocketConnected(false) // ✅ Reseta
    })

    socketRef.current = newSocket

    // Cleanup when modal closes
    return () => {
      console.log('Fechando conexão WebSocket')
      newSocket.disconnect()
      socketRef.current = null
      // Reset states
      setQrCodeUrl(null)
      setConnectionStatus('disconnected')
      setIsSocketConnected(false) // ✅ Reseta state
    }
  }, [showAddModal])

  // Request QR Code when modal opens
  const requestQrCode = () => {
    console.log('=== requestQrCode called ===')
    console.log('Socket exists:', !!socketRef.current)
    console.log('Socket connected:', socketRef.current?.connected)
    console.log('UserData:', userData)
    console.log('UserId:', userData?.id)
    
    if (!socketRef.current) {
      console.error('❌ Socket não existe')
      return
    }
    
    if (!socketRef.current.connected) {
      console.error('❌ Socket não está conectado')
      return
    }
    
    if (!userData || !userData.id) {
      console.error('❌ UserData ou userId não disponível')
      return
    }
    
    // IMPORTANTE: Enviar userId do usuário logado
    console.log('✅ Emitindo request_qr com userId:', userData.id)
    socketRef.current.emit('request_qr', { userId: userData.id })
    console.log('✅ Evento request_qr emitido')
  }

  // Request QR when modal opens and socket is connected
  useEffect(() => {
    if (showAddModal && userData && isSocketConnected) { // ✅ Usa o state reativo
      console.log('Modal aberto, socket conectado, userData pronto - solicitando QR')
      // Wait a bit for socket to be fully ready
      setTimeout(() => {
        requestQrCode()
      }, 500)
    }
  }, [showAddModal, userData, isSocketConnected]) // ✅ Dependência correta

  const getStatusBadge = (status) => {
    const styles = {
      connected: 'bg-green-100 text-green-700',
      disconnected: 'bg-red-100 text-red-700',
      connecting: 'bg-yellow-100 text-yellow-700'
    }
    const labels = {
      connected: 'Conectado',
      disconnected: 'Desconectado',
      connecting: 'Conectando...'
    }
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${styles[status]}`}>
        {labels[status]}
      </span>
    )
  }

  const handleViewInfo = (instance) => {
    setSelectedInstance(instance)
    setShowInfoModal(true)
  }

  const handleDelete = (instance) => {
    setSelectedInstance(instance)
    setShowDeleteModal(true)
  }

  const confirmDelete = () => {
    // Aqui virá a lógica de delete via API
    console.log('Deletando instância:', selectedInstance.id)
    setShowDeleteModal(false)
    setSelectedInstance(null)
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 p-8 pt-20 lg:pt-8">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
              Instâncias WhatsApp
            </h1>
            <p className="text-gray-600">
              Gerencie suas contas WhatsApp conectadas
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-gradient-to-r from-whatsapp-primary to-whatsapp-secondary text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center gap-2"
          >
            <span className="text-xl">+</span>
            Nova Instância
          </button>
        </div>

        {/* Instances Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    ID da Sessão
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Nome
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Última Atividade
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {instances.map((instance) => (
                  <tr key={instance.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-sm font-mono text-gray-900">
                      {instance.sessionId}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                      {instance.name}
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(instance.status)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {instance.lastActivity}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleViewInfo(instance)}
                          className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-600 transition flex items-center gap-2"
                        >
                          <img src="/icon/info.png" alt="Info" className="w-4 h-4" />
                          Info
                        </button>
                        <button
                          onClick={() => navigate(`/instances/${instance.id}/chat`)}
                          className="bg-whatsapp-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-whatsapp-secondary transition flex items-center gap-2"
                        >
                          <img src="/icon/chat-blue.png" alt="Chat" className="w-4 h-4" />
                          Chat
                        </button>
                        <button
                          onClick={() => navigate(`/instances/${instance.id}/config`)}
                          className="bg-purple-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-600 transition flex items-center gap-2"
                        >
                          <img src="/icon/setting.png" alt="Config" className="w-4 h-4" />
                          Config
                        </button>
                        <button
                          onClick={() => handleDelete(instance)}
                          className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-600 transition flex items-center gap-2"
                        >
                          <img src="/icon/delete.png" alt="Delete" className="w-4 h-4" />
                          {instance.status === 'connected' ? 'Logout' : 'Eliminar'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="lg:hidden divide-y divide-gray-200">
            {instances.map((instance) => (
              <div key={instance.id} className="p-4 hover:bg-gray-50 transition">
                <div className="space-y-3">
                  {/* Header with Name and Status */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 text-lg">{instance.name}</h3>
                      <p className="text-xs font-mono text-gray-500 mt-1">{instance.sessionId}</p>
                    </div>
                    <div className="ml-2">
                      {getStatusBadge(instance.status)}
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <img src="/icon/phone.png" alt="Phone" className="w-4 h-4" />
                    <span>{instance.phone}</span>
                  </div>

                  {/* Last Activity */}
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <img src="/icon/clock.png" alt="Clock" className="w-4 h-4" />
                    <span>{instance.lastActivity}</span>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-4 gap-2 pt-2">
                    <button
                      onClick={() => handleViewInfo(instance)}
                      className="bg-blue-500 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-600 transition flex items-center justify-center gap-2"
                    >
                      <img src="/icon/info.png" alt="Info" className="w-4 h-4" />
                      Info
                    </button>
                    <button
                      onClick={() => navigate(`/instances/${instance.id}/chat`)}
                      className="bg-whatsapp-primary text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-whatsapp-secondary transition flex items-center justify-center gap-2"
                    >
                      <img src="/icon/chat.png" alt="Chat" className="w-4 h-4" />
                      Chat
                    </button>
                    <button
                      onClick={() => navigate(`/instances/${instance.id}/config`)}
                      className="bg-purple-500 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-purple-600 transition flex items-center justify-center gap-2"
                    >
                      <img src="/icon/setting.png" alt="Config" className="w-4 h-4" />
                      Config
                    </button>
                    <button
                      onClick={() => handleDelete(instance)}
                      className="bg-red-500 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-red-600 transition flex items-center justify-center gap-2"
                    >
                      <img src="/icon/delete.png" alt="Delete" className="w-4 h-4" />
                      {instance.status === 'connected' ? 'Logout' : 'Eliminar'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {instances.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg">Nenhuma instância encontrada</p>
              <p className="text-sm mt-2">Clique em "Nova Instância" para adicionar</p>
            </div>
          )}
        </div>
      </main>

      {/* Modal: Add New Instance */}
      {showAddModal && (
        <ModalOverlay onClick={() => setShowAddModal(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Nova Instância WhatsApp</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600 text-3xl leading-none"
              >
                ×
              </button>
            </div>

            <div className="space-y-6">
              {/* QR Code Section */}
              <div className="flex justify-center">
                {connectionStatus === 'ready' ? (
                  <div className="w-48 h-48 sm:w-64 sm:h-64 flex items-center justify-center bg-green-50 rounded-xl border-4 border-green-500 shadow-lg">
                    <div className="text-center p-4">
                      <div className="text-6xl mb-4">✅</div>
                      <p className="text-green-800 font-bold text-lg">WhatsApp conectado!</p>
                      <p className="text-green-600 text-sm mt-2">Sua instância está pronta para uso</p>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white p-3 sm:p-4 rounded-xl border-4 border-whatsapp-primary shadow-lg">
                    {qrCodeUrl ? (
                      <img
                        src={qrCodeUrl}
                        alt="QR Code"
                        className="w-48 h-48 sm:w-64 sm:h-64"
                      />
                    ) : (
                      <div className="w-48 h-48 sm:w-64 sm:h-64 flex items-center justify-center bg-gray-100 rounded">
                        <div className="text-center">
                          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-whatsapp-primary mx-auto mb-3"></div>
                          <p className="text-gray-600 text-sm">Gerando QR Code...</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Connection Status */}
              {connectionStatus && connectionStatus !== 'disconnected' && connectionStatus !== 'ready' && (
                <div className={`p-3 rounded-lg text-center font-semibold ${
                  connectionStatus === 'authenticated'
                    ? 'bg-green-100 text-green-800'
                    : connectionStatus === 'qr'
                    ? 'bg-blue-100 text-blue-800'
                    : connectionStatus === 'auth_failure' || connectionStatus === 'error'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  Status: {connectionStatus === 'authenticated' ? 'Autenticando... ✓' : 
                           connectionStatus === 'qr' ? 'Aguardando QR Code' : 
                           connectionStatus === 'auth_failure' ? 'Falha na autenticação ✗' :
                           connectionStatus === 'error' ? 'Erro na conexão ✗' :
                           connectionStatus}
                </div>
              )}

              <div className="bg-blue-50 border-l-4 border-blue-500 p-3 sm:p-4 rounded">
                <h3 className="font-bold text-blue-900 mb-3 flex items-center gap-2 text-sm sm:text-base">
                  <img src="/icon/help.png" alt="Help" className="w-4 h-4" />
                  Como conectar seu WhatsApp:
                </h3>
                <ol className="space-y-2 text-xs sm:text-sm text-blue-800">
                  <li className="flex items-start gap-2">
                    <span className="font-bold min-w-[20px]">1.</span>
                    <span>Abra o WhatsApp no seu telefone</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold min-w-[20px]">2.</span>
                    <span>Procure os 3 pontos <strong>⋮</strong> e clique</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold min-w-[20px]">3.</span>
                    <span>Clique em <strong>"Dispositivos associados"</strong></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold min-w-[20px]">4.</span>
                    <span>Clique em <strong>"Associar um dispositivo"</strong></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold min-w-[20px]">5.</span>
                    <span>Escaneie o QR Code acima</span>
                  </li>
                </ol>
              </div>

              <div className="flex flex-col sm:flex-row justify-end gap-3">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-6 py-2 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition order-2 sm:order-1"
                >
                  Cancelar
                </button>
                {connectionStatus === 'ready' ? (
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="px-6 py-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition order-1 sm:order-2"
                  >
                    Concluir ✓
                  </button>
                ) : (
                  <button
                    onClick={requestQrCode}
                    className="px-6 py-2 bg-gradient-to-r from-whatsapp-primary to-whatsapp-secondary text-white rounded-lg font-medium hover:shadow-lg transition order-1 sm:order-2"
                    disabled={!userData}
                  >
                    {qrCodeUrl ? 'Gerar Novo QR Code' : 'Aguardando Conexão...'}
                  </button>
                )}
              </div>
            </div>
          </ModalContent>
        </ModalOverlay>
      )}

      {/* Modal: Instance Info */}
      {showInfoModal && selectedInstance && (
        <ModalOverlay onClick={() => setShowInfoModal(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Informações da Instância</h2>
              <button
                onClick={() => setShowInfoModal(false)}
                className="text-gray-400 hover:text-gray-600 text-3xl leading-none"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <label className="text-sm font-semibold text-gray-600">ID da Sessão</label>
                <p className="text-lg font-mono text-gray-900 mt-1">{selectedInstance.sessionId}</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <label className="text-sm font-semibold text-gray-600">Nome</label>
                <p className="text-lg text-gray-900 mt-1">{selectedInstance.name}</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <label className="text-sm font-semibold text-gray-600">Telefone</label>
                <p className="text-lg text-gray-900 mt-1">{selectedInstance.phone}</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <label className="text-sm font-semibold text-gray-600">Status</label>
                <div className="mt-2">
                  {getStatusBadge(selectedInstance.status)}
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <label className="text-sm font-semibold text-gray-600">Conectado em</label>
                <p className="text-lg text-gray-900 mt-1">{selectedInstance.connectedAt}</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <label className="text-sm font-semibold text-gray-600">Última Atividade</label>
                <p className="text-lg text-gray-900 mt-1">{selectedInstance.lastActivity}</p>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowInfoModal(false)}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition"
              >
                Fechar
              </button>
            </div>
          </ModalContent>
        </ModalOverlay>
      )}

      {/* Modal: Delete/Logout Confirmation */}
      {showDeleteModal && selectedInstance && (
        <ModalOverlay onClick={() => setShowDeleteModal(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()} className="max-w-md">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
                <span className="text-3xl">⚠️</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                {selectedInstance.status === 'connected' ? 'Fazer Logout?' : 'Eliminar Instância?'}
              </h2>
              <p className="text-sm sm:text-base text-gray-600 mb-6">
                {selectedInstance.status === 'connected' 
                  ? `Tem certeza que deseja fazer logout da sessão "${selectedInstance.name}"? Você precisará escanear o QR Code novamente para reconectar.`
                  : `Tem certeza que deseja eliminar a sessão "${selectedInstance.name}"? Esta ação não pode ser desfeita.`
                }
              </p>

              <div className="bg-gray-50 p-3 rounded-lg mb-6">
                <p className="text-xs sm:text-sm font-mono text-gray-700 break-all">{selectedInstance.sessionId}</p>
              </div>

              <div className="flex flex-col sm:flex-row justify-center gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-6 py-2 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition order-2 sm:order-1"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-6 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition order-1 sm:order-2"
                >
                  {selectedInstance.status === 'connected' ? 'Sim, Fazer Logout' : 'Sim, Eliminar'}
                </button>
              </div>
            </div>
          </ModalContent>
        </ModalOverlay>
      )}
    </div>
  )
}

// Styled Components for Modals
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: 1rem;
  backdrop-filter: blur(4px);
  overflow-y: auto;
`

const ModalContent = styled.div`
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  margin: auto;
  
  @media (min-width: 640px) {
    padding: 2rem;
  }
  
  &.max-w-md {
    max-width: 28rem;
  }
`

export default Instances
