import { useState } from 'react'
import Sidebar from '../components/Sidebar'

function Reports() {
  // Date range filter
  const [dateRange, setDateRange] = useState('7days')

  // Mock data for statistics
  const stats = {
    totalMessages: 1234,
    messagesGrowth: 12.5,
    totalConversations: 89,
    conversationsGrowth: 8.3,
    totalOrders: 45,
    ordersGrowth: 15.2,
    revenue: 125000,
    revenueGrowth: 23.4
  }

  // Mock data for message timeline
  const messageTimeline = [
    { day: 'Seg', messages: 145 },
    { day: 'Ter', messages: 189 },
    { day: 'Qua', messages: 167 },
    { day: 'Qui', messages: 223 },
    { day: 'Sex', messages: 198 },
    { day: 'Sáb', messages: 156 },
    { day: 'Dom', messages: 134 }
  ]

  // Mock data for top products
  const topProducts = [
    { name: 'iPhone 15 Pro', sales: 23, revenue: 690000 },
    { name: 'Samsung Galaxy S24', sales: 18, revenue: 450000 },
    { name: 'MacBook Air M3', sales: 12, revenue: 600000 },
    { name: 'AirPods Pro', sales: 34, revenue: 170000 },
    { name: 'iPad Pro', sales: 15, revenue: 450000 }
  ]

  // Mock data for instances performance
  const instancesPerformance = [
    { name: 'Vendas Principal', messages: 456, conversions: 23, rate: 5.04 },
    { name: 'Suporte Técnico', messages: 389, conversions: 45, rate: 11.57 },
    { name: 'Loja Fashion', messages: 234, conversions: 12, rate: 5.13 },
    { name: 'Food Store', messages: 155, conversions: 18, rate: 11.61 }
  ]

  const maxMessages = Math.max(...messageTimeline.map(d => d.messages))

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 p-4 lg:p-8 pt-20 lg:pt-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2">
              Relatórios e Análises
            </h1>
            <p className="text-gray-600">
              Acompanhe o desempenho das suas instâncias e vendas
            </p>
          </div>

          {/* Date Range Filter */}
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-whatsapp-primary focus:border-transparent outline-none bg-white"
          >
            <option value="today">Hoje</option>
            <option value="7days">Últimos 7 dias</option>
            <option value="30days">Últimos 30 dias</option>
            <option value="90days">Últimos 90 dias</option>
            <option value="custom">Personalizado</option>
          </select>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Total Messages */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <img src="/icon/message.png" alt="Messages" className="w-6 h-6" />
              </div>
              <span className={`text-sm font-semibold ${stats.messagesGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {stats.messagesGrowth >= 0 ? '↑' : '↓'} {Math.abs(stats.messagesGrowth)}%
              </span>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">Total de Mensagens</h3>
            <p className="text-3xl font-bold text-gray-900">{stats.totalMessages.toLocaleString()}</p>
          </div>

          {/* Total Conversations */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                <img src="/icon/chat.png" alt="Conversations" className="w-6 h-6" />
              </div>
              <span className={`text-sm font-semibold ${stats.conversationsGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {stats.conversationsGrowth >= 0 ? '↑' : '↓'} {Math.abs(stats.conversationsGrowth)}%
              </span>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">Conversas Ativas</h3>
            <p className="text-3xl font-bold text-gray-900">{stats.totalConversations}</p>
          </div>

          {/* Total Orders */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
                <img src="/icon/e-commerce.png" alt="Orders" className="w-6 h-6" />
              </div>
              <span className={`text-sm font-semibold ${stats.ordersGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {stats.ordersGrowth >= 0 ? '↑' : '↓'} {Math.abs(stats.ordersGrowth)}%
              </span>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">Pedidos Realizados</h3>
            <p className="text-3xl font-bold text-gray-900">{stats.totalOrders}</p>
          </div>

          {/* Revenue */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <img src="/icon/save-money.png" alt="Invoicing" className="w-6 h-6" />
              </div>
              <span className={`text-sm font-semibold ${stats.revenueGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {stats.revenueGrowth >= 0 ? '↑' : '↓'} {Math.abs(stats.revenueGrowth)}%
              </span>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">Faturamento (Estimativa)</h3>
            <p className="text-3xl font-bold text-gray-900">{(stats.revenue / 1000).toFixed(0)}K AOA</p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Message Timeline Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Mensagens por Dia</h3>
            <div className="space-y-4">
              {messageTimeline.map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-600 w-10">{item.day}</span>
                  <div className="flex-1 bg-gray-100 rounded-full h-8 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full flex items-center justify-end pr-3 transition-all duration-500"
                      style={{ width: `${(item.messages / maxMessages) * 100}%` }}
                    >
                      <span className="text-white text-xs font-bold">{item.messages}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Products */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Produtos Mais Vendidos</h3>
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-8 h-8 rounded-full bg-whatsapp-primary text-white flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 text-sm">{product.name}</p>
                      <p className="text-xs text-gray-500">{product.sales} vendas</p>
                    </div>
                  </div>
                  <p className="text-sm font-bold text-gray-900">{(product.revenue / 1000).toFixed(0)}K</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Instances Performance Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Desempenho por Instância</h3>
          
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Instância</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Mensagens</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Conversões</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Taxa de Conversão</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {instancesPerformance.map((instance, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition">
                    <td className="py-4 px-4">
                      <p className="font-semibold text-gray-900">{instance.name}</p>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="text-gray-900 font-medium">{instance.messages}</span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="text-gray-900 font-medium">{instance.conversions}</span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <div className="flex-1 max-w-[100px] bg-gray-100 rounded-full h-2">
                          <div
                            className="bg-whatsapp-primary h-2 rounded-full"
                            style={{ width: `${Math.min(instance.rate * 8, 100)}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-bold text-gray-900">{instance.rate.toFixed(1)}%</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                        Ativo
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-4">
            {instancesPerformance.map((instance, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-bold text-gray-900">{instance.name}</h4>
                  <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                    Ativo
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Mensagens</p>
                    <p className="text-lg font-bold text-gray-900">{instance.messages}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Conversões</p>
                    <p className="text-lg font-bold text-gray-900">{instance.conversions}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Taxa</p>
                    <p className="text-lg font-bold text-whatsapp-primary">{instance.rate.toFixed(1)}%</p>
                  </div>
                </div>
                <div className="mt-3">
                  <div className="bg-gray-100 rounded-full h-2">
                    <div
                      className="bg-whatsapp-primary h-2 rounded-full transition-all"
                      style={{ width: `${Math.min(instance.rate * 8, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Export Button */}
        <div className="mt-6 flex justify-end">
          <button className="bg-whatsapp-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-whatsapp-secondary transition flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Exportar Relatório
          </button>
        </div>
      </main>
    </div>
  )
}

export default Reports
