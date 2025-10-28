import Sidebar from '../components/Sidebar'
import styled from 'styled-components'

function Dashboard() {
  // Dados de exemplo (posteriormente virão da API)
  const stats = {
    connectedAccounts: 3,
    openChats: 45,
    totalMessages: 1247,
    totalContacts: 892
  }

  const notifications = 5 // Número de notificações pendentes
  const userName = 'Hudson' // Nome do usuário (virá da API/contexto)

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
                      <div>Ensolarado</div>
                    </div>
                    <div className="temperature">36°</div>
                    <div className="range">Max: 42° Min: 28°</div>
                    <div className="humidity">💧 Humidade: 65%</div>
                    <div className="wind">💨 Vento: 12 km/h</div>
                  </div>
                  <div className="right-side">
                    <div>
                      <div className="hour">23:56</div>
                      <div className="date">SEG 28-10</div>
                    </div>
                    <div className="city">Luanda, AO</div>
                    <div className="quality">🌍 Qualidade do Ar: Boa</div>
                  </div>
                </section>
                <section className="days-section">
                  <button>
                    <span className="day">TUE</span>
                    <span className="icon-weather-day">
                      <svg stroke="#ffffff" fill="#ffffff" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">
                        <g strokeWidth={0} id="SVGRepo_bgCarrier" />
                        <g strokeLinejoin="round" strokeLinecap="round" id="SVGRepo_tracerCarrier" />
                        <g id="SVGRepo_iconCarrier">
                          <path d="M512 704a192 192 0 1 0 0-384 192 192 0 0 0 0 384zm0 64a256 256 0 1 1 0-512 256 256 0 0 1 0 512zm0-704a32 32 0 0 1 32 32v64a32 32 0 0 1-64 0V96a32 32 0 0 1 32-32zm0 768a32 32 0 0 1 32 32v64a32 32 0 1 1-64 0v-64a32 32 0 0 1 32-32zM195.2 195.2a32 32 0 0 1 45.248 0l45.248 45.248a32 32 0 1 1-45.248 45.248L195.2 240.448a32 32 0 0 1 0-45.248zm543.104 543.104a32 32 0 0 1 45.248 0l45.248 45.248a32 32 0 0 1-45.248 45.248l-45.248-45.248a32 32 0 0 1 0-45.248zM64 512a32 32 0 0 1 32-32h64a32 32 0 0 1 0 64H96a32 32 0 0 1-32-32zm768 0a32 32 0 0 1 32-32h64a32 32 0 1 1 0 64h-64a32 32 0 0 1-32-32zM195.2 828.8a32 32 0 0 1 0-45.248l45.248-45.248a32 32 0 0 1 45.248 45.248L240.448 828.8a32 32 0 0 1-45.248 0zm543.104-543.104a32 32 0 0 1 0-45.248l45.248-45.248a32 32 0 0 1 45.248 45.248l-45.248 45.248a32 32 0 0 1-45.248 0z" fill="#ffffff" />
                        </g>
                      </svg>
                    </span>
                  </button>
                  <button>
                    <span className="day">WED</span>
                    <span className="icon-weather-day">
                      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#ffffff">
                        <g id="SVGRepo_bgCarrier" strokeWidth={0} />
                        <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" />
                        <g id="SVGRepo_iconCarrier">
                          <path d="M16 18.5L15 21M8 18.5L7 21M12 18.5L11 21M7 15C4.23858 15 2 12.7614 2 10C2 7.23858 4.23858 5 7 5C7.03315 5 7.06622 5.00032 7.09922 5.00097C8.0094 3.2196 9.86227 2 12 2C14.5192 2 16.6429 3.69375 17.2943 6.00462C17.3625 6.00155 17.4311 6 17.5 6C19.9853 6 22 8.01472 22 10.5C22 12.9853 19.9853 15 17.5 15C13.7434 15 11.2352 15 7 15Z" stroke="#ffffff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                        </g>
                      </svg>
                    </span>
                  </button>
                  <button>
                    <span className="day">THU</span>
                    <span className="icon-weather-day">
                      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#ffffff">
                        <g id="SVGRepo_bgCarrier" strokeWidth={0} />
                        <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" />
                        <g id="SVGRepo_iconCarrier">
                          <path d="M16 18.5L15 21M8 18.5L7 21M12 18.5L11 21M7 15C4.23858 15 2 12.7614 2 10C2 7.23858 4.23858 5 7 5C7.03315 5 7.06622 5.00032 7.09922 5.00097C8.0094 3.2196 9.86227 2 12 2C14.5192 2 16.6429 3.69375 17.2943 6.00462C17.3625 6.00155 17.4311 6 17.5 6C19.9853 6 22 8.01472 22 10.5C22 12.9853 19.9853 15 17.5 15C13.7434 15 11.2352 15 7 15Z" stroke="#ffffff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                        </g>
                      </svg>
                    </span>
                  </button>
                  <button>
                    <span className="day">FRI</span>
                    <span className="icon-weather-day">
                      <svg stroke="#ffffff" fill="#ffffff" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">
                        <g strokeWidth={0} id="SVGRepo_bgCarrier" />
                        <g strokeLinejoin="round" strokeLinecap="round" id="SVGRepo_tracerCarrier" />
                        <g id="SVGRepo_iconCarrier">
                          <path d="M512 704a192 192 0 1 0 0-384 192 192 0 0 0 0 384zm0 64a256 256 0 1 1 0-512 256 256 0 0 1 0 512zm0-704a32 32 0 0 1 32 32v64a32 32 0 0 1-64 0V96a32 32 0 0 1 32-32zm0 768a32 32 0 0 1 32 32v64a32 32 0 1 1-64 0v-64a32 32 0 0 1 32-32zM195.2 195.2a32 32 0 0 1 45.248 0l45.248 45.248a32 32 0 1 1-45.248 45.248L195.2 240.448a32 32 0 0 1 0-45.248zm543.104 543.104a32 32 0 0 1 45.248 0l45.248 45.248a32 32 0 0 1-45.248 45.248l-45.248-45.248a32 32 0 0 1 0-45.248zM64 512a32 32 0 0 1 32-32h64a32 32 0 0 1 0 64H96a32 32 0 0 1-32-32zm768 0a32 32 0 0 1 32-32h64a32 32 0 1 1 0 64h-64a32 32 0 0 1-32-32zM195.2 828.8a32 32 0 0 1 0-45.248l45.248-45.248a32 32 0 0 1 45.248 45.248L240.448 828.8a32 32 0 0 1-45.248 0zm543.104-543.104a32 32 0 0 1 0-45.248l45.248-45.248a32 32 0 0 1 45.248 45.248l-45.248 45.248a32 32 0 0 1-45.248 0z" fill="#ffffff" />
                        </g>
                      </svg>
                    </span>
                  </button>
                </section>
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
