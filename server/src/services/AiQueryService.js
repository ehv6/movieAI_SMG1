import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { parse } from 'csv-parse/sync';
import Database from 'better-sqlite3';
import OpenAI from 'openai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../.env') });

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// CSV Schema for the prompt
const CSV_SCHEMA = `
The movies dataset is stored in a SQLite table called 'movies' with the following schema:

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
);

Notes:
- genres, production_companies, production_countries, and spoken_languages are stored as JSON strings (e.g., "[{'id': 16, 'name': 'Animation'}]")
- Use LIKE or string functions to search within these JSON fields
- popularity, vote_average are REAL (floating point numbers)
- budget, revenue, vote_count, runtime are numeric
- release_date is stored as TEXT in format 'YYYY-MM-DD'
- Use SQLite syntax for queries
`;

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

  // Create in-memory SQLite database
  const db = new Database(':memory:');
  
  // Create table
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



  insertMany(rows);
  return db;
}

async function generateSqlQuery(userQuery) {
  const prompt = `${CSV_SCHEMA}

User Query: "${userQuery}"

Generate a SQL query to answer the user's query. Return ONLY the SQL query, nothing else. Do not include markdown formatting, backticks, or explanations. Just the raw SQL query.

The query MUST:
- Select these columns: id, title, overview, release_date, genres, popularity, poster_path, original_language
- Use appropriate WHERE clauses to filter based on the user's intent
- Order results by relevance (e.g., popularity DESC, vote_average DESC)
- Limit results to 50 rows using LIMIT 50
- Use SQLite syntax
- Return only SELECT statements (no INSERT, UPDATE, DELETE, DROP, etc.)`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a SQL query generator. Return only valid SQL queries without any markdown, backticks, or explanations.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 500
    });

    let sqlQuery = completion.choices[0]?.message?.content?.trim() || '';
    
    // Clean up the SQL query (remove markdown code blocks if present)
    sqlQuery = sqlQuery.replace(/```sql\n?/gi, '').replace(/```\n?/g, '').trim();
    
    // Ensure it ends with semicolon or add one
    if (!sqlQuery.endsWith(';')) {
      sqlQuery += ';';
    }

    return sqlQuery;
  } catch (error) {
    console.error('OpenAI API Error:', error);
    throw new Error(`Failed to generate SQL query: ${error.message}`);
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
    posterPath: row.poster_path ?? ''
  };
}

class AiQueryService {
  static async search(query) {
    const normalizedQuery = (query || '').trim();
    if (!normalizedQuery) return [];

    try {
      // Generate SQL query using OpenAI
      const sqlQuery = await generateSqlQuery(normalizedQuery);
      console.log('Generated SQL:', sqlQuery);

      // Load CSV into SQLite database
      const db = loadCsvIntoDatabase();

      try {
        // Validate SQL query for safety (only allow SELECT statements)
        const trimmedQuery = sqlQuery.trim().toUpperCase();
        if (!trimmedQuery.startsWith('SELECT')) {
          throw new Error('Only SELECT queries are allowed');
        }
        
        // Remove semicolon for execution
        const queryToExecute = sqlQuery.replace(/;+$/, '');
        
        // Execute the SQL query
        const results = db.prepare(queryToExecute).all();
        
        // Map results to expected format
        const movies = results.map(mapDbRowToMovie);
        
        return movies;
      } catch (sqlError) {
        console.error('SQL Execution Error:', sqlError);
        throw new Error(`Failed to execute SQL query: ${sqlError.message}`);
      } finally {
        db.close();
      }
    } catch (error) {
      console.error('AI Search Error:', error);
      throw error;
    }
  }
}

export default AiQueryService;
