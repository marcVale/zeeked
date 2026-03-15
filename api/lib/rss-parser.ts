import type { RawContentItem } from './content-types';

interface RSSItem {
  title: string;
  description?: string;
  link: string;
  pubDate?: string;
  enclosure?: { url: string };
  'media:content'?: { url: string };
}

interface RSSFeed {
  title: string;
  items: RSSItem[];
}

const RSS_SOURCES = [
  { url: 'https://feeds.bbci.co.uk/news/rss.xml', source: 'BBC News', category: 'general' },
  { url: 'https://rss.cnn.com/rss/edition.rss', source: 'CNN', category: 'general' },
  { url: 'https://feeds.reuters.com/reuters/topNews', source: 'Reuters', category: 'general' },
  { url: 'https://feeds.arstechnica.com/arstechnica/index', source: 'Ars Technica', category: 'tech' },
  { url: 'https://techcrunch.com/feed/', source: 'TechCrunch', category: 'tech' },
  { url: 'https://www.espn.com/espn/rss/news', source: 'ESPN', category: 'sports' },
  { url: 'https://feeds.skysports.com/feeds/11095', source: 'Sky Sports', category: 'sports' },
  { url: 'https://variety.com/feed/', source: 'Variety', category: 'entertainment' },
  { url: 'https://www.sciencemag.org/rss/news_current.xml', source: 'Science', category: 'science' },
];

async function parseRSSFeed(feedUrl: string): Promise<RSSFeed | null> {
  try {
    const response = await fetch(feedUrl, {
      headers: {
        'User-Agent': 'ZeekedBot/1.0',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch ${feedUrl}: ${response.status}`);
    }

    const xml = await response.text();
    
    // Simple XML parsing using regex (for Edge Function compatibility)
    const titleMatch = xml.match(/<title>([^<]+)<\/title>/);
    const title = titleMatch ? titleMatch[1] : 'Unknown Feed';

    const items: RSSItem[] = [];
    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    let match;

    while ((match = itemRegex.exec(xml)) !== null) {
      const itemXml = match[1];
      
      const itemTitle = itemXml.match(/<title>(?:<!\[CDATA\[)?([^<\]]+)(?:\]\]>)?<\/title>/)?.[1]?.trim();
      const itemDesc = itemXml.match(/<description>(?:<!\[CDATA\[)?([^<\]]+)(?:\]\]>)?<\/description>/)?.[1]?.trim();
      const itemLink = itemXml.match(/<link>([^<]+)<\/link>/)?.[1]?.trim();
      const itemPubDate = itemXml.match(/<pubDate>([^<]+)<\/pubDate>/)?.[1];
      
      // Try to find image
      let itemImage = itemXml.match(/<enclosure[^>]+url="([^"]+)"/)?.[1];
      if (!itemImage) {
        itemImage = itemXml.match(/<media:content[^>]+url="([^"]+)"/)?.[1];
      }

      if (itemTitle && itemLink) {
        items.push({
          title: itemTitle,
          description: itemDesc,
          link: itemLink,
          pubDate: itemPubDate,
          enclosure: itemImage ? { url: itemImage } : undefined,
        });
      }
    }

    return { title, items };
  } catch (error) {
    console.error(`Error parsing RSS feed ${feedUrl}:`, error);
    return null;
  }
}

export async function fetchRSSFeeds(): Promise<RawContentItem[]> {
  const allItems: RawContentItem[] = [];

  const fetchPromises = RSS_SOURCES.map(async (source) => {
    try {
      const feed = await parseRSSFeed(source.url);
      if (!feed) return;

      const items = feed.items.slice(0, 10).map((item): RawContentItem => ({
        id: '',
        title: item.title,
        description: item.description,
        url: item.link,
        image: item.enclosure?.url,
        publishedAt: item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString(),
        source: source.source,
        category: source.category,
      }));

      allItems.push(...items);
    } catch (error) {
      console.error(`Error fetching ${source.source}:`, error);
    }
  });

  await Promise.all(fetchPromises);
  return allItems;
}
