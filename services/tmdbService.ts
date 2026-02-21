/**
 * TMDB API Service (Frontend)
 * ===========================
 *
 * Backend proxy'ye HTTP istekleri atar.
 * /api/tmdb/... → Vite proxy → localhost:3001/api/tmdb/...
 */

import type { TMDBMovie, TMDBSeries } from "../types/tmdb";

const BASE_URL = "/api/tmdb";

/**
 * Genel fetch wrapper — Spotify service ile aynı pattern
 */
async function fetchTMDB<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${BASE_URL}${endpoint}`);

  if (!response.ok) {
    throw new Error(
      `TMDB API hatası: ${response.status} ${response.statusText}`,
    );
  }

  return response.json();
}

/** Favori filmleri getir */
export async function getMovies(): Promise<TMDBMovie[]> {
  return fetchTMDB<TMDBMovie[]>("/movies");
}

/** Favori dizileri getir */
export async function getSeries(): Promise<TMDBSeries[]> {
  return fetchTMDB<TMDBSeries[]>("/series");
}

/** Son izlenen filmleri getir */
export async function getRecentMovies(): Promise<TMDBMovie[]> {
  return fetchTMDB<TMDBMovie[]>("/recent-movies");
}

/** Son izlenen dizileri getir */
export async function getRecentSeries(): Promise<TMDBSeries[]> {
  return fetchTMDB<TMDBSeries[]>("/recent-series");
}
