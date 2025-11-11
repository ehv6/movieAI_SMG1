import TmdbService from '../services/TmdbService.js';

// Cache storage with timestamps (5 minutes = 300000 ms)
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds
const cache = {};

// TMDb Genre IDs mapping
const GENRE_IDS = {
  action: 28,
  scifi: 878,
  comedy: 35,
  thriller: 53,
  horror: 27,
  suspense: 53, // Suspense uses Thriller genre
  drama: 18
};

// Helper function to check if cache is valid
function isCacheValid(category) {
  if (!cache[category] || !cache[category].timestamp) {
    return false;
  }
  const age = Date.now() - cache[category].timestamp;
  return age < CACHE_DURATION;
}

// Helper function to get cached data or fetch new
async function getCachedMovies(category, fetchFunction) {
  if (isCacheValid(category)) {
    return cache[category].movies;
  }

  try {
    const movies = await fetchFunction();
    // Transform Movie objects to include all necessary fields
    const transformedMovies = movies.slice(0, 25).map(movie => ({
      id: movie.id,
      title: movie.title,
      overview: movie.overview || '',
      posterPath: movie.posterPath || '',
      posterUrl: movie.posterUrl,
      releaseDate: movie.releaseDate || ''
    }));

    cache[category] = {
      movies: transformedMovies,
      timestamp: Date.now()
    };

    return transformedMovies;
  } catch (error) {
    console.error(`Error fetching ${category} movies:`, error);
    // Return cached data if available, even if expired, as fallback
    if (cache[category] && cache[category].movies) {
      return cache[category].movies;
    }
    throw error;
  }
}

export async function getFeatured(req, res) {
  try {
    const movies = await getCachedMovies('featured', async () => {
      // Get popular movies for featured
      return await TmdbService.getPopularMovies(1);
    });
    res.json(movies);
  } catch (error) {
    console.error('Error in getFeatured:', error);
    res.status(500).json({ error: 'Failed to fetch featured movies' });
  }
}

export async function getNewReleases(req, res) {
  try {
    const movies = await getCachedMovies('newReleases', async () => {
      // Get now playing movies for new releases
      return await TmdbService.getNowPlayingMovies(1);
    });
    res.json(movies);
  } catch (error) {
    console.error('Error in getNewReleases:', error);
    res.status(500).json({ error: 'Failed to fetch new releases' });
  }
}

export async function getAction(req, res) {
  try {
    const movies = await getCachedMovies('action', async () => {
      return await TmdbService.discoverMovies({
        with_genres: GENRE_IDS.action
      });
    });
    res.json(movies);
  } catch (error) {
    console.error('Error in getAction:', error);
    res.status(500).json({ error: 'Failed to fetch action movies' });
  }
}

export async function getSciFi(req, res) {
  try {
    const movies = await getCachedMovies('scifi', async () => {
      return await TmdbService.discoverMovies({
        with_genres: GENRE_IDS.scifi
      });
    });
    res.json(movies);
  } catch (error) {
    console.error('Error in getSciFi:', error);
    res.status(500).json({ error: 'Failed to fetch sci-fi movies' });
  }
}

export async function getComedy(req, res) {
  try {
    const movies = await getCachedMovies('comedy', async () => {
      return await TmdbService.discoverMovies({
        with_genres: GENRE_IDS.comedy
      });
    });
    res.json(movies);
  } catch (error) {
    console.error('Error in getComedy:', error);
    res.status(500).json({ error: 'Failed to fetch comedy movies' });
  }
}

export async function getThriller(req, res) {
  try {
    const movies = await getCachedMovies('thriller', async () => {
      return await TmdbService.discoverMovies({
        with_genres: GENRE_IDS.thriller
      });
    });
    res.json(movies);
  } catch (error) {
    console.error('Error in getThriller:', error);
    res.status(500).json({ error: 'Failed to fetch thriller movies' });
  }
}

export async function getHorror(req, res) {
  try {
    const movies = await getCachedMovies('horror', async () => {
      return await TmdbService.discoverMovies({
        with_genres: GENRE_IDS.horror
      });
    });
    res.json(movies);
  } catch (error) {
    console.error('Error in getHorror:', error);
    res.status(500).json({ error: 'Failed to fetch horror movies' });
  }
}

export async function getSuspense(req, res) {
  try {
    const movies = await getCachedMovies('suspense', async () => {
      // Suspense uses thriller genre but sorted by release date for variety
      return await TmdbService.discoverMovies({
        with_genres: GENRE_IDS.suspense,
        sort_by: 'release_date.desc'
      });
    });
    res.json(movies);
  } catch (error) {
    console.error('Error in getSuspense:', error);
    res.status(500).json({ error: 'Failed to fetch suspense movies' });
  }
}

export async function getDrama(req, res) {
  try {
    const movies = await getCachedMovies('drama', async () => {
      return await TmdbService.discoverMovies({
        with_genres: GENRE_IDS.drama
      });
    });
    res.json(movies);
  } catch (error) {
    console.error('Error in getDrama:', error);
    res.status(500).json({ error: 'Failed to fetch drama movies' });
  }
}

export async function getMovieDetails(req, res) {
  try {
    const movieId = req.params.id;
    const movie = await TmdbService.getMovieDetails(movieId);
    res.json({
      id: movie.id,
      title: movie.title,
      overview: movie.overview || '',
      posterPath: movie.posterPath || '',
      posterUrl: movie.posterUrl,
      releaseDate: movie.releaseDate || ''
    });
  } catch (error) {
    console.error('Error in getMovieDetails:', error);
    res.status(500).json({ error: 'Failed to fetch movie details' });
  }
}

