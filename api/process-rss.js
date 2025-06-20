import { fetchArticlesFromFeed } from '../engine/rssFetcher.js';
import { preFilterBeforeClaude } from '../engine/preFilter.js';
import { analyzeWithClaude } from '../engine/claudeClient.js';
import { storeSignals } from '../engine/signalWriter.js';
import { getLastSeenUrl, updateLastSeenUrl } from '../engine/feedTracker.js';

const FEEDS = [
  { id: 'defense-news', url: 'https://www.defensenews.com/rss/' },
  { id: 'military-com', url: 'https://www.military.com/rss/news' },
  { id: 'breaking-defense', url: 'https://breakingdefense.com/feed/' },
  { id: 'war-on-rocks', url: 'https://warontherocks.com/feed/' },
  { id: 'defense-one', url: 'https://www.defenseone.com/rss/' },
  { id: 'ars-technica', url: 'https://feeds.arstechnica.com/arstechnica/index' },
  { id: 'hacker-news-feed', url: 'https://feeds.feedburner.com/TheHackersNews' },
  { id: 'mit-tech-review', url: 'https://www.technologyreview.com/feed/' }
];

async function processFeed(feed) {
  try {
    const articles = await fetchArticlesFromFeed(feed.url);
    const lastSeen = await getLastSeenUrl(feed.id);

    const newArticles = [];
    for (const article of articles) {
      if (article.link === lastSeen) break;
      newArticles.push(article);
    }

    if (newArticles.length === 0) {
      return { feedId: feed.id, processed: 0, newArticles: 0 };
    }

    const filtered = preFilterBeforeClaude(newArticles);
    const analyzed = await analyzeWithClaude(filtered);
    await storeSignals(analyzed);

    if (newArticles[0]) {
      await updateLastSeenUrl(feed.id, newArticles[0].link);
    }

    return { 
      feedId: feed.id, 
      processed: analyzed.length, 
      newArticles: newArticles.length 
    };
  } catch (error) {
    console.error(`Error processing feed ${feed.id}:`, error);
    return { feedId: feed.id, processed: 0, newArticles: 0, error: error.message };
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const results = [];
    
    for (const feed of FEEDS) {
      const result = await processFeed(feed);
      results.push(result);
      
      // Rate limiting between feeds
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    const totalProcessed = results.reduce((sum, r) => sum + r.processed, 0);
    const totalNewArticles = results.reduce((sum, r) => sum + r.newArticles, 0);

    res.status(200).json({
      success: true,
      message: `Processed ${totalNewArticles} new articles, found ${totalProcessed} intelligence signals`,
      results,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('RSS processing error:', error);
    res.status(500).json({ 
      error: 'Internal server error', 
      message: error.message 
    });
  }
} 