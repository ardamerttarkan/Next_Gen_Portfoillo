import React from "react";
import { Moon, Sun } from "lucide-react";

interface ThemeToggleProps {
  isDark: boolean;
  toggle: () => void;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ isDark, toggle }) => {
  return (
    <button
      onClick={toggle}
      className="fixed top-6 right-6 z-50 p-3 rounded-full bg-white shadow-lg border border-gray-200 dark:bg-white/[0.06] dark:backdrop-blur-xl dark:border-white/[0.1] dark:shadow-none hover:scale-110 transition-all duration-300 group"
      title={isDark ? "Aydınlık Moda Geç" : "Karanlık Moda Geç"}
    >
      {isDark ? (
        <Sun className="w-5 h-5 text-amber-400 group-hover:text-amber-300" />
      ) : (
        <Moon className="w-5 h-5 text-gray-600 group-hover:text-purple-500 transition-colors" />
      )}
    </button>
  );
};
