// Content Types
export interface ContentItem {
  id: string;
  title: string;
  excerpt: string;
  content?: string;
  imageUrl: string;
  category: string;
  source: string;
  sourceUrl?: string;
  publishedAt: string;
  trendingScore: number;
  country?: string;
  language: string;
  tags: string[];
  views?: number;
  engagement?: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon?: string;
  color?: string;
}

export interface Country {
  code: string;
  name: string;
  nameLocal: string;
  languages: string[];
  flag: string;
}

export interface Language {
  code: string;
  name: string;
  nameLocal: string;
  flag: string;
  rtl?: boolean;
}

// User Preferences
export interface UserPreferences {
  country: string;
  language: string;
  categories: string[];
  autoDetect: boolean;
}

// Geolocation
export interface GeoLocation {
  country: string;
  countryName: string;
  region?: string;
  city?: string;
  lat?: number;
  lon?: number;
  timezone?: string;
}

// SEO
export interface SEOData {
  title: string;
  description: string;
  keywords: string[];
  ogImage?: string;
  ogType?: string;
  canonicalUrl?: string;
  alternateLanguages?: { lang: string; url: string }[];
}

// Ad Placements
export type AdPlacement = 
  | 'top-banner'
  | 'in-feed'
  | 'sidebar'
  | 'article-body'
  | 'sticky-mobile'
  | 'related-content';

export interface AdSlot {
  id: string;
  placement: AdPlacement;
  size: string;
  enabled: boolean;
}

// API Responses
export interface TrendingResponse {
  items: ContentItem[];
  total: number;
  page: number;
  hasMore: boolean;
}

export interface CategoryResponse {
  categories: Category[];
}

// Navigation
export interface NavItem {
  label: string;
  href: string;
  icon?: string;
  external?: boolean;
}

// Feed
export interface FeedState {
  items: ContentItem[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  page: number;
}

// Search
export interface SearchResult {
  items: ContentItem[];
  suggestions: string[];
  total: number;
}
