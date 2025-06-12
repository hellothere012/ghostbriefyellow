// Webshare Proxy Configuration and Request Handler
// Handles routing RSS requests through Webshare rotating residential proxies

const { HttpProxyAgent } = require('http-proxy-agent');
const { SocksProxyAgent } = require('socks-proxy-agent');
const fetch = require('node-fetch');

/**
 * Webshare Proxy Service
 * Manages proxy configuration and request routing
 */
class WebshareProxy {
  constructor() {
    this.proxyHost = process.env.WEBSHARE_PROXY_HOST || 'p.webshare.io';
    this.proxyPort = process.env.WEBSHARE_PROXY_PORT || '80';
    this.username = process.env.WEBSHARE_USERNAME;
    this.password = process.env.WEBSHARE_PASSWORD;
    this.proxyType = process.env.WEBSHARE_PROXY_TYPE || 'http';
    
    if (!this.username || !this.password) {
      console.warn('⚠️  Webshare credentials not configured. RSS fetching may fail.');
    }
    
    this.agent = this.createProxyAgent();
  }

  /**
   * Creates the appropriate proxy agent based on protocol
   * @returns {HttpProxyAgent|SocksProxyAgent} Proxy agent
   */
  createProxyAgent() {
    const auth = `${this.username}:${this.password}`;
    const proxyUrl = `${this.proxyType}://${auth}@${this.proxyHost}:${this.proxyPort}`;
    
    console.log(`🔧 Initializing Webshare proxy: ${this.proxyType}://${this.proxyHost}:${this.proxyPort}`);
    
    if (this.proxyType === 'socks5' || this.proxyType === 'socks') {
      return new SocksProxyAgent(proxyUrl);
    } else {
      return new HttpProxyAgent(proxyUrl);
    }
  }

  /**
   * Fetches content through Webshare proxy
   * @param {string} url - URL to fetch
   * @param {Object} options - Additional fetch options
   * @returns {Promise<Response>} Fetch response
   */
  async fetch(url, options = {}) {
    const fetchOptions = {
      ...options,
      agent: this.agent,
      headers: {
        'User-Agent': 'Ghost Brief Intelligence Aggregator 1.0',
        'Accept': 'application/rss+xml, application/xml, text/xml, */*',
        ...options.headers
      },
      timeout: 30000 // 30 second timeout
    };

    try {
      console.log(`🌐 Fetching through Webshare proxy: ${url}`);
      const response = await fetch(url, fetchOptions);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      console.log(`✅ Successfully fetched via Webshare: ${response.status}`);
      return response;
      
    } catch (error) {
      console.error(`❌ Webshare proxy error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Fetches RSS content specifically
   * @param {string} rssUrl - RSS feed URL
   * @returns {Promise<string>} RSS content as text
   */
  async fetchRSS(rssUrl) {
    try {
      // Validate URL
      const url = new URL(rssUrl);
      if (!url.protocol.startsWith('http')) {
        throw new Error('Invalid URL protocol. Only HTTP/HTTPS supported.');
      }

      // Fetch through proxy
      const response = await this.fetch(rssUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/rss+xml, application/xml, text/xml, */*'
        }
      });

      // Get content
      const content = await response.text();
      
      if (!content || content.trim().length === 0) {
        throw new Error('Empty RSS content received');
      }

      // Basic XML validation
      if (!content.includes('<rss') && !content.includes('<feed')) {
        throw new Error('Invalid RSS/Atom feed format');
      }

      return content;
      
    } catch (error) {
      console.error(`❌ RSS fetch failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Tests proxy connectivity
   * @returns {Promise<boolean>} True if proxy is working
   */
  async testConnection() {
    try {
      console.log('🔍 Testing Webshare proxy connection...');
      const response = await this.fetch('http://httpbin.org/ip', {
        timeout: 10000
      });
      
      const data = await response.json();
      console.log(`✅ Proxy test successful. IP: ${data.origin}`);
      return true;
      
    } catch (error) {
      console.error(`❌ Proxy test failed: ${error.message}`);
      return false;
    }
  }
}

// Export singleton instance
const webshareProxy = new WebshareProxy();
module.exports = { webshareProxy, WebshareProxy };