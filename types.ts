import React from "react";

export type ViewMode =
  | "landing"
  | "personal"
  | "professional"
  | "admin"
  | "admin-login"
  | "blog-detail"
  | "personal-blog-list"
  | "professional-blog-list";

export interface Song {
  id: string;
  title: string;
  artist: string;
  albumArt: string;
  duration: string;
}

export interface Playlist {
  id: string;
  name: string;
  image: string;
}

export interface MediaItem {
  id: string;
  title: string;
  rating: number; // 1-10
  image: string;
  type: "movie" | "series";
  status?: "Watched" | "Watching" | "Plan to Watch";
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  category: "hobby" | "tech";
  content?: string;
  image?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  repoUrl?: string;
  liveUrl?: string;
  image: string;
}

export interface Skill {
  name: string;
  level: number; // 0-100
  icon?: React.ReactNode;
}

export interface AppData {
  currentSong: Song;
  playlists: Playlist[];
  topTracks: Song[];
  favoriteMovies: MediaItem[];
  recentSeries: MediaItem[];
  hobbyBlogs: BlogPost[];
  techBlogs: BlogPost[];
  projects: Project[];
  skills: Skill[];
}
