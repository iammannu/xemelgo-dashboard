const cards = [
  {
    key: 'total',
    label: 'Total Items',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
      </svg>
    ),
    iconBg: 'bg-gray-100 text-gray-500',
    countColor: 'text-gray-900',
  },
  {
    key: 'Asset',
    label: 'Assets',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10" />
      </svg>
    ),
    iconBg: 'bg-blue-50 text-blue-500',
    countColor: 'text-blue-600',
  },
  {
    key: 'Inventory',
    label: 'Inventory',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
    iconBg: 'bg-green-50 text-green-500',
    countColor: 'text-green-600',
  },
  {
    key: 'Work Order',
    label: 'Work Orders',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    iconBg: 'bg-purple-50 text-purple-500',
    countColor: 'text-purple-600',
  },
]

export default function DashboardSummary({ items }) {
  const counts = {
    total: items.length,          // total number of items = 12
    Asset: items.filter(i => i.solution_type === 'Asset').length,     // total legth of assets = 4
    Inventory: items.filter(i => i.solution_type === 'Inventory').length,   // total legth of inventory = 4
    'Work Order': items.filter(i => i.solution_type === 'Work Order').length,   // total legth of work order = 4
  }

  return (
    <div className="grid grid-cols-4 gap-4 mb-6">
      {cards.map(({ key, label, icon, iconBg, countColor }) => (
        <div key={key} className="bg-white rounded-xl border border-gray-200 shadow-sm px-5 py-4 flex items-center gap-4">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${iconBg}`}>
            {icon}
          </div>
          <div>
            <p className="text-xs text-gray-400 font-medium">{label}</p>
            <p className={`text-2xl font-bold leading-tight ${countColor}`}>{counts[key]}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
