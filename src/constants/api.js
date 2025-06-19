/**
 * API Configuration Constants
 * Centralized configuration for API endpoints, timeouts, and external service URLs
 */

// API Endpoints
export const API_ENDPOINTS = {
  HEALTH: '/api/health',
  ANALYZE_ARTICLE: '/api/analyze-article',
  ANALYZE_ARTICLES_BATCH: '/api/analyze-articles-batch',
  DOCS: '/api/docs'
};

// External Service URLs
export const EXTERNAL_SERVICES = {
  CORS_PROXY: 'https://api.allorigins.win/raw?url=',
  PRODUCTION_API: 'https://ghost-brief-api-199177265279.us-central1.run.app',
  LOCAL_API: 'http://localhost:3001'
};

// HTTP Configuration
export const HTTP_CONFIG = {
  TIMEOUT: {
    DEFAULT: 30000,      // 30 seconds
    RSS_FETCH: 15000,    // 15 seconds
    API_REQUEST: 10000,  // 10 seconds
    HEALTH_CHECK: 5000   // 5 seconds
  },
  RETRY: {
    MAX_ATTEMPTS: 3,
    DELAY_MS: 1000,
    BACKOFF_MULTIPLIER: 2
  },
  HEADERS: {
    DEFAULT: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    RSS: {
      'User-Agent': 'Ghost Brief Intelligence Aggregator v1.0',
      'Accept': 'application/rss+xml, application/xml, text/xml'
    }
  }
};

// RSS Processing Configuration
export const RSS_CONFIG = {
  BATCH_SIZE: 5,
  MAX_CONCURRENT_REQUESTS: 3,
  FETCH_INTERVAL_MS: 900000, // 15 minutes
  STALE_THRESHOLD_HOURS: 24,
  MAX_ARTICLES_PER_FEED: 50,
  ERROR_THRESHOLD: 5
};

// Claude API Configuration
export const CLAUDE_CONFIG = {
  MODEL: 'claude-3-haiku-20240307',
  MAX_TOKENS: 1000,
  TEMPERATURE: 0.3,
  TOP_P: 0.9,
  STOP_SEQUENCES: [],
  SYSTEM_PROMPT_MAX_LENGTH: 10000,
  USER_PROMPT_MAX_LENGTH: 100000
};

// Storage Service Configuration
export const STORAGE_CONFIG = {
  DATABASE_NAME: 'GhostBriefDB',
  DATABASE_VERSION: 1,
  STORES: {
    ARTICLES: 'articles',
    BRIEFS: 'briefs', 
    FEEDS: 'feeds',
    SETTINGS: 'settings',
    METADATA: 'metadata'
  },
  INDEXES: {
    ARTICLES: ['date', 'priority', 'category', 'feedId'],
    BRIEFS: ['date', 'type', 'quality'],
    FEEDS: ['category', 'isActive', 'lastFetched']
  }
};

// Quality Filter Configuration
export const QUALITY_CONFIG = {
  STAGES: 7,
  SIMILARITY_THRESHOLD: 0.85,
  MIN_QUALITY_SCORE: 60,
  DUPLICATE_TIME_WINDOW_HOURS: 24,
  LINGUISTIC_INDICATORS: {
    MIN_WORD_COUNT: 50,
    MAX_WORD_COUNT: 10000,
    MIN_SENTENCE_COUNT: 3,
    MAX_SENTENCE_COUNT: 100
  }
};

// Briefing Configuration
export const BRIEFING_CONFIG = {
  GENERATION_TIME: '06:00', // 6 AM daily
  ANALYSIS_WINDOW_HOURS: 24,
  MIN_SIGNALS_REQUIRED: 5,
  MAX_SIGNALS_PER_SECTION: 10,
  SECTIONS: [
    'EXECUTIVE_SUMMARY',
    'PRIORITY_DEVELOPMENTS', 
    'THREAT_ASSESSMENT',
    'REGIONAL_ANALYSIS',
    'TECHNOLOGY_WATCH',
    'STRATEGIC_IMPLICATIONS',
    'RECOMMENDATIONS'
  ],
  QUALITY_THRESHOLD: 75
};

// Error Codes and Messages
export const ERROR_CODES = {
  NETWORK_ERROR: 'NETWORK_ERROR',
  TIMEOUT_ERROR: 'TIMEOUT_ERROR',
  PARSING_ERROR: 'PARSING_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  STORAGE_ERROR: 'STORAGE_ERROR',
  API_ERROR: 'API_ERROR',
  RATE_LIMIT_ERROR: 'RATE_LIMIT_ERROR'
};

export const ERROR_MESSAGES = {
  [ERROR_CODES.NETWORK_ERROR]: 'Network connection failed',
  [ERROR_CODES.TIMEOUT_ERROR]: 'Request timed out',
  [ERROR_CODES.PARSING_ERROR]: 'Failed to parse response',
  [ERROR_CODES.VALIDATION_ERROR]: 'Data validation failed',
  [ERROR_CODES.STORAGE_ERROR]: 'Storage operation failed',
  [ERROR_CODES.API_ERROR]: 'API request failed',
  [ERROR_CODES.RATE_LIMIT_ERROR]: 'Rate limit exceeded'
};

// Status Codes
export const STATUS_CODES = {
  SUCCESS: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  TIMEOUT: 408,
  TOO_MANY_REQUESTS: 429,
  SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503
};