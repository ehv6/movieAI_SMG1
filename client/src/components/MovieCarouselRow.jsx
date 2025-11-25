import React, { useRef, useState, useEffect } from 'react';
import './MovieCarousel.css';
import { useI18n } from '../contexts/I18nContext';
import MovieDetails from './MovieDetails';

function MovieCarouselRow({ title, fetchUrl, movies: providedMovies, onMovieSelect }) {
  const { t, language } = useI18n();
  const carouselRef = useRef(null);
  const detailsRef = useRef(null);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMovie, setSelectedMovie] = useState(null);
  
  // Drag-to-scroll state
  const [isDown, setIsDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  
  // Arrow visibility state
  const [showPrevArrow, setShowPrevArrow] = useState(false);
  
  // Hover-to-autoscroll state
  const [isHovering, setIsHovering] = useState(false);
  const autoScrollIntervalRef = useRef(null);

  // Fetch movies on mount and when language changes
  useEffect(() => {
    async function fetchMovies() {
      try {
        setLoading(true);
        const url = `${fetchUrl}${fetchUrl.includes('?') ? '&' : '?'}lang=${language}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        setMovies(data);
      } catch (error) {
        console.error('Error fetching movies:', error);
        setMovies([]);
      } finally {
        setLoading(false);
      }
    }
    fetchMovies();
  }, [fetchUrl, language]);

  // Update arrow visibility
  const updateArrowVisibility = () => {
    if (carouselRef.current) {
      setShowPrevArrow(carouselRef.current.scrollLeft > 0);
    }
  };

  // Stop auto-scroll
  const stopAutoScroll = () => {
    if (autoScrollIntervalRef.current) {
      clearInterval(autoScrollIntervalRef.current);
      autoScrollIntervalRef.current = null;
    }
  };

  // Start auto-scroll on hover
  useEffect(() => {
    if (isHovering && !isDown && carouselRef.current) {
      autoScrollIntervalRef.current = setInterval(() => {
        if (carouselRef.current) {
          const maxScroll = carouselRef.current.scrollWidth - carouselRef.current.clientWidth;
          if (carouselRef.current.scrollLeft < maxScroll) {
            carouselRef.current.scrollLeft += 1;
            updateArrowVisibility();
          } else {
            stopAutoScroll();
          }
        }
      }, 50);
    } else {
      stopAutoScroll();
    }

    return () => stopAutoScroll();
  }, [isHovering, isDown]);

  // Drag-to-scroll handlers
  const handleMouseDown = (e) => {
    if (!carouselRef.current) return;
    stopAutoScroll();
    setIsDown(true);
    setStartX(e.pageX - carouselRef.current.offsetLeft);
    setScrollLeft(carouselRef.current.scrollLeft);
    carouselRef.current.style.cursor = 'grabbing';
  };

  const handleMouseLeave = () => {
    setIsDown(false);
    if (carouselRef.current) {
      carouselRef.current.style.cursor = 'grab';
    }
  };

  const handleMouseUp = () => {
    setIsDown(false);
    if (carouselRef.current) {
      carouselRef.current.style.cursor = 'grab';
    }
  };

  const handleMouseMove = (e) => {
    if (!isDown || !carouselRef.current) return;
    e.preventDefault();
    const x = e.pageX - carouselRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    carouselRef.current.scrollLeft = scrollLeft - walk;
    updateArrowVisibility();
  };

  const handleScroll = () => {
    updateArrowVisibility();
  };

  // Mouse enter/leave for hover-to-autoscroll
  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeaveCarousel = () => {
    setIsHovering(false);
    setIsDown(false);
    stopAutoScroll();
    if (carouselRef.current) {
      carouselRef.current.style.cursor = 'grab';
    }
  };

  // Arrow navigation
  const scroll = (direction) => {
    if (!carouselRef.current) return;
    stopAutoScroll();
    
    const scrollAmount = carouselRef.current.clientWidth * 0.8;
    const newScrollLeft = 
      direction === 'next' 
        ? carouselRef.current.scrollLeft + scrollAmount
        : carouselRef.current.scrollLeft - scrollAmount;
    
    carouselRef.current.scrollTo({
      left: newScrollLeft,
      behavior: 'smooth'
    });
    
    setTimeout(() => {
      updateArrowVisibility();
    }, 300);
  };

  // Initial arrow visibility check
  useEffect(() => {
    updateArrowVisibility();
  }, [movies]);
  
  // Scroll to selected movie details when selection changes
  useEffect(() => {
    if (selectedMovie && detailsRef.current) {
      // Small delay to ensure DOM is updated and animation starts
      setTimeout(() => {
        detailsRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
          inline: 'nearest'
        })
      }, 150)
    }
  }, [selectedMovie])

  if (loading) {
    return (
      <div className="carousel-row mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{title}</h2>
        <div className="text-gray-900 dark:text-white">{t('loading')}</div>
      </div>
    );
  }

  if (movies.length === 0) {
    return null;
  }

  return (
    <div 
      className="carousel-row mb-8"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeaveCarousel}
    >
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{title}</h2>
      <div className="relative group">
        {/* Previous Arrow - only show when no movie is selected */}
        {showPrevArrow && !selectedMovie && (
          <button
            className="nav-arrow nav-arrow-left"
            onClick={() => scroll('prev')}
            onMouseEnter={() => {
              stopAutoScroll();
              setIsHovering(false);
            }}
            aria-label={`Scroll ${title} left`}
          >
            ‹
          </button>
        )}
        
        {/* Next Arrow - only show when no movie is selected */}
        {!selectedMovie && (
          <button
            className="nav-arrow nav-arrow-right"
            onClick={() => scroll('next')}
            onMouseEnter={() => {
              stopAutoScroll();
              setIsHovering(false);
            }}
            aria-label={`Scroll ${title} right`}
          >
            ›
          </button>
        )}

        {/* Movie List Container */}
        <div
          ref={carouselRef}
          className="movie-list"
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onScroll={handleScroll}
          role="list"
          aria-label={`${title} carousel`}
        >
          {movies.map((movie) => (
            <div
              key={movie.id}
              className={`movie-card ${selectedMovie?.id === movie.id ? 'ring-2 ring-blue-500' : ''}`}
              role="listitem"
              aria-label={movie.title}
              style={{
                transition: 'transform 0.2s ease, ring 0.2s ease'
              }}
              onClick={async (e) => {
                e.stopPropagation();
                
                // Toggle selection - if clicking the same movie, close it
                if (selectedMovie?.id === movie.id) {
                  setSelectedMovie(null);
                  if (onMovieSelect) onMovieSelect(null);
                  return;
                }
                
                // Always fetch full movie details to ensure we have complete data
                try {
                  const res = await fetch(`/api/movies/details/${movie.id}?lang=${language}`);
                  if (res.ok) {
                    const fullMovie = await res.json();
                    setSelectedMovie(fullMovie);
                    if (onMovieSelect) onMovieSelect(fullMovie);
                  } else {
                    // Fallback to carousel movie data if details fetch fails
                    setSelectedMovie(movie);
                    if (onMovieSelect) onMovieSelect(movie);
                  }
                } catch (error) {
                  console.error('Error fetching movie details:', error);
                  // Fallback to carousel movie data on error
                  setSelectedMovie(movie);
                  if (onMovieSelect) onMovieSelect(movie);
                }
              }}
              onMouseDown={(e) => {
                // Prevent drag when clicking on card
                e.stopPropagation();
              }}
            >
              <img
                src={movie.posterUrl}
                alt={movie.title}
                className="movie-card-image"
                loading="lazy"
              />
              <div className="movie-card-overlay">
                <div className="movie-card-title">{movie.title}</div>
              </div>
            </div>
          ))}
        </div>
        
        {/* MovieDetails inline below carousel */}
        {selectedMovie && selectedMovie.id && (
          <div 
            key={`carousel-details-${selectedMovie.id}`}
            ref={detailsRef}
            className="mt-4 movie-details-expand"
            style={{
              animation: 'slideDown 0.4s ease-out'
            }}
          >
            <MovieDetails 
              key={`carousel-movie-details-${selectedMovie.id}`}
              movie={selectedMovie} 
              onClose={() => {
                setSelectedMovie(null);
                if (onMovieSelect) onMovieSelect(null);
              }} 
            />
          </div>
        )}
      </div>
      
      {/* Add CSS animation */}
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
        
        .movie-details-expand {
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}

export default MovieCarouselRow;
