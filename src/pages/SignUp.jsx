import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { createUser } from '../services/api'

function SignUp() {
  const navigate = useNavigate()
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  })

  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [apiError, setApiError] = useState('')
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    // Full Name validation
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Nome completo é obrigatório'
    } else if (formData.fullName.trim().length < 3) {
      newErrors.fullName = 'Nome deve ter pelo menos 3 caracteres'
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido'
    }

    // Phone validation
    if (!formData.phone.trim()) {
      newErrors.phone = 'Telefone é obrigatório'
    } else if (!/^\+?[\d\s()-]{9,}$/.test(formData.phone)) {
      newErrors.phone = 'Telefone inválido'
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Senha é obrigatória'
    } else if (formData.password.length < 8) {
      newErrors.password = 'Senha deve ter pelo menos 8 caracteres'
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Senha deve conter maiúsculas, minúsculas e números'
    }

    // Confirm Password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirmação de senha é obrigatória'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'As senhas não coincidem'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (validateForm()) {
      setIsLoading(true)
      setApiError('')
      
      const result = await createUser({
        full_name: formData.fullName,
        email: formData.email,
        contact_phone: formData.phone,
        password: formData.password
      })

      if (result.success) {
        // Sucesso - mostrar modal
        setIsLoading(false)
        setShowSuccessModal(true)
      } else {
        setIsLoading(false)
        
        const { statusCode, message } = result.error
        
        if (statusCode === 409) {
          // Email já existe
          setErrors(prev => ({
            ...prev,
            email: 'Este email já está cadastrado'
          }))
          setApiError('Email já está cadastrado. Tente fazer login.')
        } else if (statusCode === 400) {
          // Erro de validação
          setApiError(message || 'Dados inválidos. Verifique os campos.')
        } else if (!result.error.status) {
          // Erro de conexão
          setApiError('Não foi possível conectar ao servidor. Verifique sua conexão.')
        } else {
          setApiError(message || 'Erro ao criar conta. Tente novamente.')
        }
      }
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
            Criar Conta
          </h1>
          <p className="text-gray-600">
            Comece a automatizar suas vendas agora
          </p>
        </div>

        {/* Form */}
        <div className="bg-gray-50 border-2 border-black rounded-2xl shadow-2xl p-6">
          {/* API Error Message */}
          {apiError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600 font-semibold">{apiError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label htmlFor="fullName" className="block text-sm font-semibold text-gray-700 mb-1.5">
                Nome Completo
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 rounded-lg border-2 transition-colors ${
                  errors.fullName 
                    ? 'border-red-500 focus:border-red-500' 
                    : 'border-gray-200 focus:border-whatsapp-primary'
                } focus:outline-none`}
                placeholder="João Silva"
              />
              {errors.fullName && (
                <p className="mt-1 text-sm text-red-500">{errors.fullName}</p>
              )}
            </div>

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
                className={`w-full px-4 py-2.5 rounded-lg border-2 transition-colors ${
                  errors.email 
                    ? 'border-red-500 focus:border-red-500' 
                    : 'border-gray-200 focus:border-whatsapp-primary'
                } focus:outline-none`}
                placeholder="joao@exemplo.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-1.5">
                Telefone
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 rounded-lg border-2 transition-colors ${
                  errors.phone 
                    ? 'border-red-500 focus:border-red-500' 
                    : 'border-gray-200 focus:border-whatsapp-primary'
                } focus:outline-none`}
                placeholder="+244 900 000 000"
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-1.5">
                Senha
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 rounded-lg border-2 transition-colors pr-12 ${
                    errors.password 
                      ? 'border-red-500 focus:border-red-500' 
                      : 'border-gray-200 focus:border-whatsapp-primary'
                  } focus:outline-none`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-1.5">
                Confirmar Senha
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 rounded-lg border-2 transition-colors pr-12 ${
                    errors.confirmPassword 
                      ? 'border-red-500 focus:border-red-500' 
                      : 'border-gray-200 focus:border-whatsapp-primary'
                  } focus:outline-none`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-whatsapp-primary to-whatsapp-secondary text-white py-2.5 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all mt-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Criando conta...
                </span>
              ) : (
                'Criar Conta Grátis'
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-4 text-center">
            <p className="text-gray-600 text-sm">
              Já tem uma conta?{' '}
              <Link to="/signin" className="text-whatsapp-primary font-semibold hover:text-whatsapp-secondary transition">
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
            {/* Success Icon */}
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>

            {/* Title */}
            <h3 className="text-2xl font-bold text-gray-900 text-center mb-3">
              Conta Criada com Sucesso!
            </h3>

            {/* Message */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-blue-900 mb-1">
                    Verifique seu email
                  </p>
                  <p className="text-sm text-blue-700">
                    Enviamos um link de confirmação para <strong>{formData.email}</strong>. 
                    Por favor, verifique sua caixa de entrada e confirme seu email antes de fazer login.
                  </p>
                </div>
              </div>
            </div>

            {/* Info */}
            <p className="text-sm text-gray-600 text-center mb-6">
              Não recebeu o email? Verifique sua pasta de spam ou lixo eletrônico.
            </p>

            {/* Button */}
            <button
              onClick={() => {
                setShowSuccessModal(false)
                navigate('/signin')
              }}
              className="w-full bg-gradient-to-r from-whatsapp-primary to-whatsapp-secondary text-white py-3 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transition-all"
            >
              Ir para Login
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default SignUp
