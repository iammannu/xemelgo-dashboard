import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../api/axios'
import UserSwitcher from '../components/UserSwitcher'
import ActionPanel from '../components/ActionPanel'
import LocationHistoryTable from '../components/LocationHistoryTable'
import ActionHistoryTable from '../components/ActionHistoryTable'

const solutionStyles = {
  'Asset':      { badge: 'bg-blue-50 text-blue-700 ring-1 ring-blue-200',   dot: 'bg-blue-500' },
  'Inventory':  { badge: 'bg-green-50 text-green-700 ring-1 ring-green-200', dot: 'bg-green-500' },
  'Work Order': { badge: 'bg-purple-50 text-purple-700 ring-1 ring-purple-200', dot: 'bg-purple-500' },
}

const statusStyles = {
  active:   { badge: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200', dot: 'bg-emerald-400' },
  missing:  { badge: 'bg-red-50 text-red-600 ring-1 ring-red-200',            dot: 'bg-red-400' },
  consumed: { badge: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',       dot: 'bg-amber-400' },
  complete: { badge: 'bg-gray-100 text-gray-500 ring-1 ring-gray-200',         dot: 'bg-gray-400' },
}

export default function DetailsPage({ activeUser, setActiveUser }) {
  const { id } = useParams()     // it reads the url id = 2
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchItem = () => {
    setLoading(true)
    api.get(`/items/${id}`)                        // It asks the backend to give me the details of a specific item based on the id in the URL
      .then(res => setData(res.data))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchItem() }, [id])

  if (loading) return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center gap-3 text-gray-400">
      <svg className="w-6 h-6 animate-spin text-blue-500" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
      </svg>
      <span className="text-sm font-medium">Loading item…</span>
    </div>
  )

  if (!data) return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
      <p className="text-gray-400 text-sm">Item not found.</p>
    </div>
  )

  const { item, locationHistory, actionHistory } = data
  const sol = solutionStyles[item.solution_type] || solutionStyles['Asset']
  const sta = statusStyles[item.status] || statusStyles.active

  return (
    <div className="min-h-screen bg-[#f8fafc]">

      {/* ── Sticky header ── */}
      <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-600 font-medium transition-colors px-2.5 py-1.5 rounded-lg hover:bg-blue-50"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back
          </button>
          <div className="w-px h-5 bg-gray-200" />
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-sm">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900 leading-none">Xemelgo</p>
              <p className="text-xs text-gray-400 leading-none mt-0.5">Item Details</p>
            </div>
          </div>
        </div>
        <UserSwitcher activeUser={activeUser} setActiveUser={setActiveUser} />
      </header>

      <main className="max-w-[1100px] mx-auto px-6 py-10 space-y-8">

        {/* ── Page title ── */}
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">Item Detail</p>
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">{item.name}</h2>
            <div className="flex items-center gap-2 mt-2.5">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${sol.badge}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${sol.dot}`} />
                {item.solution_type}
              </span>
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold capitalize ${sta.badge}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${sta.dot}`} />
                {item.status}
              </span>
            </div>
          </div>
        </div>

        {/* ── Detail summary card ── */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">

          {/* Card header */}
          <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-blue-50 flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-sm font-semibold text-gray-700">Detail Summary</h3>
          </div>

          {/* Fields */}
          <div className="px-6 py-5">
            <div className="grid grid-cols-3 gap-4 mb-8">
              {[
                { label: 'Item Name', value: item.name },         // item 2
                { label: 'Solution Type', value: item.solution_type },      // asset
                { label: 'Current Location', value: item.current_location || 'N/A' },    // storage 2
              ].map(({ label, value }) => (
                <div key={label} className="bg-gray-50 rounded-xl px-5 py-4 border border-gray-100">
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1.5">{label}</p>
                  <p className="text-sm font-semibold text-gray-800">{value}</p>
                </div>
              ))}
            </div>

            {/* Divider */}
            <div className="border-t border-gray-100 mb-6" />

            {/* Actions */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 rounded-md bg-gray-100 flex items-center justify-center">
                  <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Available Actions</p>
              </div>
              <ActionPanel item={item} activeUser={activeUser} onActionSubmit={fetchItem} />
            </div>
          </div>
        </div>

        {/* ── History grid ── */}
        <div className="grid grid-cols-2 gap-6">

          {/* Location History */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-start justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-blue-50 flex items-center justify-center">
                  <svg className="w-3.5 h-3.5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 leading-none">Location History</h3>
                  <p className="text-xs text-gray-400 mt-1">Click a row to highlight same location</p>
                </div>
              </div>
              <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-xs font-semibold rounded-full">
                Last 6
              </span>
            </div>
            {locationHistory.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-gray-300 gap-2">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                <p className="text-sm text-gray-400">No location history</p>
              </div>
            ) : (
              <LocationHistoryTable history={locationHistory} />
            )}
          </div>

          {/* Action History */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-start justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-purple-50 flex items-center justify-center">
                  <svg className="w-3.5 h-3.5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 leading-none">Action History</h3>
                  <p className="text-xs text-gray-400 mt-1">Click a row to highlight same user</p>
                </div>
              </div>
              <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-xs font-semibold rounded-full">
                Last 6
              </span>
            </div>
            {actionHistory.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-gray-300 gap-2">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <p className="text-sm text-gray-400">No action history</p>
              </div>
            ) : (
              <ActionHistoryTable history={actionHistory} />
            )}
          </div>

        </div>
      </main>
    </div>
  )
}
