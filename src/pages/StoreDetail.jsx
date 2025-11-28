import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import styled from 'styled-components'
import { 
  getStore, 
  getCategories, 
  createCategory, 
  updateCategory, 
  deleteCategory,
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct 
} from '../services/api'

function StoreDetail() {
  const { storeId } = useParams()
  const navigate = useNavigate()
  
  const [activeTab, setActiveTab] = useState('categories') // 'categories' or 'products'
  
  // Modals States
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false)
  const [showEditCategoryModal, setShowEditCategoryModal] = useState(false)
  const [showDeleteCategoryModal, setShowDeleteCategoryModal] = useState(false)
  const [showAddProductModal, setShowAddProductModal] = useState(false)
  const [showEditProductModal, setShowEditProductModal] = useState(false)
  const [showDeleteProductModal, setShowDeleteProductModal] = useState(false)
  const [showImageModal, setShowImageModal] = useState(false)
  
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [selectedImage, setSelectedImage] = useState(null)
  
  const [categoryForm, setCategoryForm] = useState({ name: '' })
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    categoryId: '',
    imageFile: null,
    imagePreview: null
  })

  // API States
  const [store, setStore] = useState(null)
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingCategories, setLoadingCategories] = useState(false)
  const [loadingProducts, setLoadingProducts] = useState(false)
  const [error, setError] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  
  // Notification modal
  const [showNotificationModal, setShowNotificationModal] = useState(false)
  const [notificationData, setNotificationData] = useState({ type: '', message: '' })

  const [products, setProducts] = useState([])

  // Fetch store, categories and products on mount
  useEffect(() => {
    fetchStoreData()
    fetchCategories()
    fetchProducts()
  }, [storeId])

  const fetchStoreData = async () => {
    try {
      setLoading(true)
      const response = await getStore(storeId)
      if (response.success) {
        setStore(response.data)
      } else {
        setError(response.error?.message || 'Erro ao carregar loja')
      }
    } catch (err) {
      console.error('❌ Erro ao buscar loja:', err)
      setError('Erro ao conectar com o servidor')
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      setLoadingCategories(true)
      const response = await getCategories(storeId)
      if (response.success) {
        setCategories(response.data)
      } else {
        console.error('Erro ao carregar categorias:', response.error)
      }
    } catch (err) {
      console.error('❌ Erro ao buscar categorias:', err)
    } finally {
      setLoadingCategories(false)
    }
  }

  const fetchProducts = async () => {
    try {
      setLoadingProducts(true)
      const response = await getProducts({ storeId })
      if (response.success) {
        setProducts(response.data)
      } else {
        console.error('Erro ao carregar produtos:', response.error)
      }
    } catch (err) {
      console.error('❌ Erro ao buscar produtos:', err)
    } finally {
      setLoadingProducts(false)
    }
  }

  // Category Functions
  const handleAddCategory = async () => {
    if (!categoryForm.name.trim()) {
      setNotificationData({ type: 'error', message: 'Por favor, preencha o nome da categoria' })
      setShowNotificationModal(true)
      return
    }

    try {
      setIsSaving(true)
      const response = await createCategory({
        storeId: parseInt(storeId),
        name: categoryForm.name
      })

      if (response.success) {
        await fetchCategories()
        setShowAddCategoryModal(false)
        setCategoryForm({ name: '' })
        setNotificationData({ type: 'success', message: 'Categoria criada com sucesso!' })
        setShowNotificationModal(true)
      } else {
        setNotificationData({ type: 'error', message: response.error?.message || 'Erro ao criar categoria' })
        setShowNotificationModal(true)
      }
    } catch (err) {
      console.error('❌ Erro ao criar categoria:', err)
      setNotificationData({ type: 'error', message: 'Erro ao conectar com o servidor' })
      setShowNotificationModal(true)
    } finally {
      setIsSaving(false)
    }
  }

  const handleEditCategory = async () => {
    if (!categoryForm.name.trim()) {
      setNotificationData({ type: 'error', message: 'Por favor, preencha o nome da categoria' })
      setShowNotificationModal(true)
      return
    }

    try {
      setIsSaving(true)
      const response = await updateCategory(selectedCategory.id, {
        name: categoryForm.name
      })

      if (response.success) {
        await fetchCategories()
        setShowEditCategoryModal(false)
        setSelectedCategory(null)
        setCategoryForm({ name: '' })
        setNotificationData({ type: 'success', message: 'Categoria atualizada com sucesso!' })
        setShowNotificationModal(true)
      } else {
        setNotificationData({ type: 'error', message: response.error?.message || 'Erro ao atualizar categoria' })
        setShowNotificationModal(true)
      }
    } catch (err) {
      console.error('❌ Erro ao atualizar categoria:', err)
      setNotificationData({ type: 'error', message: 'Erro ao conectar com o servidor' })
      setShowNotificationModal(true)
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteCategory = async () => {
    try {
      setIsSaving(true)
      const response = await deleteCategory(selectedCategory.id)

      if (response.success) {
        await fetchCategories()
        setShowDeleteCategoryModal(false)
        setSelectedCategory(null)
        setNotificationData({ type: 'success', message: 'Categoria eliminada com sucesso!' })
        setShowNotificationModal(true)
      } else {
        setNotificationData({ type: 'error', message: response.error?.message || 'Erro ao eliminar categoria' })
        setShowNotificationModal(true)
      }
    } catch (err) {
      console.error('❌ Erro ao eliminar categoria:', err)
      setNotificationData({ type: 'error', message: 'Erro ao conectar com o servidor' })
      setShowNotificationModal(true)
    } finally {
      setIsSaving(false)
    }
  }

  // Product Functions
  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setProductForm({
        ...productForm,
        imageFile: file,
        imagePreview: URL.createObjectURL(file)
      })
    }
  }

  const handleAddProduct = async () => {
    if (!productForm.name.trim() || !productForm.description.trim() || !productForm.price || !productForm.categoryId) {
      setNotificationData({ type: 'error', message: 'Por favor, preencha todos os campos obrigatórios' })
      setShowNotificationModal(true)
      return
    }

    try {
      setIsSaving(true)
      
      const formData = new FormData()
      formData.append('storeId', storeId)
      formData.append('categoryId', productForm.categoryId)
      formData.append('name', productForm.name)
      formData.append('description', productForm.description)
      formData.append('price', productForm.price)
      
      if (productForm.imageFile) {
        formData.append('image', productForm.imageFile)
      }

      const response = await createProduct(formData)

      if (response.success) {
        await fetchProducts()
        setShowAddProductModal(false)
        setProductForm({ name: '', description: '', price: '', categoryId: '', imageFile: null, imagePreview: null })
        setNotificationData({ type: 'success', message: 'Produto criado com sucesso!' })
        setShowNotificationModal(true)
      } else {
        setNotificationData({ type: 'error', message: response.error?.message || 'Erro ao criar produto' })
        setShowNotificationModal(true)
      }
    } catch (err) {
      console.error('❌ Erro ao criar produto:', err)
      setNotificationData({ type: 'error', message: 'Erro ao conectar com o servidor' })
      setShowNotificationModal(true)
    } finally {
      setIsSaving(false)
    }
  }

  const handleEditProduct = async () => {
    if (!productForm.name.trim() || !productForm.price || !productForm.categoryId) {
      setNotificationData({ type: 'error', message: 'Por favor, preencha todos os campos obrigatórios' })
      setShowNotificationModal(true)
      return
    }

    try {
      setIsSaving(true)
      
      const formData = new FormData()
      formData.append('name', productForm.name)
      formData.append('description', productForm.description)
      formData.append('price', productForm.price)
      formData.append('categoryId', productForm.categoryId)
      
      if (productForm.imageFile) {
        formData.append('image', productForm.imageFile)
      }

      const response = await updateProduct(selectedProduct.id, formData)

      if (response.success) {
        await fetchProducts()
        setShowEditProductModal(false)
        setSelectedProduct(null)
        setProductForm({ name: '', description: '', price: '', categoryId: '', imageFile: null, imagePreview: null })
        setNotificationData({ type: 'success', message: 'Produto atualizado com sucesso!' })
        setShowNotificationModal(true)
      } else {
        setNotificationData({ type: 'error', message: response.error?.message || 'Erro ao atualizar produto' })
        setShowNotificationModal(true)
      }
    } catch (err) {
      console.error('❌ Erro ao atualizar produto:', err)
      setNotificationData({ type: 'error', message: 'Erro ao conectar com o servidor' })
      setShowNotificationModal(true)
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteProduct = async () => {
    try {
      setIsSaving(true)
      const response = await deleteProduct(selectedProduct.id)

      if (response.success) {
        await fetchProducts()
        setShowDeleteProductModal(false)
        setSelectedProduct(null)
        setNotificationData({ type: 'success', message: 'Produto eliminado com sucesso!' })
        setShowNotificationModal(true)
      } else {
        setNotificationData({ type: 'error', message: response.error?.message || 'Erro ao eliminar produto' })
        setShowNotificationModal(true)
      }
    } catch (err) {
      console.error('❌ Erro ao eliminar produto:', err)
      setNotificationData({ type: 'error', message: 'Erro ao conectar com o servidor' })
      setShowNotificationModal(true)
    } finally {
      setIsSaving(false)
    }
  }

  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId)
    return category ? category.name : 'Sem categoria'
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-AO', {
      style: 'currency',
      currency: 'AOA'
    }).format(price)
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 p-8 pt-20 lg:pt-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/stores')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition"
          >
            <span>←</span>
            <span>Voltar para Lojas</span>
          </button>
          
          {loading ? (
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-whatsapp-primary"></div>
              <span className="text-gray-600">Carregando...</span>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-600">{error}</p>
            </div>
          ) : store ? (
            <>
              <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
                {store.storeName || store.name}
              </h1>
              <p className="text-gray-600">{store.description}</p>
            </>
          ) : null}
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-lg mb-6">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('categories')}
              className={`flex-1 px-6 py-4 font-semibold transition ${
                activeTab === 'categories'
                  ? 'text-whatsapp-primary border-b-2 border-whatsapp-primary'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Categorias ({categories.length})
            </button>
            <button
              onClick={() => setActiveTab('products')}
              className={`flex-1 px-6 py-4 font-semibold transition ${
                activeTab === 'products'
                  ? 'text-whatsapp-primary border-b-2 border-whatsapp-primary'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Produtos ({products.length})
            </button>
          </div>
        </div>

        {/* Categories Tab */}
        {activeTab === 'categories' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Categorias</h2>
              <button
                onClick={() => setShowAddCategoryModal(true)}
                className="bg-gradient-to-r from-whatsapp-primary to-whatsapp-secondary text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center gap-2"
              >
                <span className="text-xl">+</span>
                Nova Categoria
              </button>
            </div>

            {loadingCategories ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-whatsapp-primary"></div>
              </div>
            ) : categories.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl">
                <p className="text-gray-500 mb-4">Nenhuma categoria criada</p>
                <button
                  onClick={() => setShowAddCategoryModal(true)}
                  className="text-whatsapp-primary font-semibold hover:underline"
                >
                  Criar primeira categoria
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map((category) => (
                <div
                  key={category.id}
                  className="bg-white rounded-xl shadow p-4 hover:shadow-lg transition flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <img src="/icon/cat-menu.png" alt="Category" className="w-6 h-6" />
                    </div>
                    <span className="font-semibold text-gray-900">{category.name}</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setSelectedCategory(category)
                        setCategoryForm({ name: category.name })
                        setShowEditCategoryModal(true)
                      }}
                      className="text-blue-500 hover:text-blue-700 p-2 hover:bg-blue-50 rounded-lg transition"
                    >
                      <img src="/icon/setting.png" alt="Edit" className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedCategory(category)
                        setShowDeleteCategoryModal(true)
                      }}
                      className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition"
                    >
                      <img src="/icon/delete_black.png" alt="Delete" className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                ))}
              </div>
            )}
          </div>
        )}        {/* Products Tab */}
        {activeTab === 'products' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Produtos</h2>
              <button
                onClick={() => setShowAddProductModal(true)}
                className="bg-gradient-to-r from-whatsapp-primary to-whatsapp-secondary text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center gap-2"
              >
                <span className="text-xl">+</span>
                Novo Produto
              </button>
            </div>

            {loadingProducts ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-whatsapp-primary"></div>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl">
                <p className="text-gray-500 mb-4">Nenhum produto criado</p>
                <button
                  onClick={() => setShowAddProductModal(true)}
                  className="text-whatsapp-primary font-semibold hover:underline"
                >
                  Criar primeiro produto
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map((product) => {
                  // Monta URL completa da imagem (adiciona base URL se for caminho relativo)
                  const getImageUrl = (url) => {
                    if (!url) return '/img-404.webp'
                    if (url.startsWith('http')) return url
                    return `http://localhost:3000${url}`
                  }
                  const productImage = getImageUrl(product.imageUrl)
                  
                  return (
                  <ProductCard key={product.id}>
                    <div 
                      className="card-img cursor-pointer"
                      onClick={() => {
                        if (productImage) {
                          setSelectedImage(productImage)
                          setShowImageModal(true)
                        }
                      }}
                    >
                      <img src={productImage} alt={product.name} className="img" />
                    </div>
                    <div className="card-title">{product.name}</div>
                    <div className="card-subtitle">{product.description}</div>
                    <hr className="card-divider" />
                    <div className="card-footer">
                      <div className="card-price">
                        {formatPrice(product.price)}
                      </div>
                      <div className="card-actions">
                        <button
                          onClick={() => {
                            setSelectedProduct(product)
                            setProductForm({
                              name: product.name,
                              description: product.description || '',
                              price: product.price?.toString() || '',
                              categoryId: product.categoryId?.toString() || '',
                              imageFile: null,
                              imagePreview: null,
                              imageUrl: productImage
                            })
                            setShowEditProductModal(true)
                          }}
                          className="action-btn"
                          title="Editar"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => {
                            setSelectedProduct(product)
                            setShowDeleteProductModal(true)
                          }}
                          className="action-btn delete"
                          title="Eliminar"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <div className="card-category">
                      {getCategoryName(product.categoryId)}
                    </div>
                  </ProductCard>
                  )
                })}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Modal: Add Category */}
      {showAddCategoryModal && (
        <ModalOverlay onClick={() => setShowAddCategoryModal(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()} className="max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Nova Categoria</h2>
              <button
                onClick={() => setShowAddCategoryModal(false)}
                className="text-gray-400 hover:text-gray-600 text-3xl leading-none"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nome da Categoria *
                </label>
                <input
                  type="text"
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm({ name: e.target.value })}
                  placeholder="Ex: Eletrônicos"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-whatsapp-primary focus:border-transparent outline-none transition"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6">
              <button
                onClick={() => setShowAddCategoryModal(false)}
                className="px-6 py-2 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition order-2 sm:order-1"
              >
                Cancelar
              </button>
              <button
                onClick={handleAddCategory}
                disabled={!categoryForm.name.trim() || isSaving}
                className="px-6 py-2 bg-gradient-to-r from-whatsapp-primary to-whatsapp-secondary text-white rounded-lg font-medium hover:shadow-lg transition order-1 sm:order-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? 'Criando...' : 'Criar Categoria'}
              </button>
            </div>
          </ModalContent>
        </ModalOverlay>
      )}

      {/* Modal: Edit Category */}
      {showEditCategoryModal && selectedCategory && (
        <ModalOverlay onClick={() => setShowEditCategoryModal(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()} className="max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Editar Categoria</h2>
              <button
                onClick={() => setShowEditCategoryModal(false)}
                className="text-gray-400 hover:text-gray-600 text-3xl leading-none"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nome da Categoria *
                </label>
                <input
                  type="text"
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm({ name: e.target.value })}
                  placeholder="Ex: Eletrônicos"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-whatsapp-primary focus:border-transparent outline-none transition"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6">
              <button
                onClick={() => setShowEditCategoryModal(false)}
                className="px-6 py-2 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition order-2 sm:order-1"
              >
                Cancelar
              </button>
              <button
                onClick={handleEditCategory}
                disabled={!categoryForm.name.trim() || isSaving}
                className="px-6 py-2 bg-gradient-to-r from-whatsapp-primary to-whatsapp-secondary text-white rounded-lg font-medium hover:shadow-lg transition order-1 sm:order-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? 'Salvando...' : 'Salvar Alterações'}
              </button>
            </div>
          </ModalContent>
        </ModalOverlay>
      )}

      {/* Modal: Delete Category */}
      {showDeleteCategoryModal && selectedCategory && (
        <ModalOverlay onClick={() => setShowDeleteCategoryModal(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()} className="max-w-md">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
                <span className="text-3xl">⚠️</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                Eliminar Categoria?
              </h2>
              <p className="text-sm sm:text-base text-gray-600 mb-6">
                Tem certeza que deseja eliminar a categoria <strong>"{selectedCategory.name}"</strong>?
              </p>

              <div className="flex flex-col sm:flex-row justify-center gap-3">
                <button
                  onClick={() => setShowDeleteCategoryModal(false)}
                  disabled={isSaving}
                  className="px-6 py-2 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition order-2 sm:order-1 disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDeleteCategory}
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

      {/* Modal: Add Product */}
      {showAddProductModal && (
        <ModalOverlay onClick={() => setShowAddProductModal(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Novo Produto</h2>
              <button
                onClick={() => setShowAddProductModal(false)}
                className="text-gray-400 hover:text-gray-600 text-3xl leading-none"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nome do Produto *
                </label>
                <input
                  type="text"
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  placeholder="Ex: Smartphone Galaxy X"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-whatsapp-primary focus:border-transparent outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Descrição *
                </label>
                <textarea
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  placeholder="Descrição do produto..."
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-whatsapp-primary focus:border-transparent outline-none transition resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Preço (AOA) *
                </label>
                <input
                  type="number"
                  value={productForm.price}
                  onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-whatsapp-primary focus:border-transparent outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Categoria *
                </label>
                <select
                  value={productForm.categoryId}
                  onChange={(e) => setProductForm({ ...productForm, categoryId: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-whatsapp-primary focus:border-transparent outline-none transition"
                >
                  <option value="">Selecione uma categoria</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Imagem do Produto (opcional)
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-whatsapp-primary transition cursor-pointer relative">
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,image/webp"
                    onChange={handleImageChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  {productForm.imagePreview ? (
                    <div className="relative">
                      <img 
                        src={productForm.imagePreview} 
                        alt="Preview" 
                        className="max-h-40 mx-auto rounded-lg object-cover"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          setProductForm({ ...productForm, imageFile: null, imagePreview: null })
                        }}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 z-20"
                      >
                        ×
                      </button>
                    </div>
                  ) : (
                    <div className="py-4 pointer-events-none">
                      <div className="text-4xl mb-2">📷</div>
                      <p className="text-gray-600 text-sm">Clique para selecionar uma imagem</p>
                      <p className="text-gray-400 text-xs mt-1">PNG, JPG ou WEBP (máx. 5MB)</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setShowAddProductModal(false)
                  setProductForm({ name: '', description: '', price: '', categoryId: '', imageFile: null, imagePreview: null })
                }}
                disabled={isSaving}
                className="px-6 py-2 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition order-2 sm:order-1 disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleAddProduct}
                disabled={!productForm.name.trim() || !productForm.description.trim() || !productForm.price || !productForm.categoryId || isSaving}
                className="px-6 py-2 bg-gradient-to-r from-whatsapp-primary to-whatsapp-secondary text-white rounded-lg font-medium hover:shadow-lg transition order-1 sm:order-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? 'Criando...' : 'Criar Produto'}
              </button>
            </div>
          </ModalContent>
        </ModalOverlay>
      )}

      {/* Modal: Edit Product */}
      {showEditProductModal && selectedProduct && (
        <ModalOverlay onClick={() => setShowEditProductModal(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Editar Produto</h2>
              <button
                onClick={() => setShowEditProductModal(false)}
                className="text-gray-400 hover:text-gray-600 text-3xl leading-none"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nome do Produto *
                </label>
                <input
                  type="text"
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  placeholder="Ex: Smartphone Galaxy X"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-whatsapp-primary focus:border-transparent outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Descrição
                </label>
                <textarea
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  placeholder="Descrição do produto..."
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-whatsapp-primary focus:border-transparent outline-none transition resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Preço (AOA) *
                </label>
                <input
                  type="number"
                  value={productForm.price}
                  onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-whatsapp-primary focus:border-transparent outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Categoria *
                </label>
                <select
                  value={productForm.categoryId}
                  onChange={(e) => setProductForm({ ...productForm, categoryId: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-whatsapp-primary focus:border-transparent outline-none transition"
                >
                  <option value="">Selecione uma categoria</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Imagem do Produto (opcional)
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-whatsapp-primary transition cursor-pointer relative">
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,image/webp"
                    onChange={handleImageChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  {productForm.imagePreview ? (
                    <div className="relative">
                      <img 
                        src={productForm.imagePreview} 
                        alt="Preview" 
                        className="max-h-40 mx-auto rounded-lg object-cover"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          setProductForm({ ...productForm, imageFile: null, imagePreview: null })
                        }}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 z-20"
                      >
                        ×
                      </button>
                    </div>
                  ) : productForm.imageUrl ? (
                    <div className="relative">
                      <img 
                        src={productForm.imageUrl} 
                        alt="Imagem atual" 
                        className="max-h-40 mx-auto rounded-lg object-cover"
                      />
                      <p className="text-gray-500 text-xs mt-2">Clique para alterar a imagem</p>
                    </div>
                  ) : (
                    <div className="py-4 pointer-events-none">
                      <div className="text-4xl mb-2">📷</div>
                      <p className="text-gray-600 text-sm">Clique para selecionar uma imagem</p>
                      <p className="text-gray-400 text-xs mt-1">PNG, JPG ou WEBP (máx. 5MB)</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6">
              <button
                onClick={() => setShowEditProductModal(false)}
                className="px-6 py-2 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition order-2 sm:order-1"
              >
                Cancelar
              </button>
              <button
                onClick={handleEditProduct}
                disabled={!productForm.name.trim() || !productForm.price || !productForm.categoryId || isSaving}
                className="px-6 py-2 bg-gradient-to-r from-whatsapp-primary to-whatsapp-secondary text-white rounded-lg font-medium hover:shadow-lg transition order-1 sm:order-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? 'Salvando...' : 'Salvar Alterações'}
              </button>
            </div>
          </ModalContent>
        </ModalOverlay>
      )}

      {/* Modal: Delete Product */}
      {showDeleteProductModal && selectedProduct && (
        <ModalOverlay onClick={() => setShowDeleteProductModal(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()} className="max-w-md">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
                <span className="text-3xl">⚠️</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                Eliminar Produto?
              </h2>
              <p className="text-sm sm:text-base text-gray-600 mb-6">
                Tem certeza que deseja eliminar o produto <strong>"{selectedProduct.name}"</strong>?
              </p>

              <div className="flex flex-col sm:flex-row justify-center gap-3">
                <button
                  onClick={() => setShowDeleteProductModal(false)}
                  disabled={isSaving}
                  className="px-6 py-2 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition order-2 sm:order-1 disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDeleteProduct}
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

      {/* Modal: Image Preview */}
      {showImageModal && selectedImage && (
        <ModalOverlay onClick={() => setShowImageModal(false)}>
          <div 
            onClick={(e) => e.stopPropagation()} 
            className="relative max-w-4xl w-full mx-auto p-4"
          >
           
            <div className="bg-white rounded-xl overflow-hidden shadow-2xl">
              <img
                src={selectedImage}
                alt="Preview"
                className="w-full h-auto max-h-[80vh] object-contain"
              />
            </div>
          </div>
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

// Styled Component for Product Card
const ProductCard = styled.div`
  --font-color: #323232;
  --font-color-sub: #666;
  --bg-color: #fff;
  --main-color: #25D366;
  --main-focus: #128C7E;
  
  width: 100%;
  max-width: 280px;
  margin: 0 auto;
  background: var(--bg-color);
  border: 2px solid var(--main-color);
  box-shadow: 4px 4px var(--main-color);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding: 20px;
  gap: 10px;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  transition: all 0.3s;
  position: relative;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 6px 6px var(--main-color);
  }

  .card-img {
    transition: all 0.5s;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 140px;
    overflow: hidden;
    border-radius: 5px;
    background: #f5f5f5;
    margin-bottom: 5px;

    &:hover {
      transform: scale(1.05);
    }

    .img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 5px;
    }
  }

  .card-title {
    font-size: 18px;
    font-weight: 600;
    text-align: center;
    color: var(--font-color);
    line-height: 1.3;
    min-height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .card-subtitle {
    font-size: 13px;
    font-weight: 400;
    color: var(--font-color-sub);
    text-align: center;
    line-height: 1.4;
    min-height: 55px;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .card-divider {
    width: 100%;
    border: 1px solid var(--main-color);
    border-radius: 50px;
    margin: 5px 0;
  }

  .card-footer {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-top: auto;
  }

  .card-price {
    font-size: 22px;
    font-weight: 600;
    color: var(--main-color);
  }

  .card-actions {
    display: flex;
    gap: 8px;
  }

  .action-btn {
    height: 35px;
    width: 35px;
    background: var(--bg-color);
    border: 2px solid var(--main-color);
    border-radius: 5px;
    padding: 6px;
    transition: all 0.3s;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;

    svg {
      width: 100%;
      height: 100%;
      stroke: var(--main-color);
      transition: all 0.3s;
    }

    &:hover {
      border: 2px solid var(--main-focus);
      
      svg {
        stroke: var(--main-focus);
      }
    }

    &.delete:hover {
      border: 2px solid #dc2626;
      
      svg {
        stroke: #dc2626;
      }
    }

    &:active {
      transform: translateY(2px);
    }
  }

  .card-category {
    position: absolute;
    top: 15px;
    right: 15px;
    background: var(--main-color);
    color: white;
    font-size: 11px;
    font-weight: 600;
    padding: 4px 10px;
    border-radius: 12px;
    box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
  }
`

export default StoreDetail
