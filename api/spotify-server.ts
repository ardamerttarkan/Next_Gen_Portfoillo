import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPath = path.resolve(__dirname, "../php-api/.env");
dotenv.config({ path: envPath });

const app = express();

const allowedOrigins = process.env.CORS_ALLOWED_ORIGINS
  ? process.env.CORS_ALLOWED_ORIGINS.split(",")
  : ["http://localhost:3000", "http://localhost:5173", "http://127.0.0.1:3000"];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, false);
      }
    },
    methods: ["GET"],
  }),
);

const PORT = process.env.SPOTIFY_SERVER_PORT || 3001;

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const REFRESH_TOKEN = process.env.SPOTIFY_REFRESH_TOKEN;

console.log("📂 .env yolu:", envPath);
console.log("🔑 SPOTIFY_CLIENT_ID:", CLIENT_ID ? "✅ yüklendi" : "❌ BOŞ!");
console.log(
  "🔑 SPOTIFY_CLIENT_SECRET:",
  CLIENT_SECRET ? "✅ yüklendi" : "❌ BOŞ!",
);
console.log(
  "🔑 SPOTIFY_REFRESH_TOKEN:",
  REFRESH_TOKEN ? "✅ yüklendi" : "❌ BOŞ!",
);
console.log(
  "🎬 TMDB_API_TOKEN:",
  process.env.TMDB_API_TOKEN ? "✅ yüklendi" : "❌ BOŞ!",
);

let accessToken: string | null = null;
let tokenExpiresAt: number = 0;

async function getAccessToken(): Promise<string> {
  if (accessToken && Date.now() < tokenExpiresAt - 5 * 60 * 1000) {
    return accessToken;
  }

  console.log("🔄 Spotify token yenileniyor...");

  const basicAuth = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString(
    "base64",
  );

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

  tokenExpiresAt = Date.now() + data.expires_in * 1000;

  console.log("✅ Yeni token alındı, geçerlilik:", data.expires_in, "saniye");
  return accessToken!;
}

async function spotifyFetch(endpoint: string, retry = true): Promise<any> {
  const token = await getAccessToken();

  const response = await fetch(`https://api.spotify.com/v1${endpoint}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.status === 401 && retry) {
    console.log("⚠️ Token süresi dolmuş, yenileniyor...");
    accessToken = null;
    tokenExpiresAt = 0;
    return spotifyFetch(endpoint, false);
  }

  if (response.status === 204) {
    return null;
  }

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Spotify API error ${response.status}: ${error}`);
  }

  return response.json();
}

app.get("/api/spotify/now-playing", async (_req, res) => {
  try {
    const data = await spotifyFetch("/me/player/currently-playing");

    if (!data || !data.item) {
      return res.json({ isPlaying: false });
    }

    res.json({
      isPlaying: data.is_playing,
      title: data.item.name,
      artist: data.item.artists.map((a: any) => a.name).join(", "),
      album: data.item.album.name,
      albumArt: data.item.album.images[0]?.url,
      duration_ms: data.item.duration_ms,
      progress_ms: data.progress_ms,
      songUrl: data.item.external_urls.spotify,
    });
  } catch (error: any) {
    console.error("Now Playing hatası:", error.message);
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/spotify/top-tracks", async (_req, res) => {
  try {
    const data = await spotifyFetch(
      "/me/top/tracks?time_range=short_term&limit=10",
    );

    const tracks = data.items.map((track: any) => ({
      id: track.id,
      title: track.name,
      artist: track.artists.map((a: any) => a.name).join(", "),
      albumArt: track.album.images[1]?.url || track.album.images[0]?.url,
      duration: formatDuration(track.duration_ms),
      songUrl: track.external_urls.spotify,
    }));

    res.json(tracks);
  } catch (error: any) {
    console.error("Top Tracks hatası:", error.message);
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/spotify/top-artists", async (_req, res) => {
  try {
    const data = await spotifyFetch(
      "/me/top/artists?time_range=short_term&limit=10",
    );

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
    if (error.message.includes("403")) {
      return res.json([]);
    }
    res.status(500).json({ error: error.message });
  }
});

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

function formatDuration(ms: number): string {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

const TMDB_TOKEN = process.env.TMDB_API_TOKEN;
const TMDB_MOVIES_LIST = process.env.TMDB_MOVIES_LIST_ID || "8635027";
const TMDB_SERIES_LIST = process.env.TMDB_SERIES_LIST_ID || "8635029";
const TMDB_RECENT_MOVIES_LIST =
  process.env.TMDB_RECENT_MOVIES_LIST_ID || "8635030";
const TMDB_RECENT_SERIES_LIST =
  process.env.TMDB_RECENT_SERIES_LIST_ID || "8635031";
const TMDB_CURRENTLY_WATCHING_LIST =
  process.env.TMDB_CURRENTLY_WATCHING_LIST_ID || "8635032";
const TMDB_BASE = "https://api.themoviedb.org";
const TMDB_IMG = "https://image.tmdb.org/t/p";

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

app.get("/api/tmdb/currently-watching", async (_req, res) => {
  try {
    const data = await tmdbFetch(
      `/4/list/${TMDB_CURRENTLY_WATCHING_LIST}?language=en-US&page=1`,
    );

    const results = data.results || [];
    if (results.length === 0) {
      return res.json(null);
    }

    const show = results[0];
    const series = {
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
    };

    res.json(series);
  } catch (error: any) {
    console.error("TMDB Currently Watching hatası:", error.message);
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
  });
});

app.listen(PORT, () => {
  console.log(`🎵 Spotify proxy server çalışıyor: http://localhost:${PORT}`);
  getAccessToken().catch((err) =>
    console.error("İlk token alma başarısız:", err.message),
  );
});
