import { useState } from 'react'

const actionBadge = {
  Moved:    'bg-blue-50 text-blue-600 ring-1 ring-blue-200',
  Missing:  'bg-red-50 text-red-500 ring-1 ring-red-200',
  Scanned:  'bg-green-50 text-green-600 ring-1 ring-green-200',
  Consumed: 'bg-red-50 text-red-600 ring-1 ring-red-200',
  Received: 'bg-purple-50 text-purple-600 ring-1 ring-purple-200',
  Complete: 'bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200',
}

const avatarPalette = [
  'bg-blue-100 text-blue-700',
  'bg-purple-100 text-purple-700',
  'bg-green-100 text-green-700',
  'bg-amber-100 text-amber-700',
  'bg-pink-100 text-pink-700',
  'bg-indigo-100 text-indigo-700',
]

const formatTimestamp = (ts) => {
  const d = new Date(ts)
  const date = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  const time = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
  return `${date} • ${time}`
}

const getInitials = (name) =>
  name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()

const getAvatarColor = (name) =>
  avatarPalette[name.charCodeAt(0) % avatarPalette.length]

export default function ActionHistoryTable({ history }) {
  const [highlightedUser, setHighlightedUser] = useState(null)

  const latest = [...history]
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, 6)

  const handleRowClick = (userName) =>
    setHighlightedUser(prev => prev === userName ? null : userName)

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100">
            <th className="text-center w-12 px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">#</th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">User</th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Action</th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {latest.map((row, idx) => {
            const isHighlighted = highlightedUser === row.user_name
            return (
              <tr
                key={row.id}
                onClick={() => handleRowClick(row.user_name)}
                className={`cursor-pointer border-b border-gray-50 transition-all duration-150
                  ${isHighlighted
                    ? 'bg-blue-50 ring-1 ring-inset ring-blue-100'
                    : 'hover:bg-gray-50/70'}`}
              >
                <td className="px-4 py-3.5 text-center">
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-gray-100 text-gray-400 text-xs font-bold">
                    {idx + 1}
                  </span>
                </td>
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 shadow-sm ${getAvatarColor(row.user_name)}`}>
                      {getInitials(row.user_name)}
                    </div>
                    <span className="font-semibold text-gray-700 text-sm">{row.user_name}</span>
                  </div>
                </td>
                <td className="px-4 py-3.5">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${actionBadge[row.action] || 'bg-gray-100 text-gray-500'}`}>
                    {row.action}
                  </span>
                </td>
                <td className="px-4 py-3.5 text-gray-400 text-xs font-medium whitespace-nowrap">
                  {formatTimestamp(row.timestamp)}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
