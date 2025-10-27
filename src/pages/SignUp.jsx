import { useState } from 'react'
import { Link } from 'react-router-dom'

function SignUp() {
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

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (validateForm()) {
      console.log('Form submitted:', formData)
      // Aqui você faria a chamada para a API
      alert('Conta criada com sucesso! (Demo)')
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
              className="w-full bg-gradient-to-r from-whatsapp-primary to-whatsapp-secondary text-white py-2.5 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all mt-2"
            >
              Criar Conta Grátis
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
    </div>
  )
}

export default SignUp
