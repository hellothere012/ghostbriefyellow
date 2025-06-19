// Express Server for Ghost Brief Intelligence Analysis
// Provides Claude API-powered intelligence analysis backend

require('dotenv').config();
const express = require('express');
const { analyzeArticleWithClaude, processArticlesBatch } = require('./claudeService');
const { webshareProxy } = require('./webshareProxy');

const app = express();
const port = process.env.PORT || (process.env.NODE_ENV === 'production' ? 8080 : 3001);

// Middleware
app.use(express.json({ limit: '10mb' })); // Allow larger payloads for batch processing
app.use(express.urlencoded({ extended: true }));

// CORS configuration for development
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    service: 'Ghost Brief Intelligence Analysis API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    claude_configured: !!process.env.ANTHROPIC_API_KEY
  });
});

// Single article analysis endpoint
app.post('/api/analyze-article', async (req, res) => {
  try {
    const { article, existingArticles } = req.body;
    
    // Validation
    if (!article) {
      return res.status(400).json({ 
        error: 'Article content is required',
        details: 'Request body must include an "article" object'
      });
    }

    if (!article.title || !article.url) {
      return res.status(400).json({ 
        error: 'Invalid article format',
        details: 'Article must have at least title and url properties'
      });
    }

    console.log(`📥 Analyzing article: ${article.title.substring(0, 50)}...`);

    // Process article through Claude
    const analyzedArticle = await analyzeArticleWithClaude(article, existingArticles || []);
    
    console.log(`📤 Analysis complete for: ${article.title.substring(0, 50)}...`);

    res.json({ 
      success: true,
      article: analyzedArticle,
      analysis: analyzedArticle.intelligence,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Error in analyze-article endpoint:', error);
    
    // Return fallback analysis to maintain system stability
    const fallbackArticle = {
      ...req.body.article,
      intelligence: {
        relevanceScore: 20,
        confidenceLevel: 30,
        priority: 'LOW',
        categories: [req.body.article.source?.category || 'GENERAL'],
        entities: { countries: [], organizations: [], technologies: [], weapons: [] },
        tags: req.body.article.source?.tags?.slice(0, 3) || ['UNKNOWN'],
        isAdvertisement: false,
        isDuplicate: false,
        duplicateOf: null,
        isSignificantUpdate: false
      }
    };

    res.status(500).json({ 
      success: false,
      error: 'Analysis failed, using fallback',
      article: fallbackArticle,
      analysis: fallbackArticle.intelligence,
      details: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Batch article analysis endpoint for efficiency
app.post('/api/analyze-articles-batch', async (req, res) => {
  try {
    const { articles, existingArticles } = req.body;
    
    // Validation
    if (!Array.isArray(articles) || articles.length === 0) {
      return res.status(400).json({ 
        error: 'Articles array is required',
        details: 'Request body must include an "articles" array with at least one article'
      });
    }

    if (articles.length > 50) {
      return res.status(400).json({ 
        error: 'Batch size too large',
        details: 'Maximum 50 articles per batch request'
      });
    }

    console.log(`📥 Batch analyzing ${articles.length} articles...`);

    // Process articles through Claude in batches
    const analyzedArticles = await processArticlesBatch(articles, existingArticles || []);
    
    console.log(`📤 Batch analysis complete for ${analyzedArticles.length} articles`);

    res.json({ 
      success: true,
      articlesProcessed: analyzedArticles.length,
      articles: analyzedArticles,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Error in analyze-articles-batch endpoint:', error);
    
    res.status(500).json({ 
      success: false,
      error: 'Batch analysis failed',
      details: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// RSS Fetch endpoint using Webshare proxy
app.post('/api/fetch-rss', async (req, res) => {
  try {
    const { url } = req.body;
    
    // Validation
    if (!url) {
      return res.status(400).json({ 
        success: false,
        error: 'RSS URL is required',
        details: 'Request body must include a "url" parameter'
      });
    }

    // Validate URL format
    try {
      new URL(url);
    } catch (urlError) {
      return res.status(400).json({ 
        success: false,
        error: 'Invalid URL format',
        details: 'Please provide a valid HTTP/HTTPS URL'
      });
    }

    console.log(`📡 Fetching RSS feed via Webshare proxy: ${url}`);

    // Fetch RSS content through Webshare proxy
    const rssContent = await webshareProxy.fetchRSS(url);
    
    console.log(`✅ Successfully fetched RSS content: ${rssContent.length} characters`);

    res.json({ 
      success: true,
      content: rssContent,
      contentLength: rssContent.length,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Error in fetch-rss endpoint:', error);
    
    // Determine appropriate error response
    let statusCode = 500;
    let errorMessage = 'Failed to fetch RSS content';
    
    if (error.message.includes('proxy')) {
      errorMessage = 'Proxy connection failed';
    } else if (error.message.includes('timeout')) {
      statusCode = 504;
      errorMessage = 'RSS fetch timeout';
    } else if (error.message.includes('Invalid RSS')) {
      statusCode = 422;
      errorMessage = 'Invalid RSS feed format';
    }
    
    res.status(statusCode).json({ 
      success: false,
      error: errorMessage,
      details: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// API documentation endpoint
app.get('/api/docs', (req, res) => {
  res.json({
    service: 'Ghost Brief Intelligence Analysis API',
    version: '1.0.0',
    endpoints: {
      'GET /api/health': 'Health check and service status',
      'POST /api/analyze-article': 'Analyze single article with Claude AI',
      'POST /api/analyze-articles-batch': 'Analyze multiple articles in batch',
      'POST /api/fetch-rss': 'Fetch RSS content via Webshare proxy',
      'GET /api/docs': 'This documentation'
    },
    schemas: {
      article: {
        required: ['title', 'url'],
        optional: ['content', 'summary', 'publishedAt', 'source'],
        source: {
          optional: ['feedName', 'category', 'credibilityScore', 'tags']
        }
      },
      analysis: {
        relevanceScore: 'number (0-100)',
        confidenceLevel: 'number (0-100)',
        priority: 'string (CRITICAL|HIGH|MEDIUM|LOW)',
        categories: 'array of strings',
        entities: 'object with countries, organizations, technologies, weapons arrays',
        tags: 'array of strings',
        isAdvertisement: 'boolean',
        isDuplicate: 'boolean',
        duplicateOf: 'string|null',
        isSignificantUpdate: 'boolean'
      }
    }
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('❌ Unhandled server error:', error);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    details: process.env.NODE_ENV === 'development' ? error.message : 'Server error occurred',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    available_endpoints: ['/api/health', '/api/analyze-article', '/api/analyze-articles-batch', '/api/docs'],
    timestamp: new Date().toISOString()
  });
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Ghost Brief Intelligence Analysis Server running on port ${port}`);
  console.log(`📊 Health check: http://localhost:${port}/api/health`);
  console.log(`📚 API docs: http://localhost:${port}/api/docs`);
  console.log(`🤖 Claude API configured: ${!!process.env.ANTHROPIC_API_KEY}`);
  
  if (!process.env.ANTHROPIC_API_KEY) {
    console.warn('⚠️  WARNING: ANTHROPIC_API_KEY not configured. Add your API key to .env file.');
  }
});

// Graceful shutdown handling
process.on('SIGTERM', () => {
  console.log('🛑 Received SIGTERM, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 Received SIGINT, shutting down gracefully...');
  process.exit(0);
});