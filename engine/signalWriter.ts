const { prisma } = require('../lib/db');

interface AnalyzedSignal {
  title: string;
  summary: string;
  content: string;
  sourceUrl: string;
  sourceType: string;
  escalationRisk: string;
  credibility: number;
  signalScore: number;
  category: string[];
  region: string[];
}

export async function storeSignals(signals: AnalyzedSignal[]): Promise<void> {
  try {
    console.log(`💾 Storing ${signals.length} signals to database...`);
    
    for (const signal of signals) {
      try {
        // Check if signal already exists
        const existingSignal = await prisma.signal.findUnique({
          where: { sourceUrl: signal.sourceUrl }
        });
        
        if (existingSignal) {
          console.log(`⏭️ Signal already exists, skipping: ${signal.title}`);
          continue;
        }
        
        // Create new signal
        await prisma.signal.create({
          data: {
            title: signal.title,
            summary: signal.summary,
            content: signal.content,
            sourceUrl: signal.sourceUrl,
            sourceType: signal.sourceType,
            escalationRisk: signal.escalationRisk,
            credibility: signal.credibility,
            signalScore: signal.signalScore,
            category: signal.category,
            region: signal.region
          }
        });
        
        console.log(`✅ Stored signal: ${signal.title}`);
        
      } catch (error) {
        console.error(`❌ Error storing signal: ${signal.title}`, error);
        continue;
      }
    }
    
    console.log(`💾 Successfully stored signals to database`);
    
  } catch (error) {
    console.error('❌ Database error in storeSignals:', error);
    throw error;
  }
}