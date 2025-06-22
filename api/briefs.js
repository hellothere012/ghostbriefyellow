import { prisma } from '../lib/db.js';

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const { limit = 20, offset = 0 } = req.query;

      const briefs = await prisma.brief.findMany({
        orderBy: {
          createdAt: 'desc'
        },
        take: parseInt(limit),
        skip: parseInt(offset)
      });

      const total = await prisma.brief.count();

      res.status(200).json({
        success: true,
        briefs,
        total,
        hasMore: (parseInt(offset) + parseInt(limit)) < total
      });

    } else if (req.method === 'POST') {
      const briefData = req.body;
      
      const brief = await prisma.brief.create({
        data: {
          title: briefData.title,
          summary: briefData.summary,
          status: briefData.status || 'DRAFT',
          classification: briefData.classification || 'UNCLASSIFIED',
          keywords: briefData.keywords || [],
          version: briefData.version || 1,
          datePublished: briefData.datePublished ? new Date(briefData.datePublished) : null,
          relatedSignalIds: briefData.relatedSignalIds || []
        }
      });

      res.status(201).json({
        success: true,
        brief
      });

    } else if (req.method === 'PUT') {
      const { id, ...updateData } = req.body;
      
      const brief = await prisma.brief.update({
        where: { id },
        data: updateData
      });

      res.status(200).json({
        success: true,
        brief
      });

    } else if (req.method === 'DELETE') {
      const { id } = req.query;
      
      await prisma.brief.delete({
        where: { id }
      });

      res.status(200).json({
        success: true,
        message: 'Brief deleted successfully'
      });

    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }

  } catch (error) {
    console.error('Briefs API error:', error);
    res.status(500).json({ 
      error: 'Internal server error', 
      message: error.message 
    });
  }
}