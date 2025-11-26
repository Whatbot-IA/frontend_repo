import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { resetPassword } from '../services/api'

function ResetPass() {
  const navigate = useNavigate()
  
  const [formData, setFormData] = useState({
    email: ''
  })

  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [apiError, setApiError] = useState('')
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear errors when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
    if (apiError) {
      setApiError('')
    }
  }

  const validateForm = () => {
    const newErrors = {}

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return

    try {
      setIsLoading(true)
      setApiError('')
      
      const result = await resetPassword(formData.email)
      
      if (result.success) {
        // Mostrar modal de sucesso
        setShowSuccessModal(true)
      } else {
        // Tratar erros da API
        if (result.error.status === 404) {
          setApiError('Email não encontrado. Verifique e tente novamente.')
        } else {
          setApiError(result.error.message || 'Erro ao enviar email de recuperação')
        }
      }
    } catch (error) {
      setApiError('Não foi possível conectar ao servidor. Verifique sua conexão.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div 
      className="h-screen overflow-hidden flex items-center justify-center px-4 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.9), rgba(255,255,255,0.9)), url('/fundo.png')" }}
    >
      <div className="max-w-md w-full max-h-[95vh] overflow-y-auto">
        {/* Logo */}
        <div className="text-center mb-6">
          <Link to="/" className="inline-block">
            <img src="/logo.png" alt="Whatbot Logo" className="w-16 h-16 mx-auto mb-3" />
          </Link>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
            Recuperar Senha
          </h1>
          <p className="text-gray-600">
            Digite seu email para receber instruções
          </p>
        </div>

        {/* Form */}
        <div className="bg-gray-50 border-2 border-black rounded-2xl shadow-2xl p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Error Banner */}
            {apiError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {apiError}
              </div>
            )}
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1.5">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={isLoading}
                className={`w-full px-4 py-2.5 rounded-lg border-2 transition-colors ${
                  errors.email 
                    ? 'border-red-500 focus:border-red-500' 
                    : 'border-gray-200 focus:border-whatsapp-primary'
                } focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed`}
                placeholder="joao@exemplo.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-whatsapp-primary to-whatsapp-secondary text-white py-2.5 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Enviando...
                </>
              ) : (
                'Enviar'
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-4 text-center">
            <p className="text-gray-600 text-sm">
              Lembrou sua senha?{' '}
              <Link to="/login" className="text-whatsapp-primary font-semibold hover:text-whatsapp-secondary transition">
                Fazer Login
              </Link>
            </p>
          </div>
        </div>

        {/* Back to Home */}
        <div className="mt-4 text-center">
          <Link to="/" className="text-gray-600 hover:text-gray-900 transition text-sm">
            ← Voltar para o início
          </Link>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 animate-fade-in">
            <div className="text-center">
              {/* Success Icon */}
              <div className="mb-6">
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>

              {/* Title */}
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Email Enviado com Sucesso!
              </h2>

              {/* Message */}
              <div className="mb-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <div className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-blue-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <div className="flex-1 text-left">
                      <p className="text-gray-700 text-sm">
                        Enviamos um email para <strong className="text-gray-900">{formData.email}</strong> com sua nova senha.
                      </p>
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 text-sm">
                  Verifique sua caixa de entrada e use a nova senha para fazer login.
                </p>
                <p className="text-gray-500 text-xs mt-2">
                  Não esqueça de verificar a pasta de spam.
                </p>
              </div>

              {/* Button */}
              <button
                onClick={() => navigate('/signin')}
                className="w-full bg-gradient-to-r from-whatsapp-primary to-whatsapp-secondary text-white py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
              >
                Ir para Login
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ResetPass
