/**
 * Spotify API Service (Frontend)
 * ==============================
 *
 * Bu dosya, frontend'den backend proxy'ye HTTP istekleri atar.
 *
 * Neden doğrudan Spotify API'ye istek atmıyoruz?
 * → client_secret gerekiyor (güvenlik riski)
 * → Token yenileme frontend'de güvenli değil
 * → Backend proxy bunu hallediyor, biz sadece /api/spotify/... adresine istek atıyoruz
 *
 * fetch() API Hakkında:
 * → Tarayıcıda HTTP istek atmak için kullanılır (XMLHttpRequest'in modern versiyonu)
 * → Promise döner → async/await ile kullanılır
 * → response.ok → HTTP 200-299 arası mı kontrol eder
 * → response.json() → Response body'yi JSON olarak parse eder (bu da Promise döner)
 */

import type {
  SpotifyNowPlaying,
  SpotifyTrack,
  SpotifyArtist,
} from "../types/spotify";

/**
 * BASE_URL
 * --------
 * Development'ta Vite proxy sayesinde /api/spotify → localhost:3001/api/spotify
 * Production'da ise doğrudan aynı sunucudaki /api/spotify'a gider.
 * Bu yüzden sadece relative path kullanıyoruz.
 */
const BASE_URL = "/api/spotify";

/**
 * Genel fetch wrapper
 * -------------------
 * Her endpoint için aynı hata kontrolü ve JSON parsing işlemini tekrarlamak yerine
 * tek bir yerde yapıyoruz. Bu DRY (Don't Repeat Yourself) prensibidir.
 *
 * Generic tip <T>: Bu fonksiyon her tipte veri dönebilir.
 * Çağırırken fetchSpotify<SpotifyTrack[]>(...) dersen TypeScript dönen veriyi SpotifyTrack[] olarak bilir.
 */
async function fetchSpotify<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${BASE_URL}${endpoint}`);

  if (!response.ok) {
    throw new Error(
      `Spotify API hatası: ${response.status} ${response.statusText}`,
    );
  }

  return response.json();
}

/** Şu anda çalan şarkıyı getir */
export async function getNowPlaying(): Promise<SpotifyNowPlaying> {
  return fetchSpotify<SpotifyNowPlaying>("/now-playing");
}

/** En çok dinlenen şarkıları getir */
export async function getTopTracks(): Promise<SpotifyTrack[]> {
  return fetchSpotify<SpotifyTrack[]>("/top-tracks");
}

/** En çok dinlenen sanatçıları getir */
export async function getTopArtists(): Promise<SpotifyArtist[]> {
  return fetchSpotify<SpotifyArtist[]>("/top-artists");
}

/** Son dinlenen şarkıları getir */
export async function getRecentlyPlayed(): Promise<SpotifyTrack[]> {
  return fetchSpotify<SpotifyTrack[]>("/recently-played");
}
