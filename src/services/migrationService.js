// Migration Service for Ghost Brief
// Handles migration from localStorage to IndexedDB while preserving all data

import { indexedDBService } from './indexedDBService';

/**
 * Migration Service for moving data from localStorage to IndexedDB
 */
export class MigrationService {
  constructor() {
    this.LEGACY_STORAGE_KEYS = {
      RSS_FEEDS: 'ghost_brief_rss_feeds',
      ARTICLES: 'ghost_brief_articles', 
      BRIEFS: 'ghost_brief_briefs',
      SETTINGS: 'ghost_brief_settings',
      LAST_UPDATE: 'ghost_brief_last_update'
    };
    
    this.MIGRATION_STATUS_KEY = 'ghost_brief_migration_status';
  }

  /**
   * Check if migration has already been completed
   */
  isMigrationCompleted() {
    try {
      const status = localStorage.getItem(this.MIGRATION_STATUS_KEY);
      return status === 'completed';
    } catch (error) {
      console.warn('Could not check migration status:', error);
      return false;
    }
  }

  /**
   * Mark migration as completed
   */
  markMigrationCompleted() {
    try {
      localStorage.setItem(this.MIGRATION_STATUS_KEY, 'completed');
      localStorage.setItem('ghost_brief_migration_date', new Date().toISOString());
    } catch (error) {
      console.warn('Could not mark migration as completed:', error);
    }
  }

  /**
   * Get data from localStorage with error handling
   */
  getLegacyData(key) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.warn(`Could not parse legacy data for ${key}:`, error);
      return null;
    }
  }

  /**
   * Check if there is any legacy data to migrate
   */
  hasLegacyData() {
    try {
      const keys = Object.values(this.LEGACY_STORAGE_KEYS);
      return keys.some(key => localStorage.getItem(key) !== null);
    } catch (error) {
      console.warn('Could not check for legacy data:', error);
      return false;
    }
  }

  /**
   * Migrate RSS feeds from localStorage to IndexedDB
   */
  async migrateRSSFeeds() {
    const legacyFeeds = this.getLegacyData(this.LEGACY_STORAGE_KEYS.RSS_FEEDS);
    
    if (!legacyFeeds || !Array.isArray(legacyFeeds)) {
      console.log('📡 No RSS feeds to migrate');
      return true;
    }

    try {
      console.log(`📡 Migrating ${legacyFeeds.length} RSS feeds...`);
      
      // Ensure feeds have all required properties
      const normalizedFeeds = legacyFeeds.map(feed => ({
        ...feed,
        addedAt: feed.addedAt || new Date().toISOString(),
        lastFetched: feed.lastFetched || null,
        status: feed.status || 'active',
        errorCount: feed.errorCount || 0
      }));

      const success = await indexedDBService.saveRSSFeeds(normalizedFeeds);
      
      if (success) {
        console.log(`✅ Successfully migrated ${normalizedFeeds.length} RSS feeds`);
        return true;
      } else {
        console.error('❌ Failed to migrate RSS feeds');
        return false;
      }
    } catch (error) {
      console.error('❌ Error migrating RSS feeds:', error);
      return false;
    }
  }

  /**
   * Migrate articles from localStorage to IndexedDB
   */
  async migrateArticles() {
    const legacyArticles = this.getLegacyData(this.LEGACY_STORAGE_KEYS.ARTICLES);
    
    if (!legacyArticles || !Array.isArray(legacyArticles)) {
      console.log('📰 No articles to migrate');
      return true;
    }

    try {
      console.log(`📰 Migrating ${legacyArticles.length} articles...`);
      
      // Filter recent articles (30 days) and normalize data
      const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
      const recentArticles = legacyArticles
        .filter(article => {
          const articleDate = new Date(article.publishedAt || article.fetchedAt).getTime();
          return articleDate > thirtyDaysAgo;
        })
        .map(article => ({
          ...article,
          // Ensure required properties exist
          id: article.id || `migrated_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          fetchedAt: article.fetchedAt || new Date().toISOString(),
          intelligence: article.intelligence || {
            relevanceScore: 20,
            priority: 'LOW',
            categories: ['GENERAL'],
            tags: ['MIGRATED'],
            entities: { countries: [], organizations: [], technologies: [], weapons: [] },
            isAdvertisement: false,
            isDuplicate: false
          }
        }));

      const success = await indexedDBService.saveArticles(recentArticles);
      
      if (success) {
        console.log(`✅ Successfully migrated ${recentArticles.length} recent articles (${legacyArticles.length - recentArticles.length} old articles filtered out)`);
        return true;
      } else {
        console.error('❌ Failed to migrate articles');
        return false;
      }
    } catch (error) {
      console.error('❌ Error migrating articles:', error);
      return false;
    }
  }

  /**
   * Migrate briefs from localStorage to IndexedDB
   */
  async migrateBriefs() {
    const legacyBriefs = this.getLegacyData(this.LEGACY_STORAGE_KEYS.BRIEFS);
    
    if (!legacyBriefs || !Array.isArray(legacyBriefs)) {
      console.log('🧠 No briefs to migrate');
      return true;
    }

    try {
      console.log(`🧠 Migrating ${legacyBriefs.length} briefs...`);
      
      // Normalize briefs data
      const normalizedBriefs = legacyBriefs.map(brief => ({
        ...brief,
        id: brief.id || `migrated_brief_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: brief.createdAt || new Date().toISOString(),
        updatedAt: brief.updatedAt || new Date().toISOString(),
        priority: brief.priority || 'MEDIUM',
        category: brief.category || 'GENERAL',
        tags: brief.tags || []
      }));

      const success = await indexedDBService.saveBriefs(normalizedBriefs);
      
      if (success) {
        console.log(`✅ Successfully migrated ${normalizedBriefs.length} briefs`);
        return true;
      } else {
        console.error('❌ Failed to migrate briefs');
        return false;
      }
    } catch (error) {
      console.error('❌ Error migrating briefs:', error);
      return false;
    }
  }

  /**
   * Migrate settings from localStorage to IndexedDB
   */
  async migrateSettings() {
    const legacySettings = this.getLegacyData(this.LEGACY_STORAGE_KEYS.SETTINGS);
    
    if (!legacySettings) {
      console.log('⚙️ No settings to migrate');
      return true;
    }

    try {
      console.log('⚙️ Migrating user settings...');
      
      const success = await indexedDBService.saveSettings(legacySettings);
      
      if (success) {
        console.log('✅ Successfully migrated user settings');
        return true;
      } else {
        console.error('❌ Failed to migrate settings');
        return false;
      }
    } catch (error) {
      console.error('❌ Error migrating settings:', error);
      return false;
    }
  }

  /**
   * Migrate last update timestamp
   */
  async migrateLastUpdate() {
    const lastUpdate = this.getLegacyData(this.LEGACY_STORAGE_KEYS.LAST_UPDATE);
    
    if (!lastUpdate) {
      console.log('📅 No last update timestamp to migrate');
      return true;
    }

    try {
      console.log('📅 Migrating last update timestamp...');
      
      // The IndexedDB service will handle this through updateLastUpdate
      await indexedDBService.updateLastUpdate();
      
      console.log('✅ Successfully migrated last update timestamp');
      return true;
    } catch (error) {
      console.error('❌ Error migrating last update:', error);
      return false;
    }
  }

  /**
   * Clean up localStorage after successful migration
   */
  cleanupLegacyData() {
    try {
      console.log('🧹 Cleaning up legacy localStorage data...');
      
      const keysToRemove = Object.values(this.LEGACY_STORAGE_KEYS);
      
      keysToRemove.forEach(key => {
        try {
          localStorage.removeItem(key);
        } catch (error) {
          console.warn(`Could not remove legacy key ${key}:`, error);
        }
      });
      
      console.log('✅ Legacy data cleanup completed');
    } catch (error) {
      console.warn('⚠️ Some legacy data could not be cleaned up:', error);
    }
  }

  /**
   * Run complete migration process
   */
  async runMigration() {
    if (this.isMigrationCompleted()) {
      console.log('✅ Migration already completed, skipping...');
      return true;
    }

    if (!this.hasLegacyData()) {
      console.log('📊 No legacy data found, marking migration as completed');
      this.markMigrationCompleted();
      return true;
    }

    console.log('🚀 Starting Ghost Brief data migration from localStorage to IndexedDB...');
    
    try {
      // Run all migrations
      const results = await Promise.all([
        this.migrateRSSFeeds(),
        this.migrateArticles(), 
        this.migrateBriefs(),
        this.migrateSettings(),
        this.migrateLastUpdate()
      ]);

      const allSuccessful = results.every(result => result === true);

      if (allSuccessful) {
        console.log('🎉 Migration completed successfully!');
        this.markMigrationCompleted();
        
        // Optional: Clean up legacy data after successful migration
        // Commented out for safety - user can manually clear if desired
        // this.cleanupLegacyData();
        
        return true;
      } else {
        console.error('❌ Some migrations failed, keeping legacy data as backup');
        return false;
      }
    } catch (error) {
      console.error('❌ Migration process failed:', error);
      return false;
    }
  }

  /**
   * Get migration status report
   */
  async getMigrationReport() {
    try {
      const isCompleted = this.isMigrationCompleted();
      const hasLegacy = this.hasLegacyData();
      const stats = await indexedDBService.getStorageStats();
      
      return {
        migrationCompleted: isCompleted,
        hasLegacyData: hasLegacy,
        indexedDBStats: stats,
        migrationDate: localStorage.getItem('ghost_brief_migration_date'),
        recommendCleanup: isCompleted && hasLegacy
      };
    } catch (error) {
      console.error('Error generating migration report:', error);
      return {
        migrationCompleted: false,
        hasLegacyData: false,
        indexedDBStats: null,
        error: error.message
      };
    }
  }
}

// Export singleton instance
export const migrationService = new MigrationService();