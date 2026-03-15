import { VercelRequest, VercelResponse } from '@vercel/node';
import { getByCategory } from '../lib/aggregator';

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
    const { category } = req.query;
    const { limit = '20' } = req.query;

    if (!category || typeof category !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Category parameter is required',
      });
    }

    const validCategories = [
      'tech', 'technology',
      'business',
      'entertainment',
      'sports',
      'science',
      'health',
      'culture',
      'gaming',
      'anime',
      'viral',
      'trending',
      'general'
    ];

    if (!validCategories.includes(category.toLowerCase())) {
      return res.status(400).json({
        success: false,
        error: 'Invalid category',
        validCategories,
      });
    }

    const items = await getByCategory(
      category,
      parseInt(String(limit), 10)
    );

    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');

    return res.status(200).json({
      success: true,
      category,
      items,
      total: items.length,
      meta: {
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Category API error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch category content',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
