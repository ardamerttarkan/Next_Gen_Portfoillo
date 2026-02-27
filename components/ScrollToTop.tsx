/**
 * ScrollToTop — Sayfa aşağı kaydırıldığında sağ alt köşede beliren
 * "yukarı çık" butonu. 400px scroll sonrası görünür olur.
 */
import React, { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";

export const ScrollToTop: React.FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Sayfanın başına git"
      title="Yukarı çık"
      className="fixed bottom-[4.5rem] right-6 z-50 p-3 rounded-full shadow-xl
                 bg-white dark:bg-white/10 dark:backdrop-blur-xl
                 border border-gray-200 dark:border-white/10
                 text-gray-600 dark:text-white
                 hover:scale-110 hover:shadow-2xl
                 active:scale-95
                 transition-all duration-200"
    >
      <ArrowUp className="w-5 h-5" />
    </button>
  );
};
