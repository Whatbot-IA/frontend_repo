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

// Interceptor para tratamento de erros e refresh token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        // Tentar renovar o token
        const refreshToken = localStorage.getItem('refreshToken')
        if (refreshToken) {
          const response = await axios.get('http://localhost:3000/auth/refresh', {
            headers: {
              Authorization: `Bearer ${refreshToken}`
            }
          })

          const { accessToken, refreshToken: newRefreshToken } = response.data
          localStorage.setItem('accessToken', accessToken)
          if (newRefreshToken) {
            localStorage.setItem('refreshToken', newRefreshToken)
          }

          // Retentar a requisição original
          originalRequest.headers.Authorization = `Bearer ${accessToken}`
          return api(originalRequest)
        }
      } catch (refreshError) {
        // Refresh token inválido ou expirado
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        window.location.href = '/signin'
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
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

/**
 * Renovar access token usando refresh token
 * @returns {Promise} Resposta da API
 */
export const refreshAccessToken = async () => {
  try {
    const refreshToken = localStorage.getItem('refreshToken')
    if (!refreshToken) {
      throw new Error('No refresh token available')
    }

    const response = await axios.get('http://localhost:3000/auth/refresh', {
      headers: {
        Authorization: `Bearer ${refreshToken}`
      }
    })

    // Salvar novos tokens
    if (response.data.accessToken) {
      localStorage.setItem('accessToken', response.data.accessToken)
    }
    if (response.data.refreshToken) {
      localStorage.setItem('refreshToken', response.data.refreshToken)
    }

    return { success: true, data: response.data }
  } catch (error) {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    return {
      success: false,
      error: {
        message: error.response?.data?.message || 'Erro ao renovar token'
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
 * @returns {Promise} Resposta da API
 */
export const updateUserProfile = async (userData) => {
  try {
    const response = await api.put('/users/profile', userData)
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
 * Alterar senha do usuário
 * @param {Object} passwords - Senhas
 * @param {string} passwords.currentPassword - Senha atual
 * @param {string} passwords.newPassword - Nova senha
 * @returns {Promise} Resposta da API
 */
export const changePassword = async (passwords) => {
  try {
    const response = await api.put('/users/change-password', passwords)
    return { success: true, data: response.data }
  } catch (error) {
    return {
      success: false,
      error: {
        message: error.response?.data?.message || 'Erro ao alterar senha'
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
