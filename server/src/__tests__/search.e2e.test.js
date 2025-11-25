// Integration-style tests for the Express app's search endpoint.
// These tests mock the TMDb service at the module boundary so we exercise
// controllers/routes and HTTP wiring without making real network calls.
//
// Why mock at the module level?
// - Keeps tests fast and deterministic
// - Avoids relying on environment variables or external APIs
// - Still verifies request/response shapes and status codes
import request from 'supertest';
import { jest } from '@jest/globals';

// For ESM, we set up the unstable mock before importing the app so the
// controller pulls in the mocked service implementation.
let app;

const mockSearchMovies = jest.fn();

beforeAll(async () => {
  // Mock the TMDb service to avoid real HTTP and env dependency
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
    expect(mockSearchMovies).toHaveBeenCalledWith('star', 'en');
  });

  test('returns 400 when query parameter is missing', async () => {
    const res = await request(app).get('/api/search');
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: 'Missing query parameter' });
    expect(mockSearchMovies).not.toHaveBeenCalled();
  });
});

