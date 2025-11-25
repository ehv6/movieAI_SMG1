import React, { useContext, useState, useRef, useEffect } from "react";
import { FavoritesContext } from "../contexts/FavoritesContext";
import MovieDetails from "./MovieDetails";
import MovieRecommendations from "./MovieRecommendations";
import { useI18n } from "../contexts/I18nContext";

const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w500";

export default function Favorites() {
  const { favorites } = useContext(FavoritesContext);
  const [selected, setSelected] = useState(null);
  const detailsRef = useRef(null);
  
  // Scroll to selected movie details when selection changes
  useEffect(() => {
    if (selected && detailsRef.current) {
      setTimeout(() => {
        detailsRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
          inline: 'nearest'
        })
      }, 100)
    }
  }, [selected]) 

  if (!favorites || favorites.length === 0) {
    return <h2 className="p-5 text-gray-900 dark:text-gray-100">No favorites saved yet.</h2>;
  }

  return (
    <div className="p-5">
      <h1 className="text-gray-900 dark:text-gray-100 mb-4">Your Favorites</h1>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-5">
        {favorites.map((movie) => {
          const rawPoster =
            movie.posterUrl ||
            movie.posterPath ||
            movie.poster_path ||
            "";
          const src = rawPoster.startsWith("http")
            ? rawPoster
            : `${TMDB_IMAGE_BASE}${rawPoster}`;

          return (
            <div
              key={movie.id}
              onClick={() => setSelected(movie)}
              className="border border-gray-300 dark:border-gray-700 p-2.5 rounded-lg text-center cursor-pointer bg-white dark:bg-gray-800 hover:shadow-md dark:hover:shadow-gray-700 transition-shadow"
            >
              {src && (
                <img
                  src={src}
                  alt={movie.title}
                  className="w-full rounded"
                />
              )}
              <h3 className="mt-2 text-sm text-gray-900 dark:text-gray-100">
                {movie.title}
              </h3>
            </div>
          );
        })}
      </div>
      
      <MovieRecommendations onSelect={setSelected} />

      {selected && (
        <div ref={detailsRef}>
          <MovieDetails
            movie={selected}
            onClose={() => setSelected(null)}
          />
        </div>
      )}

        <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            padding: "12px 18px",
            background: "#1e3a8a",
            color: "white",
            border: "none",
            borderRadius: "50px",
            cursor: "pointer",
            boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
            zIndex: 9999,
        }}
        >
        ↑ {backToTopLabel}
        </button>
    </div>
  );
}