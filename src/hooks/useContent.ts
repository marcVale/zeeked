import { useState, useEffect, useCallback, useRef } from 'react';
import type { ContentItem, Category } from '@/types';

// Categories
export const CATEGORIES: Category[] = [
  { id: 'news', name: 'News', slug: 'news', description: 'Breaking news and current events', color: '#D7FF00' },
  { id: 'sports', name: 'Sports', slug: 'sports', description: 'Sports highlights and scores', color: '#FF6B35' },
  { id: 'entertainment', name: 'Entertainment', slug: 'entertainment', description: 'Movies, TV, and celebrity news', color: '#E040FB' },
  { id: 'gaming', name: 'Gaming', slug: 'gaming', description: 'Video games and esports', color: '#00E5FF' },
  { id: 'hobbies', name: 'Hobbies', slug: 'hobbies', description: 'DIY, crafts, and interests', color: '#76FF03' },
  { id: 'anime', name: 'Anime', slug: 'anime', description: 'Anime and manga updates', color: '#FF4081' },
  { id: 'technology', name: 'Technology', slug: 'technology', description: 'Tech news and reviews', color: '#2979FF' },
  { id: 'lifestyle', name: 'Lifestyle', slug: 'lifestyle', description: 'Life tips and trends', color: '#FFAB00' },
  { id: 'business', name: 'Business', slug: 'business', description: 'Markets and finance', color: '#00BFA5' },
  { id: 'viral', name: 'Viral', slug: 'viral', description: 'Trending viral content', color: '#FF1744' },
  { id: 'celebrity', name: 'Celebrity', slug: 'celebrity', description: 'Celebrity gossip and news', color: '#D500F9' },
  { id: 'music', name: 'Music', slug: 'music', description: 'Music news and releases', color: '#F50057' },
  { id: 'movies', name: 'Movies', slug: 'movies', description: 'Film news and reviews', color: '#651FFF' },
  { id: 'food', name: 'Food', slug: 'food', description: 'Food and cooking trends', color: '#FF9100' },
  { id: 'travel', name: 'Travel', slug: 'travel', description: 'Travel destinations and tips', color: '#00B0FF' },
  { id: 'science', name: 'Science', slug: 'science', description: 'Scientific discoveries', color: '#00E676' },
  { id: 'health', name: 'Health', slug: 'health', description: 'Health and fitness', color: '#FF3D00' },
  { id: 'culture', name: 'Culture', slug: 'culture', description: 'Arts and culture', color: '#AA00FF' },
];

// API base URL - uses relative path for same-origin requests
const API_BASE = '/api';

// Content hook interface
interface UseContentReturn {
  items: ContentItem[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  loadMore: () => void;
  refresh: () => void;
  getByCategory: (category: string) => Promise<ContentItem[]>;
  getById: (id: string) => Promise<ContentItem | null>;
  getRelated: (item: ContentItem, count?: number) => ContentItem[];
  search: (query: string) => Promise<ContentItem[]>;
}

// Convert API item to ContentItem format
function normalizeApiItem(item: any): ContentItem {
  return {
    id: item.id,
    title: item.title,
    excerpt: item.excerpt || item.summary || '',
    content: item.content,
    imageUrl: item.imageUrl || item.image || '',
    category: item.category,
    source: item.source,
    sourceUrl: item.sourceUrl || item.url,
    publishedAt: item.publishedAt || item.timestamp,
    trendingScore: item.trendingScore || 0,
    country: item.country || 'global',
    language: item.language || 'en',
    tags: item.tags || [],
    views: item.views || item.engagement?.views,
    engagement: item.engagement?.likes || item.likes,
  };
}

export const useContent = (country: string = 'US', language: string = 'en'): UseContentReturn => {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const allItemsRef = useRef<ContentItem[]>([]);

  const fetchContent = useCallback(async (pageNum: number, append: boolean = false) => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        page: pageNum.toString(),
        limit: '30',
        country,
        language,
      });

      const response = await fetch(`${API_BASE}/feed?${params}`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      const newItems = data.items.map(normalizeApiItem);

      if (append) {
        allItemsRef.current = [...allItemsRef.current, ...newItems];
      } else {
        allItemsRef.current = newItems;
      }

      setItems(allItemsRef.current);
      setHasMore(data.pagination?.hasMore ?? false);
    } catch (err) {
      console.error('Error fetching content:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch content');
    } finally {
      setLoading(false);
    }
  }, [country, language]);

  useEffect(() => {
    fetchContent(1, false);
  }, [fetchContent]);

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchContent(nextPage, true);
    }
  }, [loading, hasMore, page, fetchContent]);

  const refresh = useCallback(() => {
    setPage(1);
    fetchContent(1, false);
  }, [fetchContent]);

  const getByCategory = useCallback(async (category: string): Promise<ContentItem[]> => {
    try {
      const params = new URLSearchParams({
        page: '1',
        limit: '50',
      });

      const response = await fetch(`${API_BASE}/category/${category}?${params}`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      return data.items.map(normalizeApiItem);
    } catch (err) {
      console.error(`Error fetching category ${category}:`, err);
      return [];
    }
  }, []);

  const getById = useCallback(async (id: string): Promise<ContentItem | null> => {
    try {
      const response = await fetch(`${API_BASE}/content/${id}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      return normalizeApiItem(data.item);
    } catch (err) {
      console.error(`Error fetching content ${id}:`, err);
      return null;
    }
  }, []);

  const getRelated = useCallback((item: ContentItem, count: number = 4): ContentItem[] => {
    return allItemsRef.current
      .filter(i => i.id !== item.id && (i.category === item.category || i.tags.some(t => item.tags.includes(t))))
      .slice(0, count);
  }, []);

  const search = useCallback(async (query: string): Promise<ContentItem[]> => {
    try {
      const params = new URLSearchParams({
        search: query,
        page: '1',
        limit: '50',
      });

      const response = await fetch(`${API_BASE}/feed?${params}`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      return data.items.map(normalizeApiItem);
    } catch (err) {
      console.error('Error searching content:', err);
      return [];
    }
  }, []);

  return {
    items,
    loading,
    error,
    hasMore,
    loadMore,
    refresh,
    getByCategory,
    getById,
    getRelated,
    search,
  };
};

export default useContent;
