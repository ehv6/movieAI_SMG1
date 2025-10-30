import React from 'react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import App from '../App.jsx'

describe('App', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders the heading', () => {
    render(<App />)
    expect(screen.getByText('Movie Search Demo')).toBeInTheDocument()
  })

  it('performs a successful search and shows results', async () => {
    const movies = [
      { id: '1', title: 'Inception', releaseDate: '2010-07-16' },
      { id: '2', title: 'Interstellar', releaseDate: '2014-11-07' },
    ]

    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => ({ movies }),
    })

    const { getByPlaceholderText, getByRole, findByText } = render(<App />)

    const input = getByPlaceholderText('Search movies by title...')
    fireEvent.change(input, { target: { value: 'nolan' } })
    fireEvent.click(getByRole('button', { name: 'Search' }))

    // Movies rendered
    expect(await findByText('Inception')).toBeInTheDocument()
    expect(await findByText('Interstellar')).toBeInTheDocument()
  })

  it('shows an error message when the search fails', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Request failed' }),
    })

    const { getByPlaceholderText, getByRole, findByText } = render(<App />)

    const input = getByPlaceholderText('Search movies by title...')
    fireEvent.change(input, { target: { value: 'anything' } })
    fireEvent.click(getByRole('button', { name: 'Search' }))

    // Error is shown
    expect(await findByText('Request failed')).toBeInTheDocument()
  })
})


