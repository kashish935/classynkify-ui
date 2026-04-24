export default function LessonSidebar({ lessons, activeIndex, onSelect, completedSet }) {
  return (
    <div className="flex flex-col h-full bg-white border-l border-gray-200">
      <div className="px-4 py-3 border-b border-gray-200">
        <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
          Course Lessons
        </h2>
        <p className="text-xs text-gray-400 mt-0.5">
          {completedSet.size} / {lessons.length} completed
        </p>
      </div>

      <ul className="overflow-y-auto flex-1 divide-y divide-gray-100">
        {lessons.map((lesson, idx) => {
          const isActive = idx === activeIndex
          const isDone = completedSet.has(lesson._id)

          return (
            <li
              key={lesson._id}
              onClick={() => onSelect(idx)}
              className={`flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors
                ${isActive ? 'bg-indigo-50 border-l-4 border-indigo-500' : 'hover:bg-gray-50 border-l-4 border-transparent'}
              `}
            >
              {/* Status icon */}
              <div className="mt-0.5 shrink-0">
                {isDone ? (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-500 text-white text-xs">✓</span>
                ) : (
                  <span className={`flex h-5 w-5 items-center justify-center rounded-full border-2 text-xs font-medium
                    ${isActive ? 'border-indigo-500 text-indigo-500' : 'border-gray-300 text-gray-400'}`}>
                    {idx + 1}
                  </span>
                )}
              </div>

              {/* Lesson info */}
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium truncate ${isActive ? 'text-indigo-700' : 'text-gray-800'}`}>
                  {lesson.title}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">{lesson.duration}</p>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}