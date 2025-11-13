import { useState } from 'react'
import Sidebar from '../components/Sidebar'

function Notifications() {
  // Mock notifications data
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'message',
      title: 'Nova mensagem recebida',
      message: 'João Silva enviou uma nova mensagem',
      instance: 'Loja Principal',
      timestamp: '2024-11-13T10:30:00',
      read: false
    },
    {
      id: 2,
      type: 'order',
      title: 'Novo pedido realizado',
      message: 'Maria Santos fez um pedido de R$ 150,00',
      instance: 'Loja Secundária',
      timestamp: '2024-11-13T09:15:00',
      read: false
    },
    {
      id: 3,
      type: 'instance',
      title: 'Instância desconectada',
      message: 'A instância "Loja Principal" foi desconectada',
      instance: 'Loja Principal',
      timestamp: '2024-11-13T08:45:00',
      read: true
    },
    {
      id: 4,
      type: 'system',
      title: 'Atualização disponível',
      message: 'Uma nova versão do sistema está disponível',
      instance: null,
      timestamp: '2024-11-12T16:20:00',
      read: true
    },
    {
      id: 5,
      type: 'message',
      title: 'Nova conversa iniciada',
      message: 'Pedro Costa iniciou uma nova conversa',
      instance: 'Loja Principal',
      timestamp: '2024-11-12T14:10:00',
      read: true
    },
    {
      id: 6,
      type: 'order',
      title: 'Pedido cancelado',
      message: 'Ana Ferreira cancelou o pedido #1234',
      instance: 'Loja Secundária',
      timestamp: '2024-11-12T11:30:00',
      read: true
    },
    {
      id: 7,
      type: 'system',
      title: 'Backup concluído',
      message: 'O backup automático foi concluído com sucesso',
      instance: null,
      timestamp: '2024-11-12T03:00:00',
      read: true
    },
    {
      id: 8,
      type: 'instance',
      title: 'Instância reconectada',
      message: 'A instância "Loja Secundária" foi reconectada',
      instance: 'Loja Secundária',
      timestamp: '2024-11-11T18:45:00',
      read: true
    }
  ])

  // Filter states
  const [filterType, setFilterType] = useState('all') // all, message, order, instance, system
  const [filterStatus, setFilterStatus] = useState('all') // all, unread, read

  // Get notification icon and color based on type
  const getNotificationStyle = (type) => {
    const styles = {
      message: {
        icon: '/icon/message.png',
        bgColor: 'bg-blue-100',
        iconBgColor: 'bg-blue-500'
      },
      order: {
        icon: '/icon/e-commerce.png',
        bgColor: 'bg-orange-100',
        iconBgColor: 'bg-orange-500'
      },
      instance: {
        icon: '/icon/instance.png',
        bgColor: 'bg-purple-100',
        iconBgColor: 'bg-purple-500'
      },
      system: {
        icon: '/icon/system.png',
        bgColor: 'bg-gray-100',
        iconBgColor: 'bg-gray-500'
      }
    }
    return styles[type] || styles.system
  }

  // Format timestamp
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Agora'
    if (diffMins < 60) return `${diffMins} min atrás`
    if (diffHours < 24) return `${diffHours}h atrás`
    if (diffDays < 7) return `${diffDays}d atrás`
    
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
  }

  // Filter notifications
  const filteredNotifications = notifications.filter(notif => {
    const matchesType = filterType === 'all' || notif.type === filterType
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'unread' && !notif.read) ||
                         (filterStatus === 'read' && notif.read)
    return matchesType && matchesStatus
  })

  // Mark as read
  const markAsRead = (id) => {
    setNotifications(notifications.map(notif =>
      notif.id === id ? { ...notif, read: true } : notif
    ))
  }

  // Mark all as read
  const markAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, read: true })))
  }

  // Delete notification
  const deleteNotification = (id) => {
    setNotifications(notifications.filter(notif => notif.id !== id))
  }

  // Clear all read notifications
  const clearAllRead = () => {
    setNotifications(notifications.filter(notif => !notif.read))
  }

  // Count unread
  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 p-4 lg:p-8 pt-20 lg:pt-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2">
              Notificações
            </h1>
            <p className="text-gray-600">
              {unreadCount > 0 ? (
                <span className="font-semibold text-whatsapp-primary">
                  {unreadCount} {unreadCount === 1 ? 'notificação não lida' : 'notificações não lidas'}
                </span>
              ) : (
                'Todas as notificações foram lidas'
              )}
            </p>
          </div>
          <div className="flex gap-2">
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="bg-whatsapp-primary text-white px-4 py-2 rounded-lg font-semibold hover:bg-whatsapp-secondary transition text-sm"
              >
                Marcar todas como lidas
              </button>
            )}
            {notifications.some(n => n.read) && (
              <button
                onClick={clearAllRead}
                className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-600 transition text-sm"
              >
                Limpar lidas
              </button>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Filter by Type */}
            <div className="flex-1">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Tipo de Notificação
              </label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-whatsapp-primary focus:border-transparent outline-none bg-white"
              >
                <option value="all">Todas</option>
                <option value="message">Mensagens</option>
                <option value="order">Pedidos</option>
                <option value="instance">Instâncias</option>
                <option value="system">Sistema</option>
              </select>
            </div>

            {/* Filter by Status */}
            <div className="flex-1">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Status
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-whatsapp-primary focus:border-transparent outline-none bg-white"
              >
                <option value="all">Todas</option>
                <option value="unread">Não lidas</option>
                <option value="read">Lidas</option>
              </select>
            </div>
          </div>
        </div>

        {/* Notifications List */}
        {filteredNotifications.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <img src="/icon/notification.png" alt="No notifications" className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Nenhuma notificação encontrada</h3>
            <p className="text-gray-600">
              {filterType !== 'all' || filterStatus !== 'all'
                ? 'Tente ajustar os filtros'
                : 'Você não tem notificações no momento'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredNotifications.map(notification => {
              const style = getNotificationStyle(notification.type)
              return (
                <div
                  key={notification.id}
                  className={`bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition ${
                    !notification.read ? 'border-l-4 border-l-whatsapp-primary' : ''
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className={`w-12 h-12 rounded-full ${style.iconBgColor} flex items-center justify-center flex-shrink-0`}>
                      <img src={style.icon} alt={notification.type} className="w-6 h-6 brightness-0 invert" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="font-bold text-gray-900 flex items-center gap-2">
                          {notification.title}
                          {!notification.read && (
                            <span className="w-2 h-2 bg-whatsapp-primary rounded-full"></span>
                          )}
                        </h3>
                        <span className="text-xs text-gray-500 whitespace-nowrap">
                          {formatTimestamp(notification.timestamp)}
                        </span>
                      </div>
                      <p className="text-gray-700 mb-2">{notification.message}</p>
                      {notification.instance && (
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded font-semibold">
                            {notification.instance}
                          </span>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex gap-2">
                        {!notification.read && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="text-sm text-whatsapp-primary hover:text-whatsapp-secondary font-semibold transition"
                          >
                            Marcar como lida
                          </button>
                        )}
                        <button
                          onClick={() => deleteNotification(notification.id)}
                          className="text-sm text-red-500 hover:text-red-600 font-semibold transition"
                        >
                          Excluir
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}

export default Notifications
