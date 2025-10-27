import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'

function Sidebar() {
  const location = useLocation()
  const [isOpen, setIsOpen] = useState(false)

  const menuItems = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: '📊'
    },
    {
      name: 'Instâncias',
      path: '/instances',
      icon: '📱'
    },
    {
      name: 'Lojas',
      path: '/stores',
      icon: '🏪'
    },
    {
      name: 'Definições',
      path: '/settings',
      icon: '⚙️'
    },
    {
      name: 'Planos',
      path: '/plans',
      icon: '💳'
    }
  ]

  const isActive = (path) => location.pathname === path

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 bg-whatsapp-primary text-white p-3 rounded-lg shadow-lg"
      >
        {isOpen ? '✕' : '☰'}
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen bg-gray-900 text-white transition-transform duration-300 z-40 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } w-64`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-gray-800">
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
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <span className="text-2xl">{item.icon}</span>
                  <span className="font-medium">{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* User Info */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800">
          <div className="flex items-center gap-3 px-4 py-3">
            <div className="w-10 h-10 bg-whatsapp-primary rounded-full flex items-center justify-center font-bold">
              U
            </div>
            <div className="flex-1">
              <p className="font-semibold text-sm">Usuário</p>
              <p className="text-xs text-gray-400">usuario@email.com</p>
            </div>
            <Link
              to="/login"
              className="text-gray-400 hover:text-red-400 transition"
              title="Sair"
            >
              🚪
            </Link>
          </div>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
