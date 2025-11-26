import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Loader from './components/Loader'
import PrivateRoute from './components/PrivateRoute'
import Home from './pages/Home'
import SignUp from './pages/SignUp'
import SignIn from './pages/SignIn'
import ResetPass from './pages/resetPass'
import Dashboard from './pages/Dashboard'
import Instances from './pages/Instances'
import Stores from './pages/Stores'
import StoreDetail from './pages/StoreDetail'
import Chat from './pages/Chat'
import InstanceConfig from './pages/InstanceConfig'
import Settings from './pages/Settings'
import Reports from './pages/Reports'
import Contacts from './pages/Contacts'
import Notifications from './pages/Notifications'

function App() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 2500)

    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return <Loader />
  }

  return (
    <Router>
      <Routes>
        {/* Rotas públicas */}
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/login" element={<SignIn />} />
        <Route path="/forgot-password" element={<ResetPass />} />
        <Route path="/reset-password" element={<ResetPass />} />
        
        {/* Rotas protegidas */}
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/instances" element={<PrivateRoute><Instances /></PrivateRoute>} />
        <Route path="/instances/:instanceId/chat" element={<PrivateRoute><Chat /></PrivateRoute>} />
        <Route path="/instances/:instanceId/config" element={<PrivateRoute><InstanceConfig /></PrivateRoute>} />
        <Route path="/stores" element={<PrivateRoute><Stores /></PrivateRoute>} />
        <Route path="/stores/:storeId" element={<PrivateRoute><StoreDetail /></PrivateRoute>} />
        <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
        <Route path="/reports" element={<PrivateRoute><Reports /></PrivateRoute>} />
        <Route path="/contacts" element={<PrivateRoute><Contacts /></PrivateRoute>} />
        <Route path="/notifications" element={<PrivateRoute><Notifications /></PrivateRoute>} />
      </Routes>
    </Router>
  )
}

export default App
