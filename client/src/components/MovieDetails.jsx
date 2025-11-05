import React from 'react'

const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w500'

export default function MovieDetails({ movie, onClose }) {
  if (!movie) return null;
  const posterUrl = movie.posterPath ? `${TMDB_IMAGE_BASE}${movie.posterPath}` : ''
  return (
    <div className="mt-6 bg-white rounded-xl shadow p-4 flex gap-4">
      {posterUrl && (
        <img
          src={posterUrl}
          alt={`${movie.title} poster`}
          className="w-40 h-auto rounded-lg object-cover"
        />
      )}
      <div className="flex-1">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold">{movie.title}</h2>
            {movie.releaseDate && (
              <div className="text-sm text-gray-500">{movie.releaseDate}</div>
            )}
          </div>
          {onClose && (
            <button
              className="px-3 py-1 rounded-lg bg-gray-200 hover:bg-gray-300"
              onClick={onClose}
            >
              Close
            </button>
          )}
        </div>
        {movie.overview && (
          <p className="mt-3 text-sm leading-6 whitespace-pre-line">{movie.overview}</p>
        )}
      </div>
    </div>
  )
}


