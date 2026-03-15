import { VercelRequest, VercelResponse } from '@vercel/node';
import { aggregateAllContent } from '../lib/aggregator';

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
    const { id } = req.query;

    if (!id || typeof id !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Content ID is required',
      });
    }

    const allContent = await aggregateAllContent();
    const item = allContent.find(c => c.id === id);

    if (!item) {
      return res.status(404).json({
        success: false,
        error: 'Content not found',
      });
    }

    // Get related content
    const related = allContent
      .filter(c => c.id !== id && (c.category === item.category || c.tags.some(t => item.tags.includes(t))))
      .slice(0, 5);

    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');

    return res.status(200).json({
      success: true,
      item,
      related,
      meta: {
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Content API error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch content',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
