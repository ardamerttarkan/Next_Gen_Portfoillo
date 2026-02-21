import path from "path";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, ".", "");
  return {
    server: {
      port: 3000,
      host: "0.0.0.0",
      /**
       * Proxy Ayarı
       * -----------
       * Frontend /api/spotify/... adresine istek attığında,
       * Vite bunu otomatik olarak localhost:3001'e yönlendirir.
       *
       * Neden proxy?
       * → Frontend localhost:3000'de, backend localhost:3001'de çalışıyor
       * → Tarayıcı farklı portlara istek atmayı "Cross-Origin" olarak algılar (CORS hatası)
       * → Proxy ile tarayıcı sanki aynı sunucuya istek atıyor gibi düşünür
       * → changeOrigin: true → Host header'ını target'a göre ayarlar
       */
      proxy: {
        "/api/spotify": {
          target: "http://localhost:3001",
          changeOrigin: true,
        },
        "/api/tmdb": {
          target: "http://localhost:3001",
          changeOrigin: true,
        },
        "/php-api": {
          target: "http://localhost",
          changeOrigin: true,
          rewrite: (path) => `/Next_Gen_Portfoillo${path}`,
        },
      },
    },
    plugins: [react()],
    define: {
      "process.env.API_KEY": JSON.stringify(env.GEMINI_API_KEY),
      "process.env.GEMINI_API_KEY": JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "."),
      },
    },
  };
});
