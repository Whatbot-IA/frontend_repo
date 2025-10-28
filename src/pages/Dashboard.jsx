import { useState, useEffect } from 'react'
import Sidebar from '../components/Sidebar'
import styled from 'styled-components'
import axios from 'axios'

function Dashboard() {
  // Estado para dados do clima
  const [weatherData, setWeatherData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Dados de exemplo (posteriormente virão da API)
  const stats = {
    connectedAccounts: 3,
    openChats: 45,
    totalMessages: 1247,
    totalContacts: 892
  }

  const notifications = 5 // Número de notificações pendentes
  const userName = 'Hudson' // Nome do usuário (virá da API/contexto)

  // Buscar dados do clima
  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        setLoading(true)
        // API Key da OpenWeatherMap (configure no arquivo .env)
        const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY
        const city = import.meta.env.VITE_WEATHER_CITY || 'Luanda'
        const country = import.meta.env.VITE_WEATHER_COUNTRY || 'AO'
        
        if (!API_KEY || API_KEY === 'sua_chave_api_aqui') {
          setError('Configure a chave da API no arquivo .env')
          setLoading(false)
          return
        }
        
        // Buscar clima atual
        const currentWeather = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${city},${country}&appid=${API_KEY}&units=metric&lang=pt`
        )
        
        // Buscar previsão dos próximos dias
        const forecast = await axios.get(
          `https://api.openweathermap.org/data/2.5/forecast?q=${city},${country}&appid=${API_KEY}&units=metric&lang=pt`
        )

        // Buscar qualidade do ar
        const airQuality = await axios.get(
          `https://api.openweathermap.org/data/2.5/air_pollution?lat=${currentWeather.data.coord.lat}&lon=${currentWeather.data.coord.lon}&appid=${API_KEY}`
        )

        setWeatherData({
          current: currentWeather.data,
          forecast: forecast.data,
          airQuality: airQuality.data
        })
        setError(null)
      } catch (err) {
        console.error('Erro ao buscar dados do clima:', err)
        setError('Não foi possível carregar os dados do clima')
        // Manter dados de exemplo em caso de erro
      } finally {
        setLoading(false)
      }
    }

    fetchWeatherData()
    // Atualizar a cada 10 minutos
    const interval = setInterval(fetchWeatherData, 600000)
    return () => clearInterval(interval)
  }, [])

  // Funções auxiliares
  const getWeatherIcon = (weatherCode) => {
    // Códigos da OpenWeatherMap
    if (weatherCode >= 200 && weatherCode < 300) return '⛈️' // Trovoada
    if (weatherCode >= 300 && weatherCode < 400) return '🌧️' // Chuvisco
    if (weatherCode >= 500 && weatherCode < 600) return '🌧️' // Chuva
    if (weatherCode >= 600 && weatherCode < 700) return '❄️' // Neve
    if (weatherCode >= 700 && weatherCode < 800) return '🌫️' // Atmosférico
    if (weatherCode === 800) return '☀️' // Céu limpo
    if (weatherCode === 801) return '🌤️' // Poucas nuvens
    if (weatherCode === 802) return '⛅' // Nuvens dispersas
    if (weatherCode === 803 || weatherCode === 804) return '☁️' // Muito nublado
    return '🌤️'
  }

  const getAirQualityText = (aqi) => {
    const qualityLevels = {
      1: 'Excelente',
      2: 'Boa',
      3: 'Moderada',
      4: 'Ruim',
      5: 'Muito Ruim'
    }
    return qualityLevels[aqi] || 'Não disponível'
  }

  const formatTime = () => {
    const now = new Date()
    return now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  }

  const formatDate = () => {
    const now = new Date()
    const days = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB']
    return `${days[now.getDay()]} ${now.getDate().toString().padStart(2, '0')}-${(now.getMonth() + 1).toString().padStart(2, '0')}`
  }

  const getDayName = (dateString) => {
    const date = new Date(dateString)
    const days = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB']
    return days[date.getDay()]
  }

  // Agrupar previsões por dia
  const getForecastByDay = () => {
    if (!weatherData?.forecast?.list) return []
    
    const dailyForecasts = {}
    weatherData.forecast.list.forEach(item => {
      const date = item.dt_txt.split(' ')[0]
      if (!dailyForecasts[date]) {
        dailyForecasts[date] = item
      }
    })
    
    return Object.values(dailyForecasts).slice(1, 5) // Próximos 4 dias
  }

  const topProducts = [
    { name: 'Produto A', requests: 156 },
    { name: 'Produto B', requests: 134 },
    { name: 'Produto C', requests: 98 },
    { name: 'Produto D', requests: 76 },
    { name: 'Produto E', requests: 54 }
  ]

  const recentActivity = [
    { time: '10:45', message: 'Nova instância conectada', type: 'success' },
    { time: '09:30', message: '25 novas mensagens recebidas', type: 'info' },
    { time: '08:15', message: 'Produto "Camisa Polo" foi atualizado', type: 'info' },
    { time: 'Ontem', message: 'Plano Professional renovado', type: 'success' }
  ]

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
            Bem-vindo, {userName}!
          </h1>
          <p className="text-gray-600">
            Estás na página de <span className="font-semibold">Dashboard</span> e tu tens{' '}
            <span className="inline-flex items-center px-2 py-1 rounded-full text-sm font-semibold bg-red-100 text-red-600">
              {notifications}
            </span>{' '}
            {notifications === 1 ? 'notificação' : 'notificações'}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="flex flex-col lg:flex-row gap-6 mb-8">
          {/* Left Side - Large Card */}
          <div className="flex-1 lg:w-1/2">
            <StyledWrapper>
              <div className="card">
                {loading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-white text-lg">Carregando dados do clima...</div>
                  </div>
                ) : (
                  <>
                    {/* Aviso discreto no topo quando houver erro */}
                    {error && (
                      <div className="error-banner">
                        <span className="error-icon">⚠️</span>
                        <span className="error-text">Dados de exemplo - Configure a API no .env</span>
                      </div>
                    )}
                    
                    <section className="info-section">
                      <div className="background-design">
                        <div className="circle" />
                        <div className="circle" />
                        <div className="circle" />
                      </div>
                      <div className="left-side">
                        <div className="weather">
                          <div>
                            <svg stroke="#ffffff" fill="#ffffff" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">
                              <g strokeWidth={0} id="SVGRepo_bgCarrier" />
                              <g strokeLinejoin="round" strokeLinecap="round" id="SVGRepo_tracerCarrier" />
                              <g id="SVGRepo_iconCarrier">
                                <path d="M512 704a192 192 0 1 0 0-384 192 192 0 0 0 0 384zm0 64a256 256 0 1 1 0-512 256 256 0 0 1 0 512zm0-704a32 32 0 0 1 32 32v64a32 32 0 0 1-64 0V96a32 32 0 0 1 32-32zm0 768a32 32 0 0 1 32 32v64a32 32 0 1 1-64 0v-64a32 32 0 0 1 32-32zM195.2 195.2a32 32 0 0 1 45.248 0l45.248 45.248a32 32 0 1 1-45.248 45.248L195.2 240.448a32 32 0 0 1 0-45.248zm543.104 543.104a32 32 0 0 1 45.248 0l45.248 45.248a32 32 0 0 1-45.248 45.248l-45.248-45.248a32 32 0 0 1 0-45.248zM64 512a32 32 0 0 1 32-32h64a32 32 0 0 1 0 64H96a32 32 0 0 1-32-32zm768 0a32 32 0 0 1 32-32h64a32 32 0 1 1 0 64h-64a32 32 0 0 1-32-32zM195.2 828.8a32 32 0 0 1 0-45.248l45.248-45.248a32 32 0 0 1 45.248 45.248L240.448 828.8a32 32 0 0 1-45.248 0zm543.104-543.104a32 32 0 0 1 0-45.248l45.248-45.248a32 32 0 0 1 45.248 45.248l-45.248 45.248a32 32 0 0 1-45.248 0z" fill="#ffffff" />
                              </g>
                            </svg>
                          </div>
                          <div>{weatherData ? weatherData.current.weather[0].description : 'Ensolarado'}</div>
                        </div>
                        <div className="temperature">
                          {weatherData ? Math.round(weatherData.current.main.temp) : '36'}°
                        </div>
                        <div className="range">
                          {weatherData 
                            ? `Max: ${Math.round(weatherData.current.main.temp_max)}° Min: ${Math.round(weatherData.current.main.temp_min)}°`
                            : 'Max: 42° Min: 28°'
                          }
                        </div>
                        <div className="humidity">
                          💧 Humidade: {weatherData ? weatherData.current.main.humidity : '65'}%
                        </div>
                        <div className="wind">
                          💨 Vento: {weatherData ? Math.round(weatherData.current.wind.speed * 3.6) : '12'} km/h
                        </div>
                      </div>
                      <div className="right-side">
                        <div>
                          <div className="hour">{formatTime()}</div>
                          <div className="date">{formatDate()}</div>
                        </div>
                        <div className="city">
                          {weatherData 
                            ? `${weatherData.current.name}, ${weatherData.current.sys.country}` 
                            : 'Luanda, AO'
                          }
                        </div>
                        <div className="quality">
                          🌍 Qualidade do Ar: {weatherData 
                            ? getAirQualityText(weatherData.airQuality.list[0].main.aqi)
                            : 'Boa'
                          }
                        </div>
                      </div>
                    </section>
                    <section className="days-section">
                      {weatherData ? (
                        getForecastByDay().map((day, index) => (
                          <button key={index}>
                            <span className="day">{getDayName(day.dt_txt)}</span>
                            <span className="icon-weather-day">
                              <span style={{ fontSize: '20px' }}>{getWeatherIcon(day.weather[0].id)}</span>
                            </span>
                          </button>
                        ))
                      ) : (
                        <>
                          <button>
                            <span className="day">TER</span>
                            <span className="icon-weather-day">
                              <span style={{ fontSize: '20px' }}>☀️</span>
                            </span>
                          </button>
                          <button>
                            <span className="day">QUA</span>
                            <span className="icon-weather-day">
                              <span style={{ fontSize: '20px' }}>🌧️</span>
                            </span>
                          </button>
                          <button>
                            <span className="day">QUI</span>
                            <span className="icon-weather-day">
                              <span style={{ fontSize: '20px' }}>🌧️</span>
                            </span>
                          </button>
                          <button>
                            <span className="day">SEX</span>
                            <span className="icon-weather-day">
                              <span style={{ fontSize: '20px' }}>☀️</span>
                            </span>
                          </button>
                        </>
                      )}
                    </section>
                  </>
                )}
              </div>
            </StyledWrapper>
          </div>

          {/* Right Side - Four Small Cards (2x2 Grid) */}
          <div className="flex-1 lg:w-1/2">
            <div className="grid grid-cols-2 gap-4 h-full">
              {/* Connected Accounts */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-4xl">📱</div>
                  <div className="text-3xl font-bold text-whatsapp-primary">
                    {stats.connectedAccounts}
                  </div>
                </div>
                <h3 className="text-gray-600 font-semibold">Contas Conectadas</h3>
                <p className="text-sm text-gray-400 mt-1">WhatsApp Business</p>
              </div>

              {/* Open Chats */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-4xl">💬</div>
                  <div className="text-3xl font-bold text-blue-500">
                    {stats.openChats}
                  </div>
                </div>
                <h3 className="text-gray-600 font-semibold">Chats Abertos</h3>
                <p className="text-sm text-gray-400 mt-1">Conversas ativas</p>
              </div>

              {/* Total Messages */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-4xl">📨</div>
                  <div className="text-3xl font-bold text-purple-500">
                    {stats.totalMessages}
                  </div>
                </div>
                <h3 className="text-gray-600 font-semibold">Total de Mensagens</h3>
                <p className="text-sm text-gray-400 mt-1">Últimas 24 horas</p>
              </div>

              {/* Total Contacts */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-4xl">👥</div>
                  <div className="text-3xl font-bold text-orange-500">
                    {stats.totalContacts}
                  </div>
                </div>
                <h3 className="text-gray-600 font-semibold">Total de Contatos</h3>
                <p className="text-sm text-gray-400 mt-1">Base de clientes</p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Top Products */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span>🏆</span>
              Produtos Mais Requisitados
            </h2>
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-whatsapp-primary to-whatsapp-secondary text-white rounded-full flex items-center justify-center font-bold text-sm">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-gray-700">{product.name}</span>
                      <span className="text-sm text-gray-500">{product.requests} requisições</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-whatsapp-primary to-whatsapp-secondary h-2 rounded-full transition-all"
                        style={{ width: `${(product.requests / topProducts[0].requests) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span>🕒</span>
              Atividade Recente
            </h2>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start gap-3 pb-4 border-b border-gray-100 last:border-0">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    activity.type === 'success' ? 'bg-green-500' : 'bg-blue-500'
                  }`} />
                  <div className="flex-1">
                    <p className="text-gray-700 font-medium">{activity.message}</p>
                    <p className="text-sm text-gray-400 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <span>⚡</span>
            Ações Rápidas
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-whatsapp-primary hover:bg-whatsapp-primary/5 transition-all">
              <span className="text-3xl">➕</span>
              <div className="text-left">
                <p className="font-semibold text-gray-900">Nova Instância</p>
                <p className="text-sm text-gray-500">Conectar WhatsApp</p>
              </div>
            </button>
            <button className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-500/5 transition-all">
              <span className="text-3xl">🏪</span>
              <div className="text-left">
                <p className="font-semibold text-gray-900">Adicionar Loja</p>
                <p className="text-sm text-gray-500">Integrar produtos</p>
              </div>
            </button>
            <button className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-500/5 transition-all">
              <span className="text-3xl">📊</span>
              <div className="text-left">
                <p className="font-semibold text-gray-900">Ver Relatórios</p>
                <p className="text-sm text-gray-500">Análise detalhada</p>
              </div>
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}

const StyledWrapper = styled.div`
  height: 100%;
  
  .card {
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100%;
    min-height: 400px;
    width: 100%;
    border-radius: 25px;
    background: lightgrey;
    overflow: hidden;
    transition: 100ms ease;
    box-shadow: rgba(0, 0, 0, 0.15) 2px 3px 4px;
    position: relative;
  }

  .error-banner {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    background: rgba(255, 193, 7, 0.95);
    color: #856404;
    padding: 8px 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    font-size: 11px;
    font-weight: 500;
    z-index: 10;
    backdrop-filter: blur(10px);
    border-bottom: 1px solid rgba(255, 193, 7, 0.3);
  }

  .error-icon {
    font-size: 14px;
  }

  .error-text {
    font-weight: 600;
  }

  .info-section {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: 75%;
    color: white;
  }

  .left-side {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 8px;
    height: 100%;
    z-index: 1;
    padding-left: 24px;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }

  button {
    display: block;
    border: none;
    background: transparent;
  }

  .weather {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 8px;
    font-size: 14pt;
    font-weight: 500;
  }

  .weather div {
    display: flex;
    align-items: center;
  }

  .weather div:nth-child(1) {
    width: 28px;
    height: auto;
  }

  .temperature {
    font-size: 48pt;
    font-weight: 600;
    line-height: 1;
    margin: 6px 0;
  }

  .range {
    font-size: 11pt;
    opacity: 0.9;
    margin-bottom: 2px;
  }

  .humidity, .wind {
    font-size: 10pt;
    opacity: 0.85;
    margin: 1px 0;
  }

  .right-side {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: center;
    gap: 8px;
    height: 100%;
    padding-right: 24px;
    z-index: 1;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }

  .right-side > div {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
  }

  .hour {
    font-size: 24pt;
    font-weight: 600;
    line-height: 1;
  }

  .date {
    font-size: 11pt;
    opacity: 0.9;
    margin-top: 2px;
  }

  .city {
    font-size: 13pt;
    font-weight: 500;
    margin-top: 6px;
  }

  .quality {
    font-size: 10pt;
    opacity: 0.85;
    margin-top: 4px;
  }

  .background-design {
    position: absolute;
    height: 100%;
    width: 100%;
    background: linear-gradient(135deg, #d63447 0%, #c42d3e 50%, #b02635 100%);
    overflow: hidden;
  }

  .circle {
    background: radial-gradient(circle, #ffb347 0%, #ffa040 30%, #ff8c42 60%, transparent 100%);
    animation: pulse 4s ease-in-out infinite;
  }

  @keyframes pulse {
    0%, 100% {
      transform: scale(1);
      opacity: 0.4;
    }
    50% {
      transform: scale(1.05);
      opacity: 0.6;
    }
  }

  .circle:nth-child(1) {
    position: absolute;
    top: -60%;
    right: -35%;
    width: 450px;
    height: 450px;
    opacity: 0.35;
    border-radius: 50%;
    animation-delay: 0s;
  }

  .circle:nth-child(2) {
    position: absolute;
    top: -40%;
    right: -15%;
    width: 320px;
    height: 320px;
    opacity: 0.45;
    border-radius: 50%;
    animation-delay: 1s;
  }

  .circle:nth-child(3) {
    position: absolute;
    top: -10%;
    right: 5%;
    width: 180px;
    height: 180px;
    opacity: 0.7;
    border-radius: 50%;
    box-shadow: 0 0 60px rgba(255, 179, 71, 0.5), 0 0 100px rgba(255, 160, 64, 0.3);
    animation-delay: 2s;
  }

  .days-section {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: 25%;
    background-color: #974859;
    gap: 2px;
    box-shadow: inset 0px 2px 5px #974859;
  }

  .days-section button {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    width: 100%;
    background-color: #a75265;
    box-shadow: inset 0px 2px 5px #974859;
    cursor: pointer;
    transition: 100ms ease;
    gap: 5px;
  }

  .days-section button:hover {
    scale: 0.9;
    border-radius: 10px;
  }

  .days-section .day {
    font-size: 10pt;
    font-weight: 500;
    color: white;
    opacity: 0.7;
  }

  .icon-weather-day {
    display: flex;
    align-items: center;
    width: 20px;
    height: 100%;
  }
`;

export default Dashboard
