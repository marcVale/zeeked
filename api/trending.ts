import { VercelRequest, VercelResponse } from '@vercel/node';
import { getTrending } from './lib/aggregator';

export default async function handler(req: VercelRequest, res: VercelResponse) {
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
    const { limit = '20', type = 'all' } = req.query;

    const items = await getTrending(parseInt(String(limit), 10));

    // Filter by type if specified
    let filtered = items;
    if (type !== 'all') {
      filtered = items.filter(item => item.category === type);
    }

    res.setHeader('Cache-Control', 's-maxage=180, stale-while-revalidate=300');

    return res.status(200).json({
      success: true,
      items: filtered,
      total: filtered.length,
      meta: {
        timestamp: new Date().toISOString(),
        type,
      },
    });
  } catch (error) {
    console.error('Trending API error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch trending content',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
