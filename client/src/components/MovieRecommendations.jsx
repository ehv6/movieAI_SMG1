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

        const seedTitles = favorites
          .map((m) => m.title)
          .slice(0, 3)
          .join(", ");

        const query = `recommend movies similar to ${seedTitles}`;

        const res = await fetch(
          `/api/ai-search?query=${encodeURIComponent(query)}&lang=${language}`
        );

        if (!res.ok) throw new Error("Failed to fetch recommendations");

        const data = await res.json();
        const movies = data.movies || [];

        const favoriteIds = new Set(favorites.map((m) => m.id));

        const formatted = movies
          .filter((m) => !favoriteIds.has(m.id))
          .map((m) => ({
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
  }, [favorites, language]);

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
            className="w-full text-left bg-white dark:bg-gray-800 p-4 rounded-xl shadow hover:shadow-lg transition"
          >
            <div className="flex gap-4">
              {movie.posterUrl && (
                <img
                  src={movie.posterUrl}
                  alt={movie.title}
                  className="w-20 h-auto rounded-lg"
                />
              )}

              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {movie.title}
                </h3>

                {movie.overview && (
                  <p className="text-sm text-gray-700 dark:text-gray-300 mt-2 line-clamp-3">
                    {movie.overview}
                  </p>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}