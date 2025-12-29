export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  videoUrl?: string; // Novo campo para vídeos nos reels
  category: string;
  sizes: string[];
}

export interface Testimonial {
  id: number;
  name: string;
  role: string;
  content: string;
  rating: number;
  avatarUrl: string;
}

export interface Feature {
  id: number;
  title: string;
  description: string;
  icon: string;
}

export interface StoryPost {
  id: string;
  type: 'image' | 'text';
  content: string;
  timestamp: number; // Date.now()
  backgroundColor?: string;
  textColor?: string;
}

export enum ViewState {
  LANDING = 'LANDING',
  ADMIN = 'ADMIN'
}