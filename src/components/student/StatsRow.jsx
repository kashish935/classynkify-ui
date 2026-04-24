const statCards = [
  { key: 'enrolled',  label: 'Enrolled Courses', color: 'bg-blue-50 text-blue-700' },
  { key: 'completed', label: 'Completed',         color: 'bg-green-50 text-green-700' },
  { key: 'pending',   label: 'In Progress',       color: 'bg-amber-50 text-amber-700' },
]

export default function StatsRow({ stats }) {
  if (!stats) return null

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {statCards.map(({ key, label, color }) => (
        <div key={key} className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
          <p className="text-sm text-gray-500 mb-1">{label}</p>
          <p className={`text-3xl font-semibold ${color} w-fit px-3 py-1 rounded-lg`}>
            {stats[key] ?? 0}
          </p>
        </div>
      ))}
    </div>
  )
}