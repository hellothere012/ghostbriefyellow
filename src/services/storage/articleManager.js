// Article Management Module for Ghost Brief
// Specialized article storage operations and lifecycle management

import { indexedDBService } from '../indexedDBService.js';

/**
 * Article Manager Service
 * Handles all article-related storage operations with IndexedDB
 */
export class ArticleManagerService {
  constructor() {
    this.STORAGE_KEY = 'ghost_brief_articles';
    this.ARTICLE_RETENTION_DAYS = 30;
    this.MAX_ARTICLES_PER_BATCH = 100;
  }

  /**
   * Save multiple articles to storage
   * @param {Array} articles - Articles to save
   * @returns {Promise<boolean>} Success status
   */
  async saveArticles(articles) {
    try {
      if (!Array.isArray(articles) || articles.length === 0) {
        return true;
      }

      console.log(`💾 Saving ${articles.length} articles to storage...`);

      // Use IndexedDB for better performance
      if (await this.isIndexedDBAvailable()) {
        const articlesWithTimestamp = articles.map(article => ({
          ...article,
          storedAt: new Date().toISOString()
        }));

        await indexedDBService.saveArticles(articlesWithTimestamp);
        console.log(`✅ Successfully saved ${articles.length} articles to IndexedDB`);
      } else {
        // Fallback to localStorage with size management
        await this.saveArticlesToLocalStorage(articles);
      }

      // Trigger cleanup after saving
      await this.cleanupOldArticles();
      
      return true;
    } catch (error) {
      console.error('❌ Failed to save articles:', error);
      return false;
    }
  }

  /**
   * Get all articles from storage
   * @returns {Promise<Array>} Array of articles
   */
  async getArticles() {
    try {
      if (await this.isIndexedDBAvailable()) {
        const articles = await indexedDBService.getArticles();
        console.log(`📖 Retrieved ${articles.length} articles from IndexedDB`);
        return articles;
      } else {
        return this.getArticlesFromLocalStorage();
      }
    } catch (error) {
      console.error('❌ Failed to get articles:', error);
      return [];
    }
  }

  /**
   * Get articles with filtering and pagination
   * @param {Object} options - Filtering options
   * @returns {Promise<Array>} Filtered articles
   */
  async getFilteredArticles(options = {}) {
    try {
      const {
        category,
        priority,
        minScore,
        maxAge,
        limit,
        offset = 0,
        sortBy = 'publishedAt',
        sortOrder = 'desc'
      } = options;

      let articles = await this.getArticles();

      // Apply filters
      if (category) {
        articles = articles.filter(article => 
          article.intelligence?.categories?.includes(category)
        );
      }

      if (priority) {
        articles = articles.filter(article => 
          article.intelligence?.priority === priority
        );
      }

      if (minScore !== undefined) {
        articles = articles.filter(article => 
          (article.intelligence?.relevanceScore || 0) >= minScore
        );
      }

      if (maxAge) {
        const maxAgeMs = maxAge * 60 * 60 * 1000; // Convert hours to ms
        const cutoffTime = new Date(Date.now() - maxAgeMs);
        articles = articles.filter(article => {
          const articleTime = new Date(article.publishedAt || article.fetchedAt);
          return articleTime >= cutoffTime;
        });
      }

      // Sort articles
      articles.sort((a, b) => {
        const aValue = this.getSortValue(a, sortBy);
        const bValue = this.getSortValue(b, sortBy);
        
        if (sortOrder === 'desc') {
          return bValue - aValue;
        } else {
          return aValue - bValue;
        }
      });

      // Apply pagination
      if (limit) {
        articles = articles.slice(offset, offset + limit);
      }

      return articles;
    } catch (error) {
      console.error('❌ Failed to get filtered articles:', error);
      return [];
    }
  }

  /**
   * Save articles to localStorage with size management
   * @param {Array} articles - Articles to save
   */
  async saveArticlesToLocalStorage(articles) {
    try {
      const existingArticles = this.getArticlesFromLocalStorage();
      const allArticles = [...existingArticles, ...articles];
      
      // Remove duplicates based on URL
      const uniqueArticles = allArticles.reduce((unique, article) => {
        const exists = unique.find(existing => existing.url === article.url);
        if (!exists) {
          unique.push({
            ...article,
            storedAt: new Date().toISOString()
          });
        }
        return unique;
      }, []);

      // Limit articles to prevent localStorage overflow
      const limitedArticles = uniqueArticles
        .sort((a, b) => new Date(b.publishedAt || b.fetchedAt) - new Date(a.publishedAt || a.fetchedAt))
        .slice(0, 1000); // Keep most recent 1000 articles

      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(limitedArticles));
      console.log(`✅ Saved ${articles.length} articles to localStorage (total: ${limitedArticles.length})`);
    } catch (error) {
      console.error('❌ Failed to save articles to localStorage:', error);
      // Try to clear some space and retry
      await this.emergencyCleanup();
      throw error;
    }
  }

  /**
   * Get articles from localStorage
   * @returns {Array} Articles array
   */
  getArticlesFromLocalStorage() {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('❌ Failed to parse articles from localStorage:', error);
      return [];
    }
  }

  /**
   * Delete specific articles
   * @param {Array} articleIds - Article IDs to delete
   * @returns {Promise<boolean>} Success status
   */
  async deleteArticles(articleIds) {
    try {
      if (!Array.isArray(articleIds) || articleIds.length === 0) {
        return true;
      }

      console.log(`🗑️ Deleting ${articleIds.length} articles...`);

      if (await this.isIndexedDBAvailable()) {
        await indexedDBService.deleteArticles(articleIds);
      } else {
        const articles = this.getArticlesFromLocalStorage();
        const filteredArticles = articles.filter(article => !articleIds.includes(article.id));
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filteredArticles));
      }

      console.log(`✅ Successfully deleted ${articleIds.length} articles`);
      return true;
    } catch (error) {
      console.error('❌ Failed to delete articles:', error);
      return false;
    }
  }

  /**
   * Clean up old articles based on retention policy
   * @returns {Promise<number>} Number of articles cleaned up
   */
  async cleanupOldArticles() {
    try {
      const retentionMs = this.ARTICLE_RETENTION_DAYS * 24 * 60 * 60 * 1000;
      const cutoffTime = new Date(Date.now() - retentionMs);
      
      const articles = await this.getArticles();
      const oldArticleIds = articles
        .filter(article => {
          const articleTime = new Date(article.publishedAt || article.fetchedAt || article.storedAt);
          return articleTime < cutoffTime;
        })
        .map(article => article.id);

      if (oldArticleIds.length > 0) {
        console.log(`🧹 Cleaning up ${oldArticleIds.length} old articles (older than ${this.ARTICLE_RETENTION_DAYS} days)`);
        await this.deleteArticles(oldArticleIds);
        return oldArticleIds.length;
      }

      return 0;
    } catch (error) {
      console.error('❌ Failed to cleanup old articles:', error);
      return 0;
    }
  }

  /**
   * Get article statistics
   * @returns {Promise<Object>} Article statistics
   */
  async getArticleStatistics() {
    try {
      const articles = await this.getArticles();
      
      const stats = {
        total: articles.length,
        byPriority: {
          CRITICAL: 0,
          HIGH: 0,
          MEDIUM: 0,
          LOW: 0
        },
        byCategory: {},
        averageScore: 0,
        oldestArticle: null,
        newestArticle: null
      };

      let totalScore = 0;

      articles.forEach(article => {
        // Priority distribution
        const priority = article.intelligence?.priority || 'LOW';
        stats.byPriority[priority]++;

        // Category distribution
        const categories = article.intelligence?.categories || ['Unknown'];
        categories.forEach(category => {
          stats.byCategory[category] = (stats.byCategory[category] || 0) + 1;
        });

        // Score calculation
        const score = article.intelligence?.relevanceScore || 0;
        totalScore += score;

        // Age tracking
        const articleTime = new Date(article.publishedAt || article.fetchedAt);
        if (!stats.oldestArticle || articleTime < new Date(stats.oldestArticle.publishedAt || stats.oldestArticle.fetchedAt)) {
          stats.oldestArticle = article;
        }
        if (!stats.newestArticle || articleTime > new Date(stats.newestArticle.publishedAt || stats.newestArticle.fetchedAt)) {
          stats.newestArticle = article;
        }
      });

      stats.averageScore = articles.length > 0 ? Math.round(totalScore / articles.length) : 0;

      return stats;
    } catch (error) {
      console.error('❌ Failed to get article statistics:', error);
      return { total: 0, byPriority: {}, byCategory: {}, averageScore: 0 };
    }
  }

  /**
   * Emergency cleanup when storage is full
   */
  async emergencyCleanup() {
    try {
      console.log('🚨 Emergency cleanup: Storage space low');
      
      const articles = await this.getArticles();
      
      // Remove oldest 20% of articles
      const removeCount = Math.floor(articles.length * 0.2);
      const sortedArticles = articles.sort((a, b) => 
        new Date(a.publishedAt || a.fetchedAt) - new Date(b.publishedAt || b.fetchedAt)
      );
      
      const articlesToRemove = sortedArticles.slice(0, removeCount).map(a => a.id);
      await this.deleteArticles(articlesToRemove);
      
      console.log(`🧹 Emergency cleanup removed ${removeCount} oldest articles`);
    } catch (error) {
      console.error('❌ Emergency cleanup failed:', error);
    }
  }

  /**
   * Get sort value for article sorting
   * @param {Object} article - Article object
   * @param {string} sortBy - Sort field
   * @returns {number} Sort value
   */
  getSortValue(article, sortBy) {
    switch (sortBy) {
      case 'publishedAt':
        return new Date(article.publishedAt || article.fetchedAt).getTime();
      case 'relevanceScore':
        return article.intelligence?.relevanceScore || 0;
      case 'priority':
        const priorityValues = { CRITICAL: 4, HIGH: 3, MEDIUM: 2, LOW: 1 };
        return priorityValues[article.intelligence?.priority] || 1;
      default:
        return 0;
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
   * Export articles for backup
   * @returns {Promise<Object>} Export data
   */
  async exportArticles() {
    try {
      const articles = await this.getArticles();
      const stats = await this.getArticleStatistics();
      
      return {
        articles,
        statistics: stats,
        exportedAt: new Date().toISOString(),
        version: '1.0'
      };
    } catch (error) {
      console.error('❌ Failed to export articles:', error);
      return { articles: [], statistics: {}, exportedAt: new Date().toISOString() };
    }
  }

  /**
   * Import articles from backup
   * @param {Object} exportData - Exported article data
   * @returns {Promise<boolean>} Success status
   */
  async importArticles(exportData) {
    try {
      if (!exportData.articles || !Array.isArray(exportData.articles)) {
        throw new Error('Invalid export data format');
      }

      console.log(`📥 Importing ${exportData.articles.length} articles...`);
      await this.saveArticles(exportData.articles);
      
      console.log(`✅ Successfully imported ${exportData.articles.length} articles`);
      return true;
    } catch (error) {
      console.error('❌ Failed to import articles:', error);
      return false;
    }
  }
}

// Export singleton instance
export const articleManagerService = new ArticleManagerService();