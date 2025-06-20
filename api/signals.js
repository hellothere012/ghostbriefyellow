const { prisma } = require('../lib/db.js');

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const { 
        limit = 50, 
        offset = 0, 
        category, 
        escalationRisk, 
        minScore = 0 
      } = req.query;

      const where = {};
      
      if (category && category !== 'all') {
        where.category = {
          has: category
        };
      }
      
      if (escalationRisk && escalationRisk !== 'all') {
        where.escalationRisk = escalationRisk;
      }
      
      if (minScore > 0) {
        where.signalScore = {
          gte: parseFloat(minScore)
        };
      }

      const signals = await prisma.signal.findMany({
        where,
        orderBy: {
          createdAt: 'desc'
        },
        take: parseInt(limit),
        skip: parseInt(offset)
      });

      const total = await prisma.signal.count({ where });

      res.status(200).json({
        success: true,
        signals,
        total,
        hasMore: (parseInt(offset) + parseInt(limit)) < total
      });

    } else if (req.method === 'POST') {
      // Create new signal manually
      const signalData = req.body;
      
      const signal = await prisma.signal.create({
        data: {
          title: signalData.title,
          summary: signalData.summary,
          content: signalData.content,
          sourceUrl: signalData.sourceUrl,
          sourceType: signalData.sourceType || 'MANUAL',
          escalationRisk: signalData.escalationRisk || 'LOW',
          credibility: signalData.credibility || 50,
          signalScore: signalData.signalScore || 30,
          category: signalData.category || ['GENERAL'],
          region: signalData.region || []
        }
      });

      res.status(201).json({
        success: true,
        signal
      });

    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }

  } catch (error) {
    console.error('Signals API error:', error);
    res.status(500).json({ 
      error: 'Internal server error', 
      message: error.message 
    });
  }
}