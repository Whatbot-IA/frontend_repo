import { useState } from 'react'
import Sidebar from '../components/Sidebar'
import styled from 'styled-components'

function Stores() {
  const [showAddStoreModal, setShowAddStoreModal] = useState(false)
  const [showEditStoreModal, setShowEditStoreModal] = useState(false)
  const [showDeleteStoreModal, setShowDeleteStoreModal] = useState(false)
  const [selectedStore, setSelectedStore] = useState(null)
  const [storeForm, setStoreForm] = useState({ name: '', description: '' })

  // Dados de exemplo (posteriormente virão da API)
  const [stores, setStores] = useState([
    {
      id: 'store-001',
      name: 'Loja Principal',
      description: 'Produtos gerais e eletrônicos',
      createdAt: '2024-10-15',
      productsCount: 45,
      categoriesCount: 8
    },
    {
      id: 'store-002',
      name: 'Moda e Acessórios',
      description: 'Roupas, calçados e acessórios fashion',
      createdAt: '2024-10-20',
      productsCount: 67,
      categoriesCount: 12
    },
    {
      id: 'store-003',
      name: 'Casa e Decoração',
      description: 'Móveis, decoração e utensílios domésticos',
      createdAt: '2024-10-25',
      productsCount: 38,
      categoriesCount: 6
    }
  ])

  const handleAddStore = () => {
    if (storeForm.name.trim()) {
      const newStore = {
        id: `store-${Date.now()}`,
        name: storeForm.name,
        description: storeForm.description,
        createdAt: new Date().toISOString().split('T')[0],
        productsCount: 0,
        categoriesCount: 0
      }
      setStores([...stores, newStore])
      setStoreForm({ name: '', description: '' })
      setShowAddStoreModal(false)
    }
  }

  const handleEditStore = () => {
    if (storeForm.name.trim()) {
      setStores(stores.map(store => 
        store.id === selectedStore.id 
          ? { ...store, name: storeForm.name, description: storeForm.description }
          : store
      ))
      setShowEditStoreModal(false)
      setSelectedStore(null)
      setStoreForm({ name: '', description: '' })
    }
  }

  const handleDeleteStore = () => {
    setStores(stores.filter(store => store.id !== selectedStore.id))
    setShowDeleteStoreModal(false)
    setSelectedStore(null)
  }

  const openEditModal = (store) => {
    setSelectedStore(store)
    setStoreForm({ name: store.name, description: store.description })
    setShowEditStoreModal(true)
  }

  const openDeleteModal = (store) => {
    setSelectedStore(store)
    setShowDeleteStoreModal(true)
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 p-8 pt-20 lg:pt-8">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
              Minhas Lojas
            </h1>
            <p className="text-gray-600">
              Gerencie suas lojas virtuais e produtos
            </p>
          </div>
          <button
            onClick={() => setShowAddStoreModal(true)}
            className="bg-gradient-to-r from-whatsapp-primary to-whatsapp-secondary text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center gap-2"
          >
            <span className="text-xl">+</span>
            Nova Loja
          </button>
        </div>

        {/* Stores Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stores.map((store) => (
            <div
              key={store.id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{store.name}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2">{store.description}</p>
                  </div>
                  <div className="flex gap-2 ml-2">
                    <button
                      onClick={() => openEditModal(store)}
                      className="text-blue-500 hover:text-blue-700 p-2 hover:bg-blue-50 rounded-lg transition"
                      title="Editar"
                    >
                      <img src="/icon/edit.png" alt="Edit" className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => openDeleteModal(store)}
                      className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition"
                      title="Eliminar"
                    >
                      <img src="/icon/delete_black.png" alt="Delete" className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">{store.productsCount}</p>
                    <p className="text-xs text-blue-700 font-medium">Produtos</p>
                  </div>
                  <div className="bg-purple-50 p-3 rounded-lg">
                    <p className="text-2xl font-bold text-purple-600">{store.categoriesCount}</p>
                    <p className="text-xs text-purple-700 font-medium">Categorias</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
                  <img src="/icon/calendar.png" alt="Calendar" className="w-4 h-4" />
                  <span>Criado em {store.createdAt}</span>
                </div>

                <a
                  href={`/stores/${store.id}`}
                  className="block w-full bg-gradient-to-r from-whatsapp-primary to-whatsapp-secondary text-white text-center py-2 rounded-lg font-medium hover:shadow-lg transition"
                >
                  Gerenciar Loja
                </a>
              </div>
            </div>
          ))}
        </div>

        {stores.length === 0 && (
          <div className="text-center py-20">
            <div className="mb-4">
              <img src="/icon/store.png" alt="Store" className="w-20 h-20 mx-auto opacity-50" />
            </div>
            <p className="text-xl text-gray-500 mb-2">Nenhuma loja criada ainda</p>
            <p className="text-sm text-gray-400 mb-6">Comece criando sua primeira loja virtual</p>
            <button
              onClick={() => setShowAddStoreModal(true)}
              className="bg-gradient-to-r from-whatsapp-primary to-whatsapp-secondary text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all inline-flex items-center gap-2"
            >
              <span className="text-xl">+</span>
              Criar Minha Primeira Loja
            </button>
          </div>
        )}
      </main>

      {/* Modal: Add Store */}
      {showAddStoreModal && (
        <ModalOverlay onClick={() => setShowAddStoreModal(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Nova Loja</h2>
              <button
                onClick={() => setShowAddStoreModal(false)}
                className="text-gray-400 hover:text-gray-600 text-3xl leading-none"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nome da Loja *
                </label>
                <input
                  type="text"
                  value={storeForm.name}
                  onChange={(e) => setStoreForm({ ...storeForm, name: e.target.value })}
                  placeholder="Ex: Minha Loja Virtual"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-whatsapp-primary focus:border-transparent outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Descrição
                </label>
                <textarea
                  value={storeForm.description}
                  onChange={(e) => setStoreForm({ ...storeForm, description: e.target.value })}
                  placeholder="Descreva sua loja..."
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-whatsapp-primary focus:border-transparent outline-none transition resize-none"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6">
              <button
                onClick={() => setShowAddStoreModal(false)}
                className="px-6 py-2 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition order-2 sm:order-1"
              >
                Cancelar
              </button>
              <button
                onClick={handleAddStore}
                disabled={!storeForm.name.trim()}
                className="px-6 py-2 bg-gradient-to-r from-whatsapp-primary to-whatsapp-secondary text-white rounded-lg font-medium hover:shadow-lg transition order-1 sm:order-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Criar Loja
              </button>
            </div>
          </ModalContent>
        </ModalOverlay>
      )}

      {/* Modal: Edit Store */}
      {showEditStoreModal && selectedStore && (
        <ModalOverlay onClick={() => setShowEditStoreModal(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Editar Loja</h2>
              <button
                onClick={() => setShowEditStoreModal(false)}
                className="text-gray-400 hover:text-gray-600 text-3xl leading-none"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nome da Loja *
                </label>
                <input
                  type="text"
                  value={storeForm.name}
                  onChange={(e) => setStoreForm({ ...storeForm, name: e.target.value })}
                  placeholder="Ex: Minha Loja Virtual"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-whatsapp-primary focus:border-transparent outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Descrição
                </label>
                <textarea
                  value={storeForm.description}
                  onChange={(e) => setStoreForm({ ...storeForm, description: e.target.value })}
                  placeholder="Descreva sua loja..."
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-whatsapp-primary focus:border-transparent outline-none transition resize-none"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6">
              <button
                onClick={() => setShowEditStoreModal(false)}
                className="px-6 py-2 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition order-2 sm:order-1"
              >
                Cancelar
              </button>
              <button
                onClick={handleEditStore}
                disabled={!storeForm.name.trim()}
                className="px-6 py-2 bg-gradient-to-r from-whatsapp-primary to-whatsapp-secondary text-white rounded-lg font-medium hover:shadow-lg transition order-1 sm:order-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Salvar Alterações
              </button>
            </div>
          </ModalContent>
        </ModalOverlay>
      )}

      {/* Modal: Delete Store */}
      {showDeleteStoreModal && selectedStore && (
        <ModalOverlay onClick={() => setShowDeleteStoreModal(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()} className="max-w-md">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
                <span className="text-3xl">⚠️</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                Eliminar Loja?
              </h2>
              <p className="text-sm sm:text-base text-gray-600 mb-6">
                Tem certeza que deseja eliminar a loja <strong>"{selectedStore.name}"</strong>? 
                Esta ação irá remover todos os produtos e categorias associados e não pode ser desfeita.
              </p>

              <div className="bg-red-50 p-3 rounded-lg mb-6">
                <div className="flex items-center justify-center gap-4 text-sm text-red-800">
                  <span><strong>{selectedStore.productsCount}</strong> produtos</span>
                  <span>•</span>
                  <span><strong>{selectedStore.categoriesCount}</strong> categorias</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-center gap-3">
                <button
                  onClick={() => setShowDeleteStoreModal(false)}
                  className="px-6 py-2 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition order-2 sm:order-1"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDeleteStore}
                  className="px-6 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition order-1 sm:order-2"
                >
                  Sim, Eliminar
                </button>
              </div>
            </div>
          </ModalContent>
        </ModalOverlay>
      )}
    </div>
  )
}

// Styled Components for Modals
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: 1rem;
  backdrop-filter: blur(4px);
  overflow-y: auto;
`

const ModalContent = styled.div`
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  margin: auto;
  
  @media (min-width: 640px) {
    padding: 2rem;
  }
  
  &.max-w-md {
    max-width: 28rem;
  }
`

export default Stores
