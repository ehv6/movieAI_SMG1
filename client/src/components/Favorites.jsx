import React, { useContext, useState } from "react";
import { FavoritesContext } from "../contexts/FavoritesContext";
import MovieDetails from "./MovieDetails";
import MovieRecommendations from "./MovieRecommendations";
import { useI18n } from "../contexts/I18nContext";

const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w500";

export default function Favorites() {
  const { favorites } = useContext(FavoritesContext);
  const [selected, setSelected] = useState(null); 
  const{language} = useI18n();
  const lang = (language || 'en').toLowerCase();
  const emptyMessage = 
    lang.startsWith('es') ? 'Toadivia no has guradado favoritos..':
    lang.startsWith('fr') ? 'Aucun favori enregistre pour lé moment. ':
    'No favorites saved yet.';
   const favoritesTitle =
    lang.startsWith('es') ? 'Tus favoritos':
    lang.startsWith('fr') ? 'Vos favoris' :
    'Your Favorites';
   const backToTopLabel = 
   lang.startsWith('es') ? 'Arriba':
   lang.startsWith('fr') ? 'Haut ':
   'Top';



  if (!favorites || favorites.length === 0) {
    return <h2 style={{ padding: "20px" }}>{emptyMessage}</h2>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>{favoritesTitle}</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
          gap: "20px",
        }}
      >
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
              style={{
                border: "1px solid #ccc",
                padding: "10px",
                borderRadius: "8px",
                textAlign: "center",
                cursor: "pointer",
                background: "white",
              }}
            >
              {src && (
                <img
                  src={src}
                  alt={movie.title}
                  style={{ width: "100%", borderRadius: "4px" }}
                />
              )}
              <h3 style={{ marginTop: "8px", fontSize: "0.95rem" }}>
                {movie.title}
              </h3>
            </div>
          );
        })}
      </div>
      
      <MovieRecommendations onSelect={setSelected} />

      {selected && (
        <MovieDetails
        movie={selected}
        onClose={() => setSelected(null)}
        />
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