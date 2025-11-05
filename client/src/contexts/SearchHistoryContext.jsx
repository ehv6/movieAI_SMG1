import React, { createContext, useContext, useState, useEffect } from 'react'

const SearchHistoryContext = createContext()

export function SearchHistoryProvider({ children }) {
  const [history, setHistory] = useState(() => {
    // Load from localStorage
    const saved = localStorage.getItem('searchHistory')
    return saved ? JSON.parse(saved) : []
  })

  useEffect(() => {
    // Persist to localStorage whenever history changes
    localStorage.setItem('searchHistory', JSON.stringify(history))
  }, [history])

  const addToHistory = (query, type = 'search') => {
    if (!query || !query.trim()) return
    
    const entry = {
      id: Date.now(),
      query: query.trim(),
      type, // 'search' or 'ai-search'
      timestamp: new Date().toISOString()
    }

    setHistory(prev => {
      // Remove duplicates and add new entry at the beginning
      const filtered = prev.filter(h => h.query !== entry.query || h.type !== entry.type)
      return [entry, ...filtered].slice(0, 50) // Keep max 50 entries
    })
  }

  const clearHistory = () => {
    setHistory([])
  }

  const removeFromHistory = (id) => {
    setHistory(prev => prev.filter(h => h.id !== id))
  }

  return (
    <SearchHistoryContext.Provider value={{ history, addToHistory, clearHistory, removeFromHistory }}>
      {children}
    </SearchHistoryContext.Provider>
  )
}

export function useSearchHistory() {
  const context = useContext(SearchHistoryContext)
  if (!context) {
    throw new Error('useSearchHistory must be used within a SearchHistoryProvider')
  }
  return context
}

