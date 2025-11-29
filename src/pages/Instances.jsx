import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import styled from 'styled-components'
import io from 'socket.io-client'
import { getWhatsAppInstances, deleteWhatsAppInstance } from '../services/api'

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
  const [currentSessionId, setCurrentSessionId] = useState(null)

  // Instances data from API
  const [instances, setInstances] = useState([])
  const [isLoadingInstances, setIsLoadingInstances] = useState(true)
  const [error, setError] = useState(null)

  // Fetch instances from API
  const fetchInstances = async () => {
    setIsLoadingInstances(true)
    setError(null)
    try {
      const result = await getWhatsAppInstances()
      if (result.success) {
        console.log('Instances loaded:', result.data)
        setInstances(result.data)
      } else {
        console.error('Failed to load instances:', result.error)
        setError(result.error.message)
      }
    } catch (error) {
      console.error('Error loading instances:', error)
      setError('Erro ao carregar instâncias')
    } finally {
      setIsLoadingInstances(false)
    }
  }

  // Load instances on mount
  useEffect(() => {
    fetchInstances()
  }, [])

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

  // Função para verificar e renovar token antes de conectar
  const ensureValidToken = async () => {
    const token = localStorage.getItem('accessToken')
    if (!token) {
      navigate('/signin')
      return null
    }

    // Decodificar token para verificar expiração
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      const expiresAt = payload.exp * 1000 // Converter para ms
      const now = Date.now()
      const timeUntilExpiry = expiresAt - now

      // Se falta menos de 5 minutos para expirar, fazer refresh
      if (timeUntilExpiry < 5 * 60 * 1000) {
        console.log('Token expirando em breve, fazendo refresh...')
        
        try {
          const { refreshAccessToken } = await import('../services/api')
          const result = await refreshAccessToken()
          
          if (result.success) {
            console.log('Token renovado com sucesso')
            return result.data.accessToken
          } else {
            console.error('Falha ao renovar token')
            localStorage.removeItem('accessToken')
            localStorage.removeItem('refreshToken')
            navigate('/signin')
            return null
          }
        } catch (error) {
          console.error('Erro ao renovar token:', error)
          localStorage.removeItem('accessToken')
          localStorage.removeItem('refreshToken')
          navigate('/signin')
          return null
        }
      }

      return token
    } catch (error) {
      console.error('Token inválido:', error)
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      navigate('/signin')
      return null
    }
  }

  // Socket.io connection - only when modal opens
  useEffect(() => {
    if (!showAddModal) return

    let newSocket = null
    let isCleanedUp = false

    const initializeSocket = async () => {
      // Garantir que temos um token válido
      const token = await ensureValidToken()
      if (!token || isCleanedUp) return

      // Initialize socket connection with JWT authentication
      newSocket = io('http://localhost:3000', {
        transports: ['websocket'],
        autoConnect: true,
        auth: { token }
      })

      // Evento: Conexão estabelecida
      newSocket.on('connect', () => {
        console.log('Conectado ao WebSocket! Socket ID:', newSocket.id)
        console.log('Socket connected:', newSocket.connected)
        setIsSocketConnected(true)
      })

      // Evento: Session criada
      newSocket.on('session_created', ({ sessionId }) => {
        console.log('Nova sessão criada:', sessionId)
        setCurrentSessionId(sessionId)
        // Save sessionId for this instance
        localStorage.setItem('whatsapp_session', sessionId)
      })

      // Evento: QR Code recebido
      newSocket.on('qr_code', ({ sessionId, qr }) => {
        console.log('📱 QR Code recebido do backend!')
        console.log('SessionId:', sessionId)
        console.log('QR Code URL:', qr ? qr.substring(0, 50) + '...' : 'null')
        
        // Update QR code regardless of currentSessionId (we'll get the right one from backend)
        setQrCodeUrl(qr) // Data URI (base64)
        setCurrentSessionId(sessionId) // Update session ID when we get QR
      })

      // Evento: Status da conexão
      newSocket.on('connection_status', ({ sessionId, status }) => {
        console.log('Status:', status, 'SessionId:', sessionId)
        
        setConnectionStatus(status)
        
        // Limpar QR code quando autenticado
        if (status === 'authenticated') {
          setQrCodeUrl(null)
        }
        
        // Recarregar instâncias após conexão pronta
        if (status === 'ready') {
          setQrCodeUrl(null)
          setTimeout(() => {
            fetchInstances()
          }, 1000)
        }
      })

      // Evento: Desconectado
      newSocket.on('disconnect', () => {
        console.log('Desconectado do WebSocket')
        setIsSocketConnected(false)
      })

      // Evento: Erro de autenticação ou outros erros
      newSocket.on('error', (errorData) => {
        console.error('Erro do WebSocket:', errorData)
        
        // Tratar token expirado especificamente
        if (errorData.code === 'TOKEN_EXPIRED') {
          setError('Sua sessão expirou. Redirecionando para login...')
          
          // Aguardar 2 segundos para o usuário ver a mensagem
          setTimeout(() => {
            // Limpar tokens
            localStorage.removeItem('accessToken')
            localStorage.removeItem('refreshToken')
            
            // Redirecionar para login
            navigate('/signin')
          }, 2000)
        } else if (errorData.code === 'INSTANCE_LIMIT_EXCEEDED') {
          // Limite de instâncias atingido
          setError(errorData.message || 'Limite de instâncias atingido. Atualize seu plano para criar mais instâncias.')
          setQrCodeUrl(null) // Limpar QR code se estiver mostrando
          setConnectionStatus('error')
        } else {
          setError(errorData.message || 'Erro desconhecido')
        }
      })

      socketRef.current = newSocket
    }

    initializeSocket()

    // Cleanup when modal closes
    return () => {
      console.log('Fechando conexão WebSocket')
      isCleanedUp = true
      if (newSocket) {
        newSocket.disconnect()
      }
      socketRef.current = null
      // Reset states
      setQrCodeUrl(null)
      setConnectionStatus('disconnected')
      setIsSocketConnected(false)
      setCurrentSessionId(null)
      setError(null)
    }
  }, [showAddModal, navigate])

  // Request QR Code when modal opens
  const requestQrCode = () => {
    console.log('=== requestQrCode called ===')
    console.log('Socket exists:', !!socketRef.current)
    console.log('Socket connected:', socketRef.current?.connected)
    
    if (!socketRef.current) {
      console.error('❌ Socket não existe')
      setError('Conexão WebSocket não estabelecida')
      return
    }
    
    if (!socketRef.current.connected) {
      console.error('❌ Socket não está conectado')
      setError('Socket não está conectado')
      return
    }
    
    // Clear any previous errors
    setError(null)
    
    // Check for saved session to reconnect
    const savedSessionId = localStorage.getItem('whatsapp_session')
    
    if (savedSessionId) {
      console.log('✅ Reconectando sessão salva:', savedSessionId)
      socketRef.current.emit('request_qr', { sessionId: savedSessionId })
    } else {
      console.log('✅ Solicitando nova instância')
      socketRef.current.emit('request_qr', {})
    }
    console.log('✅ Evento request_qr emitido')
  }

  // Request QR when modal opens and socket is connected
  useEffect(() => {
    if (showAddModal && isSocketConnected) {
      console.log('Modal aberto, socket conectado - solicitando QR')
      // Wait a bit for socket to be fully ready
      setTimeout(() => {
        requestQrCode()
      }, 500)
    }
  }, [showAddModal, isSocketConnected])

  const getStatusBadge = (status) => {
    const styles = {
      ready: 'bg-green-100 text-green-700',
      connected: 'bg-green-100 text-green-700',
      authenticated: 'bg-blue-100 text-blue-700',
      disconnected: 'bg-red-100 text-red-700',
      connecting: 'bg-yellow-100 text-yellow-700',
      qr: 'bg-yellow-100 text-yellow-700'
    }
    const labels = {
      ready: 'Conectado',
      connected: 'Conectado',
      authenticated: 'Autenticado',
      disconnected: 'Desconectado',
      connecting: 'Conectando...',
      qr: 'Aguardando QR'
    }
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${styles[status] || styles.disconnected}`}>
        {labels[status] || status}
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

  const confirmDelete = async () => {
    if (!selectedInstance) return
    
    setError(null)
    
    try {
      // Try via WebSocket first if connected (for instant disconnect)
      if (socketRef.current && socketRef.current.connected) {
        console.log('Disconnecting via WebSocket:', selectedInstance.sessionId)
        socketRef.current.emit('disconnect_instance', { sessionId: selectedInstance.sessionId })
      }
      
      // Also delete via REST API
      console.log('Deleting instance via API:', selectedInstance.sessionId)
      const result = await deleteWhatsAppInstance(selectedInstance.sessionId)
      
      if (result.success) {
        console.log('Instance deleted successfully')
        // Reload instances list
        await fetchInstances()
        
        // Clear saved sessionId if it matches
        const savedSessionId = localStorage.getItem('whatsapp_session')
        if (savedSessionId === selectedInstance.sessionId) {
          localStorage.removeItem('whatsapp_session')
        }
      } else {
        console.error('Failed to delete instance:', result.error)
        setError(result.error.message)
      }
    } catch (error) {
      console.error('Error deleting instance:', error)
      setError('Erro ao deletar instância')
    } finally {
      setShowDeleteModal(false)
      setSelectedInstance(null)
    }
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

        {/* Error Display */}
        {error && (
          <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4 rounded">
            <div className="flex items-center">
              <span className="text-red-700 font-semibold">⚠️ {error}</span>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoadingInstances ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-whatsapp-primary mx-auto mb-3"></div>
            <p className="text-gray-600">Carregando instâncias...</p>
          </div>
        ) : (
          /* Instances Table */
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
                      {instance.name || instance.phoneNumber || 'Sem nome'}
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(instance.status)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {instance.createdAt ? new Date(instance.createdAt).toLocaleString('pt-AO') : '-'}
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
                          onClick={() => navigate(`/instances/${instance.sessionId}/chat`)}
                          className="bg-whatsapp-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-whatsapp-secondary transition flex items-center gap-2"
                          disabled={instance.status !== 'ready' && instance.status !== 'connected'}
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
                          {instance.status === 'ready' || instance.status === 'connected' ? 'Logout' : 'Eliminar'}
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
                      <h3 className="font-bold text-gray-900 text-lg">{instance.name || instance.phoneNumber || 'Sem nome'}</h3>
                      <p className="text-xs font-mono text-gray-500 mt-1">{instance.sessionId}</p>
                    </div>
                    <div className="ml-2">
                      {getStatusBadge(instance.status)}
                    </div>
                  </div>

                  {/* Phone */}
                  {instance.phoneNumber && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <img src="/icon/phone.png" alt="Phone" className="w-4 h-4" />
                      <span>{instance.phoneNumber}</span>
                    </div>
                  )}

                  {/* Created At */}
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <img src="/icon/clock.png" alt="Clock" className="w-4 h-4" />
                    <span>{instance.createdAt ? new Date(instance.createdAt).toLocaleString('pt-AO') : '-'}</span>
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
                      onClick={() => navigate(`/instances/${instance.sessionId}/chat`)}
                      className="bg-whatsapp-primary text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-whatsapp-secondary transition flex items-center justify-center gap-2"
                      disabled={instance.status !== 'ready' && instance.status !== 'connected'}
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
                      {instance.status === 'ready' || instance.status === 'connected' ? 'Logout' : 'Eliminar'}
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
        )}
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
              {/* Error Display in Modal */}
              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                  <div className="flex items-center">
                    <span className="text-red-700 font-semibold">⚠️ {error}</span>
                  </div>
                </div>
              )}

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
                ) : connectionStatus === 'authenticated' ? (
                  <div className="w-48 h-48 sm:w-64 sm:h-64 flex items-center justify-center bg-blue-50 rounded-xl border-4 border-blue-500 shadow-lg">
                    <div className="text-center p-4">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                      <p className="text-blue-800 font-bold text-lg">Autenticado!</p>
                      <p className="text-blue-600 text-sm mt-2">Sincronizando dados...</p>
                      <p className="text-blue-500 text-xs mt-1">Aguarde alguns segundos</p>
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
                    onClick={() => {
                      setShowAddModal(false)
                      // Clear saved session after successful connection
                      localStorage.removeItem('whatsapp_session')
                      // Refresh instances list
                      fetchInstances()
                    }}
                    className="px-6 py-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition order-1 sm:order-2"
                  >
                    Concluir ✓
                  </button>
                ) : (
                  <button
                    onClick={requestQrCode}
                    className="px-6 py-2 bg-gradient-to-r from-whatsapp-primary to-whatsapp-secondary text-white rounded-lg font-medium hover:shadow-lg transition order-1 sm:order-2"
                    disabled={!isSocketConnected}
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
                <p className="text-lg text-gray-900 mt-1">{selectedInstance.name || selectedInstance.phoneNumber || 'Sem nome'}</p>
              </div>

              {selectedInstance.phoneNumber && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <label className="text-sm font-semibold text-gray-600">Telefone</label>
                  <p className="text-lg text-gray-900 mt-1">{selectedInstance.phoneNumber}</p>
                </div>
              )}

              <div className="bg-gray-50 p-4 rounded-lg">
                <label className="text-sm font-semibold text-gray-600">Status</label>
                <div className="mt-2">
                  {getStatusBadge(selectedInstance.status)}
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <label className="text-sm font-semibold text-gray-600">Criado em</label>
                <p className="text-lg text-gray-900 mt-1">
                  {selectedInstance.createdAt ? new Date(selectedInstance.createdAt).toLocaleString('pt-AO') : '-'}
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <label className="text-sm font-semibold text-gray-600">ID do Usuário</label>
                <p className="text-lg text-gray-900 mt-1">{selectedInstance.userId}</p>
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
                {selectedInstance.status === 'ready' || selectedInstance.status === 'connected' ? 'Fazer Logout?' : 'Eliminar Instância?'}
              </h2>
              <p className="text-sm sm:text-base text-gray-600 mb-6">
                {selectedInstance.status === 'ready' || selectedInstance.status === 'connected'
                  ? `Tem certeza que deseja fazer logout da sessão "${selectedInstance.name || selectedInstance.phoneNumber || 'Sem nome'}"? Você precisará escanear o QR Code novamente para reconectar.`
                  : `Tem certeza que deseja eliminar a sessão "${selectedInstance.name || selectedInstance.phoneNumber || 'Sem nome'}"? Esta ação não pode ser desfeita.`
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
                  {selectedInstance.status === 'ready' || selectedInstance.status === 'connected' ? 'Sim, Fazer Logout' : 'Sim, Eliminar'}
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
