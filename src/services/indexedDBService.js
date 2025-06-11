// IndexedDB Service for Ghost Brief Intelligence Dashboard
// High-capacity storage service replacing localStorage limitations
// Maintains identical interface for seamless migration

/**
 * IndexedDB Service for Ghost Brief Intelligence Data
 * Provides reliable, high-capacity storage for intelligence articles and briefs
 */
export class IndexedDBService {
  constructor() {
    this.dbName = 'GhostBriefDB';
    this.dbVersion = 1;
    this.db = null;
    
    // Object store names
    this.stores = {
      ARTICLES: 'articles',
      BRIEFS: 'briefs',
      FEEDS: 'feeds',
      SETTINGS: 'settings',
      METADATA: 'metadata'
    };
    
    this.initializeDB();
  }

  /**
   * Initialize IndexedDB database with schema
   */
  async initializeDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);
      
      request.onerror = () => {
        console.error('IndexedDB failed to open:', request.error);
        reject(request.error);
      };
      
      request.onsuccess = () => {
        this.db = request.result;
        console.log('📊 IndexedDB initialized successfully');
        resolve(this.db);
      };
      
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        
        // Articles store - main intelligence articles
        if (!db.objectStoreNames.contains(this.stores.ARTICLES)) {
          const articlesStore = db.createObjectStore(this.stores.ARTICLES, { 
            keyPath: 'id',
            autoIncrement: false 
          });
          
          // Indexes for efficient querying
          articlesStore.createIndex('publishedAt', 'publishedAt', { unique: false });
          articlesStore.createIndex('fetchedAt', 'fetchedAt', { unique: false });
          articlesStore.createIndex('priority', 'intelligence.priority', { unique: false });
          articlesStore.createIndex('category', 'intelligence.categories', { 
            unique: false, 
            multiEntry: true 
          });
          articlesStore.createIndex('relevanceScore', 'intelligence.relevanceScore', { unique: false });
          articlesStore.createIndex('feedId', 'source.feedId', { unique: false });
          
          console.log('📰 Created articles object store with indexes');
        }
        
        // Briefs store - permanent intelligence briefings
        if (!db.objectStoreNames.contains(this.stores.BRIEFS)) {
          const briefsStore = db.createObjectStore(this.stores.BRIEFS, { 
            keyPath: 'id',
            autoIncrement: false 
          });
          
          briefsStore.createIndex('createdAt', 'createdAt', { unique: false });
          briefsStore.createIndex('priority', 'priority', { unique: false });
          briefsStore.createIndex('category', 'category', { unique: false });
          briefsStore.createIndex('source', 'source', { unique: false });
          
          console.log('🧠 Created briefs object store with indexes');
        }
        
        // RSS Feeds store
        if (!db.objectStoreNames.contains(this.stores.FEEDS)) {
          const feedsStore = db.createObjectStore(this.stores.FEEDS, { 
            keyPath: 'id',
            autoIncrement: false 
          });
          
          feedsStore.createIndex('isActive', 'isActive', { unique: false });
          feedsStore.createIndex('category', 'category', { unique: false });
          feedsStore.createIndex('status', 'status', { unique: false });
          
          console.log('📡 Created feeds object store with indexes');
        }
        
        // Settings store
        if (!db.objectStoreNames.contains(this.stores.SETTINGS)) {
          db.createObjectStore(this.stores.SETTINGS, { 
            keyPath: 'key',
            autoIncrement: false 
          });
          
          console.log('⚙️ Created settings object store');
        }
        
        // Metadata store
        if (!db.objectStoreNames.contains(this.stores.METADATA)) {
          db.createObjectStore(this.stores.METADATA, { 
            keyPath: 'key',
            autoIncrement: false 
          });
          
          console.log('📈 Created metadata object store');
        }
      };
    });
  }

  /**
   * Ensure database is ready before operations
   */
  async ensureDB() {
    if (!this.db) {
      await this.initializeDB();
    }
    return this.db;
  }

  /**
   * Generic method to get all items from a store
   */
  async getAllFromStore(storeName) {
    try {
      const db = await this.ensureDB();
      const transaction = db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      
      return new Promise((resolve, reject) => {
        const request = store.getAll();
        
        request.onsuccess = () => {
          resolve(request.result || []);
        };
        
        request.onerror = () => {
          console.error(`Error getting all from ${storeName}:`, request.error);
          reject(request.error);
        };
      });
    } catch (error) {
      console.error(`Error in getAllFromStore(${storeName}):`, error);
      return [];
    }
  }

  /**
   * Generic method to save all items to a store
   */
  async saveAllToStore(storeName, items) {
    try {
      const db = await this.ensureDB();
      const transaction = db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      
      // Clear existing data
      await new Promise((resolve, reject) => {
        const clearRequest = store.clear();
        clearRequest.onsuccess = () => resolve();
        clearRequest.onerror = () => reject(clearRequest.error);
      });
      
      // Add all items
      const promises = items.map(item => {
        return new Promise((resolve, reject) => {
          const request = store.add(item);
          request.onsuccess = () => resolve();
          request.onerror = () => reject(request.error);
        });
      });
      
      await Promise.all(promises);
      return true;
    } catch (error) {
      console.error(`Error saving to ${storeName}:`, error);
      return false;
    }
  }

  /**
   * Add items to store without clearing existing data
   */
  async addToStore(storeName, items) {
    try {
      const db = await this.ensureDB();
      const transaction = db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      
      const promises = items.map(item => {
        return new Promise((resolve, reject) => {
          const request = store.put(item); // Use put to handle duplicates
          request.onsuccess = () => resolve();
          request.onerror = () => reject(request.error);
        });
      });
      
      await Promise.all(promises);
      return true;
    } catch (error) {
      console.error(`Error adding to ${storeName}:`, error);
      return false;
    }
  }

  /**
   * Article Management - Compatible with existing StorageService interface
   */
  
  async getArticles() {
    const articles = await this.getAllFromStore(this.stores.ARTICLES);
    
    // Apply 30-day retention filter
    const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
    const recentArticles = articles.filter(article => {
      const articleDate = new Date(article.publishedAt || article.fetchedAt).getTime();
      return articleDate > thirtyDaysAgo;
    });
    
    // If we filtered out old articles, clean up the database
    if (recentArticles.length !== articles.length) {
      await this.saveAllToStore(this.stores.ARTICLES, recentArticles);
    }
    
    return recentArticles;
  }

  async saveArticles(articles) {
    // Filter articles to recent ones before saving
    const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
    const recentArticles = articles.filter(article => {
      const articleDate = new Date(article.publishedAt || article.fetchedAt).getTime();
      return articleDate > thirtyDaysAgo;
    });

    const success = await this.saveAllToStore(this.stores.ARTICLES, recentArticles);
    if (success) {
      await this.updateLastUpdate();
    }
    return success;
  }

  async addArticles(newArticles) {
    const existingArticles = await this.getArticles();
    const combined = [...existingArticles, ...newArticles];
    
    // Remove duplicates based on URL
    const unique = combined.filter((article, index, self) => 
      index === self.findIndex(a => a.url === article.url)
    );

    return await this.saveArticles(unique);
  }

  /**
   * Brief Management
   */
  
  async getBriefs() {
    return await this.getAllFromStore(this.stores.BRIEFS);
  }

  async saveBriefs(briefs) {
    return await this.saveAllToStore(this.stores.BRIEFS, briefs);
  }

  async addBrief(brief) {
    const existingBriefs = await this.getBriefs();
    
    // Generate ID if not provided
    if (!brief.id) {
      brief.id = `brief_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    
    // Add timestamps
    brief.createdAt = brief.createdAt || new Date().toISOString();
    brief.updatedAt = new Date().toISOString();
    
    const updatedBriefs = [...existingBriefs, brief];
    return await this.saveBriefs(updatedBriefs);
  }

  /**
   * RSS Feed Management
   */
  
  async getRSSFeeds() {
    return await this.getAllFromStore(this.stores.FEEDS);
  }

  async saveRSSFeeds(feeds) {
    return await this.saveAllToStore(this.stores.FEEDS, feeds);
  }

  async addRSSFeed(feed) {
    const existingFeeds = await this.getRSSFeeds();
    
    // Check for duplicates
    const isDuplicate = existingFeeds.some(f => f.url === feed.url || f.id === feed.id);
    if (isDuplicate) {
      return false;
    }
    
    const updatedFeeds = [...existingFeeds, feed];
    return await this.saveRSSFeeds(updatedFeeds);
  }

  async updateRSSFeed(feedId, updates) {
    const feeds = await this.getRSSFeeds();
    const updatedFeeds = feeds.map(feed => 
      feed.id === feedId ? { ...feed, ...updates } : feed
    );
    return await this.saveRSSFeeds(updatedFeeds);
  }

  async deleteRSSFeed(feedId) {
    const feeds = await this.getRSSFeeds();
    const filteredFeeds = feeds.filter(feed => feed.id !== feedId);
    return await this.saveRSSFeeds(filteredFeeds);
  }

  /**
   * Settings Management
   */
  
  async getSettings() {
    try {
      const db = await this.ensureDB();
      const transaction = db.transaction([this.stores.SETTINGS], 'readonly');
      const store = transaction.objectStore(this.stores.SETTINGS);
      
      return new Promise((resolve, reject) => {
        const request = store.get('userSettings');
        
        request.onsuccess = () => {
          const result = request.result;
          resolve(result ? result.value : this.getDefaultSettings());
        };
        
        request.onerror = () => {
          console.error('Error getting settings:', request.error);
          resolve(this.getDefaultSettings());
        };
      });
    } catch (error) {
      console.error('Error in getSettings:', error);
      return this.getDefaultSettings();
    }
  }

  async saveSettings(settings) {
    try {
      const db = await this.ensureDB();
      const transaction = db.transaction([this.stores.SETTINGS], 'readwrite');
      const store = transaction.objectStore(this.stores.SETTINGS);
      
      return new Promise((resolve, reject) => {
        const request = store.put({
          key: 'userSettings',
          value: settings,
          updatedAt: new Date().toISOString()
        });
        
        request.onsuccess = () => resolve(true);
        request.onerror = () => {
          console.error('Error saving settings:', request.error);
          resolve(false);
        };
      });
    } catch (error) {
      console.error('Error in saveSettings:', error);
      return false;
    }
  }

  /**
   * Metadata Management
   */
  
  async getLastUpdate() {
    try {
      const db = await this.ensureDB();
      const transaction = db.transaction([this.stores.METADATA], 'readonly');
      const store = transaction.objectStore(this.stores.METADATA);
      
      return new Promise((resolve, reject) => {
        const request = store.get('lastUpdate');
        
        request.onsuccess = () => {
          const result = request.result;
          resolve(result ? result.value : null);
        };
        
        request.onerror = () => {
          console.error('Error getting last update:', request.error);
          resolve(null);
        };
      });
    } catch (error) {
      console.error('Error in getLastUpdate:', error);
      return null;
    }
  }

  async updateLastUpdate() {
    try {
      const db = await this.ensureDB();
      const transaction = db.transaction([this.stores.METADATA], 'readwrite');
      const store = transaction.objectStore(this.stores.METADATA);
      
      const timestamp = new Date().toISOString();
      
      return new Promise((resolve, reject) => {
        const request = store.put({
          key: 'lastUpdate',
          value: timestamp
        });
        
        request.onsuccess = () => resolve(timestamp);
        request.onerror = () => {
          console.error('Error updating last update:', request.error);
          resolve(null);
        };
      });
    } catch (error) {
      console.error('Error in updateLastUpdate:', error);
      return null;
    }
  }

  /**
   * Storage Statistics
   */
  
  async getStorageStats() {
    try {
      const articles = await this.getAllFromStore(this.stores.ARTICLES);
      const briefs = await this.getAllFromStore(this.stores.BRIEFS);
      const feeds = await this.getAllFromStore(this.stores.FEEDS);
      
      // Calculate storage usage (estimate)
      const articlesSize = JSON.stringify(articles).length;
      const briefsSize = JSON.stringify(briefs).length;
      const feedsSize = JSON.stringify(feeds).length;
      const totalSize = articlesSize + briefsSize + feedsSize;
      
      return {
        articles: articles.length,
        briefs: briefs.length,
        feeds: feeds.length,
        totalSize: totalSize,
        storageType: 'IndexedDB',
        capacity: 'Unlimited*',
        lastUpdate: await this.getLastUpdate()
      };
    } catch (error) {
      console.error('Error getting storage stats:', error);
      return {
        articles: 0,
        briefs: 0,
        feeds: 0,
        totalSize: 0,
        storageType: 'IndexedDB',
        capacity: 'Unlimited*',
        lastUpdate: null
      };
    }
  }

  /**
   * Data Cleanup
   */
  
  async cleanupOldData() {
    console.log('🧹 Starting IndexedDB cleanup...');
    
    // Clean up old articles (already handled in getArticles)
    const articles = await this.getArticles();
    console.log(`📰 Cleaned articles: ${articles.length} remaining`);
    
    // Could add more cleanup logic here for other data types
    return true;
  }

  /**
   * Default Settings (maintain compatibility)
   */
  
  getDefaultSettings() {
    return {
      autoRefreshInterval: 15, // minutes
      relevanceThreshold: 40,
      enableNotifications: true,
      theme: 'intelligence',
      feedHealthMonitoring: true,
      maxArticlesPerFeed: 50,
      retentionDays: 30
    };
  }
}

// Export singleton instance
export const indexedDBService = new IndexedDBService();