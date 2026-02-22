import React, { useState, useEffect } from "react";
import {
  User,
  Briefcase,
  Lock,
  Sparkles,
  ArrowRight,
  Music,
  Code2,
} from "lucide-react";

interface LandingProps {
  onSelect: (mode: "personal" | "professional") => void;
  onAdmin: () => void;
}

export const Landing: React.FC<LandingProps> = ({ onSelect, onAdmin }) => {
  const [hovered, setHovered] = useState<"personal" | "professional" | null>(
    null,
  );
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="relative min-h-screen w-screen overflow-hidden font-display bg-[#f8fafc] dark:bg-[#06060e]">
      {/* ===== Animated Background Orbs ===== */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full opacity-[0.07] dark:opacity-20 blur-[120px]"
          style={{
            background: "radial-gradient(circle, #a855f7 0%, transparent 70%)",
            animation: "float1 12s ease-in-out infinite",
          }}
        />
        <div
          className="absolute -bottom-40 -right-40 w-[600px] h-[600px] rounded-full opacity-[0.06] dark:opacity-15 blur-[120px]"
          style={{
            background: "radial-gradient(circle, #06b6d4 0%, transparent 70%)",
            animation: "float2 15s ease-in-out infinite",
          }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full opacity-[0.05] dark:opacity-10 blur-[100px]"
          style={{
            background: "radial-gradient(circle, #3b82f6 0%, transparent 70%)",
            animation: "float3 10s ease-in-out infinite",
          }}
        />
      </div>

      {/* ===== Subtle Grid Overlay ===== */}
      <div className="absolute inset-0 opacity-[0.04] dark:opacity-[0.03] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none" />

      {/* ===== Noise Texture ===== */}
      <div
        className="absolute inset-0 opacity-[0.02] dark:opacity-[0.015] pointer-events-none"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")",
          backgroundRepeat: "repeat",
          backgroundSize: "256px 256px",
        }}
      />

      {/* ===== Admin Button ===== */}
      <button
        onClick={onAdmin}
        className="absolute bottom-4 left-4 z-50 opacity-10 hover:opacity-80 text-gray-400 dark:text-gray-500 hover:text-purple-500 dark:hover:text-purple-400 transition-all duration-300"
        aria-label="Admin"
      >
        <Lock className="w-4 h-4" />
      </button>

      {/* ===== Main Content ===== */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-5 py-16 sm:py-20">
        {/* Header Section */}
        <div
          className={`text-center mb-14 md:mb-16 transition-all duration-1000 ease-out ${
            loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gray-100 dark:bg-white/[0.04] border border-gray-200/60 dark:border-white/[0.08] text-[13px] text-gray-500 dark:text-gray-400 mb-7 backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5 text-purple-500 dark:text-purple-400" />
            <span>Arda Mert Tarkan</span>
          </div>
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-gray-900 dark:text-white tracking-[-0.04em] mb-4 leading-[1.1]">
            Merhaba
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-fuchsia-500 to-cyan-500 dark:from-purple-400 dark:via-fuchsia-400 dark:to-cyan-400">
              .
            </span>
          </h1>
          <p className="text-gray-500 text-base sm:text-lg max-w-sm mx-auto leading-relaxed">
            Benim Hakkımda Ne Öğrenmeye Geldiniz?
          </p>
        </div>

        {/* Cards Grid */}
        <div
          className={`grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-7 w-full max-w-[860px] transition-all duration-1000 delay-200 ease-out ${
            loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          {/* ===== Personal Card ===== */}
          <div
            className="group relative cursor-pointer rounded-2xl overflow-hidden"
            onMouseEnter={() => setHovered("personal")}
            onMouseLeave={() => setHovered(null)}
            onClick={() => onSelect("personal")}
          >
            {/* Card Glow */}
            <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-br from-purple-500/30 via-fuchsia-500/20 to-pink-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-[1px]" />

            {/* Card Body */}
            <div className="relative rounded-2xl bg-white dark:bg-white/[0.03] backdrop-blur-xl border border-gray-200/60 dark:border-white/[0.06] group-hover:border-purple-300 dark:group-hover:border-purple-500/30 p-7 sm:p-9 transition-all duration-500 shadow-sm dark:shadow-none group-hover:shadow-xl dark:group-hover:shadow-none group-hover:bg-purple-50/30 dark:group-hover:bg-white/[0.06]">
              {/* Animated Gradient Accent */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Icon */}
              <div className="relative w-14 h-14 mb-7 rounded-xl bg-purple-50 dark:bg-gradient-to-br dark:from-purple-500/20 dark:to-fuchsia-500/20 border border-purple-200/60 dark:border-purple-500/20 flex items-center justify-center group-hover:shadow-[0_0_30px_rgba(168,85,247,0.12)] dark:group-hover:shadow-[0_0_30px_rgba(168,85,247,0.15)] transition-all duration-500">
                <User className="w-6 h-6 text-purple-500 dark:text-purple-400" />
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-5">
                {["Müzik", "Filmler", "Hobiler"].map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-300/80 border border-purple-200/60 dark:border-purple-500/10"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Title & Description */}
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white tracking-tight mb-2">
                Kişisel
              </h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-8 max-w-xs">
                Spotify Hareketim ve Çalma Listelerim, Film ve Dizi Tercihlerim,
                ve genel blog yazılarım. Biraz kişisel
              </p>

              {/* CTA */}
              <div className="flex items-center gap-2 text-sm font-medium text-purple-500 dark:text-purple-400 group-hover:text-purple-600 dark:group-hover:text-purple-300 transition-colors">
                <span>Keşfet</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform duration-300" />
              </div>

              {/* Decorative floating icon */}
              <div className="absolute bottom-6 right-6 opacity-[0.03] dark:opacity-[0.04] group-hover:opacity-[0.06] dark:group-hover:opacity-[0.08] transition-opacity duration-500">
                <Music className="w-24 h-24 text-purple-400 dark:text-purple-300" />
              </div>
            </div>
          </div>

          {/* ===== Professional Card ===== */}
          <div
            className="group relative cursor-pointer rounded-2xl overflow-hidden"
            onMouseEnter={() => setHovered("professional")}
            onMouseLeave={() => setHovered(null)}
            onClick={() => onSelect("professional")}
          >
            {/* Card Glow */}
            <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-br from-cyan-500/30 via-blue-500/20 to-indigo-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-[1px]" />

            {/* Card Body */}
            <div className="relative rounded-2xl bg-white dark:bg-white/[0.03] backdrop-blur-xl border border-gray-200/60 dark:border-white/[0.06] group-hover:border-cyan-300 dark:group-hover:border-cyan-500/30 p-7 sm:p-9 transition-all duration-500 shadow-sm dark:shadow-none group-hover:shadow-xl dark:group-hover:shadow-none group-hover:bg-cyan-50/30 dark:group-hover:bg-white/[0.06]">
              {/* Animated Gradient Accent */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Icon */}
              <div className="relative w-14 h-14 mb-7 rounded-xl bg-cyan-50 dark:bg-gradient-to-br dark:from-cyan-500/20 dark:to-blue-500/20 border border-cyan-200/60 dark:border-cyan-500/20 flex items-center justify-center group-hover:shadow-[0_0_30px_rgba(6,182,212,0.12)] dark:group-hover:shadow-[0_0_30px_rgba(6,182,212,0.15)] transition-all duration-500">
                <Briefcase className="w-6 h-6 text-cyan-500 dark:text-cyan-400" />
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-5">
                {["Portföy", "Yetenekler", "CV", "Blog"].map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-cyan-50 dark:bg-cyan-500/10 text-cyan-600 dark:text-cyan-300/80 border border-cyan-200/60 dark:border-cyan-500/10"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Title & Description */}
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white tracking-tight mb-2">
                Profesyonel
              </h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-8 max-w-xs">
                Projelerim, teknik yeteneklerim, CV ve teknoloji yazıları.
                Profesyonel dünyam.
              </p>

              {/* CTA */}
              <div className="flex items-center gap-2 text-sm font-medium text-cyan-500 dark:text-cyan-400 group-hover:text-cyan-600 dark:group-hover:text-cyan-300 transition-colors">
                <span>Portfolyoyu Gör</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform duration-300" />
              </div>

              {/* Decorative floating icon */}
              <div className="absolute bottom-6 right-6 opacity-[0.03] dark:opacity-[0.04] group-hover:opacity-[0.06] dark:group-hover:opacity-[0.08] transition-opacity duration-500">
                <Code2 className="w-24 h-24 text-cyan-400 dark:text-cyan-300" />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom subtle text */}
        <div
          className={`mt-12 md:mt-16 text-center transition-all duration-1000 delay-500 ease-out ${
            loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        ></div>
      </div>

      {/* ===== Keyframe Animations ===== */}
      <style>{`
        @keyframes float1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(60px, -40px) scale(1.1); }
          66% { transform: translate(-30px, 30px) scale(0.95); }
        }
        @keyframes float2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(-50px, 30px) scale(1.05); }
          66% { transform: translate(40px, -50px) scale(0.9); }
        }
        @keyframes float3 {
          0%, 100% { transform: translate(-50%, -50%) scale(1); }
          50% { transform: translate(-50%, -50%) scale(1.2); }
        }
      `}</style>
    </div>
  );
};
