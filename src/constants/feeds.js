/**
 * RSS Feed Configuration Constants
 * Centralized configuration for premium RSS feeds and feed management
 */

// Premium RSS Feed Sources for Intelligence Gathering
export const PREMIUM_RSS_FEEDS = [
  // Military & Defense
  {
    id: 'defense-news',
    name: 'Defense News',
    url: 'https://www.defensenews.com/rss/',
    category: 'MILITARY',
    tags: ['DEFENSE', 'MILITARY', 'WEAPONS'],
    isActive: true,
    credibilityScore: 95
  },
  {
    id: 'janes-defence',
    name: "Jane's Defence Weekly",
    url: 'https://www.janes.com/feeds/defence-news',
    category: 'MILITARY',
    tags: ['DEFENSE', 'INTELLIGENCE', 'WEAPONS'],
    isActive: true,
    credibilityScore: 98
  },
  {
    id: 'military-com',
    name: 'Military.com News',
    url: 'https://www.military.com/rss/news',
    category: 'MILITARY',
    tags: ['MILITARY', 'VETERANS', 'DEFENSE'],
    isActive: true,
    credibilityScore: 90
  },
  {
    id: 'breaking-defense',
    name: 'Breaking Defense',
    url: 'https://breakingdefense.com/feed/',
    category: 'MILITARY',
    tags: ['DEFENSE', 'TECH', 'PROCUREMENT'],
    isActive: true,
    credibilityScore: 92
  },
  {
    id: 'war-on-rocks',
    name: 'War on the Rocks',
    url: 'https://warontherocks.com/feed/',
    category: 'MILITARY',
    tags: ['STRATEGY', 'ANALYSIS', 'GEOPOLITICS'],
    isActive: true,
    credibilityScore: 94
  },

  // Technology & Cybersecurity
  {
    id: 'ars-technica',
    name: 'Ars Technica',
    url: 'https://feeds.arstechnica.com/arstechnica/index',
    category: 'TECHNOLOGY',
    tags: ['TECH', 'CYBERSECURITY', 'AI'],
    isActive: true,
    credibilityScore: 96
  },
  {
    id: 'hacker-news-feed',
    name: 'The Hacker News',
    url: 'https://feeds.feedburner.com/TheHackersNews',
    category: 'CYBERSECURITY',
    tags: ['CYBER', 'HACKING', 'SECURITY'],
    isActive: true,
    credibilityScore: 93
  },
  {
    id: 'mit-tech-review',
    name: 'MIT Technology Review',
    url: 'https://www.technologyreview.com/feed/',
    category: 'TECHNOLOGY',
    tags: ['AI', 'QUANTUM', 'INNOVATION'],
    isActive: true,
    credibilityScore: 97
  },

  // Geopolitics & International
  {
    id: 'reuters-world',
    name: 'Reuters World News',
    url: 'https://feeds.reuters.com/reuters/worldNews',
    category: 'GEOPOLITICS',
    tags: ['WORLD', 'POLITICS', 'BREAKING'],
    isActive: true,
    credibilityScore: 98
  },
  {
    id: 'foreign-affairs',
    name: 'Foreign Affairs',
    url: 'https://www.foreignaffairs.com/rss',
    category: 'GEOPOLITICS',
    tags: ['DIPLOMACY', 'ANALYSIS', 'INTERNATIONAL'],
    isActive: true,
    credibilityScore: 96
  },
  {
    id: 'bbc-world',
    name: 'BBC World News',
    url: 'https://feeds.bbci.co.uk/news/world/rss.xml',
    category: 'GEOPOLITICS',
    tags: ['WORLD', 'BREAKING', 'INTERNATIONAL'],
    isActive: true,
    credibilityScore: 95
  },
  {
    id: 'ap-news',
    name: 'Associated Press',
    url: 'https://feeds.apnews.com/rss/international',
    category: 'GEOPOLITICS',
    tags: ['BREAKING', 'INTERNATIONAL', 'POLITICS'],
    isActive: true,
    credibilityScore: 97
  },

  // Finance & Economics
  {
    id: 'bloomberg-politics',
    name: 'Bloomberg Politics',
    url: 'https://feeds.bloomberg.com/politics/news.rss',
    category: 'FINANCE',
    tags: ['POLITICS', 'ECONOMICS', 'MARKETS'],
    isActive: true,
    credibilityScore: 94
  },
  {
    id: 'wsj-world',
    name: 'Wall Street Journal World',
    url: 'https://feeds.a.dj.com/rss/WSJWorldNews.xml',
    category: 'FINANCE',
    tags: ['ECONOMICS', 'INTERNATIONAL', 'MARKETS'],
    isActive: true,
    credibilityScore: 96
  },

  // Health & Science
  {
    id: 'science-news',
    name: 'Science News',
    url: 'https://www.sciencenews.org/feed',
    category: 'SCIENCE',
    tags: ['SCIENCE', 'RESEARCH', 'TECHNOLOGY'],
    isActive: true,
    credibilityScore: 92
  }
];

// Feed Categories and Metadata
export const FEED_CATEGORIES = {
  MILITARY: {
    name: 'Military & Defense',
    color: '#ff4444',
    icon: 'shield',
    priority: 1
  },
  TECHNOLOGY: {
    name: 'Technology',
    color: '#4444ff',
    icon: 'cpu',
    priority: 2
  },
  CYBERSECURITY: {
    name: 'Cybersecurity',
    color: '#ff8800',
    icon: 'lock',
    priority: 1
  },
  GEOPOLITICS: {
    name: 'Geopolitics',
    color: '#00aa44',
    icon: 'globe',
    priority: 1
  },
  FINANCE: {
    name: 'Finance & Economics',
    color: '#8844ff',
    icon: 'dollar',
    priority: 3
  },
  SCIENCE: {
    name: 'Science & Health',
    color: '#00aaaa',
    icon: 'microscope',
    priority: 2
  }
};

// Feed Health Monitoring
export const FEED_HEALTH = {
  STATUS_TYPES: {
    ACTIVE: 'active',
    WARNING: 'warning',
    ERROR: 'error',
    DISABLED: 'disabled'
  },
  HEALTH_THRESHOLDS: {
    ERROR_COUNT_WARNING: 3,
    ERROR_COUNT_CRITICAL: 5,
    STALE_HOURS_WARNING: 24,
    STALE_HOURS_CRITICAL: 48,
    SUCCESS_RATE_WARNING: 80,
    SUCCESS_RATE_CRITICAL: 60
  },
  MONITORING_INTERVALS: {
    HEALTH_CHECK_MS: 300000, // 5 minutes
    STATISTICS_UPDATE_MS: 900000, // 15 minutes
    CLEANUP_INTERVAL_MS: 3600000 // 1 hour
  }
};

// Advertisement Detection Patterns
export const AD_DETECTION_PATTERNS = [
  // URL patterns
  /doubleclick\.net/i,
  /googleadservices\.com/i,
  /googlesyndication\.com/i,
  /amazon-adsystem\.com/i,
  /facebook\.com\/tr/i,
  /adsystem\.amazon/i,
  
  // Content patterns
  /sponsored content/i,
  /advertisement/i,
  /promoted post/i,
  /affiliate link/i,
  /buy now/i,
  /limited time offer/i,
  /click here to/i,
  /% off/i,
  /free trial/i,
  /subscribe now/i
];

// Duplicate Detection Configuration
export const DUPLICATE_DETECTION = {
  titleSimilarityThreshold: 0.8,
  contentSimilarityThreshold: 0.7,
  timeWindowHours: 24,
  sourceDomainWeight: 0.3,
  keywordMatchWeight: 0.4,
  dateWeight: 0.3
};

// Feed Validation Rules
export const FEED_VALIDATION = {
  REQUIRED_FIELDS: ['id', 'name', 'url', 'category'],
  URL_PATTERNS: {
    RSS: /\.(rss|xml)$/i,
    FEED: /\/feed\/?$/i,
    ATOM: /\/atom\/?$/i
  },
  NAME_LENGTH: {
    MIN: 3,
    MAX: 100
  },
  CREDIBILITY_SCORE: {
    MIN: 0,
    MAX: 100,
    DEFAULT: 50
  }
};

// Feed Processing Configuration
export const FEED_PROCESSING = {
  TIMEOUT_MS: 15000,
  MAX_RETRIES: 3,
  RETRY_DELAY_MS: 2000,
  MAX_ARTICLES_PER_FEED: 50,
  BATCH_SIZE: 5,
  CONCURRENT_LIMIT: 3,
  USER_AGENT: 'Ghost Brief Intelligence Aggregator v1.0'
};