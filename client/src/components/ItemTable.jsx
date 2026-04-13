import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

const solutionColors = {
  'Asset': 'bg-blue-50 text-blue-700 ring-1 ring-blue-200',          // set color for asset = blue
  'Inventory': 'bg-green-50 text-green-700 ring-1 ring-green-200',   // set color for inventory = green
  'Work Order': 'bg-purple-50 text-purple-700 ring-1 ring-purple-200',  // set color for work order = purple
}

const statusColors = {
  active: 'bg-emerald-50 text-emerald-600',  // set color for active status = green
  missing: 'bg-red-50 text-red-600',      // set color for missing status = red
  consumed: 'bg-amber-50 text-amber-600', // set color for consumed status = orange
  complete: 'bg-gray-100 text-gray-500',   // set color for complete status = gray
}

export default function ItemTable({ items }) {
  const navigate = useNavigate()
  const [highlightedType, setHighlightedType] = useState(null)    

  const handleRowClick = (solutionType) => {
    setHighlightedType(prev => prev === solutionType ? null : solutionType)
  }      // when you click any specific sol all the rows with that sol get highlighted and if you click again it removes the highlight.

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100">
            <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Item</th>
            <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Solution</th>
            <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Location</th>
            <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Status</th>
            <th className="px-6 py-3" />
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {items.map((item) => {
            const isHighlighted = highlightedType === item.solution_type
            return (
              <tr
                key={item.id}
                onClick={() => handleRowClick(item.solution_type)}
                className={`cursor-pointer transition-colors group
                  ${isHighlighted ? 'bg-blue-50/60' : 'hover:bg-gray-50/80'}`}
              >
                <td className="px-6 py-3.5 font-medium text-gray-800">{item.name}</td>
                <td className="px-6 py-3.5">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${solutionColors[item.solution_type]}`}>
                    {item.solution_type}
                  </span>
                </td>
                <td className="px-6 py-3.5 text-gray-500">
                  {item.current_location ? (
                    <span className="flex items-center gap-1.5">
                      <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {item.current_location}
                    </span>
                  ) : (
                    <span className="text-gray-400 text-xs font-medium">N/A</span>
                  )}
                </td>
                <td className="px-6 py-3.5">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${statusColors[item.status] || statusColors.active}`}>
                    {item.status}
                  </span>
                </td>
                <td className="px-6 py-3.5 text-right">
                  <button
                    onClick={e => {
                      e.stopPropagation()   // dont trigger the row highlight when clicking the button
                      navigate(`/items/${item.id}`)     // goes to item1,2,3,........ page when you click the see details button
                    }}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    See Details →
                  </button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
