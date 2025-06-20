const { prisma } = require('../lib/db.js');

const DEFAULT_FEEDS = [
  {
    name: 'Defense News',
    url: 'https://www.defensenews.com/rss/',
    category: 'MILITARY',
    tags: ['DEFENSE', 'MILITARY', 'WEAPONS'],
    credibilityScore: 95
  },
  {
    name: 'Military.com',
    url: 'https://www.military.com/rss/news',
    category: 'MILITARY',
    tags: ['MILITARY', 'VETERANS', 'DEFENSE'],
    credibilityScore: 90
  },
  {
    name: 'Breaking Defense',
    url: 'https://breakingdefense.com/feed/',
    category: 'MILITARY',
    tags: ['DEFENSE', 'BREAKING', 'MILITARY'],
    credibilityScore: 92
  },
  {
    name: 'War on the Rocks',
    url: 'https://warontherocks.com/feed/',
    category: 'MILITARY',
    tags: ['STRATEGY', 'ANALYSIS', 'MILITARY'],
    credibilityScore: 94
  },
  {
    name: 'Defense One',
    url: 'https://www.defenseone.com/rss/',
    category: 'MILITARY',
    tags: ['DEFENSE', 'TECHNOLOGY', 'POLICY'],
    credibilityScore: 93
  },
  {
    name: 'Ars Technica',
    url: 'https://feeds.arstechnica.com/arstechnica/index',
    category: 'TECHNOLOGY',
    tags: ['TECHNOLOGY', 'SCIENCE', 'CYBERSECURITY'],
    credibilityScore: 88
  },
  {
    name: 'The Hacker News',
    url: 'https://feeds.feedburner.com/TheHackersNews',
    category: 'CYBERSECURITY',
    tags: ['CYBERSECURITY', 'HACKING', 'SECURITY'],
    credibilityScore: 85
  },
  {
    name: 'MIT Technology Review',
    url: 'https://www.technologyreview.com/feed/',
    category: 'TECHNOLOGY',
    tags: ['TECHNOLOGY', 'RESEARCH', 'INNOVATION'],
    credibilityScore: 96
  }
];

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const feeds = await prisma.rSSFeed.findMany({
        orderBy: {
          addedAt: 'desc'
        }
      });

      res.status(200).json({
        success: true,
        feeds
      });

    } else if (req.method === 'POST') {
      const { action, ...feedData } = req.body;
      
      if (action === 'initialize') {
        // Initialize default feeds
        const createdFeeds = [];
        
        for (const feedConfig of DEFAULT_FEEDS) {
          try {
            const existingFeed = await prisma.rSSFeed.findUnique({
              where: { url: feedConfig.url }
            });
            
            if (!existingFeed) {
              const feed = await prisma.rSSFeed.create({
                data: feedConfig
              });
              createdFeeds.push(feed);
            }
          } catch (error) {
            console.error(`Error creating feed ${feedConfig.name}:`, error);
          }
        }
        
        res.status(200).json({
          success: true,
          message: `Initialized ${createdFeeds.length} default feeds`,
          feeds: createdFeeds
        });
        
      } else {
        // Create new feed
        const feed = await prisma.rSSFeed.create({
          data: {
            name: feedData.name,
            url: feedData.url,
            category: feedData.category,
            tags: feedData.tags || [],
            credibilityScore: feedData.credibilityScore || 70,
            isActive: feedData.isActive !== false
          }
        });

        res.status(201).json({
          success: true,
          feed
        });
      }

    } else if (req.method === 'PUT') {
      const { id, ...updateData } = req.body;
      
      const feed = await prisma.rSSFeed.update({
        where: { id },
        data: updateData
      });

      res.status(200).json({
        success: true,
        feed
      });

    } else if (req.method === 'DELETE') {
      const { id } = req.query;
      
      await prisma.rSSFeed.delete({
        where: { id }
      });

      res.status(200).json({
        success: true,
        message: 'Feed deleted successfully'
      });

    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }

  } catch (error) {
    console.error('Feeds API error:', error);
    res.status(500).json({ 
      error: 'Internal server error', 
      message: error.message 
    });
  }
}