import React, { useContext, useEffect, useRef, useState } from 'react'

import { useI18n } from '../contexts/I18nContext'
import WhereToWatch from './WhereToWatch'
import { FavoritesContext } from '../contexts/FavoritesContext'

const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w500'

export default function MovieDetails({ movie, onClose }) {
  const { t, language } = useI18n()
  const lang = (language || 'en').toLowerCase();
  const addedLabel =
    lang.startsWith('es') ? 'Agregar a favoritos' :
    lang.startsWith('fr') ? 'Ajouter aux favoris' :
    'Add to Favorites';
  const favoritedLabel =
    lang.startsWith('es') ? 'En favoritos' :
    lang.startsWith('fr') ? 'Dans les favoris' :
    'Favorited';
  const closeButtonRef = useRef(null)
  const detailsRef = useRef(null)

  const [movieData, setMovieData] = useState(movie || null)
  
  const { addFavorite, removeFavorite, isFavorite } = 
    useContext(FavoritesContext);

  const isFav = movieData && isFavorite(movieData?.id);

  // Handle both posterPath (from search) and posterUrl (from carousel)
  // Check movieData first (from details API), then fallback to movie prop
  const posterUrl = movieData?.posterUrl 
    || (movieData?.posterPath ? `${TMDB_IMAGE_BASE}${movieData.posterPath}` : '')
    || movie?.posterUrl 
    || (movie?.posterPath ? `${TMDB_IMAGE_BASE}${movie.posterPath}` : '')
    || (movie?.poster_path ? `${TMDB_IMAGE_BASE}${movie.poster_path}` : '');

  // Always fetch movie details with current language when movie or language changes
  useEffect(() => {
    if (!movie) {
      setMovieData(null);
      return;
    }
    
    // Use movie.id for the fetch, but store the full movie object
    const movieId = movie.id;
    if (movieId) {
      async function fetchMovieDetails() {
        try {
          // Add timestamp to prevent caching issues
          const res = await fetch(`/api/movies/details/${movieId}?lang=${language}&t=${Date.now()}`);
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
    if (!movieData || !detailsRef.current) return;
    
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
  }, [movieData, onClose])

  if (!movie || !movieData) return null;
  
  return (
    <div
      ref={detailsRef}
      className="mt-4 relative rounded-xl overflow-hidden shadow-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
      role="dialog"
      aria-modal="true"
      aria-labelledby="movie-title"
      tabIndex={-1}
      style={{
        backgroundImage: posterUrl ? `url(${posterUrl})` : 'none',
        backgroundSize: posterUrl ? 'auto 100%' : 'contain',
        backgroundPosition: 'right center',
        backgroundRepeat: 'no-repeat',
        backgroundColor: posterUrl ? '#000' : '#1f2937',
        minHeight: '600px'
      }}
    >
      {/* Gradient overlay - seamless transition from black to poster */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 40%, rgba(0,0,0,0.98) 45%, rgba(0,0,0,0.95) 50%, rgba(0,0,0,0.9) 55%, rgba(0,0,0,0.8) 60%, rgba(0,0,0,0.7) 65%, rgba(0,0,0,0.6) 70%, rgba(0,0,0,0.5) 75%, rgba(0,0,0,0.4) 80%, rgba(0,0,0,0.3) 85%, rgba(0,0,0,0.2) 90%, rgba(0,0,0,0.1) 95%, transparent 100%)'
        }}
      />
      
      {/* Fallback for movies without posters */}
      {!posterUrl && (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-800" />
      )}

      {/* Content overlay */}
      <div className="relative p-6 md:p-8 xl:p-10 2xl:p-12 text-white">
        {/* Header with Close button */}
        <div className="flex items-start justify-between mb-4 xl:mb-6">
          <h2 id="movie-title" className="text-3xl md:text-4xl xl:text-5xl 2xl:text-6xl font-bold mb-2 text-shadow-lg flex-1">
            {movieData.title}
          </h2>
          {onClose && (
            <button
              ref={closeButtonRef}
              className="px-4 py-2 rounded-lg bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 focus:outline-none focus:ring-2 focus:ring-white/50 transition-colors flex-shrink-0 ml-4"
              onClick={onClose}
              aria-label={t('accessibility.closeDetails')}
            >
              {t('close')}
            </button>
          )}
        </div>

        {/* Action buttons and release date */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <button
            onClick={() => 
              isFav ? removeFavorite(movieData.id) : addFavorite(movieData)
            }
            className={`px-4 py-2 rounded-md border transition backdrop-blur-sm
              ${
                isFav
                  ? 'bg-red-600/90 text-white border-red-700 hover:bg-red-700/90'
                  : 'bg-white/20 text-white border-white/30 hover:bg-white/30'
              }`}
          >
            {isFav ? '♥ Favorited' : '♡ Add to Favorites'}
          </button>
          
          {movieData.releaseDate && (
            <div className="text-base font-medium text-gray-200 text-shadow-md" aria-label={`Released: ${movieData.releaseDate}`}>
              <span className="font-semibold">Release Date:</span> {movieData.releaseDate}
            </div>
          )}
        </div>

        {/* Description */}
        {movieData.overview ? (
          <div className="mb-6 max-w-3xl xl:max-w-4xl 2xl:max-w-5xl">
            <h3 className="text-xl xl:text-2xl font-semibold mb-3 text-shadow-md">{t('description')}</h3>
            <div className="bg-black/40 backdrop-blur-md rounded-lg p-4 xl:p-6 border border-white/10 shadow-lg">
              <p className="text-base xl:text-lg leading-7 text-gray-100">
                {movieData.overview}
              </p>
            </div>
          </div>
        ) : (
          <div className="mb-6">
            <div className="bg-black/40 backdrop-blur-md rounded-lg p-4 xl:p-6 border border-white/10 max-w-3xl xl:max-w-4xl 2xl:max-w-5xl">
              <p className="text-base text-gray-300 italic">{t('noDescription')}</p>
            </div>
          </div>
        )}

        {/* Where to Watch section */}
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4 text-shadow-md">
            {t('whereToWatch')}
          </h3>
          <WhereToWatch movieId={movieData.id} />
        </div>
      </div>
    </div>
  );
}
