import React from 'react'
export default function MovieList({ movies = [] }) {
  if (!movies.length) return null;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
      {movies.map(m => (
        <div key={m.id} className="bg-white rounded-xl shadow p-3">
          <div className="font-semibold">{m.title}</div>
          {m.releaseDate && <div className="text-sm text-gray-500">{m.releaseDate}</div>}
          {m.overview && <p className="text-sm mt-2 line-clamp-3">{m.overview}</p>}
        </div>
      ))}
    </div>
  )
}
