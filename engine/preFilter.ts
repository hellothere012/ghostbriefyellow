interface Article {
  title: string;
  link: string;
  pubDate: string;
  content: string;
  creator?: string;
  categories?: string[];
}

// Intelligence keywords for pre-filtering
const INTELLIGENCE_KEYWORDS = [
  // Critical
  'nuclear', 'weapon', 'attack', 'cyber', 'breach', 'classified', 'military', 'bioweapon',
  // High Priority
  'sanctions', 'deployment', 'missile', 'surveillance', 'intelligence', 'espionage',
  // Geopolitical
  'china', 'russia', 'iran', 'north korea', 'taiwan', 'ukraine', 'syria',
  // Technology
  'artificial intelligence', 'quantum', 'hypersonic', 'satellite', 'blockchain',
  // Health/Bio
  'outbreak', 'pandemic', 'vaccine', 'virus', 'epidemic'
];

// Filter out advertisements and low-quality content
const AD_INDICATORS = [
  'sponsored', 'advertisement', 'promo', 'deal', 'discount', 'sale',
  'affiliate', 'partner content', 'sponsored content'
];

export function preFilterBeforeClaude(articles: Article[]): Article[] {
  return articles.filter(article => {
    // Filter out advertisements
    const titleLower = article.title.toLowerCase();
    const contentLower = article.content.toLowerCase();
    
    const isAd = AD_INDICATORS.some(indicator => 
      titleLower.includes(indicator) || contentLower.includes(indicator)
    );
    
    if (isAd) {
      console.log(`🚫 Filtered out advertisement: ${article.title}`);
      return false;
    }
    
    // Check for intelligence relevance
    const hasIntelligenceKeywords = INTELLIGENCE_KEYWORDS.some(keyword =>
      titleLower.includes(keyword) || contentLower.includes(keyword)
    );
    
    // Minimum content length requirement
    const hasMinimumContent = article.content.length > 100;
    
    // Must have either intelligence keywords or be substantial content
    const isRelevant = hasIntelligenceKeywords || (hasMinimumContent && article.content.length > 500);
    
    if (!isRelevant) {
      console.log(`📊 Filtered out low-relevance: ${article.title}`);
      return false;
    }
    
    return true;
  });
}