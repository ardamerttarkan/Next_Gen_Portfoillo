import React, { useEffect } from "react";
import { BlogPost } from "../types";
import { ArrowLeft, Calendar, Clock, ArrowRight } from "lucide-react";

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
    <div
      className={`min-h-screen font-sans ${isProf ? "bg-slate-50 dark:bg-slate-950" : "bg-gray-50 dark:bg-[#0a0a0a]"}`}
    >
      {/* Header */}
      <header
        className={`sticky top-0 z-40 border-b backdrop-blur-md ${isProf ? "bg-white/80 dark:bg-slate-900/80 border-slate-200 dark:border-slate-800" : "bg-white/80 dark:bg-black/50 border-gray-200 dark:border-white/10"}`}
      >
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className={`p-2 rounded-full transition-colors ${isProf ? "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-900 dark:text-white" : "hover:bg-white/10 text-gray-900 dark:text-white"}`}
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1
              className={`text-xl font-bold font-display ${isProf ? "text-slate-900 dark:text-white" : "text-gray-900 dark:text-white"}`}
            >
              {isProf ? "Blog" : "Personal Logs"}
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12">
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
