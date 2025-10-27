import { useState, useEffect } from 'react'

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  // Detectar scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const features = [
    {
      icon: '🤖',
      title: 'Atendimento 24/7',
      description: 'IA responde, vende e dá suporte em tempo real, sem parar.'
    },
    {
      icon: '🛍️',
      title: 'Integração com Lojas',
      description: 'Sincronize seus produtos e estoque facilmente.'
    },
    {
      icon: '🌐',
      title: 'E-commerce Completo',
      description: 'Receba um site completo e compartilhe produtos nas redes sociais.'
    },
    {
      icon: '💬',
      title: 'Múltiplas Contas',
      description: 'Gerencie várias contas WhatsApp com diferentes finalidades.'
    },
    {
      icon: '📊',
      title: 'Relatórios Detalhados',
      description: 'Acompanhe vendas e desempenho da IA em tempo real.'
    },
    {
      icon: '🔒',
      title: 'Segurança Total',
      description: 'Todos os dados protegidos por criptografia de ponta.'
    }
  ]

  const plans = [
    {
      name: 'Gratuito',
      price: 'R$ 0',
      period: '/mês',
      features: ['1 conta WhatsApp', '100 mensagens/mês', 'Recursos básicos', 'Suporte por email'],
      highlighted: false
    },
    {
      name: 'Profissional',
      price: 'R$ 97',
      period: '/mês',
      features: ['3 contas WhatsApp', 'Mensagens ilimitadas', 'Todos os recursos', 'Suporte prioritário', 'Relatórios avançados'],
      highlighted: true
    },
    {
      name: 'Empresarial',
      price: 'R$ 297',
      period: '/mês',
      features: ['10 contas WhatsApp', 'Mensagens ilimitadas', 'API personalizada', 'Suporte 24/7', 'Gerente de conta dedicado'],
      highlighted: false
    }
  ]

  const scrollToSection = (id) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
      setMenuOpen(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <header className={`fixed top-0 left-0 right-0 backdrop-blur-md shadow-sm z-50 transition-all duration-300 ${
        isScrolled ? 'mx-4 mt-4 rounded-2xl bg-white/80' : 'bg-white/95'
      }`}>
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center lg:grid lg:grid-cols-3">
            {/* Logo - Esquerda */}
            <div className="flex items-center gap-3 text-2xl font-bold">
              <img src="/logo.png" alt="Whatbot Logo" className="w-15 h-15 object-contain" />
            </div>

            {/* Menu Mobile Toggle */}
            <button className="lg:hidden flex flex-col gap-1.5 p-2" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
              <span className={`w-6 h-0.5 bg-gray-800 transition-transform ${menuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
              <span className={`w-6 h-0.5 bg-gray-800 transition-opacity ${menuOpen ? 'opacity-0' : ''}`}></span>
              <span className={`w-6 h-0.5 bg-gray-800 transition-transform ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
            </button>

            {/* Menu - Centro */}
            <ul className="hidden lg:flex items-center justify-center gap-8">
              <li><button onClick={() => scrollToSection('hero')} className="text-gray-700 hover:text-whatsapp-primary font-medium transition">Início</button></li>
              <li><button onClick={() => scrollToSection('features')} className="text-gray-700 hover:text-whatsapp-primary font-medium transition">Recursos</button></li>
              <li><button onClick={() => scrollToSection('how-it-works')} className="text-gray-700 hover:text-whatsapp-primary font-medium transition">Como Funciona</button></li>
              <li><button onClick={() => scrollToSection('plans')} className="text-gray-700 hover:text-whatsapp-primary font-medium transition">Planos</button></li>
            </ul>

            {/* Botão CTA - Direita */}
            <div className="hidden lg:flex justify-end">
              <button onClick={() => scrollToSection('contact')} className="bg-gradient-to-r from-whatsapp-primary to-whatsapp-secondary text-white px-6 py-2.5 rounded-full font-medium hover:shadow-lg hover:-translate-y-0.5 transition-all">
                Começar Agora
              </button>
            </div>
          </div>

          {/* Menu Mobile */}
          <div className={`lg:hidden overflow-hidden transition-all duration-300 ${menuOpen ? 'max-h-96 mt-4' : 'max-h-0'}`}>
            <ul className="flex flex-col gap-4 py-4 border-t">
              <li><button onClick={() => scrollToSection('hero')} className="text-gray-700 hover:text-whatsapp-primary font-medium transition">Início</button></li>
              <li><button onClick={() => scrollToSection('features')} className="text-gray-700 hover:text-whatsapp-primary font-medium transition">Recursos</button></li>
              <li><button onClick={() => scrollToSection('how-it-works')} className="text-gray-700 hover:text-whatsapp-primary font-medium transition">Como Funciona</button></li>
              <li><button onClick={() => scrollToSection('plans')} className="text-gray-700 hover:text-whatsapp-primary font-medium transition">Planos</button></li>
              <li><button onClick={() => scrollToSection('contact')} className="bg-gradient-to-r from-whatsapp-primary to-whatsapp-secondary text-white px-6 py-2.5 rounded-full font-medium w-full hover:shadow-lg transition">Começar Agora</button></li>
            </ul>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section id="hero" className="min-h-screen flex items-center px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-gray-100 pt-24 lg:pt-0">
        <div className="max-w-[1400px] mx-auto px-2 w-full">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div className="animate-fade-in-left pl-0 lg:pl-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
                <span className="bg-gradient-to-r from-whatsapp-primary to-whatsapp-secondary bg-clip-text text-transparent">
                Automação Inteligente de Vendas via WhatsApp
                </span>
              </h1>
              <p className="text-2xl sm:text-3xl text-whatsapp-secondary font-semibold mb-6">
                Conecte. Automatize. Venda.
              </p>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Transforme seu WhatsApp em uma máquina de vendas 24/7. 
                Atenda, venda e fidelize clientes automaticamente com Inteligência Artificial.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => scrollToSection('contact')}
                  className="bg-gradient-to-r from-whatsapp-primary to-whatsapp-secondary text-white px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all"
                >
                  Começar Gratuitamente
                </button>
                <button 
                  onClick={() => scrollToSection('how-it-works')}
                  className="bg-transparent border-2 border-whatsapp-secondary text-whatsapp-secondary px-8 py-4 rounded-full font-semibold text-lg hover:bg-whatsapp-secondary hover:text-white transition-all"
                >
                  Saiba Mais
                </button>
            </div>
          </div>

            <div className="hidden lg:flex justify-center items-center animate-fade-in-right">
              <div className="cube-loader">
                <div className="cube-top">
                  <img src="/logo.png" alt="Whatbot" className="cube-top-logo" />
                </div>
                <div className="cube-wrapper">
                  <span style={{'--i': 0}} className="cube-span">
                    <div className="cube-text">Automatize</div>
                  </span>
                  <span style={{'--i': 1}} className="cube-span">
                    <div className="cube-text">Venda 24/7</div>
                  </span>
                  <span style={{'--i': 2}} className="cube-span">
                    <div className="cube-text">Call Center Inteligente</div>
                  </span>
                  <span style={{'--i': 3}} className="cube-span">
                    <div className="cube-text">Cliente satisfeito</div>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>      {/* Features Section */}
      <section id="features" className="min-h-screen flex items-center px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto w-full">
          <h2 className="text-4xl sm:text-5xl font-extrabold text-center mb-4">Recursos Principais</h2>
          <p className="text-xl text-gray-600 text-center mb-16">
            Tudo que você precisa para automatizar suas vendas
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-gray-100"
              >
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-2xl font-bold mb-3 text-gray-900">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="min-h-screen flex items-center px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto w-full">
          <h2 className="text-4xl sm:text-5xl font-extrabold text-center mb-4">Como Funciona</h2>
          <p className="text-xl text-gray-600 text-center mb-16">
            Simples, rápido e eficiente
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { num: '1', title: 'Conecte seu WhatsApp', desc: 'Conecte suas contas WhatsApp Business de forma segura em minutos.' },
              { num: '2', title: 'Configure a IA', desc: 'Integre sua loja virtual e personalize as respostas da IA.' },
              { num: '3', title: 'Venda Automaticamente', desc: 'A IA atende, vende e resolve dúvidas 24 horas por dia.' },
              { num: '4', title: 'Acompanhe Resultados', desc: 'Monitore vendas, conversões e desempenho em tempo real.' }
            ].map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-whatsapp-primary to-whatsapp-secondary text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4 shadow-lg">
                  {step.num}
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Plans Section */}
      <section id="plans" className="min-h-screen flex items-center px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto w-full">
          <h2 className="text-4xl sm:text-5xl font-extrabold text-center mb-4">Planos e Preços</h2>
          <p className="text-xl text-gray-600 text-center mb-16">
            Escolha o plano ideal para seu negócio
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <div 
                key={index} 
                className={`relative bg-white rounded-2xl p-8 transition-all duration-300 ${
                  plan.highlighted 
                    ? 'border-2 border-whatsapp-primary shadow-2xl scale-105' 
                    : 'border-2 border-gray-200 hover:shadow-xl hover:-translate-y-2'
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-whatsapp-primary to-whatsapp-secondary text-white px-6 py-2 rounded-full text-sm font-semibold">
                    Mais Popular
                  </div>
                )}
                <h3 className="text-2xl font-bold mb-4 text-gray-900">{plan.name}</h3>
                <div className="mb-6">
                  <span className="text-5xl font-extrabold text-whatsapp-primary">{plan.price}</span>
                  <span className="text-gray-600 text-lg">{plan.period}</span>
                </div>
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-gray-600">
                      <span className="text-whatsapp-primary font-bold text-xl">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <button 
                  className={`w-full py-3 rounded-full font-semibold text-lg transition-all ${
                    plan.highlighted
                      ? 'bg-gradient-to-r from-whatsapp-primary to-whatsapp-secondary text-white shadow-lg hover:shadow-xl'
                      : 'bg-transparent border-2 border-whatsapp-primary text-whatsapp-primary hover:bg-whatsapp-primary hover:text-white'
                  }`}
                >
                  Escolher Plano
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contact" className="min-h-screen flex items-center px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-whatsapp-primary to-whatsapp-secondary text-white text-center">
        <div className="max-w-4xl mx-auto w-full">
          <h2 className="text-4xl sm:text-5xl font-extrabold mb-6">
            Pronto para Revolucionar suas Vendas?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Comece gratuitamente e veja a diferença em poucos dias.
          </p>
          <button className="bg-white text-whatsapp-primary px-12 py-4 rounded-full font-bold text-xl shadow-2xl hover:scale-105 transition-transform">
            Criar Conta Grátis
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-2 text-2xl font-bold mb-4">
                <span className="text-3xl">🤖</span>
                <span>Whatbot IA</span>
              </div>
              <p className="text-gray-400">Automação inteligente de vendas via WhatsApp</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Recursos</h4>
              <ul className="space-y-2 text-gray-400">
                <li><button onClick={() => scrollToSection('features')} className="hover:text-whatsapp-primary transition">Funcionalidades</button></li>
                <li><button onClick={() => scrollToSection('plans')} className="hover:text-whatsapp-primary transition">Planos</button></li>
                <li><button onClick={() => scrollToSection('how-it-works')} className="hover:text-whatsapp-primary transition">Como Funciona</button></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Empresa</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#about" className="hover:text-whatsapp-primary transition">Sobre Nós</a></li>
                <li><a href="#privacy" className="hover:text-whatsapp-primary transition">Privacidade</a></li>
                <li><a href="#terms" className="hover:text-whatsapp-primary transition">Termos de Uso</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Contato</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="mailto:contato@whatbot.com" className="hover:text-whatsapp-primary transition">contato@whatbot.com</a></li>
                <li><a href="tel:+5511999999999" className="hover:text-whatsapp-primary transition">+55 11 99999-9999</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Whatbot IA. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
