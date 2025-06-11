// Local Storage Service for Ghost Brief
// Handles persistence of RSS feeds, articles, and user settings

/**
 * Storage Service for managing local data persistence
 */
export class StorageService {
  constructor() {
    this.STORAGE_KEYS = {
      RSS_FEEDS: 'ghost_brief_rss_feeds',
      ARTICLES: 'ghost_brief_articles',
      BRIEFS: 'ghost_brief_briefs',
      SETTINGS: 'ghost_brief_settings',
      LAST_UPDATE: 'ghost_brief_last_update'
    };
    
    this.initializeDefaultFeeds();
  }

  /**
   * Initialize with default premium RSS feeds if none exist
   */
  initializeDefaultFeeds() {
    const existingFeeds = this.getRSSFeeds();
    if (existingFeeds.length === 0) {
      const defaultFeeds = this.getDefaultRSSFeeds();
      this.saveRSSFeeds(defaultFeeds);
    }
  }

  /**
   * Get premium RSS feeds for intelligence gathering
   * @returns {Array} Default RSS feed configurations
   */
  getDefaultRSSFeeds() {
    return [
      // Military & Defense (5 feeds)
      {
        id: 'defense-news',
        name: 'Defense News',
        url: 'https://www.defensenews.com/rss/',
        category: 'MILITARY',
        tags: ['DEFENSE', 'MILITARY', 'WEAPONS'],
        isActive: true,
        credibilityScore: 95,
        addedAt: new Date().toISOString(),
        lastFetched: null,
        status: 'active',
        errorCount: 0
      },
      {
        id: 'military-com',
        name: 'Military.com News',
        url: 'https://www.military.com/rss/news',
        category: 'MILITARY', 
        tags: ['MILITARY', 'VETERANS', 'DEFENSE'],
        isActive: true,
        credibilityScore: 90,
        addedAt: new Date().toISOString(),
        lastFetched: null,
        status: 'active',
        errorCount: 0
      },
      {
        id: 'breaking-defense',
        name: 'Breaking Defense',
        url: 'https://breakingdefense.com/feed/',
        category: 'MILITARY',
        tags: ['DEFENSE', 'TECH', 'PROCUREMENT'],
        isActive: true,
        credibilityScore: 92,
        addedAt: new Date().toISOString(),
        lastFetched: null,
        status: 'active',
        errorCount: 0
      },
      {
        id: 'war-on-rocks',
        name: 'War on the Rocks',
        url: 'https://warontherocks.com/feed/',
        category: 'MILITARY',
        tags: ['STRATEGY', 'ANALYSIS', 'GEOPOLITICS'],
        isActive: true,
        credibilityScore: 94,
        addedAt: new Date().toISOString(),
        lastFetched: null,
        status: 'active',
        errorCount: 0
      },
      {
        id: 'defense-one',
        name: 'Defense One',
        url: 'https://www.defenseone.com/rss/',
        category: 'MILITARY',
        tags: ['DEFENSE', 'TECHNOLOGY', 'POLICY'],
        isActive: true,
        credibilityScore: 93,
        addedAt: new Date().toISOString(),
        lastFetched: null,
        status: 'active',
        errorCount: 0
      },

      // Technology & Cybersecurity (3 feeds)
      {
        id: 'ars-technica',
        name: 'Ars Technica',
        url: 'https://feeds.arstechnica.com/arstechnica/index',
        category: 'TECHNOLOGY',
        tags: ['TECH', 'CYBERSECURITY', 'AI'],
        isActive: true,
        credibilityScore: 96,
        addedAt: new Date().toISOString(),
        lastFetched: null,
        status: 'active',
        errorCount: 0
      },
      {
        id: 'hacker-news-feed',
        name: 'The Hacker News',
        url: 'https://feeds.feedburner.com/TheHackersNews',
        category: 'CYBERSECURITY',
        tags: ['CYBER', 'HACKING', 'SECURITY'],
        isActive: true,
        credibilityScore: 93,
        addedAt: new Date().toISOString(),
        lastFetched: null,
        status: 'active',
        errorCount: 0
      },
      {
        id: 'mit-tech-review',
        name: 'MIT Technology Review',
        url: 'https://www.technologyreview.com/feed/',
        category: 'TECHNOLOGY',
        tags: ['AI', 'QUANTUM', 'INNOVATION'],
        isActive: true,
        credibilityScore: 97,
        addedAt: new Date().toISOString(),
        lastFetched: null,
        status: 'active',
        errorCount: 0
      },

      // Geopolitics & International (4 feeds)
      {
        id: 'reuters-world',
        name: 'Reuters World News',
        url: 'https://feeds.reuters.com/reuters/worldNews',
        category: 'GEOPOLITICS',
        tags: ['WORLD', 'POLITICS', 'BREAKING'],
        isActive: true,
        credibilityScore: 98,
        addedAt: new Date().toISOString(),
        lastFetched: null,
        status: 'active',
        errorCount: 0
      },
      {
        id: 'foreign-policy',
        name: 'Foreign Policy',
        url: 'https://foreignpolicy.com/feed/',
        category: 'GEOPOLITICS',
        tags: ['DIPLOMACY', 'ANALYSIS', 'INTERNATIONAL'],
        isActive: true,
        credibilityScore: 96,
        addedAt: new Date().toISOString(),
        lastFetched: null,
        status: 'active',
        errorCount: 0
      },
      {
        id: 'bbc-world',
        name: 'BBC World News',
        url: 'http://feeds.bbci.co.uk/news/world/rss.xml',
        category: 'GEOPOLITICS',
        tags: ['WORLD', 'BREAKING', 'INTERNATIONAL'],
        isActive: true,
        credibilityScore: 94,
        addedAt: new Date().toISOString(),
        lastFetched: null,
        status: 'active',
        errorCount: 0
      },
      {
        id: 'ap-world',
        name: 'Associated Press World',
        url: 'https://feeds.apnews.com/rss/apf-worldnews',
        category: 'GEOPOLITICS',
        tags: ['WORLD', 'BREAKING', 'NEWS'],
        isActive: true,
        credibilityScore: 95,
        addedAt: new Date().toISOString(),
        lastFetched: null,
        status: 'active',
        errorCount: 0
      },

      // Finance & Economics (2 feeds)
      {
        id: 'bloomberg-politics',
        name: 'Bloomberg Politics',
        url: 'https://feeds.bloomberg.com/politics/news.rss',
        category: 'FINANCE',
        tags: ['ECONOMY', 'POLITICS', 'TRADE'],
        isActive: true,
        credibilityScore: 95,
        addedAt: new Date().toISOString(),
        lastFetched: null,
        status: 'active',
        errorCount: 0
      },
      {
        id: 'wsj-world',
        name: 'Wall Street Journal World',
        url: 'https://feeds.a.dj.com/rss/RSSWSJD.xml',
        category: 'FINANCE',
        tags: ['MARKETS', 'ECONOMY', 'GLOBAL'],
        isActive: true,
        credibilityScore: 96,
        addedAt: new Date().toISOString(),
        lastFetched: null,
        status: 'active',
        errorCount: 0
      },

      // Health & Science (1 feed)
      {
        id: 'science-news',
        name: 'Science News',
        url: 'https://www.sciencenews.org/feeds/headlines.rss',
        category: 'SCIENCE',
        tags: ['SCIENCE', 'HEALTH', 'RESEARCH'],
        isActive: true,
        credibilityScore: 94,
        addedAt: new Date().toISOString(),
        lastFetched: null,
        status: 'active',
        errorCount: 0
      }
    ];
  }

  /**
   * RSS Feed Management
   */
  
  getRSSFeeds() {
    try {
      const feeds = localStorage.getItem(this.STORAGE_KEYS.RSS_FEEDS);
      return feeds ? JSON.parse(feeds) : [];
    } catch (error) {
      console.error('Error loading RSS feeds:', error);
      return [];
    }
  }

  saveRSSFeeds(feeds) {
    try {
      localStorage.setItem(this.STORAGE_KEYS.RSS_FEEDS, JSON.stringify(feeds));
      return true;
    } catch (error) {
      console.error('Error saving RSS feeds:', error);
      return false;
    }
  }

  addRSSFeed(feedConfig) {
    const feeds = this.getRSSFeeds();
    const newFeed = {
      id: this.generateFeedId(feedConfig.url),
      ...feedConfig,
      addedAt: new Date().toISOString(),
      lastFetched: null,
      status: 'active',
      errorCount: 0
    };
    
    feeds.push(newFeed);
    return this.saveRSSFeeds(feeds);
  }

  updateRSSFeed(feedId, updates) {
    const feeds = this.getRSSFeeds();
    const feedIndex = feeds.findIndex(feed => feed.id === feedId);
    
    if (feedIndex === -1) return false;
    
    feeds[feedIndex] = { ...feeds[feedIndex], ...updates };
    return this.saveRSSFeeds(feeds);
  }

  deleteRSSFeed(feedId) {
    const feeds = this.getRSSFeeds();
    const filteredFeeds = feeds.filter(feed => feed.id !== feedId);
    return this.saveRSSFeeds(filteredFeeds);
  }

  updateFeedStatus(feedId, status, errorCount = 0) {
    return this.updateRSSFeed(feedId, {
      status,
      errorCount,
      lastFetched: new Date().toISOString()
    });
  }

  /**
   * Article Management
   */
  
  getArticles() {
    try {
      const articles = localStorage.getItem(this.STORAGE_KEYS.ARTICLES);
      return articles ? JSON.parse(articles) : [];
    } catch (error) {
      console.error('Error loading articles:', error);
      return [];
    }
  }

  saveArticles(articles) {
    try {
      // Remove articles older than 30 days
      const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
      const recentArticles = articles.filter(article => {
        const articleDate = new Date(article.publishedAt || article.fetchedAt).getTime();
        return articleDate > thirtyDaysAgo;
      });

      localStorage.setItem(this.STORAGE_KEYS.ARTICLES, JSON.stringify(recentArticles));
      this.updateLastUpdate();
      return true;
    } catch (error) {
      console.error('Error saving articles:', error);
      return false;
    }
  }

  addArticles(newArticles) {
    const existingArticles = this.getArticles();
    const combined = [...existingArticles, ...newArticles];
    
    // Remove duplicates based on URL
    const unique = combined.filter((article, index, self) => 
      index === self.findIndex(a => a.url === article.url)
    );

    return this.saveArticles(unique);
  }

  /**
   * Briefs Management (Permanent Storage)
   */
  
  getBriefs() {
    try {
      const briefs = localStorage.getItem(this.STORAGE_KEYS.BRIEFS);
      return briefs ? JSON.parse(briefs) : [];
    } catch (error) {
      console.error('Error loading briefs:', error);
      return [];
    }
  }

  saveBriefs(briefs) {
    try {
      localStorage.setItem(this.STORAGE_KEYS.BRIEFS, JSON.stringify(briefs));
      return true;
    } catch (error) {
      console.error('Error saving briefs:', error);
      return false;
    }
  }

  addBrief(brief) {
    const briefs = this.getBriefs();
    const newBrief = {
      id: this.generateBriefId(),
      ...brief,
      createdAt: new Date().toISOString(),
      isPermanent: true
    };
    
    briefs.unshift(newBrief); // Add to beginning
    return this.saveBriefs(briefs);
  }

  /**
   * Settings Management
   */
  
  getSettings() {
    try {
      const settings = localStorage.getItem(this.STORAGE_KEYS.SETTINGS);
      return settings ? JSON.parse(settings) : this.getDefaultSettings();
    } catch (error) {
      console.error('Error loading settings:', error);
      return this.getDefaultSettings();
    }
  }

  saveSettings(settings) {
    try {
      localStorage.setItem(this.STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
      return true;
    } catch (error) {
      console.error('Error saving settings:', error);
      return false;
    }
  }

  getDefaultSettings() {
    return {
      relevanceThreshold: 40,
      autoRefreshInterval: 15, // minutes
      maxArticlesPerFeed: 50,
      enableNotifications: false,
      theme: 'intelligence-green',
      displayMode: 'compact'
    };
  }

  /**
   * Utility Functions
   */
  
  generateFeedId(url) {
    const domain = new URL(url).hostname.replace('www.', '');
    const timestamp = Date.now().toString(36);
    return `feed_${domain.replace(/\./g, '_')}_${timestamp}`;
  }

  generateBriefId() {
    return `brief_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  updateLastUpdate() {
    localStorage.setItem(this.STORAGE_KEYS.LAST_UPDATE, new Date().toISOString());
  }

  getLastUpdate() {
    return localStorage.getItem(this.STORAGE_KEYS.LAST_UPDATE);
  }

  /**
   * Data cleanup and maintenance
   */
  
  cleanupOldData() {
    const articles = this.getArticles();
    const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
    
    const recentArticles = articles.filter(article => {
      const articleDate = new Date(article.publishedAt || article.fetchedAt).getTime();
      return articleDate > thirtyDaysAgo;
    });

    if (recentArticles.length !== articles.length) {
      this.saveArticles(recentArticles);
      console.log(`Cleaned up ${articles.length - recentArticles.length} old articles`);
    }
  }

  /**
   * Export/Import functionality
   */
  
  exportData() {
    return {
      feeds: this.getRSSFeeds(),
      briefs: this.getBriefs(),
      settings: this.getSettings(),
      exportedAt: new Date().toISOString()
    };
  }

  importData(data) {
    try {
      if (data.feeds) this.saveRSSFeeds(data.feeds);
      if (data.briefs) this.saveBriefs(data.briefs);
      if (data.settings) this.saveSettings(data.settings);
      return true;
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    }
  }

  /**
   * Storage statistics
   */
  
  getStorageStats() {
    const feeds = this.getRSSFeeds();
    const articles = this.getArticles();
    const briefs = this.getBriefs();
    
    return {
      totalFeeds: feeds.length,
      activeFeeds: feeds.filter(f => f.isActive).length,
      totalArticles: articles.length,
      totalBriefs: briefs.length,
      lastUpdate: this.getLastUpdate(),
      storageUsed: this.calculateStorageUsage()
    };
  }

  calculateStorageUsage() {
    let total = 0;
    Object.values(this.STORAGE_KEYS).forEach(key => {
      const item = localStorage.getItem(key);
      if (item) {
        total += new Blob([item]).size;
      }
    });
    
    return {
      bytes: total,
      kb: Math.round(total / 1024),
      mb: Math.round(total / (1024 * 1024))
    };
  }
}

// Export singleton instance
export const storageService = new StorageService();