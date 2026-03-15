export interface RawContentItem {
  id: string;
  title: string;
  description?: string;
  url: string;
  image?: string;
  publishedAt: string;
  source: string;
  category?: string;
  author?: string;
  engagement?: {
    views?: number;
    likes?: number;
    comments?: number;
    shares?: number;
  };
}

export interface NormalizedContent {
  id: string;
  title: string;
  excerpt: string;
  url: string;
  image: string;
  publishedAt: string;
  source: string;
  category: string;
  author?: string;
  country?: string;
  engagement: {
    views: number;
    likes: number;
    comments: number;
    shares: number;
    trending: number;
  };
  tags: string[];
}
