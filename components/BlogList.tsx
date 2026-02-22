import React, { useEffect } from "react";
import { BlogPost } from "../types";
import { ArrowLeft, Calendar, Clock, ArrowRight, Sparkles } from "lucide-react";

interface BlogListProps {
  blogs: BlogPost[];
  onBack: () => void;
  onRead: (blog: BlogPost) => void;
  variant: "personal" | "professional";
}

export const BlogList: React.FC<BlogListProps> = ({
  blogs,
  onBack,
  onRead,
  variant,
}) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const isProf = variant === "professional";

  return (
    <div className="min-h-screen font-sans bg-[#f8fafc] dark:bg-[#06060e] text-gray-800 dark:text-gray-200">
      {/* ===== Background Orbs ===== */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        {isProf ? (
          <>
            <div
              className="absolute -top-32 right-0 w-[500px] h-[500px] rounded-full opacity-[0.06] dark:opacity-[0.12] blur-[130px]"
              style={{
                background:
                  "radial-gradient(circle, #06b6d4 0%, transparent 70%)",
              }}
            />
            <div
              className="absolute top-1/2 -left-40 w-[550px] h-[550px] rounded-full opacity-[0.05] dark:opacity-[0.10] blur-[120px]"
              style={{
                background:
                  "radial-gradient(circle, #3b82f6 0%, transparent 70%)",
              }}
            />
          </>
        ) : (
          <>
            <div
              className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full opacity-[0.06] dark:opacity-[0.15] blur-[140px]"
              style={{
                background:
                  "radial-gradient(circle, #a855f7 0%, transparent 70%)",
              }}
            />
            <div
              className="absolute top-1/3 -right-32 w-[500px] h-[500px] rounded-full opacity-[0.05] dark:opacity-[0.10] blur-[120px]"
              style={{
                background:
                  "radial-gradient(circle, #ec4899 0%, transparent 70%)",
              }}
            />
          </>
        )}
      </div>
      <div className="fixed inset-0 opacity-[0.04] dark:opacity-[0.02] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none" />

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
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog) => (
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
              <div className="h-48 overflow-hidden relative shrink-0">
                {blog.image ? (
                  <img
                    src={blog.image}
                    alt={blog.title}
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

              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mb-3">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> {blog.date}
                  </span>
                  <span className="w-1 h-1 bg-current rounded-full"></span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {blog.readTime}
                  </span>
                </div>

                <h2
                  className={`text-xl font-bold mb-3 leading-tight ${isProf ? "text-slate-900 dark:text-white group-hover:text-prof-blue" : "text-gray-900 dark:text-white group-hover:text-yellow-600 dark:group-hover:text-yellow-500"} transition-colors`}
                >
                  {blog.title}
                </h2>

                <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3 mb-4 flex-1">
                  {blog.excerpt}
                </p>

                <div
                  className={`text-sm font-bold flex items-center gap-1 mt-auto ${isProf ? "text-prof-blue" : "text-yellow-600 dark:text-yellow-500"}`}
                >
                  Read Article{" "}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
};
