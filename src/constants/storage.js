/**
 * Storage Configuration Constants
 * Centralized configuration for IndexedDB schemas, keys, and storage policies
 */

// Database Configuration
export const DATABASE_CONFIG = {
  NAME: 'GhostBriefDB',
  VERSION: 1,
  DESCRIPTION: 'Ghost Brief Intelligence Platform Database'
};

// Object Store Names
export const STORE_NAMES = {
  ARTICLES: 'articles',
  BRIEFS: 'briefs', 
  FEEDS: 'feeds',
  SETTINGS: 'settings',
  METADATA: 'metadata'
};

// Index Configurations
export const INDEX_CONFIG = {
  [STORE_NAMES.ARTICLES]: [
    { name: 'date', keyPath: 'fetchedAt', options: {} },
    { name: 'priority', keyPath: 'intelligence.priority', options: {} },
    { name: 'category', keyPath: 'intelligence.categories', options: { multiEntry: true } },
    { name: 'feedId', keyPath: 'source.feedId', options: {} },
    { name: 'relevanceScore', keyPath: 'intelligence.relevanceScore', options: {} }
  ],
  [STORE_NAMES.BRIEFS]: [
    { name: 'date', keyPath: 'generatedAt', options: {} },
    { name: 'type', keyPath: 'type', options: {} },
    { name: 'quality', keyPath: 'quality.overallScore', options: {} }
  ],
  [STORE_NAMES.FEEDS]: [
    { name: 'category', keyPath: 'category', options: {} },
    { name: 'isActive', keyPath: 'isActive', options: {} },
    { name: 'lastFetched', keyPath: 'lastFetched', options: {} },
    { name: 'credibility', keyPath: 'credibilityScore', options: {} }
  ],
  [STORE_NAMES.SETTINGS]: [
    { name: 'category', keyPath: 'category', options: {} }
  ],
  [STORE_NAMES.METADATA]: [
    { name: 'type', keyPath: 'type', options: {} }
  ]
};

// Storage Keys for Legacy localStorage Migration
export const STORAGE_KEYS = {
  ARTICLES: 'ghost_brief_articles',
  BRIEFS: 'ghost_brief_briefs',
  FEEDS: 'ghost_brief_feeds',
  SETTINGS: 'ghost_brief_settings',
  LAST_FETCH: 'ghost_brief_last_fetch',
  USER_PREFERENCES: 'ghost_brief_user_preferences',
  MIGRATION_STATUS: 'ghost_brief_migration_status'
};

// Data Retention Policies
export const RETENTION_POLICIES = {
  ARTICLES: {
    DAYS: 30,
    MAX_COUNT: 10000,
    CLEANUP_BATCH_SIZE: 100
  },
  BRIEFS: {
    PERMANENT: true, // Never delete briefs
    MAX_COUNT: 1000
  },
  FEEDS: {
    PERMANENT: true, // Keep feed configurations
    INACTIVE_THRESHOLD_DAYS: 90
  },
  SETTINGS: {
    PERMANENT: true
  },
  METADATA: {
    DAYS: 365, // Keep metadata for 1 year
    MAX_COUNT: 500
  }
};

// Transaction Types
export const TRANSACTION_TYPES = {
  READ: 'readonly',
  write: 'readwrite',
  upgrade: 'versionchange'
};

// Storage Quotas and Limits
export const STORAGE_LIMITS = {
  MAX_ARTICLE_SIZE_KB: 500,
  MAX_BRIEF_SIZE_KB: 1000,
  MAX_TOTAL_SIZE_MB: 500,
  WARNING_THRESHOLD_MB: 400,
  CLEANUP_THRESHOLD_MB: 450
};

// Migration Configuration
export const MIGRATION_CONFIG = {
  BATCH_SIZE: 50,
  VALIDATION_RULES: {
    REQUIRED_FIELDS: {
      ARTICLES: ['id', 'title', 'url', 'publishedAt'],
      BRIEFS: ['id', 'title', 'generatedAt'],
      FEEDS: ['id', 'name', 'url', 'category']
    },
    MAX_FIELD_LENGTHS: {
      TITLE: 500,
      CONTENT: 50000,
      URL: 2000,
      CATEGORY: 50
    }
  },
  ERROR_HANDLING: {
    MAX_ERRORS: 10,
    SKIP_INVALID_RECORDS: true,
    CREATE_ERROR_LOG: true
  }
};

// Backup and Export Configuration
export const BACKUP_CONFIG = {
  FORMATS: ['json', 'csv'],
  COMPRESSION: true,
  INCLUDE_METADATA: true,
  MAX_EXPORT_RECORDS: 5000,
  CHUNK_SIZE: 1000
};

// Quality Metrics for Storage
export const QUALITY_METRICS = {
  SCORE_RANGES: {
    EXCELLENT: [90, 100],
    GOOD: [75, 89],
    FAIR: [60, 74],
    POOR: [0, 59]
  },
  TRACKING: {
    STORAGE_EFFICIENCY: true,
    QUERY_PERFORMANCE: true,
    ERROR_RATES: true,
    CLEANUP_FREQUENCY: true
  }
};

// Error Recovery Configuration
export const ERROR_RECOVERY = {
  AUTO_REPAIR: true,
  BACKUP_ON_CORRUPTION: true,
  FALLBACK_TO_LOCALSTORAGE: true,
  MAX_REPAIR_ATTEMPTS: 3,
  RECOVERY_STRATEGIES: [
    'REBUILD_INDEXES',
    'CLEAR_CORRUPTED_STORES',
    'FULL_DATABASE_RESET',
    'FALLBACK_TO_MEMORY'
  ]
};