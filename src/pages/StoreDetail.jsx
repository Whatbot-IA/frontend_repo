import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import styled from 'styled-components'

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
    imageUrl: ''
  })

  // Dados de exemplo (posteriormente virão da API)
  const store = {
    id: storeId,
    name: 'Loja Principal',
    description: 'Produtos gerais e eletrônicos'
  }

  const [categories, setCategories] = useState([
    { id: 'cat-001', name: 'Eletrônicos' },
    { id: 'cat-002', name: 'Roupas' },
    { id: 'cat-003', name: 'Calçados' },
    { id: 'cat-004', name: 'Acessórios' }
  ])

  const [products, setProducts] = useState([
    {
      id: 'prod-001',
      name: 'Smartphone Galaxy X',
      description: 'Smartphone com 128GB de memória',
      price: 250000,
      categoryId: 'cat-001',
      imageUrl: '/img-404.webp'
    },
    {
      id: 'prod-002',
      name: 'Camisa Polo',
      description: 'Camisa polo 100% algodão',
      price: 15000,
      categoryId: 'cat-002',
      imageUrl: '/img-404.webp'
    },
    {
      id: 'prod-003',
      name: 'Tênis Esportivo',
      description: 'Tênis para corrida',
      price: 35000,
      categoryId: 'cat-003',
      imageUrl: '/img-404.webp'
    }
  ])

  // Category Functions
  const handleAddCategory = () => {
    if (categoryForm.name.trim()) {
      const newCategory = {
        id: `cat-${Date.now()}`,
        name: categoryForm.name
      }
      setCategories([...categories, newCategory])
      setCategoryForm({ name: '' })
      setShowAddCategoryModal(false)
    }
  }

  const handleEditCategory = () => {
    if (categoryForm.name.trim()) {
      setCategories(categories.map(cat => 
        cat.id === selectedCategory.id ? { ...cat, name: categoryForm.name } : cat
      ))
      setShowEditCategoryModal(false)
      setSelectedCategory(null)
      setCategoryForm({ name: '' })
    }
  }

  const handleDeleteCategory = () => {
    setCategories(categories.filter(cat => cat.id !== selectedCategory.id))
    setShowDeleteCategoryModal(false)
    setSelectedCategory(null)
  }

  // Product Functions
  const handleAddProduct = () => {
    if (productForm.name.trim() && productForm.price && productForm.categoryId) {
      const newProduct = {
        id: `prod-${Date.now()}`,
        ...productForm,
        price: parseFloat(productForm.price)
      }
      setProducts([...products, newProduct])
      setProductForm({ name: '', description: '', price: '', categoryId: '', imageUrl: '' })
      setShowAddProductModal(false)
    }
  }

  const handleEditProduct = () => {
    if (productForm.name.trim() && productForm.price && productForm.categoryId) {
      setProducts(products.map(prod => 
        prod.id === selectedProduct.id 
          ? { ...prod, ...productForm, price: parseFloat(productForm.price) }
          : prod
      ))
      setShowEditProductModal(false)
      setSelectedProduct(null)
      setProductForm({ name: '', description: '', price: '', categoryId: '', imageUrl: '' })
    }
  }

  const handleDeleteProduct = () => {
    setProducts(products.filter(prod => prod.id !== selectedProduct.id))
    setShowDeleteProductModal(false)
    setSelectedProduct(null)
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
          
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
            {store.name}
          </h1>
          <p className="text-gray-600">{store.description}</p>
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

            {categories.length === 0 && (
              <div className="text-center py-12 bg-white rounded-xl">
                <p className="text-gray-500 mb-4">Nenhuma categoria criada</p>
                <button
                  onClick={() => setShowAddCategoryModal(true)}
                  className="text-whatsapp-primary font-semibold hover:underline"
                >
                  Criar primeira categoria
                </button>
              </div>
            )}
          </div>
        )}

        {/* Products Tab */}
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

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id}>
                  <div 
                    className="card-img cursor-pointer"
                    onClick={() => {
                      setSelectedImage(product.imageUrl)
                      setShowImageModal(true)
                    }}
                  >
                    <img src={product.imageUrl} alt={product.name} className="img" />
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
                            description: product.description,
                            price: product.price.toString(),
                            categoryId: product.categoryId,
                            imageUrl: product.imageUrl
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
              ))}
            </div>

            {products.length === 0 && (
              <div className="text-center py-12 bg-white rounded-xl">
                <p className="text-gray-500 mb-4">Nenhum produto criado</p>
                <button
                  onClick={() => setShowAddProductModal(true)}
                  className="text-whatsapp-primary font-semibold hover:underline"
                >
                  Criar primeiro produto
                </button>
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
                disabled={!categoryForm.name.trim()}
                className="px-6 py-2 bg-gradient-to-r from-whatsapp-primary to-whatsapp-secondary text-white rounded-lg font-medium hover:shadow-lg transition order-1 sm:order-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Criar Categoria
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
                disabled={!categoryForm.name.trim()}
                className="px-6 py-2 bg-gradient-to-r from-whatsapp-primary to-whatsapp-secondary text-white rounded-lg font-medium hover:shadow-lg transition order-1 sm:order-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Salvar Alterações
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
                  className="px-6 py-2 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition order-2 sm:order-1"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDeleteCategory}
                  className="px-6 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition order-1 sm:order-2"
                >
                  Sim, Eliminar
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
                  URL da Imagem
                </label>
                <input
                  type="text"
                  value={productForm.imageUrl}
                  onChange={(e) => setProductForm({ ...productForm, imageUrl: e.target.value })}
                  placeholder="https://exemplo.com/imagem.jpg"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-whatsapp-primary focus:border-transparent outline-none transition"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6">
              <button
                onClick={() => setShowAddProductModal(false)}
                className="px-6 py-2 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition order-2 sm:order-1"
              >
                Cancelar
              </button>
              <button
                onClick={handleAddProduct}
                disabled={!productForm.name.trim() || !productForm.price || !productForm.categoryId}
                className="px-6 py-2 bg-gradient-to-r from-whatsapp-primary to-whatsapp-secondary text-white rounded-lg font-medium hover:shadow-lg transition order-1 sm:order-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Criar Produto
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
                  URL da Imagem
                </label>
                <input
                  type="text"
                  value={productForm.imageUrl}
                  onChange={(e) => setProductForm({ ...productForm, imageUrl: e.target.value })}
                  placeholder="https://exemplo.com/imagem.jpg"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-whatsapp-primary focus:border-transparent outline-none transition"
                />
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
                disabled={!productForm.name.trim() || !productForm.price || !productForm.categoryId}
                className="px-6 py-2 bg-gradient-to-r from-whatsapp-primary to-whatsapp-secondary text-white rounded-lg font-medium hover:shadow-lg transition order-1 sm:order-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Salvar Alterações
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
                  className="px-6 py-2 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition order-2 sm:order-1"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDeleteProduct}
                  className="px-6 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition order-1 sm:order-2"
                >
                  Sim, Eliminar
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
