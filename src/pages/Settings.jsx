import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'

function Settings() {
  const navigate = useNavigate()

  // User data state
  const [userData, setUserData] = useState({
    fullName: 'João Silva',
    email: 'joao.silva@example.com',
    phone: '+244 923 456 789'
  })

  // System settings state
  const [systemSettings, setSystemSettings] = useState({
    plan: 'gratuito',
    aiModel: 'gpt-3.5-turbo'
  })

  // Editing states
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [isEditingSystem, setIsEditingSystem] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  
  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [passwordError, setPasswordError] = useState('')

  // Temporary edit states
  const [editedUserData, setEditedUserData] = useState({ ...userData })
  const [editedSystemSettings, setEditedSystemSettings] = useState({ ...systemSettings })

  // Available plans
  const plans = [
    { id: 'gratuito', name: 'Gratuito', price: '0 AOA', features: ['1 Instância', '100 mensagens/mês', 'Suporte básico'] },
    { id: 'profissional', name: 'Profissional', price: '35.000 AOA/mês', features: ['10 Instâncias', '10.000 mensagens/mês', 'Suporte 24/7'] },
    { id: 'empresarial', name: 'Empresarial', price: '75.000 AOA/mês', features: ['Instâncias ilimitadas', 'Mensagens ilimitadas', 'Suporte dedicado'] }
  ]

  // Available AI models
  const aiModels = [
    { id: 'gpt-3.5-turbo', name: 'ChatGPT 3.5 Turbo', description: 'Rápido e eficiente - Recomendado', speed: '⚡ Rápido' },
    { id: 'gpt-4', name: 'ChatGPT 4', description: 'Mais inteligente e preciso', speed: '🧠 Avançado' },
    { id: 'gpt-4-turbo', name: 'ChatGPT 4 Turbo', description: 'Melhor custo-benefício', speed: '⚡🧠 Equilibrado' },
    { id: 'claude-3', name: 'Claude 3', description: 'Alternativa ao ChatGPT', speed: '🤖 Versátil' }
  ]

  const handleSaveProfile = () => {
    setIsSaving(true)
    setTimeout(() => {
      setUserData({ ...editedUserData })
      setIsEditingProfile(false)
      setIsSaving(false)
      setSuccessMessage('Perfil atualizado com sucesso!')
      setShowSuccessModal(true)
    }, 1000)
  }

  const handleCancelProfileEdit = () => {
    setEditedUserData({ ...userData })
    setIsEditingProfile(false)
  }

  const handleSaveSystem = () => {
    setIsSaving(true)
    setTimeout(() => {
      setSystemSettings({ ...editedSystemSettings })
      setIsEditingSystem(false)
      setIsSaving(false)
      setSuccessMessage('Configurações do sistema atualizadas com sucesso!')
      setShowSuccessModal(true)
    }, 1000)
  }

  const handleCancelSystemEdit = () => {
    setEditedSystemSettings({ ...systemSettings })
    setIsEditingSystem(false)
  }

  const getPlanInfo = (planId) => {
    return plans.find(p => p.id === planId) || plans[0]
  }

  const getModelInfo = (modelId) => {
    return aiModels.find(m => m.id === modelId) || aiModels[0]
  }

  const handleChangePassword = () => {
    setPasswordError('')
    
    // Validations
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
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

    setIsSaving(true)
    setTimeout(() => {
      // Reset password form
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
      setShowPasswordModal(false)
      setIsSaving(false)
      setSuccessMessage('Senha alterada com sucesso!')
      setShowSuccessModal(true)
    }, 1000)
  }

  const handleClosePasswordModal = () => {
    setShowPasswordModal(false)
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    })
    setPasswordError('')
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

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
                <h3 className="text-xl font-bold text-gray-900">Alterar Senha</h3>
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
              {/* Current Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Senha Atual
                </label>
                <input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="Digite sua senha atual"
                />
              </div>

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

            {isEditingProfile ? (
              // Edit Mode
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nome Completo
                  </label>
                  <input
                    type="text"
                    value={editedUserData.fullName}
                    onChange={(e) => setEditedUserData({ ...editedUserData, fullName: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-whatsapp-primary focus:border-transparent outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={editedUserData.email}
                    disabled
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
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
                    value={editedUserData.phone}
                    onChange={(e) => setEditedUserData({ ...editedUserData, phone: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-whatsapp-primary focus:border-transparent outline-none"
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
                  <span className="text-sm text-gray-900 font-medium">{userData.fullName}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b">
                  <span className="text-sm font-semibold text-gray-600">Email</span>
                  <span className="text-sm text-gray-900 font-medium">{userData.email}</span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="text-sm font-semibold text-gray-600">Telefone</span>
                  <span className="text-sm text-gray-900 font-medium">{userData.phone}</span>
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
                  <select
                    value={editedSystemSettings.plan}
                    onChange={(e) => setEditedSystemSettings({ ...editedSystemSettings, plan: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                  >
                    {plans.map((plan) => (
                      <option key={plan.id} value={plan.id}>
                        {plan.name} - {plan.price}
                      </option>
                    ))}
                  </select>
                  {editedSystemSettings.plan !== 'gratuito' && (
                    <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm text-blue-800 font-semibold mb-2">
                        ✨ Recursos do plano {getPlanInfo(editedSystemSettings.plan).name}:
                      </p>
                      <ul className="text-xs text-blue-700 space-y-1">
                        {getPlanInfo(editedSystemSettings.plan).features.map((feature, idx) => (
                          <li key={idx}>✓ {feature}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Modelo de IA
                  </label>
                  <select
                    value={editedSystemSettings.aiModel}
                    onChange={(e) => setEditedSystemSettings({ ...editedSystemSettings, aiModel: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                  >
                    {aiModels.map((model) => (
                      <option key={model.id} value={model.id}>
                        {model.name} - {model.description}
                      </option>
                    ))}
                  </select>
                  <div className="mt-3 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                    <p className="text-sm text-purple-800">
                      {getModelInfo(editedSystemSettings.aiModel).speed} • {getModelInfo(editedSystemSettings.aiModel).description}
                    </p>
                  </div>
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
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-lg text-gray-900 font-bold">
                        {getPlanInfo(systemSettings.plan).name}
                      </span>
                      <span className="text-sm text-gray-600 ml-2">
                        {getPlanInfo(systemSettings.plan).price}
                      </span>
                    </div>
                    {systemSettings.plan === 'gratuito' && (
                      <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded-full">
                        Padrão
                      </span>
                    )}
                  </div>
                  <ul className="mt-3 space-y-1">
                    {getPlanInfo(systemSettings.plan).features.map((feature, idx) => (
                      <li key={idx} className="text-xs text-gray-600">✓ {feature}</li>
                    ))}
                  </ul>
                </div>

                <div className="py-3">
                  <span className="text-sm font-semibold text-gray-600 block mb-2">Modelo de IA</span>
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-lg text-gray-900 font-bold block">
                        {getModelInfo(systemSettings.aiModel).name}
                      </span>
                      <span className="text-xs text-gray-600">
                        {getModelInfo(systemSettings.aiModel).speed} • {getModelInfo(systemSettings.aiModel).description}
                      </span>
                    </div>
                    {systemSettings.aiModel === 'gpt-3.5-turbo' && (
                      <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                        Padrão
                      </span>
                    )}
                  </div>
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
            <div className="space-y-3">
              {plans.map((plan) => (
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
                      <h4 className="font-bold text-gray-900">{plan.name}</h4>
                      <p className="text-sm text-gray-600">{plan.price}</p>
                    </div>
                    {systemSettings.plan === plan.id && (
                      <span className="px-2 py-1 bg-whatsapp-primary text-white text-xs font-semibold rounded">
                        Ativo
                      </span>
                    )}
                  </div>
                  <ul className="space-y-1">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="text-xs text-gray-600">✓ {feature}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* AI Models Info */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <img src="/icon/ai.png" alt="AI" className="w-6 h-6" />
              Modelos de IA Disponíveis
            </h3>
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
                      <h4 className="font-bold text-gray-900">{model.name}</h4>
                      <p className="text-xs text-gray-600">{model.speed}</p>
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
