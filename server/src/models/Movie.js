class Movie {
  constructor(data = {}) {
    this.id = data.id ?? null;
    this.title = data.title ?? '';
    this.overview = data.overview ?? '';
    this.posterPath = data.poster_path ?? '';
    this.releaseDate = data.release_date ?? '';
    // Generate full poster URL if posterPath exists
    this.posterUrl = data.poster_path 
      ? `https://image.tmdb.org/t/p/w500${data.poster_path}`
      : 'https://placehold.co/300x450/222/FFF?text=No+Poster';
  }
}

export default Movie;
