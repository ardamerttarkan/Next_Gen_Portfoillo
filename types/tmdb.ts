/**
 * TMDB API Tip Tanımları
 * ======================
 *
 * TMDB (The Movie Database) API'den dönen verilerin TypeScript karşılıkları.
 * Backend proxy üzerinden gelen, formatlanmış veri yapıları.
 */

/** Film bilgisi — /api/tmdb/movies endpoint'inden döner */
export interface TMDBMovie {
  id: number;
  title: string;
  rating: number; // 0-10 arası TMDB puanı
  image: string; // Poster URL (w500)
  backdrop: string; // Arka plan görseli URL (w780)
  year: string; // "1972" formatında
  overview: string; // Türkçe açıklama
  tmdbUrl: string; // TMDB sayfası linki
}

/** Dizi bilgisi — /api/tmdb/series endpoint'inden döner */
export interface TMDBSeries {
  id: number;
  title: string;
  rating: number;
  image: string;
  backdrop: string;
  year: string;
  overview: string;
  tmdbUrl: string;
}

/** useTMDB hook'unun döndürdüğü veri yapısı */
export interface TMDBData {
  movies: TMDBMovie[];
  series: TMDBSeries[];
  recentMovies: TMDBMovie[];
  recentSeries: TMDBSeries[];
  isLoading: boolean;
  error: string | null;
}
