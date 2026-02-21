import React from "react";
import { BlogPost } from "../types";
import { SpotifyWidget } from "./SpotifyWidget";
import { useSpotify } from "../hooks/useSpotify";
import { useTMDB } from "../hooks/useTMDB";
import type { SpotifyTrack } from "../types/spotify";
import {
  Star,
  Film,
  BookOpen,
  Clock,
  Music,
  Tv,
  Clapperboard,
  Disc,
  ArrowRight,
  Headphones,
  Sparkles,
  Loader2,
  AlertCircle,
  Mic2,
  Eye,
  History,
} from "lucide-react";

/**
 * PersonalLayout Props
 * --------------------
 * Spotify ve TMDB verileri artık prop olarak gelmiyor!
 * useSpotify ve useTMDB hook'ları ile doğrudan component içinde çekiliyor.
 */
interface PersonalLayoutProps {
  blogs: BlogPost[];
  onBlogClick: (blog: BlogPost) => void;
  onViewAllBlogs: () => void;
}

export const PersonalLayout: React.FC<PersonalLayoutProps> = ({
  blogs,
  onBlogClick,
  onViewAllBlogs,
}) => {
  /**
   * useSpotify Hook Kullanımı
   * -------------------------
   * Destructuring ile ihtiyacımız olan verileri çekiyoruz.
   * Hook, component mount olduğunda API'ye istek atar ve
   * periyodik olarak günceller. Biz sadece sonuçlarını kullanıyoruz.
   */
  const { nowPlaying, topTracks, topArtists, isLoading, error } = useSpotify();

  /**
   * useTMDB Hook Kullanımı
   * ----------------------
   * TMDB'den favori film ve dizi listelerini çeker.
   * Spotify gibi periyodik polling yapmaz — mount'ta bir kere çeker.
   */
  const {
    movies: tmdbMovies,
    series: tmdbSeries,
    recentMovies: tmdbRecentMovies,
    recentSeries: tmdbRecentSeries,
    isLoading: tmdbLoading,
    error: tmdbError,
  } = useTMDB();

  // Statik playlist verileri — Spotify API'den çekilmiyor, sabit.
  // Değiştirmek istersen sadece burayı güncelle.
  const playlists = [
    {
      id: "1ePns5V796UJRZuh4jRolt",
      name: "Nr1 2011-2015 | Eski Yabancı Şarkılar",
      image:
        "https://image-cdn-ak.spotifycdn.com/image/ab67706c0000da84684b5e7c5a767bcd3c2c890b",
      url: "https://open.spotify.com/playlist/1ePns5V796UJRZuh4jRolt",
    },
    {
      id: "2scJv9KNq4fy1TNNbKvTb9",
      name: "Cyberpunk Vibes | Synth & Retro Wave",
      image:
        "https://image-cdn-fa.spotifycdn.com/image/ab67706c0000da845fe5789b15b825ed240b1013",
      url: "https://open.spotify.com/playlist/2scJv9KNq4fy1TNNbKvTb9",
    },
    {
      id: "3VsP18cU91XICMfoqPwMmZ",
      name: "Underground Techno",
      image:
        "https://image-cdn-ak.spotifycdn.com/image/ab67706c0000da848a8c397b41301dd31749249f",
      url: "https://open.spotify.com/playlist/3VsP18cU91XICMfoqPwMmZ",
    },
    {
      id: "0bQGBSjEO5Dx5AGYBCTGn4",
      name: "EDM",
      image:
        "https://image-cdn-ak.spotifycdn.com/image/ab67706c0000da84f751161d99e7a1b74cfc87a4",
      url: "https://open.spotify.com/playlist/0bQGBSjEO5Dx5AGYBCTGn4",
    },
  ];
  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#06060e] text-gray-800 dark:text-gray-200 font-sans selection:bg-purple-500 selection:text-white pb-32">
      {/* ===== Animated Background Orbs ===== */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div
          className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full opacity-[0.06] dark:opacity-[0.15] blur-[140px]"
          style={{
            background: "radial-gradient(circle, #a855f7 0%, transparent 70%)",
            animation: "personalFloat1 14s ease-in-out infinite",
          }}
        />
        <div
          className="absolute top-1/3 -right-32 w-[500px] h-[500px] rounded-full opacity-[0.05] dark:opacity-[0.10] blur-[120px]"
          style={{
            background: "radial-gradient(circle, #1DB954 0%, transparent 70%)",
            animation: "personalFloat2 18s ease-in-out infinite",
          }}
        />
        <div
          className="absolute -bottom-40 left-1/3 w-[550px] h-[550px] rounded-full opacity-[0.05] dark:opacity-[0.10] blur-[130px]"
          style={{
            background: "radial-gradient(circle, #ec4899 0%, transparent 70%)",
            animation: "personalFloat3 16s ease-in-out infinite",
          }}
        />
      </div>

      {/* ===== Subtle Grid ===== */}
      <div className="fixed inset-0 opacity-[0.04] dark:opacity-[0.02] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        {/* Header */}
        <header className="mb-16 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gray-100 dark:bg-white/[0.04] border border-gray-200/60 dark:border-white/[0.08] text-[13px] text-gray-500 dark:text-gray-400 mb-6 backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5 text-purple-500 dark:text-purple-400" />
            <span>Kişisel</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-display font-bold text-gray-900 dark:text-white mb-4 tracking-[-0.04em] leading-[1.1]">
            Dijital{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-fuchsia-500 to-pink-500 dark:from-purple-400 dark:via-fuchsia-400 dark:to-pink-400">
              Ruhum
            </span>
          </h1>
          <p className="text-gray-500 text-lg max-w-2xl leading-relaxed">
            Spotify hareketlerim, favori 5 dizi ve filmlerim, en son
            izlediklerim ve kişisel blog yazılarım. Biraz koddan uzak
          </p>
        </header>

        {/* ===== Section 1: Audio Experience ===== */}
        <section className="mb-24">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-xl bg-green-50 dark:bg-green-500/10 border border-green-200/60 dark:border-green-500/20 flex items-center justify-center">
              <Headphones className="text-green-500 dark:text-green-400 w-5 h-5" />
            </div>
            <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white tracking-tight">
              Müzik
            </h2>
            <div className="h-px flex-1 bg-gray-200 dark:bg-white/[0.06]" />
          </div>

          {/* Spotify yüklenirken loading göster */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-green-500 animate-spin mb-3" />
              <p className="text-sm text-gray-400">
                Spotify verileri yükleniyor...
              </p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-20">
              <AlertCircle className="w-8 h-8 text-red-400 mb-3" />
              <p className="text-sm text-red-400">{error}</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                {/* Now Playing & Widget */}
                <div className="xl:col-span-5 flex flex-col gap-5">
                  <SpotifyWidget nowPlaying={nowPlaying} />

                  {/* Playlists Card */}
                  <div className="group relative rounded-2xl overflow-hidden">
                    <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-br from-green-500/20 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-[1px]" />
                    <div className="relative rounded-2xl bg-white dark:bg-white/[0.03] backdrop-blur-xl border border-gray-200/60 dark:border-white/[0.06] p-6 transition-[background-color,border-color,box-shadow] duration-300 shadow-sm dark:shadow-none group-hover:shadow-lg dark:group-hover:shadow-none group-hover:bg-green-50/30 dark:group-hover:bg-white/[0.05]">
                      <h3 className="flex items-center gap-2 text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[0.15em] mb-5">
                        <Disc className="w-3.5 h-3.5 text-green-500 dark:text-green-400" />{" "}
                        Çalma Listeleri
                      </h3>
                      {playlists.length > 0 ? (
                        <div className="grid grid-cols-2 gap-3">
                          {playlists.map((playlist) => (
                            <a
                              key={playlist.id}
                              href={playlist.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-3 bg-gray-50 dark:bg-white/[0.03] p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-white/[0.07] transition cursor-pointer border border-gray-200/40 dark:border-white/[0.04] hover:border-green-300 dark:hover:border-green-500/20"
                            >
                              {playlist.image ? (
                                <img
                                  src={playlist.image}
                                  alt={playlist.name}
                                  className="w-11 h-11 rounded-lg shadow-sm object-cover"
                                />
                              ) : (
                                <div className="w-11 h-11 rounded-lg bg-green-100 dark:bg-green-500/10 flex items-center justify-center">
                                  <Music className="w-5 h-5 text-green-500" />
                                </div>
                              )}
                              <div className="min-w-0 flex-1">
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate block hover:text-green-600 dark:hover:text-green-400 transition-colors">
                                  {playlist.name}
                                </span>
                              </div>
                            </a>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-400 text-center py-4">
                          Çalma listesi bulunamadı
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Top Tracks */}
                <div className="xl:col-span-7">
                  <div className="group relative h-full rounded-2xl overflow-hidden">
                    <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-br from-purple-500/15 to-fuchsia-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-[1px]" />
                    <div className="relative h-full rounded-2xl bg-white dark:bg-white/[0.03] backdrop-blur-xl border border-gray-200/60 dark:border-white/[0.06] p-7 flex flex-col transition-[background-color,border-color,box-shadow] duration-300 shadow-sm dark:shadow-none group-hover:shadow-lg dark:group-hover:shadow-none group-hover:bg-purple-50/20 dark:group-hover:bg-white/[0.05]">
                      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-purple-500/40 to-transparent" />
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">
                        Bu Ay En Çok Dinlediklerim
                      </h3>
                      <div className="flex-1 space-y-1">
                        {topTracks.slice(0, 5).map((track, idx) => (
                          <a
                            href={track.songUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            key={track.id}
                            className="flex items-center gap-4 group/track p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-white/[0.04] transition border border-transparent hover:border-gray-200/60 dark:hover:border-white/[0.05]"
                          >
                            <span className="text-xl font-display font-bold text-gray-300 dark:text-gray-700 w-7 text-center group-hover/track:text-green-500 dark:group-hover/track:text-green-400 transition-colors">
                              {String(idx + 1).padStart(2, "0")}
                            </span>
                            <img
                              src={track.albumArt}
                              alt={track.title}
                              className="w-12 h-12 rounded-lg shadow-sm object-cover"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="text-[15px] font-semibold text-gray-900 dark:text-white truncate">
                                {track.title}
                              </div>
                              <div className="text-xs text-gray-400 dark:text-gray-500">
                                {track.artist}
                              </div>
                            </div>
                            <span className="text-xs font-medium text-gray-400 dark:text-gray-600">
                              {track.duration}
                            </span>
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ===== Top Artists Section ===== */}
              {topArtists.length > 0 && (
                <div className="mt-8">
                  <div className="group relative rounded-2xl overflow-hidden">
                    <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-br from-fuchsia-500/15 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-[1px]" />
                    <div className="relative rounded-2xl bg-white dark:bg-white/[0.03] backdrop-blur-xl border border-gray-200/60 dark:border-white/[0.06] p-7 transition-[background-color,border-color,box-shadow] duration-300 shadow-sm dark:shadow-none group-hover:shadow-lg dark:group-hover:shadow-none">
                      <h3 className="flex items-center gap-2 text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[0.15em] mb-6">
                        <Mic2 className="w-3.5 h-3.5 text-fuchsia-500 dark:text-fuchsia-400" />{" "}
                        En Çok Dinlenen Sanatçılar
                      </h3>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                        {topArtists.slice(0, 5).map((artist, idx) => (
                          <a
                            key={artist.id}
                            href={artist.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex flex-col items-center text-center group/artist"
                          >
                            <div className="relative mb-3">
                              <img
                                src={artist.image}
                                alt={artist.name}
                                className="w-20 h-20 rounded-full object-cover border-2 border-gray-200 dark:border-white/[0.08] group-hover/artist:border-fuchsia-400 dark:group-hover/artist:border-fuchsia-500/50 transition-colors shadow-md"
                              />
                              <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-gradient-to-br from-fuchsia-500 to-pink-500 flex items-center justify-center text-white text-[10px] font-bold shadow-lg">
                                {idx + 1}
                              </div>
                            </div>
                            <span className="text-sm font-semibold text-gray-900 dark:text-white truncate w-full group-hover/artist:text-fuchsia-500 dark:group-hover/artist:text-fuchsia-400 transition-colors">
                              {artist.name}
                            </span>
                            <span className="text-[10px] text-gray-400 dark:text-gray-600 truncate w-full mt-0.5">
                              {artist.genres[0] || ""}
                            </span>
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </section>

        {/* ===== Section 2: Visual Library ===== */}
        <section className="mb-24">
          {tmdbLoading ? (
            <div className="flex items-center justify-center gap-3 py-16">
              <Loader2 className="w-5 h-5 text-orange-500 animate-spin" />
              <span className="text-sm text-gray-400">
                Film ve dizi verileri yükleniyor...
              </span>
            </div>
          ) : tmdbError ? (
            <div className="flex items-center justify-center gap-3 py-16 text-red-400">
              <AlertCircle className="w-5 h-5" />
              <span className="text-sm">{tmdbError}</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {/* Movies */}
              <div>
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-500/10 border border-orange-200/60 dark:border-orange-500/20 flex items-center justify-center">
                    <Clapperboard className="text-orange-500 dark:text-orange-400 w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-display font-bold text-gray-900 dark:text-white tracking-tight">
                      Sinema
                    </h2>
                    <p className="text-[11px] font-medium text-gray-400 dark:text-gray-600 uppercase tracking-[0.15em]">
                      Favori Filmler
                    </p>
                  </div>
                  <div className="h-px flex-1 bg-gray-200 dark:bg-white/[0.06]" />
                </div>

                <div className="space-y-3">
                  {tmdbMovies.map((movie, index) => (
                    <a
                      key={movie.id}
                      href={movie.tmdbUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex gap-4 rounded-xl bg-white dark:bg-white/[0.03] border border-gray-200/60 dark:border-white/[0.06] p-3 hover:border-orange-300 dark:hover:border-orange-500/25 hover:bg-orange-50/30 dark:hover:bg-white/[0.05] shadow-sm dark:shadow-none hover:shadow-md dark:hover:shadow-none transition-[background-color,border-color,box-shadow] duration-300 cursor-pointer"
                    >
                      <div className="relative w-14 h-20 shrink-0 overflow-hidden rounded-lg">
                        <img
                          src={movie.image}
                          alt={movie.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                        />
                        <div className="absolute top-0 left-0 bg-gradient-to-br from-orange-500 to-amber-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-br-lg">
                          #{index + 1}
                        </div>
                      </div>
                      <div className="flex flex-col justify-center flex-1 min-w-0">
                        <h3 className="text-[15px] font-bold text-gray-900 dark:text-white leading-tight group-hover:text-orange-500 dark:group-hover:text-orange-400 transition-colors truncate">
                          {movie.title}
                        </h3>
                        <div className="flex items-center gap-2 mt-2">
                          <div className="flex gap-0.5">
                            {Array(5)
                              .fill(0)
                              .map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-3 h-3 ${i < Math.round(movie.rating / 2) ? "text-orange-400 fill-orange-400" : "text-gray-300 dark:text-gray-700"}`}
                                />
                              ))}
                          </div>
                          <span className="text-[11px] font-medium text-gray-400 dark:text-gray-500">
                            {movie.rating}/10
                          </span>
                          {movie.year && (
                            <span className="text-[10px] font-medium text-gray-300 dark:text-gray-600">
                              · {movie.year}
                            </span>
                          )}
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>

              {/* TV Series */}
              <div>
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-xl bg-pink-50 dark:bg-pink-500/10 border border-pink-200/60 dark:border-pink-500/20 flex items-center justify-center">
                    <Tv className="text-pink-500 dark:text-pink-400 w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-display font-bold text-gray-900 dark:text-white tracking-tight">
                      Televizyon
                    </h2>
                    <p className="text-[11px] font-medium text-gray-400 dark:text-gray-600 uppercase tracking-[0.15em]">
                      Favori Diziler
                    </p>
                  </div>
                  <div className="h-px flex-1 bg-gray-200 dark:bg-white/[0.06]" />
                </div>

                <div className="space-y-3">
                  {tmdbSeries.map((series, index) => (
                    <a
                      key={series.id}
                      href={series.tmdbUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex gap-4 rounded-xl bg-white dark:bg-white/[0.03] border border-gray-200/60 dark:border-white/[0.06] p-3 hover:border-pink-300 dark:hover:border-pink-500/25 hover:bg-pink-50/30 dark:hover:bg-white/[0.05] shadow-sm dark:shadow-none hover:shadow-md dark:hover:shadow-none transition-[background-color,border-color,box-shadow] duration-300 cursor-pointer"
                    >
                      <div className="relative w-14 h-20 shrink-0 overflow-hidden rounded-lg">
                        <img
                          src={series.image}
                          alt={series.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                        />
                        <div className="absolute top-0 left-0 bg-gradient-to-br from-pink-500 to-fuchsia-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-br-lg">
                          #{index + 1}
                        </div>
                      </div>
                      <div className="flex flex-col justify-center flex-1 min-w-0">
                        <h3 className="text-[15px] font-bold text-gray-900 dark:text-white leading-tight group-hover:text-pink-500 dark:group-hover:text-pink-400 transition-colors truncate">
                          {series.title}
                        </h3>
                        <div className="flex items-center gap-2 mt-2">
                          <div className="flex gap-0.5">
                            {Array(5)
                              .fill(0)
                              .map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-3 h-3 ${i < Math.round(series.rating / 2) ? "text-pink-400 fill-pink-400" : "text-gray-300 dark:text-gray-700"}`}
                                />
                              ))}
                          </div>
                          <span className="text-[11px] font-medium text-gray-400 dark:text-gray-500">
                            {series.rating}/10
                          </span>
                          {series.year && (
                            <span className="text-[10px] font-medium text-gray-300 dark:text-gray-600">
                              · {series.year}
                            </span>
                          )}
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          )}
        </section>

        {/* ===== Section 2.5: Recently Watched ===== */}
        <section className="mb-24">
          {tmdbLoading ? (
            <div className="flex items-center justify-center gap-3 py-16">
              <Loader2 className="w-5 h-5 text-violet-500 animate-spin" />
              <span className="text-sm text-gray-400">
                Son izlenenler yükleniyor...
              </span>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {/* Recently Watched Movies */}
              <div>
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-xl bg-violet-50 dark:bg-violet-500/10 border border-violet-200/60 dark:border-violet-500/20 flex items-center justify-center">
                    <Eye className="text-violet-500 dark:text-violet-400 w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-display font-bold text-gray-900 dark:text-white tracking-tight">
                      Son İzlenenler
                    </h2>
                    <p className="text-[11px] font-medium text-gray-400 dark:text-gray-600 uppercase tracking-[0.15em]">
                      Filmler
                    </p>
                  </div>
                  <div className="h-px flex-1 bg-gray-200 dark:bg-white/[0.06]" />
                </div>

                <div className="space-y-3">
                  {tmdbRecentMovies.map((movie) => (
                    <a
                      key={movie.id}
                      href={movie.tmdbUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex gap-4 rounded-xl bg-white dark:bg-white/[0.03] border border-gray-200/60 dark:border-white/[0.06] p-3 hover:border-violet-300 dark:hover:border-violet-500/25 hover:bg-violet-50/30 dark:hover:bg-white/[0.05] shadow-sm dark:shadow-none hover:shadow-md dark:hover:shadow-none transition-[background-color,border-color,box-shadow] duration-300 cursor-pointer"
                    >
                      <div className="relative w-14 h-20 shrink-0 overflow-hidden rounded-lg">
                        <img
                          src={movie.image}
                          alt={movie.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                        />
                      </div>
                      <div className="flex flex-col justify-center flex-1 min-w-0">
                        <h3 className="text-[15px] font-bold text-gray-900 dark:text-white leading-tight group-hover:text-violet-500 dark:group-hover:text-violet-400 transition-colors truncate">
                          {movie.title}
                        </h3>
                        <div className="flex items-center gap-2 mt-2">
                          <div className="flex gap-0.5">
                            {Array(5)
                              .fill(0)
                              .map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-3 h-3 ${i < Math.round(movie.rating / 2) ? "text-violet-400 fill-violet-400" : "text-gray-300 dark:text-gray-700"}`}
                                />
                              ))}
                          </div>
                          <span className="text-[11px] font-medium text-gray-400 dark:text-gray-500">
                            {movie.rating}/10
                          </span>
                          {movie.year && (
                            <span className="text-[10px] font-medium text-gray-300 dark:text-gray-600">
                              · {movie.year}
                            </span>
                          )}
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>

              {/* Recently Watched Series */}
              <div>
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-500/10 border border-teal-200/60 dark:border-teal-500/20 flex items-center justify-center">
                    <History className="text-teal-500 dark:text-teal-400 w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-display font-bold text-gray-900 dark:text-white tracking-tight">
                      Son İzlenenler
                    </h2>
                    <p className="text-[11px] font-medium text-gray-400 dark:text-gray-600 uppercase tracking-[0.15em]">
                      Diziler
                    </p>
                  </div>
                  <div className="h-px flex-1 bg-gray-200 dark:bg-white/[0.06]" />
                </div>

                <div className="space-y-3">
                  {tmdbRecentSeries.map((series) => (
                    <a
                      key={series.id}
                      href={series.tmdbUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex gap-4 rounded-xl bg-white dark:bg-white/[0.03] border border-gray-200/60 dark:border-white/[0.06] p-3 hover:border-teal-300 dark:hover:border-teal-500/25 hover:bg-teal-50/30 dark:hover:bg-white/[0.05] shadow-sm dark:shadow-none hover:shadow-md dark:hover:shadow-none transition-[background-color,border-color,box-shadow] duration-300 cursor-pointer"
                    >
                      <div className="relative w-14 h-20 shrink-0 overflow-hidden rounded-lg">
                        <img
                          src={series.image}
                          alt={series.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                        />
                      </div>
                      <div className="flex flex-col justify-center flex-1 min-w-0">
                        <h3 className="text-[15px] font-bold text-gray-900 dark:text-white leading-tight group-hover:text-teal-500 dark:group-hover:text-teal-400 transition-colors truncate">
                          {series.title}
                        </h3>
                        <div className="flex items-center gap-2 mt-2">
                          <div className="flex gap-0.5">
                            {Array(5)
                              .fill(0)
                              .map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-3 h-3 ${i < Math.round(series.rating / 2) ? "text-teal-400 fill-teal-400" : "text-gray-300 dark:text-gray-700"}`}
                                />
                              ))}
                          </div>
                          <span className="text-[11px] font-medium text-gray-400 dark:text-gray-500">
                            {series.rating}/10
                          </span>
                          {series.year && (
                            <span className="text-[10px] font-medium text-gray-300 dark:text-gray-600">
                              · {series.year}
                            </span>
                          )}
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          )}
        </section>

        {/* ===== Section 3: Hobbies / Blog ===== */}
        <section>
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200/60 dark:border-amber-500/20 flex items-center justify-center">
                <BookOpen className="text-amber-500 dark:text-amber-400 w-5 h-5" />
              </div>
              <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white tracking-tight">
                Gündelik Blog
              </h2>
            </div>
            <button
              onClick={onViewAllBlogs}
              className="flex items-center gap-1.5 text-sm font-medium text-amber-500 dark:text-amber-400 hover:text-amber-600 dark:hover:text-amber-300 transition-colors"
            >
              Tümünü Gör <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {blogs.slice(0, 2).map((blog) => (
              <article
                key={blog.id}
                onClick={() => onBlogClick(blog)}
                className="group relative rounded-2xl overflow-hidden cursor-pointer"
              >
                <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-[1px]" />
                <div className="relative rounded-2xl bg-white dark:bg-white/[0.03] border border-gray-200/60 dark:border-white/[0.06] overflow-hidden group-hover:border-amber-300 dark:group-hover:border-amber-500/25 shadow-sm dark:shadow-none group-hover:shadow-lg dark:group-hover:shadow-none transition-[background-color,border-color,box-shadow] duration-300">
                  <div className="h-52 overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-[#06060e] via-transparent to-transparent z-10" />
                    {blog.image ? (
                      <img
                        src={blog.image}
                        alt={blog.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-amber-100 dark:from-slate-800 via-orange-50 dark:via-amber-900/20 to-slate-100 dark:to-slate-900 flex items-center justify-center">
                        <svg
                          className="w-12 h-12 text-amber-300 dark:text-slate-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                          />
                        </svg>
                      </div>
                    )}
                    <div className="absolute top-4 right-4 z-20 bg-white/80 dark:bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-medium text-gray-600 dark:text-gray-300 flex items-center gap-1.5 border border-gray-200/60 dark:border-white/[0.08]">
                      <Clock className="w-3 h-3" /> {blog.readTime}
                    </div>
                  </div>
                  <div className="p-7">
                    <div className="text-[11px] font-medium text-gray-400 dark:text-gray-600 uppercase tracking-[0.15em] mb-3">
                      {blog.date}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-amber-500 dark:group-hover:text-amber-400 transition-colors leading-tight">
                      {blog.title}
                    </h3>
                    <p className="text-gray-500 text-sm leading-relaxed line-clamp-2">
                      {blog.excerpt}
                    </p>
                    <div className="mt-5 flex items-center gap-2 text-sm font-medium text-amber-500 dark:text-amber-400">
                      <span>Devamını Gör</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>

      {/* ===== Keyframe Animations ===== */}
      <style>{`
        @keyframes personalFloat1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(80px, -50px) scale(1.1); }
          66% { transform: translate(-40px, 40px) scale(0.95); }
        }
        @keyframes personalFloat2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(-60px, 40px) scale(1.05); }
          66% { transform: translate(50px, -60px) scale(0.9); }
        }
        @keyframes personalFloat3 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(40px, -30px) scale(1.15); }
        }
      `}</style>
    </div>
  );
};
