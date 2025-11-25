import path from 'path';
import { fileURLToPath } from 'url';
import request from 'supertest';
import app from '../../src/server.js';

describe('AI Search CSV endpoint', () => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const fixtureCsvPath = path.join(__dirname, 'fixtures', 'movies_small.csv');

  beforeAll(() => {
    process.env.CSV_PATH = path.relative(path.join(__dirname, '../../'), fixtureCsvPath);
  });

  it('returns matches for a simple keyword', async () => {
    const res = await request(app).get('/api/ai-search').query({ query: 'toy' });
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.movies)).toBe(true);
    const titles = res.body.movies.map(m => m.title.toLowerCase());
    expect(titles.some(t => t.includes('toy'))).toBe(true);
  });
});


