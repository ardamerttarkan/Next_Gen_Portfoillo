import { BlogPost, MediaItem, Project, Skill, Song } from '../types';

export const currentSong: Song = {
  id: '1',
  title: 'Midnight City',
  artist: 'M83',
  albumArt: 'https://picsum.photos/id/10/300/300',
  duration: '4:03'
};

export const playlists: { id: string; name: string; image: string }[] = [
  { id: 'p1', name: 'Coding Flow', image: 'https://picsum.photos/id/11/150/150' },
  { id: 'p2', name: 'Late Night Jazz', image: 'https://picsum.photos/id/12/150/150' },
  { id: 'p3', name: 'Gym Motivation', image: 'https://picsum.photos/id/13/150/150' },
  { id: 'p4', name: 'Discover Weekly', image: 'https://picsum.photos/id/14/150/150' },
];

export const topTracks: Song[] = [
  { id: 't1', title: 'Starboy', artist: 'The Weeknd', albumArt: 'https://picsum.photos/id/20/50/50', duration: '3:50' },
  { id: 't2', title: 'Instant Crush', artist: 'Daft Punk', albumArt: 'https://picsum.photos/id/21/50/50', duration: '5:37' },
  { id: 't3', title: 'Fluorescent Adolescent', artist: 'Arctic Monkeys', albumArt: 'https://picsum.photos/id/22/50/50', duration: '2:57' },
];

export const favoriteMovies: MediaItem[] = [
  { id: 'm1', title: 'Interstellar', rating: 9.8, image: 'https://picsum.photos/id/30/200/300', type: 'movie', status: 'Watched' },
  { id: 'm2', title: 'Grand Budapest Hotel', rating: 9.0, image: 'https://picsum.photos/id/31/200/300', type: 'movie', status: 'Watched' },
  { id: 'm3', title: 'Inception', rating: 9.5, image: 'https://picsum.photos/id/32/200/300', type: 'movie', status: 'Watched' },
  { id: 'm4', title: 'Blade Runner 2049', rating: 9.2, image: 'https://picsum.photos/id/33/200/300', type: 'movie', status: 'Watched' },
  { id: 'm5', title: 'Dune: Part Two', rating: 9.4, image: 'https://picsum.photos/id/34/200/300', type: 'movie', status: 'Watched' },
];

export const recentSeries: MediaItem[] = [
  { id: 's1', title: 'Succession', rating: 9.5, image: 'https://picsum.photos/id/40/200/300', type: 'series', status: 'Watched' },
  { id: 's2', title: 'Severance', rating: 9.2, image: 'https://picsum.photos/id/41/200/300', type: 'series', status: 'Watching' },
  { id: 's3', title: 'The Bear', rating: 8.9, image: 'https://picsum.photos/id/42/200/300', type: 'series', status: 'Watching' },
  { id: 's4', title: 'Arcane', rating: 9.6, image: 'https://picsum.photos/id/43/200/300', type: 'series', status: 'Plan to Watch' },
  { id: 's5', title: 'Breaking Bad', rating: 9.9, image: 'https://picsum.photos/id/44/200/300', type: 'series', status: 'Watched' },
];

export const hobbyBlogs: BlogPost[] = [
  { 
    id: 'h1', 
    title: 'Analog Photography: A Beginner\'s Guide', 
    excerpt: 'Why I switched to 35mm film in a digital age and what I learned.', 
    date: 'Oct 12, 2023', 
    readTime: '5 min', 
    category: 'hobby',
    image: 'https://picsum.photos/id/50/600/300'
  },
  { 
    id: 'h2', 
    title: 'The Art of Brewing Coffee', 
    excerpt: 'Exploring different brewing methods from V60 to AeroPress.', 
    date: 'Sep 28, 2023', 
    readTime: '3 min', 
    category: 'hobby',
    image: 'https://picsum.photos/id/51/600/300'
  }
];

export const techBlogs: BlogPost[] = [
  { 
    id: 't1', 
    title: 'Understanding React Server Components', 
    excerpt: 'A deep dive into how RSCs change the way we build web apps.', 
    date: 'Nov 15, 2023', 
    readTime: '8 min', 
    category: 'tech',
    image: 'https://picsum.photos/id/60/600/300'
  },
  { 
    id: 't2', 
    title: 'Optimizing TypeScript Performance', 
    excerpt: 'Tips and tricks to keep your TS compiler happy and fast.', 
    date: 'Oct 05, 2023', 
    readTime: '6 min', 
    category: 'tech',
    image: 'https://picsum.photos/id/61/600/300'
  }
];

export const projects: Project[] = [
  {
    id: 'p1',
    title: 'E-Commerce Dashboard',
    description: 'A comprehensive analytics dashboard for online retailers featuring real-time data visualization.',
    techStack: ['React', 'TypeScript', 'D3.js', 'Node.js'],
    repoUrl: '#',
    liveUrl: '#',
    image: 'https://picsum.photos/id/70/600/400'
  },
  {
    id: 'p2',
    title: 'AI Task Manager',
    description: 'Smart task management application that uses Gemini API to prioritize your daily workload.',
    techStack: ['Next.js', 'Tailwind', 'Gemini API', 'Prisma'],
    repoUrl: '#',
    liveUrl: '#',
    image: 'https://picsum.photos/id/71/600/400'
  },
  {
    id: 'p3',
    title: 'Crypto Wallet Tracker',
    description: 'Web3 application to track portfolio performance across multiple chains.',
    techStack: ['Vue', 'Ethers.js', 'Firebase'],
    repoUrl: '#',
    liveUrl: '#',
    image: 'https://picsum.photos/id/72/600/400'
  }
];

export const skills: Skill[] = [
  { name: 'React / Next.js', level: 95 },
  { name: 'TypeScript', level: 90 },
  { name: 'Node.js', level: 85 },
  { name: 'Tailwind CSS', level: 95 },
  { name: 'PostgreSQL', level: 80 },
  { name: 'AWS Services', level: 70 },
  { name: 'Docker', level: 75 },
  { name: 'GraphQL', level: 80 },
];