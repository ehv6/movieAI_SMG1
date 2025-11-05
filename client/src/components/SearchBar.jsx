import React, { useState, useRef, useEffect } from 'react'
import { useI18n } from '../contexts/I18nContext'

export default function SearchBar({ onSearch, onAiSearch }) {
  const [query, setQuery] = useState('');
  const inputRef = useRef(null)
  const { t } = useI18n()

  // Focus management for accessibility
  useEffect(() => {
    // Focus input on mount if no other element has focus
    if (inputRef.current && !document.activeElement) {
      inputRef.current.focus()
    }
  }, [])

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      onSearch(query)
    } else if (e.key === 'Escape') {
      setQuery('')
      inputRef.current?.blur()
    }
  }

  const handleSearch = () => {
    if (query.trim()) {
      onSearch(query)
    }
  }

  const handleAiSearch = () => {
    if (query.trim()) {
      onAiSearch(query)
    }
  }

  return (
    <div className="flex gap-2" role="search" aria-label={t('searchPlaceholder')}>
      <input
        ref={inputRef}
        type="text"
        className="flex-1 border border-gray-300 dark:border-gray-600 rounded-xl px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
        placeholder={t('searchPlaceholder')}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        aria-label={t('accessibility.searchInput')}
        aria-describedby="search-instructions"
      />
      <span id="search-instructions" className="sr-only">
        {t('searchPlaceholder')}. Press Enter to search or Escape to clear.
      </span>
      <button
        type="button"
        className="px-4 py-2 rounded-xl bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={handleSearch}
        aria-label={t('accessibility.searchButton')}
        disabled={!query.trim()}
      >
        {t('searchButton')}
      </button>
      <button
        type="button"
        className="px-4 py-2 rounded-xl bg-gray-800 dark:bg-gray-700 text-white hover:bg-gray-900 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={handleAiSearch}
        aria-label={t('accessibility.aiSearchButton')}
        disabled={!query.trim()}
      >
        {t('aiSearchButton')}
      </button>
    </div>
  )
}
