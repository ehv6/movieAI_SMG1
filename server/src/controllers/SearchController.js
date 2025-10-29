import TmdbService from '../services/TmdbService.js';

export async function search(req, res) {
  try {
    const query = (req.query.query || '').trim();
    if (!query) {
      return res.status(400).json({ error: 'Missing query parameter' });
    }
    const movies = await TmdbService.searchMovies(query);
    return res.json({ movies });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
