import Sidebar from '../components/Sidebar'

function Dashboard() {
  // Dados de exemplo (posteriormente virão da API)
  const stats = {
    connectedAccounts: 3,
    openChats: 45,
    totalMessages: 1247,
    totalContacts: 892
  }

  const topProducts = [
    { name: 'Produto A', requests: 156 },
    { name: 'Produto B', requests: 134 },
    { name: 'Produto C', requests: 98 },
    { name: 'Produto D', requests: 76 },
    { name: 'Produto E', requests: 54 }
  ]

  const recentActivity = [
    { time: '10:45', message: 'Nova instância conectada', type: 'success' },
    { time: '09:30', message: '25 novas mensagens recebidas', type: 'info' },
    { time: '08:15', message: 'Produto "Camisa Polo" foi atualizado', type: 'info' },
    { time: 'Ontem', message: 'Plano Professional renovado', type: 'success' }
  ]

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
            Dashboard
          </h1>
          <p className="text-gray-600">
            Visão geral das suas contas e atividades
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Connected Accounts */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-whatsapp-primary">
            <div className="flex items-center justify-between mb-4">
              <div className="text-4xl">📱</div>
              <div className="text-3xl font-bold text-whatsapp-primary">
                {stats.connectedAccounts}
              </div>
            </div>
            <h3 className="text-gray-600 font-semibold">Contas Conectadas</h3>
            <p className="text-sm text-gray-400 mt-1">WhatsApp Business</p>
          </div>

          {/* Open Chats */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between mb-4">
              <div className="text-4xl">💬</div>
              <div className="text-3xl font-bold text-blue-500">
                {stats.openChats}
              </div>
            </div>
            <h3 className="text-gray-600 font-semibold">Chats Abertos</h3>
            <p className="text-sm text-gray-400 mt-1">Conversas ativas</p>
          </div>

          {/* Total Messages */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between mb-4">
              <div className="text-4xl">📨</div>
              <div className="text-3xl font-bold text-purple-500">
                {stats.totalMessages}
              </div>
            </div>
            <h3 className="text-gray-600 font-semibold">Total de Mensagens</h3>
            <p className="text-sm text-gray-400 mt-1">Últimas 24 horas</p>
          </div>

          {/* Total Contacts */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-orange-500">
            <div className="flex items-center justify-between mb-4">
              <div className="text-4xl">👥</div>
              <div className="text-3xl font-bold text-orange-500">
                {stats.totalContacts}
              </div>
            </div>
            <h3 className="text-gray-600 font-semibold">Total de Contatos</h3>
            <p className="text-sm text-gray-400 mt-1">Base de clientes</p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Top Products */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span>🏆</span>
              Produtos Mais Requisitados
            </h2>
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-whatsapp-primary to-whatsapp-secondary text-white rounded-full flex items-center justify-center font-bold text-sm">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-gray-700">{product.name}</span>
                      <span className="text-sm text-gray-500">{product.requests} requisições</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-whatsapp-primary to-whatsapp-secondary h-2 rounded-full transition-all"
                        style={{ width: `${(product.requests / topProducts[0].requests) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span>🕒</span>
              Atividade Recente
            </h2>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start gap-3 pb-4 border-b border-gray-100 last:border-0">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    activity.type === 'success' ? 'bg-green-500' : 'bg-blue-500'
                  }`} />
                  <div className="flex-1">
                    <p className="text-gray-700 font-medium">{activity.message}</p>
                    <p className="text-sm text-gray-400 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <span>⚡</span>
            Ações Rápidas
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-whatsapp-primary hover:bg-whatsapp-primary/5 transition-all">
              <span className="text-3xl">➕</span>
              <div className="text-left">
                <p className="font-semibold text-gray-900">Nova Instância</p>
                <p className="text-sm text-gray-500">Conectar WhatsApp</p>
              </div>
            </button>
            <button className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-500/5 transition-all">
              <span className="text-3xl">🏪</span>
              <div className="text-left">
                <p className="font-semibold text-gray-900">Adicionar Loja</p>
                <p className="text-sm text-gray-500">Integrar produtos</p>
              </div>
            </button>
            <button className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-500/5 transition-all">
              <span className="text-3xl">📊</span>
              <div className="text-left">
                <p className="font-semibold text-gray-900">Ver Relatórios</p>
                <p className="text-sm text-gray-500">Análise detalhada</p>
              </div>
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Dashboard
