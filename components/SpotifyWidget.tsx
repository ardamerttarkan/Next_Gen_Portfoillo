import React, { useState, useEffect } from 'react';
import { Play, SkipBack, SkipForward, Heart, Repeat, Shuffle, Volume2 } from 'lucide-react';
import { Song } from '../types';

interface SpotifyWidgetProps {
  currentSong: Song;
}

export const SpotifyWidget: React.FC<SpotifyWidgetProps> = ({ currentSong }) => {
  const [progress, setProgress] = useState(30);
  const [isPlaying, setIsPlaying] = useState(true);

  // Fake progress bar
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 0 : prev + 0.5));
    }, 1000);
    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <div className="bg-spotify-dark p-4 rounded-xl shadow-lg border border-white/10 w-full max-w-md mx-auto">
      <div className="flex items-end space-x-4 mb-4">
        <img 
          src={currentSong.albumArt} 
          alt={currentSong.title} 
          className="w-16 h-16 rounded shadow-md object-cover animate-pulse-slow" 
        />
        <div className="flex-1 min-w-0">
          <p className="text-xs text-spotify-green font-bold uppercase tracking-wider mb-1">Now Playing</p>
          <h3 className="text-white font-bold truncate text-lg leading-tight">{currentSong.title}</h3>
          <p className="text-spotify-grey text-sm truncate">{currentSong.artist}</p>
        </div>
        <Heart className="text-spotify-green w-5 h-5 cursor-pointer hover:scale-110 transition-transform" fill="#1DB954" />
      </div>

      {/* Progress Bar */}
      <div className="mb-2">
        <div className="h-1 w-full bg-gray-600 rounded-full overflow-hidden">
          <div 
            className="h-full bg-white rounded-full transition-all duration-500 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-spotify-grey mt-1">
          <span>1:21</span>
          <span>{currentSong.duration}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between px-2">
        <Shuffle className="w-4 h-4 text-spotify-grey hover:text-white cursor-pointer" />
        <SkipBack className="w-5 h-5 text-gray-300 hover:text-white cursor-pointer" />
        
        <button 
          onClick={() => setIsPlaying(!isPlaying)}
          className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:scale-105 transition-transform"
        >
          {isPlaying ? (
            <div className="flex gap-1 h-4 items-center">
               <div className="w-1 h-4 bg-black"></div>
               <div className="w-1 h-4 bg-black"></div>
            </div>
          ) : (
            <Play className="w-5 h-5 text-black ml-1" fill="black" />
          )}
        </button>

        <SkipForward className="w-5 h-5 text-gray-300 hover:text-white cursor-pointer" />
        <Repeat className="w-4 h-4 text-spotify-green cursor-pointer" />
      </div>

      <div className="flex items-center gap-2 mt-4 justify-end">
          <Volume2 className="w-4 h-4 text-spotify-grey" />
          <div className="w-20 h-1 bg-gray-600 rounded-full">
            <div className="w-3/4 h-full bg-spotify-grey hover:bg-spotify-green rounded-full"></div>
          </div>
      </div>
    </div>
  );
};