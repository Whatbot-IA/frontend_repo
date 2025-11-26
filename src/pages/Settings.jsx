import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import { getUserProfile, updateUserProfile, getIAModels, getSubscriptions } from '../services/api'

function Settings() {
  const navigate = useNavigate()

  // User data state
  const [userData, setUserData] = useState(null)
  const [loadingUser, setLoadingUser] = useState(true)
  const [userError, setUserError] = useState('')

  // System settings state
  const [systemSettings, setSystemSettings] = useState({
    plan: '3', // Default to free plan
    aiModel: '1' // Default to ChatGPT
  })

  // AI Models state
  const [aiModels, setAiModels] = useState([])
  const [loadingModels, setLoadingModels] = useState(true)
  const [modelsError, setModelsError] = useState('')

  // Subscriptions state
  const [subscriptions, setSubscriptions] = useState([])
  const [loadingSubscriptions, setLoadingSubscriptions] = useState(true)
  const [subscriptionsError, setSubscriptionsError] = useState('')

  // Editing states
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [isEditingSystem, setIsEditingSystem] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  
  // Password change state
  const [passwordData, setPasswordData] = useState({
    newPassword: '',
    confirmPassword: ''
  })
  const [passwordError, setPasswordError] = useState('')

  // Temporary edit states
  const [editedUserData, setEditedUserData] = useState({})
  const [editedSystemSettings, setEditedSystemSettings] = useState({ plan: systemSettings.plan })



  // Fetch user profile on mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoadingUser(true)
        setUserError('')
        const result = await getUserProfile()
        
        if (result.success) {
          const profile = {
            fullName: result.data.fullName,
            email: result.data.email,
            phone: result.data.contactPhone
          }
          setUserData(profile)
          setEditedUserData(profile)
        } else {
          setUserError(result.error.message)
          // Se falhar, redirecionar para login
          navigate('/signin')
        }
      } catch (error) {
        setUserError('Erro ao carregar perfil')
        navigate('/signin')
      } finally {
        setLoadingUser(false)
      }
    }

    fetchUserProfile()
  }, [navigate])

  // Fetch AI models on mount
  useEffect(() => {
    const fetchAIModels = async () => {
      try {
        setLoadingModels(true)
        setModelsError('')
        const result = await getIAModels()
        
        if (result.success) {
          setAiModels(result.data)
        } else {
          setModelsError(result.error.message || 'Erro ao carregar modelos de IA')
        }
      } catch (error) {
        setModelsError('Não foi possível carregar os modelos de IA')
      } finally {
        setLoadingModels(false)
      }
    }

    fetchAIModels()
  }, [])

  // Fetch subscriptions on mount
  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        setLoadingSubscriptions(true)
        setSubscriptionsError('')
        const result = await getSubscriptions()
        
        if (result.success) {
          setSubscriptions(result.data)
        } else {
          setSubscriptionsError(result.error.message || 'Erro ao carregar planos')
        }
      } catch (error) {
        setSubscriptionsError('Não foi possível carregar os planos')
      } finally {
        setLoadingSubscriptions(false)
      }
    }

    fetchSubscriptions()
  }, [])

  const handleSaveProfile = async () => {
    try {
      setIsSaving(true)
      setUserError('')
      
      // Prepare update data WITHOUT email (email cannot be changed)
      const updateData = {
        full_name: editedUserData.fullName,
        contact_phone: editedUserData.phone
      }
      
      const result = await updateUserProfile(updateData)
      
      if (result.success) {
        // Update local state but keep original email
        setUserData({
          fullName: editedUserData.fullName,
          email: userData.email, // Keep original email
          phone: editedUserData.phone
        })
        setIsEditingProfile(false)
        setSuccessMessage('Perfil atualizado com sucesso!')
        setShowSuccessModal(true)
      } else {
        setUserError(result.error.message || 'Erro ao atualizar perfil')
      }
    } catch (error) {
      setUserError('Não foi possível atualizar o perfil')
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancelProfileEdit = () => {
    if (userData) {
      setEditedUserData({ ...userData })
    }
    setIsEditingProfile(false)
    setUserError('')
  }

  const handleSaveSystem = () => {
    setIsSaving(true)
    setTimeout(() => {
      // Update only the plan - AI model is determined by the plan
      setSystemSettings({ ...systemSettings, plan: editedSystemSettings.plan })
      setIsEditingSystem(false)
      setIsSaving(false)
      setSuccessMessage('Plano atualizado com sucesso!')
      setShowSuccessModal(true)
    }, 1000)
  }

  const handleCancelSystemEdit = () => {
    setEditedSystemSettings({ plan: systemSettings.plan })
    setIsEditingSystem(false)
  }

  const getPlanInfo = (planId) => {
    const plan = subscriptions.find(p => p.id === planId)
    if (plan) return plan
    // Fallback se não encontrar
    return { id: planId, type: 'desconhecido', price: 0 }
  }

  const formatPlanName = (type) => {
    const names = {
      'free': 'Gratuito',
      'silver': 'Silver',
      'gold': 'Gold'
    }
    return names[type] || type
  }

  const formatPrice = (price) => {
    if (price === 0) return 'Grátis'
    return `${price.toLocaleString('pt-AO')} AOA/mês`
  }

  const getPlanFeatures = (plan) => {
    return [
      `${plan.instanceLimit} Instância${plan.instanceLimit > 1 ? 's' : ''}`,
      `${plan.storeLimit} Loja${plan.storeLimit > 1 ? 's' : ''}`,
      `${plan.messageLimit} Mensagens`,
      `${plan.chatLimit} Chats`,
      `Modelo IA: ${plan.iaModel?.model || 'N/A'}`
    ]
  }

  const getModelInfo = (modelId) => {
    const model = aiModels.find(m => m.id === modelId)
    if (model) return model
    // Fallback se não encontrar
    return { id: modelId, model: 'Modelo desconhecido', description: '', company: '' }
  }

  const handleChangePassword = async () => {
    setPasswordError('')
    
    // Validations
    if (!passwordData.newPassword || !passwordData.confirmPassword) {
      setPasswordError('Por favor, preencha todos os campos')
      return
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordError('A nova senha deve ter no mínimo 6 caracteres')
      return
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('As senhas não coincidem')
      return
    }

    try {
      setIsSaving(true)
      
      // Use the same updateUserProfile endpoint, sending only password
      const result = await updateUserProfile({
        password: passwordData.newPassword
      })
      
      if (result.success) {
        // Reset password form
        setPasswordData({
          newPassword: '',
          confirmPassword: ''
        })
        setShowPasswordModal(false)
        setSuccessMessage('Senha alterada com sucesso!')
        setShowSuccessModal(true)
      } else {
        setPasswordError(result.error.message || 'Erro ao alterar senha')
      }
    } catch (error) {
      setPasswordError('Não foi possível alterar a senha')
    } finally {
      setIsSaving(false)
    }
  }

  const handleClosePasswordModal = () => {
    setShowPasswordModal(false)
    setPasswordData({
      newPassword: '',
      confirmPassword: ''
    })
    setPasswordError('')
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar userData={userData} />

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 animate-fade-in">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Sucesso!
              </h3>
              <p className="text-gray-600 mb-6">
                {successMessage}
              </p>
              <button
                onClick={() => setShowSuccessModal(false)}
                className="w-full bg-whatsapp-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-whatsapp-secondary transition"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Alterar Senha</h3>
                  <p className="text-xs text-gray-500 mt-1">Digite sua nova senha duas vezes</p>
                </div>
              </div>
              <button
                onClick={handleClosePasswordModal}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              {/* New Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nova Senha
                </label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="Digite a nova senha"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Mínimo de 6 caracteres
                </p>
              </div>

              {/* Confirm New Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Confirmar Nova Senha
                </label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="Confirme a nova senha"
                />
              </div>

              {/* Error Message */}
              {passwordError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-800 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {passwordError}
                  </p>
                </div>
              )}

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleChangePassword}
                  disabled={isSaving}
                  className="flex-1 bg-blue-500 text-white px-4 py-3 rounded-lg font-semibold hover:bg-blue-600 transition disabled:opacity-50"
                >
                  {isSaving ? 'Alterando...' : 'Alterar Senha'}
                </button>
                <button
                  onClick={handleClosePasswordModal}
                  disabled={isSaving}
                  className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 p-4 lg:p-8 pt-20 lg:pt-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2">
            Definições
          </h1>
          <p className="text-gray-600">
            Gerencie seu perfil e configurações do sistema
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Profile Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                  <img src="/icon/user.png" alt="User" className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Perfil do Usuário</h2>
                  <p className="text-sm text-gray-500">Informações pessoais</p>
                </div>
              </div>
              {!isEditingProfile && (
                <button
                  onClick={() => setIsEditingProfile(true)}
                  className="text-whatsapp-primary hover:text-whatsapp-secondary transition text-sm font-semibold"
                >
                  ✏️ Editar
                </button>
              )}
            </div>

            {loadingUser ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-whatsapp-primary mx-auto mb-4"></div>
                  <p className="text-gray-600">Carregando perfil...</p>
                </div>
              </div>
            ) : userError ? (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-center">
                <p className="text-red-700">{userError}</p>
              </div>
            ) : isEditingProfile ? (
              // Edit Mode
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nome Completo
                  </label>
                  <input
                    type="text"
                    value={editedUserData.fullName || ''}
                    onChange={(e) => setEditedUserData({ ...editedUserData, fullName: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-whatsapp-primary focus:border-transparent outline-none"
                    placeholder="Digite seu nome completo"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={userData?.email || ''}
                    disabled
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                    title="O email não pode ser alterado"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    ⚠️ O email não pode ser alterado
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Telefone
                  </label>
                  <input
                    type="tel"
                    value={editedUserData.phone || ''}
                    onChange={(e) => setEditedUserData({ ...editedUserData, phone: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-whatsapp-primary focus:border-transparent outline-none"
                    placeholder="Digite seu telefone"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleSaveProfile}
                    disabled={isSaving}
                    className="flex-1 bg-whatsapp-primary text-white px-4 py-3 rounded-lg font-semibold hover:bg-whatsapp-secondary transition disabled:opacity-50"
                  >
                    {isSaving ? 'Salvando...' : 'Salvar'}
                  </button>
                  <button
                    onClick={handleCancelProfileEdit}
                    disabled={isSaving}
                    className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              // View Mode
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b">
                  <span className="text-sm font-semibold text-gray-600">Nome Completo</span>
                  <span className="text-sm text-gray-900 font-medium">{userData?.fullName || 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b">
                  <span className="text-sm font-semibold text-gray-600">Email</span>
                  <span className="text-sm text-gray-900 font-medium">{userData?.email || 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="text-sm font-semibold text-gray-600">Telefone</span>
                  <span className="text-sm text-gray-900 font-medium">{userData?.phone || 'N/A'}</span>
                </div>
              </div>
            )}
          </div>

          {/* System Settings Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center overflow-hidden">
                  <img src="/icon/system.png" alt="System" className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Configurações do Sistema</h2>
                  <p className="text-sm text-gray-500">Plano e modelo de IA</p>
                </div>
              </div>
              {!isEditingSystem && (
                <button
                  onClick={() => setIsEditingSystem(true)}
                  className="text-purple-500 hover:text-purple-600 transition text-sm font-semibold"
                >
                  ✏️ Editar
                </button>
              )}
            </div>

            {isEditingSystem ? (
              // Edit Mode
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Plano de Assinatura
                  </label>
                  {loadingSubscriptions ? (
                    <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500">
                      Carregando planos...
                    </div>
                  ) : subscriptionsError ? (
                    <div className="w-full px-4 py-3 border border-red-300 rounded-lg bg-red-50 text-red-700 text-sm">
                      {subscriptionsError}
                    </div>
                  ) : (
                    <>
                      <select
                        value={editedSystemSettings.plan}
                        onChange={(e) => setEditedSystemSettings({ ...editedSystemSettings, plan: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                        disabled={subscriptions.length === 0}
                      >
                        {subscriptions.map((plan) => (
                          <option key={plan.id} value={plan.id}>
                            {formatPlanName(plan.type)} - {formatPrice(plan.price)}
                          </option>
                        ))}
                      </select>
                      <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm text-blue-800 font-semibold mb-2">
                          ✨ Recursos do plano {formatPlanName(getPlanInfo(editedSystemSettings.plan).type)}:
                        </p>
                        <ul className="text-xs text-blue-700 space-y-1">
                          {getPlanFeatures(getPlanInfo(editedSystemSettings.plan)).map((feature, idx) => (
                            <li key={idx}>✓ {feature}</li>
                          ))}
                        </ul>
                      </div>
                    </>
                  )}
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleSaveSystem}
                    disabled={isSaving}
                    className="flex-1 bg-purple-500 text-white px-4 py-3 rounded-lg font-semibold hover:bg-purple-600 transition disabled:opacity-50"
                  >
                    {isSaving ? 'Salvando...' : 'Salvar'}
                  </button>
                  <button
                    onClick={handleCancelSystemEdit}
                    disabled={isSaving}
                    className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              // View Mode
              <div className="space-y-4">
                <div className="py-3 border-b">
                  <span className="text-sm font-semibold text-gray-600 block mb-2">Plano Atual</span>
                  {loadingSubscriptions ? (
                    <div className="text-gray-500 text-sm">Carregando...</div>
                  ) : subscriptionsError ? (
                    <div className="text-red-600 text-sm">{subscriptionsError}</div>
                  ) : (
                    <>
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-lg text-gray-900 font-bold">
                            {formatPlanName(getPlanInfo(systemSettings.plan).type)}
                          </span>
                          <span className="text-sm text-gray-600 ml-2">
                            {formatPrice(getPlanInfo(systemSettings.plan).price)}
                          </span>
                        </div>
                        {systemSettings.plan === '3' && (
                          <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded-full">
                            Padrão
                          </span>
                        )}
                      </div>
                      <ul className="mt-3 space-y-1">
                        {getPlanFeatures(getPlanInfo(systemSettings.plan)).map((feature, idx) => (
                          <li key={idx} className="text-xs text-gray-600">✓ {feature}</li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>

                <div className="py-3">
                  <span className="text-sm font-semibold text-gray-600 block mb-2">Modelo de IA</span>
                  {loadingSubscriptions ? (
                    <div className="text-gray-500 text-sm">Carregando...</div>
                  ) : subscriptionsError ? (
                    <div className="text-red-600 text-sm">{subscriptionsError}</div>
                  ) : (() => {
                    const currentPlan = getPlanInfo(systemSettings.plan)
                    const currentModel = currentPlan.iaModel
                    return currentModel ? (
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-lg text-gray-900 font-bold">
                            {currentModel.model}
                          </span>
                          <span className="text-xs text-gray-500">
                            • {currentModel.company}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 mb-3">
                          {currentModel.description}
                        </p>
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg">
                          <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-xs font-semibold text-purple-700">
                            Modelo do seu plano {formatPlanName(currentPlan.type)}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="text-gray-500 text-sm">Modelo não disponível</div>
                    )
                  })()}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Additional Info Boxes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {/* Plans Comparison */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <img src="/icon/subscription.png" alt="Subscription" className="w-6 h-6" />
              Comparação de Planos
            </h3>
            {loadingSubscriptions ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-whatsapp-primary mx-auto mb-3"></div>
                  <p className="text-gray-600 text-sm">Carregando planos...</p>
                </div>
              </div>
            ) : subscriptionsError ? (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-center">
                <p className="text-red-700 text-sm">{subscriptionsError}</p>
              </div>
            ) : (
              <div className="space-y-3">
                {subscriptions.map((plan) => (
                  <div
                    key={plan.id}
                    className={`p-4 rounded-lg border-2 transition ${
                      systemSettings.plan === plan.id
                        ? 'border-whatsapp-primary bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-bold text-gray-900">{formatPlanName(plan.type)}</h4>
                        <p className="text-sm text-gray-600">{formatPrice(plan.price)}</p>
                      </div>
                      {systemSettings.plan === plan.id && (
                        <span className="px-2 py-1 bg-whatsapp-primary text-white text-xs font-semibold rounded">
                          Ativo
                        </span>
                      )}
                    </div>
                    <ul className="space-y-1">
                      {getPlanFeatures(plan).map((feature, idx) => (
                        <li key={idx} className="text-xs text-gray-600">✓ {feature}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* AI Models Info */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <img src="/icon/ai.png" alt="AI" className="w-6 h-6" />
              Modelos de IA Disponíveis
            </h3>
            {loadingModels ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-500 mx-auto mb-3"></div>
                  <p className="text-gray-600 text-sm">Carregando modelos...</p>
                </div>
              </div>
            ) : modelsError ? (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-center">
                <p className="text-red-700 text-sm">{modelsError}</p>
              </div>
            ) : (
              <div className="space-y-3">
                {aiModels.map((model) => (
                  <div
                    key={model.id}
                    className={`p-4 rounded-lg border-2 transition ${
                      systemSettings.aiModel === model.id
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-bold text-gray-900">{model.model}</h4>
                        <p className="text-xs text-gray-600">{model.company}</p>
                      </div>
                      {systemSettings.aiModel === model.id && (
                        <span className="px-2 py-1 bg-purple-500 text-white text-xs font-semibold rounded">
                          Ativo
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{model.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Account Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Ações da Conta</h3>
          <div className="flex flex-col sm:flex-row gap-3">
            <button 
              onClick={() => setShowPasswordModal(true)}
              className="flex-1 bg-blue-500 text-white px-4 py-3 rounded-lg font-semibold hover:bg-blue-600 transition"
            >
              Alterar Senha
            </button>
            <button className="flex-1 bg-red-500 text-white px-4 py-3 rounded-lg font-semibold hover:bg-red-600 transition">
              Excluir Conta
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Settings
