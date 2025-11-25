import React, { useState, useEffect, useRef } from 'react'
import { useI18n } from '../contexts/I18nContext'
import MovieDetails from './MovieDetails'
import './MovieCarousel.css'

const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w500'

export default function MovieList({ movies = [], onSelect }) {
  const { t, language } = useI18n()
  const [selectedMovie, setSelectedMovie] = useState(null)
  const [selectedIndex, setSelectedIndex] = useState(null)
  const [columnsPerRow, setColumnsPerRow] = useState(2)
  const detailsRef = useRef(null)
  
  // Calculate columns per row based on screen size
  useEffect(() => {
    const updateColumns = () => {
      const width = window.innerWidth
      if (width >= 1280) setColumnsPerRow(5) // xl
      else if (width >= 1024) setColumnsPerRow(4) // lg
      else if (width >= 768) setColumnsPerRow(3) // md
      else if (width >= 640) setColumnsPerRow(2) // sm
      else setColumnsPerRow(2) // default
    }
    
    updateColumns()
    window.addEventListener('resize', updateColumns)
    return () => window.removeEventListener('resize', updateColumns)
  }, [])
  
  if (!movies || !Array.isArray(movies) || !movies.length) {
    return null;
  }
  
  const handleMovieClick = async (movie, index) => {
    // Toggle selection - if clicking the same movie, close it
    if (selectedMovie?.id === movie.id) {
      setSelectedMovie(null)
      setSelectedIndex(null)
      if (onSelect) onSelect(null)
      return
    }
    
    // Always fetch full movie details with current language
    try {
      const res = await fetch(`/api/movies/details/${movie.id}?lang=${language}`);
      if (res.ok) {
        const fullMovie = await res.json();
        setSelectedMovie(fullMovie)
        setSelectedIndex(index)
        if (onSelect) onSelect(fullMovie)
      } else {
        setSelectedMovie(movie)
        setSelectedIndex(index)
        if (onSelect) onSelect(movie)
      }
    } catch (error) {
      console.error('Error fetching movie details:', error);
      setSelectedMovie(movie)
      setSelectedIndex(index)
      if (onSelect) onSelect(movie)
    }
  };
  
  const handleCloseDetails = () => {
    setSelectedMovie(null)
    setSelectedIndex(null)
    if (onSelect) onSelect(null)
  }
  
  // Calculate which row the selected movie is in
  const getRowForIndex = (index) => {
    return Math.floor(index / columnsPerRow)
  }
  
  // Calculate the last index in the selected movie's row
  const getLastIndexInRow = (index) => {
    const row = getRowForIndex(index)
    return Math.min((row + 1) * columnsPerRow - 1, movies.length - 1)
  }
  
  // Scroll to selected movie details when selection changes
  useEffect(() => {
    if (selectedMovie && detailsRef.current) {
      setTimeout(() => {
        detailsRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
          inline: 'nearest'
        })
      }, 150)
    }
  }, [selectedMovie])

  const getPosterUrl = (movie) => {
    if (movie.posterUrl && !movie.posterUrl.includes('placehold.co')) {
      return movie.posterUrl;
    }
    if (movie.posterPath && movie.posterPath.trim() !== '' && movie.posterPath !== 'null') {
      if (movie.posterPath.startsWith('http')) {
        return movie.posterPath;
      }
      if (movie.posterPath.startsWith('/')) {
        return `${TMDB_IMAGE_BASE}${movie.posterPath}`;
      }
    }
    if (movie.poster_path && movie.poster_path.trim() !== '' && movie.poster_path !== 'null') {
      if (movie.poster_path.startsWith('http')) {
        return movie.poster_path;
      }
      if (movie.poster_path.startsWith('/')) {
        return `${TMDB_IMAGE_BASE}${movie.poster_path}`;
      }
    }
    return null;
  };
  
  return (
    <div>
      <div 
        className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-6"
        role="list"
        aria-label="Movie search results"
      >
        {movies.map((m, index) => {
          const posterUrl = getPosterUrl(m);
          const isSelected = selectedMovie?.id === m.id;
          const lastIndexInSelectedRow = selectedIndex !== null ? getLastIndexInRow(selectedIndex) : -1;
          const shouldShowDetails = selectedIndex !== null && index === lastIndexInSelectedRow;
          
          return (
            <React.Fragment key={m.id}>
              <div
                className={`movie-card w-full ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
                style={{ 
                  width: '100%',
                  maxWidth: '100%',
                  aspectRatio: '2/3',
                  flex: 'none',
                  transition: 'transform 0.2s ease, ring 0.2s ease'
                }}
                role="listitem"
                aria-label={m.title}
                onClick={() => handleMovieClick(m, index)}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleMovieClick(m, index);
                  }
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.transform = 'scale(1.02)';
                    e.currentTarget.style.zIndex = '10';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.zIndex = '1';
                  }
                }}
              >
            {posterUrl ? (
              <img
                src={posterUrl}
                alt={m.title}
                className="movie-card-image"
                loading="lazy"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            ) : (
              <div className="w-full h-full bg-gray-800 dark:bg-gray-700 flex items-center justify-center rounded-lg">
                <span className="text-gray-400 text-xs text-center px-2">{m.title}</span>
              </div>
            )}
            {/* Always visible overlay with all information */}
            <div className="movie-card-overlay" style={{ opacity: 1, padding: '0.75rem 0.5rem 0.5rem' }}>
              <div className="movie-card-title mb-0.5" style={{ fontSize: '0.8125rem', lineHeight: '1.125rem' }}>
                {m.title}
              </div>
              {m.releaseDate && (
                <div className="text-xs text-gray-300 mb-1.5" style={{ textShadow: '0 1px 3px rgba(0, 0, 0, 0.8)' }}>
                  {m.releaseDate}
                </div>
              )}
              {m.overview && (
                <p className="text-xs text-gray-200 line-clamp-2 leading-tight" style={{ textShadow: '0 1px 3px rgba(0, 0, 0, 0.8)' }}>
                  {m.overview}
                </p>
              )}
            </div>
          </div>
          
          {/* Insert MovieDetails after the last item in the selected row */}
          {shouldShowDetails && selectedMovie && (
            <div 
              ref={detailsRef}
              className="col-span-full"
              style={{
                gridColumn: '1 / -1',
                animation: 'slideDown 0.4s ease-out'
              }}
            >
              <MovieDetails movie={selectedMovie} onClose={handleCloseDetails} />
            </div>
          )}
        </React.Fragment>
          );
        })}
      </div>
      
      {/* CSS animation */}
      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
            max-height: 0;
          }
          to {
            opacity: 1;
            transform: translateY(0);
            max-height: 2000px;
          }
        }
      `}</style>
    </div>
  )
}
