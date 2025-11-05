import React from 'react'
import { useI18n } from '../contexts/I18nContext'

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' }
]

export default function LanguageSwitch() {
  const { language, setLanguage, t } = useI18n()

  return (
    <div className="relative" role="group" aria-label={t('language')}>
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 appearance-none pr-8 cursor-pointer"
        aria-label={t('language')}
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.flag} {lang.name}
          </option>
        ))}
      </select>
      <span className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" aria-hidden="true">
        ▼
      </span>
    </div>
  )
}

