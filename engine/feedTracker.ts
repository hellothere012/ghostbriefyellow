const { prisma } = require('../lib/db');

export async function getLastSeenUrl(feedId: string): Promise<string | null> {
  try {
    const tracking = await prisma.feedTracking.findUnique({
      where: { feedId }
    });
    
    return tracking?.lastSeenUrl || null;
    
  } catch (error) {
    console.error(`❌ Error getting last seen URL for feed ${feedId}:`, error);
    return null;
  }
}

export async function updateLastSeenUrl(feedId: string, url: string): Promise<void> {
  try {
    await prisma.feedTracking.upsert({
      where: { feedId },
      update: {
        lastSeenUrl: url,
        lastFetchedAt: new Date()
      },
      create: {
        feedId,
        lastSeenUrl: url,
        lastFetchedAt: new Date()
      }
    });
    
    console.log(`📅 Updated last seen URL for feed ${feedId}: ${url}`);
    
  } catch (error) {
    console.error(`❌ Error updating last seen URL for feed ${feedId}:`, error);
    throw error;
  }
}