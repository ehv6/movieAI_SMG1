import request from 'supertest';
import { jest } from '@jest/globals';

// We'll import the app only after setting up the module mock for ESM
let app;

const mockSearchMovies = jest.fn();

beforeAll(async () => {
  // Mock the TMDB service to avoid real HTTP and env dependency
  jest.unstable_mockModule('../services/TmdbService.js', () => ({
    default: { searchMovies: mockSearchMovies }
  }));

  // Now import the app (which loads routes/controllers using the mocked service)
  ({ default: app } = await import('../server.js'));
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('GET /api/search', () => {
  test('returns 400 when query parameter is missing', async () => {
    const res = await request(app).get('/api/search');
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: 'Missing query parameter' });
    expect(mockSearchMovies).not.toHaveBeenCalled();
  });

  test('returns movies when query is provided', async () => {
    const mockMovies = [
      {
        id: 1,
        title: 'Star Movie',
        overview: 'Space adventure',
        posterPath: '/poster.jpg',
        releaseDate: '2020-01-01'
      }
    ];
    mockSearchMovies.mockResolvedValueOnce(mockMovies);

    const res = await request(app)
      .get('/api/search')
      .query({ query: 'star' });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ movies: mockMovies });
    expect(mockSearchMovies).toHaveBeenCalledWith('star');
  });

  test('returns 500 when service throws', async () => {
    mockSearchMovies.mockRejectedValueOnce(new Error('TMDB down'));

    const res = await request(app)
      .get('/api/search')
      .query({ query: 'anything' });

    expect(res.status).toBe(500);
    expect(res.body).toEqual({ error: 'Internal Server Error' });
  });
});

