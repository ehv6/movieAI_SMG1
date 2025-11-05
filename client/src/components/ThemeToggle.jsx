import React from 'react'
import { useTheme } from '../contexts/ThemeContext'
import { useI18n } from '../contexts/I18nContext'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const { t } = useI18n()

  return (
    <button
      onClick={toggleTheme}
      className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
      aria-label={t('accessibility.themeToggle')}
      title={t('themeToggle')}
    >
      {theme === 'light' ? (
        <span aria-hidden="true">🌙</span>
      ) : (
        <span aria-hidden="true">☀️</span>
      )}
      <span className="sr-only">{t('themeToggle')}</span>
    </button>
  )
}

