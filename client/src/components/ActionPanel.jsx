import { useState, useEffect } from 'react'
import api from '../api/axios'

const actionConfig = {
  'Asset': [
    { label: 'Move to', value: 'Moved', needsLocation: true },
    { label: 'Mark Missing', value: 'Missing', needsLocation: false },
  ],
  'Inventory': [
    { label: 'Scan at', value: 'Scanned', needsLocation: true },
    { label: 'Consume', value: 'Consumed', needsLocation: false },
  ],
  'Work Order': [
    { label: 'Receive at', value: 'Received', needsLocation: true },
    { label: 'Mark Complete', value: 'Complete', needsLocation: false },
  ],
}           // which button to show depends on sol type

const actionVariant = {
  Moved:    'blue',
  Missing:  'red',
  Scanned:  'green',
  Consumed: 'amber',
  Received: 'purple',
  Complete: 'gray',
}

const variantStyles = {
  blue:   { idle: 'border-blue-200 text-blue-600 bg-white hover:bg-blue-50 hover:border-blue-300',     active: 'bg-blue-600 text-white border-blue-600 shadow-sm shadow-blue-200' },
  red:    { idle: 'border-red-200 text-red-500 bg-white hover:bg-red-50 hover:border-red-300',         active: 'bg-red-500 text-white border-red-500 shadow-sm shadow-red-200' },
  green:  { idle: 'border-green-200 text-green-600 bg-white hover:bg-green-50 hover:border-green-300', active: 'bg-green-600 text-white border-green-600 shadow-sm shadow-green-200' },
  amber:  { idle: 'border-amber-200 text-amber-600 bg-white hover:bg-amber-50 hover:border-amber-300', active: 'bg-amber-500 text-white border-amber-500 shadow-sm shadow-amber-200' },
  purple: { idle: 'border-purple-200 text-purple-600 bg-white hover:bg-purple-50 hover:border-purple-300', active: 'bg-purple-600 text-white border-purple-600 shadow-sm shadow-purple-200' },
  gray:   { idle: 'border-gray-200 text-gray-500 bg-white hover:bg-gray-50 hover:border-gray-300',    active: 'bg-gray-600 text-white border-gray-600 shadow-sm' },
}

export default function ActionPanel({ item, activeUser, onActionSubmit }) {
  const [locations, setLocations] = useState([])
  const [selectedAction, setSelectedAction] = useState(null)
  const [selectedLocation, setSelectedLocation] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const actions = actionConfig[item.solution_type] || []
  const isTerminal = ['missing', 'consumed', 'complete'].includes(item.status)

  useEffect(() => {
    api.get('/locations').then(res => setLocations(res.data))
  }, [])

  const handleActionClick = (action) => {
    setSelectedAction(action)
    setSelectedLocation('')
    setError('')
  }

  const handleSubmit = async () => {
    if (!activeUser) { setError('Please select an active user first'); return }
    if (selectedAction.needsLocation && !selectedLocation) { setError('Please select a location'); return }

    setLoading(true)
    try {
      await api.post(`/items/${item.id}/action`, {
        action: selectedAction.value,
        location_id: selectedAction.needsLocation ? selectedLocation : null,
        user_id: activeUser.id
      })           // what happened when u click submit 
      setSelectedAction(null)
      setSelectedLocation('')
      onActionSubmit()
    } catch {
      setError('Failed to submit action')
    } finally {
      setLoading(false)
    }
  }

  if (isTerminal) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-6 px-4 bg-gray-50 border border-dashed border-gray-200 rounded-xl text-center">
        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-500">No actions available</p>
          <p className="text-xs text-gray-400 mt-0.5">This item is marked as <span className="font-medium capitalize">{item.status}</span></p>
        </div>
      </div>
    )
  }       // if itme is missing, consumed, or complete, show this message and no action buttons

  return (
    <div className="space-y-4">

      {/* Action buttons */}
      <div className="flex gap-2.5 flex-wrap">
        {actions.map(action => {
          const variant = variantStyles[actionVariant[action.value]] || variantStyles.gray
          const isActive = selectedAction?.value === action.value
          return (
            <button
              key={action.value}
              onClick={() => handleActionClick(action)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold border transition-all duration-150
                ${isActive ? variant.active : variant.idle}`}
            >
              {action.label}
            </button>
          )
        })}
      </div>

      {/* Location dropdown */}
      {selectedAction?.needsLocation && (
        <div className="flex items-center gap-2.5 p-3 bg-gray-50 rounded-xl border border-gray-200">
          <div className="w-7 h-7 rounded-lg bg-white border border-gray-200 flex items-center justify-center flex-shrink-0">
            <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <select
            value={selectedLocation}
            onChange={e => setSelectedLocation(e.target.value)}
            className="flex-1 bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            <option value="">Select a location…</option>
            {locations.map(loc => (
              <option key={loc.id} value={loc.id}>{loc.name}</option>
            ))}
          </select>           
        </div>
      )}
      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 px-3 py-2 bg-red-50 border border-red-200 rounded-lg">
          <svg className="w-3.5 h-3.5 text-red-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <p className="text-xs text-red-600 font-medium">{error}</p>
        </div>
      )}

      {/* Submit */}
      {selectedAction && (
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 transition-colors shadow-sm shadow-blue-200"
        >
          {loading ? (
            <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
          ) : (
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          )}
          {loading ? 'Submitting…' : 'Submit Action'}
        </button>
      )}
    </div>
  )
}
