/**
 * Spotify Backend Proxy Server
 * ============================
 *
 * Bu dosya neden var?
 * -------------------
 * Spotify API'den token yenilemek (refresh) için client_secret gerekir.
 * client_secret'ı frontend'e koyarsak herkes görebilir — güvenlik açığı.
 * Bu yüzden küçük bir Express server oluşturuyoruz:
 *
 * Frontend → /api/spotify/now-playing → Bu server → Spotify API → Cevap geri döner
 *
 * Akış:
 * 1. Server başlarken refresh_token ile yeni access_token alır
 * 2. Her API isteğinde bu token'ı kullanır
 * 3. Token süresi dolmuşsa (401 hatası), otomatik olarak yeniler ve tekrar dener
 *
 * Token Yenileme (Refresh) Nasıl Çalışır?
 * ----------------------------------------
 * POST https://accounts.spotify.com/api/token
 * Body: grant_type=refresh_token&refresh_token=<token>
 * Header: Authorization: Basic base64(client_id:client_secret)
 *
 * Base64 encoding neden? → Spotify'ın OAuth 2.0 standardı böyle istiyor.
 * client_id:client_secret → Base64'e çevrilir → "Basic xxx" şeklinde gönderilir
 */

import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());

const PORT = 3001;

// .env'den okunan değerler
const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const REFRESH_TOKEN = process.env.SPOTIFY_REFRESH_TOKEN;

// Sunucu bellekte tutulan access_token
let accessToken: string | null = null;
let tokenExpiresAt: number = 0; // Unix timestamp (ms)

/**
 * getAccessToken()
 * ----------------
 * refresh_token kullanarak Spotify'dan yeni bir access_token alır.
 *
 * Neden her seferinde yeni token almıyoruz?
 * → Rate limit (istek sınırı) yememek için token'ı cache'liyoruz.
 * → tokenExpiresAt ile süresini kontrol ediyoruz.
 * → Süresi dolmamışsa mevcut token'ı kullanıyoruz.
 */
async function getAccessToken(): Promise<string> {
  // Token hâlâ geçerliyse tekrar almaya gerek yok (5 dakika pay bırakıyoruz)
  if (accessToken && Date.now() < tokenExpiresAt - 5 * 60 * 1000) {
    return accessToken;
  }

  console.log("🔄 Spotify token yenileniyor...");

  /**
   * Base64 encoding:
   * Spotify, client_id ve client_secret'ı "client_id:client_secret" formatında,
   * Base64'e çevrilerek Authorization header'ında göndermeni ister.
   * Bu, HTTP Basic Authentication standardıdır.
   *
   * Buffer.from(string).toString('base64') → Node.js'de Base64'e çevirme yolu
   */
  const basicAuth = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString(
    "base64",
  );

  /**
   * URLSearchParams:
   * POST body'sini "application/x-www-form-urlencoded" formatında göndermek için kullanılır.
   * JSON değil, form-data formatı — Spotify bunu istiyor.
   *
   * grant_type=refresh_token → "Ben zaten yetkilendirildim, sadece token'ımı yenile" demek
   * refresh_token → Spotify'ın sana verdiği kalıcı anahtar
   */
  const params = new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token: REFRESH_TOKEN!,
  });

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${basicAuth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error("❌ Token yenileme hatası:", error);
    throw new Error(`Token refresh failed: ${response.status}`);
  }

  const data = await response.json();
  accessToken = data.access_token;

  // expires_in saniye cinsinden → milisaniyeye çevirip şu anki zamana ekliyoruz
  tokenExpiresAt = Date.now() + data.expires_in * 1000;

  console.log("✅ Yeni token alındı, geçerlilik:", data.expires_in, "saniye");
  return accessToken!;
}

/**
 * spotifyFetch()
 * --------------
 * Spotify API'ye istek atan yardımcı fonksiyon.
 * Token süresi dolmuşsa otomatik olarak yeniler ve tekrar dener.
 *
 * retry parametresi: Sonsuz döngüyü önler.
 * İlk deneme başarısız → token yenile → tekrar dene → yine başarısızsa hata fırlat
 */
async function spotifyFetch(endpoint: string, retry = true): Promise<any> {
  const token = await getAccessToken();

  const response = await fetch(`https://api.spotify.com/v1${endpoint}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  // 401 = Unauthorized → Token süresi dolmuş demek
  if (response.status === 401 && retry) {
    console.log("⚠️ Token süresi dolmuş, yenileniyor...");
    accessToken = null; // Cache'i temizle
    tokenExpiresAt = 0;
    return spotifyFetch(endpoint, false); // Bir kere daha dene (retry=false ile)
  }

  // 204 = No Content → Şu an hiçbir şey çalmıyor
  if (response.status === 204) {
    return null;
  }

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Spotify API error ${response.status}: ${error}`);
  }

  return response.json();
}

// ============================================
// API ENDPOINTS (Frontend bunlara istek atar)
// ============================================

/**
 * GET /api/spotify/now-playing
 * ----------------------------
 * Şu anda çalan şarkıyı getirir.
 *
 * Spotify endpoint: /v1/me/player/currently-playing
 *
 * Dönen veri: { isPlaying, title, artist, album, albumArt, duration_ms, progress_ms, songUrl }
 * null dönerse → Hiçbir şey çalmıyor demek
 */
app.get("/api/spotify/now-playing", async (_req, res) => {
  try {
    const data = await spotifyFetch("/me/player/currently-playing");

    if (!data || !data.item) {
      return res.json({ isPlaying: false });
    }

    // Spotify'ın döndüğü veriyi sadeleştiriyoruz
    // Ham veri çok büyük — frontend'in ihtiyacı olan kısımları seçiyoruz
    res.json({
      isPlaying: data.is_playing,
      title: data.item.name,
      artist: data.item.artists.map((a: any) => a.name).join(", "),
      album: data.item.album.name,
      albumArt: data.item.album.images[0]?.url, // images dizisi büyükten küçüğe sıralı, [0] en büyük
      duration_ms: data.item.duration_ms,
      progress_ms: data.progress_ms,
      songUrl: data.item.external_urls.spotify,
    });
  } catch (error: any) {
    console.error("Now Playing hatası:", error.message);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/spotify/top-tracks
 * ---------------------------
 * En çok dinlenen şarkıları getirir.
 *
 * Spotify endpoint: /v1/me/top/tracks
 * Query params:
 *   time_range: short_term (son 4 hafta) | medium_term (son 6 ay) | long_term (tüm zamanlar)
 *   limit: Kaç şarkı istiyorsun (max 50)
 *
 * Bu endpoint user-top-read scope'u gerektirir (senin token'ında var ✓)
 */
app.get("/api/spotify/top-tracks", async (_req, res) => {
  try {
    const data = await spotifyFetch(
      "/me/top/tracks?time_range=short_term&limit=10",
    );

    const tracks = data.items.map((track: any, index: number) => ({
      id: track.id,
      title: track.name,
      artist: track.artists.map((a: any) => a.name).join(", "),
      albumArt: track.album.images[1]?.url || track.album.images[0]?.url, // [1] = 300x300 orta boy
      duration: formatDuration(track.duration_ms),
      songUrl: track.external_urls.spotify,
    }));

    res.json(tracks);
  } catch (error: any) {
    console.error("Top Tracks hatası:", error.message);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/spotify/top-artists
 * ----------------------------
 * En çok dinlenen sanatçıları getirir.
 *
 * Spotify endpoint: /v1/me/top/artists
 * Dönen veri: isim, fotoğraf, türler (genres), popülerlik puanı
 */
app.get("/api/spotify/top-artists", async (_req, res) => {
  try {
    const data = await spotifyFetch(
      "/me/top/artists?time_range=short_term&limit=10",
    );

    // data.items undefined olabilir (scope eksikliği veya veri yetersizliği)
    if (!data?.items) {
      console.warn("Top Artists: items boş döndü (scope eksik olabilir)");
      return res.json([]);
    }

    const artists = data.items.map((artist: any) => ({
      id: artist.id,
      name: artist.name,
      image: artist.images?.[1]?.url || artist.images?.[0]?.url || "",
      genres: (artist.genres || []).slice(0, 3),
      popularity: artist.popularity || 0,
      url: artist.external_urls?.spotify || "",
    }));

    res.json(artists);
  } catch (error: any) {
    console.error("Top Artists hatası:", error.message);
    // Scope hatası durumunda boş array dön (UI çökmesini önle)
    if (error.message.includes("403")) {
      return res.json([]);
    }
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/spotify/recently-played
 * --------------------------------
 * Son dinlenen şarkıları getirir.
 *
 * Spotify endpoint: /v1/me/player/recently-played
 * Bu endpoint user-read-recently-played scope'u gerektirir (senin token'ında var ✓)
 *
 * Farkı: top-tracks "en çok dinlenen", recently-played "en son dinlenen"
 */
app.get("/api/spotify/recently-played", async (_req, res) => {
  try {
    const data = await spotifyFetch("/me/player/recently-played?limit=10");

    const tracks = data.items.map((item: any) => ({
      id: item.track.id,
      title: item.track.name,
      artist: item.track.artists.map((a: any) => a.name).join(", "),
      albumArt:
        item.track.album.images[1]?.url || item.track.album.images[0]?.url,
      duration: formatDuration(item.track.duration_ms),
      playedAt: item.played_at, // ISO 8601 tarih formatı
      songUrl: item.track.external_urls.spotify,
    }));

    res.json(tracks);
  } catch (error: any) {
    console.error("Recently Played hatası:", error.message);
    res.status(500).json({ error: error.message });
  }
});

/**
 * formatDuration()
 * ----------------
 * Milisaniyeyi "dakika:saniye" formatına çevirir.
 * Örnek: 230000ms → "3:50"
 *
 * Math.floor → Aşağı yuvarla (3.8 dakika → 3 dakika)
 * % 60 → Kalan saniyeyi bul (230 saniye → 230 % 60 = 50 saniye)
 * .padStart(2, '0') → Tek haneli saniyenin başına 0 ekle (5 → "05")
 */
function formatDuration(ms: number): string {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

// ============================================
// TMDB API ENDPOINTS
// ============================================

const TMDB_TOKEN = process.env.TMDB_API_TOKEN;
const TMDB_MOVIES_LIST = process.env.TMDB_MOVIES_LIST_ID || "8635027";
const TMDB_SERIES_LIST = process.env.TMDB_SERIES_LIST_ID || "8635029";
const TMDB_RECENT_MOVIES_LIST =
  process.env.TMDB_RECENT_MOVIES_LIST_ID || "8635030";
const TMDB_RECENT_SERIES_LIST =
  process.env.TMDB_RECENT_SERIES_LIST_ID || "8635031";
const TMDB_BASE = "https://api.themoviedb.org";
const TMDB_IMG = "https://image.tmdb.org/t/p";

/**
 * tmdbFetch()
 * -----------
 * TMDB API'ye istek atan yardımcı fonksiyon.
 * Bearer token ile Authorization header gönderir.
 */
async function tmdbFetch(endpoint: string): Promise<any> {
  const response = await fetch(`${TMDB_BASE}${endpoint}`, {
    headers: {
      Authorization: `Bearer ${TMDB_TOKEN}`,
      "Content-Type": "application/json;charset=utf-8",
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`TMDB API error ${response.status}: ${error}`);
  }

  return response.json();
}

/**
 * GET /api/tmdb/movies
 * --------------------
 * Favori filmler listesini TMDB'den çeker.
 * List ID .env'den okunur.
 */
app.get("/api/tmdb/movies", async (_req, res) => {
  try {
    const data = await tmdbFetch(
      `/4/list/${TMDB_MOVIES_LIST}?language=en-US&page=1`,
    );

    const movies = (data.results || []).map((movie: any) => ({
      id: movie.id,
      title: movie.title || movie.original_title,
      rating: Math.round(movie.vote_average * 10) / 10,
      image: movie.poster_path ? `${TMDB_IMG}/w500${movie.poster_path}` : "",
      backdrop: movie.backdrop_path
        ? `${TMDB_IMG}/w780${movie.backdrop_path}`
        : "",
      year: movie.release_date ? movie.release_date.split("-")[0] : "",
      overview: movie.overview || "",
      tmdbUrl: `https://www.themoviedb.org/movie/${movie.id}`,
    }));

    res.json(movies);
  } catch (error: any) {
    console.error("TMDB Movies hatası:", error.message);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/tmdb/series
 * --------------------
 * Favori diziler listesini TMDB'den çeker.
 */
app.get("/api/tmdb/series", async (_req, res) => {
  try {
    const data = await tmdbFetch(
      `/4/list/${TMDB_SERIES_LIST}?language=en-US&page=1`,
    );

    const series = (data.results || []).map((show: any) => ({
      id: show.id,
      title: show.name || show.original_name,
      rating: Math.round(show.vote_average * 10) / 10,
      image: show.poster_path ? `${TMDB_IMG}/w500${show.poster_path}` : "",
      backdrop: show.backdrop_path
        ? `${TMDB_IMG}/w780${show.backdrop_path}`
        : "",
      year: show.first_air_date ? show.first_air_date.split("-")[0] : "",
      overview: show.overview || "",
      tmdbUrl: `https://www.themoviedb.org/tv/${show.id}`,
    }));

    res.json(series);
  } catch (error: any) {
    console.error("TMDB Series hatası:", error.message);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/tmdb/recent-movies
 * ---------------------------
 * Son izlenen filmleri TMDB listesinden çeker.
 */
app.get("/api/tmdb/recent-movies", async (_req, res) => {
  try {
    const data = await tmdbFetch(
      `/4/list/${TMDB_RECENT_MOVIES_LIST}?language=en-US&page=1`,
    );

    const movies = (data.results || []).map((movie: any) => ({
      id: movie.id,
      title: movie.title || movie.original_title,
      rating: Math.round(movie.vote_average * 10) / 10,
      image: movie.poster_path ? `${TMDB_IMG}/w500${movie.poster_path}` : "",
      backdrop: movie.backdrop_path
        ? `${TMDB_IMG}/w780${movie.backdrop_path}`
        : "",
      year: movie.release_date ? movie.release_date.split("-")[0] : "",
      overview: movie.overview || "",
      tmdbUrl: `https://www.themoviedb.org/movie/${movie.id}`,
    }));

    res.json(movies);
  } catch (error: any) {
    console.error("TMDB Recent Movies hatası:", error.message);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/tmdb/recent-series
 * ---------------------------
 * Son izlenen dizileri TMDB listesinden çeker.
 */
app.get("/api/tmdb/recent-series", async (_req, res) => {
  try {
    const data = await tmdbFetch(
      `/4/list/${TMDB_RECENT_SERIES_LIST}?language=en-US&page=1`,
    );

    const series = (data.results || []).map((show: any) => ({
      id: show.id,
      title: show.name || show.original_name,
      rating: Math.round(show.vote_average * 10) / 10,
      image: show.poster_path ? `${TMDB_IMG}/w500${show.poster_path}` : "",
      backdrop: show.backdrop_path
        ? `${TMDB_IMG}/w780${show.backdrop_path}`
        : "",
      year: show.first_air_date ? show.first_air_date.split("-")[0] : "",
      overview: show.overview || "",
      tmdbUrl: `https://www.themoviedb.org/tv/${show.id}`,
    }));

    res.json(series);
  } catch (error: any) {
    console.error("TMDB Recent Series hatası:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// Server'ı başlat
app.listen(PORT, () => {
  console.log(`🎵 Spotify proxy server çalışıyor: http://localhost:${PORT}`);
  // Başlangıçta bir kere token al (cache'e at)
  getAccessToken().catch((err) =>
    console.error("İlk token alma başarısız:", err.message),
  );
});
