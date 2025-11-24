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
    // AI Search Info
    aiSearchInfo: {
      title: 'What can AI Search do?',
      description: 'AI Search understands natural language queries and finds movies based on complex criteria like genres, release dates, ratings, languages, and more. Just describe what you\'re looking for in plain English!',
      examplesTitle: 'Example queries:',
      example1: 'Movies from 2020 with high ratings',
      example2: 'Action movies released after 2015',
      example3: 'Comedy films in Spanish language',
      example4: 'Sci-fi movies with popularity above 50',
      example5: 'Horror movies from the 1990s',
      howItWorksTitle: 'How it works:',
      howItWorks: 'The AI converts your natural language query into a precise database search, allowing you to find movies using flexible, conversational queries instead of exact keywords.'
    },
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
    // AI Search Info
    aiSearchInfo: {
      title: '¿Qué puede hacer la Búsqueda IA?',
      description: 'La Búsqueda IA entiende consultas en lenguaje natural y encuentra películas basándose en criterios complejos como géneros, fechas de lanzamiento, calificaciones, idiomas y más. ¡Solo describe lo que buscas en español natural!',
      examplesTitle: 'Ejemplos de consultas:',
      example1: 'Películas de 2020 con altas calificaciones',
      example2: 'Películas de acción estrenadas después de 2015',
      example3: 'Películas de comedia en idioma español',
      example4: 'Películas de ciencia ficción con popularidad superior a 50',
      example5: 'Películas de terror de los años 1990',
      howItWorksTitle: 'Cómo funciona:',
      howItWorks: 'La IA convierte tu consulta en lenguaje natural en una búsqueda precisa en la base de datos, permitiéndote encontrar películas usando consultas flexibles y conversacionales en lugar de palabras clave exactas.'
    },
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
    // AI Search Info
    aiSearchInfo: {
      title: 'Que peut faire la Recherche IA?',
      description: 'La Recherche IA comprend les requêtes en langage naturel et trouve des films basés sur des critères complexes comme les genres, dates de sortie, notes, langues et plus encore. Décrivez simplement ce que vous cherchez en français naturel!',
      examplesTitle: 'Exemples de requêtes:',
      example1: 'Films de 2020 avec de bonnes notes',
      example2: 'Films d\'action sortis après 2015',
      example3: 'Films de comédie en langue espagnole',
      example4: 'Films de science-fiction avec une popularité supérieure à 50',
      example5: 'Films d\'horreur des années 1990',
      howItWorksTitle: 'Comment ça fonctionne:',
      howItWorks: 'L\'IA convertit votre requête en langage naturel en une recherche précise dans la base de données, vous permettant de trouver des films en utilisant des requêtes flexibles et conversationnelles au lieu de mots-clés exacts.'
    },
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

