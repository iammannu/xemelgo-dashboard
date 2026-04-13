import { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import DetailsPage from './pages/DetailsPage'

const ProtectedRoute = ({ children }) => {
  const { token } = useAuth()
  return token ? children : <Navigate to="/login" />
}

export default function App() {
  const [activeUser, setActiveUser] = useState(null)

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <DashboardPage activeUser={activeUser} setActiveUser={setActiveUser} />
        </ProtectedRoute>
      } />
      <Route path="/items/:id" element={
        <ProtectedRoute>
          <DetailsPage activeUser={activeUser} setActiveUser={setActiveUser} />
        </ProtectedRoute>
      } />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  )
}