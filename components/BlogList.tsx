import React, { useEffect, useState, useMemo } from "react";
import { BlogPost } from "../types";
import {
  ArrowLeft,
  Calendar,
  Clock,
  ArrowRight,
  Sparkles,
  Search,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { SkeletonCard } from "./SkeletonCard";
import { BackgroundOrbs } from "./BackgroundOrbs";

const POSTS_PER_PAGE = 9;

interface BlogListProps {
  blogs: BlogPost[];
  onBack: () => void;
  onRead: (blog: BlogPost) => void;
  variant: "personal" | "professional";
  loading?: boolean;
}

export const BlogList: React.FC<BlogListProps> = ({
  blogs,
  onBack,
  onRead,
  variant,
  loading = false,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Sayfa değişince en üste çık
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  const isProf = variant === "professional";

  // Arama filtresi
  const filteredBlogs = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return blogs;
    return blogs.filter(
      (b) =>
        b.title.toLowerCase().includes(q) ||
        b.excerpt.toLowerCase().includes(q) ||
        b.category.toLowerCase().includes(q),
    );
  }, [blogs, searchQuery]);

  // Sayfalama
  const totalPages = Math.ceil(filteredBlogs.length / POSTS_PER_PAGE);
  const paginatedBlogs = useMemo(
    () =>
      filteredBlogs.slice(
        (currentPage - 1) * POSTS_PER_PAGE,
        currentPage * POSTS_PER_PAGE,
      ),
    [filteredBlogs, currentPage],
  );

  // Arama değişince ilk sayfaya dön
  const handleSearch = (val: string) => {
    setSearchQuery(val);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen font-sans bg-[#f8fafc] dark:bg-[#06060e] text-gray-800 dark:text-gray-200">
      {/* ===== Background Orbs ===== */}
      <BackgroundOrbs theme={variant} />

      {/* ===== Navbar ===== */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-[#06060e]/70 backdrop-blur-xl border-b border-gray-200/60 dark:border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div
            className="flex items-center gap-2.5 cursor-pointer"
            onClick={onBack}
          >
            {isProf ? (
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold shadow-lg shadow-cyan-500/20">
                AMT
              </div>
            ) : (
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-purple-500/20">
                <Sparkles className="w-4 h-4" />
              </div>
            )}
            <span className="font-display font-bold text-lg tracking-tight text-gray-900 dark:text-white">
              {isProf ? "Arda Mert Tarkan" : "Kişisel"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`hidden sm:inline text-sm font-medium px-3.5 py-1.5 rounded-lg ${isProf ? "text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-500/10" : "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-500/10"}`}
            >
              Blog
            </span>
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 dark:hover:text-white px-3.5 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/[0.05] transition-all"
            >
              <ArrowLeft className="w-4 h-4" /> Geri
            </button>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-6xl mx-auto px-6 py-12">
        {/* ===== Arama Kutusu ===== */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Yazılarda ara..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className={`w-full pl-10 pr-10 py-2.5 rounded-xl border text-sm bg-white dark:bg-white/[0.04] text-gray-900 dark:text-white placeholder-gray-400 outline-none transition-all
                ${
                  isProf
                    ? "border-slate-200 dark:border-slate-700 focus:border-prof-blue focus:ring-2 focus:ring-prof-blue/20"
                    : "border-gray-200 dark:border-white/[0.08] focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20"
                }`}
            />
            {searchQuery && (
              <button
                onClick={() => handleSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors"
                aria-label="Aramayı temizle"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Sonuç sayısı */}
          {searchQuery && !loading && (
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              <span className="font-semibold text-gray-900 dark:text-white">
                {filteredBlogs.length}
              </span>{" "}
              sonuç bulundu
              {filteredBlogs.length === 0 && (
                <span className="ml-1">— farklı anahtar kelimeler deneyin</span>
              )}
            </p>
          )}
        </div>

        {/* ===== Kart Izgarası ===== */}
        {loading ? (
          /* Skeleton yükleme */
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} variant={variant} />
            ))}
          </div>
        ) : paginatedBlogs.length === 0 ? (
          /* Boş durum */
          <div className="text-center py-24 text-gray-400 dark:text-gray-600">
            <Search className="w-12 h-12 mx-auto mb-4 opacity-40" />
            <p className="text-lg font-medium">Yazı bulunamadı</p>
            <p className="text-sm mt-1">
              Arama terimini değiştirip tekrar deneyin
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {paginatedBlogs.map((blog) => (
              <article
                key={blog.id}
                onClick={() => onRead(blog)}
                className={`
                  group cursor-pointer rounded-2xl overflow-hidden border transition-all duration-300 flex flex-col
                  ${
                    isProf
                      ? "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:shadow-xl hover:-translate-y-1"
                      : "bg-white dark:bg-[#121212] border-gray-200 dark:border-white/5 hover:border-yellow-500/50 hover:shadow-2xl"
                  }
                `}
              >
                {/* Görsel */}
                <div className="h-48 overflow-hidden relative shrink-0">
                  {blog.image ? (
                    <img
                      src={blog.image}
                      alt={blog.title}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 flex items-center justify-center">
                      <svg
                        className="w-12 h-12 text-slate-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                        />
                      </svg>
                    </div>
                  )}
                  <div
                    className={`absolute top-4 left-4 px-2 py-1 text-xs font-bold rounded uppercase tracking-wider ${isProf ? "bg-white/90 text-prof-blue" : "bg-black/70 text-yellow-500 backdrop-blur"}`}
                  >
                    {blog.category}
                  </div>
                </div>

                {/* İçerik */}
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mb-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> {blog.date}
                    </span>
                    <span className="w-1 h-1 bg-current rounded-full" />
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {blog.readTime}
                    </span>
                  </div>

                  <h2
                    className={`text-xl font-bold mb-3 leading-tight transition-colors ${isProf ? "text-slate-900 dark:text-white group-hover:text-prof-blue" : "text-gray-900 dark:text-white group-hover:text-yellow-600 dark:group-hover:text-yellow-500"}`}
                  >
                    {blog.title}
                  </h2>

                  <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3 mb-4 flex-1">
                    {blog.excerpt}
                  </p>

                  <div
                    className={`text-sm font-bold flex items-center gap-1 mt-auto ${isProf ? "text-prof-blue" : "text-yellow-600 dark:text-yellow-500"}`}
                  >
                    Makaleyi Oku{" "}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* ===== Sayfalama ===== */}
        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-12">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-gray-200 dark:border-white/[0.08] text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/[0.05] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              aria-label="Önceki sayfa"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {Array.from({ length: totalPages }).map((_, i) => {
              const page = i + 1;
              const isActive = page === currentPage;
              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`min-w-[2.25rem] h-9 px-3 rounded-lg text-sm font-semibold transition-all
                    ${
                      isActive
                        ? isProf
                          ? "bg-prof-blue text-white shadow-lg shadow-blue-500/20"
                          : "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/20"
                        : "border border-gray-200 dark:border-white/[0.08] text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/[0.05]"
                    }`}
                >
                  {page}
                </button>
              );
            })}

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-gray-200 dark:border-white/[0.08] text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/[0.05] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              aria-label="Sonraki sayfa"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </main>
    </div>
  );
};
