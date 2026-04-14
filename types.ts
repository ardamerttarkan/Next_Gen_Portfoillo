export type ViewMode =
  | "landing"
  | "personal"
  | "professional"
  | "admin"
  | "admin-login"
  | "blog-detail"
  | "personal-blog-list"
  | "professional-blog-list"
  | "not-found";

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
  status?: "active" | "draft";
}

export interface Project {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  repoUrl?: string;
  liveUrl?: string;
  image: string;
  status?: "active" | "draft";
}

export interface CareerItem {
  id: string;
  type: "work" | "internship" | "freelance";
  title: string;
  company: string;
  location?: string;
  startDate: string;
  endDate?: string; // empty means "Present"
  description: string;
  techStack?: string[];
}

export interface VolunteerItem {
  id: string;
  type: "club" | "community" | "event" | "other";
  title: string;
  organization: string;
  location?: string;
  startDate: string;
  endDate?: string;
  description: string;
  techStack?: string[];
}

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  is_read: boolean;
  created_at: string;
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
  career: CareerItem[];
  volunteer: VolunteerItem[];
}
