import React, { useState } from 'react'

export default function SearchBar({ onSearch, onAiSearch }) {
  const [query, setQuery] = useState('');

  return (
    <div className="flex gap-2">
      <input
        className="flex-1 border rounded-xl px-3 py-2"
        placeholder="Search movies by title..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter') onSearch(query) }}
      />
      <button
        className="px-4 py-2 rounded-xl bg-blue-600 text-white"
        onClick={() => onSearch(query)}
      >
        Search
      </button>
      <button
        className="px-4 py-2 rounded-xl bg-gray-800 text-white"
        onClick={() => onAiSearch(query)}
      >
        AI Search
      </button>
    </div>
  )
}
