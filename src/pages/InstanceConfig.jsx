import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Sidebar from '../components/Sidebar'

function InstanceConfig() {
  const navigate = useNavigate()
  const { instanceId } = useParams()

  // Mock instance data
  const [instance, setInstance] = useState({
    id: instanceId,
    name: 'Vendas Principal',
    phone: '+244 923 456 789',
    status: 'connected'
  })

  // Mock stores data
  const [stores, setStores] = useState([
    { id: 1, name: 'Loja Tech Store', description: 'Eletrônicos e gadgets' },
    { id: 2, name: 'Fashion Store', description: 'Roupas e acessórios' },
    { id: 3, name: 'Food Store', description: 'Alimentos e bebidas' }
  ])

  // Configuration state
  const [config, setConfig] = useState({
    systemPrompt: `Você é um assistente virtual de vendas amigável e prestativo.
Sua função é ajudar os clientes a encontrar produtos, responder perguntas sobre a loja e processar pedidos.
Sempre seja cortês, profissional e responda em português.
Se não souber algo, admita e ofereça ajuda alternativa.`,
    storeId: null,
    temperature: 0.7,
    maxTokens: 500
  })

  const [isSaving, setIsSaving] = useState(false)

  const handleSave = () => {
    setIsSaving(true)
    // Simulate API call
    setTimeout(() => {
      alert('Configurações salvas com sucesso!')
      setIsSaving(false)
    }, 1000)
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
            {instance.name} • {instance.phone}
          </p>
        </div>

        {/* Configuration Form */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="space-y-6">
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
              >
                <option value="">Nenhuma loja selecionada</option>
                {stores.map((store) => (
                  <option key={store.id} value={store.id}>
                    {store.name} - {store.description}
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
                value={config.systemPrompt}
                onChange={(e) => setConfig({ ...config, systemPrompt: e.target.value })}
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
                    value={config.maxTokens}
                    onChange={(e) => setConfig({ ...config, maxTokens: parseInt(e.target.value) })}
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
              <span className="font-semibold text-gray-700">Loja:</span>
              <span className="text-gray-900">
                {config.storeId ? stores.find(s => s.id === config.storeId)?.name : 'Nenhuma'}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="font-semibold text-gray-700">Temperature:</span>
              <span className="text-gray-900">{config.temperature}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="font-semibold text-gray-700">Max Tokens:</span>
              <span className="text-gray-900">{config.maxTokens}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="font-semibold text-gray-700">Prompt Length:</span>
              <span className="text-gray-900">{config.systemPrompt.length} caracteres</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default InstanceConfig
