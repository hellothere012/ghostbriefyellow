import Parser from 'rss-parser';

const parser = new Parser();

// Optional proxy configuration
const PROXY_CONFIG = {
  username: process.env.WEBSHARE_PROXY_USERNAME,
  password: process.env.WEBSHARE_PROXY_PASSWORD,
  url: process.env.WEBSHARE_PROXY_URL
};

export async function fetchArticlesFromFeed(feedUrl: string): Promise<any[]> {
  try {
    let feed;
    
    if (PROXY_CONFIG.username && PROXY_CONFIG.password) {
      // Use proxy for fetching
      const proxyUrl = `http://${PROXY_CONFIG.username}:${PROXY_CONFIG.password}@${PROXY_CONFIG.url.replace('http://', '')}`;
      
      feed = await parser.parseURL(feedUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        },
        proxy: proxyUrl
      });
    } else {
      // Direct fetch
      feed = await parser.parseURL(feedUrl);
    }
    
    return feed.items.map(item => ({
      title: item.title || '',
      link: item.link || '',
      pubDate: item.pubDate || '',
      summary: item.contentSnippet || '',
    }));
  } catch (error) {
    console.error(`Error fetching RSS feed ${feedUrl}:`, error);
    throw new Error(`Failed to fetch RSS feed: ${error.message}`);
  }
} 