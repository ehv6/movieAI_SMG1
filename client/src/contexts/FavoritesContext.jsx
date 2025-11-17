import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const FavoritesContext = createContext(null);

export function FavoritesProvider({ children }) {
  // Keep simple: store whole movie objects (id, title, poster, genres...)
  const [favorites, setFavorites] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("favorites") || "[]");
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  const isFav = (id) => favorites.some((m) => Number(m.id) === Number(id));

  const add = (movie) => {
    if (!movie?.id || isFav(movie.id)) return;
    setFavorites((prev) => [...prev, movie]);
  };

  const remove = (id) => {
    setFavorites((prev) => prev.filter((m) => Number(m.id) !== Number(id)));
  };

  const toggle = (movie) => (isFav(movie.id) ? remove(movie.id) : add(movie));

  const value = useMemo(() => ({ favorites, isFav, add, remove, toggle }), [favorites]);
  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites must be used within FavoritesProvider");
  return ctx;
}