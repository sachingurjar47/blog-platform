import { EditorJSData } from "./editorjs";

export interface ApiError {
  response?: {
    data?: {
      message?: string;
      errors?: { [key: string]: string };
    };
    status?: number;
  };
}

export interface User {
  id: string;
  email: string;
  name?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Post {
  id: string;
  title: string;
  content: string | EditorJSData; // Support both string and Editor.js data
  likes: number;
  likedBy: string[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  creator?: {
    id: string;
    name: string;
    email: string;
  } | null;
  isLiked?: boolean;
}

export interface PostsResponse {
  posts: Post[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface AuthResponse {
  authenticated: boolean;
  user?: User;
}

export interface LoginResponse {
  token: string;
}

export interface RegisterResponse {
  token: string;
}
