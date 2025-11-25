// Component tests for the React client. We mock `fetch` to simulate
// backend responses so tests are fast and deterministic, and we assert
// on DOM behavior rather than network effects.
import React from 'react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import App from '../App.jsx'

// Mock localStorage
const localStorageMock = (() => {
  let store = {}
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => {
      store[key] = value.toString()
    },
    removeItem: (key) => {
      delete store[key]
    },
    clear: () => {
      store = {}
    }
  }
})()

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
})

describe('App', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    localStorageMock.clear()
    // Mock fetch to avoid real network calls
    global.fetch = vi.fn()
    
    // Mock all CarouselSection API calls to return empty arrays
    // This prevents errors when the component mounts
    global.fetch.mockImplementation((url) => {
      if (typeof url === 'string' && url.includes('/api/movies/')) {
        return Promise.resolve({
          ok: true,
          json: async () => [],
        })
      }
      // For other calls, return a default response
      return Promise.resolve({
        ok: true,
        json: async () => ({ movies: [] }),
      })
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
    localStorageMock.clear()
  })

  it('renders the heading', () => {
    render(<App />)
    // The app title is used as alt text for the logo image
    expect(screen.getByAltText('Movie Search Demo')).toBeInTheDocument()
  })

  it('performs a successful search and shows results', async () => {
    const movies = [
      { id: 1, title: 'Inception', releaseDate: '2010-07-16', overview: 'A mind-bending thriller', posterPath: null },
      { id: 2, title: 'Interstellar', releaseDate: '2014-11-07', overview: 'Space exploration', posterPath: null },
    ]

    // Mock the search API call specifically
    global.fetch.mockImplementation((url) => {
      if (typeof url === 'string' && url.includes('/api/search')) {
        return Promise.resolve({
          ok: true,
          json: async () => ({ movies }),
        })
      }
      // Mock carousel calls
      if (typeof url === 'string' && url.includes('/api/movies/')) {
        return Promise.resolve({
          ok: true,
          json: async () => [],
        })
      }
      return Promise.resolve({
        ok: true,
        json: async () => ({ movies: [] }),
      })
    })

    render(<App />)

    const input = screen.getByPlaceholderText('Search movies by title...')
    fireEvent.change(input, { target: { value: 'nolan' } })
    
    // The button has aria-label "Search movies" which takes precedence over the text "Search"
    const searchButton = screen.getByRole('button', { name: 'Search movies' })
    fireEvent.click(searchButton)

    // Wait for movies to be rendered - titles should be visible in the movie cards
    // Use getAllByText since titles appear multiple times (in fallback and overlay)
    await waitFor(() => {
      const inceptionElements = screen.getAllByText('Inception')
      const interstellarElements = screen.getAllByText('Interstellar')
      expect(inceptionElements.length).toBeGreaterThan(0)
      expect(interstellarElements.length).toBeGreaterThan(0)
    }, { timeout: 5000 })
  })

  it('shows an error message when the search fails', async () => {
    // Mock the search API call to fail
    global.fetch.mockImplementation((url) => {
      if (typeof url === 'string' && url.includes('/api/search')) {
        return Promise.resolve({
          ok: false,
          json: async () => ({ error: 'Request failed' }),
        })
      }
      // Mock carousel calls
      if (typeof url === 'string' && url.includes('/api/movies/')) {
        return Promise.resolve({
          ok: true,
          json: async () => [],
        })
      }
      return Promise.resolve({
        ok: true,
        json: async () => ({ movies: [] }),
      })
    })

    render(<App />)

    const input = screen.getByPlaceholderText('Search movies by title...')
    fireEvent.change(input, { target: { value: 'anything' } })
    
    // The button has aria-label "Search movies" which takes precedence over the text "Search"
    const searchButton = screen.getByRole('button', { name: 'Search movies' })
    fireEvent.click(searchButton)

    // Wait for error message to appear
    await waitFor(() => {
      expect(screen.getByText('Request failed')).toBeInTheDocument()
    }, { timeout: 3000 })
  })

  it('performs an AI search and shows results', async () => {
    const movies = [
      { id: 3, title: 'The Matrix', releaseDate: '1999-03-31', overview: 'Sci-fi classic', posterPath: null },
      { id: 4, title: 'Blade Runner', releaseDate: '1982-06-25', overview: 'Cyberpunk masterpiece', posterPath: null },
    ]

    // Mock the AI search API call specifically
    global.fetch.mockImplementation((url) => {
      if (typeof url === 'string' && url.includes('/api/ai-search')) {
        return Promise.resolve({
          ok: true,
          json: async () => ({ movies }),
        })
      }
      // Mock carousel calls
      if (typeof url === 'string' && url.includes('/api/movies/')) {
        return Promise.resolve({
          ok: true,
          json: async () => [],
        })
      }
      return Promise.resolve({
        ok: true,
        json: async () => ({ movies: [] }),
      })
    })

    render(<App />)

    const input = screen.getByPlaceholderText('Search movies by title...')
    fireEvent.change(input, { target: { value: 'sci-fi movies from the 90s' } })
    
    // Click the AI Search button
    const aiSearchButton = screen.getByRole('button', { name: 'Search movies using AI' })
    fireEvent.click(aiSearchButton)

    // Wait for movies to be rendered
    await waitFor(() => {
      const matrixElements = screen.getAllByText('The Matrix')
      const bladeRunnerElements = screen.getAllByText('Blade Runner')
      expect(matrixElements.length).toBeGreaterThan(0)
      expect(bladeRunnerElements.length).toBeGreaterThan(0)
    }, { timeout: 5000 })
  })

  it('renders UI components correctly', () => {
    render(<App />)
    
    // Check that main UI elements are present
    expect(screen.getByAltText('Movie Search Demo')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Search movies by title...')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Search movies' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Search movies using AI' })).toBeInTheDocument()
    expect(screen.getByRole('navigation')).toBeInTheDocument()
  })

  it('sends recommendation requests when favorites are present', async () => {
    // Mock localStorage to have favorites
    const mockFavorites = [
      { id: 1, title: 'Favorite Movie 1', overview: 'A great movie', releaseDate: '2020-01-01', posterPath: null },
      { id: 2, title: 'Favorite Movie 2', overview: 'Another great movie', releaseDate: '2021-01-01', posterPath: null }
    ]
    localStorageMock.setItem('favorites', JSON.stringify(mockFavorites))

    let recommendationCallCount = 0
    let aiRecommendationCallCount = 0

    // Mock recommendation endpoints
    global.fetch.mockImplementation((url) => {
      if (typeof url === 'string' && url.includes('/api/movies/recommendations')) {
        recommendationCallCount++
        return Promise.resolve({
          ok: true,
          json: async () => ({ movies: [] }),
        })
      }
      if (typeof url === 'string' && url.includes('/api/movies/ai-recommendations')) {
        aiRecommendationCallCount++
        return Promise.resolve({
          ok: true,
          json: async () => ({ movies: [] }),
        })
      }
      // Mock carousel calls
      if (typeof url === 'string' && url.includes('/api/movies/')) {
        return Promise.resolve({
          ok: true,
          json: async () => [],
        })
      }
      return Promise.resolve({
        ok: true,
        json: async () => ({ movies: [] }),
      })
    })

    render(<App />)

    // Switch to Favorites view where MovieRecommendations component is rendered
    const favoritesButton = screen.getByRole('button', { name: 'Favorites' })
    fireEvent.click(favoritesButton)

    // Wait for the Favorites view to render and recommendation calls to be made
    await waitFor(() => {
      // Just verify that the requests were made (we're not testing accuracy)
      expect(recommendationCallCount).toBeGreaterThan(0)
      expect(aiRecommendationCallCount).toBeGreaterThan(0)
    }, { timeout: 5000 })
  })
})


