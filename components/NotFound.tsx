import React from "react";
import { Home, AlertTriangle } from "lucide-react";

interface NotFoundProps {
  onGoHome: () => void;
}

export const NotFound: React.FC<NotFoundProps> = ({ onGoHome }) => {
  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#06060e] flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        {/* İkon */}
        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-red-500/20 to-orange-500/20 flex items-center justify-center">
          <AlertTriangle className="w-10 h-10 text-red-400" />
        </div>

        {/* Büyük rakam */}
        <p className="text-[9rem] leading-none font-display font-black text-gray-200 dark:text-white/[0.06] select-none mb-2">
          404
        </p>

        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
          Sayfa Bulunamadı
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
          Aradığınız sayfa mevcut değil ya da taşınmış olabilir. URL'yi kontrol
          edip tekrar deneyin.
        </p>

        <button
          onClick={onGoHome}
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-purple-500/20"
        >
          <Home className="w-5 h-5" />
          Ana Sayfaya Dön
        </button>
      </div>
    </div>
  );
};
