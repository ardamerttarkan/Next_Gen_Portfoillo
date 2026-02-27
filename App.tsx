import React, { useState, useEffect, lazy, Suspense } from "react";
import { ThemeToggle } from "./components/ThemeToggle";
import { ViewMode, AppData, BlogPost } from "./types";
import { Home } from "lucide-react";
import * as mockData from "./services/mockData";
import {
  loadAllData,
  loadAllDataAdmin,
  logout as apiLogout,
  isAuthenticated,
} from "./services/api";
import { useSEO } from "./hooks/useSEO";
import { ErrorBoundary } from "./components/ErrorBoundary";

// ── Code splitting: her view kendi chunk'ında yüklenir ────────────────────────
const Landing = lazy(() =>
  import("./views/Landing").then((m) => ({ default: m.Landing })),
);
const PersonalLayout = lazy(() =>
  import("./components/PersonalLayout").then((m) => ({
    default: m.PersonalLayout,
  })),
);
const ProfessionalLayout = lazy(() =>
  import("./components/ProfessionalLayout").then((m) => ({
    default: m.ProfessionalLayout,
  })),
);
const AdminPanel = lazy(() =>
  import("./components/AdminPanel").then((m) => ({ default: m.AdminPanel })),
);
const AdminLogin = lazy(() =>
  import("./components/AdminLogin").then((m) => ({ default: m.AdminLogin })),
);
const BlogDetail = lazy(() =>
  import("./components/BlogDetail").then((m) => ({ default: m.BlogDetail })),
);
const BlogList = lazy(() =>
  import("./components/BlogList").then((m) => ({ default: m.BlogList })),
);
const NotFound = lazy(() =>
  import("./components/NotFound").then((m) => ({ default: m.NotFound })),
);

/** Genel sayfa geçişlerinde gösterilen minimal fallback */
const PageFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] dark:bg-[#06060e]">
    <div className="w-8 h-8 rounded-full border-2 border-gray-300/40 dark:border-white/20 border-t-purple-500 dark:border-t-white animate-spin" />
  </div>
);

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

/** Pathname'i ViewMode'a dönüştür (BrowserRouter desteği) */
function pathToView(path: string): ViewMode {
  const clean = path.replace(/^\//, "").replace(/\/$/, ""); // baştaki + sondaki / kaldir
  if (clean.startsWith("blog/")) return "blog-detail";
  if (clean === "admin") return "admin-login";
  const valid: ViewMode[] = [
    "landing",
    "personal",
    "professional",
    "admin-login",
    "personal-blog-list",
    "professional-blog-list",
  ];
  if (valid.includes(clean as ViewMode)) return clean as ViewMode;
  return clean === "" ? "landing" : "not-found";
}

/** Ana sayfaya dönüş butonu (sabit sağ alt köşe) */
const BackButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <button
    onClick={onClick}
    className="fixed bottom-6 right-6 z-40 p-3 rounded-full shadow-xl transition-all duration-300 hover:scale-110 bg-white border border-gray-200 text-gray-700 hover:text-purple-600 hover:border-purple-200 dark:bg-white/[0.06] dark:backdrop-blur-xl dark:border-white/[0.1] dark:text-white dark:hover:text-cyan-400 dark:hover:border-cyan-500/30 dark:shadow-none"
    title="Ana Sayfaya Dön"
  >
    <Home className="w-6 h-6" />
  </button>
);

const App: React.FC = () => {
  const [view, setView] = useState<ViewMode>(() =>
    pathToView(window.location.pathname),
  );
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
        const path = window.location.pathname.replace(/^\//, "");
        if (path.startsWith("blog/")) {
          const slug = path.replace("blog/", "");
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
            setView("not-found");
          }
        }
      })
      .catch(console.error);
  }, []);

  // Tarayıcı geri/ileri tuşları için popstate dinleyici
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.replace(/^\//, "");
      if (path.startsWith("blog/")) {
        const slug = path.replace("blog/", "");
        const found = findBlogBySlug(slug, data.hobbyBlogs, data.techBlogs);
        if (found) {
          setSelectedBlog(found.blog);
          setBlogTheme(found.theme);
          setPreviousView(
            found.theme === "professional" ? "professional" : "personal",
          );
          setView("blog-detail");
        } else {
          setView("not-found");
        }
        return;
      }
      setView(pathToView(path));
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [data]);

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
      const urlPath = newView === "landing" ? "/" : "/" + newView;
      window.history.pushState({}, "", urlPath);
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
      window.history.pushState({}, "", `/blog/${slugify(blog.title)}`);
      setTransitioning(false);
      window.scrollTo(0, 0);
    }, 300);
  };

  // Global SEO (sayfa başlığı varsayılan; BlogDetail kendi useSEO'sunu kullanır)
  useSEO(view === "blog-detail" ? {} : { title: undefined });

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
      <ErrorBoundary>
        {view === "landing" && (
          <Suspense fallback={<PageFallback />}>
            <Landing
              onSelect={handleViewChange}
              onAdmin={() => handleViewChange("admin-login")}
            />
          </Suspense>
        )}

        {view === "admin-login" && (
          <Suspense fallback={<PageFallback />}>
            <AdminLogin
              onLogin={() => {
                // Reload data from API after login (include drafts), then go to admin
                loadAllDataAdmin().then(setData).catch(console.error);
                handleViewChange("admin");
              }}
              onBack={() => handleViewChange("landing")}
              autoLogin={isAuthenticated()}
            />
          </Suspense>
        )}

        {view === "admin" && isAuthenticated() && (
          <Suspense fallback={<PageFallback />}>
            <AdminPanel
              data={data}
              updateData={setData}
              onLogout={() => {
                apiLogout();
                loadAllData().then(setData).catch(console.error);
                handleViewChange("landing");
              }}
              onGoHome={() => {
                loadAllData().then(setData).catch(console.error);
                handleViewChange("landing");
              }}
            />
          </Suspense>
        )}

        {/* Blog Detail View (Full Page) */}
        {view === "blog-detail" && selectedBlog && (
          <Suspense fallback={<PageFallback />}>
            <BlogDetail
              post={selectedBlog}
              onBack={() => handleViewChange(previousView)}
              theme={blogTheme}
            />
          </Suspense>
        )}
        {/* Blog slug çözümlenirken (data henüz yüklenmedi) loading göster */}
        {view === "blog-detail" && !selectedBlog && <PageFallback />}

        {/* Professional Views */}
        {view === "professional" && (
          <Suspense fallback={<PageFallback />}>
            <ProfessionalLayout
              projects={data.projects}
              skills={data.skills}
              blogs={data.techBlogs}
              career={data.career}
              onBlogClick={(blog) => handleBlogClick(blog, "professional")}
              onViewAllBlogs={() => handleViewChange("professional-blog-list")}
            />
            <BackButton onClick={() => handleViewChange("landing")} />
          </Suspense>
        )}

        {view === "professional-blog-list" && (
          <Suspense fallback={<PageFallback />}>
            <BlogList
              blogs={data.techBlogs}
              onBack={() => handleViewChange("professional")}
              onRead={(blog) => handleBlogClick(blog, "professional-blog-list")}
              variant="professional"
            />
            <BackButton onClick={() => handleViewChange("landing")} />
          </Suspense>
        )}

        {/* Personal Views */}
        {view === "personal" && (
          <Suspense fallback={<PageFallback />}>
            <PersonalLayout
              blogs={data.hobbyBlogs}
              onBlogClick={(blog) => handleBlogClick(blog, "personal")}
              onViewAllBlogs={() => handleViewChange("personal-blog-list")}
            />
            <BackButton onClick={() => handleViewChange("landing")} />
          </Suspense>
        )}

        {view === "personal-blog-list" && (
          <Suspense fallback={<PageFallback />}>
            <BlogList
              blogs={data.hobbyBlogs}
              onBack={() => handleViewChange("personal")}
              onRead={(blog) => handleBlogClick(blog, "personal-blog-list")}
              variant="personal"
            />
            <BackButton onClick={() => handleViewChange("landing")} />
          </Suspense>
        )}

        {/* 404 Sayfa Bulunamadı */}
        {view === "not-found" && (
          <Suspense fallback={<PageFallback />}>
            <NotFound onGoHome={() => handleViewChange("landing")} />
          </Suspense>
        )}
      </ErrorBoundary>
    </div>
  );
};

export default App;
