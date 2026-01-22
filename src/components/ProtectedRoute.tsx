import { useAuthenticator } from '@aws-amplify/ui-react'
import { Navigate } from 'react-router-dom'

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { authStatus } = useAuthenticator()
  
  return authStatus === 'authenticated' ? <>{children}</> : <Navigate to="/login" />
}