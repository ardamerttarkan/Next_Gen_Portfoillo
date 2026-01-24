import React from 'react';
import { Song, MediaItem, BlogPost } from '../types';
import { SpotifyWidget } from './SpotifyWidget';
import { Star, Film, BookOpen, Clock, Music, Tv, Clapperboard, Disc, ArrowRight } from 'lucide-react';

interface PersonalLayoutProps {
  currentSong: Song;
  playlists: { id: string; name: string; image: string }[];
  topTracks: Song[];
  favoriteMovies: MediaItem[];
  recentSeries: MediaItem[];
  blogs: BlogPost[];
  onBlogClick: (blog: BlogPost) => void;
  onViewAllBlogs: () => void;
}

export const PersonalLayout: React.FC<PersonalLayoutProps> = ({
  currentSong,
  playlists,
  topTracks,
  favoriteMovies,
  recentSeries,
  blogs,
  onBlogClick,
  onViewAllBlogs
}) => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] text-gray-800 dark:text-gray-200 font-sans selection:bg-spotify-green selection:text-black pb-32 transition-colors duration-500">
      
      {/* Decorative Background */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-20 dark:opacity-30">
         <div className="absolute top-20 left-0 w-[500px] h-[500px] bg-purple-300 dark:bg-purple-900/40 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[100px] animate-blob"></div>
         <div className="absolute top-40 right-0 w-[500px] h-[500px] bg-green-200 dark:bg-emerald-900/40 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[100px] animate-blob animation-delay-2000"></div>
         <div className="absolute -bottom-32 left-1/3 w-[600px] h-[600px] bg-pink-200 dark:bg-pink-900/40 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[100px] animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        
        {/* Header */}
        <header className="mb-16 text-center md:text-left">
           <div className="inline-block mb-3 px-3 py-1 rounded-full bg-white dark:bg-white/10 border border-gray-200 dark:border-white/10 text-xs font-bold tracking-wider uppercase text-gray-500 dark:text-gray-400 shadow-sm">
             Welcome to my world
           </div>
           <h1 className="text-5xl md:text-7xl font-display font-bold text-gray-900 dark:text-white mb-4 tracking-tight leading-tight">
             My Digital <span className="text-transparent bg-clip-text bg-gradient-to-r from-spotify-green to-blue-500">Soul</span>
           </h1>
           <p className="text-gray-600 dark:text-gray-400 text-xl max-w-2xl leading-relaxed">
             A curated collection of the music that fuels me, the stories that inspire me, and the hobbies that keep me grounded.
           </p>
        </header>

        {/* Section 1: Audio Experience */}
        <section className="mb-20">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-spotify-green/10 rounded-lg">
              <Music className="text-spotify-green w-6 h-6" />
            </div>
            <h2 className="text-3xl font-display font-bold text-gray-900 dark:text-white">Audio Experience</h2>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
            {/* Now Playing & Widget */}
            <div className="xl:col-span-5 flex flex-col gap-6">
               <SpotifyWidget currentSong={currentSong} />
               
               <div className="bg-white dark:bg-[#121212] p-6 rounded-2xl border border-gray-200 dark:border-white/5 shadow-xl dark:shadow-none">
                <h3 className="flex items-center gap-2 text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-6">
                  <Disc className="w-4 h-4"/> Curated Playlists
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {playlists.map(playlist => (
                    <div key={playlist.id} className="group flex items-center gap-3 bg-gray-50 dark:bg-white/5 p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 transition cursor-pointer border border-transparent dark:hover:border-white/10">
                      <img src={playlist.image} alt={playlist.name} className="w-12 h-12 rounded-lg shadow-sm" />
                      <span className="text-sm font-semibold text-gray-700 dark:text-gray-200 truncate group-hover:text-spotify-green transition-colors">{playlist.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Top Tracks Chart */}
            <div className="xl:col-span-7">
               <div className="h-full bg-white dark:bg-[#121212] p-8 rounded-3xl border border-gray-200 dark:border-white/5 shadow-xl dark:shadow-none flex flex-col">
                 <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">On Repeat This Month</h3>
                 <div className="flex-1 space-y-2">
                   {topTracks.map((track, idx) => (
                     <div key={track.id} className="flex items-center gap-5 group p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition border border-transparent hover:border-gray-200 dark:hover:border-white/5">
                       <span className="text-2xl font-display font-bold text-gray-300 dark:text-gray-600 w-8 text-center group-hover:text-spotify-green transition-colors">0{idx + 1}</span>
                       <img src={track.albumArt} alt={track.title} className="w-14 h-14 rounded-lg shadow-sm" />
                       <div className="flex-1 min-w-0">
                          <div className="text-lg font-bold text-gray-900 dark:text-white truncate">{track.title}</div>
                          <div className="text-sm font-medium text-gray-500 dark:text-gray-400">{track.artist}</div>
                       </div>
                       <span className="text-sm font-medium text-gray-400">{track.duration}</span>
                     </div>
                   ))}
                 </div>
               </div>
            </div>
          </div>
        </section>

        {/* Section 2: Visual Library (Split Layout) */}
        <section className="mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Column 1: Movies (Letterboxd Style) */}
            <div>
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-500/10 rounded-lg">
                    <Clapperboard className="text-orange-500 w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Cinema</h2>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Letterboxd Favorites</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {favoriteMovies.map((movie, index) => (
                  <div key={movie.id} className="group flex gap-4 bg-white dark:bg-[#121212] p-3 rounded-xl border border-gray-200 dark:border-white/5 hover:border-orange-500/30 dark:hover:border-orange-500/30 shadow-sm hover:shadow-lg transition-all duration-300">
                    <div className="relative w-16 h-24 shrink-0 overflow-hidden rounded-lg shadow-md">
                       <img src={movie.image} alt={movie.title} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
                       <div className="absolute top-0 left-0 bg-orange-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-br-md">
                         #{index + 1}
                       </div>
                    </div>
                    <div className="flex flex-col justify-center flex-1">
                       <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-tight group-hover:text-orange-500 transition-colors">{movie.title}</h3>
                       <div className="flex items-center gap-2 mt-2">
                         <div className="flex text-orange-400">
                           <Star className="w-3.5 h-3.5 fill-current" />
                           <Star className="w-3.5 h-3.5 fill-current" />
                           <Star className="w-3.5 h-3.5 fill-current" />
                           <Star className="w-3.5 h-3.5 fill-current" />
                           <Star className="w-3.5 h-3.5 fill-current" />
                         </div>
                         <span className="text-xs font-medium text-gray-500 dark:text-gray-400">{movie.rating}/10</span>
                       </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Column 2: TV Series */}
            <div>
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-pink-500/10 rounded-lg">
                    <Tv className="text-pink-500 w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Television</h2>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Watching & Recent</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {recentSeries.map((series) => (
                  <div key={series.id} className="group flex gap-4 bg-white dark:bg-[#121212] p-3 rounded-xl border border-gray-200 dark:border-white/5 hover:border-pink-500/30 dark:hover:border-pink-500/30 shadow-sm hover:shadow-lg transition-all duration-300">
                     <div className="w-16 h-24 shrink-0 overflow-hidden rounded-lg shadow-md relative">
                       <img src={series.image} alt={series.title} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
                       {series.status === 'Watching' && (
                         <div className="absolute bottom-0 inset-x-0 bg-pink-600 text-white text-[9px] font-bold text-center py-0.5 uppercase tracking-wider">
                           Active
                         </div>
                       )}
                     </div>
                     <div className="flex flex-col justify-center flex-1">
                       <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-tight group-hover:text-pink-500 transition-colors">{series.title}</h3>
                       <div className="flex items-center gap-3 mt-2">
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium border ${
                            series.status === 'Watched' 
                              ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-900/30' 
                              : series.status === 'Watching'
                              ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-900/30'
                              : 'bg-gray-50 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700'
                          }`}>
                            {series.status}
                          </span>
                          <span className="text-xs font-medium text-gray-500 dark:text-gray-400 flex items-center gap-1">
                            <Star className="w-3 h-3 text-yellow-500 fill-current"/> {series.rating}
                          </span>
                       </div>
                     </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </section>

        {/* Section 3: Hobbies */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-500/10 rounded-lg">
                <BookOpen className="text-yellow-600 dark:text-yellow-500 w-6 h-6" />
              </div>
              <h2 className="text-3xl font-display font-bold text-gray-900 dark:text-white">Personal Logs</h2>
            </div>
            <button 
              onClick={onViewAllBlogs}
              className="text-sm font-bold text-yellow-600 dark:text-yellow-500 flex items-center hover:underline"
            >
              View All Logs <ArrowRight className="w-4 h-4 ml-1"/>
            </button>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {blogs.slice(0, 2).map(blog => (
              <article 
                key={blog.id} 
                onClick={() => onBlogClick(blog)}
                className="bg-white dark:bg-[#121212] rounded-3xl overflow-hidden border border-gray-200 dark:border-white/5 hover:border-yellow-500/50 dark:hover:border-yellow-500/50 transition-all group cursor-pointer shadow-lg dark:shadow-none hover:shadow-2xl"
              >
                <div className="h-56 overflow-hidden relative">
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors z-10"></div>
                  <img src={blog.image} alt={blog.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-700" />
                  <div className="absolute top-4 right-4 z-20 bg-white/90 dark:bg-black/80 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-gray-900 dark:text-white flex items-center gap-1 shadow-sm">
                    <Clock className="w-3 h-3" /> {blog.readTime}
                  </div>
                </div>
                <div className="p-8">
                  <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">{blog.date}</div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-yellow-600 dark:group-hover:text-yellow-500 transition-colors leading-tight">{blog.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-2">{blog.excerpt}</p>
                  <div className="mt-6 flex items-center text-sm font-bold text-yellow-600 dark:text-yellow-500">
                    Read Story <div className="ml-2 w-4 h-px bg-current group-hover:w-8 transition-all"></div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
};