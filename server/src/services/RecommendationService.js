import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { parse } from 'csv-parse/sync';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function resolveCsvPath() {
  const configured = process.env.CSV_PATH;
  if (configured) {
    return path.resolve(path.join(__dirname, '../../'), configured);
  }
  return path.join(__dirname, '../../data/movies_metadata.csv');
}

function loadCsvIntoDatabase() {
  const csvPath = resolveCsvPath();
  const raw = fs.readFileSync(csvPath, 'utf8');
  const rows = parse(raw, {
    columns: true,
    skip_empty_lines: true,
    bom: true,
    relax_column_count: true,
    relax_quotes: true
  });

  const db = new Database(':memory:');
  
  db.exec(`
    CREATE TABLE movies (
      adult TEXT,
      belongs_to_collection TEXT,
      budget INTEGER,
      genres TEXT,
      homepage TEXT,
      id INTEGER PRIMARY KEY,
      imdb_id TEXT,
      original_language TEXT,
      original_title TEXT,
      overview TEXT,
      popularity REAL,
      poster_path TEXT,
      production_companies TEXT,
      production_countries TEXT,
      release_date TEXT,
      revenue INTEGER,
      runtime REAL,
      spoken_languages TEXT,
      status TEXT,
      tagline TEXT,
      title TEXT,
      video TEXT,
      vote_average REAL,
      vote_count INTEGER
    )
  `);

  const insert = db.prepare(`
    INSERT OR IGNORE INTO movies (
      adult, belongs_to_collection, budget, genres, homepage, id, imdb_id,
      original_language, original_title, overview, popularity, poster_path,
      production_companies, production_countries, release_date, revenue,
      runtime, spoken_languages, status, tagline, title, video,
      vote_average, vote_count
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertMany = db.transaction((rows) => {
    for (const row of rows) {
      const movieId = row.id ? parseInt(row.id) : null;
      if (!movieId || isNaN(movieId)) {
        continue;
      }
      
      insert.run(
        row.adult || null,
        row.belongs_to_collection || null,
        row.budget ? parseInt(row.budget) || null : null,
        row.genres || null,
        row.homepage || null,
        movieId,
        row.imdb_id || null,
        row.original_language || null,
        row.original_title || null,
        row.overview || null,
        row.popularity ? parseFloat(row.popularity) || null : null,
        row.poster_path || null,
        row.production_companies || null,
        row.production_countries || null,
        row.release_date || null,
        row.revenue ? parseInt(row.revenue) || null : null,
        row.runtime ? parseFloat(row.runtime) || null : null,
        row.spoken_languages || null,
        row.status || null,
        row.tagline || null,
        row.title || null,
        row.video || null,
        row.vote_average ? parseFloat(row.vote_average) || null : null,
        row.vote_count ? parseInt(row.vote_count) || null : null
      );
    }
  });

  insertMany(rows);
  return db;
}

/**
 * Parses a JSON string array of genres and extracts genre names
 */
function parseGenres(genresStr) {
  if (!genresStr) return [];
  try {
    const genres = JSON.parse(genresStr);
    if (Array.isArray(genres)) {
      return genres.map(g => g.name || g).filter(Boolean);
    }
    return [];
  } catch {
    return [];
  }
}

/**
 * Analyzes favorite movies to extract common patterns
 */
function analyzeFavorites(favoriteMovies) {
  if (!favoriteMovies || favoriteMovies.length === 0) {
    return null;
  }

  // Extract all genres from favorites
  const allGenres = [];
  const popularities = [];
  const voteAverages = [];
  const voteCounts = [];
  const years = [];
  const languages = new Set();

  favoriteMovies.forEach(movie => {
    // Parse genres
    const genres = parseGenres(movie.genres);
    allGenres.push(...genres);

    // Collect numeric values
    if (movie.popularity != null) {
      popularities.push(parseFloat(movie.popularity) || 0);
    }
    if (movie.vote_average != null) {
      voteAverages.push(parseFloat(movie.vote_average) || 0);
    }
    if (movie.vote_count != null) {
      voteCounts.push(parseInt(movie.vote_count) || 0);
    }
    if (movie.release_date) {
      const year = parseInt(movie.release_date.split('-')[0]);
      if (!isNaN(year)) {
        years.push(year);
      }
    }
    if (movie.original_language) {
      languages.add(movie.original_language);
    }
  });

  // Find most common genres (appearing in at least 30% of favorites)
  const genreCounts = {};
  allGenres.forEach(genre => {
    genreCounts[genre] = (genreCounts[genre] || 0) + 1;
  });
  
  const threshold = Math.max(1, Math.floor(favoriteMovies.length * 0.3));
  const commonGenres = Object.entries(genreCounts)
    .filter(([_, count]) => count >= threshold)
    .map(([genre, _]) => genre)
    .sort((a, b) => genreCounts[b] - genreCounts[a]); // Sort by frequency

  // Calculate statistics
  const avgPopularity = popularities.length > 0 
    ? popularities.reduce((a, b) => a + b, 0) / popularities.length 
    : null;
  const minPopularity = popularities.length > 0 ? Math.min(...popularities) : null;
  const maxPopularity = popularities.length > 0 ? Math.max(...popularities) : null;

  const avgVoteAverage = voteAverages.length > 0
    ? voteAverages.reduce((a, b) => a + b, 0) / voteAverages.length
    : null;
  const minVoteAverage = voteAverages.length > 0 ? Math.min(...voteAverages) : null;
  const maxVoteAverage = voteAverages.length > 0 ? Math.max(...voteAverages) : null;

  const avgYear = years.length > 0
    ? Math.round(years.reduce((a, b) => a + b, 0) / years.length)
    : null;
  const yearRange = years.length > 0 ? {
    min: Math.min(...years),
    max: Math.max(...years)
  } : null;

  return {
    commonGenres,
    popularityRange: avgPopularity != null ? {
      avg: avgPopularity,
      min: minPopularity,
      max: maxPopularity,
      // Use a range around the average (±50% or ±10, whichever is larger)
      lowerBound: Math.max(0, avgPopularity - Math.max(avgPopularity * 0.5, 10)),
      upperBound: avgPopularity + Math.max(avgPopularity * 0.5, 10)
    } : null,
    voteAverageRange: avgVoteAverage != null ? {
      avg: avgVoteAverage,
      min: minVoteAverage,
      max: maxVoteAverage,
      // Use a range around the average (±1.5 points)
      lowerBound: Math.max(0, avgVoteAverage - 1.5),
      upperBound: Math.min(10, avgVoteAverage + 1.5)
    } : null,
    yearRange,
    preferredLanguages: Array.from(languages),
    favoriteIds: favoriteMovies.map(m => m.id).filter(Boolean)
  };
}

/**
 * Generates a precise SQL query based on favorite movie analysis
 */
function generateRecommendationQuery(analysis, excludeIds = []) {
  if (!analysis) {
    return null;
  }

  const conditions = [];
  const params = [];

  // Genre matching - movies must have at least one common genre
  if (analysis.commonGenres.length > 0) {
    const genreConditions = analysis.commonGenres.map(genre => {
      params.push(`%'name': '${genre}'%`);
      return `genres LIKE ?`;
    });
    conditions.push(`(${genreConditions.join(' OR ')})`);
  }

  // Popularity range matching
  if (analysis.popularityRange) {
    const { lowerBound, upperBound } = analysis.popularityRange;
    conditions.push(`popularity >= ? AND popularity <= ?`);
    params.push(lowerBound, upperBound);
  }

  // Vote average range matching
  if (analysis.voteAverageRange) {
    const { lowerBound, upperBound } = analysis.voteAverageRange;
    conditions.push(`vote_average >= ? AND vote_average <= ?`);
    params.push(lowerBound, upperBound);
  }

  // Year range matching (within ±10 years of the range)
  if (analysis.yearRange) {
    const { min, max } = analysis.yearRange;
    const yearLower = Math.max(1900, min - 10);
    const yearUpper = max + 10;
    conditions.push(`CAST(SUBSTR(release_date, 1, 4) AS INTEGER) >= ? AND CAST(SUBSTR(release_date, 1, 4) AS INTEGER) <= ?`);
    params.push(yearLower, yearUpper);
  }

  // Exclude favorite movies
  if (excludeIds.length > 0) {
    const placeholders = excludeIds.map(() => '?').join(',');
    conditions.push(`id NOT IN (${placeholders})`);
    params.push(...excludeIds);
  }

  // Exclude movies with no genres
  conditions.push(`genres IS NOT NULL AND genres != '' AND genres != '[]'`);

  // Exclude movies with very low vote counts (unreliable ratings)
  conditions.push(`vote_count >= 10`);

  if (conditions.length === 0) {
    return null;
  }

  // Build the query with scoring
  // Score = (genre match count * 10) + (popularity similarity * 2) + (vote average similarity * 5)
  const genreScore = analysis.commonGenres.length > 0
    ? `(CASE ${analysis.commonGenres.map((genre, idx) => 
        `WHEN genres LIKE ? THEN 10 ELSE 0 END`
      ).join(' + ')}`
    : '0';

  const genreParams = analysis.commonGenres.map(genre => `%'name': '${genre}'%`);

  const sql = `
    SELECT 
      id, 
      title, 
      overview, 
      release_date, 
      genres, 
      popularity, 
      poster_path, 
      original_language,
      vote_average,
      vote_count,
      (
        ${analysis.commonGenres.map(() => 
          `(CASE WHEN genres LIKE ? THEN 10 ELSE 0 END)`
        ).join(' + ')}
        + (CASE 
            WHEN popularity BETWEEN ? AND ? THEN 2 ELSE 0 
          END)
        + (CASE 
            WHEN vote_average BETWEEN ? AND ? THEN 5 ELSE 0 
          END)
        + (CASE 
            WHEN CAST(SUBSTR(release_date, 1, 4) AS INTEGER) BETWEEN ? AND ? THEN 2 ELSE 0 
          END)
      ) AS relevance_score
    FROM movies
    WHERE ${conditions.join(' AND ')}
    ORDER BY relevance_score DESC, popularity DESC, vote_average DESC
    LIMIT 50
  `;

  // Combine all params: genre params for scoring, then original params
  const allParams = [
    ...genreParams, // For genre scoring
    ...(analysis.popularityRange ? [analysis.popularityRange.lowerBound, analysis.popularityRange.upperBound] : []),
    ...(analysis.voteAverageRange ? [analysis.voteAverageRange.lowerBound, analysis.voteAverageRange.upperBound] : []),
    ...(analysis.yearRange ? [Math.max(1900, analysis.yearRange.min - 10), analysis.yearRange.max + 10] : []),
    ...params // Original WHERE clause params
  ];

  return { sql, params: allParams };
}

function mapDbRowToMovie(row) {
  return {
    id: row.id ?? null,
    title: row.title ?? '',
    overview: row.overview ?? '',
    releaseDate: row.release_date ?? '',
    genres: row.genres ?? '',
    originalLanguage: row.original_language ?? '',
    popularity: Number.parseFloat(row.popularity ?? 0) || 0,
    posterPath: row.poster_path ?? '',
    voteAverage: Number.parseFloat(row.vote_average ?? 0) || 0,
    voteCount: parseInt(row.vote_count ?? 0) || 0,
    relevanceScore: Number.parseFloat(row.relevance_score ?? 0) || 0
  };
}

class RecommendationService {
  /**
   * Gets recommendations based on favorite movie IDs
   * @param {number[]} favoriteIds - Array of favorite movie IDs
   * @returns {Promise<Array>} Array of recommended movies
   */
  static async getRecommendations(favoriteIds) {
    if (!favoriteIds || favoriteIds.length === 0) {
      return [];
    }

    // Load database
    const db = loadCsvIntoDatabase();

    try {
      // Fetch full data for favorite movies
      const placeholders = favoriteIds.map(() => '?').join(',');
      const favoriteMovies = db.prepare(`
        SELECT id, title, genres, popularity, vote_average, vote_count, 
               release_date, original_language
        FROM movies
        WHERE id IN (${placeholders})
      `).all(...favoriteIds);

      if (favoriteMovies.length === 0) {
        return [];
      }

      // Analyze favorites to extract patterns
      const analysis = analyzeFavorites(favoriteMovies);
      
      if (!analysis) {
        return [];
      }

      // Generate precise SQL query
      const queryData = generateRecommendationQuery(analysis, favoriteIds);
      
      if (!queryData) {
        return [];
      }

      // Execute query
      const results = db.prepare(queryData.sql).all(...queryData.params);
      
      // Map to movie objects
      const movies = results.map(mapDbRowToMovie);
      
      // Sort by relevance score (already done in SQL, but ensure it)
      movies.sort((a, b) => {
        if (b.relevanceScore !== a.relevanceScore) {
          return b.relevanceScore - a.relevanceScore;
        }
        if (b.popularity !== a.popularity) {
          return b.popularity - a.popularity;
        }
        return b.voteAverage - a.voteAverage;
      });

      return movies;
    } catch (error) {
      console.error('Recommendation Service Error:', error);
      throw new Error(`Failed to generate recommendations: ${error.message}`);
    } finally {
      db.close();
    }
  }
}

export default RecommendationService;

