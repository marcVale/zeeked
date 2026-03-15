import { VercelRequest, VercelResponse } from '@vercel/node';
import { aggregateAllContent } from './lib/aggregator';
import { cache } from './lib/cache';

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
    const allContent = await aggregateAllContent();

    // Calculate stats
    const categoryCounts: Record<string, number> = {};
    const sourceCounts: Record<string, number> = {};
    let totalEngagement = 0;

    allContent.forEach(item => {
      categoryCounts[item.category] = (categoryCounts[item.category] || 0) + 1;
      sourceCounts[item.source] = (sourceCounts[item.source] || 0) + 1;
      totalEngagement += item.engagement.views + item.engagement.likes + item.engagement.comments;
    });

    const topCategories = Object.entries(categoryCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);

    const topSources = Object.entries(sourceCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);

    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');

    return res.status(200).json({
      success: true,
      stats: {
        totalContent: allContent.length,
        totalEngagement,
        topCategories,
        topSources,
        cacheSize: cache.size(),
        lastUpdated: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Stats API error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch stats',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
