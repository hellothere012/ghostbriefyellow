import { prisma } from '../lib/db.js';

export default async function handler(req, res) {
  try {
    if (req.method !== 'GET') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    // Get basic counts
    const [totalSignals, totalBriefs, activeFeeds] = await Promise.all([
      prisma.signal.count(),
      prisma.brief.count(),
      prisma.rSSFeed.count({ where: { isActive: true } })
    ]);

    // Get signals by escalation risk
    const escalationStats = await prisma.signal.groupBy({
      by: ['escalationRisk'],
      _count: {
        escalationRisk: true
      }
    });

    // Get recent signals (last 24 hours)
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const recentSignals = await prisma.signal.count({
      where: {
        createdAt: {
          gte: twentyFourHoursAgo
        }
      }
    });

    // Get signals by category
    const categoryStats = await prisma.signal.findMany({
      select: {
        category: true
      }
    });

    // Process category data
    const categoryCount = {};
    categoryStats.forEach(signal => {
      signal.category.forEach(cat => {
        categoryCount[cat] = (categoryCount[cat] || 0) + 1;
      });
    });

    // Get top regions
    const regionStats = await prisma.signal.findMany({
      select: {
        region: true
      }
    });

    const regionCount = {};
    regionStats.forEach(signal => {
      signal.region.forEach(reg => {
        regionCount[reg] = (regionCount[reg] || 0) + 1;
      });
    });

    // Get average signal score
    const averageScore = await prisma.signal.aggregate({
      _avg: {
        signalScore: true
      }
    });

    // Get feed health
    const feedHealth = await prisma.rSSFeed.findMany({
      select: {
        name: true,
        status: true,
        errorCount: true,
        lastFetched: true
      },
      where: {
        isActive: true
      }
    });

    const healthyFeeds = feedHealth.filter(feed => feed.status === 'active').length;
    const errorFeeds = feedHealth.filter(feed => feed.status === 'error').length;

    res.status(200).json({
      success: true,
      stats: {
        overview: {
          totalSignals,
          totalBriefs,
          activeFeeds,
          recentSignals,
          averageScore: Math.round(averageScore._avg.signalScore || 0)
        },
        escalation: escalationStats.reduce((acc, item) => {
          acc[item.escalationRisk] = item._count.escalationRisk;
          return acc;
        }, {}),
        categories: categoryCount,
        regions: regionCount,
        feedHealth: {
          healthy: healthyFeeds,
          errors: errorFeeds,
          total: activeFeeds
        }
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Stats API error:', error);
    res.status(500).json({ 
      error: 'Internal server error', 
      message: error.message 
    });
  }
}