import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import styled from 'styled-components'
import { getStores, createStore, updateStore, deleteStore, getProducts, getCategories } from '../services/api'

function Stores() {
  const navigate = useNavigate()
  const [showAddStoreModal, setShowAddStoreModal] = useState(false)
  const [showEditStoreModal, setShowEditStoreModal] = useState(false)
  const [showDeleteStoreModal, setShowDeleteStoreModal] = useState(false)
  const [selectedStore, setSelectedStore] = useState(null)
  const [storeForm, setStoreForm] = useState({ storeName: '', description: '', nif: '' })
  
  // States for API data
  const [stores, setStores] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  
  // Notification modal states
  const [showNotificationModal, setShowNotificationModal] = useState(false)
  const [notificationData, setNotificationData] = useState({ type: '', message: '' })

  // Fetch stores on component mount
  useEffect(() => {
    fetchStores()
  }, [])

  const fetchStores = async () => {
    try {
      setLoading(true)
      setError('')
      const response = await getStores()
      
      if (response.success) {
        // Map stores with backend counts
        const mappedStores = response.data.map(store => ({
          ...store,
          name: store.storeName || store.store_name,
          productsCount: store.productCount || 0,
          categoriesCount: store.categoryCount || 0
        }))
        
        setStores(mappedStores)
      } else {
        setError(response.error?.message || 'Erro ao carregar lojas')
      }
    } catch (err) {
      console.error('❌ Erro ao buscar lojas:', err)
      setError('Erro ao conectar com o servidor')
    } finally {
      setLoading(false)
    }
  }

  const handleAddStore = async () => {
    if (!storeForm.storeName.trim()) {
      setNotificationData({ type: 'error', message: 'Por favor, preencha o nome da loja' })
      setShowNotificationModal(true)
      return
    }

    try {
      setIsSaving(true)
      const response = await createStore({
        storeName: storeForm.storeName,
        description: storeForm.description,
        nif: storeForm.nif
      })

      if (response.success) {
        await fetchStores() // Refresh stores list
        setShowAddStoreModal(false)
        setStoreForm({ storeName: '', description: '', nif: '' })
        setNotificationData({ type: 'success', message: 'Loja criada com sucesso!' })
        setShowNotificationModal(true)
      } else {
        setNotificationData({ type: 'error', message: response.error?.message || 'Erro ao criar loja' })
        setShowNotificationModal(true)
      }
    } catch (err) {
      console.error('❌ Erro ao criar loja:', err)
      setNotificationData({ type: 'error', message: 'Erro ao conectar com o servidor' })
      setShowNotificationModal(true)
    } finally {
      setIsSaving(false)
    }
  }

  const handleEditStore = async () => {
    if (!storeForm.storeName.trim()) {
      setNotificationData({ type: 'error', message: 'Por favor, preencha o nome da loja' })
      setShowNotificationModal(true)
      return
    }

    try {
      setIsSaving(true)
      const response = await updateStore(selectedStore.id, {
        storeName: storeForm.storeName,
        description: storeForm.description,
        nif: storeForm.nif
      })

      if (response.success) {
        await fetchStores() // Refresh stores list
        setShowEditStoreModal(false)
        setSelectedStore(null)
        setStoreForm({ storeName: '', description: '', nif: '' })
        setNotificationData({ type: 'success', message: 'Loja atualizada com sucesso!' })
        setShowNotificationModal(true)
      } else {
        setNotificationData({ type: 'error', message: response.error?.message || 'Erro ao atualizar loja' })
        setShowNotificationModal(true)
      }
    } catch (err) {
      console.error('❌ Erro ao atualizar loja:', err)
      setNotificationData({ type: 'error', message: 'Erro ao conectar com o servidor' })
      setShowNotificationModal(true)
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteStore = async () => {
    try {
      setIsSaving(true)
      const response = await deleteStore(selectedStore.id)

      if (response.success) {
        await fetchStores() // Refresh stores list
        setShowDeleteStoreModal(false)
        setSelectedStore(null)
        setNotificationData({ type: 'success', message: 'Loja eliminada com sucesso!' })
        setShowNotificationModal(true)
      } else {
        setNotificationData({ type: 'error', message: response.error?.message || 'Erro ao deletar loja' })
        setShowNotificationModal(true)
      }
    } catch (err) {
      console.error('❌ Erro ao deletar loja:', err)
      setNotificationData({ type: 'error', message: 'Erro ao conectar com o servidor' })
      setShowNotificationModal(true)
    } finally {
      setIsSaving(false)
    }
  }

  const openEditModal = (store) => {
    setSelectedStore(store)
    setStoreForm({ 
      storeName: store.storeName || store.name, 
      description: store.description || '',
      nif: store.nif || ''
    })
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

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-whatsapp-primary"></div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={fetchStores}
              className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition"
            >
              Tentar Novamente
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && stores.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center py-16">
            <div className="bg-gray-100 rounded-full p-6 mb-6">
              <img src="/icon/store.png" alt="Store" className="w-20 h-20 opacity-50" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Nenhuma loja cadastrada</h3>
            <p className="text-gray-600 mb-6">Crie sua primeira loja para começar a vender</p>
            <button
              onClick={() => setShowAddStoreModal(true)}
              className="bg-gradient-to-r from-whatsapp-primary to-whatsapp-secondary text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition"
            >
              Criar Minha Primeira Loja
            </button>
          </div>
        )}

        {/* Stores Grid */}
        {!loading && !error && stores.length > 0 && (
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
                  <span>Criado em {new Date(store.createdAt).toLocaleDateString('pt-BR')}</span>
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
                  value={storeForm.storeName}
                  onChange={(e) => setStoreForm({ ...storeForm, storeName: e.target.value })}
                  placeholder="Ex: Minha Loja Virtual"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-whatsapp-primary focus:border-transparent outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  NIF (Número de Identificação Fiscal)
                </label>
                <input
                  type="text"
                  value={storeForm.nif}
                  onChange={(e) => setStoreForm({ ...storeForm, nif: e.target.value })}
                  placeholder="Ex: 123456789"
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
                disabled={isSaving}
                className="px-6 py-2 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition order-2 sm:order-1 disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleAddStore}
                disabled={!storeForm.storeName.trim() || isSaving}
                className="px-6 py-2 bg-gradient-to-r from-whatsapp-primary to-whatsapp-secondary text-white rounded-lg font-medium hover:shadow-lg transition order-1 sm:order-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? 'Criando...' : 'Criar Loja'}
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
                  value={storeForm.storeName}
                  onChange={(e) => setStoreForm({ ...storeForm, storeName: e.target.value })}
                  placeholder="Ex: Minha Loja Virtual"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-whatsapp-primary focus:border-transparent outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  NIF (Número de Identificação Fiscal)
                </label>
                <input
                  type="text"
                  value={storeForm.nif}
                  onChange={(e) => setStoreForm({ ...storeForm, nif: e.target.value })}
                  placeholder="Ex: 123456789"
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
                disabled={isSaving}
                className="px-6 py-2 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition order-2 sm:order-1 disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleEditStore}
                disabled={!storeForm.storeName.trim() || isSaving}
                className="px-6 py-2 bg-gradient-to-r from-whatsapp-primary to-whatsapp-secondary text-white rounded-lg font-medium hover:shadow-lg transition order-1 sm:order-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? 'Salvando...' : 'Salvar Alterações'}
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
                  disabled={isSaving}
                  className="px-6 py-2 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition order-2 sm:order-1 disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDeleteStore}
                  disabled={isSaving}
                  className="px-6 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition order-1 sm:order-2 disabled:opacity-50"
                >
                  {isSaving ? 'Eliminando...' : 'Sim, Eliminar'}
                </button>
              </div>
            </div>
          </ModalContent>
        </ModalOverlay>
      )}

      {/* Modal: Notification (Success/Error) */}
      {showNotificationModal && (
        <ModalOverlay onClick={() => setShowNotificationModal(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()} className="max-w-md">
            <div className="text-center">
              <div className={`mx-auto flex items-center justify-center h-16 w-16 rounded-full mb-4 ${
                notificationData.type === 'success' ? 'bg-green-100' : 'bg-red-100'
              }`}>
                <span className="text-3xl">
                  {notificationData.type === 'success' ? '✅' : '❌'}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                {notificationData.type === 'success' ? 'Sucesso!' : 'Erro'}
              </h2>
              <p className="text-sm sm:text-base text-gray-600 mb-6">
                {notificationData.message}
              </p>

              <button
                onClick={() => setShowNotificationModal(false)}
                className={`px-6 py-2 text-white rounded-lg font-medium transition ${
                  notificationData.type === 'success' 
                    ? 'bg-green-500 hover:bg-green-600' 
                    : 'bg-red-500 hover:bg-red-600'
                }`}
              >
                OK
              </button>
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
