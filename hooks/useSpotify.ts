/**
 * useSpotify Custom Hook
 * ======================
 *
 * Bu hook ne yapar?
 * -----------------
 * 1. Component mount olduğunda tüm Spotify verilerini çeker
 * 2. "Şu anda çalan" bilgisini her 30 saniyede bir günceller
 * 3. Diğer verileri (top tracks, artists, playlists) her 5 dakikada bir günceller
 * 4. Loading ve error state'lerini yönetir
 *
 * Custom Hook nedir?
 * ------------------
 * React'te "use" ile başlayan fonksiyonlara hook denir.
 * Custom hook'lar, birden fazla component'te kullanılacak state logic'ini
 * tek bir yerde toplamayı sağlar. DRY prensibi.
 *
 * Bu hook'u herhangi bir component'te şöyle kullanırsın:
 *   const { nowPlaying, topTracks, isLoading } = useSpotify();
 */

import { useState, useEffect, useCallback, useRef } from "react";
import type {
  SpotifyData,
  SpotifyNowPlaying,
  SpotifyTrack,
  SpotifyArtist,
} from "../types/spotify";
import * as spotifyService from "../services/spotifyService";

/** Güncelleme aralıkları (milisaniye) */
const NOW_PLAYING_INTERVAL = 30_000; // 30 saniye — şarkı sık değişir
const GENERAL_INTERVAL = 5 * 60_000; // 5 dakika — top tracks/artists nadir değişir

export function useSpotify(): SpotifyData {
  /**
   * State tanımları
   * ---------------
   * Her bir Spotify veri kaynağı için ayrı state tutuyoruz.
   * Neden tek bir state object değil de ayrı ayrı?
   * → Birini güncelleyince diğerleri re-render'a neden olmaz
   * → Her biri bağımsız olarak hata verebilir
   */
  const [nowPlaying, setNowPlaying] = useState<SpotifyNowPlaying | null>(null);
  const [topTracks, setTopTracks] = useState<SpotifyTrack[]>([]);
  const [topArtists, setTopArtists] = useState<SpotifyArtist[]>([]);
  const [recentlyPlayed, setRecentlyPlayed] = useState<SpotifyTrack[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * useRef — Interval ID'lerini saklamak için
   * ------------------------------------------
   * Neden useState değil de useRef?
   * → useRef değeri değişince component re-render olmaz
   * → Interval ID'si UI'da gösterilmez, sadece cleanup için lazım
   * → Bu tür "yardımcı değişkenler" için useRef idealdir
   */
  const nowPlayingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(
    null,
  );
  const generalIntervalRef = useRef<ReturnType<typeof setInterval> | null>(
    null,
  );

  /**
   * fetchNowPlaying
   * ---------------
   * useCallback ile sarmalıyoruz çünkü:
   * → Bu fonksiyon useEffect'in dependency array'inde kullanılıyor
   * → useCallback olmadan her render'da yeni bir fonksiyon oluşur
   * → Yeni fonksiyon = useEffect tekrar çalışır = sonsuz döngü riski
   * → useCallback aynı fonksiyon referansını korur
   */
  const fetchNowPlaying = useCallback(async () => {
    try {
      const data = await spotifyService.getNowPlaying();
      setNowPlaying(data);
    } catch (err) {
      // Now playing hatası kritik değil — sessizce logla
      console.warn("Now playing alınamadı:", err);
    }
  }, []);

  /**
   * fetchAllData
   * ------------
   * Tüm Spotify verilerini paralel olarak çeker.
   *
   * Promise.allSettled vs Promise.all:
   * → Promise.all: Herhangi biri hata verirse HEPSI iptal olur
   * → Promise.allSettled: Hata veren olsa bile diğerleri devam eder
   *
   * Burada allSettled kullanıyoruz çünkü:
   * → Top tracks çekilemese bile playlist'ler gösterilebilir
   * → Bir endpoint'in başarısız olması diğerlerini etkilemesini istemeyiz
   */
  const fetchAllData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const [
        nowPlayingResult,
        topTracksResult,
        topArtistsResult,
        recentResult,
      ] = await Promise.allSettled([
        spotifyService.getNowPlaying(),
        spotifyService.getTopTracks(),
        spotifyService.getTopArtists(),
        spotifyService.getRecentlyPlayed(),
      ]);

      /**
       * Promise.allSettled sonuçları:
       * → status: "fulfilled" → Başarılı, .value ile veriye eriş
       * → status: "rejected" → Başarısız, .reason ile hataya eriş
       */
      if (nowPlayingResult.status === "fulfilled") {
        setNowPlaying(nowPlayingResult.value);
      }
      if (topTracksResult.status === "fulfilled") {
        setTopTracks(topTracksResult.value);
      }
      if (topArtistsResult.status === "fulfilled") {
        setTopArtists(topArtistsResult.value);
      }
      if (recentResult.status === "fulfilled") {
        setRecentlyPlayed(recentResult.value);
      }

      // Eğer tüm istekler başarısız olduysa genel hata göster
      const allFailed = [
        nowPlayingResult,
        topTracksResult,
        topArtistsResult,
        recentResult,
      ].every((r) => r.status === "rejected");

      if (allFailed) {
        setError(
          "Spotify verilerine erişilemedi. Lütfen daha sonra tekrar deneyin.",
        );
      }
    } catch (err: any) {
      setError(err.message || "Bilinmeyen hata");
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * useEffect — Component mount/unmount lifecycle
   * -----------------------------------------------
   *
   * [] (boş dependency array) = Sadece component mount olduğunda çalış
   *
   * return () => { ... } = Cleanup fonksiyonu
   * → Component unmount olduğunda (sayfadan ayrılınca) interval'ler temizlenir
   * → Bu yapılmazsa "memory leak" (bellek sızıntısı) oluşur
   * → Artık var olmayan bir component'in state'ini güncellemeye çalışırsın
   */
  useEffect(() => {
    // İlk yüklemede tüm verileri çek
    fetchAllData();

    // "Şu anda çalan" bilgisini her 30 saniyede güncelle
    nowPlayingIntervalRef.current = setInterval(
      fetchNowPlaying,
      NOW_PLAYING_INTERVAL,
    );

    // Diğer verileri her 5 dakikada güncelle
    generalIntervalRef.current = setInterval(fetchAllData, GENERAL_INTERVAL);

    // Cleanup: Component unmount olunca interval'leri temizle
    return () => {
      if (nowPlayingIntervalRef.current)
        clearInterval(nowPlayingIntervalRef.current);
      if (generalIntervalRef.current) clearInterval(generalIntervalRef.current);
    };
  }, [fetchAllData, fetchNowPlaying]);

  return {
    nowPlaying,
    topTracks,
    topArtists,
    recentlyPlayed,
    isLoading,
    error,
  };
}
