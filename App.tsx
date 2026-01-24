import React, { useState, useEffect } from 'react';
import { Landing } from './views/Landing';
import { PersonalLayout } from './components/PersonalLayout';
import { ProfessionalLayout } from './components/ProfessionalLayout';
import { AdminPanel } from './components/AdminPanel';
import { BlogDetail } from './components/BlogDetail';
import { BlogList } from './components/BlogList';
import { ThemeToggle } from './components/ThemeToggle';
import { ViewMode, AppData, BlogPost } from './types';
import { Home } from 'lucide-react';
import * as mockData from './services/mockData';

const App: React.FC = () => {
  const [view, setView] = useState<ViewMode>('landing');
  const [transitioning, setTransitioning] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState<BlogPost | null>(null);
  const [previousView, setPreviousView] = useState<ViewMode>('landing'); // To handle "Back" from blog detail logic

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
  });

  // Handle Dark Mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleViewChange = (newView: ViewMode) => {
    setTransitioning(true);
    setTimeout(() => {
      setView(newView);
      setTransitioning(false);
      window.scrollTo(0, 0);
    }, 300);
  };

  const handleBlogClick = (blog: BlogPost, fromView: ViewMode) => {
    setPreviousView(fromView);
    setSelectedBlog(blog);
    handleViewChange('blog-detail');
  };

  const BackButton = () => (
    <button 
      onClick={() => handleViewChange('landing')}
      className={`
        fixed bottom-6 right-6 z-40 p-3 rounded-full shadow-2xl transition-all duration-300 hover:scale-110
        ${view.includes('personal') 
          ? 'bg-spotify-green text-black hover:bg-black hover:text-white' 
          : 'bg-slate-900 text-white hover:bg-prof-blue dark:bg-white dark:text-black dark:hover:bg-gray-200'}
      `}
      title="Back to Landing"
    >
      <Home className="w-6 h-6" />
    </button>
  );

  return (
    <div className={`transition-opacity duration-300 ${transitioning ? 'opacity-0' : 'opacity-100'} ${darkMode ? 'dark' : ''}`}>
      
      {/* Theme Toggle available everywhere except admin */}
      {view !== 'admin' && (
        <ThemeToggle isDark={darkMode} toggle={() => setDarkMode(!darkMode)} />
      )}

      {/* --- VIEWS --- */}
      
      {view === 'landing' && (
        <Landing 
          onSelect={handleViewChange} 
          onAdmin={() => handleViewChange('admin')}
        />
      )}

      {view === 'admin' && (
        <AdminPanel 
          data={data} 
          updateData={setData} 
          onLogout={() => handleViewChange('landing')} 
        />
      )}

      {/* Blog Detail View (Full Page) */}
      {view === 'blog-detail' && selectedBlog && (
        <BlogDetail 
          post={selectedBlog} 
          onBack={() => handleViewChange(previousView)} 
          theme={previousView.includes('professional') ? 'professional' : 'personal'}
        />
      )}

      {/* Professional Views */}
      {view === 'professional' && (
        <>
          <ProfessionalLayout 
            projects={data.projects}
            skills={data.skills}
            blogs={data.techBlogs}
            onBlogClick={(blog) => handleBlogClick(blog, 'professional')}
            onViewAllBlogs={() => handleViewChange('professional-blog-list')}
          />
          <BackButton />
        </>
      )}

      {view === 'professional-blog-list' && (
        <>
          <BlogList 
            blogs={data.techBlogs} 
            onBack={() => handleViewChange('professional')}
            onRead={(blog) => handleBlogClick(blog, 'professional-blog-list')}
            variant="professional"
          />
          <BackButton />
        </>
      )}

      {/* Personal Views */}
      {view === 'personal' && (
        <>
          <PersonalLayout 
            currentSong={data.currentSong}
            playlists={data.playlists}
            topTracks={data.topTracks}
            favoriteMovies={data.favoriteMovies}
            recentSeries={data.recentSeries}
            blogs={data.hobbyBlogs}
            onBlogClick={(blog) => handleBlogClick(blog, 'personal')}
            onViewAllBlogs={() => handleViewChange('personal-blog-list')}
          />
          <BackButton />
        </>
      )}

       {view === 'personal-blog-list' && (
        <>
          <BlogList 
            blogs={data.hobbyBlogs} 
            onBack={() => handleViewChange('personal')}
            onRead={(blog) => handleBlogClick(blog, 'personal-blog-list')}
            variant="personal"
          />
          <BackButton />
        </>
      )}

    </div>
  );
};

export default App;