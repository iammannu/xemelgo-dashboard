import { useState } from 'react'

const formatTimestamp = (ts) => {
  const d = new Date(ts)
  const date = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  const time = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
  return `${date} • ${time}`
}

export default function LocationHistoryTable({ history }) {
  const [highlightedLocation, setHighlightedLocation] = useState(null)

  const latest = [...history]
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, 6)

  const handleRowClick = (location) =>
    setHighlightedLocation(prev => prev === location ? null : location)

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100">
            <th className="text-center w-12 px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">#</th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Location</th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {latest.map((row, idx) => {
            const isHighlighted = highlightedLocation === row.location
            return (
              <tr
                key={row.id}
                onClick={() => handleRowClick(row.location)}
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
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors
                      ${isHighlighted ? 'bg-blue-100 text-blue-500' : 'bg-gray-100 text-gray-400'}`}>
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <span className="font-semibold text-gray-700 text-sm">{row.location}</span>
                  </div>
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
