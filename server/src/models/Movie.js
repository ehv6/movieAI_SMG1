class Movie {
  constructor(data = {}) {
    this.id = data.id ?? null;
    this.title = data.title ?? '';
    this.overview = data.overview ?? '';
    this.posterPath = data.poster_path ?? '';
    this.releaseDate = data.release_date ?? '';
  }
}

export default Movie;
