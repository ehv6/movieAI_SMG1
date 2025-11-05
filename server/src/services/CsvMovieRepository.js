import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { parse } from 'csv-parse/sync';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../.env') });

let cachedMovies = null;

function resolveCsvPath() {
  const configured = process.env.CSV_PATH;
  if (configured) {
    return path.resolve(path.join(__dirname, '../../'), configured);
  }
  return path.join(__dirname, '../../data/movies_metadata.csv');
}

export function getAllMovies() {
  if (cachedMovies) return cachedMovies;

  const csvPath = resolveCsvPath();
  const raw = fs.readFileSync(csvPath, 'utf8');
  const rows = parse(raw, {
    columns: true,
    skip_empty_lines: true,
    bom: true,
    relax_column_count: true,
    relax_quotes: true
  });

  cachedMovies = rows.map(r => ({
    id: r.id ?? null,
    title: r.title ?? '',
    overview: r.overview ?? '',
    releaseDate: r.release_date ?? '',
    genres: r.genres ?? '',
    originalLanguage: r.original_language ?? '',
    popularity: Number.parseFloat(r.popularity ?? 0) || 0,
    posterPath: r.poster_path ?? ''
  }));

  return cachedMovies;
}

export function clearCache() {
  cachedMovies = null;
}


