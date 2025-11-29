import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import { getInstanceConfig, updateInstanceConfig, getStores, getWhatsAppInstances } from '../services/api'

function InstanceConfig() {
  const navigate = useNavigate()
  const { instanceId } = useParams()

  // Instance data
  const [instance, setInstance] = useState({
    id: instanceId,
    name: '',
    phone: '',
    status: ''
  })

  // Stores data from API
  const [stores, setStores] = useState([])
  const [isLoadingStores, setIsLoadingStores] = useState(true)

  // Configuration state
  const [config, setConfig] = useState({
    promptSystem: '',
    storeId: null,
    temperature: 0.7,
    maxToken: 500,
    iaResponse: true
  })

  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)

  // Fetch configuration on mount
  useEffect(() => {
    const fetchConfig = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const result = await getInstanceConfig(instanceId)
        if (result.success) {
          console.log('Config loaded:', result.data)
          setConfig({
            promptSystem: result.data.promptSystem || '',
            storeId: result.data.storeId || null,
            // Parse temperature as float (API returns string)
            temperature: parseFloat(result.data.temperature) || 0.7,
            maxToken: parseInt(result.data.maxToken) || 500,
            iaResponse: result.data.iaResponse ?? true
          })
        } else {
          console.error('Failed to load config:', result.error)
          setError(result.error.message)
        }
      } catch (err) {
        console.error('Error loading config:', err)
        setError('Erro ao carregar configuração')
      } finally {
        setIsLoading(false)
      }
    }

    fetchConfig()
  }, [instanceId])

  // Fetch instance details
  useEffect(() => {
    const fetchInstanceDetails = async () => {
      try {
        const result = await getWhatsAppInstances()
        if (result.success) {
          // Find the instance by id
          const foundInstance = result.data.find(inst => String(inst.id) === String(instanceId))
          if (foundInstance) {
            console.log('Instance found:', foundInstance)
            setInstance({
              id: instanceId,
              name: foundInstance.name || foundInstance.phoneNumber || '',
              phone: foundInstance.phoneNumber || '',
              status: foundInstance.status || ''
            })
          }
        }
      } catch (err) {
        console.error('Error loading instance details:', err)
      }
    }

    fetchInstanceDetails()
  }, [instanceId])

  // Fetch stores on mount
  useEffect(() => {
    const fetchStores = async () => {
      setIsLoadingStores(true)
      try {
        const result = await getStores()
        if (result.success) {
          console.log('Stores loaded:', result.data)
          setStores(result.data)
        } else {
          console.error('Failed to load stores:', result.error)
        }
      } catch (err) {
        console.error('Error loading stores:', err)
      } finally {
        setIsLoadingStores(false)
      }
    }

    fetchStores()
  }, [])

  const handleSave = async () => {
    setIsSaving(true)
    setError(null)
    setSuccessMessage(null)
    
    try {
      // Prepare config data with correct types
      const configData = {
        promptSystem: config.promptSystem,
        temperature: parseFloat(config.temperature),
        maxToken: parseInt(config.maxToken),
        iaResponse: Boolean(config.iaResponse)
      }
      
      // Only include storeId if it's set (not null)
      if (config.storeId) {
        configData.storeId = parseInt(config.storeId)
      }
      
      console.log('Saving config:', configData)
      
      const result = await updateInstanceConfig(instanceId, configData)
      
      if (result.success) {
        console.log('Config saved:', result.data)
        setSuccessMessage('Configurações salvas com sucesso!')
        setTimeout(() => setSuccessMessage(null), 3000)
      } else {
        console.error('Failed to save config:', result.error)
        setError(result.error.message)
      }
    } catch (err) {
      console.error('Error saving config:', err)
      setError('Erro ao salvar configurações')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 p-4 lg:p-8 pt-20 lg:pt-8">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/instances')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition mb-4"
          >
            <span>←</span>
            <span>Voltar para Instâncias</span>
          </button>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2">
            Configuração da Instância
          </h1>
          <p className="text-gray-600">
            {instance.name || `Instância ${instanceId}`} {instance.phone && `• ${instance.phone}`}
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4 rounded">
            <div className="flex items-center">
              <span className="text-red-700 font-semibold">⚠️ {error}</span>
            </div>
          </div>
        )}

        {/* Success Message */}
        {successMessage && (
          <div className="mb-4 bg-green-50 border-l-4 border-green-500 p-4 rounded">
            <div className="flex items-center">
              <span className="text-green-700 font-semibold">✅ {successMessage}</span>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-whatsapp-primary mx-auto mb-3"></div>
            <p className="text-gray-600">Carregando configurações...</p>
          </div>
        ) : (
          <>
        {/* Configuration Form */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="space-y-6">
            {/* IA Response Toggle */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <label className="block text-sm font-semibold text-gray-700">
                  Resposta Automática com IA
                </label>
                <p className="text-sm text-gray-500">
                  Ative para que a IA responda automaticamente às mensagens
                </p>
              </div>
              <button
                onClick={() => setConfig({ ...config, iaResponse: !config.iaResponse })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  config.iaResponse ? 'bg-whatsapp-primary' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    config.iaResponse ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Store Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Loja Conectada
              </label>
              <p className="text-sm text-gray-500 mb-3">
                Selecione a loja que este agente irá representar
              </p>
              <select
                value={config.storeId || ''}
                onChange={(e) => setConfig({ ...config, storeId: e.target.value ? parseInt(e.target.value) : null })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-whatsapp-primary focus:border-transparent outline-none"
                disabled={isLoadingStores}
              >
                <option value="">
                  {isLoadingStores ? 'Carregando lojas...' : 'Nenhuma loja selecionada'}
                </option>
                {stores.map((store) => (
                  <option key={store.id} value={store.id}>
                    {store.storeName} {store.description && `- ${store.description}`}
                  </option>
                ))}
              </select>
            </div>

            {/* System Prompt */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Prompt do Sistema (System Prompt)
              </label>
              <p className="text-sm text-gray-500 mb-3">
                Defina como o agente AI deve se comportar e responder aos clientes
              </p>
              <textarea
                value={config.promptSystem}
                onChange={(e) => setConfig({ ...config, promptSystem: e.target.value })}
                rows={10}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-whatsapp-primary focus:border-transparent outline-none font-mono text-sm"
                placeholder="Digite as instruções para o agente AI..."
              />
              <p className="text-xs text-gray-500 mt-2">
                💡 Dica: Seja específico sobre o tom, idioma e tipo de respostas que deseja
              </p>
            </div>

            {/* Advanced Settings */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Configurações Avançadas do LLM
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Temperature */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Temperature (Criatividade)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="1"
                    step="0.1"
                    value={config.temperature}
                    onChange={(e) => setConfig({ ...config, temperature: parseFloat(e.target.value) })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-whatsapp-primary focus:border-transparent outline-none"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    0 = Mais determinístico • 1 = Mais criativo (Recomendado: 0.7)
                  </p>
                </div>

                {/* Max Tokens */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Max Tokens (Tamanho da Resposta)
                  </label>
                  <input
                    type="number"
                    min="100"
                    max="2000"
                    step="50"
                    value={config.maxToken}
                    onChange={(e) => setConfig({ ...config, maxToken: parseInt(e.target.value) })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-whatsapp-primary focus:border-transparent outline-none"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Limite de tokens por resposta (Recomendado: 500-800)
                  </p>
                </div>
              </div>
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex gap-3">
                <div className="text-blue-500 text-xl">ℹ️</div>
                <div>
                  <h4 className="text-sm font-semibold text-blue-900 mb-1">
                    Como funciona?
                  </h4>
                  <p className="text-sm text-blue-800">
                    O agente AI usará o prompt do sistema como base para todas as conversas. 
                    Se uma loja for conectada, o agente terá acesso ao catálogo de produtos, 
                    categorias e poderá ajudar com pedidos e informações sobre os produtos.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex-1 bg-whatsapp-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-whatsapp-secondary transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? 'Salvando...' : 'Salvar Configurações'}
              </button>
              <button
                onClick={() => navigate('/instances')}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>

        {/* Preview Section */}
        <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Preview da Configuração
          </h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between py-2 border-b">
              <span className="font-semibold text-gray-700">IA Ativa:</span>
              <span className={`px-2 py-1 rounded text-xs font-semibold ${config.iaResponse ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                {config.iaResponse ? 'Sim' : 'Não'}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="font-semibold text-gray-700">Loja:</span>
              <span className="text-gray-900">
                {config.storeId ? stores.find(s => parseInt(s.id) === parseInt(config.storeId))?.storeName || 'Nenhuma' : 'Nenhuma'}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="font-semibold text-gray-700">Temperature:</span>
              <span className="text-gray-900">{config.temperature}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="font-semibold text-gray-700">Max Tokens:</span>
              <span className="text-gray-900">{config.maxToken}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="font-semibold text-gray-700">Prompt Length:</span>
              <span className="text-gray-900">{config.promptSystem.length} caracteres</span>
            </div>
          </div>
        </div>
          </>
        )}
      </main>
    </div>
  )
}

export default InstanceConfig
