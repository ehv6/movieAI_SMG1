import React, { useContext, useState } from "react";
import { FavoritesContext } from "../contexts/FavoritesContext";
import MovieDetails from "./MovieDetails";
import MovieRecommendations from "./MovieRecommendations";

const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w500";

export default function Favorites() {
  const { favorites } = useContext(FavoritesContext);
  const [selected, setSelected] = useState(null); 

  if (!favorites || favorites.length === 0) {
    return <h2 style={{ padding: "20px" }}>No favorites saved yet.</h2>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Your Favorites</h1>

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
    </div>
  );
}