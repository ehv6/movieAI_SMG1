import React, { useContext, useEffect, useState } from "react";
import { FavoritesContext } from "../contexts/FavoritesContext";
import { useI18n } from "../contexts/I18nContext";

const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w500";

export default function MovieRecommendations({ onSelect }) {
  const { favorites } = useContext(FavoritesContext);
  const { language, t } = useI18n();

  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!favorites || favorites.length === 0) {
      setRecommendations([]);
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
          setRecommendations([]);
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

        setRecommendations(formatted);
      } catch (error) {
        console.error("Recommendation error:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchRecommendations();
  }, [favorites]);

  if (!favorites?.length) return null;

  return (
    <div className="mt-10">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
        Recommendations based on your favorites
      </h2>

      {loading && <p className="text-gray-500">{t("loading")}</p>}

      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && recommendations.length === 0 && (
        <p className="text-gray-500">No recommendations yet.</p>
      )}

      <div className="space-y-4">
        {recommendations.map((movie) => (
          <button
            key={movie.id}
            type="button"
            onClick={() => onSelect(movie)}
            className="w-full relative rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] group"
            style={{
              backgroundImage: movie.posterUrl ? `url(${movie.posterUrl})` : 'none',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              minHeight: '200px'
            }}
          >
            {/* Gradient overlay - darker at top, gradually revealing poster at bottom */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/70 to-black/40" />
            
            {/* Content overlay */}
            <div className="relative p-6 text-white">
              <h3 className="text-xl font-bold mb-2 text-shadow-lg">
                {movie.title}
              </h3>

              {movie.overview && (
                <p className="text-sm text-gray-200 mb-4 line-clamp-2 text-shadow-md">
                  {movie.overview}
                </p>
              )}

              {/* Where to Watch hint - appears on hover */}
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="text-xs text-gray-300 font-medium">
                  Click to view details and where to watch →
                </div>
              </div>
            </div>

            {/* Fallback for movies without posters */}
            {!movie.posterUrl && (
              <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}