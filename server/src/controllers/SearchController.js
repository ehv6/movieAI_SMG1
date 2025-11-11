import TmdbService from '../services/TmdbService.js';

export async function search(req, res) {
  try {
    const query = (req.query.query || '').trim();
    if (!query) {
      return res.status(400).json({ error: 'Missing query parameter' });
    }
    // Extract language from query param, header, or default to 'en'
    const language = req.query?.lang || req.headers['accept-language']?.split(',')[0]?.split('-')[0] || 'en';
    const movies = await TmdbService.searchMovies(query, language);
    return res.json({ movies });
  } catch (err) {
    console.error(err);
    const status = err && err.status ? err.status : 500;
    const message = err && err.message ? err.message : 'Internal Server Error';
    return res.status(status).json({ error: message });
  }
}
