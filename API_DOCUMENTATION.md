# API Documentation

This document describes all available endpoints for the MVC Movie Demo API.

**Base URL:** `http://127.0.0.1:8000/api`

---

## Table of Contents

1. [Search Endpoints](#search-endpoints)
2. [Movies Endpoints](#movies-endpoints)
3. [Recommendations Endpoints](#recommendations-endpoints)
4. [Error Handling](#error-handling)

---

## Search Endpoints

### Search Movies

Search for movies by query string.

**Endpoint:** `GET /search`

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `query` | string | Yes | The movie title or keyword to search for |
| `lang` | string | No | Language code (e.g., 'en', 'es', 'fr'). Defaults to 'en' or Accept-Language header |

**Request Example:**
```bash
curl "http://127.0.0.1:8000/api/search?query=inception&lang=en"
```

**Response (200 OK):**
```json
{
  "movies": [
    {
      "id": 27205,
      "title": "Inception",
      "overview": "A skilled thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
      "posterPath": "/9gk7adHYeDMPS6QddVkE8q7YvU4.jpg",
      "posterUrl": "https://image.tmdb.org/t/p/w500/9gk7adHYeDMPS6QddVkE8q7YvU4.jpg",
      "releaseDate": "2010-07-16"
    }
  ]
}
```

**Error Response (400 Bad Request):**
```json
{
  "error": "Missing query parameter"
}
```

---

### AI Search

Search for movies using AI-based natural language processing.

**Endpoint:** `GET /ai-search`

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `query` | string | Yes | Natural language query (e.g., 'movies about time travel') |

**Request Example:**
```bash
curl "http://127.0.0.1:8000/api/ai-search?query=movies%20about%20time%20travel"
```

**Response (200 OK):**
```json
{
  "movies": [
    {
      "id": 27205,
      "title": "Inception",
      "overview": "A skilled thief...",
      "posterPath": "/9gk7adHYeDMPS6QddVkE8q7YvU4.jpg",
      "posterUrl": "https://image.tmdb.org/t/p/w500/9gk7adHYeDMPS6QddVkE8q7YvU4.jpg",
      "releaseDate": "2010-07-16"
    }
  ]
}
```

**Error Response (400 Bad Request):**
```json
{
  "error": "Missing query parameter"
}
```

---

## Movies Endpoints

All movie category endpoints return up to 25 movies and support language parameters. Results are cached for 5 minutes per language.

### Get Featured Movies

**Endpoint:** `GET /movies/featured`

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `lang` | string | No | Language code (defaults to 'en') |

**Response (200 OK):** Array of movie objects

---

### Get New Releases

**Endpoint:** `GET /movies/new-releases`

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `lang` | string | No | Language code (defaults to 'en') |

**Response (200 OK):** Array of movie objects (now playing movies)

---

### Get Action Movies

**Endpoint:** `GET /movies/action`

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `lang` | string | No | Language code (defaults to 'en') |

**Response (200 OK):** Array of action movie objects

---

### Get Sci-Fi Movies

**Endpoint:** `GET /movies/scifi`

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `lang` | string | No | Language code (defaults to 'en') |

**Response (200 OK):** Array of sci-fi movie objects

---

### Get Comedy Movies

**Endpoint:** `GET /movies/comedy`

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `lang` | string | No | Language code (defaults to 'en') |

**Response (200 OK):** Array of comedy movie objects

---

### Get Thriller Movies

**Endpoint:** `GET /movies/thriller`

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `lang` | string | No | Language code (defaults to 'en') |

**Response (200 OK):** Array of thriller movie objects

---

### Get Horror Movies

**Endpoint:** `GET /movies/horror`

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `lang` | string | No | Language code (defaults to 'en') |

**Response (200 OK):** Array of horror movie objects

---

### Get Suspense Movies

**Endpoint:** `GET /movies/suspense`

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `lang` | string | No | Language code (defaults to 'en') |

**Response (200 OK):** Array of suspense movie objects (uses thriller genre)

---

### Get Drama Movies

**Endpoint:** `GET /movies/drama`

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `lang` | string | No | Language code (defaults to 'en') |

**Response (200 OK):** Array of drama movie objects

---

### Get Movie Details

Get detailed information about a specific movie.

**Endpoint:** `GET /movies/details/:id`

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | number | The TMDb movie ID |

**Request Example:**
```bash
curl "http://127.0.0.1:8000/api/movies/details/27205"
```

**Response (200 OK):**
```json
{
  "id": 27205,
  "title": "Inception",
  "overview": "A skilled thief who steals corporate secrets through the use of dream-sharing technology...",
  "posterPath": "/9gk7adHYeDMPS6QddVkE8q7YvU4.jpg",
  "posterUrl": "https://image.tmdb.org/t/p/w500/9gk7adHYeDMPS6QddVkE8q7YvU4.jpg",
  "releaseDate": "2010-07-16",
  "runtime": 148,
  "genres": ["Action", "Science Fiction", "Thriller"],
  "voteAverage": 8.8,
  "voteCount": 33459
}
```

---

### Get Watch Providers

Get information about where to watch a specific movie.

**Endpoint:** `GET /movies/:id/providers`

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | number | The TMDb movie ID |

**Request Example:**
```bash
curl "http://127.0.0.1:8000/api/movies/27205/providers"
```

**Response (200 OK):**
```json
{
  "id": 27205,
  "title": "Inception",
  "providers": {
    "US": {
      "rent": [
        {
          "name": "Google Play",
          "logo_path": "/3UZIHhgE0Z5XgSI3cjt0OnwKjkO.jpg"
        }
      ],
      "buy": [
        {
          "name": "Amazon Prime Video",
          "logo_path": "/tbEdFQDlCVVvt5me0rPBCUVxHQm.jpg"
        }
      ]
    }
  }
}
```

---

## Recommendations Endpoints

### Get Recommendations

Get movie recommendations based on favorite movies.

**Endpoint:** `GET /movies/recommendations`

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `favoriteIds` | string or array | Yes | Comma-separated TMDb movie IDs or array of IDs (e.g., "27205,550,278") |

**Request Examples:**
```bash
# Query parameter (comma-separated)
curl "http://127.0.0.1:8000/api/movies/recommendations?favoriteIds=27205,550,278"

# Multiple query parameters (array notation)
curl "http://127.0.0.1:8000/api/movies/recommendations?favoriteIds=27205&favoriteIds=550&favoriteIds=278"

# POST with body
curl -X GET "http://127.0.0.1:8000/api/movies/recommendations" \
  -H "Content-Type: application/json" \
  -d '{"favoriteIds": [27205, 550, 278]}'
```

**Response (200 OK):**
```json
{
  "movies": [
    {
      "id": 278,
      "title": "The Shawshank Redemption",
      "overview": "Two imprisoned men bond over a number of years...",
      "posterPath": "/9gk7adHYeDMPS6QddVkE8q7YvU4.jpg",
      "posterUrl": "https://image.tmdb.org/t/p/w500/9gk7adHYeDMPS6QddVkE8q7YvU4.jpg",
      "releaseDate": "1994-10-14"
    }
  ]
}
```

**Error Response (400 Bad Request):**
```json
{
  "error": "Missing favoriteIds parameter"
}
```

or

```json
{
  "error": "No valid favorite movie IDs provided"
}
```

---

### Get AI Recommendations

Get AI-powered movie recommendations based on favorite movies.

**Endpoint:** `GET /movies/ai-recommendations`

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `favoriteIds` | string or array | Yes | Comma-separated TMDb movie IDs or array of IDs |

**Request Examples:**
```bash
# Query parameter (comma-separated)
curl "http://127.0.0.1:8000/api/movies/ai-recommendations?favoriteIds=27205,550,278"

# POST with body
curl -X GET "http://127.0.0.1:8000/api/movies/ai-recommendations" \
  -H "Content-Type: application/json" \
  -d '{"favoriteIds": [27205, 550, 278]}'
```

**Response (200 OK):**
```json
{
  "movies": [
    {
      "id": 157336,
      "title": "Interstellar",
      "overview": "A team of explorers travel through a wormhole in space...",
      "posterPath": "/tsRy63Mu5cu3rPTVeLZcaZSMRJ7.jpg",
      "posterUrl": "https://image.tmdb.org/t/p/w500/tsRy63Mu5cu3rPTVeLZcaZSMRJ7.jpg",
      "releaseDate": "2014-11-07"
    }
  ]
}
```

**Error Response (400 Bad Request):**
```json
{
  "error": "Missing favoriteIds parameter"
}
```

---

## Error Handling

### HTTP Status Codes

| Code | Description |
|------|-------------|
| 200 | Success - Request completed successfully |
| 400 | Bad Request - Missing or invalid parameters |
| 500 | Internal Server Error - Server-side error |

### Error Response Format

All error responses follow this format:

```json
{
  "error": "Error message describing what went wrong"
}
```

### Common Errors

**Missing Required Parameter:**
```json
{
  "error": "Missing query parameter"
}
```

**Invalid Parameter Format:**
```json
{
  "error": "Invalid favoriteIds format"
}
```

**Server Error:**
```json
{
  "error": "Internal Server Error"
}
```

---

## Response Data Structure

### Movie Object

```typescript
{
  id: number,                    // TMDb movie ID
  title: string,                 // Movie title
  overview: string,              // Movie description
  posterPath: string,            // Path to poster image (/path/to/image.jpg)
  posterUrl: string,             // Full URL to poster image
  releaseDate: string,           // Release date (YYYY-MM-DD format)
  runtime?: number,              // Duration in minutes (optional in some endpoints)
  genres?: string[],             // Array of genre names (optional in some endpoints)
  voteAverage?: number,          // Average rating 0-10 (optional in some endpoints)
  voteCount?: number             // Number of votes (optional in some endpoints)
}
```

---

## Language Support

The API supports multiple languages through the `lang` query parameter or `Accept-Language` header. Common language codes:

| Code | Language |
|------|----------|
| en | English |
| es | Spanish |
| fr | French |
| de | German |
| it | Italian |
| ja | Japanese |
| pt | Portuguese |
| ru | Russian |

---

## Caching

Movie category endpoints (`/movies/featured`, `/movies/action`, etc.) implement a 5-minute cache per language to improve performance. The first request for a category will fetch fresh data from TMDb, and subsequent requests within 5 minutes will return cached results. After 5 minutes, fresh data is fetched again.

---

## Rate Limiting

This API is backed by the TMDb API. Please be aware of TMDb's rate limits (typically 40 requests per 10 seconds for regular API keys).

---

## Environment Configuration

The server requires a `.env` file with the following configuration:

```env
TMDB_API_KEY=your_tmdb_api_key_here
PORT=8000
NODE_ENV=development
```

Get your TMDb API key from: https://www.themoviedb.org/settings/api
