import { VercelRequest, VercelResponse } from '@vercel/node';
import { getContent, getTrending, searchContent } from './lib/aggregator';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { 
      category, 
      country, 
      limit = '20', 
      offset = '0',
      search,
      trending 
    } = req.query;

    let result;

    if (search) {
      // Search endpoint
      const items = await searchContent(
        String(search), 
        parseInt(String(limit), 10)
      );
      result = { items, total: items.length, hasMore: false };
    } else if (trending === 'true') {
      // Trending endpoint
      const items = await getTrending(parseInt(String(limit), 10));
      result = { items, total: items.length, hasMore: false };
    } else {
      // Regular feed
      result = await getContent({
        category: category ? String(category) : undefined,
        country: country ? String(country) : undefined,
        limit: parseInt(String(limit), 10),
        offset: parseInt(String(offset), 10),
      });
    }

    // Add cache headers
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');

    return res.status(200).json({
      success: true,
      ...result,
      meta: {
        timestamp: new Date().toISOString(),
        params: { category, country, limit, offset, search, trending },
      },
    });
  } catch (error) {
    console.error('Feed API error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch content',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
