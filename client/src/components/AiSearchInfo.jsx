import React, { useState } from 'react'
import { useI18n } from '../contexts/I18nContext'

export default function AiSearchInfo() {
  const [isExpanded, setIsExpanded] = useState(false)
  const { t } = useI18n()

  return (
    <div className="mt-4 mb-4">
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 rounded-lg"
          aria-expanded={isExpanded}
          aria-controls="ai-search-info-content"
        >
          <div className="flex items-center gap-2">
            <svg
              className="w-5 h-5 text-blue-600 dark:text-blue-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-100">
              {t('aiSearchInfo.title')}
            </h3>
          </div>
          <svg
            className={`w-5 h-5 text-blue-600 dark:text-blue-400 transition-transform ${
              isExpanded ? 'transform rotate-180' : ''
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {isExpanded && (
          <div
            id="ai-search-info-content"
            className="mt-4 space-y-4 text-sm text-blue-800 dark:text-blue-200"
          >
            <p className="leading-relaxed">
              {t('aiSearchInfo.description')}
            </p>

            <div>
              <h4 className="font-semibold mb-2 text-blue-900 dark:text-blue-100">
                {t('aiSearchInfo.examplesTitle')}
              </h4>
              <ul className="space-y-2 list-disc list-inside ml-2">
                <li>{t('aiSearchInfo.example1')}</li>
                <li>{t('aiSearchInfo.example2')}</li>
                <li>{t('aiSearchInfo.example3')}</li>
                <li>{t('aiSearchInfo.example4')}</li>
                <li>{t('aiSearchInfo.example5')}</li>
              </ul>
            </div>

            <div className="bg-blue-100 dark:bg-blue-900/40 rounded-lg p-3 border border-blue-200 dark:border-blue-700">
              <p className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                {t('aiSearchInfo.howItWorksTitle')}
              </p>
              <p className="text-blue-800 dark:text-blue-200">
                {t('aiSearchInfo.howItWorks')}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

