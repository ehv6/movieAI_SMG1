import React, { useState } from 'react'
import { useSearchHistory } from '../contexts/SearchHistoryContext'
import { useI18n } from '../contexts/I18nContext'

export default function SearchHistory({ onReRun }) {
  const { history, clearHistory, removeFromHistory } = useSearchHistory()
  const { t } = useI18n()
  const [isOpen, setIsOpen] = useState(false)

  if (history.length === 0 && !isOpen) {
    return null
  }

  return (
    <div className="mt-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 rounded-lg transition-colors"
        aria-expanded={isOpen}
        aria-controls="search-history-list"
      >
        <span>{t('searchHistory')}</span>
        <span className="text-xs bg-gray-200 dark:bg-gray-700 px-2 py-0.5 rounded-full">
          {history.length}
        </span>
        <span aria-hidden="true">{isOpen ? '▼' : '▶'}</span>
      </button>

      {isOpen && (
        <div
          id="search-history-list"
          className="mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4"
          role="region"
          aria-label={t('searchHistory')}
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
              {t('recentSearches')}
            </h3>
            {history.length > 0 && (
              <button
                onClick={clearHistory}
                className="text-xs text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 rounded px-2 py-1"
              >
                {t('clearHistory')}
              </button>
            )}
          </div>

          {history.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
              {t('noHistory')}
            </p>
          ) : (
            <ul className="space-y-2 max-h-64 overflow-y-auto" role="list">
              {history.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center justify-between gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
                >
                  <button
                    onClick={() => {
                      onReRun(item.query, item.type)
                      setIsOpen(false)
                    }}
                    className="flex-1 text-left text-sm text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 rounded px-2 py-1"
                    aria-label={t('accessibility.historyItem', { query: item.query })}
                  >
                    <span className="font-medium">{item.query}</span>
                    <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                      ({item.type === 'ai-search' ? t('aiSearchButton') : t('searchButton')})
                    </span>
                  </button>
                  <button
                    onClick={() => removeFromHistory(item.id)}
                    className="opacity-0 group-hover:opacity-100 px-2 py-1 text-xs text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 rounded transition-opacity"
                    aria-label={t('accessibility.removeHistory')}
                    title={t('remove')}
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}

