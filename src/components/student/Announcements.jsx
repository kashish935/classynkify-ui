export default function Announcements({ announcements }) {
  if (!announcements.length) return null

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-700 mb-4">Announcements</h2>
      <div className="space-y-3">
        {announcements.slice(0, 3).map((a, i) => (
          <div key={i} className="bg-amber-50 border border-amber-100 rounded-xl p-4">
            <p className="font-medium text-amber-800 text-sm">{a.title}</p>
            <p className="text-amber-700 text-sm mt-0.5">{a.message}</p>
            <p className="text-xs text-amber-400 mt-2">
              {new Date(a.createdAt).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}