import { fetchRSSFeeds } from './rss-parser';
import { fetchRedditPosts } from './reddit-fetcher';
import { fetchHackerNews } from './hackernews';
import { fetchGoogleTrends } from './google-trends';
import { fetchTopAnime, fetchSeasonalAnime } from './jikan-anime';
import { fetchPopularGames, fetchNewReleases } from './rawg-gaming';
import { normalizeContent, deduplicateContent, rankContent } from './normalizer';
import { cache } from './cache';
import type { NormalizedContent } from './content-types';

const CACHE_KEY = 'aggregated_content';
const CACHE_TTL = 30 * 60 * 1000; // 30 minutes

interface AggregationOptions {
  category?: string;
  country?: string;
  limit?: number;
  offset?: number;
}

export async function aggregateAllContent(): Promise<NormalizedContent[]> {
  // Check cache first
  const cached = cache.get<NormalizedContent[]>(CACHE_KEY);
  if (cached) {
    console.log('Returning cached content');
    return cached;
  }

  console.log('Fetching fresh content from all sources...');

  // Fetch from all sources in parallel
  const [
    rssItems,
    redditItems,
    hnItems,
    trendsItems,
    animeItems,
    seasonalAnime,
    gameItems,
    newGames,
  ] = await Promise.all([
    fetchRSSFeeds(),
    fetchRedditPosts(),
    fetchHackerNews(),
    fetchGoogleTrends(),
    fetchTopAnime(),
    fetchSeasonalAnime(),
    fetchPopularGames(),
    fetchNewReleases(),
  ]);

  // Combine all raw content
  const allRawContent = [
    ...rssItems,
    ...redditItems,
    ...hnItems,
    ...trendsItems,
    ...animeItems,
    ...seasonalAnime,
    ...gameItems,
    ...newGames,
  ];

  console.log(`Fetched ${allRawContent.length} raw items`);

  // Normalize, deduplicate, and rank
  const normalized = allRawContent.map(normalizeContent);
  const deduplicated = deduplicateContent(normalized);
  const ranked = rankContent(deduplicated);

  console.log(`Processed ${ranked.length} unique items`);

  // Cache the results
  cache.set(CACHE_KEY, ranked, CACHE_TTL);

  return ranked;
}

export async function getContent(options: AggregationOptions = {}): Promise<{
  items: NormalizedContent[];
  total: number;
  hasMore: boolean;
}> {
  const allContent = await aggregateAllContent();
  
  let filtered = allContent;

  // Filter by category
  if (options.category && options.category !== 'all') {
    filtered = filtered.filter(item => 
      item.category.toLowerCase() === options.category?.toLowerCase() ||
      item.tags.includes(options.category!.toLowerCase())
    );
  }

  // Filter by country (if implemented)
  if (options.country && options.country !== 'global') {
    filtered = filtered.filter(item => 
      item.country?.toLowerCase() === options.country?.toLowerCase()
    );
  }

  // Pagination
  const offset = options.offset || 0;
  const limit = options.limit || 20;
  const paginated = filtered.slice(offset, offset + limit);
  const hasMore = offset + limit < filtered.length;

  return {
    items: paginated,
    total: filtered.length,
    hasMore,
  };
}

export async function getTrending(limit: number = 10): Promise<NormalizedContent[]> {
  const allContent = await aggregateAllContent();
  return allContent
    .sort((a, b) => b.engagement.trending - a.engagement.trending)
    .slice(0, limit);
}

export async function getByCategory(category: string, limit: number = 20): Promise<NormalizedContent[]> {
  const allContent = await aggregateAllContent();
  return allContent
    .filter(item => item.category === category || item.tags.includes(category))
    .slice(0, limit);
}

export async function searchContent(query: string, limit: number = 20): Promise<NormalizedContent[]> {
  const allContent = await aggregateAllContent();
  const lowerQuery = query.toLowerCase();
  
  return allContent
    .filter(item => 
      item.title.toLowerCase().includes(lowerQuery) ||
      item.excerpt.toLowerCase().includes(lowerQuery) ||
      item.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    )
    .slice(0, limit);
}

export function clearCache(): void {
  cache.delete(CACHE_KEY);
}
