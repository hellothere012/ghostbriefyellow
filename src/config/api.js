// API Configuration for Ghost Brief
// Handles environment-specific API endpoints and configuration

/**
 * API Configuration Service
 * Manages different API endpoints for development and production environments
 */
class APIConfig {
  constructor() {
    this.environment = this.detectEnvironment();
    this.config = this.getEnvironmentConfig();
  }

  /**
   * Detects the current environment
   * @returns {string} Environment name ('development' or 'production')
   */
  detectEnvironment() {
    // Check if we're in development mode
    if (process.env.NODE_ENV === 'development') {
      return 'development';
    }
    
    // Check if we're running on localhost
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return 'development';
    }
    
    // Check for explicit production environment variable
    if (process.env.REACT_APP_ENV === 'production') {
      return 'production';
    }
    
    // Default to production for deployed environments
    return 'production';
  }

  /**
   * Gets configuration for the current environment
   * @returns {Object} Environment-specific configuration
   */
  getEnvironmentConfig() {
    const configs = {
      development: {
        apiBaseUrl: process.env.REACT_APP_API_URL || 'http://localhost:3001',
        corsProxy: 'https://api.allorigins.win/raw?url=',
        timeout: 30000,
        retryAttempts: 3,
        logLevel: 'debug'
      },
      production: {
        apiBaseUrl: process.env.REACT_APP_API_URL || 'https://ghost-brief-api-199177265279.us-central1.run.app',
        corsProxy: 'https://api.allorigins.win/raw?url=',
        timeout: 45000,
        retryAttempts: 5,
        logLevel: 'error'
      }
    };

    return configs[this.environment];
  }

  /**
   * Gets the full API endpoint URL
   * @param {string} endpoint - API endpoint path (e.g., '/api/health')
   * @returns {string} Complete API URL
   */
  getApiUrl(endpoint = '') {
    const baseUrl = this.config.apiBaseUrl.replace(/\/$/, ''); // Remove trailing slash
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    return `${baseUrl}${cleanEndpoint}`;
  }

  /**
   * Gets the CORS proxy URL for RSS feeds
   * @param {string} rssUrl - RSS feed URL to proxy
   * @returns {string} Proxied URL
   */
  getCorsProxyUrl(rssUrl) {
    return `${this.config.corsProxy}${encodeURIComponent(rssUrl)}`;
  }

  /**
   * Gets configuration value
   * @param {string} key - Configuration key
   * @returns {*} Configuration value
   */
  get(key) {
    return this.config[key];
  }

  /**
   * Gets current environment
   * @returns {string} Current environment
   */
  getEnvironment() {
    return this.environment;
  }

  /**
   * Checks if we're in development mode
   * @returns {boolean} True if in development
   */
  isDevelopment() {
    return this.environment === 'development';
  }

  /**
   * Checks if we're in production mode
   * @returns {boolean} True if in production
   */
  isProduction() {
    return this.environment === 'production';
  }

  /**
   * Gets fetch configuration with timeout and retry settings
   * @param {Object} options - Additional fetch options
   * @returns {Object} Fetch configuration
   */
  getFetchConfig(options = {}) {
    return {
      timeout: this.config.timeout,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options.headers
      },
      ...options
    };
  }

  /**
   * Makes an API request with built-in retry logic
   * @param {string} endpoint - API endpoint
   * @param {Object} options - Fetch options
   * @returns {Promise<Response>} Fetch response
   */
  async makeRequest(endpoint, options = {}) {
    const url = this.getApiUrl(endpoint);
    const config = this.getFetchConfig(options);
    
    let lastError;
    
    for (let attempt = 1; attempt <= this.config.retryAttempts; attempt++) {
      try {
        if (this.isDevelopment()) {
          console.log(`🔗 API Request [Attempt ${attempt}]: ${url}`);
        }

        // Create AbortController for timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), config.timeout);

        const response = await fetch(url, {
          ...config,
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        if (this.isDevelopment()) {
          console.log(`✅ API Response [${response.status}]: ${url}`);
        }

        return response;

      } catch (error) {
        lastError = error;
        
        if (this.config.logLevel === 'debug' || attempt === this.config.retryAttempts) {
          console.error(`❌ API Request failed [Attempt ${attempt}/${this.config.retryAttempts}]: ${url}`, error);
        }

        // Don't retry on certain errors
        if (error.name === 'AbortError' && attempt < this.config.retryAttempts) {
          await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
          continue;
        }

        if (attempt === this.config.retryAttempts) {
          throw lastError;
        }

        // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, attempt - 1)));
      }
    }

    throw lastError;
  }

  /**
   * Health check for the API
   * @returns {Promise<Object>} Health status
   */
  async healthCheck() {
    try {
      const response = await this.makeRequest('/api/health', { method: 'GET' });
      const data = await response.json();
      
      return {
        success: true,
        status: data.status,
        environment: this.environment,
        apiUrl: this.config.apiBaseUrl,
        data
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        environment: this.environment,
        apiUrl: this.config.apiBaseUrl
      };
    }
  }

  /**
   * Log configuration information
   */
  logConfig() {
    if (this.isDevelopment()) {
      console.log('🔧 Ghost Brief API Configuration:', {
        environment: this.environment,
        apiBaseUrl: this.config.apiBaseUrl,
        corsProxy: this.config.corsProxy,
        timeout: this.config.timeout,
        retryAttempts: this.config.retryAttempts
      });
    }
  }
}

// Export singleton instance
export const apiConfig = new APIConfig();

// Export class for testing
export { APIConfig };

// Initialize logging
apiConfig.logConfig();