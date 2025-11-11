import React from 'react';
import MovieCarouselRow from './MovieCarouselRow.jsx';

export default function CarouselSection({ onMovieSelect }) {
  return (
    <div className="bg-gray-900 py-8 px-12">
      <MovieCarouselRow title="Featured Movies" fetchUrl="/api/movies/featured" onMovieSelect={onMovieSelect} />
      <MovieCarouselRow title="New Releases" fetchUrl="/api/movies/new-releases" onMovieSelect={onMovieSelect} />
      <MovieCarouselRow title="Action" fetchUrl="/api/movies/action" onMovieSelect={onMovieSelect} />
      <MovieCarouselRow title="Sci-Fi" fetchUrl="/api/movies/scifi" onMovieSelect={onMovieSelect} />
      <MovieCarouselRow title="Comedy" fetchUrl="/api/movies/comedy" onMovieSelect={onMovieSelect} />
      <MovieCarouselRow title="Thriller" fetchUrl="/api/movies/thriller" onMovieSelect={onMovieSelect} />
      <MovieCarouselRow title="Horror" fetchUrl="/api/movies/horror" onMovieSelect={onMovieSelect} />
      <MovieCarouselRow title="Suspense" fetchUrl="/api/movies/suspense" onMovieSelect={onMovieSelect} />
      <MovieCarouselRow title="Drama" fetchUrl="/api/movies/drama" onMovieSelect={onMovieSelect} />
    </div>
  );
}

