import { useState } from 'react'
import Sidebar from '../components/Sidebar'

function Contacts() {
  // Mock contacts data
  const [contacts, setContacts] = useState([
    { id: 1, name: 'João Silva', phone: '+244 923 456 789', createdAt: '2024-01-15' },
    { id: 2, name: 'Maria Santos', phone: '+244 912 345 678', createdAt: '2024-02-20' },
    { id: 3, name: 'Pedro Costa', phone: '+244 934 567 890', createdAt: '2024-03-10' },
    { id: 4, name: 'Ana Ferreira', phone: '+244 945 678 901', createdAt: '2024-03-25' },
    { id: 5, name: 'Carlos Mendes', phone: '+244 956 789 012', createdAt: '2024-04-05' }
  ])

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [selectedContact, setSelectedContact] = useState(null)

  // Form data
  const [formData, setFormData] = useState({
    name: '',
    phone: ''
  })

  // View and sort options
  const [viewMode, setViewMode] = useState('list') // 'card' or 'list'
  const [sortBy, setSortBy] = useState('name') // 'date' or 'name'
  const [searchQuery, setSearchQuery] = useState('')

  // Filter and sort contacts
  const filteredContacts = contacts
    .filter(contact => {
      const matchesSearch = contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           contact.phone.includes(searchQuery)
      return matchesSearch
    })
    .sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name)
      } else {
        // Sort by date (newest first)
        return new Date(b.createdAt) - new Date(a.createdAt)
      }
    })

  // Handle Add Contact
  const handleAdd = () => {
    if (!formData.name || !formData.phone) {
      alert('Por favor, preencha nome e telefone')
      return
    }

    const newContact = {
      id: Date.now(),
      name: formData.name,
      phone: formData.phone,
      createdAt: new Date().toISOString().split('T')[0]
    }

    setContacts([...contacts, newContact])
    setShowAddModal(false)
    resetForm()
  }

  // Handle Edit Contact
  const handleEdit = (contact) => {
    setSelectedContact(contact)
    setFormData({
      name: contact.name,
      phone: contact.phone
    })
    setShowEditModal(true)
  }

  const handleUpdate = () => {
    if (!formData.name || !formData.phone) {
      alert('Por favor, preencha nome e telefone')
      return
    }

    setContacts(contacts.map(c => 
      c.id === selectedContact.id 
        ? {
            ...c,
            name: formData.name,
            phone: formData.phone
          }
        : c
    ))
    setShowEditModal(false)
    resetForm()
  }

  // Handle Delete Contact
  const handleDelete = (contact) => {
    setSelectedContact(contact)
    setShowDeleteModal(true)
  }

  const confirmDelete = () => {
    setContacts(contacts.filter(c => c.id !== selectedContact.id))
    setShowDeleteModal(false)
    setSelectedContact(null)
  }

  // Handle View Contact
  const handleView = (contact) => {
    setSelectedContact(contact)
    setShowViewModal(true)
  }

  // Reset form
  const resetForm = () => {
    setFormData({ name: '', phone: '' })
    setSelectedContact(null)
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 p-4 lg:p-8 pt-20 lg:pt-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2">
              Contatos
            </h1>
            <p className="text-gray-600">
              Gerencie sua lista de contatos ({contacts.length} total)
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-whatsapp-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-whatsapp-secondary transition flex items-center gap-2"
          >
            <span className="text-xl">+</span>
            Novo Contato
          </button>
        </div>

        {/* Search, Sort and View Options */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <input
                type="text"
                placeholder="Buscar por nome ou telefone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-whatsapp-primary focus:border-transparent outline-none"
              />
            </div>
            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-whatsapp-primary focus:border-transparent outline-none bg-white"
            >
              <option value="date">Ordenar por Data</option>
              <option value="name">Ordenar por Nome</option>
            </select>
            {/* View Mode */}
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('card')}
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  viewMode === 'card'
                    ? 'bg-whatsapp-primary text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Cards
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  viewMode === 'list'
                    ? 'bg-whatsapp-primary text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Lista
              </button>
            </div>
          </div>
        </div>

        {/* Contacts List */}
        {filteredContacts.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <img src="/icon/contact.png" alt="No contacts" className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Nenhum contato encontrado</h3>
            <p className="text-gray-600 mb-4">
              {searchQuery
                ? 'Tente ajustar os filtros de busca'
                : 'Adicione seu primeiro contato para começar'}
            </p>
            {!searchQuery && (
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-whatsapp-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-whatsapp-secondary transition"
              >
                Adicionar Contato
              </button>
            )}
          </div>
        ) : viewMode === 'card' ? (
          /* Card View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredContacts.map(contact => (
              <div key={contact.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition">
                {/* Contact Header */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-whatsapp-primary text-white flex items-center justify-center text-xl font-bold">
                    {contact.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900">{contact.name}</h3>
                    <p className="text-sm text-gray-600">{contact.phone}</p>
                  </div>
                </div>

                {/* Date */}
                <div className="text-xs text-gray-500 mb-4">
                  Adicionado em {new Date(contact.createdAt).toLocaleDateString('pt-BR')}
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-3 border-t">
                  <button
                    onClick={() => handleView(contact)}
                    className="flex-1 bg-blue-500 text-white px-3 py-2 rounded-lg text-sm font-semibold hover:bg-blue-600 transition"
                  >
                    Ver
                  </button>
                  <button
                    onClick={() => handleEdit(contact)}
                    className="flex-1 bg-gray-500 text-white px-3 py-2 rounded-lg text-sm font-semibold hover:bg-gray-600 transition"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(contact)}
                    className="flex-1 bg-red-500 text-white px-3 py-2 rounded-lg text-sm font-semibold hover:bg-red-600 transition"
                  >
                    Deletar
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* List View */
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Contato</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Telefone</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Data</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredContacts.map(contact => (
                  <tr key={contact.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-whatsapp-primary text-white flex items-center justify-center font-bold">
                          {contact.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-semibold text-gray-900">{contact.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-700">{contact.phone}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(contact.createdAt).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => handleView(contact)}
                          className="bg-blue-500 text-white px-3 py-1.5 rounded text-sm font-semibold hover:bg-blue-600 transition"
                        >
                          Ver
                        </button>
                        <button
                          onClick={() => handleEdit(contact)}
                          className="bg-gray-500 text-white px-3 py-1.5 rounded text-sm font-semibold hover:bg-gray-600 transition"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(contact)}
                          className="bg-red-500 text-white px-3 py-1.5 rounded text-sm font-semibold hover:bg-red-600 transition"
                        >
                          Deletar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {/* Add Contact Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Novo Contato</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nome *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-whatsapp-primary focus:border-transparent outline-none"
                  placeholder="Ex: João Silva"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Telefone *
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-whatsapp-primary focus:border-transparent outline-none"
                  placeholder="Ex: +244 923 456 789"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleAdd}
                  className="flex-1 bg-whatsapp-primary text-white px-4 py-3 rounded-lg font-semibold hover:bg-whatsapp-secondary transition"
                >
                  Adicionar
                </button>
                <button
                  onClick={() => { setShowAddModal(false); resetForm(); }}
                  className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Contact Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Editar Contato</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nome *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-whatsapp-primary focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Telefone *
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-whatsapp-primary focus:border-transparent outline-none"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleUpdate}
                  className="flex-1 bg-whatsapp-primary text-white px-4 py-3 rounded-lg font-semibold hover:bg-whatsapp-secondary transition"
                >
                  Salvar
                </button>
                <button
                  onClick={() => { setShowEditModal(false); resetForm(); }}
                  className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Contact Modal */}
      {showViewModal && selectedContact && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Detalhes do Contato</h3>
              <button
                onClick={() => setShowViewModal(false)}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-whatsapp-primary text-white flex items-center justify-center text-2xl font-bold">
                  {selectedContact.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4 className="text-xl font-bold text-gray-900">{selectedContact.name}</h4>
                  <p className="text-sm text-gray-500">Adicionado em {new Date(selectedContact.createdAt).toLocaleDateString('pt-BR')}</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <img src="/icon/phone.png" alt="Phone" className="w-5 h-5" />
                  <span className="text-gray-900 font-medium">{selectedContact.phone}</span>
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => { setShowViewModal(false); handleEdit(selectedContact); }}
                  className="flex-1 bg-whatsapp-primary text-white px-4 py-3 rounded-lg font-semibold hover:bg-whatsapp-secondary transition"
                >
                  Editar
                </button>
                <button
                  onClick={() => setShowViewModal(false)}
                  className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedContact && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Deletar Contato?
              </h3>
              <p className="text-gray-600 mb-6">
                Tem certeza que deseja deletar <strong>{selectedContact.name}</strong>? Esta ação não pode ser desfeita.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={confirmDelete}
                  className="flex-1 bg-red-500 text-white px-4 py-3 rounded-lg font-semibold hover:bg-red-600 transition"
                >
                  Sim, Deletar
                </button>
                <button
                  onClick={() => { setShowDeleteModal(false); setSelectedContact(null); }}
                  className="flex-1 border border-gray-300 text-gray-700 px-4 py-3 rounded-lg font-semibold hover:bg-gray-50 transition"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Contacts
