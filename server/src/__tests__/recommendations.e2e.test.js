// Integration tests for the recommendation endpoints.
// These tests verify that the endpoints accept requests and return responses
// without testing the accuracy of recommendations.
import request from 'supertest';
import { jest } from '@jest/globals';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const fixtureCsvPath = path.join(__dirname, 'fixtures', 'movies_small.csv');

let app;
const mockGetRecommendations = jest.fn();
const mockGetAiRecommendations = jest.fn();

beforeAll(async () => {
  // Set CSV path to fixture for tests
  process.env.CSV_PATH = path.relative(path.join(__dirname, '../../'), fixtureCsvPath);

  // Mock the RecommendationService to avoid real database/OpenAI calls
  jest.unstable_mockModule('../services/RecommendationService.js', () => ({
    default: {
      getRecommendations: mockGetRecommendations,
      getAiRecommendations: mockGetAiRecommendations
    }
  }));

  // Now import the app (which loads routes/controllers using the mocked service)
  ({ default: app } = await import('../server.js'));
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('GET /api/movies/recommendations', () => {
  test('sends request and returns recommendations when favoriteIds is provided', async () => {
    const mockRecommendations = [
      {
        id: 10,
        title: 'Recommended Movie 1',
        overview: 'A great recommendation',
        releaseDate: '2020-01-01',
        posterPath: '/poster1.jpg'
      }
    ];
    
    mockGetRecommendations.mockResolvedValueOnce(mockRecommendations);

    const res = await request(app)
      .get('/api/movies/recommendations')
      .query({ favoriteIds: '1,2,3' });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ movies: mockRecommendations });
    expect(mockGetRecommendations).toHaveBeenCalledWith([1, 2, 3]);
  });
});

describe('GET /api/movies/ai-recommendations', () => {
  test('sends request and returns AI recommendations when favoriteIds is provided', async () => {
    const mockAiRecommendations = [
      {
        id: 20,
        title: 'AI Recommended Movie 1',
        overview: 'AI thinks you will like this',
        releaseDate: '2019-01-01',
        posterPath: '/ai-poster1.jpg'
      }
    ];
    
    mockGetAiRecommendations.mockResolvedValueOnce(mockAiRecommendations);

    const res = await request(app)
      .get('/api/movies/ai-recommendations')
      .query({ favoriteIds: '7,8' });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ movies: mockAiRecommendations });
    expect(mockGetAiRecommendations).toHaveBeenCalledWith([7, 8]);
  });

  test('returns 500 when service throws', async () => {
    mockGetAiRecommendations.mockRejectedValueOnce(new Error('Service error'));

    const res = await request(app)
      .get('/api/movies/ai-recommendations')
      .query({ favoriteIds: '1' });

    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty('error');
    expect(typeof res.body.error).toBe('string');
  });
});

