import React from "react";
import { Home, AlertTriangle, Search } from "lucide-react";

interface NotFoundProps {
  onGoHome: () => void;
}

export const NotFound: React.FC<NotFoundProps> = ({ onGoHome }) => {
  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#06060e] flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        {/* İkon */}
        <div className="w-24 h-24 mx-auto mb-8 rounded-3xl bg-gradient-to-br from-amber-500/20 via-orange-500/20 to-red-500/20 flex items-center justify-center shadow-lg shadow-orange-500/10">
          <div className="relative">
            <Search className="w-10 h-10 text-orange-400" />
            <AlertTriangle className="w-5 h-5 text-red-400 absolute -bottom-1 -right-1" />
          </div>
        </div>

        {/* Büyük rakam */}
        <p className="text-[10rem] leading-none font-display font-black bg-gradient-to-b from-gray-200 to-gray-100 dark:from-white/10 dark:to-white/[0.03] bg-clip-text text-transparent select-none mb-4">
          404
        </p>

        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Üzgünüz!
        </h1>
        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-3">
          Aradığınız sayfa bulunamadı
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mb-10 leading-relaxed">
          Bu sayfa mevcut değil, taşınmış veya silinmiş olabilir. URL adresini
          kontrol edip tekrar deneyin.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onGoHome}
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-2xl hover:opacity-90 active:scale-95 transition-all shadow-xl shadow-purple-500/25"
          >
            <Home className="w-5 h-5" />
            Ana Sayfaya Dön
          </button>
        </div>
      </div>
    </div>
  );
};
