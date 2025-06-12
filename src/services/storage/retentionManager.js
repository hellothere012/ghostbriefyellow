// Retention Management Module for Ghost Brief
// Automated cleanup and data retention policies

import { indexedDBService } from '../indexedDBService.js';

/**
 * Retention Manager Service
 * Handles automated cleanup and data retention policies
 */
export class RetentionManagerService {
  constructor() {
    this.retentionPolicies = {
      articles: {
        maxAge: 30, // days
        maxCount: 5000,
        cleanupInterval: 24 // hours
      },
      briefings: {
        maxAge: null, // permanent
        maxCount: 100,
        cleanupInterval: 168 // weekly
      },
      logs: {
        maxAge: 7, // days
        maxCount: 1000,
        cleanupInterval: 24 // hours
      },
      cache: {
        maxAge: 1, // days
        maxCount: 500,
        cleanupInterval: 6 // hours
      }
    };

    this.lastCleanup = {
      articles: null,
      briefings: null,
      logs: null,
      cache: null
    };

    this.isRunning = false;
  }

  /**
   * Run comprehensive cleanup based on retention policies
   * @param {Object} options - Cleanup options
   * @returns {Promise<Object>} Cleanup results
   */
  async runCleanup(options = {}) {
    if (this.isRunning) {
      console.log('⚠️ Cleanup already running, skipping...');
      return { status: 'skipped', reason: 'already_running' };
    }

    try {
      this.isRunning = true;
      console.log('🧹 Starting comprehensive data cleanup...');

      const results = {
        startedAt: new Date().toISOString(),
        completedAt: null,
        status: 'success',
        summary: {
          articlesRemoved: 0,
          briefingsRemoved: 0,
          spaceFreed: 0,
          errors: []
        },
        details: {}
      };

      // Article cleanup
      if (options.articles !== false) {
        console.log('📰 Cleaning up old articles...');
        const articleResults = await this.cleanupArticles();
        results.details.articles = articleResults;
        results.summary.articlesRemoved = articleResults.removed;
      }

      // Briefing cleanup (only if over limit)
      if (options.briefings !== false) {
        console.log('📋 Cleaning up excess briefings...');
        const briefingResults = await this.cleanupBriefings();
        results.details.briefings = briefingResults;
        results.summary.briefingsRemoved = briefingResults.removed;
      }

      // Cache cleanup
      if (options.cache !== false) {
        console.log('💾 Cleaning up cache...');
        const cacheResults = await this.cleanupCache();
        results.details.cache = cacheResults;
      }

      // Log cleanup
      if (options.logs !== false) {
        console.log('📝 Cleaning up old logs...');
        const logResults = await this.cleanupLogs();
        results.details.logs = logResults;
      }

      // Storage optimization
      if (options.optimize !== false) {
        console.log('⚡ Optimizing storage...');
        const optimizeResults = await this.optimizeStorage();
        results.details.optimization = optimizeResults;
        results.summary.spaceFreed = optimizeResults.spaceFreed || 0;
      }

      results.completedAt = new Date().toISOString();
      const duration = new Date(results.completedAt) - new Date(results.startedAt);
      
      console.log(`✅ Cleanup completed in ${duration}ms: ${results.summary.articlesRemoved} articles, ${results.summary.briefingsRemoved} briefings removed`);
      
      // Update last cleanup times
      this.updateLastCleanupTimes();
      
      return results;
    } catch (error) {
      console.error('❌ Cleanup failed:', error);
      return {
        status: 'error',
        error: error.message,
        completedAt: new Date().toISOString()
      };
    } finally {
      this.isRunning = false;
    }
  }

  /**
   * Clean up old articles based on retention policy
   * @returns {Promise<Object>} Cleanup results
   */
  async cleanupArticles() {
    try {
      const policy = this.retentionPolicies.articles;
      const cutoffTime = new Date(Date.now() - (policy.maxAge * 24 * 60 * 60 * 1000));
      
      let removed = 0;
      let errors = [];

      if (await this.isIndexedDBAvailable()) {
        // IndexedDB cleanup
        const articles = await indexedDBService.getArticles();
        const oldArticles = articles.filter(article => {
          const articleTime = new Date(article.publishedAt || article.fetchedAt || article.storedAt);
          return articleTime < cutoffTime;
        });

        if (oldArticles.length > 0) {
          const articleIds = oldArticles.map(article => article.id);
          await indexedDBService.deleteArticles(articleIds);
          removed = articleIds.length;
        }

        // Also check for count-based cleanup
        if (articles.length > policy.maxCount) {
          const excess = articles.length - policy.maxCount;
          const sortedArticles = articles.sort((a, b) => 
            new Date(a.publishedAt || a.fetchedAt) - new Date(b.publishedAt || b.fetchedAt)
          );
          const excessIds = sortedArticles.slice(0, excess).map(a => a.id);
          await indexedDBService.deleteArticles(excessIds);
          removed += excess;
        }
      } else {
        // localStorage cleanup
        const stored = localStorage.getItem('ghost_brief_articles');
        if (stored) {
          const articles = JSON.parse(stored);
          const filteredArticles = articles.filter(article => {
            const articleTime = new Date(article.publishedAt || article.fetchedAt || article.storedAt);
            return articleTime >= cutoffTime;
          });

          // Apply count limit
          const limitedArticles = filteredArticles
            .sort((a, b) => new Date(b.publishedAt || b.fetchedAt) - new Date(a.publishedAt || a.fetchedAt))
            .slice(0, policy.maxCount);

          localStorage.setItem('ghost_brief_articles', JSON.stringify(limitedArticles));
          removed = articles.length - limitedArticles.length;
        }
      }

      return {
        removed,
        errors,
        cutoffTime: cutoffTime.toISOString(),
        policy
      };
    } catch (error) {
      console.error('❌ Article cleanup failed:', error);
      return { removed: 0, errors: [error.message] };
    }
  }

  /**
   * Clean up excess briefings (keep only most recent)
   * @returns {Promise<Object>} Cleanup results
   */
  async cleanupBriefings() {
    try {
      const policy = this.retentionPolicies.briefings;
      let removed = 0;
      let errors = [];

      if (await this.isIndexedDBAvailable()) {
        const briefings = await indexedDBService.getBriefs();
        
        if (briefings.length > policy.maxCount) {
          // Sort by generation date and keep most recent
          const sortedBriefings = briefings.sort((a, b) => 
            new Date(b.generatedAt) - new Date(a.generatedAt)
          );
          
          const toRemove = sortedBriefings.slice(policy.maxCount);
          const removeIds = toRemove.map(briefing => briefing.id);
          
          for (const id of removeIds) {
            await indexedDBService.deleteBrief(id);
          }
          
          removed = removeIds.length;
        }
      } else {
        const stored = localStorage.getItem('ghost_brief_briefs');
        if (stored) {
          const briefings = JSON.parse(stored);
          
          if (briefings.length > policy.maxCount) {
            const sortedBriefings = briefings.sort((a, b) => 
              new Date(b.generatedAt) - new Date(a.generatedAt)
            );
            
            const limitedBriefings = sortedBriefings.slice(0, policy.maxCount);
            localStorage.setItem('ghost_brief_briefs', JSON.stringify(limitedBriefings));
            removed = briefings.length - limitedBriefings.length;
          }
        }
      }

      return {
        removed,
        errors,
        policy
      };
    } catch (error) {
      console.error('❌ Briefing cleanup failed:', error);
      return { removed: 0, errors: [error.message] };
    }
  }

  /**
   * Clean up cache data
   * @returns {Promise<Object>} Cleanup results
   */
  async cleanupCache() {
    try {
      const policy = this.retentionPolicies.cache;
      const cutoffTime = new Date(Date.now() - (policy.maxAge * 24 * 60 * 60 * 1000));
      
      let removed = 0;
      const cacheKeys = [];

      // Find cache-related localStorage keys
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.includes('cache') || key.includes('temp') || key.includes('_tmp'))) {
          cacheKeys.push(key);
        }
      }

      // Remove old cache entries
      cacheKeys.forEach(key => {
        try {
          const item = localStorage.getItem(key);
          if (item) {
            const parsed = JSON.parse(item);
            if (parsed.timestamp && new Date(parsed.timestamp) < cutoffTime) {
              localStorage.removeItem(key);
              removed++;
            }
          }
        } catch (e) {
          // If parsing fails, remove the item anyway
          localStorage.removeItem(key);
          removed++;
        }
      });

      return {
        removed,
        cutoffTime: cutoffTime.toISOString(),
        policy
      };
    } catch (error) {
      console.error('❌ Cache cleanup failed:', error);
      return { removed: 0, errors: [error.message] };
    }
  }

  /**
   * Clean up old logs
   * @returns {Promise<Object>} Cleanup results
   */
  async cleanupLogs() {
    try {
      // Clear console logs and any stored error logs
      // This is a placeholder - in a real implementation you might have
      // error logs stored in localStorage or IndexedDB
      
      const logKeys = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.includes('log') || key.includes('error'))) {
          logKeys.push(key);
        }
      }

      logKeys.forEach(key => {
        localStorage.removeItem(key);
      });

      return {
        removed: logKeys.length,
        policy: this.retentionPolicies.logs
      };
    } catch (error) {
      console.error('❌ Log cleanup failed:', error);
      return { removed: 0, errors: [error.message] };
    }
  }

  /**
   * Optimize storage performance
   * @returns {Promise<Object>} Optimization results
   */
  async optimizeStorage() {
    try {
      let spaceFreed = 0;
      const operations = [];

      if (await this.isIndexedDBAvailable()) {
        // IndexedDB optimization
        operations.push('IndexedDB compaction');
        // Note: IndexedDB doesn't have explicit compaction, but we can rebuild indexes
      } else {
        // localStorage optimization
        operations.push('localStorage optimization');
        
        // Calculate space before optimization
        const beforeSize = this.calculateLocalStorageSize();
        
        // Remove any corrupted entries
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          try {
            const item = localStorage.getItem(key);
            JSON.parse(item); // Test if valid JSON
          } catch (e) {
            keysToRemove.push(key);
          }
        }
        
        keysToRemove.forEach(key => localStorage.removeItem(key));
        
        const afterSize = this.calculateLocalStorageSize();
        spaceFreed = beforeSize - afterSize;
      }

      return {
        spaceFreed,
        operations,
        optimizedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('❌ Storage optimization failed:', error);
      return { spaceFreed: 0, errors: [error.message] };
    }
  }

  /**
   * Check if automatic cleanup is needed
   * @returns {Promise<Object>} Cleanup needs assessment
   */
  async assessCleanupNeeds() {
    try {
      const needs = {
        articles: false,
        briefings: false,
        cache: false,
        logs: false,
        urgent: false
      };

      // Check article cleanup needs
      const articlesLastCleanup = this.lastCleanup.articles;
      if (!articlesLastCleanup || 
          (Date.now() - new Date(articlesLastCleanup)) > (this.retentionPolicies.articles.cleanupInterval * 60 * 60 * 1000)) {
        needs.articles = true;
      }

      // Check cache cleanup needs
      const cacheLastCleanup = this.lastCleanup.cache;
      if (!cacheLastCleanup || 
          (Date.now() - new Date(cacheLastCleanup)) > (this.retentionPolicies.cache.cleanupInterval * 60 * 60 * 1000)) {
        needs.cache = true;
      }

      // Check if storage is getting full
      const storageUsage = await this.getStorageUsage();
      if (storageUsage.percentage > 85) {
        needs.urgent = true;
        needs.articles = true;
        needs.cache = true;
      }

      return needs;
    } catch (error) {
      console.error('❌ Failed to assess cleanup needs:', error);
      return { articles: false, briefings: false, cache: false, logs: false, urgent: false };
    }
  }

  /**
   * Get storage usage statistics
   * @returns {Promise<Object>} Storage usage info
   */
  async getStorageUsage() {
    try {
      if (await this.isIndexedDBAvailable()) {
        // IndexedDB usage estimation
        const articles = await indexedDBService.getArticles();
        const briefings = await indexedDBService.getBriefs();
        const feeds = await indexedDBService.getFeeds();
        
        const estimatedSize = 
          (articles.length * 2048) + // ~2KB per article
          (briefings.length * 5120) + // ~5KB per briefing
          (feeds.length * 512); // ~0.5KB per feed
        
        return {
          used: estimatedSize,
          available: 50 * 1024 * 1024, // 50MB estimate for IndexedDB
          percentage: Math.round((estimatedSize / (50 * 1024 * 1024)) * 100),
          type: 'IndexedDB'
        };
      } else {
        // localStorage usage
        const used = this.calculateLocalStorageSize();
        const available = 10 * 1024 * 1024; // 10MB typical localStorage limit
        
        return {
          used,
          available,
          percentage: Math.round((used / available) * 100),
          type: 'localStorage'
        };
      }
    } catch (error) {
      console.error('❌ Failed to get storage usage:', error);
      return { used: 0, available: 0, percentage: 0, type: 'unknown' };
    }
  }

  /**
   * Calculate localStorage size
   * @returns {number} Size in bytes
   */
  calculateLocalStorageSize() {
    let total = 0;
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        total += localStorage[key].length + key.length;
      }
    }
    return total;
  }

  /**
   * Update last cleanup times
   */
  updateLastCleanupTimes() {
    const now = new Date().toISOString();
    this.lastCleanup.articles = now;
    this.lastCleanup.briefings = now;
    this.lastCleanup.cache = now;
    this.lastCleanup.logs = now;
  }

  /**
   * Schedule automatic cleanup
   * @param {number} intervalHours - Cleanup interval in hours
   */
  scheduleAutomaticCleanup(intervalHours = 24) {
    // Clear any existing interval
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }

    // Set up new interval
    this.cleanupInterval = setInterval(async () => {
      const needs = await this.assessCleanupNeeds();
      if (needs.articles || needs.cache || needs.urgent) {
        console.log('🕐 Running scheduled cleanup...');
        await this.runCleanup();
      }
    }, intervalHours * 60 * 60 * 1000);

    console.log(`⏰ Automatic cleanup scheduled every ${intervalHours} hours`);
  }

  /**
   * Stop automatic cleanup
   */
  stopAutomaticCleanup() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
      console.log('⏹️ Automatic cleanup stopped');
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
   * Get retention policy for a data type
   * @param {string} dataType - Data type (articles, briefings, etc.)
   * @returns {Object} Retention policy
   */
  getRetentionPolicy(dataType) {
    return this.retentionPolicies[dataType] || null;
  }

  /**
   * Update retention policy
   * @param {string} dataType - Data type
   * @param {Object} policy - New policy
   * @returns {boolean} Success status
   */
  updateRetentionPolicy(dataType, policy) {
    try {
      if (!this.retentionPolicies[dataType]) {
        throw new Error(`Unknown data type: ${dataType}`);
      }

      this.retentionPolicies[dataType] = { ...this.retentionPolicies[dataType], ...policy };
      console.log(`✅ Updated retention policy for ${dataType}`);
      return true;
    } catch (error) {
      console.error('❌ Failed to update retention policy:', error);
      return false;
    }
  }
}

// Export singleton instance
export const retentionManagerService = new RetentionManagerService();