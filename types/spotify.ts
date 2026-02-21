/**
 * Spotify API Tip Tanımları
 * =========================
 *
 * Bu dosya, Spotify API'den dönen verilerin TypeScript karşılıklarıdır.
 *
 * Neden ayrı bir dosyada?
 * → types.ts'deki Song, Playlist gibi mevcut tipler mock data için tasarlanmıştı.
 * → Spotify'dan gelen veri daha zengin (URL, progress, genres vs.)
 * → Mevcut tipleri bozmamak için Spotify-spesifik tipler ayrı tutulur.
 * → Daha sonra adaptör fonksiyonlarla mevcut tiplere de dönüştürebiliriz.
 */

/** Şu anda çalan şarkı bilgisi */
export interface SpotifyNowPlaying {
  isPlaying: boolean;
  title?: string;
  artist?: string;
  album?: string;
  albumArt?: string;
  duration_ms?: number; // Toplam süre (milisaniye)
  progress_ms?: number; // Şu anki pozisyon (milisaniye)
  songUrl?: string; // Spotify'da açılacak link
}

/** Bir şarkı (track) bilgisi */
export interface SpotifyTrack {
  id: string;
  title: string;
  artist: string;
  albumArt: string;
  duration: string; // "3:50" formatında
  songUrl: string;
  playedAt?: string; // Sadece recently-played'da var (ISO 8601)
}

/** Bir sanatçı bilgisi */
export interface SpotifyArtist {
  id: string;
  name: string;
  image: string;
  genres: string[]; // ["pop", "rock", "indie"] gibi
  popularity: number; // 0-100 arası Spotify popülerlik puanı
  url: string;
}

/** Bir çalma listesi bilgisi */
export interface SpotifyPlaylist {
  id: string;
  name: string;
  image: string;
  trackCount: number; // Playlist'teki şarkı sayısı
  url: string;
}

/** useSpotify hook'unun döndürdüğü tüm state */
export interface SpotifyData {
  nowPlaying: SpotifyNowPlaying | null;
  topTracks: SpotifyTrack[];
  topArtists: SpotifyArtist[];
  recentlyPlayed: SpotifyTrack[];
  isLoading: boolean;
  error: string | null;
}
