import React from 'react';
import MovieCarouselRow from './MovieCarouselRow.jsx';
import { useI18n } from '../contexts/I18nContext';

export default function CarouselSection({ onMovieSelect }) {
  const { t } = useI18n();
  
  return (
    <div className="bg-gray-100 dark:bg-gray-900 py-8 xl:py-10 2xl:py-12 px-6 xl:px-12 2xl:px-16">
      <MovieCarouselRow title={t('featuredMovies')} fetchUrl="/api/movies/featured" onMovieSelect={onMovieSelect} />
      <MovieCarouselRow title={t('newReleases')} fetchUrl="/api/movies/new-releases" onMovieSelect={onMovieSelect} />
      <MovieCarouselRow title={t('action')} fetchUrl="/api/movies/action" onMovieSelect={onMovieSelect} />
      <MovieCarouselRow title={t('scifi')} fetchUrl="/api/movies/scifi" onMovieSelect={onMovieSelect} />
      <MovieCarouselRow title={t('comedy')} fetchUrl="/api/movies/comedy" onMovieSelect={onMovieSelect} />
      <MovieCarouselRow title={t('thriller')} fetchUrl="/api/movies/thriller" onMovieSelect={onMovieSelect} />
      <MovieCarouselRow title={t('horror')} fetchUrl="/api/movies/horror" onMovieSelect={onMovieSelect} />
      <MovieCarouselRow title={t('suspense')} fetchUrl="/api/movies/suspense" onMovieSelect={onMovieSelect} />
      <MovieCarouselRow title={t('drama')} fetchUrl="/api/movies/drama" onMovieSelect={onMovieSelect} />
    </div>
  );
}

