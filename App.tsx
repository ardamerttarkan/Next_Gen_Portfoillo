import React, { useState, useEffect } from "react";
import { Landing } from "./views/Landing";
import { PersonalLayout } from "./components/PersonalLayout";
import { ProfessionalLayout } from "./components/ProfessionalLayout";
import { AdminPanel } from "./components/AdminPanel";
import { AdminLogin } from "./components/AdminLogin";
import { BlogDetail } from "./components/BlogDetail";
import { BlogList } from "./components/BlogList";
import { ThemeToggle } from "./components/ThemeToggle";
import { ViewMode, AppData, BlogPost } from "./types";
import { Home } from "lucide-react";
import * as mockData from "./services/mockData";
import {
  loadAllData,
  logout as apiLogout,
  isAuthenticated,
} from "./services/api";

/**
 * Generate a URL-friendly slug from a title (supports Turkish characters)
 */
function slugify(text: string): string {
  const turkishMap: Record<string, string> = {
    ç: "c",
    ğ: "g",
    ı: "i",
    ö: "o",
    ş: "s",
    ü: "u",
    Ç: "c",
    Ğ: "g",
    İ: "i",
    Ö: "o",
    Ş: "s",
    Ü: "u",
  };
  return text
    .split("")
    .map((ch) => turkishMap[ch] || ch)
    .join("")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Find a blog post by its slug across all blog arrays
 */
function findBlogBySlug(
  slug: string,
  hobbyBlogs: BlogPost[],
  techBlogs: BlogPost[],
): { blog: BlogPost; theme: "personal" | "professional" } | null {
  const allBlogs = [
    ...hobbyBlogs.map((b) => ({ blog: b, theme: "personal" as const })),
    ...techBlogs.map((b) => ({ blog: b, theme: "professional" as const })),
  ];
  return allBlogs.find((item) => slugify(item.blog.title) === slug) || null;
}

const App: React.FC = () => {
  const [view, setView] = useState<ViewMode>(() => {
    const hash = window.location.hash.replace("#", "");
    // Blog slug route: #blog/my-post-slug
    if (hash.startsWith("blog/")) return "blog-detail";
    // Never allow direct access to admin via URL — require login flow
    if (hash === "admin") return "admin-login";
    const validViews: ViewMode[] = [
      "landing",
      "personal",
      "professional",
      "admin-login",
      "personal-blog-list",
      "professional-blog-list",
    ];
    return validViews.includes(hash as ViewMode)
      ? (hash as ViewMode)
      : "landing";
  });
  const [transitioning, setTransitioning] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    const stored = localStorage.getItem("darkMode");
    return stored !== null ? stored === "true" : true; // default: dark
  });
  const [selectedBlog, setSelectedBlog] = useState<BlogPost | null>(null);
  const [blogTheme, setBlogTheme] = useState<"personal" | "professional">(
    "personal",
  );
  const [previousView, setPreviousView] = useState<ViewMode>("landing"); // To handle "Back" from blog detail logic

  // App State (lifted from mockData to allow admin updates)
  const [data, setData] = useState<AppData>({
    currentSong: mockData.currentSong,
    playlists: mockData.playlists,
    topTracks: mockData.topTracks,
    favoriteMovies: mockData.favoriteMovies,
    recentSeries: mockData.recentSeries,
    hobbyBlogs: mockData.hobbyBlogs,
    techBlogs: mockData.techBlogs,
    projects: mockData.projects,
    skills: mockData.skills,
    career: mockData.career,
  });

  // Load data from API on mount
  useEffect(() => {
    loadAllData()
      .then((apiData) => {
        setData(apiData);
        // Resolve blog slug from URL on initial load
        const hash = window.location.hash.replace("#", "");
        if (hash.startsWith("blog/")) {
          const slug = hash.replace("blog/", "");
          const found = findBlogBySlug(
            slug,
            apiData.hobbyBlogs,
            apiData.techBlogs,
          );
          if (found) {
            setSelectedBlog(found.blog);
            setBlogTheme(found.theme);
            setPreviousView(
              found.theme === "professional" ? "professional" : "personal",
            );
          } else {
            // Blog not found — go to landing
            setView("landing");
            window.location.hash = "landing";
          }
        }
      })
      .catch(console.error);
  }, []);

  // Handle Dark Mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("darkMode", String(darkMode));
  }, [darkMode]);

  // Guard: redirect to login if admin view accessed without auth
  useEffect(() => {
    if (view === "admin" && !isAuthenticated()) {
      handleViewChange("admin-login");
    }
  }, [view]);

  const handleViewChange = (newView: ViewMode) => {
    setTransitioning(true);
    setTimeout(() => {
      setView(newView);
      window.location.hash = newView;
      setTransitioning(false);
      window.scrollTo(0, 0);
    }, 300);
  };

  const handleBlogClick = (blog: BlogPost, fromView: ViewMode) => {
    setPreviousView(fromView);
    setSelectedBlog(blog);
    setBlogTheme(
      fromView.includes("professional") ? "professional" : "personal",
    );
    setTransitioning(true);
    setTimeout(() => {
      setView("blog-detail");
      window.location.hash = `blog/${slugify(blog.title)}`;
      setTransitioning(false);
      window.scrollTo(0, 0);
    }, 300);
  };

  const BackButton = () => (
    <button
      onClick={() => handleViewChange("landing")}
      className="fixed bottom-6 right-6 z-40 p-3 rounded-full shadow-xl transition-all duration-300 hover:scale-110 bg-white border border-gray-200 text-gray-700 hover:text-purple-600 hover:border-purple-200 dark:bg-white/[0.06] dark:backdrop-blur-xl dark:border-white/[0.1] dark:text-white dark:hover:text-cyan-400 dark:hover:border-cyan-500/30 dark:shadow-none"
      title="Ana Sayfaya Dön"
    >
      <Home className="w-6 h-6" />
    </button>
  );

  return (
    <div
      className={`transition-opacity duration-300 ${transitioning ? "opacity-0" : "opacity-100"}`}
    >
      {/* Theme Toggle available everywhere except admin */}
      {view !== "admin" && (
        <ThemeToggle
          isDark={darkMode}
          toggle={() => setDarkMode(!darkMode)}
          offsetTop={
            view === "blog-detail" ||
            view === "personal-blog-list" ||
            view === "professional-blog-list"
          }
        />
      )}

      {/* --- VIEWS --- */}

      {view === "landing" && (
        <Landing
          onSelect={handleViewChange}
          onAdmin={() => handleViewChange("admin-login")}
        />
      )}

      {view === "admin-login" && (
        <AdminLogin
          onLogin={() => {
            // Reload data from API after login, then go to admin
            loadAllData().then(setData).catch(console.error);
            handleViewChange("admin");
          }}
          onBack={() => handleViewChange("landing")}
          autoLogin={isAuthenticated()}
        />
      )}

      {view === "admin" && isAuthenticated() && (
        <AdminPanel
          data={data}
          updateData={setData}
          onLogout={() => {
            apiLogout();
            handleViewChange("landing");
          }}
          onGoHome={() => handleViewChange("landing")}
        />
      )}

      {/* Blog Detail View (Full Page) */}
      {view === "blog-detail" && selectedBlog && (
        <BlogDetail
          post={selectedBlog}
          onBack={() => handleViewChange(previousView)}
          theme={blogTheme}
        />
      )}

      {/* Professional Views */}
      {view === "professional" && (
        <>
          <ProfessionalLayout
            projects={data.projects}
            skills={data.skills}
            blogs={data.techBlogs}
            career={data.career}
            onBlogClick={(blog) => handleBlogClick(blog, "professional")}
            onViewAllBlogs={() => handleViewChange("professional-blog-list")}
          />
          <BackButton />
        </>
      )}

      {view === "professional-blog-list" && (
        <>
          <BlogList
            blogs={data.techBlogs}
            onBack={() => handleViewChange("professional")}
            onRead={(blog) => handleBlogClick(blog, "professional-blog-list")}
            variant="professional"
          />
          <BackButton />
        </>
      )}

      {/* Personal Views */}
      {view === "personal" && (
        <>
          <PersonalLayout
            blogs={data.hobbyBlogs}
            onBlogClick={(blog) => handleBlogClick(blog, "personal")}
            onViewAllBlogs={() => handleViewChange("personal-blog-list")}
          />
          <BackButton />
        </>
      )}

      {view === "personal-blog-list" && (
        <>
          <BlogList
            blogs={data.hobbyBlogs}
            onBack={() => handleViewChange("personal")}
            onRead={(blog) => handleBlogClick(blog, "personal-blog-list")}
            variant="personal"
          />
          <BackButton />
        </>
      )}
    </div>
  );
};

export default App;
