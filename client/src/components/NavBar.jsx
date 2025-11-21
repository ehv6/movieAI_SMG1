// src/components/NavBar.jsx
import React from "react";
import { useI18n } from "../contexts/I18nContext";

export default function NavBar({ currentView, onChangeView }) {
    const{ language } = useI18n();
    const lang = (language || 'en').toLowerCase();
    const homeLabel =
        lang.startsWith('es') ? 'Inicio':
        lang.startsWith('fr') ? 'Accueil':
        'Home';
    const favoritesLabel = 
        lang.startsWith('es') ? 'Favoritos' :
        lang.startsWith('fr') ? 'Favoris' :
        'Favorites';

  return (
    <nav className="flex gap-4 px-4 py-2 bg-gray-900 text-white">
      <button
        onClick={() => onChangeView("home")}
        className={
          "hover:underline " +
          (currentView === "home" ? "font-semibold text-blue-300" : "")
        }
      >
        {homeLabel}
      </button>

      <button
        onClick={() => onChangeView("favorites")}
        className={
          "hover:underline " +
          (currentView === "favorites" ? "font-semibold text-blue-300" : "")
        }
      >
        {favoritesLabel}
      </button>
    </nav>
  );
}