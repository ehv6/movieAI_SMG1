import React, { useState } from 'react'
import SearchBar from './components/SearchBar.jsx'
import MovieList from './components/MovieList.jsx'

export default function App() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSearch(query) {
    try {
      setLoading(true);
      setError('');
      const res = await fetch(`/api/search?query=${encodeURIComponent(query)}`);
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Request failed');
      }
      const data = await res.json();
      setMovies(data.movies ?? []);
    } catch (e) {
      setError(e.message);
      setMovies([]);
    } finally {
      setLoading(false);
    }
  }

  function handleAiSearch(query) {
    // Stub for demo
    alert('AI Search not implemented yet. (CSV/NLP stub)');
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Movie Search Demo</h1>
      <SearchBar onSearch={handleSearch} onAiSearch={handleAiSearch} />
      {loading && <p className="mt-4">Loading...</p>}
      {error && <p className="mt-4 text-red-600">{error}</p>}
      <MovieList movies={movies} />
    </div>
  )
}
