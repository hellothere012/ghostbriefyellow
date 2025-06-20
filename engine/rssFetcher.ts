const Parser = require('rss-parser');

interface Article {
  title: string;
  link: string;
  pubDate: string;
  content: string;
  creator?: string;
  categories?: string[];
}

const parser = new Parser({
  customFields: {
    item: ['content:encoded', 'dc:creator']
  }
});

export async function fetchArticlesFromFeed(feedUrl: string): Promise<Article[]> {
  try {
    console.log(`🌐 Fetching RSS feed: ${feedUrl}`);
    
    const feed = await parser.parseURL(feedUrl);
    
    const articles: Article[] = feed.items.map(item => ({
      title: item.title || 'Untitled',
      link: item.link || '',
      pubDate: item.pubDate || new Date().toISOString(),
      content: item['content:encoded'] || item.contentSnippet || item.content || '',
      creator: item['dc:creator'] || item.creator,
      categories: item.categories || []
    }));

    console.log(`📰 Fetched ${articles.length} articles from ${feedUrl}`);
    return articles;
    
  } catch (error) {
    console.error(`❌ Error fetching RSS feed ${feedUrl}:`, error);
    throw new Error(`Failed to fetch RSS feed: ${error.message}`);
  }
}