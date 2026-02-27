import path from "path";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, ".", "");
  return {
    server: {
      port: 3000,
      host: "0.0.0.0",
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
    build: {
      // Chunk boyutu uyarı eşiğini 600 kB'a çek (tiptap kaçınılmaz olarak büyük)
      chunkSizeWarningLimit: 600,
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            // React + React-DOM → ayrı vendor chunk (tarayıcı cache'ler)
            if (
              id.includes("node_modules/react/") ||
              id.includes("node_modules/react-dom/")
            ) {
              return "vendor-react";
            }
            // Lucide icon kütüphanesi → ayrı chunk (çok büyük, nadiren değişir)
            if (id.includes("node_modules/lucide-react")) {
              return "vendor-lucide";
            }
            // TipTap rich-text editörü → sadece admin sayfasında lazım
            if (id.includes("node_modules/@tiptap")) {
              return "vendor-tiptap";
            }
            // lowlight (kod renklendirme) → sadece admin'de
            if (
              id.includes("node_modules/lowlight") ||
              id.includes("node_modules/highlight.js")
            ) {
              return "vendor-highlight";
            }
            // DOMPurify → blog görüntülemede lazım, küçük
            if (id.includes("node_modules/dompurify")) {
              return "vendor-dompurify";
            }
          },
        },
      },
    },
    // Dev modunda hızlı açılış için pre-bundle
    optimizeDeps: {
      include: ["react", "react-dom", "lucide-react", "dompurify"],
    },
  };
});
