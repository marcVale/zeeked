import { VercelRequest, VercelResponse } from '@vercel/node';
import { aggregateAllContent, clearCache } from '../lib/aggregator';

// This endpoint is called by Vercel Cron to refresh content
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Verify cron secret if configured
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && req.headers.authorization !== `Bearer ${cronSecret}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('Starting scheduled content update...');
    const startTime = Date.now();

    // Clear cache to force fresh fetch
    clearCache();

    // Fetch fresh content
    const content = await aggregateAllContent();

    const duration = Date.now() - startTime;

    console.log(`Content update completed in ${duration}ms. Fetched ${content.length} items.`);

    return res.status(200).json({
      success: true,
      message: 'Content updated successfully',
      itemsUpdated: content.length,
      duration: `${duration}ms`,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Cron update failed:', error);
    return res.status(500).json({
      success: false,
      error: 'Content update failed',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
