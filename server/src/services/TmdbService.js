import axios from 'axios';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';
import Movie from '../models/Movie.js';

// Ensure env loads from server/.env even if cwd is repo root
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../.env') });

const BASE_URL = 'https://api.themoviedb.org/3';

class TmdbService {
  static getApiKey() {
    const apiKey = process.env.TMDB_API_KEY || process.env.TMDb_API_KEY || process.env.tmdb_api_key;
    if (!apiKey) {
      throw new Error('TMDB_API_KEY not set');
    }
    return apiKey;
  }

  static async searchMovies(query) {
    const apiKey = this.getApiKey();
    try {
      const { data } = await axios.get(`${BASE_URL}/search/movie`, {
        params: { api_key: apiKey, query }
      });
      const results = Array.isArray(data?.results) ? data.results : [];
      return results.map(r => new Movie(r));
    } catch (err) {
      // Normalize axios error so controller can set an appropriate HTTP status
      if (err?.response) {
        const status = err.response.status || 500;
        const message = err.response.data?.status_message || 'TMDb request failed';
        const e = new Error(message);
        e.status = status;
        throw e;
      }
      throw err;
    }
  }

  static async discoverMovies(params = {}) {
    const apiKey = this.getApiKey();
    try {
      const { data } = await axios.get(`${BASE_URL}/discover/movie`, {
        params: { 
          api_key: apiKey,
          sort_by: 'popularity.desc',
          ...params
        }
      });
      const results = Array.isArray(data?.results) ? data.results : [];
      return results.map(r => new Movie(r));
    } catch (err) {
      if (err?.response) {
        const status = err.response.status || 500;
        const message = err.response.data?.status_message || 'TMDb request failed';
        const e = new Error(message);
        e.status = status;
        throw e;
      }
      throw err;
    }
  }

  static async getPopularMovies(page = 1) {
    const apiKey = this.getApiKey();
    try {
      const { data } = await axios.get(`${BASE_URL}/movie/popular`, {
        params: { api_key: apiKey, page }
      });
      const results = Array.isArray(data?.results) ? data.results : [];
      return results.map(r => new Movie(r));
    } catch (err) {
      if (err?.response) {
        const status = err.response.status || 500;
        const message = err.response.data?.status_message || 'TMDb request failed';
        const e = new Error(message);
        e.status = status;
        throw e;
      }
      throw err;
    }
  }

  static async getNowPlayingMovies(page = 1) {
    const apiKey = this.getApiKey();
    try {
      const { data } = await axios.get(`${BASE_URL}/movie/now_playing`, {
        params: { api_key: apiKey, page }
      });
      const results = Array.isArray(data?.results) ? data.results : [];
      return results.map(r => new Movie(r));
    } catch (err) {
      if (err?.response) {
        const status = err.response.status || 500;
        const message = err.response.data?.status_message || 'TMDb request failed';
        const e = new Error(message);
        e.status = status;
        throw e;
      }
      throw err;
    }
  }

  static async getMovieDetails(movieId) {
    const apiKey = this.getApiKey();
    try {
      const { data } = await axios.get(`${BASE_URL}/movie/${movieId}`, {
        params: { api_key: apiKey }
      });
      return new Movie(data);
    } catch (err) {
      if (err?.response) {
        const status = err.response.status || 500;
        const message = err.response.data?.status_message || 'TMDb request failed';
        const e = new Error(message);
        e.status = status;
        throw e;
      }
      throw err;
    }
  }
}

export default TmdbService;
