// src/components/NavBar.jsx
import React from "react";

export default function NavBar({ currentView, onChangeView }) {
  return (
    <nav className="flex gap-4 px-4 py-2 bg-gray-900 text-white">
      <button
        onClick={() => onChangeView("home")}
        className={
          "hover:underline " +
          (currentView === "home" ? "font-semibold text-blue-300" : "")
        }
      >
        Home
      </button>

      <button
        onClick={() => onChangeView("favorites")}
        className={
          "hover:underline " +
          (currentView === "favorites" ? "font-semibold text-blue-300" : "")
        }
      >
        Favorites
      </button>
    </nav>
  );
}