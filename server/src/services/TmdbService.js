import axios from 'axios';
import dotenv from 'dotenv';
import Movie from '../models/Movie.js';

dotenv.config();

const BASE_URL = 'https://api.themoviedb.org/3';

class TmdbService {
  static async searchMovies(query) {
    const apiKey = process.env.TMDB_API_KEY;
    if (!apiKey) {
      throw new Error('TMDB_API_KEY not set');
    }
    const { data } = await axios.get(`${BASE_URL}/search/movie`, {
      params: { api_key: apiKey, query }
    });
    const results = Array.isArray(data?.results) ? data.results : [];
    return results.map(r => new Movie(r));
  }
}

export default TmdbService;
