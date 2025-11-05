import React, { useEffect, useRef } from 'react'
import { useI18n } from '../contexts/I18nContext'

const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w500'

export default function MovieDetails({ movie, onClose }) {
  const { t } = useI18n()
  const closeButtonRef = useRef(null)
  const detailsRef = useRef(null)

  // Focus management for accessibility
  useEffect(() => {
    if (movie && detailsRef.current) {
      // Focus the details container when it opens
      detailsRef.current.focus()
      // Trap focus within modal
      const handleKeyDown = (e) => {
        if (e.key === 'Escape' && onClose) {
          onClose()
        }
      }
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }
  }, [movie, onClose])

  if (!movie) return null;
  
  const posterUrl = movie.posterPath ? `${TMDB_IMAGE_BASE}${movie.posterPath}` : ''
  
  return (
    <div
      ref={detailsRef}
      className="mt-6 bg-white dark:bg-gray-800 rounded-xl shadow dark:shadow-gray-700 p-4 flex gap-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
      role="dialog"
      aria-modal="true"
      aria-labelledby="movie-title"
      tabIndex={-1}
    >
      {posterUrl && (
        <img
          src={posterUrl}
          alt={`${movie.title} poster`}
          className="w-40 h-auto rounded-lg object-cover"
          loading="lazy"
          onError={(e) => {
            // Fallback if image fails to load
            e.target.style.display = 'none'
          }}
        />
      )}
      <div className="flex-1">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id="movie-title" className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              {movie.title}
            </h2>
            {movie.releaseDate && (
              <div className="text-sm text-gray-500 dark:text-gray-400" aria-label={`Released: ${movie.releaseDate}`}>
                {movie.releaseDate}
              </div>
            )}
          </div>
          {onClose && (
            <button
              ref={closeButtonRef}
              className="px-3 py-1 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors"
              onClick={onClose}
              aria-label={t('accessibility.closeDetails')}
            >
              {t('close')}
            </button>
          )}
        </div>
        {movie.overview && (
          <p className="mt-3 text-sm leading-6 whitespace-pre-line text-gray-700 dark:text-gray-300">
            {movie.overview}
          </p>
        )}
      </div>
    </div>
  )
}


