import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { logout } from '../services/api'

function Sidebar({ userData }) {
  const location = useLocation()
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)

  const menuItems = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: '/icon/dashboard.png'
    },
    {
      name: 'Instâncias',
      path: '/instances',
      icon: '/icon/instance.png'
    },
    {
      name: 'Lojas',
      path: '/stores',
      icon: '/icon/store.png'
    },
    {
      name: 'Definições',
      path: '/settings',
      icon: '/icon/setting.png'
    },
    {
      name: 'Relatórios',
      path: '/reports',
      icon: '/icon/report.png'
    },
    {
      name: 'Contactos',
      path: '/contacts',
      icon: '/icon/contact.png'
    },
    {
      name: 'Notificações',
      path: '/notifications',
      icon: '/icon/notification.png'
    }
  ]

  const isActive = (path) => location.pathname === path

  // Função para fazer logout
  const handleLogout = async () => {
    const result = await logout()
    if (result.success) {
      navigate('/signin')
    } else {
      // Mesmo com erro, redireciona para login
      navigate('/signin')
    }
  }

  // Extrair iniciais do nome
  const getInitials = () => {
    if (!userData?.fullName) return 'U'
    const names = userData.fullName.split(' ')
    if (names.length >= 2) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase()
    }
    return names[0][0].toUpperCase()
  }

  return (
    <>
      {/* Mobile Menu Button - Only show when closed */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden fixed top-4 left-4 z-[60] bg-whatsapp-primary text-white p-3 rounded-lg shadow-lg"
        >
          ☰
        </button>
      )}

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-[45]"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen bg-gray-50 text-gray-900 transition-transform duration-300 z-[50] shadow-xl ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } w-64`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <Link to="/dashboard" className="flex items-center gap-3">
            <img src="/logo.png" alt="Whatbot Logo" className="w-10 h-10" />
            <span className="text-xl font-bold">Whatbot</span>
          </Link>
        </div>

        {/* Menu Items */}
        <nav className="p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    isActive(item.path)
                      ? 'bg-whatsapp-primary text-white shadow-lg'
                      : 'text-gray-600 hover:bg-gray-200 hover:text-gray-900'
                  }`}
                >
                  {item.icon.startsWith('/') ? (
                    <img src={item.icon} alt={item.name} className="w-6 h-6" />
                  ) : (
                    <span className="text-2xl">{item.icon}</span>
                  )}
                  <span className="font-medium">{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* User Info */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <div className="flex items-center gap-3 px-4 py-3">
            <div className="w-10 h-10 bg-whatsapp-primary rounded-full flex items-center justify-center font-bold text-white text-sm">
              {getInitials()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm text-gray-900 truncate">
                {userData?.fullName || 'Carregando...'}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {userData?.email || 'carregando...'}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="hover:opacity-70 transition flex-shrink-0"
              title="Sair"
            >
              <img src="/icon/exit.png" alt="Sair" className="w-5 h-5" />
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
