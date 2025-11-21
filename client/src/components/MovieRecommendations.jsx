import React, { useContext, useEffect, useState } from "react";
import { FavoritesContext } from "../contexts/FavoritesContext";
import {useI18n } from "../contexts/I18nContext";

const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w500";

export default function MovieRecommendations({ onSelect }) {
  const { favorites } = useContext(FavoritesContext);
  const {language } = useI18n();
  const lang = (language || 'en').toLowerCase();
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);

  // Helper: Extract clean genre names from TMDB genre JSON
  function extractGenres(movie) {
    try {
      if (!movie.genres) return [];
      if (Array.isArray(movie.genres)) {
        return movie.genres.map((g) => g.name || g.id || "").filter(Boolean);
      }
      // Handle raw JSON string from CSV/TMDB
      const parsed = JSON.parse(movie.genres);
      return parsed.map((g) => g.name || "").filter(Boolean);
    } catch {
      return [];
    }
  }

  // Build weighted genre profile from favorites
  function buildUserProfile() {
    const profile = {};
    favorites.forEach((movie) => {
      const genres = extractGenres(movie);
      genres.forEach((g) => {
        profile[g] = (profile[g] || 0) + 1;
      });
    });
    return profile;
  }

  // Score a candidate movie relative to user profile
  function scoreMovie(movie, profile) {
    const genres = extractGenres(movie);

    let score = 0;
    genres.forEach((g) => {
      score += profile[g] || 0; // weighted match
    });

    // Slight boost for popularity & rating
    score += (movie.popularity || 0) * 0.02;
    score += (movie.vote_average || 0) * 0.3;

    return score;
  }

  function explainReccomendation(movie, profile) {
    const genres = extractGenres(movie);
    const matched = genres.filter((g) => profile[g]);
    const topMatches = matched.slice(0,3);

    const parts = [];
    const joined = topMatches.join(", ");

    if (topMatches.length > 0) {
        if (lang.startsWith('es')) {
            parts.push(`te gustan las películas de ${joined}`);}
        else if (lang.startsWith('fr')) {
            parts.push(`vous aimez les films de ${joined}`);}
        else {
            parts.push(`you like ${joined} movies`);
        }        
    }

    if ((movie.popularity || 0) > 50) {
        if (lang.startsWith('es')) {
            parts.push('es popular entre otros usuarios');}
        else if (lang.startsWith('fr')) {
            parts.push('il est populaire auprès des autres spectateurs');}
        else {
            parts.push('it is popular with other viewers');
        }}

    if ((movie.popularity || 0) > 50) {
        if (lang.startsWith('es')) {
            parts.push('es popular entre otros usuarios');}
        else if (lang.startsWith('fr')) {
            parts.push('il est populaire auprès des autres spectateurs');}
        else {
            parts.push('it is popular with other viewers');
        }}
    
      if (parts.length === 0) {
        return t("recommendations.reasonGeneric");
      }
    
      
    if (parts.length === 0) {
        if (lang.startsWith('es')) return 'Basado en tus películas favoritas.';
        if (lang.startsWith('fr')) return 'Basé sur vos films favoris.';
        return 'Based on patterns in your favorite movies.';
      }
  
      const andWord = lang.startsWith('es') ? 'y' : lang.startsWith('fr') ? 'et' : 'and';
      const sentence = parts.join(` ${andWord} `);
      return sentence.charAt(0).toUpperCase() + sentence.slice(1) + '.';
    }
  

  useEffect(() => {
    async function generateRecommendations() {
      if (favorites.length === 0) return;

      setLoading(true);

      try {
        // Step 1: Build user genre preference profile
        const profile = buildUserProfile();

        // Step 2: Fetch a broad list of popular movies from your server
        const res = await fetch(`/api/movies/popular?lang=${language}`);
        if (!res.ok) {
        throw new Error('Failed to fetch popular movies');
        }
        const data = await res.json();

        // Handle both shapes: array or { movies: [...] }
        const allMovies = Array.isArray(data) ? data : (data.movies || []);

        // Step 3: Filter out movies the user already favorited
        const filtered = allMovies.filter(
          (m) => !favorites.some((f) => f.id === m.id)
        );

        // Step 4: Rank movies by genre similarity
        const ranked = filtered
          .map((m) => ({
            ...m,
            _score: scoreMovie(m, profile),
            _why: explainReccomendation(m,profile),
          }))
          .sort((a, b) => b._score - a._score);

        // Step 5: Take top 12 recommendations
        setRecommendations(ranked.slice(0, 12));
      } catch (err) {
        console.error("Error generating recommendations:", err);
      }

      setLoading(false);
    }

    generateRecommendations();
  }, [favorites]);

  if (loading)
    return (
        <p style={{ marginTop: "20px" }}>
          {lang.startsWith('es')
            ? 'Cargando recomendaciones...'
            : lang.startsWith('fr')
            ? 'Chargement des recommandations...'
            : 'Loading recommendations...'}
        </p>
    );

  if (recommendations.length === 0) return null;

  return (
    <div style={{ marginTop: "40px" }}>
      <h2 style={{ marginBottom: "15px" }}>
      {lang.startsWith('es')
          ? 'Recomendado para ti'
          : lang.startsWith('fr')
          ? 'Recommandé pour vous'
          : 'Recommended For You'}
        </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
          gap: "20px",
        }}
      >
        {recommendations.map((movie) => (
          <div
            key={movie.id}
            onClick={() => onSelect(movie)}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              borderRadius: "8px",
              textAlign: "center",
              cursor: "pointer",
              background: "white",
            }}
          >
            <img
              src={
                movie.posterPath
                  ? `${TMDB_IMAGE_BASE}${movie.posterPath}`
                  : ""
              }
              alt={movie.title}
              style={{ width: "100%", borderRadius: "4px" }}
            />
            <h4 style={{ marginTop: "8px", fontSize: "0.95rem" }}>
              {movie.title}
            </h4>
            {movie._why && (
                <p
                    style={{
                        marginTop: "4px",
                        fontSize: "0.8rem",
                        color: "#555",
                    }}
                    >
                    {movie._why}
                </p>
            )}    
          </div>
        ))}
      </div>
    </div>
  );
}