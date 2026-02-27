import React, { useEffect, useRef } from "react";
import DOMPurify from "dompurify";
import { BlogPost } from "../types";
import { Clock, Calendar, ArrowLeft, Sparkles } from "lucide-react";
import { useSEO } from "../hooks/useSEO";
import { BackgroundOrbs } from "./BackgroundOrbs";

interface BlogDetailProps {
  post: BlogPost;
  onBack: () => void;
  theme: "personal" | "professional";
}

export const BlogDetail: React.FC<BlogDetailProps> = ({
  post,
  onBack,
  theme,
}) => {
  const progressBarRef = useRef<HTMLDivElement>(null);

  // SEO meta tags
  useSEO({
    title: post.title,
    description: post.excerpt,
    image: post.image,
    type: "article",
  });

  // Scroll to top when mounted
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Okuma ilerleme çubuğu — DOM'a doğrudan yazarak sıfır re-render
  useEffect(() => {
    const updateProgress = () => {
      const article = document.getElementById("blog-article");
      const bar = progressBarRef.current;
      if (!article || !bar) return;
      const { top, height } = article.getBoundingClientRect();
      const windowH = window.innerHeight;
      const scrolled = Math.max(0, -top);
      const total = height - windowH;
      const pct = total > 0 ? Math.min(100, (scrolled / total) * 100) : 0;
      bar.style.width = `${pct}%`;
      bar.setAttribute("aria-valuenow", String(Math.round(pct)));
    };
    window.addEventListener("scroll", updateProgress, { passive: true });
    updateProgress();
    return () => window.removeEventListener("scroll", updateProgress);
  }, []);

  const isProf = theme === "professional";

  // Theme Styles
  const textClass = isProf
    ? "text-slate-900 dark:text-white"
    : "text-gray-900 dark:text-white";
  const accentClass = isProf
    ? "text-prof-blue"
    : "text-yellow-600 dark:text-yellow-500";

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#06060e] text-gray-800 dark:text-gray-200 font-sans transition-colors duration-300">
      {/* ===== Okuma İlerleme Çubuğu ===== */}
      <div
        ref={progressBarRef}
        className="fixed top-0 left-0 z-[60] h-[3px] transition-[width] duration-100 ease-out"
        style={{
          width: "0%",
          background: isProf
            ? "linear-gradient(90deg, #06b6d4, #3b82f6)"
            : "linear-gradient(90deg, #a855f7, #ec4899)",
        }}
        role="progressbar"
        aria-valuenow={0}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Okuma ilerlemesi"
      />

      {/* ===== Background Orbs ===== */}
      <BackgroundOrbs theme={theme} />

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
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 dark:hover:text-white px-3.5 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/[0.05] transition-all"
          >
            <ArrowLeft className="w-4 h-4" /> Geri
          </button>
        </div>
      </header>

      {/* Hero Image */}
      <div className="w-full h-[40vh] relative z-10">
        {post.image ? (
          <img
            src={post.image}
            alt={post.title}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-slate-800 via-indigo-900/50 to-slate-900 flex items-center justify-center">
            <svg
              className="w-20 h-20 text-slate-600"
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
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 max-w-4xl mx-auto px-4 pb-12">
          <span
            className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 ${isProf ? "bg-blue-600 text-white" : "bg-yellow-500 text-black"}`}
          >
            {post.category}
          </span>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white leading-tight shadow-black drop-shadow-lg">
            {post.title}
          </h1>
        </div>
      </div>

      {/* Content */}
      <article
        id="blog-article"
        className="relative z-10 max-w-3xl mx-auto px-6 py-12"
      >
        <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400 mb-8 pb-8 border-b border-gray-200 dark:border-gray-800">
          <span className="flex items-center gap-2">
            <Calendar className="w-4 h-4" /> {post.date}
          </span>
          <span className="flex items-center gap-2">
            <Clock className="w-4 h-4" /> {post.readTime}
          </span>
        </div>

        <div
          className={`prose prose-lg dark:prose-invert max-w-none ${textClass} [&_video]:rounded-lg [&_video]:max-w-full [&_video]:mx-auto [&_video]:my-4`}
        >
          <p className="font-medium text-xl leading-relaxed mb-8 opacity-90">
            {post.excerpt}
          </p>

          {post.content ? (
            <div
              dangerouslySetInnerHTML={{
                __html: (() => {
                  const clean = DOMPurify.sanitize(post.content, {
                    ADD_TAGS: ["video", "iframe"],
                    ADD_ATTR: [
                      "controls",
                      "src",
                      "allowfullscreen",
                      "frameborder",
                      "allow",
                    ],
                  });
                  // iframe src'yi güvenli domainlerle sınırla
                  const ALLOWED_IFRAME_HOSTS = [
                    "youtube.com",
                    "youtube-nocookie.com",
                    "youtu.be",
                    "vimeo.com",
                    "player.vimeo.com",
                    "codepen.io",
                    "codesandbox.io",
                  ];
                  const div = document.createElement("div");
                  div.innerHTML = clean;
                  div.querySelectorAll("iframe").forEach((iframe) => {
                    try {
                      const host = new URL(iframe.src).hostname;
                      const allowed = ALLOWED_IFRAME_HOSTS.some(
                        (d) => host === d || host.endsWith(`.${d}`),
                      );
                      if (!allowed) iframe.remove();
                    } catch {
                      iframe.remove();
                    }
                  });
                  return div.innerHTML;
                })(),
              }}
            />
          ) : (
            <div className="opacity-80 space-y-6">
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus
                lacinia odio vitae vestibulum vestibulum. Cras venenatis euismod
                malesuada. Nulla facilisi. Ut enim ad minim veniam, quis nostrud
                exercitation ullamco laboris nisi ut aliquip ex ea commodo
                consequat.
              </p>
              <p>
                Duis aute irure dolor in reprehenderit in voluptate velit esse
                cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
                cupidatat non proident, sunt in culpa qui officia deserunt
                mollit anim id est laborum. Sed ut perspiciatis unde omnis iste
                natus error sit voluptatem accusantium doloremque laudantium.
              </p>
              <h3>Why this matters</h3>
              <p>
                At vero eos et accusamus et iusto odio dignissimos ducimus qui
                blanditiis praesentium voluptatum deleniti atque corrupti quos
                dolores et quas molestias excepturi sint occaecati cupiditate
                non provident, similique sunt in culpa qui officia deserunt
                mollitia animi, id est laborum et dolorum fuga.
              </p>
              <ul>
                <li>Key point number one about this topic.</li>
                <li>Another crucial insight that changes everything.</li>
                <li>Final thoughts on the future of this technology.</li>
              </ul>
              <p>
                Et harum quidem rerum facilis est et expedita distinctio. Nam
                libero tempore, cum soluta nobis est eligendi optio cumque nihil
                impedit quo minus id quod maxime placeat facere possimus.
              </p>
            </div>
          )}
        </div>
      </article>
    </div>
  );
};
