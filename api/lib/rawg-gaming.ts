import type { RawContentItem } from './content-types';

// RAWG API - Free tier available (requires API key for production)
const RAWG_BASE_URL = 'https://api.rawg.io/api';

// For demo purposes - in production, use environment variable
const RAWG_API_KEY = process.env.RAWG_API_KEY || 'demo';

interface RAWGGame {
  id: number;
  name: string;
  description?: string;
  slug: string;
  background_image?: string;
  released?: string;
  rating?: number;
  ratings_count?: number;
  added?: number;
  genres?: Array<{ name: string }>;
  platforms?: Array<{ platform: { name: string } }>;
}

export async function fetchPopularGames(): Promise<RawContentItem[]> {
  try {
    const response = await fetch(
      `${RAWG_BASE_URL}/games?key=${RAWG_API_KEY}&ordering=-added&page_size=20`,
      {
        headers: {
          'User-Agent': 'ZeekedBot/1.0',
        },
      }
    );

    if (!response.ok) {
      // Fallback: return mock data if API fails
      if (response.status === 401) {
        console.log('RAWG API key not configured, using fallback');
        return getFallbackGamingContent();
      }
      throw new Error(`RAWG API error: ${response.status}`);
    }

    const data = await response.json();
    const games: RAWGGame[] = data.results || [];

    return games.map((game): RawContentItem => ({
      id: `game-${game.id}`,
      title: game.name,
      description: game.description?.replace(/<[^>]*>/g, '').slice(0, 300) || 
                   `${game.genres?.map(g => g.name).join(', ')} game`,
      url: `https://rawg.io/games/${game.slug}`,
      image: game.background_image || '',
      publishedAt: game.released || new Date().toISOString(),
      source: 'RAWG',
      category: 'gaming',
      engagement: {
        likes: Math.floor((game.rating || 0) * 1000),
        views: game.added || 0,
        comments: game.ratings_count || 0,
      },
    }));
  } catch (error) {
    console.error('Error fetching games:', error);
    return getFallbackGamingContent();
  }
}

export async function fetchNewReleases(): Promise<RawContentItem[]> {
  try {
    const today = new Date().toISOString().split('T')[0];
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const response = await fetch(
      `${RAWG_BASE_URL}/games?key=${RAWG_API_KEY}&dates=${thirtyDaysAgo},${today}&ordering=-released&page_size=15`,
      {
        headers: {
          'User-Agent': 'ZeekedBot/1.0',
        },
      }
    );

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    const games: RAWGGame[] = data.results || [];

    return games.map((game): RawContentItem => ({
      id: `new-${game.id}`,
      title: `New: ${game.name}`,
      description: 'Recently released game',
      url: `https://rawg.io/games/${game.slug}`,
      image: game.background_image || '',
      publishedAt: game.released || new Date().toISOString(),
      source: 'RAWG',
      category: 'gaming',
      engagement: {
        likes: Math.floor((game.rating || 0) * 1000),
        views: game.added || 0,
      },
    }));
  } catch (error) {
    console.error('Error fetching new releases:', error);
    return [];
  }
}

// Fallback content when API is unavailable
function getFallbackGamingContent(): RawContentItem[] {
  const games = [
    { name: 'The Witcher 3', genre: 'RPG', image: 'witcher' },
    { name: 'Elden Ring', genre: 'Action RPG', image: 'elden' },
    { name: 'God of War', genre: 'Action', image: 'gow' },
    { name: 'Cyberpunk 2077', genre: 'RPG', image: 'cyberpunk' },
    { name: 'Red Dead Redemption 2', genre: 'Adventure', image: 'rdr2' },
    { name: 'Zelda: Tears of the Kingdom', genre: 'Adventure', image: 'zelda' },
    { name: 'Baldur\'s Gate 3', genre: 'RPG', image: 'baldurs' },
    { name: 'Spider-Man 2', genre: 'Action', image: 'spiderman' },
  ];

  return games.map((game, i): RawContentItem => ({
    id: `fallback-game-${i}`,
    title: game.name,
    description: `Popular ${game.genre} game trending in the gaming community.`,
    url: `https://rawg.io/search?query=${encodeURIComponent(game.name)}`,
    image: `https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop`,
    publishedAt: new Date().toISOString(),
    source: 'Gaming Trends',
    category: 'gaming',
    engagement: {
      views: Math.floor(Math.random() * 100000) + 50000,
      likes: Math.floor(Math.random() * 10000) + 5000,
    },
  }));
}
