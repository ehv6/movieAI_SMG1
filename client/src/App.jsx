import React, { useState } from 'react'
import { ThemeProvider } from './contexts/ThemeContext'
import { SearchHistoryProvider, useSearchHistory } from './contexts/SearchHistoryContext'
import { I18nProvider, useI18n } from './contexts/I18nContext'
import SearchBar from './components/SearchBar.jsx'
import MovieList from './components/MovieList.jsx'
import MovieDetails from './components/MovieDetails.jsx'
import ThemeToggle from './components/ThemeToggle.jsx'
import SearchHistory from './components/SearchHistory.jsx'
import LanguageSwitch from './components/LanguageSwitch.jsx'
import CarouselSection from './components/CarouselSection.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'

function AppContent() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState(null);
  const { addToHistory } = useSearchHistory();
  const { t, language } = useI18n();

  async function handleSearch(query) {
    try {
      setLoading(true);
      setError('');
      const res = await fetch(`/api/search?query=${encodeURIComponent(query)}&lang=${language}`);
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Request failed');
      }
      const data = await res.json();
      setMovies(data.movies ?? []);
      setSelected(null);
      addToHistory(query, 'search');
    } catch (e) {
      setError(e.message);
      setMovies([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleAiSearch(query) {
    try {
      setLoading(true);
      setError('');
      const res = await fetch(`/api/ai-search?query=${encodeURIComponent(query)}&lang=${language}`);
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Request failed');
      }
      const data = await res.json();
      setMovies(data.movies ?? []);
      setSelected(null);
      addToHistory(query, 'ai-search');
    } catch (e) {
      setError(e.message);
      setMovies([]);
    } finally {
      setLoading(false);
    }
  }

  function handleReRun(query, type) {
    if (type === 'ai-search') {
      handleAiSearch(query);
    } else {
      handleSearch(query);
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 min-h-screen">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          {t('appTitle')}
        </h1>
        <div className="flex items-center gap-3">
          <LanguageSwitch />
          <ThemeToggle />
        </div>
      </header>
      
      <main>
        <SearchBar onSearch={handleSearch} onAiSearch={handleAiSearch} />
        <SearchHistory onReRun={handleReRun} />
        
        {loading && (
          <p className="mt-4 text-gray-600 dark:text-gray-400" role="status" aria-live="polite">
            {t('loading')}
          </p>
        )}
        
        {error && (
          <div 
            className="mt-4 p-3 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-lg"
            role="alert"
            aria-live="assertive"
          >
            {error}
          </div>
        )}
        
        {!loading && !error && movies.length === 0 && (
          <p className="mt-4 text-gray-500 dark:text-gray-400 text-center">
            {t('noResults')}
          </p>
        )}
        
        <MovieList movies={movies} onSelect={setSelected} />
        <MovieDetails movie={selected} onClose={() => setSelected(null)} />
      </main>
      
      {/* === ADD NEW COMPONENT BELOW EXISTING CONTENT === */}
      <ErrorBoundary>
        <CarouselSection onMovieSelect={setSelected} />
      </ErrorBoundary>
    </div>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <I18nProvider>
        <SearchHistoryProvider>
          <AppContent />
        </SearchHistoryProvider>
      </I18nProvider>
    </ThemeProvider>
  )
}
