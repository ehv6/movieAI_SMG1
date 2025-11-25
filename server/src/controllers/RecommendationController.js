import RecommendationService from '../services/RecommendationService.js';

export async function getRecommendations(req, res) {
  try {
    const favoriteIdsParam = req.query.favoriteIds || req.body.favoriteIds;
    
    if (!favoriteIdsParam) {
      return res.status(400).json({ error: 'Missing favoriteIds parameter' });
    }

    // Parse favoriteIds - can be comma-separated string or array
    let favoriteIds;
    if (typeof favoriteIdsParam === 'string') {
      favoriteIds = favoriteIdsParam
        .split(',')
        .map(id => parseInt(id.trim()))
        .filter(id => !isNaN(id) && id > 0);
    } else if (Array.isArray(favoriteIdsParam)) {
      favoriteIds = favoriteIdsParam
        .map(id => parseInt(id))
        .filter(id => !isNaN(id) && id > 0);
    } else {
      return res.status(400).json({ error: 'Invalid favoriteIds format' });
    }

    if (favoriteIds.length === 0) {
      return res.status(400).json({ error: 'No valid favorite movie IDs provided' });
    }

    const movies = await RecommendationService.getRecommendations(favoriteIds);
    return res.json({ movies });
  } catch (err) {
    console.error('Recommendation Controller Error:', err);
    const status = err?.status || 500;
    const message = err?.message || 'Internal Server Error';
    return res.status(status).json({ error: message });
  }
}

export async function getAiRecommendations(req, res) {
  try {
    const favoriteIdsParam = req.query.favoriteIds || req.body.favoriteIds;
    
    if (!favoriteIdsParam) {
      return res.status(400).json({ error: 'Missing favoriteIds parameter' });
    }

    // Parse favoriteIds - can be comma-separated string or array
    let favoriteIds;
    if (typeof favoriteIdsParam === 'string') {
      favoriteIds = favoriteIdsParam
        .split(',')
        .map(id => parseInt(id.trim()))
        .filter(id => !isNaN(id) && id > 0);
    } else if (Array.isArray(favoriteIdsParam)) {
      favoriteIds = favoriteIdsParam
        .map(id => parseInt(id))
        .filter(id => !isNaN(id) && id > 0);
    } else {
      return res.status(400).json({ error: 'Invalid favoriteIds format' });
    }

    if (favoriteIds.length === 0) {
      return res.status(400).json({ error: 'No valid favorite movie IDs provided' });
    }

    const movies = await RecommendationService.getAiRecommendations(favoriteIds);
    return res.json({ movies });
  } catch (err) {
    console.error('AI Recommendation Controller Error:', err);
    const status = err?.status || 500;
    const message = err?.message || 'Internal Server Error';
    return res.status(status).json({ error: message });
  }
}