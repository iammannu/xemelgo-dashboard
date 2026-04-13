import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'
import UserSwitcher from '../components/UserSwitcher'
import ItemTable from '../components/ItemTable'
import DashboardSummary from '../components/DashboardSummary'

export default function DashboardPage({ activeUser, setActiveUser }) {
  const [items, setItems] = useState([])     // starts empty
  const [loading, setLoading] = useState(true) // starts as true because we are about to load data from the backend
  const { logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    api.get('/items')           // It asks the backend to give me all the items
      .then(res => setItems(res.data))  // saves the list into items
      .finally(() => setLoading(false)) 
  }, [])

  const handleLogout = () => {
    logout()                // logout
    navigate('/login')      // sends you back to the login page 
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div>
            <h1 className="text-base font-bold text-gray-900 leading-none">Xemelgo</h1>
            <p className="text-xs text-gray-400 leading-none mt-0.5">Dashboard Management</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <UserSwitcher activeUser={activeUser} setActiveUser={setActiveUser} />
          <button
            onClick={handleLogout}
            className="text-xs text-gray-400 hover:text-red-500 font-medium transition-colors flex items-center gap-1"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Page title */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Overview</h2>
          <p className="text-sm text-gray-500 mt-0.5">Track and manage all items across solution types</p>
        </div>

        {/* Summary cards */}
        {!loading && <DashboardSummary items={items} />}

        {/* Table section */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-700">All Items</h3>
            {!loading && (
              <span className="text-xs text-gray-400">{items.length} items</span>
            )}
          </div>
          {loading ? (
            <div className="flex items-center justify-center py-16 gap-2 text-gray-400">
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              <span className="text-sm">Loading items…</span>
            </div>
          ) : (
            <ItemTable items={items} />
          )}
        </div>
      </main>
    </div>
  )
}
