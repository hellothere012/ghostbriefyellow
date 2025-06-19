/**
 * Centralized Configuration Management
 * Single point of configuration for the entire application
 */

import { 
  API_ENDPOINTS, 
  EXTERNAL_SERVICES, 
  HTTP_CONFIG, 
  RSS_CONFIG, 
  CLAUDE_CONFIG,
  BRIEFING_CONFIG 
} from '../constants/api.js';

import { 
  DATABASE_CONFIG, 
  STORE_NAMES, 
  RETENTION_POLICIES,
  MIGRATION_CONFIG 
} from '../constants/storage.js';

import { PREMIUM_RSS_FEEDS, FEED_HEALTH } from '../constants/feeds.js';

/**
 * Centralized Configuration Manager
 * Manages all application configuration with environment detection
 */
class ConfigManager {
  constructor() {
    this.environment = this.detectEnvironment();
    this.config = this.buildConfiguration();
    this.initialized = false;
  }

  /**
   * Detect current environment
   * @returns {string} Environment name ('development', 'production', 'test')
   */
  detectEnvironment() {
    // Explicit environment override
    if (process.env.REACT_APP_ENV) {
      return process.env.REACT_APP_ENV;
    }

    // Node environment
    if (process.env.NODE_ENV === 'development') {
      return 'development';
    }

    if (process.env.NODE_ENV === 'test') {
      return 'test';
    }

    // Browser-based detection
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname.startsWith('192.168.')) {
        return 'development';
      }
    }

    // Default to production
    return 'production';
  }

  /**
   * Build complete configuration object
   * @returns {Object} Complete configuration
   */
  buildConfiguration() {
    const baseConfig = this.getBaseConfiguration();
    const envConfig = this.getEnvironmentConfiguration();
    
    return {
      ...baseConfig,
      ...envConfig,
      meta: {
        environment: this.environment,
        buildTime: new Date().toISOString(),
        version: process.env.REACT_APP_VERSION || '1.0.0'
      }
    };
  }

  /**
   * Get base configuration (environment-independent)
   * @returns {Object} Base configuration
   */
  getBaseConfiguration() {
    return {
      // API Configuration
      api: {
        endpoints: API_ENDPOINTS,
        claude: CLAUDE_CONFIG,
        briefing: BRIEFING_CONFIG,
        timeout: HTTP_CONFIG.TIMEOUT,
        retry: HTTP_CONFIG.RETRY,
        headers: HTTP_CONFIG.HEADERS
      },

      // Storage Configuration
      storage: {
        database: DATABASE_CONFIG,
        stores: STORE_NAMES,
        retention: RETENTION_POLICIES,
        migration: MIGRATION_CONFIG
      },

      // RSS Configuration
      rss: {
        ...RSS_CONFIG,
        feeds: PREMIUM_RSS_FEEDS,
        health: FEED_HEALTH
      },

      // Feature Flags
      features: {
        dailyBriefing: true,
        qualityFiltering: true,
        advancedAnalysis: true,
        entityExtraction: true,
        multiFactorScoring: true,
        drillData: true
      },

      // UI Configuration
      ui: {
        theme: 'dark',
        animations: true,
        compactMode: false,
        autoRefresh: true,
        refreshInterval: 15 * 60 * 1000 // 15 minutes
      }
    };
  }

  /**
   * Get environment-specific configuration
   * @returns {Object} Environment configuration
   */
  getEnvironmentConfiguration() {
    const environments = {
      development: {
        api: {
          baseUrl: process.env.REACT_APP_API_URL || EXTERNAL_SERVICES.LOCAL_API,
          corsProxy: EXTERNAL_SERVICES.CORS_PROXY,
          timeout: HTTP_CONFIG.TIMEOUT.DEFAULT,
          retryAttempts: 2,
          logLevel: 'debug'
        },
        logging: {
          level: 'debug',
          console: true,
          errorTracking: false
        },
        performance: {
          enableProfiler: true,
          logSlowOperations: true,
          slowOperationThreshold: 1000
        },
        debug: {
          showErrorDetails: true,
          enableDevTools: true,
          mockData: false
        }
      },

      production: {
        api: {
          baseUrl: process.env.REACT_APP_API_URL || EXTERNAL_SERVICES.PRODUCTION_API,
          corsProxy: EXTERNAL_SERVICES.CORS_PROXY,
          timeout: HTTP_CONFIG.TIMEOUT.DEFAULT * 1.5,
          retryAttempts: 3,
          logLevel: 'error'
        },
        logging: {
          level: 'error',
          console: false,
          errorTracking: true
        },
        performance: {
          enableProfiler: false,
          logSlowOperations: false,
          slowOperationThreshold: 5000
        },
        debug: {
          showErrorDetails: false,
          enableDevTools: false,
          mockData: false
        }
      },

      test: {
        api: {
          baseUrl: 'http://localhost:3001',
          corsProxy: 'http://localhost:3002/proxy',
          timeout: 5000,
          retryAttempts: 1,
          logLevel: 'warn'
        },
        logging: {
          level: 'warn',
          console: true,
          errorTracking: false
        },
        performance: {
          enableProfiler: false,
          logSlowOperations: false,
          slowOperationThreshold: 2000
        },
        debug: {
          showErrorDetails: true,
          enableDevTools: true,
          mockData: true
        }
      }
    };

    return environments[this.environment] || environments.production;
  }

  /**
   * Initialize configuration (called once on app startup)
   */
  initialize() {
    if (this.initialized) return;

    // Validate critical configuration
    this.validateConfiguration();

    // Log configuration in development
    if (this.isDevelopment()) {
      this.logConfiguration();
    }

    // Set up error tracking if enabled
    if (this.get('logging.errorTracking')) {
      this.initializeErrorTracking();
    }

    this.initialized = true;
  }

  /**
   * Validate critical configuration values
   * @throws {Error} If configuration is invalid
   */
  validateConfiguration() {
    const required = [
      'api.baseUrl',
      'storage.database.NAME',
      'rss.feeds'
    ];

    for (const path of required) {
      const value = this.get(path);
      if (value === undefined || value === null) {
        throw new Error(`Missing required configuration: ${path}`);
      }
    }

    // Validate API URL format
    try {
      new URL(this.get('api.baseUrl'));
    } catch (error) {
      throw new Error('Invalid API base URL configuration');
    }
  }

  /**
   * Get configuration value by path
   * @param {string} path - Dot-separated configuration path
   * @param {*} defaultValue - Default value if path not found
   * @returns {*} Configuration value
   */
  get(path, defaultValue = undefined) {
    const keys = path.split('.');
    let current = this.config;

    for (const key of keys) {
      if (current && typeof current === 'object' && key in current) {
        current = current[key];
      } else {
        return defaultValue;
      }
    }

    return current;
  }

  /**
   * Set configuration value by path (for runtime updates)
   * @param {string} path - Dot-separated configuration path
   * @param {*} value - Value to set
   */
  set(path, value) {
    const keys = path.split('.');
    const lastKey = keys.pop();
    let current = this.config;

    for (const key of keys) {
      if (!(key in current) || typeof current[key] !== 'object') {
        current[key] = {};
      }
      current = current[key];
    }

    current[lastKey] = value;
  }

  /**
   * Get environment name
   * @returns {string} Current environment
   */
  getEnvironment() {
    return this.environment;
  }

  /**
   * Check if in development mode
   * @returns {boolean} True if development
   */
  isDevelopment() {
    return this.environment === 'development';
  }

  /**
   * Check if in production mode
   * @returns {boolean} True if production
   */
  isProduction() {
    return this.environment === 'production';
  }

  /**
   * Check if in test mode
   * @returns {boolean} True if test
   */
  isTest() {
    return this.environment === 'test';
  }

  /**
   * Check if feature is enabled
   * @param {string} feature - Feature name
   * @returns {boolean} True if enabled
   */
  isFeatureEnabled(feature) {
    return this.get(`features.${feature}`, false);
  }

  /**
   * Get API URL with endpoint
   * @param {string} endpoint - API endpoint path
   * @returns {string} Complete API URL
   */
  getApiUrl(endpoint = '') {
    const baseUrl = this.get('api.baseUrl').replace(/\/$/, '');
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    return `${baseUrl}${cleanEndpoint}`;
  }

  /**
   * Get CORS proxy URL
   * @param {string} url - URL to proxy
   * @returns {string} Proxied URL
   */
  getCorsProxyUrl(url) {
    const proxy = this.get('api.corsProxy');
    return `${proxy}${encodeURIComponent(url)}`;
  }

  /**
   * Get fetch configuration for HTTP requests
   * @param {Object} options - Additional options
   * @returns {Object} Fetch configuration
   */
  getFetchConfig(options = {}) {
    return {
      timeout: this.get('api.timeout'),
      headers: {
        ...this.get('api.headers.DEFAULT'),
        ...options.headers
      },
      ...options
    };
  }

  /**
   * Log current configuration (development only)
   */
  logConfiguration() {
    if (!this.isDevelopment()) return;

    console.group('🔧 Ghost Brief Configuration');
    console.log('Environment:', this.environment);
    console.log('API Base URL:', this.get('api.baseUrl'));
    console.log('Features:', this.get('features'));
    console.log('Database:', this.get('storage.database.NAME'));
    console.log('RSS Feeds:', this.get('rss.feeds').length);
    console.groupEnd();
  }

  /**
   * Initialize error tracking service
   */
  initializeErrorTracking() {
    // Placeholder for error tracking service initialization
    // In production, you would initialize services like Sentry here
    if (this.isProduction()) {
      console.log('Error tracking initialized');
    }
  }

  /**
   * Get configuration summary for debugging
   * @returns {Object} Configuration summary
   */
  getConfigSummary() {
    return {
      environment: this.environment,
      apiUrl: this.get('api.baseUrl'),
      features: this.get('features'),
      version: this.get('meta.version'),
      buildTime: this.get('meta.buildTime')
    };
  }

  /**
   * Reset configuration to defaults (for testing)
   */
  reset() {
    this.config = this.buildConfiguration();
    this.initialized = false;
  }
}

// Export singleton instance
export const config = new ConfigManager();

// Export class for testing
export { ConfigManager };

// Initialize configuration
config.initialize();