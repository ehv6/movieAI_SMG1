import React, { useContext, useEffect, useState } from "react";
import { FavoritesContext } from "../contexts/FavoritesContext";
import {useI18n } from "../contexts/I18nContext";

const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w500";

export default function MovieRecommendations({ onSelect }) {
  const { favorites } = useContext(FavoritesContext);
  const { language, t } = useI18n();

  const [datasetRecommendations, setDatasetRecommendations] = useState([]);
  const [aiRecommendations, setAiRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [error, setError] = useState("");
  const [aiError, setAiError] = useState("");

  useEffect(() => {
    if (!favorites || favorites.length === 0) {
      setDatasetRecommendations([]);
      setAiRecommendations([]);
      return;
    }

    async function fetchRecommendations() {
      try {
        setLoading(true);
        setError("");

        // Extract all favorite movie IDs (not just first 3)
        const favoriteIds = favorites
          .map((m) => m.id)
          .filter((id) => id != null && !isNaN(id));

        if (favoriteIds.length === 0) {
          setDatasetRecommendations([]);
          return;
        }

        // Use the new recommendation endpoint that analyzes all favorites
        const favoriteIdsParam = favoriteIds.join(",");
        const res = await fetch(
          `/api/movies/recommendations?favoriteIds=${encodeURIComponent(favoriteIdsParam)}`
        );

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(errorData.error || "Failed to fetch recommendations");
        }

        const data = await res.json();

        // Handle both shapes: array or { movies: [...] }
        const allMovies = Array.isArray(data) ? data : (data.movies || []);

        // Format movies with poster URLs
        const formatted = movies.map((m) => ({
          ...m,
          posterUrl: m.posterUrl
            ? m.posterUrl
            : m.posterPath
            ? `${TMDB_IMAGE_BASE}${m.posterPath}`
            : "",
        }));

        setDatasetRecommendations(formatted);
      } catch (error) {
        console.error("Recommendation error:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchRecommendations();
  }, [favorites]);

  // Fetch AI recommendations (OpenAI-driven) based on favorites
  useEffect(() => {
    if (!favorites || favorites.length === 0) {
      setAiRecommendations([]);
      return;
    }

    async function fetchAiRecommendations() {
      try {
        setAiLoading(true);
        setAiError("");

        // Extract favorite movie IDs
        const favoriteIds = favorites
          .map((m) => m.id)
          .filter((id) => id != null && !isNaN(id));

        if (favoriteIds.length === 0) {
          setAiRecommendations([]);
          return;
        }

        const favoriteIdsParam = favoriteIds.join(",");
        const res = await fetch(
          `/api/movies/ai-recommendations?favoriteIds=${encodeURIComponent(favoriteIdsParam)}`
        );

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(errorData.error || 'Failed to fetch AI recommendations');
        }

        const data = await res.json();
        const movies = data.movies || [];

        // Format movies with poster URLs
        const formatted = movies.map((m) => ({
          ...m,
          posterUrl: m.posterUrl
            ? m.posterUrl
            : m.posterPath
            ? `${TMDB_IMAGE_BASE}${m.posterPath}`
            : "",
        }));

        setAiRecommendations(formatted);
      } catch (err) {
        console.error('AI recommendation error:', err);
        setAiError(err.message);
      } finally {
        setAiLoading(false);
      }
    }

    fetchAiRecommendations();
  }, [favorites]);

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

      <div className="flex flex-col md:flex-row gap-6">
        {/* Left: Dataset recommendations (half width) */}
        <div className="w-full md:w-1/2">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">Dataset</h3>
            {loading && <span className="text-sm text-gray-500">{t('loading')}</span>}
          </div>

          {error && <p className="text-red-500 mb-2">{error}</p>}

          {!loading && !error && datasetRecommendations.length === 0 && (
            <p className="text-gray-500">No dataset recommendations yet.</p>
          )}

          <div className="space-y-4">
            {datasetRecommendations.map((movie) => (
              <button
                key={`dataset-${movie.id}`}
                type="button"
                onClick={() => onSelect(movie)}
                className="w-full relative rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] group"
                style={{
                  backgroundImage: movie.posterUrl ? `url(${movie.posterUrl})` : 'none',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  minHeight: '160px'
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/30" />
                <div className="relative p-4 text-white">
                  <h4 className="text-lg font-bold mb-1 text-shadow-lg">{movie.title}</h4>
                  {movie.overview && (
                    <p className="text-sm text-gray-200 line-clamp-2">{movie.overview}</p>
                  )}
                </div>
                {!movie.posterUrl && (
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Right: AI recommendations (half width) */}
        <div className="w-full md:w-1/2">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">AI</h3>
            {aiLoading && <span className="text-sm text-gray-500">{t('loading')}</span>}
          </div>

          {aiError && <p className="text-red-500 mb-2">{aiError}</p>}

          {!aiLoading && !aiError && aiRecommendations.length === 0 && (
            <p className="text-gray-500">No AI recommendations yet.</p>
          )}

          <div className="space-y-4">
            {aiRecommendations.map((movie) => (
              <button
                key={`ai-${movie.id}`}
                type="button"
                onClick={() => onSelect(movie)}
                className="w-full relative rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] group"
                style={{
                  backgroundImage: movie.posterUrl ? `url(${movie.posterUrl})` : 'none',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  minHeight: '160px'
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/30" />
                <div className="relative p-4 text-white">
                  <h4 className="text-lg font-bold mb-1 text-shadow-lg">{movie.title}</h4>
                  {movie.overview && (
                    <p className="text-sm text-gray-200 line-clamp-2">{movie.overview}</p>
                  )}
                </div>
                {!movie.posterUrl && (
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}