import { getAllMovies } from './CsvMovieRepository.js';

class AiQueryService {
  static async search(query) {
    const normalizedQuery = (query || '').trim().toLowerCase();
    if (!normalizedQuery) return [];

    const allMovies = getAllMovies();

    const matched = allMovies.filter(movie => {
      const inTitle = movie.title && movie.title.toLowerCase().includes(normalizedQuery);
      const inOverview = movie.overview && movie.overview.toLowerCase().includes(normalizedQuery);
      const inGenres = movie.genres && movie.genres.toLowerCase().includes(normalizedQuery);
      return inTitle || inOverview || inGenres;
    });

    matched.sort((a, b) => (b.popularity ?? 0) - (a.popularity ?? 0));

    return matched.slice(0, 50);
  }
}

export default AiQueryService;
