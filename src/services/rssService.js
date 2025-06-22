// RSS Feed Processing Service for Ghost Brief
// Handles fetching, parsing, and processing of RSS feeds

// Enhanced intelligence analysis with client-side fallback
import { analyzeArticleIntelligence, filterByRelevance, sortByIntelligencePriority } from '../utils/intelligenceAnalyzer';
import { claudeAnalysisService } from './claudeAnalysisService';
import { signalQualityFilterService } from './signalQualityFilter';
import { storageService } from './storageService';
import { apiConfig } from '../config/api';

/**
 * RSS Service for fetching and processing intelligence feeds
 */
export class RSSService {
  constructor() {
    this.processingQueue = [];
    this.processedArticles = [];
    this.isProcessing = false;
    this.errorCount = {};
    this.lastFetched = {};
    
    // Request queue management
    this.maxConcurrentRequests = 2;
    this.activeRequests = 0;
    this.requestQueue = [];
    
    // Log configuration on initialization
    if (apiConfig.isDevelopment()) {
      console.log('🔧 RSS Service initialized with API config:', {
        environment: apiConfig.getEnvironment(),
        apiBaseUrl: apiConfig.get('apiBaseUrl'),
        maxConcurrentRequests: this.maxConcurrentRequests
      });
    }
  }

  /**
   * Fetches and processes RSS feed
   * @param {Object} feedConfig - Feed configuration object
   * @param {Array} existingArticles - Existing articles for duplicate detection
   * @returns {Promise<Object>} Processing result
   */
  async processFeed(feedConfig, existingArticles = []) {
    const feedId = feedConfig.id;
    
    try {
      console.log(`Processing RSS feed: ${feedConfig.name}`);
      
      // Get last fetched timestamp for incremental processing
      const lastFetched = await storageService.getLastFetched(feedId) || 0;
      const currentTime = Date.now();
      console.log(`📅 Feed ${feedId} last fetched: ${lastFetched ? new Date(lastFetched).toISOString() : 'never'}`);
      
      // Fetch RSS content
      const rssContent = await this.fetchRSSContent(feedConfig.url);
      
      // Parse RSS to articles
      const rawArticles = await this.parseRSSContent(rssContent, feedConfig);
      console.log(`📰 Parsed ${rawArticles.length} raw articles from RSS`);
      
      // Filter for new articles only (based on publish date)
      const newArticles = rawArticles.filter(article => {
        const articleDate = new Date(article.pubDate || article.publishedAt).getTime();
        return articleDate > lastFetched;
      });
      
      console.log(`🆕 Found ${newArticles.length} new articles since last fetch`);
      
      // Only process if we have new articles
      let intelligenceArticles = [];
      if (newArticles.length > 0) {
        // Process new articles through AI analysis
        const processedArticles = await this.processArticlesWithAI(
          newArticles, 
          feedConfig, 
          existingArticles
        );
        
        // Filter and sort by intelligence value using advanced pipeline
        intelligenceArticles = await this.filterAndSortArticles(processedArticles);
        
        // Update last fetched timestamp
        await storageService.setLastFetched(feedId, currentTime);
        console.log(`✅ Updated lastFetched for feed ${feedId} to ${new Date(currentTime).toISOString()}`);
      } else {
        console.log(`⏭️ No new articles to process for feed ${feedId}`);
      }
      
      // Update feed metadata
      this.updateFeedMetadata(feedId, true);
      
      return {
        success: true,
        feedId,
        articlesProcessed: rawArticles.length,
        newArticles: newArticles.length,
        intelligenceArticles: intelligenceArticles.length,
        articles: intelligenceArticles,
        error: null
      };
      
    } catch (error) {
      console.error(`Error processing feed ${feedId}:`, error);
      this.updateFeedMetadata(feedId, false, error.message);
      
      return {
        success: false,
        feedId,
        articlesProcessed: 0,
        newArticles: 0,
        intelligenceArticles: 0,
        articles: [],
        error: error.message
      };
    }
  }

  /**
   * Fetches RSS content from URL through backend proxy
   * @param {string} url - RSS feed URL
   * @returns {Promise<string>} RSS content
   */
  async fetchRSSContent(url) {
    console.log(`🌐 Fetching RSS content from: ${url}`);
    
    try {
      // Call backend RSS proxy endpoint
      const response = await apiConfig.makeRequest('/api/fetch-rss', {
        method: 'POST',
        body: JSON.stringify({ url })
      });

      console.log(`📡 Backend response status: ${response.status}`);

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch RSS content');
      }

      const content = data.content;
      console.log(`📄 Content length: ${content.length} characters`);
      
      if (!content || content.trim().length === 0) {
        throw new Error('Empty RSS content received');
      }

      // Log first 200 characters for debugging
      if (apiConfig.isDevelopment()) {
        console.log(`📝 Content preview: ${content.substring(0, 200)}...`);
      }

      return content;
      
    } catch (error) {
      console.error(`❌ RSS fetch failed: ${error.message}`);
      throw new Error(`RSS fetch failed: ${error.message}`);
    }
  }

  /**
   * Parses RSS XML content to article objects
   * @param {string} rssContent - Raw RSS XML content
   * @param {Object} feedConfig - Feed configuration
   * @returns {Array} Parsed articles
   */
  async parseRSSContent(rssContent, feedConfig) {
    try {
      console.log(`🔍 Parsing RSS content for feed: ${feedConfig.name}`);
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(rssContent, "text/xml");
      
      // Check for parsing errors
      const parserError = xmlDoc.querySelector('parsererror');
      if (parserError) {
        console.error('❌ XML parsing error:', parserError.textContent);
        throw new Error('XML parsing failed: Invalid RSS format');
      }

      const items = xmlDoc.querySelectorAll('item');
      console.log(`📋 Found ${items.length} RSS items to process`);
      const articles = [];

      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        
        try {
          const article = this.parseRSSItem(item, feedConfig);
          if (article && this.isValidArticle(article)) {
            articles.push(article);
            console.log(`✅ Article ${i + 1}: ${article.title.substring(0, 50)}...`);
          } else {
            console.log(`⚠️ Skipped invalid article ${i + 1}`);
          }
        } catch (itemError) {
          console.warn(`❌ Failed to parse RSS item ${i + 1}:`, itemError);
          continue; // Skip problematic items
        }
      }

      console.log(`📰 Successfully parsed ${articles.length} valid articles from ${items.length} RSS items`);
      return articles;
      
    } catch (error) {
      console.error(`❌ RSS parsing failed for ${feedConfig.name}:`, error);
      throw new Error(`RSS parsing failed: ${error.message}`);
    }
  }

  /**
   * Parses individual RSS item to article object
   * @param {Element} item - RSS item element
   * @param {Object} feedConfig - Feed configuration
   * @returns {Object} Article object
   */
  parseRSSItem(item, feedConfig) {
    const getElementText = (selector) => {
      const element = item.querySelector(selector);
      return element ? element.textContent.trim() : '';
    };

    const title = getElementText('title');
    const link = getElementText('link');
    const description = getElementText('description');
    const pubDate = getElementText('pubDate');
    const content = getElementText('content\\:encoded') || description;

    // Extract categories/tags
    const categories = Array.from(item.querySelectorAll('category'))
      .map(cat => cat.textContent.trim())
      .filter(cat => cat.length > 0);

    // Parse publication date
    let publishedAt = null;
    if (pubDate) {
      publishedAt = new Date(pubDate);
      if (isNaN(publishedAt.getTime())) {
        publishedAt = new Date(); // Fallback to current time
      }
    } else {
      publishedAt = new Date();
    }

    // Generate unique ID
    const id = this.generateArticleId(link, title, publishedAt);

    return {
      id,
      title,
      content: this.cleanContent(content),
      summary: this.cleanContent(description),
      url: link,
      publishedAt: publishedAt.toISOString(),
      fetchedAt: new Date().toISOString(),
      source: {
        feedId: feedConfig.id,
        feedName: feedConfig.name,
        domain: this.extractDomain(link),
        credibilityScore: feedConfig.credibilityScore || 70,
        category: feedConfig.category
      },
      categories: categories,
      rawTags: [...categories, ...feedConfig.tags]
    };
  }

  /**
   * Validates article object
   * @param {Object} article - Article object
   * @returns {boolean} True if valid
   */
  isValidArticle(article) {
    return (
      article.title && 
      article.title.length > 10 &&
      article.url && 
      article.url.startsWith('http') &&
      !this.isExpiredArticle(article)
    );
  }

  /**
   * Checks if article is older than 30 days
   * @param {Object} article - Article object
   * @returns {boolean} True if expired
   */
  isExpiredArticle(article) {
    const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
    const articleDate = new Date(article.publishedAt).getTime();
    return articleDate < thirtyDaysAgo;
  }

  /**
   * Processes articles through enhanced AI intelligence analysis
   * Uses Claude API with professional prompts and client-side fallback
   * @param {Array} articles - Raw articles
   * @param {Object} feedConfig - Feed configuration
   * @param {Array} existingArticles - Existing articles
   * @returns {Array} Processed articles with intelligence metadata
   */
  async processArticlesWithAI(articles, feedConfig, existingArticles) {
    console.log(`🤖 Starting enhanced AI analysis for ${articles.length} articles from ${feedConfig.name}`);
    const processedArticles = [];

    // Process articles in smaller batches with rate limiting
    const batchSize = 2; // Reduced to prevent API overload
    for (let i = 0; i < articles.length; i += batchSize) {
      const batch = articles.slice(i, i + batchSize);
      
      const batchPromises = batch.map(async (article) => {
        try {
          // Add feed context to article
          const enhancedArticle = {
            ...article,
            source: {
              ...article.source,
              feedTags: feedConfig.tags,
              feedCategory: feedConfig.category
            }
          };

          // Generate enhanced Claude API prompt
          const analysisRequest = claudeAnalysisService.generateIntelligencePrompt(
            enhancedArticle, 
            existingArticles,
            { depth: 'comprehensive', focusAreas: ['intelligence', 'geopolitical', 'threat'] }
          );

          // Call Claude API with enhanced prompt and retry logic
          let result = null;
          let retryCount = 0;
          const maxRetries = 3;
          
          while (retryCount < maxRetries) {
            try {
              const response = await apiConfig.makeRequest('/api/analyze-article', {
                method: 'POST',
                body: JSON.stringify({
                  article: enhancedArticle,
                  existingArticles: existingArticles,
                  enhancedPrompt: analysisRequest.prompt,
                  analysisContext: analysisRequest.context,
                  version: '3.0-professional'
                })
              });

              result = await response.json();
              
              if (!result.success) {
                throw new Error(result.error || 'Enhanced Claude API analysis failed');
              }
              
              break; // Success, exit retry loop
              
            } catch (apiError) {
              retryCount++;
              console.warn(`⚠️ API call failed (attempt ${retryCount}/${maxRetries}): ${apiError.message}`);
              
              if (retryCount < maxRetries) {
                // Exponential backoff: 2s, 4s, 8s
                const backoffDelay = Math.pow(2, retryCount) * 1000;
                console.log(`🔄 Retrying in ${backoffDelay/1000}s...`);
                await new Promise(resolve => setTimeout(resolve, backoffDelay));
              } else {
                throw apiError; // Max retries reached, throw error
              }
            }
          }

          // Validate and enhance the Claude response
          const validatedIntelligence = claudeAnalysisService.validateAndEnhanceResponse(
            result.intelligence || result.article?.intelligence,
            enhancedArticle
          );

          const analyzed = {
            ...enhancedArticle,
            intelligence: validatedIntelligence
          };
          
          // Skip advertisements and low-quality duplicates
          if (!analyzed.intelligence.isAdvertisement && 
              (!analyzed.intelligence.isDuplicate || analyzed.intelligence.isSignificantUpdate)) {
            console.log(`✅ Enhanced analysis complete: Score ${analyzed.intelligence.relevanceScore}, Priority ${analyzed.intelligence.priority}, Confidence ${analyzed.intelligence.confidenceLevel}`);
            return analyzed;
          } else {
            console.log(`⚠️ Article filtered out: Advertisement=${analyzed.intelligence.isAdvertisement}, Duplicate=${analyzed.intelligence.isDuplicate}`);
            return null; // Skip this article
          }
          
        } catch (error) {
          console.warn(`❌ Enhanced API analysis failed for article: ${article.title.substring(0, 50)}...`, error);
          
          // Fallback to client-side intelligence analysis
          try {
            console.log(`🔄 Attempting client-side fallback analysis...`);
            const fallbackAnalyzed = await analyzeArticleIntelligence(article, existingArticles);
            
            // Add metadata indicating fallback was used
            fallbackAnalyzed.intelligence.analysisMetadata = {
              ...fallbackAnalyzed.intelligence.analysisMetadata,
              fallbackUsed: true,
              fallbackReason: 'API_UNAVAILABLE',
              originalError: error.message
            };
            
            console.log(`✅ Client-side fallback complete: Score ${fallbackAnalyzed.intelligence.relevanceScore}, Priority ${fallbackAnalyzed.intelligence.priority}`);
            return fallbackAnalyzed;
            
          } catch (fallbackError) {
            console.error(`❌ Client-side fallback also failed:`, fallbackError);
            
            // Final fallback with minimal analysis
            const minimalAnalysis = {
              ...article,
              intelligence: {
                relevanceScore: 25,
                confidenceLevel: 40,
                priority: 'LOW',
                categories: [feedConfig.category || 'GENERAL'],
                tags: [...(feedConfig.tags || []), 'UNPROCESSED'],
                entities: { countries: [], organizations: [], technologies: [], weapons: [] },
                isAdvertisement: false,
                isDuplicate: false,
                duplicateOf: null,
                isSignificantUpdate: false,
                threatAssessment: 'LOW',
                strategicImplications: 'Requires manual review',
                geopoliticalContext: 'Processing failed',
                analysisMetadata: {
                  version: 'fallback-minimal',
                  processedAt: new Date().toISOString(),
                  analysisType: 'minimal_fallback',
                  errors: [error.message, fallbackError.message]
                }
              }
            };
            
            console.log(`🔄 Minimal fallback applied for: ${article.title.substring(0, 50)}...`);
            return minimalAnalysis;
          }
        }
      });

      // Wait for batch to complete
      const batchResults = await Promise.allSettled(batchPromises);
      
      // Add successful results to processed articles
      batchResults.forEach((result) => {
        if (result.status === 'fulfilled' && result.value) {
          processedArticles.push(result.value);
        }
      });

      // Longer pause between batches to avoid overwhelming the API
      if (i + batchSize < articles.length) {
        const delay = 2000 + Math.random() * 1000; // 2-3 seconds random delay
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    console.log(`🏁 Enhanced AI processing complete: ${processedArticles.length} articles processed from ${articles.length} total`);
    
    // Generate quality report for monitoring
    const qualityReport = claudeAnalysisService.generateQualityReport(processedArticles);
    console.log(`📊 Analysis Quality Report:`, qualityReport);
    
    return processedArticles;
  }

  /**
   * Filters and sorts articles using advanced signal quality filtering pipeline
   * @param {Array} articles - Processed articles
   * @param {number} relevanceThreshold - Minimum relevance score
   * @returns {Array} Filtered and sorted articles
   */
  async filterAndSortArticles(articles, relevanceThreshold = 40) {
    console.log(`🔍 Starting advanced signal quality filtering for ${articles.length} articles...`);
    
    try {
      // Run articles through comprehensive quality filtering pipeline
      const filteringResults = await signalQualityFilterService.processSignalsPipeline(articles, {
        relevanceThreshold,
        enableAdvancedFiltering: true
      });
      
      console.log(`📊 Quality filtering complete: ${filteringResults.input} → ${filteringResults.output.length} signals`);
      console.log(`📈 Pass rate: ${Math.round((filteringResults.output.length / filteringResults.input) * 100)}%`);
      
      // Log quality report summary
      if (filteringResults.qualityReport) {
        console.log(`📋 Quality distribution:`, filteringResults.qualityReport.qualityDistribution);
      }
      
      // Use enhanced sorting as final step
      const sorted = sortByIntelligencePriority(filteringResults.output);
      
      // Add filtering metadata to articles
      sorted.forEach(article => {
        article.qualityFilteringApplied = true;
        article.filteringTimestamp = new Date().toISOString();
        article.qualityPipeline = 'signal-quality-v2.0';
      });
      
      console.log(`✅ Advanced filtering complete: ${sorted.length} premium intelligence signals`);
      return sorted;
      
    } catch (error) {
      console.error('❌ Advanced filtering failed, falling back to basic filtering:', error);
      
      // Fallback to basic filtering
      const filtered = filterByRelevance(articles, relevanceThreshold);
      const sorted = sortByIntelligencePriority(filtered);
      const limited = sorted.slice(0, 50);
      
      // Mark as fallback filtering
      limited.forEach(article => {
        article.qualityFilteringApplied = false;
        article.filteringFallback = true;
        article.filteringError = error.message;
      });
      
      console.log(`🔄 Fallback filtering complete: ${limited.length} articles`);
      return limited;
    }
  }

  /**
   * Processes multiple RSS feeds concurrently
   * @param {Array} feedConfigs - Array of feed configurations
   * @param {Array} existingArticles - Existing articles
   * @returns {Promise<Object>} Combined processing results
   */
  async processMultipleFeeds(feedConfigs, existingArticles = []) {
    const activeFeeds = feedConfigs.filter(feed => feed.isActive);
    
    console.log(`🚀 Processing ${activeFeeds.length} RSS feeds sequentially...`);
    
    // Process feeds one by one to avoid overwhelming servers and API
    const results = [];
    
    for (let i = 0; i < activeFeeds.length; i++) {
      const feed = activeFeeds[i];
      console.log(`📡 Processing feed ${i + 1}/${activeFeeds.length}: ${feed.name}`);
      
      try {
        // Process single feed with timeout
        const feedPromise = this.processFeed(feed, existingArticles);
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Feed processing timeout')), 60000)
        );
        
        const result = await Promise.race([feedPromise, timeoutPromise]);
        results.push(result);
        
        console.log(`✅ Feed ${feed.name} processed: ${result.intelligenceArticles} signals found`);
        
      } catch (error) {
        console.error(`❌ Failed to process feed ${feed.name}:`, error.message);
        results.push({
          success: false,
          feedId: feed.id,
          articlesProcessed: 0,
          intelligenceArticles: 0,
          articles: [],
          error: error.message
        });
      }
      
      // Delay between feeds to prevent API overload (except for last feed)
      if (i < activeFeeds.length - 1) {
        const delay = 2000 + Math.random() * 1000; // 2-3 seconds random delay
        console.log(`⏳ Waiting ${Math.round(delay/1000)}s before next feed...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    // Combine all articles
    const allArticles = results
      .filter(result => result.success)
      .flatMap(result => result.articles);

    // Final deduplication and sorting across all feeds
    const deduplicated = this.removeCrossFeedDuplicates(allArticles);
    const finalArticles = this.sortArticlesByPriority(deduplicated);

    return {
      totalFeeds: activeFeeds.length,
      successfulFeeds: results.filter(r => r.success).length,
      totalArticlesProcessed: results.reduce((sum, r) => sum + r.articlesProcessed, 0),
      intelligenceArticles: finalArticles.length,
      articles: finalArticles,
      feedResults: results
    };
  }

  /**
   * Removes duplicates across different feeds
   * @param {Array} articles - All articles from multiple feeds
   * @returns {Array} Deduplicated articles
   */
  removeCrossFeedDuplicates(articles) {
    const seen = new Set();
    const deduplicated = [];

    for (const article of articles) {
      const signature = this.createArticleSignature(article);
      
      if (!seen.has(signature)) {
        seen.add(signature);
        deduplicated.push(article);
      }
    }

    return deduplicated;
  }

  /**
   * Creates a signature for duplicate detection
   * @param {Object} article - Article object
   * @returns {string} Article signature
   */
  createArticleSignature(article) {
    const title = article.title.toLowerCase().replace(/[^a-z0-9]/g, '');
    const domain = this.extractDomain(article.url);
    return `${title.substring(0, 50)}_${domain}`;
  }

  /**
   * Sorts articles by intelligence priority using enhanced algorithm
   * @param {Array} articles - Array of articles
   * @returns {Array} Sorted articles
   */
  sortArticlesByPriority(articles) {
    // Use enhanced sorting function from intelligence analyzer
    return sortByIntelligencePriority(articles);
  }

  /**
   * Utility functions
   */
  
  generateArticleId(url, title, publishedAt) {
    const hash = this.simpleHash(url + title + publishedAt.toISOString());
    return `article_${hash}_${Date.now()}`;
  }

  simpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(36);
  }

  extractDomain(url) {
    try {
      return new URL(url).hostname.replace('www.', '');
    } catch {
      return 'unknown';
    }
  }

  cleanContent(content) {
    if (!content) return '';
    
    return content
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/&[^;]+;/g, ' ') // Remove HTML entities
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim()
      .substring(0, 2000); // Limit content length
  }

  updateFeedMetadata(feedId, success, error = null) {
    this.lastFetched[feedId] = new Date().toISOString();
    
    if (success) {
      this.errorCount[feedId] = 0;
    } else {
      this.errorCount[feedId] = (this.errorCount[feedId] || 0) + 1;
    }
  }

  /**
   * Gets feed health status
   * @param {string} feedId - Feed ID
   * @returns {Object} Health status
   */
  getFeedHealth(feedId) {
    const errors = this.errorCount[feedId] || 0;
    const lastFetch = this.lastFetched[feedId];
    
    let status = 'active';
    if (errors > 5) status = 'error';
    else if (errors > 2) status = 'warning';
    
    return {
      status,
      errorCount: errors,
      lastFetched: lastFetch,
      isHealthy: errors < 3
    };
  }
}

// Export singleton instance
export const rssService = new RSSService();