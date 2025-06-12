// Enhanced Storage Service for Ghost Brief
// Handles persistence using IndexedDB with localStorage fallback
// NOTE: This service has been modularized - individual modules are in src/services/storage/

import { indexedDBService } from './indexedDBService';
import { migrationService } from './migrationService';

// Import modular storage services
import { feedManagerService } from './storage/feedManager.js';

/**
 * Enhanced Storage Service with IndexedDB and automatic migration
 * 
 * COMPATIBILITY LAYER: This service maintains the original API while using
 * modular components for improved maintainability and testability.
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
    
    this.useIndexedDB = true;
    this.migrationStarted = false;
    
    this.initializeStorage();
  }

  /**
   * Initialize storage system with migration
   */
  async initializeStorage() {
    try {
      // Run migration if needed
      if (!this.migrationStarted) {
        this.migrationStarted = true;
        console.log('🔄 Initializing enhanced storage system...');
        
        const migrationSuccess = await migrationService.runMigration();
        if (migrationSuccess) {
          console.log('✅ Storage system ready with IndexedDB');
        } else {
          console.warn('⚠️ Migration had issues, using fallback mode');
          this.useIndexedDB = false;
        }
      }
      
      // Initialize default feeds if none exist
      await this.initializeDefaultFeeds();
      
    } catch (error) {
      console.error('❌ Storage initialization failed, falling back to localStorage:', error);
      this.useIndexedDB = false;
    }
  }

  /**
   * Check if IndexedDB is available and working
   */
  async checkIndexedDBAvailable() {
    try {
      if (!window.indexedDB) {
        return false;
      }
      
      // Try to initialize IndexedDB service
      await indexedDBService.ensureDB();
      return true;
    } catch (error) {
      console.warn('IndexedDB not available:', error);
      return false;
    }
  }

  /**
   * Initialize with default premium RSS feeds if none exist (using modular service)
   */
  async initializeDefaultFeeds() {
    try {
      return await feedManagerService.initializeDefaultFeeds();
    } catch (error) {
      console.error('❌ Failed to initialize default feeds:', error);
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
   * RSS Feed Management - Enhanced with IndexedDB
   */
  
  async getRSSFeeds() {
    try {
      if (this.useIndexedDB) {
        return await indexedDBService.getRSSFeeds();
      } else {
        // Fallback to localStorage
        const feeds = localStorage.getItem(this.STORAGE_KEYS.RSS_FEEDS);
        return feeds ? JSON.parse(feeds) : [];
      }
    } catch (error) {
      console.error('Error loading RSS feeds:', error);
      // Try localStorage fallback
      try {
        const feeds = localStorage.getItem(this.STORAGE_KEYS.RSS_FEEDS);
        return feeds ? JSON.parse(feeds) : [];
      } catch (fallbackError) {
        console.error('Fallback also failed:', fallbackError);
        return [];
      }
    }
  }

  async saveRSSFeeds(feeds) {
    try {
      if (this.useIndexedDB) {
        return await indexedDBService.saveRSSFeeds(feeds);
      } else {
        // Fallback to localStorage
        localStorage.setItem(this.STORAGE_KEYS.RSS_FEEDS, JSON.stringify(feeds));
        return true;
      }
    } catch (error) {
      console.error('Error saving RSS feeds:', error);
      return false;
    }
  }

  async addRSSFeed(feedConfig) {
    try {
      const newFeed = {
        id: this.generateFeedId(feedConfig.url),
        ...feedConfig,
        addedAt: new Date().toISOString(),
        lastFetched: null,
        status: 'active',
        errorCount: 0
      };
      
      if (this.useIndexedDB) {
        return await indexedDBService.addRSSFeed(newFeed);
      } else {
        // Fallback to localStorage
        const feeds = await this.getRSSFeeds();
        feeds.push(newFeed);
        return await this.saveRSSFeeds(feeds);
      }
    } catch (error) {
      console.error('Error adding RSS feed:', error);
      return false;
    }
  }

  async updateRSSFeed(feedId, updates) {
    try {
      if (this.useIndexedDB) {
        return await indexedDBService.updateRSSFeed(feedId, updates);
      } else {
        // Fallback to localStorage
        const feeds = await this.getRSSFeeds();
        const feedIndex = feeds.findIndex(feed => feed.id === feedId);
        
        if (feedIndex === -1) return false;
        
        feeds[feedIndex] = { ...feeds[feedIndex], ...updates };
        return await this.saveRSSFeeds(feeds);
      }
    } catch (error) {
      console.error('Error updating RSS feed:', error);
      return false;
    }
  }

  async deleteRSSFeed(feedId) {
    try {
      if (this.useIndexedDB) {
        return await indexedDBService.deleteRSSFeed(feedId);
      } else {
        // Fallback to localStorage
        const feeds = await this.getRSSFeeds();
        const filteredFeeds = feeds.filter(feed => feed.id !== feedId);
        return await this.saveRSSFeeds(filteredFeeds);
      }
    } catch (error) {
      console.error('Error deleting RSS feed:', error);
      return false;
    }
  }

  updateFeedStatus(feedId, status, errorCount = 0) {
    return this.updateRSSFeed(feedId, {
      status,
      errorCount,
      lastFetched: new Date().toISOString()
    });
  }

  /**
   * Article Management - Enhanced with IndexedDB
   */
  
  async getArticles() {
    try {
      if (this.useIndexedDB) {
        return await indexedDBService.getArticles();
      } else {
        // Fallback to localStorage
        const articles = localStorage.getItem(this.STORAGE_KEYS.ARTICLES);
        return articles ? JSON.parse(articles) : [];
      }
    } catch (error) {
      console.error('Error loading articles:', error);
      // Try localStorage fallback
      try {
        const articles = localStorage.getItem(this.STORAGE_KEYS.ARTICLES);
        return articles ? JSON.parse(articles) : [];
      } catch (fallbackError) {
        console.error('Fallback also failed:', fallbackError);
        return [];
      }
    }
  }

  async saveArticles(articles) {
    try {
      if (this.useIndexedDB) {
        return await indexedDBService.saveArticles(articles);
      } else {
        // Fallback to localStorage
        const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
        const recentArticles = articles.filter(article => {
          const articleDate = new Date(article.publishedAt || article.fetchedAt).getTime();
          return articleDate > thirtyDaysAgo;
        });

        localStorage.setItem(this.STORAGE_KEYS.ARTICLES, JSON.stringify(recentArticles));
        await this.updateLastUpdate();
        return true;
      }
    } catch (error) {
      console.error('Error saving articles:', error);
      return false;
    }
  }

  async addArticles(newArticles) {
    try {
      if (this.useIndexedDB) {
        return await indexedDBService.addArticles(newArticles);
      } else {
        // Fallback to localStorage
        const existingArticles = await this.getArticles();
        const combined = [...existingArticles, ...newArticles];
        
        // Remove duplicates based on URL
        const unique = combined.filter((article, index, self) => 
          index === self.findIndex(a => a.url === article.url)
        );

        return await this.saveArticles(unique);
      }
    } catch (error) {
      console.error('Error adding articles:', error);
      return false;
    }
  }

  /**
   * Briefs Management - Enhanced with IndexedDB
   */
  
  async getBriefs() {
    try {
      if (this.useIndexedDB) {
        return await indexedDBService.getBriefs();
      } else {
        // Fallback to localStorage
        const briefs = localStorage.getItem(this.STORAGE_KEYS.BRIEFS);
        return briefs ? JSON.parse(briefs) : [];
      }
    } catch (error) {
      console.error('Error loading briefs:', error);
      // Try localStorage fallback
      try {
        const briefs = localStorage.getItem(this.STORAGE_KEYS.BRIEFS);
        return briefs ? JSON.parse(briefs) : [];
      } catch (fallbackError) {
        console.error('Fallback also failed:', fallbackError);
        return [];
      }
    }
  }

  async saveBriefs(briefs) {
    try {
      if (this.useIndexedDB) {
        return await indexedDBService.saveBriefs(briefs);
      } else {
        // Fallback to localStorage
        localStorage.setItem(this.STORAGE_KEYS.BRIEFS, JSON.stringify(briefs));
        return true;
      }
    } catch (error) {
      console.error('Error saving briefs:', error);
      return false;
    }
  }

  async addBrief(brief) {
    try {
      const newBrief = {
        id: this.generateBriefId(),
        ...brief,
        createdAt: new Date().toISOString(),
        isPermanent: true
      };
      
      if (this.useIndexedDB) {
        return await indexedDBService.addBrief(newBrief);
      } else {
        // Fallback to localStorage
        const briefs = await this.getBriefs();
        briefs.unshift(newBrief); // Add to beginning
        return await this.saveBriefs(briefs);
      }
    } catch (error) {
      console.error('Error adding brief:', error);
      return false;
    }
  }

  /**
   * Settings Management - Enhanced with IndexedDB
   */
  
  async getSettings() {
    try {
      if (this.useIndexedDB) {
        return await indexedDBService.getSettings();
      } else {
        // Fallback to localStorage
        const settings = localStorage.getItem(this.STORAGE_KEYS.SETTINGS);
        return settings ? JSON.parse(settings) : this.getDefaultSettings();
      }
    } catch (error) {
      console.error('Error loading settings:', error);
      return this.getDefaultSettings();
    }
  }

  async saveSettings(settings) {
    try {
      if (this.useIndexedDB) {
        return await indexedDBService.saveSettings(settings);
      } else {
        // Fallback to localStorage
        localStorage.setItem(this.STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
        return true;
      }
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

  async updateLastUpdate() {
    try {
      if (this.useIndexedDB) {
        return await indexedDBService.updateLastUpdate();
      } else {
        // Fallback to localStorage
        const timestamp = new Date().toISOString();
        localStorage.setItem(this.STORAGE_KEYS.LAST_UPDATE, timestamp);
        return timestamp;
      }
    } catch (error) {
      console.error('Error updating last update:', error);
      return null;
    }
  }

  async getLastUpdate() {
    try {
      if (this.useIndexedDB) {
        return await indexedDBService.getLastUpdate();
      } else {
        // Fallback to localStorage
        return localStorage.getItem(this.STORAGE_KEYS.LAST_UPDATE);
      }
    } catch (error) {
      console.error('Error getting last update:', error);
      return null;
    }
  }

  /**
   * Data cleanup and maintenance - Enhanced with IndexedDB
   */
  
  async cleanupOldData() {
    try {
      if (this.useIndexedDB) {
        return await indexedDBService.cleanupOldData();
      } else {
        // Fallback to localStorage
        const articles = await this.getArticles();
        const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
        
        const recentArticles = articles.filter(article => {
          const articleDate = new Date(article.publishedAt || article.fetchedAt).getTime();
          return articleDate > thirtyDaysAgo;
        });

        if (recentArticles.length !== articles.length) {
          await this.saveArticles(recentArticles);
          console.log(`Cleaned up ${articles.length - recentArticles.length} old articles`);
        }
        return true;
      }
    } catch (error) {
      console.error('Error during cleanup:', error);
      return false;
    }
  }

  /**
   * Enhanced storage statistics
   */
  async getStorageStats() {
    try {
      if (this.useIndexedDB) {
        return await indexedDBService.getStorageStats();
      } else {
        // Fallback to localStorage stats
        const articles = await this.getArticles();
        const briefs = await this.getBriefs();
        const feeds = await this.getRSSFeeds();
        
        const articlesSize = JSON.stringify(articles).length;
        const briefsSize = JSON.stringify(briefs).length;
        const feedsSize = JSON.stringify(feeds).length;
        
        return {
          articles: articles.length,
          briefs: briefs.length,
          feeds: feeds.length,
          totalSize: articlesSize + briefsSize + feedsSize,
          storageType: 'localStorage',
          capacity: '~10MB',
          lastUpdate: await this.getLastUpdate()
        };
      }
    } catch (error) {
      console.error('Error getting storage stats:', error);
      return {
        articles: 0,
        briefs: 0,
        feeds: 0,
        totalSize: 0,
        storageType: 'Unknown',
        capacity: 'Unknown',
        lastUpdate: null,
        error: error.message
      };
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

}

// Export singleton instance
export const storageService = new StorageService();