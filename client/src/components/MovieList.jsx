import React from 'react'
import { useI18n } from '../contexts/I18nContext'

export default function MovieList({ movies = [], onSelect }) {
  const { t } = useI18n()
  
  if (!movies.length) return null;
  
  return (
    <div 
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6"
      role="list"
      aria-label="Movie search results"
    >
      {movies.map((m, index) => (
        <button
          key={m.id}
          className="bg-white dark:bg-gray-800 rounded-xl shadow dark:shadow-gray-700 p-3 text-left hover:shadow-md dark:hover:shadow-gray-600 transition-shadow focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
          onClick={() => onSelect && onSelect(m)}
          aria-label={t('accessibility.movieCard', { title: m.title })}
          role="listitem"
          tabIndex={0}
        >
          <div className="font-semibold text-gray-900 dark:text-gray-100">{m.title}</div>
          {m.releaseDate && (
            <div className="text-sm text-gray-500 dark:text-gray-400" aria-label={`Released: ${m.releaseDate}`}>
              {m.releaseDate}
            </div>
          )}
          {m.overview && (
            <p className="text-sm mt-2 line-clamp-3 text-gray-700 dark:text-gray-300">
              {m.overview}
            </p>
          )}
        </button>
      ))}
    </div>
  )
}
