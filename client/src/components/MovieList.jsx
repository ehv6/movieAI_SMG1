import React from 'react'
export default function MovieList({ movies = [], onSelect }) {
  if (!movies.length) return null;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
      {movies.map(m => (
        <button
          key={m.id}
          className="bg-white rounded-xl shadow p-3 text-left hover:shadow-md transition-shadow"
          onClick={() => onSelect && onSelect(m)}
        >
          <div className="font-semibold">{m.title}</div>
          {m.releaseDate && <div className="text-sm text-gray-500">{m.releaseDate}</div>}
          {m.overview && <p className="text-sm mt-2 line-clamp-3">{m.overview}</p>}
        </button>
      ))}
    </div>
  )
}
