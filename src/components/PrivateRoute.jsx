import { Navigate } from 'react-router-dom'

/**
 * Componente para proteger rotas que exigem autenticação
 * Verifica se existe accessToken no localStorage
 * Se não existir, redireciona para a página de login
 */
function PrivateRoute({ children }) {
  const accessToken = localStorage.getItem('accessToken')
  
  // Se não houver token, redireciona para login
  if (!accessToken) {
    return <Navigate to="/signin" replace />
  }
  
  // Se houver token, renderiza o componente filho
  return children
}

export default PrivateRoute
