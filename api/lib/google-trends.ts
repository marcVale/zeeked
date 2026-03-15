import type { RawContentItem } from './content-types';

// Google Trends RSS feed (unofficial but stable)
const TRENDS_RSS_URLS = [
  { url: 'https://trends.google.com/trends/trendingsearches/daily/rss?geo=US', region: 'US' },
  { url: 'https://trends.google.com/trends/trendingsearches/daily/rss?geo=GB', region: 'UK' },
  { url: 'https://trends.google.com/trends/trendingsearches/daily/rss?geo=CA', region: 'CA' },
  { url: 'https://trends.google.com/trends/trendingsearches/daily/rss?geo=AU', region: 'AU' },
  { url: 'https://trends.google.com/trends/trendingsearches/daily/rss?geo=IN', region: 'IN' },
  { url: 'https://trends.google.com/trends/trendingsearches/daily/rss?geo=DE', region: 'DE' },
  { url: 'https://trends.google.com/trends/trendingsearches/daily/rss?geo=FR', region: 'FR' },
  { url: 'https://trends.google.com/trends/trendingsearches/daily/rss?geo=JP', region: 'JP' },
  { url: 'https://trends.google.com/trends/trendingsearches/daily/rss?geo=BR', region: 'BR' },
];

interface TrendItem {
  title: string;
  traffic?: string;
  picture?: string;
  pubDate?: string;
  newsItems?: Array<{
    title: string;
    url: string;
    source: string;
  }>;
}

async function parseTrendsRSS(feedUrl: string): Promise<TrendItem[]> {
  try {
    const response = await fetch(feedUrl, {
      headers: {
        'User-Agent': 'ZeekedBot/1.0',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch trends: ${response.status}`);
    }

    const xml = await response.text();
    const items: TrendItem[] = [];

    // Parse items from RSS
    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    let match;

    while ((match = itemRegex.exec(xml)) !== null) {
      const itemXml = match[1];
      
      const title = itemXml.match(/<title>(?:<!\[CDATA\[)?([^<\]]+)(?:\]\]>)?<\/title>/)?.[1]?.trim();
      const traffic = itemXml.match(/<ht:approx_traffic>([^<]+)<\/ht:approx_traffic>/)?.[1];
      const picture = itemXml.match(/<ht:picture>([^<]+)<\/ht:picture>/)?.[1];
      const pubDate = itemXml.match(/<pubDate>([^<]+)<\/pubDate>/)?.[1];

      // Parse news items
      const newsItems: Array<{ title: string; url: string; source: string }> = [];
      const newsItemRegex = /<ht:news_item>([\s\S]*?)<\/ht:news_item>/g;
      let newsMatch;

      while ((newsMatch = newsItemRegex.exec(itemXml)) !== null) {
        const newsXml = newsMatch[1];
        const newsTitle = newsXml.match(/<ht:news_item_title>(?:<!\[CDATA\[)?([^<\]]+)(?:\]\]>)?<\/ht:news_item_title>/)?.[1]?.trim();
        const newsUrl = newsXml.match(/<ht:news_item_url>([^<]+)<\/ht:news_item_url>/)?.[1]?.trim();
        const newsSource = newsXml.match(/<ht:news_item_source>(?:<!\[CDATA\[)?([^<\]]+)(?:\]\]>)?<\/ht:news_item_source>/)?.[1]?.trim();

        if (newsTitle && newsUrl) {
          newsItems.push({ title: newsTitle, url: newsUrl, source: newsSource || 'News' });
        }
      }

      if (title) {
        items.push({ title, traffic, picture, pubDate, newsItems });
      }
    }

    return items;
  } catch (error) {
    console.error(`Error parsing trends RSS:`, error);
    return [];
  }
}

export async function fetchGoogleTrends(): Promise<RawContentItem[]> {
  const allItems: RawContentItem[] = [];

  const fetchPromises = TRENDS_RSS_URLS.map(async (trendSource) => {
    try {
      const trends = await parseTrendsRSS(trendSource.url);
      
      const items = trends.slice(0, 10).flatMap((trend): RawContentItem[] => {
        // Create content items from news items if available, otherwise from trend itself
        if (trend.newsItems && trend.newsItems.length > 0) {
          return trend.newsItems.slice(0, 3).map((news, idx): RawContentItem => ({
            id: '',
            title: news.title,
            description: `Trending: ${trend.title}${trend.traffic ? ` (${trend.traffic} searches)` : ''}`,
            url: news.url,
            image: idx === 0 ? trend.picture : undefined,
            publishedAt: trend.pubDate ? new Date(trend.pubDate).toISOString() : new Date().toISOString(),
            source: news.source,
            category: 'trending',
            engagement: {
              views: parseInt(trend.traffic?.replace(/[^0-9]/g, '') || '0') * 1000,
            },
          }));
        }

        // Fallback: create item from trend itself
        return [{
          id: '',
          title: trend.title,
          description: `Trending search${trend.traffic ? ` with ${trend.traffic} searches` : ''}`,
          url: `https://www.google.com/search?q=${encodeURIComponent(trend.title)}`,
          image: trend.picture,
          publishedAt: trend.pubDate ? new Date(trend.pubDate).toISOString() : new Date().toISOString(),
          source: 'Google Trends',
          category: 'trending',
          engagement: {
            views: parseInt(trend.traffic?.replace(/[^0-9]/g, '') || '0') * 1000,
          },
        }];
      });

      allItems.push(...items);
    } catch (error) {
      console.error(`Error fetching trends for ${trendSource.region}:`, error);
    }
  });

  await Promise.all(fetchPromises);
  return allItems;
}
