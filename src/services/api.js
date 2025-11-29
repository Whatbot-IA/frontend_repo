import axios from 'axios'

// Configuração base da API
const API_BASE_URL = 'http://localhost:3000'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Interceptor para adicionar token de autenticação (quando necessário)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Flag para evitar múltiplas tentativas de refresh simultâneas
let isRefreshing = false
let failedQueue = []

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  failedQueue = []
}

// Interceptor para tratamento de erros e refresh token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // Se não é erro 401 ou já tentamos retry, rejeitar
    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error)
    }

    // Se já está fazendo refresh, adicionar à fila
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject })
      }).then(token => {
        originalRequest.headers.Authorization = `Bearer ${token}`
        return api(originalRequest)
      }).catch(err => {
        return Promise.reject(err)
      })
    }

    originalRequest._retry = true
    isRefreshing = true

    const refreshToken = localStorage.getItem('refreshToken')
    
    // Se não há refresh token, redirecionar para login
    if (!refreshToken) {
      console.log('No refresh token available, redirecting to login')
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      window.location.href = '/signin'
      return Promise.reject(error)
    }

    try {
      console.log('Attempting to refresh token...')
      const response = await axios.get(`${API_BASE_URL}/auth/refresh`, {
        headers: {
          Authorization: `Bearer ${refreshToken}`
        }
      })

      const { accessToken, refreshToken: newRefreshToken } = response.data
      console.log('Token refreshed successfully')
      
      localStorage.setItem('accessToken', accessToken)
      if (newRefreshToken) {
        localStorage.setItem('refreshToken', newRefreshToken)
      }

      // Processar fila de requisições pendentes
      processQueue(null, accessToken)

      // Retentar a requisição original
      originalRequest.headers.Authorization = `Bearer ${accessToken}`
      return api(originalRequest)
    } catch (refreshError) {
      console.error('Failed to refresh token:', refreshError)
      // Processar fila com erro
      processQueue(refreshError, null)
      
      // Refresh token inválido ou expirado
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      window.location.href = '/signin'
      return Promise.reject(refreshError)
    } finally {
      isRefreshing = false
    }
  }
)

// ==================== AUTH ENDPOINTS ====================

/**
 * Criar nova conta de usuário
 * @param {Object} userData - Dados do usuário
 * @param {string} userData.full_name - Nome completo
 * @param {string} userData.email - Email
 * @param {string} userData.contact_phone - Telefone
 * @param {string} userData.password - Senha
 * @returns {Promise} Resposta da API
 */
export const createUser = async (userData) => {
  try {
    const response = await api.post('/users', userData)
    return { success: true, data: response.data }
  } catch (error) {
    return {
      success: false,
      error: {
        status: error.response?.status,
        statusCode: error.response?.data?.statusCode,
        message: error.response?.data?.message || 'Erro ao criar conta',
        data: error.response?.data
      }
    }
  }
}

/**
 * Fazer login
 * @param {Object} credentials - Credenciais
 * @param {string} credentials.email - Email
 * @param {string} credentials.password - Senha
 * @returns {Promise} Resposta da API
 */
export const login = async (credentials) => {
  try {
    const response = await api.post('/auth/login', credentials)
    
    // Salvar tokens se retornados
    if (response.data.accessToken) {
      localStorage.setItem('accessToken', response.data.accessToken)
    }
    if (response.data.refreshToken) {
      localStorage.setItem('refreshToken', response.data.refreshToken)
    }
    
    return { success: true, data: response.data }
  } catch (error) {
    return {
      success: false,
      error: {
        status: error.response?.status,
        statusCode: error.response?.data?.statusCode,
        message: error.response?.data?.message || 'Erro ao fazer login',
        data: error.response?.data
      }
    }
  }
}

/**
 * Fazer logout
 * @returns {Promise} Resposta da API
 */
export const logout = async () => {
  try {
    // O interceptor já adiciona o accessToken automaticamente no header
    const response = await api.post('/auth/logout')
    
    // Limpar tokens após sucesso
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    
    return { success: true, data: response.data }
  } catch (error) {
    // Mesmo com erro, limpar tokens localmente
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    
    return {
      success: false,
      error: {
        message: error.response?.data?.message || 'Erro ao fazer logout'
      }
    }
  }
}

/**
 * Renovar access token usando refresh token
 * @returns {Promise} Resposta da API com novo accessToken
 */
export const refreshAccessToken = async () => {
  try {
    const refreshToken = localStorage.getItem('refreshToken')
    if (!refreshToken) {
      return { success: false, error: { message: 'No refresh token available' } }
    }

    const response = await axios.get(`${API_BASE_URL}/auth/refresh`, {
      headers: {
        'Authorization': `Bearer ${refreshToken}`
      }
    })
    
    if (response.data.accessToken) {
      localStorage.setItem('accessToken', response.data.accessToken)
      if (response.data.refreshToken) {
        localStorage.setItem('refreshToken', response.data.refreshToken)
      }
      return { success: true, data: response.data }
    }
    
    return { success: false, error: { message: 'No access token in response' } }
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data || { message: error.message } 
    }
  }
}

/**
 * Recuperar senha
 * @param {string} email - Email do usuário
 * @returns {Promise} Resposta da API
 */
export const forgotPassword = async (email) => {
  try {
    const response = await api.post('/auth/forgot-password', { email })
    return { success: true, data: response.data }
  } catch (error) {
    return {
      success: false,
      error: {
        message: error.response?.data?.message || 'Erro ao recuperar senha'
      }
    }
  }
}

/**
 * Solicitar reset de senha (envia link com token por email)
 * @param {string} email - Email do usuário
 * @returns {Promise} Resposta da API
 */
export const resetPassword = async (email) => {
  try {
    const response = await api.post('/auth/reset-password', { email })
    return { success: true, data: response.data }
  } catch (error) {
    return {
      success: false,
      error: {
        message: error.response?.data?.message || 'Erro ao solicitar recuperação de senha',
        status: error.response?.status
      }
    }
  }
}

/**
 * Confirmar reset de senha com token
 * @param {Object} data - Dados para confirmação
 * @param {string} data.id - ID do usuário
 * @param {string} data.token - Token de recuperação
 * @param {string} data.newPassword - Nova senha
 * @returns {Promise} Resposta da API
 */
export const confirmResetPassword = async (data) => {
  try {
    const response = await api.post('/auth/reset-password-confirm', data)
    return { success: true, data: response.data }
  } catch (error) {
    return {
      success: false,
      error: {
        message: error.response?.data?.message || 'Erro ao redefinir senha',
        status: error.response?.status
      }
    }
  }
}

// ==================== DASHBOARD ENDPOINTS ====================

/**
 * Buscar estatísticas do dashboard
 * @returns {Promise} Resposta da API
 */
export const getDashboardStats = async () => {
  try {
    const response = await api.get('/dashboard/stats')
    return { success: true, data: response.data }
  } catch (error) {
    return {
      success: false,
      error: {
        message: error.response?.data?.message || 'Erro ao buscar estatísticas',
        status: error.response?.status
      }
    }
  }
}

// ==================== IA MODELS ENDPOINTS ====================

/**
 * Buscar modelos de IA disponíveis
 * @returns {Promise} Resposta da API
 */
export const getIAModels = async () => {
  try {
    const response = await api.get('/ia-models')
    return { success: true, data: response.data }
  } catch (error) {
    return {
      success: false,
      error: {
        message: error.response?.data?.message || 'Erro ao buscar modelos de IA',
        status: error.response?.status
      }
    }
  }
}

// ==================== SUBSCRIPTIONS ENDPOINTS ====================

/**
 * Buscar planos de assinatura disponíveis
 * @returns {Promise} Resposta da API
 */
export const getSubscriptions = async () => {
  try {
    const response = await api.get('/subscriptions')
    return { success: true, data: response.data }
  } catch (error) {
    return {
      success: false,
      error: {
        message: error.response?.data?.message || 'Erro ao buscar planos de assinatura',
        status: error.response?.status
      }
    }
  }
}

// ==================== STORES ENDPOINTS ====================

/**
 * Buscar lojas do usuário
 * @returns {Promise} Resposta da API
 */
export const getStores = async () => {
  try {
    const response = await api.get('/stores')
    return { success: true, data: response.data }
  } catch (error) {
    return {
      success: false,
      error: {
        message: error.response?.data?.message || 'Erro ao buscar lojas',
        status: error.response?.status
      }
    }
  }
}

/**
 * Buscar uma loja específica
 * @param {number} storeId - ID da loja
 * @returns {Promise} Resposta da API
 */
export const getStore = async (storeId) => {
  try {
    const response = await api.get(`/stores/${storeId}`)
    return { success: true, data: response.data }
  } catch (error) {
    return {
      success: false,
      error: {
        message: error.response?.data?.message || 'Erro ao buscar loja',
        status: error.response?.status
      }
    }
  }
}

/**
 * Criar uma nova loja
 * @param {Object} storeData - { store_name, description, nif }
 * @returns {Promise} Resposta da API
 */
export const createStore = async (storeData) => {
  try {
    const response = await api.post('/stores', storeData)
    return { success: true, data: response.data }
  } catch (error) {
    return {
      success: false,
      error: {
        message: error.response?.data?.message || 'Erro ao criar loja',
        status: error.response?.status
      }
    }
  }
}

/**
 * Atualizar uma loja
 * @param {number} storeId - ID da loja
 * @param {Object} storeData - { store_name, description, nif }
 * @returns {Promise} Resposta da API
 */
export const updateStore = async (storeId, storeData) => {
  try {
    const response = await api.patch(`/stores/${storeId}`, storeData)
    return { success: true, data: response.data }
  } catch (error) {
    return {
      success: false,
      error: {
        message: error.response?.data?.message || 'Erro ao atualizar loja',
        status: error.response?.status
      }
    }
  }
}

/**
 * Deletar uma loja
 * @param {number} storeId - ID da loja
 * @returns {Promise} Resposta da API
 */
export const deleteStore = async (storeId) => {
  try {
    const response = await api.delete(`/stores/${storeId}`)
    return { success: true, data: response.data }
  } catch (error) {
    return {
      success: false,
      error: {
        message: error.response?.data?.message || 'Erro ao deletar loja',
        status: error.response?.status
      }
    }
  }
}

// ==================== CATEGORIES ENDPOINTS ====================

/**
 * Buscar categorias (todas ou por loja)
 * @param {number} storeId - ID da loja (opcional)
 * @returns {Promise} Resposta da API
 */
export const getCategories = async (storeId = null) => {
  try {
    const url = storeId ? `/categories?storeId=${storeId}` : '/categories'
    const response = await api.get(url)
    return { success: true, data: response.data }
  } catch (error) {
    return {
      success: false,
      error: {
        message: error.response?.data?.message || 'Erro ao buscar categorias',
        status: error.response?.status
      }
    }
  }
}

/**
 * Buscar uma categoria específica
 * @param {number} categoryId - ID da categoria
 * @returns {Promise} Resposta da API
 */
export const getCategory = async (categoryId) => {
  try {
    const response = await api.get(`/categories/${categoryId}`)
    return { success: true, data: response.data }
  } catch (error) {
    return {
      success: false,
      error: {
        message: error.response?.data?.message || 'Erro ao buscar categoria',
        status: error.response?.status
      }
    }
  }
}

/**
 * Criar uma nova categoria
 * @param {Object} categoryData - { storeId, name }
 * @returns {Promise} Resposta da API
 */
export const createCategory = async (categoryData) => {
  try {
    const response = await api.post('/categories', categoryData)
    return { success: true, data: response.data }
  } catch (error) {
    return {
      success: false,
      error: {
        message: error.response?.data?.message || 'Erro ao criar categoria',
        status: error.response?.status
      }
    }
  }
}

/**
 * Atualizar uma categoria
 * @param {number} categoryId - ID da categoria
 * @param {Object} categoryData - { name }
 * @returns {Promise} Resposta da API
 */
export const updateCategory = async (categoryId, categoryData) => {
  try {
    const response = await api.patch(`/categories/${categoryId}`, categoryData)
    return { success: true, data: response.data }
  } catch (error) {
    return {
      success: false,
      error: {
        message: error.response?.data?.message || 'Erro ao atualizar categoria',
        status: error.response?.status
      }
    }
  }
}

/**
 * Deletar uma categoria
 * @param {number} categoryId - ID da categoria
 * @returns {Promise} Resposta da API
 */
export const deleteCategory = async (categoryId) => {
  try {
    const response = await api.delete(`/categories/${categoryId}`)
    return { success: true, data: response.data }
  } catch (error) {
    return {
      success: false,
      error: {
        message: error.response?.data?.message || 'Erro ao deletar categoria',
        status: error.response?.status
      }
    }
  }
}

// ==================== PRODUCTS ENDPOINTS ====================

/**
 * Buscar produtos com filtros opcionais
 * @param {Object} filters - Filtros opcionais { storeId, categoryId }
 * @returns {Promise} Resposta da API
 */
export const getProducts = async (filters = {}) => {
  try {
    const params = new URLSearchParams()
    if (filters.storeId) params.append('storeId', filters.storeId)
    if (filters.categoryId) params.append('categoryId', filters.categoryId)
    
    const url = params.toString() ? `/products?${params.toString()}` : '/products'
    const response = await api.get(url)
    return { success: true, data: response.data }
  } catch (error) {
    return {
      success: false,
      error: {
        message: error.response?.data?.message || 'Erro ao buscar produtos',
        status: error.response?.status
      }
    }
  }
}

/**
 * Buscar um produto específico
 * @param {number} productId - ID do produto
 * @returns {Promise} Resposta da API
 */
export const getProduct = async (productId) => {
  try {
    const response = await api.get(`/products/${productId}`)
    return { success: true, data: response.data }
  } catch (error) {
    return {
      success: false,
      error: {
        message: error.response?.data?.message || 'Erro ao buscar produto',
        status: error.response?.status
      }
    }
  }
}

/**
 * Criar um novo produto com upload de imagem
 * @param {FormData} formData - FormData com storeId, categoryId, name, description, price, image (opcional)
 * @returns {Promise} Resposta da API
 */
export const createProduct = async (formData) => {
  try {
    const response = await api.post('/products', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return { success: true, data: response.data }
  } catch (error) {
    return {
      success: false,
      error: {
        message: error.response?.data?.message || 'Erro ao criar produto',
        status: error.response?.status
      }
    }
  }
}

/**
 * Atualizar um produto com upload de imagem opcional
 * @param {number} productId - ID do produto
 * @param {FormData} formData - FormData com name, description, price, categoryId, image (opcional)
 * @returns {Promise} Resposta da API
 */
export const updateProduct = async (productId, formData) => {
  try {
    const response = await api.patch(`/products/${productId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return { success: true, data: response.data }
  } catch (error) {
    return {
      success: false,
      error: {
        message: error.response?.data?.message || 'Erro ao atualizar produto',
        status: error.response?.status
      }
    }
  }
}

/**
 * Deletar um produto
 * @param {number} productId - ID do produto
 * @returns {Promise} Resposta da API
 */
export const deleteProduct = async (productId) => {
  try {
    const response = await api.delete(`/products/${productId}`)
    return { success: true, data: response.data }
  } catch (error) {
    return {
      success: false,
      error: {
        message: error.response?.data?.message || 'Erro ao deletar produto',
        status: error.response?.status
      }
    }
  }
}

// ==================== USER ENDPOINTS ====================

/**
 * Obter perfil do usuário atual
 * @returns {Promise} Resposta da API
 */
export const getUserProfile = async () => {
  try {
    const response = await api.get('/users/profile')
    return { success: true, data: response.data }
  } catch (error) {
    return {
      success: false,
      error: {
        message: error.response?.data?.message || 'Erro ao buscar perfil'
      }
    }
  }
}

/**
 * Atualizar perfil do usuário
 * @param {Object} userData - Dados a atualizar
 * @param {string} [userData.full_name] - Nome completo (opcional)
 * @param {string} [userData.contact_phone] - Telefone (opcional)
 * @param {string} [userData.password] - Nova senha (opcional)
 * @returns {Promise} Resposta da API
 */
export const updateUserProfile = async (userData) => {
  try {
    const response = await api.patch('/users/profile', userData)
    return { success: true, data: response.data }
  } catch (error) {
    return {
      success: false,
      error: {
        message: error.response?.data?.message || 'Erro ao atualizar perfil'
      }
    }
  }
}

/**
 * Deletar conta do usuário
 * @returns {Promise} Resposta da API
 */
export const deleteUserAccount = async () => {
  try {
    const response = await api.delete('/users/account')
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    return { success: true, data: response.data }
  } catch (error) {
    return {
      success: false,
      error: {
        message: error.response?.data?.message || 'Erro ao deletar conta'
      }
    }
  }
}

// ==================== INSTANCES ENDPOINTS ====================

/**
 * Listar instâncias do usuário
 * @returns {Promise} Resposta da API
 */
export const getInstances = async () => {
  try {
    const response = await api.get('/instances')
    return { success: true, data: response.data }
  } catch (error) {
    return {
      success: false,
      error: {
        message: error.response?.data?.message || 'Erro ao buscar instâncias'
      }
    }
  }
}

/**
 * Criar nova instância
 * @param {Object} instanceData - Dados da instância
 * @returns {Promise} Resposta da API
 */
export const createInstance = async (instanceData) => {
  try {
    const response = await api.post('/instances', instanceData)
    return { success: true, data: response.data }
  } catch (error) {
    return {
      success: false,
      error: {
        message: error.response?.data?.message || 'Erro ao criar instância'
      }
    }
  }
}

/**
 * Deletar instância
 * @param {string} instanceId - ID da instância
 * @returns {Promise} Resposta da API
 */
export const deleteInstance = async (instanceId) => {
  try {
    const response = await api.delete(`/instances/${instanceId}`)
    return { success: true, data: response.data }
  } catch (error) {
    return {
      success: false,
      error: {
        message: error.response?.data?.message || 'Erro ao deletar instância'
      }
    }
  }
}

// ==================== WHATSAPP INSTANCES ENDPOINTS ====================

/**
 * Listar instâncias WhatsApp do usuário
 * @returns {Promise} Resposta da API com array de instâncias
 * Exemplo: [{ id, userId, sessionId, phoneNumber, name, status, createdAt }]
 */
export const getWhatsAppInstances = async () => {
  try {
    const response = await api.get('/whatsapp/instances')
    return { success: true, data: response.data }
  } catch (error) {
    return {
      success: false,
      error: {
        status: error.response?.status,
        statusCode: error.response?.data?.statusCode,
        message: error.response?.data?.message || 'Erro ao buscar instâncias WhatsApp',
        data: error.response?.data
      }
    }
  }
}

/**
 * Deletar/Desconectar instância WhatsApp
 * @param {string} sessionId - Session ID da instância WhatsApp
 * @returns {Promise} Resposta da API
 */
export const deleteWhatsAppInstance = async (sessionId) => {
  try {
    const response = await api.delete(`/whatsapp/instances/${sessionId}`)
    return { success: true, data: response.data }
  } catch (error) {
    return {
      success: false,
      error: {
        status: error.response?.status,
        statusCode: error.response?.data?.statusCode,
        message: error.response?.data?.message || 'Erro ao deletar instância WhatsApp',
        data: error.response?.data
      }
    }
  }
}

/**
 * Buscar configuração de uma instância
 * @param {string|number} instanceId - ID da instância
 * @returns {Promise} Resposta da API
 */
export const getInstanceConfig = async (instanceId) => {
  try {
    const response = await api.get(`/instances/${instanceId}/config`)
    return { success: true, data: response.data }
  } catch (error) {
    return {
      success: false,
      error: {
        status: error.response?.status,
        statusCode: error.response?.data?.statusCode,
        message: error.response?.data?.message || 'Erro ao buscar configuração da instância',
        data: error.response?.data
      }
    }
  }
}

/**
 * Atualizar configuração de uma instância
 * @param {string|number} instanceId - ID da instância
 * @param {Object} configData - Dados de configuração
 * @param {string} configData.promptSystem - Prompt do sistema
 * @param {number} configData.temperature - Temperature (0-1)
 * @param {number} configData.maxToken - Máximo de tokens
 * @param {boolean} configData.iaResponse - Ativar resposta IA
 * @param {number} configData.storeId - ID da loja
 * @returns {Promise} Resposta da API
 */
export const updateInstanceConfig = async (instanceId, configData) => {
  try {
    const response = await api.patch(`/instances/${instanceId}/config`, configData)
    return { success: true, data: response.data }
  } catch (error) {
    return {
      success: false,
      error: {
        status: error.response?.status,
        statusCode: error.response?.data?.statusCode,
        message: error.response?.data?.message || 'Erro ao atualizar configuração da instância',
        data: error.response?.data
      }
    }
  }
}

// ==================== CONTACTS ENDPOINTS ====================

/**
 * Listar contatos
 * @returns {Promise} Resposta da API
 */
export const getContacts = async () => {
  try {
    const response = await api.get('/contacts')
    return { success: true, data: response.data }
  } catch (error) {
    return {
      success: false,
      error: {
        message: error.response?.data?.message || 'Erro ao buscar contatos'
      }
    }
  }
}

/**
 * Criar novo contato
 * @param {Object} contactData - Dados do contato
 * @returns {Promise} Resposta da API
 */
export const createContact = async (contactData) => {
  try {
    const response = await api.post('/contacts', contactData)
    return { success: true, data: response.data }
  } catch (error) {
    return {
      success: false,
      error: {
        message: error.response?.data?.message || 'Erro ao criar contato'
      }
    }
  }
}

/**
 * Atualizar contato
 * @param {string} contactId - ID do contato
 * @param {Object} contactData - Dados do contato
 * @returns {Promise} Resposta da API
 */
export const updateContact = async (contactId, contactData) => {
  try {
    const response = await api.put(`/contacts/${contactId}`, contactData)
    return { success: true, data: response.data }
  } catch (error) {
    return {
      success: false,
      error: {
        message: error.response?.data?.message || 'Erro ao atualizar contato'
      }
    }
  }
}

/**
 * Deletar contato
 * @param {string} contactId - ID do contato
 * @returns {Promise} Resposta da API
 */
export const deleteContact = async (contactId) => {
  try {
    const response = await api.delete(`/contacts/${contactId}`)
    return { success: true, data: response.data }
  } catch (error) {
    return {
      success: false,
      error: {
        message: error.response?.data?.message || 'Erro ao deletar contato'
      }
    }
  }
}

// ==================== NOTIFICATIONS ENDPOINTS ====================

/**
 * Listar notificações
 * @returns {Promise} Resposta da API
 */
export const getNotifications = async () => {
  try {
    const response = await api.get('/notifications')
    return { success: true, data: response.data }
  } catch (error) {
    return {
      success: false,
      error: {
        message: error.response?.data?.message || 'Erro ao buscar notificações'
      }
    }
  }
}

/**
 * Marcar notificação como lida
 * @param {string} notificationId - ID da notificação
 * @returns {Promise} Resposta da API
 */
export const markNotificationAsRead = async (notificationId) => {
  try {
    const response = await api.put(`/notifications/${notificationId}/read`)
    return { success: true, data: response.data }
  } catch (error) {
    return {
      success: false,
      error: {
        message: error.response?.data?.message || 'Erro ao marcar notificação'
      }
    }
  }
}

/**
 * Marcar todas notificações como lidas
 * @returns {Promise} Resposta da API
 */
export const markAllNotificationsAsRead = async () => {
  try {
    const response = await api.put('/notifications/read-all')
    return { success: true, data: response.data }
  } catch (error) {
    return {
      success: false,
      error: {
        message: error.response?.data?.message || 'Erro ao marcar notificações'
      }
    }
  }
}

/**
 * Deletar notificação
 * @param {string} notificationId - ID da notificação
 * @returns {Promise} Resposta da API
 */
export const deleteNotification = async (notificationId) => {
  try {
    const response = await api.delete(`/notifications/${notificationId}`)
    return { success: true, data: response.data }
  } catch (error) {
    return {
      success: false,
      error: {
        message: error.response?.data?.message || 'Erro ao deletar notificação'
      }
    }
  }
}

export default api
