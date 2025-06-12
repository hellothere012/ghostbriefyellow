// Feed Management Module for Ghost Brief
// Specialized RSS feed configuration and management operations

import { indexedDBService } from '../indexedDBService.js';

/**
 * Feed Manager Service
 * Handles all RSS feed configuration and health monitoring
 */
export class FeedManagerService {
  constructor() {
    this.STORAGE_KEY = 'ghost_brief_rss_feeds';
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
        tags: ['defense', 'military', 'weapons'],
        isActive: true,
        credibilityScore: 95,
        lastFetched: null,
        status: 'active',
        errorCount: 0
      },
      {
        id: 'military-com',
        name: 'Military.com',
        url: 'https://www.military.com/rss/news',
        category: 'MILITARY',
        tags: ['military', 'veterans', 'defense'],
        isActive: true,
        credibilityScore: 90,
        lastFetched: null,
        status: 'active',
        errorCount: 0
      },
      {
        id: 'breaking-defense',
        name: 'Breaking Defense',
        url: 'https://breakingdefense.com/feed/',
        category: 'MILITARY',
        tags: ['defense', 'procurement', 'strategy'],
        isActive: true,
        credibilityScore: 92,
        lastFetched: null,
        status: 'active',
        errorCount: 0
      },
      {
        id: 'war-on-rocks',
        name: 'War on the Rocks',
        url: 'https://warontherocks.com/feed/',
        category: 'MILITARY',
        tags: ['strategy', 'policy', 'analysis'],
        isActive: true,
        credibilityScore: 88,
        lastFetched: null,
        status: 'active',
        errorCount: 0
      },
      {
        id: 'defense-one',
        name: 'Defense One',
        url: 'https://www.defenseone.com/rss/all/',
        category: 'MILITARY',
        tags: ['defense', 'technology', 'policy'],
        isActive: true,
        credibilityScore: 91,
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
        tags: ['technology', 'science', 'cybersecurity'],
        isActive: true,
        credibilityScore: 89,
        lastFetched: null,
        status: 'active',
        errorCount: 0
      },
      {
        id: 'hacker-news',
        name: 'The Hacker News',
        url: 'https://feeds.feedburner.com/TheHackersNews',
        category: 'CYBERSECURITY',
        tags: ['cybersecurity', 'hacking', 'threats'],
        isActive: true,
        credibilityScore: 86,
        lastFetched: null,
        status: 'active',
        errorCount: 0
      },
      {
        id: 'mit-tech-review',
        name: 'MIT Technology Review',
        url: 'https://www.technologyreview.com/feed/',
        category: 'TECHNOLOGY',
        tags: ['innovation', 'research', 'emerging tech'],
        isActive: true,
        credibilityScore: 94,
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
        tags: ['world news', 'politics', 'international'],
        isActive: true,
        credibilityScore: 96,
        lastFetched: null,
        status: 'active',
        errorCount: 0
      },
      {
        id: 'foreign-policy',
        name: 'Foreign Policy',
        url: 'https://foreignpolicy.com/feed/',
        category: 'GEOPOLITICS',
        tags: ['foreign policy', 'diplomacy', 'international'],
        isActive: true,
        credibilityScore: 90,
        lastFetched: null,
        status: 'active',
        errorCount: 0
      },
      {
        id: 'bbc-world',
        name: 'BBC World News',
        url: 'http://feeds.bbci.co.uk/news/world/rss.xml',
        category: 'GEOPOLITICS',
        tags: ['world news', 'international', 'breaking'],
        isActive: true,
        credibilityScore: 93,
        lastFetched: null,
        status: 'active',
        errorCount: 0
      },
      {
        id: 'ap-news',
        name: 'Associated Press',
        url: 'https://feeds.apnews.com/rss/apf-topnews',
        category: 'GEOPOLITICS',
        tags: ['breaking news', 'world', 'politics'],
        isActive: true,
        credibilityScore: 95,
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
        tags: ['economics', 'politics', 'markets'],
        isActive: true,
        credibilityScore: 92,
        lastFetched: null,
        status: 'active',
        errorCount: 0
      },
      {
        id: 'wsj-world',
        name: 'Wall Street Journal',
        url: 'https://feeds.a.dj.com/rss/RSSWorldNews.xml',
        category: 'FINANCE',
        tags: ['finance', 'economics', 'business'],
        isActive: true,
        credibilityScore: 91,
        lastFetched: null,
        status: 'active',
        errorCount: 0
      },
      // Health & Science (1 feed)
      {
        id: 'science-news',
        name: 'Science News',
        url: 'https://www.sciencenews.org/feed',
        category: 'SCIENCE',
        tags: ['science', 'research', 'health'],
        isActive: true,
        credibilityScore: 88,
        lastFetched: null,
        status: 'active',
        errorCount: 0
      }
    ];
  }

  /**
   * Save RSS feeds to storage
   * @param {Array} feeds - Feeds to save
   * @returns {Promise<boolean>} Success status
   */
  async saveRSSFeeds(feeds) {
    try {
      if (!Array.isArray(feeds)) {
        throw new Error('Feeds must be an array');
      }

      console.log(`💾 Saving ${feeds.length} RSS feeds...`);

      if (await this.isIndexedDBAvailable()) {
        await indexedDBService.saveFeeds(feeds);
      } else {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(feeds));
      }

      console.log(`✅ Successfully saved ${feeds.length} RSS feeds`);
      return true;
    } catch (error) {
      console.error('❌ Failed to save RSS feeds:', error);
      return false;
    }
  }

  /**
   * Get RSS feeds from storage
   * @returns {Promise<Array>} Array of RSS feeds
   */
  async getRSSFeeds() {
    try {
      if (await this.isIndexedDBAvailable()) {
        const feeds = await indexedDBService.getFeeds();
        console.log(`📡 Retrieved ${feeds.length} RSS feeds from IndexedDB`);
        return feeds;
      } else {
        const stored = localStorage.getItem(this.STORAGE_KEY);
        const feeds = stored ? JSON.parse(stored) : [];
        console.log(`📡 Retrieved ${feeds.length} RSS feeds from localStorage`);
        return feeds;
      }
    } catch (error) {
      console.error('❌ Failed to get RSS feeds:', error);
      return [];
    }
  }

  /**
   * Add a new RSS feed
   * @param {Object} feed - Feed configuration
   * @returns {Promise<boolean>} Success status
   */
  async addRSSFeed(feed) {
    try {
      const existingFeeds = await this.getRSSFeeds();
      
      // Check for duplicate URLs
      if (existingFeeds.some(existing => existing.url === feed.url)) {
        throw new Error('Feed with this URL already exists');
      }

      // Add default properties
      const newFeed = {
        id: feed.id || `feed_${Date.now()}`,
        name: feed.name,
        url: feed.url,
        category: feed.category || 'GENERAL',
        tags: feed.tags || [],
        isActive: feed.isActive !== false,
        credibilityScore: feed.credibilityScore || 70,
        lastFetched: null,
        status: 'active',
        errorCount: 0,
        addedAt: new Date().toISOString()
      };

      const updatedFeeds = [...existingFeeds, newFeed];
      await this.saveRSSFeeds(updatedFeeds);

      console.log(`✅ Added new RSS feed: ${newFeed.name}`);
      return true;
    } catch (error) {
      console.error('❌ Failed to add RSS feed:', error);
      return false;
    }
  }

  /**
   * Update RSS feed configuration
   * @param {string} feedId - Feed ID
   * @param {Object} updates - Updates to apply
   * @returns {Promise<boolean>} Success status
   */
  async updateRSSFeed(feedId, updates) {
    try {
      const feeds = await this.getRSSFeeds();
      const feedIndex = feeds.findIndex(feed => feed.id === feedId);

      if (feedIndex === -1) {
        throw new Error(`Feed ${feedId} not found`);
      }

      feeds[feedIndex] = {
        ...feeds[feedIndex],
        ...updates,
        updatedAt: new Date().toISOString()
      };

      await this.saveRSSFeeds(feeds);
      console.log(`✅ Updated RSS feed: ${feeds[feedIndex].name}`);
      return true;
    } catch (error) {
      console.error('❌ Failed to update RSS feed:', error);
      return false;
    }
  }

  /**
   * Delete RSS feed
   * @param {string} feedId - Feed ID to delete
   * @returns {Promise<boolean>} Success status
   */
  async deleteRSSFeed(feedId) {
    try {
      const feeds = await this.getRSSFeeds();
      const filteredFeeds = feeds.filter(feed => feed.id !== feedId);

      if (filteredFeeds.length === feeds.length) {
        throw new Error(`Feed ${feedId} not found`);
      }

      await this.saveRSSFeeds(filteredFeeds);
      console.log(`✅ Deleted RSS feed: ${feedId}`);
      return true;
    } catch (error) {
      console.error('❌ Failed to delete RSS feed:', error);
      return false;
    }
  }

  /**
   * Get feed health statistics
   * @returns {Promise<Object>} Feed health stats
   */
  async getFeedHealthStats() {
    try {
      const feeds = await this.getRSSFeeds();
      
      const stats = {
        total: feeds.length,
        active: 0,
        inactive: 0,
        healthy: 0,
        warning: 0,
        error: 0,
        averageCredibility: 0,
        byCategory: {},
        recentlyFetched: 0
      };

      let totalCredibility = 0;
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

      feeds.forEach(feed => {
        // Activity status
        if (feed.isActive) {
          stats.active++;
        } else {
          stats.inactive++;
        }

        // Health status
        if (feed.status === 'active') {
          stats.healthy++;
        } else if (feed.status === 'warning') {
          stats.warning++;
        } else if (feed.status === 'error') {
          stats.error++;
        }

        // Category distribution
        const category = feed.category || 'UNKNOWN';
        stats.byCategory[category] = (stats.byCategory[category] || 0) + 1;

        // Credibility
        totalCredibility += feed.credibilityScore || 70;

        // Recent fetch check
        if (feed.lastFetched && new Date(feed.lastFetched) > oneHourAgo) {
          stats.recentlyFetched++;
        }
      });

      stats.averageCredibility = feeds.length > 0 ? Math.round(totalCredibility / feeds.length) : 0;

      return stats;
    } catch (error) {
      console.error('❌ Failed to get feed health stats:', error);
      return { total: 0, active: 0, inactive: 0, healthy: 0, warning: 0, error: 0 };
    }
  }

  /**
   * Update feed status after fetch attempt
   * @param {string} feedId - Feed ID
   * @param {boolean} success - Whether fetch was successful
   * @param {string} error - Error message if failed
   * @returns {Promise<boolean>} Success status
   */
  async updateFeedStatus(feedId, success, error = null) {
    try {
      const feeds = await this.getRSSFeeds();
      const feedIndex = feeds.findIndex(feed => feed.id === feedId);

      if (feedIndex === -1) {
        return false;
      }

      const feed = feeds[feedIndex];
      
      if (success) {
        feed.status = 'active';
        feed.errorCount = 0;
        feed.lastError = null;
        feed.lastFetched = new Date().toISOString();
      } else {
        feed.errorCount = (feed.errorCount || 0) + 1;
        feed.lastError = error;
        feed.lastErrorAt = new Date().toISOString();
        
        // Update status based on error count
        if (feed.errorCount >= 5) {
          feed.status = 'error';
        } else if (feed.errorCount >= 2) {
          feed.status = 'warning';
        }
      }

      await this.saveRSSFeeds(feeds);
      return true;
    } catch (error) {
      console.error('❌ Failed to update feed status:', error);
      return false;
    }
  }

  /**
   * Get feeds by category
   * @param {string} category - Category filter
   * @returns {Promise<Array>} Filtered feeds
   */
  async getFeedsByCategory(category) {
    try {
      const feeds = await this.getRSSFeeds();
      return feeds.filter(feed => feed.category === category);
    } catch (error) {
      console.error('❌ Failed to get feeds by category:', error);
      return [];
    }
  }

  /**
   * Get active feeds only
   * @returns {Promise<Array>} Active feeds
   */
  async getActiveFeeds() {
    try {
      const feeds = await this.getRSSFeeds();
      return feeds.filter(feed => feed.isActive && feed.status !== 'error');
    } catch (error) {
      console.error('❌ Failed to get active feeds:', error);
      return [];
    }
  }

  /**
   * Initialize default feeds if none exist
   * @returns {Promise<boolean>} Success status
   */
  async initializeDefaultFeeds() {
    try {
      const existingFeeds = await this.getRSSFeeds();
      if (existingFeeds.length === 0) {
        console.log('📡 Initializing default RSS feeds...');
        const defaultFeeds = this.getDefaultRSSFeeds();
        await this.saveRSSFeeds(defaultFeeds);
        console.log(`✅ Initialized ${defaultFeeds.length} default RSS feeds`);
        return true;
      }
      return true;
    } catch (error) {
      console.error('❌ Failed to initialize default feeds:', error);
      return false;
    }
  }

  /**
   * Check if IndexedDB is available
   * @returns {Promise<boolean>} IndexedDB availability
   */
  async isIndexedDBAvailable() {
    try {
      if (!window.indexedDB) {
        return false;
      }
      await indexedDBService.ensureDB();
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Export feeds for backup
   * @returns {Promise<Object>} Export data
   */
  async exportFeeds() {
    try {
      const feeds = await this.getRSSFeeds();
      const stats = await this.getFeedHealthStats();
      
      return {
        feeds,
        statistics: stats,
        exportedAt: new Date().toISOString(),
        version: '1.0'
      };
    } catch (error) {
      console.error('❌ Failed to export feeds:', error);
      return { feeds: [], statistics: {}, exportedAt: new Date().toISOString() };
    }
  }

  /**
   * Import feeds from backup
   * @param {Object} exportData - Exported feed data
   * @returns {Promise<boolean>} Success status
   */
  async importFeeds(exportData) {
    try {
      if (!exportData.feeds || !Array.isArray(exportData.feeds)) {
        throw new Error('Invalid export data format');
      }

      console.log(`📥 Importing ${exportData.feeds.length} feeds...`);
      await this.saveRSSFeeds(exportData.feeds);
      
      console.log(`✅ Successfully imported ${exportData.feeds.length} feeds`);
      return true;
    } catch (error) {
      console.error('❌ Failed to import feeds:', error);
      return false;
    }
  }
}

// Export singleton instance
export const feedManagerService = new FeedManagerService();