/**
 * useTMDB Custom Hook
 * ===================
 *
 * TMDB'den favori film ve dizi listelerini çeker.
 *
 * Bu veriler nadiren değişir (elle listeye ekleme yapmadıkça),
 * bu yüzden sadece component mount olduğunda bir kere çekilir.
 * Spotify'daki gibi periyodik polling yapmaya gerek yok.
 */

import { useState, useEffect, useCallback } from "react";
import type { TMDBData, TMDBMovie, TMDBSeries } from "../types/tmdb";
import * as tmdbService from "../services/tmdbService";

export function useTMDB(): TMDBData {
  const [movies, setMovies] = useState<TMDBMovie[]>([]);
  const [series, setSeries] = useState<TMDBSeries[]>([]);
  const [recentMovies, setRecentMovies] = useState<TMDBMovie[]>([]);
  const [recentSeries, setRecentSeries] = useState<TMDBSeries[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const [
        moviesResult,
        seriesResult,
        recentMoviesResult,
        recentSeriesResult,
      ] = await Promise.allSettled([
        tmdbService.getMovies(),
        tmdbService.getSeries(),
        tmdbService.getRecentMovies(),
        tmdbService.getRecentSeries(),
      ]);

      if (moviesResult.status === "fulfilled") {
        setMovies(moviesResult.value);
      }
      if (seriesResult.status === "fulfilled") {
        setSeries(seriesResult.value);
      }
      if (recentMoviesResult.status === "fulfilled") {
        setRecentMovies(recentMoviesResult.value);
      }
      if (recentSeriesResult.status === "fulfilled") {
        setRecentSeries(recentSeriesResult.value);
      }

      const allFailed = [
        moviesResult,
        seriesResult,
        recentMoviesResult,
        recentSeriesResult,
      ].every((r) => r.status === "rejected");

      if (allFailed) {
        setError(
          "TMDB verilerine erişilemedi. Lütfen daha sonra tekrar deneyin.",
        );
      }
    } catch (err: any) {
      setError(err.message || "Bilinmeyen hata");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return { movies, series, recentMovies, recentSeries, isLoading, error };
}
