import React, { useEffect } from "react";
import DOMPurify from "dompurify";
import { BlogPost } from "../types";
import { Clock, Calendar, ArrowLeft } from "lucide-react";

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
  // Scroll to top when mounted
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const isProf = theme === "professional";

  // Theme Styles
  const bgClass = isProf
    ? "bg-slate-50 dark:bg-slate-950"
    : "bg-gray-50 dark:bg-[#0a0a0a]";
  const textClass = isProf
    ? "text-slate-900 dark:text-white"
    : "text-gray-900 dark:text-white";
  const accentClass = isProf
    ? "text-prof-blue"
    : "text-yellow-600 dark:text-yellow-500";
  const backBtnClass = isProf
    ? "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-100"
    : "bg-white dark:bg-white/10 text-gray-700 dark:text-white border-gray-200 dark:border-white/10 hover:bg-gray-100";

  return (
    <div
      className={`min-h-screen ${bgClass} font-sans transition-colors duration-300`}
    >
      {/* Navigation Bar */}
      <div
        className={`sticky top-0 z-50 backdrop-blur-md bg-opacity-80 border-b ${isProf ? "bg-white/80 dark:bg-slate-900/80 border-slate-200 dark:border-slate-800" : "bg-white/80 dark:bg-black/50 border-gray-200 dark:border-white/10"}`}
      >
        <div className="max-w-4xl mx-auto px-4 py-4">
          <button
            onClick={onBack}
            className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-bold transition-all ${backBtnClass}`}
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
        </div>
      </div>

      {/* Hero Image */}
      <div className="w-full h-[40vh] relative">
        {post.image ? (
          <img
            src={post.image}
            alt={post.title}
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
      <article className="max-w-3xl mx-auto px-6 py-12">
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
                __html: DOMPurify.sanitize(post.content, {
                  ADD_TAGS: ["video", "iframe"],
                  ADD_ATTR: [
                    "controls",
                    "src",
                    "allowfullscreen",
                    "frameborder",
                    "allow",
                  ],
                }),
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
