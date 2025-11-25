import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { parse } from 'csv-parse/sync';
import dotenv from 'dotenv';
import OpenAI from 'openai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../.env') });

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

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
 * Uses OpenAI to identify which genre the favorite movies identify most with
 */
async function identifyStrongestGenre(favoriteMovies) {
  if (!favoriteMovies || favoriteMovies.length === 0) {
    return null;
  }

  // Fixed list of available genres
  const availableGenres = [
    'Drama',
    'Comedy',
    'Romance',
    'Thriller',
    'Action',
    'Adventure',
    'Crime',
    'Family',
    'Science Fiction',
    'Fantasy'
  ];

  // Create a summary of favorite movies
  const movieTitles = favoriteMovies.map(m => m.title).join(', ');

  const prompt = `Which one of these genres do these movies identify the most with?

Movies: ${movieTitles}

Available genres:
${availableGenres.join('\n')}

Return ONLY the genre name, nothing else.`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are a movie genre analyzer. Return ONLY one genre name from this exact list: ${availableGenres.join(', ')}. Return nothing else - no quotes, no punctuation, just the genre name.`
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.2,
      max_tokens: 20
    });

    let genre = completion.choices[0]?.message?.content?.trim() || null;
    
    // Clean up the response (remove quotes, extra whitespace)
    if (genre) {
      genre = genre.replace(/^["']|["']$/g, '').trim();
    }
    
    // Verify it's in the available genres list (case-insensitive check)
    if (genre) {
      const normalizedGenre = genre.toLowerCase();
      const matchingGenre = availableGenres.find(g => g.toLowerCase() === normalizedGenre);
      if (matchingGenre) {
        console.log(`[RecommendationService] Identified strongest genre: ${matchingGenre}`);
        return matchingGenre;
      } else {
        console.log(`[RecommendationService] OpenAI returned "${genre}" which is not in available genres`);
      }
    }
    
    return null;
  } catch (error) {
    console.error('OpenAI API Error:', error);
    return null;
  }
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
    voteCount: parseInt(row.vote_count ?? 0) || 0
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
        console.log(`[RecommendationService] No favorite movies found in database for IDs: ${favoriteIds.join(', ')}`);
        return [];
      }

      // Use OpenAI to identify which genre the movies identify most with
      const strongestGenre = await identifyStrongestGenre(favoriteMovies);
      
      if (!strongestGenre) {
        console.log(`[RecommendationService] Could not identify a genre`);
        return [];
      }

      // Query most popular movies with that genre, excluding favorites
      const excludePlaceholders = favoriteIds.map(() => '?').join(',');
      const escapedGenre = strongestGenre.replace(/'/g, "''");
      const genrePattern = `%'name': '${escapedGenre}'%`;
      
      const results = db.prepare(`
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
          vote_count
        FROM movies
        WHERE genres LIKE ?
          AND genres IS NOT NULL 
          AND genres != '' 
          AND genres != '[]'
          AND vote_count >= 10
          AND id NOT IN (${excludePlaceholders})
        ORDER BY popularity DESC, vote_average DESC
        LIMIT 6
      `).all(genrePattern, ...favoriteIds);
      
      // Map to movie objects
      const movies = results.map(mapDbRowToMovie);
      
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
