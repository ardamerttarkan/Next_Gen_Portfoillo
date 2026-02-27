import React, { useState, useEffect, useRef } from "react";
import {
  Play,
  SkipBack,
  SkipForward,
  Heart,
  Repeat,
  Shuffle,
  Volume2,
  Music,
} from "lucide-react";
import type { SpotifyNowPlaying } from "../types/spotify";

interface SpotifyWidgetProps {
  /** Gerçek Spotify verisi (null = hiçbir şey çalmıyor veya veri yok) */
  nowPlaying: SpotifyNowPlaying | null;
}

/**
 * SpotifyWidget
 * =============
 * Şu anda çalan şarkıyı gösteren widget.
 *
 * Değişenler:
 * - Artık mock Song değil, gerçek SpotifyNowPlaying verisi alıyor
 * - Progress bar gerçek ilerlemeyi gösteriyor (Spotify'dan gelen progress_ms)
 * - Hiçbir şey çalmıyorsa "idle" tasarımı gösteriyor
 * - Şarkı linkine tıklayınca Spotify'da açılıyor
 */
export const SpotifyWidget: React.FC<SpotifyWidgetProps> = ({ nowPlaying }) => {
  /**
   * progress bar DOM ref — React state'i kullanmıyoruz.
   * Her saniyede React re-render tetiklemek yerine
   * doğrudan DOM style'a yazıyoruz (rAF loop).
   */
  const progressBarRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const sessionRef = useRef<{
    startTime: number;
    startPct: number;
    msPerPct: number;
  } | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Spotify'dan gelen veri değişince animasyonu yeniden başlat
  useEffect(() => {
    const playing = nowPlaying?.isPlaying ?? false;
    setIsPlaying(playing);

    cancelAnimationFrame(rafRef.current);
    sessionRef.current = null;

    if (playing && nowPlaying?.progress_ms != null && nowPlaying?.duration_ms) {
      const startPct = (nowPlaying.progress_ms / nowPlaying.duration_ms) * 100;
      const msPerPct = nowPlaying.duration_ms / 100;

      sessionRef.current = {
        startTime: performance.now(),
        startPct,
        msPerPct,
      };

      const animate = (now: number) => {
        const s = sessionRef.current;
        if (!s || !progressBarRef.current) return;
        const elapsed = now - s.startTime;
        const pct = Math.min(100, s.startPct + elapsed / s.msPerPct);
        progressBarRef.current.style.width = `${pct}%`;
        if (pct < 100) rafRef.current = requestAnimationFrame(animate);
      };

      rafRef.current = requestAnimationFrame(animate);
    } else if (progressBarRef.current) {
      // Durduğunda veya veri yoksa 0'a sıfırla
      progressBarRef.current.style.width = "0%";
    }

    return () => cancelAnimationFrame(rafRef.current);
  }, [nowPlaying?.isPlaying, nowPlaying?.progress_ms, nowPlaying?.duration_ms]);

  /**
   * formatTime: milisaniyeyi "dakika:saniye" formatına çevirir
   * Örnek: 183000 → "3:03"
   */
  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  // Hiçbir şey çalmıyorsa veya veri yoksa "idle" durumu göster
  const isIdle = !nowPlaying || !nowPlaying.isPlaying || !nowPlaying.title;

  return (
    <div className="group relative rounded-2xl overflow-hidden">
      {/* Glow border on hover */}
      <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-br from-green-500/25 to-emerald-500/15 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-[1px]" />

      <div className="relative bg-white dark:bg-white/[0.03] backdrop-blur-xl border border-gray-200/60 dark:border-white/[0.06] rounded-2xl p-5 w-full transition-[background-color,border-color,box-shadow] duration-300 shadow-sm dark:shadow-none group-hover:shadow-lg dark:group-hover:shadow-none group-hover:bg-green-50/30 dark:group-hover:bg-white/[0.05]">
        {/* Top accent line */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-green-500/40 to-transparent" />

        {/* Now Playing label */}
        <p className="text-[10px] text-green-600 dark:text-green-400 font-bold uppercase tracking-[0.2em] mb-4 flex items-center gap-1.5">
          <span
            className={`w-1.5 h-1.5 rounded-full ${isIdle ? "bg-gray-400 dark:bg-gray-600" : "bg-green-500 dark:bg-green-400 animate-pulse"}`}
          />
          {isIdle ? "Şu an çalmıyor" : "Şu an çalıyor"}
        </p>

        {isIdle ? (
          /* ===== Idle State: Hiçbir şey çalmıyorken ===== */
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <div className="w-16 h-16 rounded-xl bg-gray-100 dark:bg-white/[0.04] flex items-center justify-center mb-3">
              <Music className="w-7 h-7 text-gray-400 dark:text-gray-600" />
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Spotify'da şu an bir şey çalmıyor
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-600 mt-1">
              Müzik açınca burada görünecek
            </p>
          </div>
        ) : (
          /* ===== Playing State: Şarkı çalıyorken ===== */
          <>
            <div className="flex items-center gap-4 mb-5">
              <a
                href={nowPlaying!.songUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="relative shrink-0"
              >
                <img
                  src={nowPlaying!.albumArt}
                  alt={nowPlaying!.title}
                  className="w-16 h-16 rounded-xl shadow-lg object-cover border border-gray-200/40 dark:border-white/[0.08]"
                />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-black/20 to-transparent" />
              </a>
              <div className="flex-1 min-w-0">
                <h3 className="text-gray-900 dark:text-white font-bold truncate text-[15px] leading-tight mb-0.5">
                  {nowPlaying!.title}
                </h3>
                <p className="text-gray-400 dark:text-gray-500 text-sm truncate">
                  {nowPlaying!.artist}
                </p>
                <p className="text-gray-300 dark:text-gray-600 text-[11px] truncate mt-0.5">
                  {nowPlaying!.album}
                </p>
              </div>
              <Heart
                className="text-green-500 dark:text-green-400 w-4.5 h-4.5 cursor-pointer hover:scale-110 transition-transform shrink-0"
                fill="currentColor"
              />
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="h-1 w-full bg-gray-200 dark:bg-white/[0.06] rounded-full overflow-hidden">
                <div
                  ref={progressBarRef}
                  className="h-full bg-gradient-to-r from-green-400 to-emerald-400 rounded-full shadow-[0_0_6px_rgba(74,222,128,0.3)]"
                  style={{ width: "0%" }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-gray-400 dark:text-gray-600 mt-1.5 font-mono">
                <span>
                  {nowPlaying!.progress_ms
                    ? formatTime(nowPlaying!.progress_ms)
                    : "0:00"}
                </span>
                <span>
                  {nowPlaying!.duration_ms
                    ? formatTime(nowPlaying!.duration_ms)
                    : "0:00"}
                </span>
              </div>
            </div>

            {/* Controls (dekoratif — Spotify Web API'de playback control için premium + device gerekir) */}
            <div className="flex items-center justify-between px-3">
              <Shuffle className="w-3.5 h-3.5 text-gray-400 dark:text-gray-600 hover:text-green-500 dark:hover:text-green-400 cursor-pointer transition-colors" />
              <SkipBack className="w-4.5 h-4.5 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white cursor-pointer transition-colors" />

              <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/20">
                {isPlaying ? (
                  <div className="flex gap-1 h-3.5 items-center">
                    <div className="w-[3px] h-3.5 bg-white rounded-full" />
                    <div className="w-[3px] h-3.5 bg-white rounded-full" />
                  </div>
                ) : (
                  <Play
                    className="w-4.5 h-4.5 text-white ml-0.5"
                    fill="white"
                  />
                )}
              </div>

              <SkipForward className="w-4.5 h-4.5 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white cursor-pointer transition-colors" />
              <Repeat className="w-3.5 h-3.5 text-green-500 dark:text-green-400 cursor-pointer hover:text-green-600 dark:hover:text-green-300 transition-colors" />
            </div>

            {/* Volume (dekoratif) */}
            <div className="flex items-center gap-2 mt-4 justify-end">
              <Volume2 className="w-3.5 h-3.5 text-gray-400 dark:text-gray-600" />
              <div className="w-16 h-1 bg-gray-200 dark:bg-white/[0.06] rounded-full overflow-hidden">
                <div className="w-3/4 h-full bg-gray-400 dark:bg-gray-500 hover:bg-green-500 dark:hover:bg-green-400 rounded-full transition-colors" />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
