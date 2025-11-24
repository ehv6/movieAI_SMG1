import React, { useContext, useEffect, useRef } from 'react'

import { useI18n } from '../contexts/I18nContext'
import WhereToWatch from './WhereToWatch'
import { FavoritesContext } from '../contexts/FavoritesContext'

const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w500'

export default function MovieDetails({ movie, onClose }) {
  const { t, language } = useI18n()
  const closeButtonRef = useRef(null)
  const detailsRef = useRef(null)

  const [movieData, setMovieData] = React.useState(movie)
  
  const { addFavorite, removeFavorite, isFavorite } = 
    useContext(FavoritesContext);

  const isFav = movieData && isFavorite(movieData.id);


  // Always fetch movie details with current language when movie or language changes
  useEffect(() => {
    if (movie?.id) {
      async function fetchMovieDetails() {
        try {
          // Add timestamp to prevent caching issues
          const res = await fetch(`/api/movies/details/${movie.id}?lang=${language}&t=${Date.now()}`);
          if (res.ok) {
            const fullMovie = await res.json();
            setMovieData(fullMovie);
          } else {
            // Fallback to existing movie data if fetch fails
            setMovieData(movie);
          }
        } catch (error) {
          console.error('Error fetching movie details:', error);
          // Fallback to existing movie data on error
          setMovieData(movie);
        }
      }
      fetchMovieDetails();
    } else {
      setMovieData(movie);
    }
  }, [movie?.id, language, movie])

  // Focus management for accessibility
  useEffect(() => {
    if (movieData && detailsRef.current) {
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
  }, [movieData, onClose])

  if (!movie || !movieData) return null;
  
  // Handle both posterPath (from search) and posterUrl (from carousel)
  const posterUrl = movie.posterUrl || (movie.posterPath ? `${TMDB_IMAGE_BASE}${movie.posterPath}` : '');
  
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
          alt={`${movieData.title} poster`}
          className="w-40 h-auto rounded-lg object-cover"
          loading="lazy"
          onError={(e) => {
            // Fallback if image fails to load
            e.target.style.display = 'none'
          }}
        />
      )}
      <div className="flex-1">
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex-1">
            <h2 id="movie-title" className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              {movieData.title}
            </h2>

            <div className="mt-2">
              <button
                onClick={() => 
                  isFav ? removeFavorite(movieData.id) : addFavorite(movieData)
                }
                className={`px-3 py-1 rounded-md border transition
                  ${
                    isFav
                      ? 'bg-red-600 text-white border-red-700'
                      : 'bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-700'
                  }`}
              >
                {isFav ? '♥ Favorited' : '♡ Add to Favorites'}
              </button>


            </div>
            {movie.releaseDate && (
              <div className="text-base font-medium text-gray-600 dark:text-gray-300 mb-3" aria-label={`Released: ${movie.releaseDate}`}>
                <span className="font-semibold">Release Date:</span> {movie.releaseDate}
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
        {movieData.overview ? (
          <div className="mt-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">{t('description')}</h3>
            <p className="text-base leading-7 text-gray-700 dark:text-gray-300">
              {movieData.overview}
            </p>
          </div>
        ) : (
          <div className="mt-4">
            <p className="text-base text-gray-500 dark:text-gray-400 italic">{t('noDescription')}</p>
          </div>
        )}
      </div>

      <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            {t('whereToWatch')}
          </h3>
          <WhereToWatch movieId={movieData.id} />
        </div>

    </div>
  );
}


