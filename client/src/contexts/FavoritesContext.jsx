import React, { createContext, useState, useEffect } from "react";

export const FavoritesContext = createContext();

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState(() => {
    try{
      const saved = localStorage.getItem("favorites");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    } 
    });

  const addFavorite = (movie) => {
    if (!favorites.some((f) => f.id === movie.id)) {
      setFavorites([...favorites, movie]);
    }
  };

  const removeFavorite = (id) => {
    setFavorites(favorites.filter((f) => f.id !== id));
  };

  const isFavorite = (id) => favorites.some((f) => f.id === id);

  const clearFavorites = () => {
    setFavorites([]);

    
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.removeItem('favorites');
      } catch {
      
      }
    }
  };

  useEffect(() => {
    try {
      localStorage.setItem("favorites", JSON.stringify(favorites));
    } catch (err) {
      console.error("Failed to save favorites", err);
    }
  }, [favorites]);


  return (
    <FavoritesContext.Provider
      value={{ favorites, addFavorite, removeFavorite, isFavorite, clearFavorites }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}