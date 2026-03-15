import type { RawContentItem } from './content-types';

// Jikan API - Free, unofficial MyAnimeList API (no API key required)
const JIKAN_BASE_URL = 'https://api.jikan.moe/v4';

interface JikanAnime {
  mal_id: number;
  title: string;
  synopsis?: string;
  url: string;
  images: {
    jpg: {
      large_image_url?: string;
      image_url?: string;
    };
  };
  aired: {
    from?: string;
  };
  score?: number;
  members?: number;
  type?: string;
  studios?: Array<{ name: string }>;
}

export async function fetchTopAnime(): Promise<RawContentItem[]> {
  try {
    // Add delay to respect rate limiting (3 requests per second)
    await new Promise(resolve => setTimeout(resolve, 350));

    const response = await fetch(`${JIKAN_BASE_URL}/top/anime?limit=25`, {
      headers: {
        'User-Agent': 'ZeekedBot/1.0',
      },
    });

    if (!response.ok) {
      throw new Error(`Jikan API error: ${response.status}`);
    }

    const data = await response.json();
    const animeList: JikanAnime[] = data.data || [];

    return animeList.map((anime): RawContentItem => ({
      id: `anime-${anime.mal_id}`,
      title: `${anime.title} ${anime.type ? `(${anime.type})` : ''}`,
      description: anime.synopsis?.slice(0, 300) || 'No synopsis available.',
      url: anime.url,
      image: anime.images.jpg.large_image_url || anime.images.jpg.image_url || '',
      publishedAt: anime.aired.from || new Date().toISOString(),
      source: 'MyAnimeList',
      category: 'anime',
      engagement: {
        likes: Math.floor((anime.score || 0) * 1000),
        views: anime.members || 0,
      },
    }));
  } catch (error) {
    console.error('Error fetching top anime:', error);
    return [];
  }
}

export async function fetchSeasonalAnime(): Promise<RawContentItem[]> {
  try {
    await new Promise(resolve => setTimeout(resolve, 350));

    const response = await fetch(`${JIKAN_BASE_URL}/seasons/now?limit=15`, {
      headers: {
        'User-Agent': 'ZeekedBot/1.0',
      },
    });

    if (!response.ok) {
      throw new Error(`Jikan API error: ${response.status}`);
    }

    const data = await response.json();
    const animeList: JikanAnime[] = data.data || [];

    return animeList.map((anime): RawContentItem => ({
      id: `seasonal-${anime.mal_id}`,
      title: `New: ${anime.title}`,
      description: anime.synopsis?.slice(0, 300) || 'Currently airing anime.',
      url: anime.url,
      image: anime.images.jpg.large_image_url || anime.images.jpg.image_url || '',
      publishedAt: anime.aired.from || new Date().toISOString(),
      source: 'MyAnimeList',
      category: 'anime',
      engagement: {
        likes: Math.floor((anime.score || 0) * 1000),
        views: anime.members || 0,
      },
    }));
  } catch (error) {
    console.error('Error fetching seasonal anime:', error);
    return [];
  }
}
