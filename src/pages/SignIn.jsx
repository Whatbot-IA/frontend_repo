import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { login } from '../services/api'

function SignIn() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [apiError, setApiError] = useState('')

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

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Senha é obrigatória'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (validateForm()) {
      setIsLoading(true)
      setApiError('')
      
      const result = await login({
        email: formData.email,
        password: formData.password
      })

      if (result.success) {
        // Login bem-sucedido - redirecionar para dashboard
        navigate('/dashboard')
      } else {
        setIsLoading(false)
        
        const { statusCode, message } = result.error
        
        if (statusCode === 403) {
          // Email não confirmado
          setApiError('Por favor, confirme seu email antes de fazer login. Verifique sua caixa de entrada.')
        } else if (statusCode === 401) {
          // Credenciais inválidas
          setApiError('Email ou senha incorretos. Verifique suas credenciais e tente novamente.')
        } else if (!result.error.status) {
          // Erro de conexão
          setApiError('Não foi possível conectar ao servidor. Verifique sua conexão.')
        } else {
          setApiError(message || 'Erro ao fazer login. Tente novamente.')
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
            Fazer Login
          </h1>
          <p className="text-gray-600">
            Entre com os dados da sua conta
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

            {/* Forgot Password Link */}
            <div className="text-right">
              <Link to="/forgot-password" className="text-sm text-whatsapp-primary hover:text-whatsapp-secondary transition">
                Esqueceu a senha?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-whatsapp-primary to-whatsapp-secondary text-white py-2.5 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Entrando...
                </span>
              ) : (
                'Entrar'
              )}
            </button>
          </form>

          {/* SignUp Link */}
          <div className="mt-4 text-center">
            <p className="text-gray-600 text-sm">
              Não tem uma conta?{' '}
              <Link to="/signup" className="text-whatsapp-primary font-semibold hover:text-whatsapp-secondary transition">
                Criar Conta
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
    </div>
  )
}

export default SignIn
