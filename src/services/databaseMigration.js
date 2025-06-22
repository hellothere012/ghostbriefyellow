// Database Migration Service
// Handles migration from IndexedDB/localStorage to Prisma database

import { storageService } from './storageService';
import { databaseService } from './databaseService';

export class DatabaseMigrationService {
  constructor() {
    this.migrationStatus = {
      started: false,
      completed: false,
      errors: [],
      summary: null
    };
  }

  async migrateToDatabase() {
    try {
      console.log('🔄 Starting migration from IndexedDB to database...');
      this.migrationStatus.started = true;

      const summary = {
        feeds: { migrated: 0, skipped: 0, errors: 0 },
        signals: { migrated: 0, skipped: 0, errors: 0 },
        briefs: { migrated: 0, skipped: 0, errors: 0 }
      };

      // Step 1: Initialize default feeds in database
      try {
        console.log('📡 Initializing default RSS feeds...');
        await databaseService.initializeDefaultFeeds();
        console.log('✅ Default feeds initialized');
      } catch (error) {
        console.warn('⚠️ Default feeds initialization failed:', error.message);
        this.migrationStatus.errors.push(`Feed initialization: ${error.message}`);
      }

      // Step 2: Migrate existing RSS feeds from IndexedDB
      try {
        const existingFeeds = await storageService.getRSSFeeds();
        console.log(`📡 Found ${existingFeeds.length} existing feeds to migrate`);

        for (const feed of existingFeeds) {
          try {
            // Convert IndexedDB feed format to database format
            const feedData = {
              name: feed.name,
              url: feed.url,
              category: feed.category || 'GENERAL',
              tags: feed.tags || [],
              isActive: feed.isActive !== false,
              credibilityScore: feed.credibilityScore || 70
            };

            await databaseService.createFeed(feedData);
            summary.feeds.migrated++;
            console.log(`✅ Migrated feed: ${feed.name}`);

          } catch (error) {
            summary.feeds.errors++;
            console.error(`❌ Failed to migrate feed ${feed.name}:`, error.message);
            this.migrationStatus.errors.push(`Feed ${feed.name}: ${error.message}`);
          }
        }
      } catch (error) {
        console.error('❌ Feed migration failed:', error);
        this.migrationStatus.errors.push(`Feed migration: ${error.message}`);
      }

      // Step 3: Migrate articles as signals
      try {
        const existingArticles = await storageService.getArticles();
        console.log(`📰 Found ${existingArticles.length} existing articles to migrate as signals`);

        for (const article of existingArticles) {
          try {
            // Convert article to signal format
            const signalData = {
              title: article.title || 'Untitled',
              summary: article.intelligence?.summary || article.content?.substring(0, 200) + '...',
              content: article.content || '',
              sourceUrl: article.url || article.link || `migrated-${Date.now()}-${Math.random()}`,
              sourceType: 'RSS_FEED_MIGRATED',
              escalationRisk: this.mapPriorityToEscalation(article.intelligence?.priority),
              credibility: article.source?.credibilityScore || 50,
              signalScore: article.intelligence?.relevanceScore || 30,
              category: this.mapCategoriesToDatabase(article.intelligence?.categories),
              region: this.extractRegions(article.intelligence?.entities?.countries)
            };

            await databaseService.createSignal(signalData);
            summary.signals.migrated++;

            if (summary.signals.migrated % 10 === 0) {
              console.log(`📊 Migrated ${summary.signals.migrated} signals so far...`);
            }

          } catch (error) {
            summary.signals.errors++;
            if (summary.signals.errors < 5) { // Only log first few errors
              console.error(`❌ Failed to migrate article ${article.title}:`, error.message);
              this.migrationStatus.errors.push(`Article ${article.title}: ${error.message}`);
            }
          }
        }
      } catch (error) {
        console.error('❌ Article migration failed:', error);
        this.migrationStatus.errors.push(`Article migration: ${error.message}`);
      }

      // Step 4: Migrate briefs
      try {
        const existingBriefs = await storageService.getBriefs();
        console.log(`🧠 Found ${existingBriefs.length} existing briefs to migrate`);

        for (const brief of existingBriefs) {
          try {
            const briefData = {
              title: brief.title || 'Untitled Brief',
              summary: brief.summary || brief.content?.substring(0, 500) + '...',
              status: 'PUBLISHED',
              classification: 'UNCLASSIFIED',
              keywords: brief.tags || [],
              version: 1,
              datePublished: brief.createdAt ? new Date(brief.createdAt) : new Date(),
              relatedSignalIds: []
            };

            await databaseService.createBrief(briefData);
            summary.briefs.migrated++;
            console.log(`✅ Migrated brief: ${brief.title}`);

          } catch (error) {
            summary.briefs.errors++;
            console.error(`❌ Failed to migrate brief ${brief.title}:`, error.message);
            this.migrationStatus.errors.push(`Brief ${brief.title}: ${error.message}`);
          }
        }
      } catch (error) {
        console.error('❌ Brief migration failed:', error);
        this.migrationStatus.errors.push(`Brief migration: ${error.message}`);
      }

      this.migrationStatus.completed = true;
      this.migrationStatus.summary = summary;

      console.log('✅ Migration completed!');
      console.log('📊 Migration Summary:', summary);

      return {
        success: true,
        summary,
        errors: this.migrationStatus.errors
      };

    } catch (error) {
      console.error('❌ Migration failed:', error);
      this.migrationStatus.errors.push(`Migration failed: ${error.message}`);
      throw error;
    }
  }

  mapPriorityToEscalation(priority) {
    switch(priority?.toUpperCase()) {
      case 'CRITICAL': return 'CRITICAL';
      case 'HIGH': return 'HIGH';
      case 'MEDIUM': return 'MEDIUM';
      case 'LOW': return 'LOW';
      default: return 'LOW';
    }
  }

  mapCategoriesToDatabase(categories) {
    if (!Array.isArray(categories)) return ['GENERAL'];
    
    const categoryMap = {
      'MILITARY': 'MILITARY',
      'TECHNOLOGY': 'TECHNOLOGY',
      'CYBERSECURITY': 'CYBERSECURITY',
      'GEOPOLITICS': 'GEOPOLITICS',
      'FINANCE': 'FINANCE',
      'HEALTH': 'HEALTH',
      'SCIENCE': 'SCIENCE'
    };

    const mapped = categories.map(cat => categoryMap[cat?.toUpperCase()] || 'GENERAL');
    return mapped.length > 0 ? mapped : ['GENERAL'];
  }

  extractRegions(countries) {
    if (!Array.isArray(countries)) return [];
    
    // Map common country variations to standard names
    const countryMap = {
      'US': 'United States',
      'USA': 'United States',
      'UK': 'United Kingdom',
      'USSR': 'Russia',
      'PRC': 'China',
      'DPRK': 'North Korea'
    };

    return countries.map(country => countryMap[country] || country).filter(Boolean);
  }

  getMigrationStatus() {
    return this.migrationStatus;
  }

  async checkMigrationNeeded() {
    try {
      // Check if we have data in IndexedDB but none in database
      const [localArticles, localBriefs, dbStats] = await Promise.all([
        storageService.getArticles(),
        storageService.getBriefs(),
        databaseService.getStats()
      ]);

      const hasLocalData = localArticles.length > 0 || localBriefs.length > 0;
      const hasDbData = dbStats.stats?.overview?.totalSignals > 0 || dbStats.stats?.overview?.totalBriefs > 0;

      return {
        needed: hasLocalData && !hasDbData,
        localData: {
          articles: localArticles.length,
          briefs: localBriefs.length
        },
        databaseData: {
          signals: dbStats.stats?.overview?.totalSignals || 0,
          briefs: dbStats.stats?.overview?.totalBriefs || 0
        }
      };

    } catch (error) {
      console.error('Error checking migration status:', error);
      return { needed: false, error: error.message };
    }
  }
}

// Export singleton instance
export const databaseMigrationService = new DatabaseMigrationService();