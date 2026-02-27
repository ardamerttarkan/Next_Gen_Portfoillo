/**
 * SkeletonCard — Blog kartları için shimmer (iskelet) yükleme animasyonu.
 * Spinner yerine kullanılır; çok daha profesyonel görünür.
 */
import React from "react";

interface SkeletonCardProps {
  variant?: "personal" | "professional";
}

export const SkeletonCard: React.FC<SkeletonCardProps> = ({
  variant = "personal",
}) => {
  const isProf = variant === "professional";

  return (
    <div
      className={`rounded-2xl overflow-hidden border flex flex-col
        ${
          isProf
            ? "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
            : "bg-white dark:bg-[#121212] border-gray-200 dark:border-white/5"
        }`}
    >
      {/* Görsel alanı */}
      <div className="h-48 bg-gray-200 dark:bg-white/[0.05] shrink-0 relative overflow-hidden">
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      </div>

      {/* İçerik alanı */}
      <div className="p-6 space-y-3 flex-1">
        {/* Tarih + okuma süresi */}
        <div className="flex gap-3">
          <div className="h-3 w-20 bg-gray-200 dark:bg-white/[0.06] rounded-full animate-pulse" />
          <div className="h-3 w-16 bg-gray-200 dark:bg-white/[0.06] rounded-full animate-pulse" />
        </div>

        {/* Başlık */}
        <div className="h-5 bg-gray-200 dark:bg-white/[0.07] rounded-lg w-4/5 animate-pulse" />
        <div className="h-5 bg-gray-200 dark:bg-white/[0.07] rounded-lg w-3/5 animate-pulse" />

        {/* Özet */}
        <div className="space-y-2 pt-1">
          <div className="h-3.5 bg-gray-200 dark:bg-white/[0.05] rounded-full w-full animate-pulse" />
          <div className="h-3.5 bg-gray-200 dark:bg-white/[0.05] rounded-full w-5/6 animate-pulse" />
          <div className="h-3.5 bg-gray-200 dark:bg-white/[0.05] rounded-full w-4/6 animate-pulse" />
        </div>

        {/* Link */}
        <div className="h-4 w-24 bg-gray-200 dark:bg-white/[0.06] rounded-full animate-pulse mt-2" />
      </div>
    </div>
  );
};
