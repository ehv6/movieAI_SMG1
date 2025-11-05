import AiQueryService from '../services/AiQueryService.js';

export async function aiSearch(req, res) {
  try {
    const query = (req.query.query || '').trim();
    if (!query) return res.status(400).json({ error: 'Missing query parameter' });

    const movies = await AiQueryService.search(query);
    return res.json({ movies });
  } catch (err) {
    console.error(err);
    const status = err?.status || 500;
    const message = err?.message || 'Internal Server Error';
    return res.status(status).json({ error: message });
  }
}


