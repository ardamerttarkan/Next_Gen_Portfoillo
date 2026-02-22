/**
 * Portfolio API Service
 * Communicates with PHP backend via REST API
 */

const API_BASE = "/php-api";

// Token management
let authToken: string | null = localStorage.getItem("admin_token");

export function setToken(token: string | null) {
  authToken = token;
  if (token) {
    localStorage.setItem("admin_token", token);
  } else {
    localStorage.removeItem("admin_token");
  }
}

export function getToken(): string | null {
  return authToken;
}

export function isAuthenticated(): boolean {
  if (!authToken) return false;
  try {
    const parts = authToken.split(".");
    if (parts.length !== 3) {
      setToken(null);
      return false;
    }
    const payload = JSON.parse(atob(parts[1]));
    if (payload.exp && payload.exp < Date.now() / 1000) {
      setToken(null);
      return false;
    }
    return true;
  } catch {
    setToken(null);
    return false;
  }
}

// Generic fetch helper
async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((options.headers as Record<string, string>) || {}),
  };

  if (authToken) {
    headers["Authorization"] = `Bearer ${authToken}`;
  }

  const res = await fetch(`${API_BASE}/${endpoint}`, {
    ...options,
    headers,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || `API error: ${res.status}`);
  }

  return data as T;
}

// ============ AUTH ============

export interface LoginResponse {
  success: boolean;
  token: string;
  user: { id: number; username: string };
}

export async function login(
  username: string,
  password: string,
): Promise<LoginResponse> {
  const data = await apiFetch<LoginResponse>("auth.php", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
  if (data.token) {
    setToken(data.token);
  }
  return data;
}

export function logout() {
  setToken(null);
}

// ============ ADMIN SETTINGS ============

export async function updateAdminCredentials(data: {
  currentPassword: string;
  username?: string;
  password?: string;
}): Promise<{
  success: boolean;
  token: string;
  user: { id: number; username: string };
}> {
  const result = await apiFetch<{
    success: boolean;
    token: string;
    user: { id: number; username: string };
  }>("auth.php", {
    method: "PUT",
    body: JSON.stringify(data),
  });
  if (result.token) {
    setToken(result.token);
  }
  return result;
}

// ============ PROJECTS ============

import { Project, BlogPost, Skill, CareerItem } from "../types";

export async function getProjects(): Promise<Project[]> {
  return apiFetch<Project[]>("projects.php");
}

export async function createProject(
  project: Omit<Project, "id"> & { id?: string },
): Promise<{ success: boolean; id: string }> {
  return apiFetch("projects.php", {
    method: "POST",
    body: JSON.stringify(project),
  });
}

export async function updateProject(
  id: string,
  project: Partial<Project>,
): Promise<{ success: boolean }> {
  return apiFetch(`projects.php?id=${encodeURIComponent(id)}`, {
    method: "PUT",
    body: JSON.stringify(project),
  });
}

export async function deleteProject(id: string): Promise<{ success: boolean }> {
  return apiFetch(`projects.php?id=${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}

// ============ BLOGS ============

export async function getBlogs(
  category?: "tech" | "hobby",
): Promise<BlogPost[]> {
  const query = category ? `?category=${category}` : "";
  return apiFetch<BlogPost[]>(`blogs.php${query}`);
}

export async function createBlog(
  blog: Omit<BlogPost, "id"> & { id?: string },
): Promise<{ success: boolean; id: string }> {
  return apiFetch("blogs.php", {
    method: "POST",
    body: JSON.stringify(blog),
  });
}

export async function updateBlog(
  id: string,
  blog: Partial<BlogPost>,
): Promise<{ success: boolean }> {
  return apiFetch(`blogs.php?id=${encodeURIComponent(id)}`, {
    method: "PUT",
    body: JSON.stringify(blog),
  });
}

export async function deleteBlog(id: string): Promise<{ success: boolean }> {
  return apiFetch(`blogs.php?id=${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}

// ============ SKILLS ============

export async function getSkills(): Promise<Skill[]> {
  return apiFetch<Skill[]>("skills.php");
}

export async function createSkill(skill: {
  name: string;
  level: number;
}): Promise<{ success: boolean }> {
  return apiFetch("skills.php", {
    method: "POST",
    body: JSON.stringify(skill),
  });
}

export async function updateSkill(
  name: string,
  skill: { name: string; level: number },
): Promise<{ success: boolean }> {
  return apiFetch(`skills.php?name=${encodeURIComponent(name)}`, {
    method: "PUT",
    body: JSON.stringify(skill),
  });
}

export async function deleteSkill(name: string): Promise<{ success: boolean }> {
  return apiFetch(`skills.php?name=${encodeURIComponent(name)}`, {
    method: "DELETE",
  });
}

// ============ CAREER ============

export async function getCareer(): Promise<CareerItem[]> {
  return apiFetch<CareerItem[]>("career.php");
}

export async function createCareer(
  item: Omit<CareerItem, "id"> & { id?: string },
): Promise<{ success: boolean; id: string }> {
  return apiFetch("career.php", {
    method: "POST",
    body: JSON.stringify(item),
  });
}

export async function updateCareer(
  id: string,
  item: Partial<CareerItem>,
): Promise<{ success: boolean }> {
  return apiFetch(`career.php?id=${encodeURIComponent(id)}`, {
    method: "PUT",
    body: JSON.stringify(item),
  });
}

export async function deleteCareer(id: string): Promise<{ success: boolean }> {
  return apiFetch(`career.php?id=${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}

// ============ LOAD ALL DATA ============

import { AppData } from "../types";
import * as mockData from "./mockData";

/**
 * Load all portfolio data from API.
 * Falls back to mock data for fields not stored in DB (songs, movies, etc.)
 */
export async function loadAllData(): Promise<AppData> {
  try {
    const [projects, techBlogs, hobbyBlogs, skills, career] = await Promise.all(
      [
        getProjects(),
        getBlogs("tech"),
        getBlogs("hobby"),
        getSkills(),
        getCareer(),
      ],
    );

    return {
      // From API (no mockData fallback so CRUD operations persist)
      projects,
      techBlogs,
      hobbyBlogs,
      skills,
      career,
      // Static / from other services (not in DB yet)
      currentSong: mockData.currentSong,
      playlists: mockData.playlists,
      topTracks: mockData.topTracks,
      favoriteMovies: mockData.favoriteMovies,
      recentSeries: mockData.recentSeries,
    };
  } catch (err) {
    console.warn("Failed to load from API, using mock data:", err);
    // Fallback to mock data if API is down
    return {
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
    };
  }
}
