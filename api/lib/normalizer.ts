import type { RawContentItem, NormalizedContent } from './content-types';

const categoryKeywords: Record<string, string[]> = {
  tech: ['technology', 'tech', 'ai', 'software', 'hardware', 'crypto', 'bitcoin', 'ethereum', 'startup', 'app', 'digital'],
  business: ['business', 'finance', 'market', 'stock', 'economy', 'trade', 'investment', 'corporate', 'startup'],
  entertainment: ['entertainment', 'movie', 'film', 'music', 'celebrity', 'hollywood', 'tv', 'show', 'streaming'],
  sports: ['sports', 'football', 'basketball', 'soccer', 'tennis', 'olympics', 'nfl', 'nba', 'fifa'],
  science: ['science', 'space', 'research', 'study', 'discovery', 'physics', 'biology', 'nasa', 'mars'],
  health: ['health', 'medical', 'medicine', 'wellness', 'fitness', 'covid', 'vaccine', 'mental health'],
  culture: ['culture', 'art', 'fashion', 'lifestyle', 'travel', 'food', 'design', 'photography'],
  gaming: ['game', 'gaming', 'video game', 'esports', 'playstation', 'xbox', 'nintendo', 'steam'],
  anime: ['anime', 'manga', 'japan', 'otaku', 'crunchyroll'],
};

function detectCategory(title: string, description: string = ''): string {
  const text = `${title} ${description}`.toLowerCase();
  
  const scores: Record<string, number> = {};
  
  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    scores[category] = keywords.reduce((score, keyword) => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
      const matches = text.match(regex);
      return score + (matches ? matches.length : 0);
    }, 0);
  }

  const bestCategory = Object.entries(scores)
    .sort((a, b) => b[1] - a[1])
    .find(([_, score]) => score > 0);

  return bestCategory ? bestCategory[0] : 'general';
}

function generateId(item: RawContentItem): string {
  const hash = Buffer.from(item.url || item.title).toString('base64').slice(0, 12);
  return `${item.source.toLowerCase().replace(/\s+/g, '-')}-${hash}`;
}

function calculateTrendingScore(engagement: RawContentItem['engagement']): number {
  if (!engagement) return 0;
  
  const views = engagement.views || 0;
  const likes = engagement.likes || 0;
  const comments = engagement.comments || 0;
  const shares = engagement.shares || 0;

  // Weighted scoring algorithm
  return Math.floor(
    views * 0.1 +
    likes * 0.3 +
    comments * 0.4 +
    shares * 0.5
  );
}

export function normalizeContent(item: RawContentItem): NormalizedContent {
  const category = item.category || detectCategory(item.title, item.description);
  
  return {
    id: item.id || generateId(item),
    title: item.title.trim(),
    excerpt: (item.description || '').slice(0, 200).trim() + ((item.description?.length || 0) > 200 ? '...' : ''),
    url: item.url,
    image: item.image || `https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&auto=format&fit=crop`,
    publishedAt: item.publishedAt || new Date().toISOString(),
    source: item.source,
    category,
    author: item.author,
    engagement: {
      views: item.engagement?.views || Math.floor(Math.random() * 50000) + 1000,
      likes: item.engagement?.likes || Math.floor(Math.random() * 5000) + 100,
      comments: item.engagement?.comments || Math.floor(Math.random() * 1000) + 50,
      shares: item.engagement?.shares || Math.floor(Math.random() * 2000) + 100,
      trending: calculateTrendingScore(item.engagement),
    },
    tags: [category, item.source.toLowerCase()],
  };
}

export function deduplicateContent(items: NormalizedContent[]): NormalizedContent[] {
  const seen = new Set<string>();
  
  return items.filter(item => {
    const key = item.title.toLowerCase().trim();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function rankContent(items: NormalizedContent[]): NormalizedContent[] {
  return [...items].sort((a, b) => {
    // Sort by trending score first, then by date
    if (b.engagement.trending !== a.engagement.trending) {
      return b.engagement.trending - a.engagement.trending;
    }
    return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
  });
}
