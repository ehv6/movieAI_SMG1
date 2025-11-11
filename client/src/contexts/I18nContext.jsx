import React, { createContext, useContext, useState, useEffect } from 'react'

const I18nContext = createContext()

// Translation keys
const translations = {
  en: {
    appTitle: 'Movie Search Demo',
    searchPlaceholder: 'Search movies by title...',
    searchButton: 'Search',
    aiSearchButton: 'AI Search',
    loading: 'Loading...',
    close: 'Close',
    noResults: 'No movies found',
    themeToggle: 'Toggle theme',
    searchHistory: 'Search History',
    clearHistory: 'Clear History',
    noHistory: 'No search history',
    recentSearches: 'Recent Searches',
    reRun: 'Re-run',
    remove: 'Remove',
    language: 'Language',
    // Movie details
    releaseDate: 'Release Date',
    description: 'Description',
    noDescription: 'No description available.',
    whereToWatch: 'Where to Watch',
    // Streaming providers
    stream: 'Stream',
    rent: 'Rent',
    buy: 'Buy',
    noStreamingData: 'No streaming data available.',
    loadingStreamingInfo: 'Loading streaming info...',
    // Carousel sections
    featuredMovies: 'Featured Movies',
    newReleases: 'New Releases',
    action: 'Action',
    scifi: 'Sci-Fi',
    comedy: 'Comedy',
    thriller: 'Thriller',
    horror: 'Horror',
    suspense: 'Suspense',
    drama: 'Drama',
    accessibility: {
      searchInput: 'Search input for movies',
      searchButton: 'Search movies',
      aiSearchButton: 'Search movies using AI',
      movieCard: 'View details for {title}',
      closeDetails: 'Close movie details',
      themeToggle: 'Toggle between light and dark theme',
      historyItem: 'Re-run search: {query}',
      removeHistory: 'Remove from history'
    }
  },
  es: {
    appTitle: 'Búsqueda de Películas Demo',
    searchPlaceholder: 'Buscar películas por título...',
    searchButton: 'Buscar',
    aiSearchButton: 'Búsqueda IA',
    loading: 'Cargando...',
    close: 'Cerrar',
    noResults: 'No se encontraron películas',
    themeToggle: 'Cambiar tema',
    searchHistory: 'Historial de Búsqueda',
    clearHistory: 'Limpiar Historial',
    noHistory: 'Sin historial de búsqueda',
    recentSearches: 'Búsquedas Recientes',
    reRun: 'Re-ejecutar',
    remove: 'Eliminar',
    language: 'Idioma',
    // Movie details
    releaseDate: 'Fecha de Lanzamiento',
    description: 'Descripción',
    noDescription: 'No hay descripción disponible.',
    whereToWatch: 'Dónde Ver',
    // Streaming providers
    stream: 'Transmisión',
    rent: 'Alquilar',
    buy: 'Comprar',
    noStreamingData: 'No hay datos de transmisión disponibles.',
    loadingStreamingInfo: 'Cargando información de transmisión...',
    // Carousel sections
    featuredMovies: 'Películas Destacadas',
    newReleases: 'Nuevos Lanzamientos',
    action: 'Acción',
    scifi: 'Ciencia Ficción',
    comedy: 'Comedia',
    thriller: 'Thriller',
    horror: 'Terror',
    suspense: 'Suspenso',
    drama: 'Drama',
    accessibility: {
      searchInput: 'Entrada de búsqueda de películas',
      searchButton: 'Buscar películas',
      aiSearchButton: 'Buscar películas usando IA',
      movieCard: 'Ver detalles de {title}',
      closeDetails: 'Cerrar detalles de película',
      themeToggle: 'Cambiar entre tema claro y oscuro',
      historyItem: 'Re-ejecutar búsqueda: {query}',
      removeHistory: 'Eliminar del historial'
    }
  },
  fr: {
    appTitle: 'Démo de Recherche de Films',
    searchPlaceholder: 'Rechercher des films par titre...',
    searchButton: 'Rechercher',
    aiSearchButton: 'Recherche IA',
    loading: 'Chargement...',
    close: 'Fermer',
    noResults: 'Aucun film trouvé',
    themeToggle: 'Changer de thème',
    searchHistory: 'Historique de Recherche',
    clearHistory: 'Effacer l\'Historique',
    noHistory: 'Aucun historique de recherche',
    recentSearches: 'Recherches Récentes',
    reRun: 'Ré-exécuter',
    remove: 'Supprimer',
    language: 'Langue',
    // Movie details
    releaseDate: 'Date de Sortie',
    description: 'Description',
    noDescription: 'Aucune description disponible.',
    whereToWatch: 'Où Regarder',
    // Streaming providers
    stream: 'Diffusion',
    rent: 'Louer',
    buy: 'Acheter',
    noStreamingData: 'Aucune donnée de diffusion disponible.',
    loadingStreamingInfo: 'Chargement des informations de diffusion...',
    // Carousel sections
    featuredMovies: 'Films en Vedette',
    newReleases: 'Nouvelles Sorties',
    action: 'Action',
    scifi: 'Science-Fiction',
    comedy: 'Comédie',
    thriller: 'Thriller',
    horror: 'Horreur',
    suspense: 'Suspense',
    drama: 'Drame',
    accessibility: {
      searchInput: 'Champ de recherche de films',
      searchButton: 'Rechercher des films',
      aiSearchButton: 'Rechercher des films avec IA',
      movieCard: 'Voir les détails de {title}',
      closeDetails: 'Fermer les détails du film',
      themeToggle: 'Basculer entre thème clair et sombre',
      historyItem: 'Ré-exécuter la recherche: {query}',
      removeHistory: 'Supprimer de l\'historique'
    }
  }
}

export function I18nProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    // Get saved language from localStorage or default to 'en'
    const saved = localStorage.getItem('language')
    return saved || 'en'
  })

  useEffect(() => {
    // Persist to localStorage
    localStorage.setItem('language', language)
    // Set lang attribute on html element for accessibility
    document.documentElement.lang = language
  }, [language])

  const t = (key, params = {}) => {
    const keys = key.split('.')
    let value = translations[language]
    
    for (const k of keys) {
      value = value?.[k]
    }
    
    if (typeof value !== 'string') {
      // Fallback to English if translation missing
      let fallback = translations.en
      for (const k of keys) {
        fallback = fallback?.[k]
      }
      value = fallback || key
    }
    
    // Replace placeholders
    if (params && typeof value === 'string') {
      Object.entries(params).forEach(([paramKey, paramValue]) => {
        value = value.replace(`{${paramKey}}`, paramValue)
      })
    }
    
    return value
  }

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider')
  }
  return context
}

