import { useState } from 'react'
import { Link } from 'react-router-dom'

function ResetPass() {
  const [formData, setFormData] = useState({
    email: ''
  })

  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)

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

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (validateForm()) {
      console.log('Password reset requested for:', formData.email)
      // Aqui você faria a chamada para a API
      setSubmitted(true)
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
          {submitted ? (
            /* Success Message */
            <div className="text-center py-8">
              <div className="mb-4 text-6xl">✉️</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Email Enviado!
              </h2>
              <p className="text-gray-600 mb-6">
                Enviamos instruções para recuperar sua senha para <strong>{formData.email}</strong>
              </p>
              <p className="text-sm text-gray-500 mb-6">
                Verifique sua caixa de entrada e siga as instruções. Não esqueça de verificar a pasta de spam.
              </p>
              <Link
                to="/login"
                className="inline-block bg-gradient-to-r from-whatsapp-primary to-whatsapp-secondary text-white px-8 py-2.5 rounded-lg font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
              >
                Voltar para Login
              </Link>
            </div>
          ) : (
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

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-whatsapp-primary to-whatsapp-secondary text-white py-2.5 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
              >
                Enviar
              </button>
            </form>
          )}

          {/* Login Link */}
          {!submitted && (
            <div className="mt-4 text-center">
              <p className="text-gray-600 text-sm">
                Lembrou sua senha?{' '}
                <Link to="/login" className="text-whatsapp-primary font-semibold hover:text-whatsapp-secondary transition">
                  Fazer Login
                </Link>
              </p>
            </div>
          )}
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

export default ResetPass
