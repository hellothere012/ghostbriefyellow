// Claude Intelligence Analysis Service for Ghost Brief
// Replaces client-side intelligenceAnalyzer with Claude API

const Anthropic = require('@anthropic-ai/sdk');

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

/**
 * Creates a comprehensive analysis prompt for Claude
 * Engineered to maintain compatibility with existing intelligence analysis structure
 */
const getAnalysisPrompt = (article, existingArticles = []) => {
  const { title, content, summary, url, source, publishedAt } = article;
  const contentToAnalyze = content || summary || '';
  
  // Create duplicate detection context
  const recentTitles = existingArticles
    .filter(a => {
      const hoursDiff = (Date.now() - new Date(a.publishedAt || Date.now()).getTime()) / (1000 * 60 * 60);
      return hoursDiff <= 24;
    })
    .map(a => a.title)
    .slice(0, 10);

  return `You are a top-tier intelligence analyst for a professional intelligence briefing system. Analyze the following article and provide structured intelligence assessment.

**ARTICLE TO ANALYZE:**
Title: "${title}"
Content: "${contentToAnalyze.substring(0, 4000)}"
URL: "${url}"
Source: ${source.feedName} (Credibility: ${source.credibilityScore}/100, Category: ${source.category})
Published: ${publishedAt}

**RECENT ARTICLES FOR DUPLICATE DETECTION:**
${recentTitles.length > 0 ? recentTitles.map((t, i) => `${i + 1}. "${t}"`).join('\n') : 'None'}

**ANALYSIS REQUIREMENTS:**

1. **ADVERTISEMENT DETECTION**: Check if this is promotional content, sponsored post, or advertisement
2. **DUPLICATE DETECTION**: Compare with recent articles to identify if this is a duplicate or significant update
3. **RELEVANCE SCORING**: Rate intelligence value 0-100 based on:
   - Military/defense significance
   - Geopolitical impact
   - Technology/cybersecurity importance
   - Economic/trade implications
   - Health/security threats
4. **PRIORITY CLASSIFICATION**: Assign CRITICAL/HIGH/MEDIUM/LOW based on:
   - CRITICAL: Nuclear, major attacks, critical infrastructure, weapons of mass destruction
   - HIGH: Military deployments, cyber attacks, sanctions, major diplomatic events
   - MEDIUM: Policy changes, trade disputes, technology developments
   - LOW: Routine diplomatic activity, minor tech updates
5. **ENTITY EXTRACTION**: Identify specific:
   - Countries involved
   - Organizations (military, government, corporate)
   - Technologies mentioned
   - Weapon systems or military equipment
6. **CATEGORIZATION**: Select up to 3 categories from: MILITARY, TECHNOLOGY, CYBERSECURITY, GEOPOLITICS, FINANCE, SCIENCE, HEALTH, NUCLEAR, ESPIONAGE
7. **TAG GENERATION**: Create 3-5 uppercase keywords for quick scanning
8. **CONFIDENCE ASSESSMENT**: Rate your confidence in this analysis 0-100

**OUTPUT FORMAT:**
Respond with ONLY the JSON object between <analysis> tags:

<analysis>
{
  "relevanceScore": number (0-100),
  "confidenceLevel": number (0-100),
  "priority": "CRITICAL|HIGH|MEDIUM|LOW",
  "categories": ["category1", "category2"],
  "entities": {
    "countries": ["country1", "country2"],
    "organizations": ["org1", "org2"],
    "technologies": ["tech1", "tech2"],
    "weapons": ["weapon1", "weapon2"]
  },
  "tags": ["TAG1", "TAG2", "TAG3"],
  "isAdvertisement": boolean,
  "isDuplicate": boolean,
  "duplicateOf": "article_title_if_duplicate_or_null",
  "isSignificantUpdate": boolean
}
</analysis>`;
};

/**
 * Analyzes article using Claude API with full intelligence analysis
 * Maintains compatibility with existing intelligenceAnalyzer structure
 */
async function analyzeArticleWithClaude(article, existingArticles = []) {
  try {
    console.log(`🤖 Claude analyzing: ${article.title.substring(0, 50)}...`);
    
    const prompt = getAnalysisPrompt(article, existingArticles);

    const message = await anthropic.messages.create({
      model: "claude-3-sonnet-20240229",
      max_tokens: 2048,
      temperature: 0.3, // Lower temperature for consistent analysis
      messages: [{ role: 'user', content: prompt }],
    });

    const rawResponse = message.content[0].text;
    console.log(`📊 Claude response length: ${rawResponse.length} characters`);

    // Extract JSON from between analysis tags
    const analysisMatch = rawResponse.match(/<analysis>([\s\S]*?)<\/analysis>/);
    if (!analysisMatch || !analysisMatch[1]) {
      throw new Error("Valid analysis JSON not found in Claude's response");
    }

    const analysis = JSON.parse(analysisMatch[1].trim());
    
    // Validate and enhance analysis structure for compatibility
    const enhancedAnalysis = {
      relevanceScore: Math.max(0, Math.min(100, analysis.relevanceScore || 0)),
      confidenceLevel: Math.max(0, Math.min(100, analysis.confidenceLevel || 50)),
      priority: ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].includes(analysis.priority) ? analysis.priority : 'LOW',
      categories: Array.isArray(analysis.categories) ? analysis.categories.slice(0, 3) : [],
      entities: {
        countries: Array.isArray(analysis.entities?.countries) ? analysis.entities.countries.slice(0, 5) : [],
        organizations: Array.isArray(analysis.entities?.organizations) ? analysis.entities.organizations.slice(0, 5) : [],
        technologies: Array.isArray(analysis.entities?.technologies) ? analysis.entities.technologies.slice(0, 5) : [],
        weapons: Array.isArray(analysis.entities?.weapons) ? analysis.entities.weapons.slice(0, 5) : []
      },
      tags: Array.isArray(analysis.tags) ? analysis.tags.slice(0, 5) : [],
      isAdvertisement: Boolean(analysis.isAdvertisement),
      isDuplicate: Boolean(analysis.isDuplicate),
      duplicateOf: analysis.duplicateOf || null,
      isSignificantUpdate: Boolean(analysis.isSignificantUpdate)
    };

    // Apply source credibility adjustments (maintaining compatibility)
    if (article.source?.credibilityScore) {
      const credibilityMultiplier = article.source.credibilityScore / 100;
      enhancedAnalysis.relevanceScore = Math.min(100, enhancedAnalysis.relevanceScore * credibilityMultiplier);
    }

    // Apply recency boost (maintaining compatibility)
    if (article.publishedAt) {
      const hoursAgo = (Date.now() - new Date(article.publishedAt).getTime()) / (1000 * 60 * 60);
      if (hoursAgo < 6) enhancedAnalysis.relevanceScore = Math.min(100, enhancedAnalysis.relevanceScore + 10);
      else if (hoursAgo < 24) enhancedAnalysis.relevanceScore = Math.min(100, enhancedAnalysis.relevanceScore + 5);
    }

    // Breaking news boost (maintaining compatibility)
    if (article.title?.toLowerCase().includes('breaking') || 
        article.title?.toLowerCase().includes('urgent') ||
        article.title?.toLowerCase().includes('alert')) {
      enhancedAnalysis.relevanceScore = Math.min(100, enhancedAnalysis.relevanceScore + 15);
    }

    console.log(`✅ Claude analysis complete - Score: ${enhancedAnalysis.relevanceScore}, Priority: ${enhancedAnalysis.priority}, Confidence: ${enhancedAnalysis.confidenceLevel}%`);

    return {
      ...article,
      intelligence: enhancedAnalysis
    };

  } catch (error) {
    console.error(`❌ Claude analysis failed for: ${article.title}`, error);
    
    // Fallback analysis to maintain system stability (same as original)
    const fallbackAnalysis = {
      relevanceScore: 20,
      confidenceLevel: 30,
      priority: 'LOW',
      categories: [article.source?.category || 'GENERAL'],
      entities: { countries: [], organizations: [], technologies: [], weapons: [] },
      tags: article.source?.tags?.slice(0, 3) || ['UNKNOWN'],
      isAdvertisement: detectAdvertisementFallback(article),
      isDuplicate: false,
      duplicateOf: null,
      isSignificantUpdate: false
    };

    console.log(`🔄 Applied fallback analysis for: ${article.title.substring(0, 50)}...`);

    return {
      ...article,
      intelligence: fallbackAnalysis
    };
  }
}

/**
 * Fallback advertisement detection (simplified version of original logic)
 */
function detectAdvertisementFallback(article) {
  const content = `${article.title} ${article.content || article.summary || ''}`.toLowerCase();
  const url = article.url || '';

  // URL pattern checks
  const adPatterns = [
    /doubleclick\.net/i, /googleadservices\.com/i, /googlesyndication\.com/i,
    /amazon-adsystem\.com/i, /facebook\.com\/tr/i
  ];
  
  if (adPatterns.some(pattern => pattern.test(url) || pattern.test(content))) {
    return true;
  }

  // Promotional language check
  const promotionalWords = ['buy', 'sale', 'discount', 'offer', 'deal', 'shop', 'subscribe'];
  const words = content.split(/\s+/);
  const promotionalCount = words.filter(word => 
    promotionalWords.some(promo => word.includes(promo))
  ).length;

  return (promotionalCount / words.length) > 0.05;
}

/**
 * Processes multiple articles with batch optimization
 */
async function processArticlesBatch(articles, existingArticles = []) {
  console.log(`🚀 Processing ${articles.length} articles with Claude...`);
  
  const processedArticles = [];
  const batchSize = 3; // Limit concurrent requests to avoid rate limits

  for (let i = 0; i < articles.length; i += batchSize) {
    const batch = articles.slice(i, i + batchSize);
    
    const batchPromises = batch.map(article => 
      analyzeArticleWithClaude(article, existingArticles)
    );

    try {
      const batchResults = await Promise.allSettled(batchPromises);
      
      batchResults.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          processedArticles.push(result.value);
        } else {
          console.warn(`❌ Batch analysis failed for article ${i + index + 1}:`, result.reason);
          // Add with fallback analysis
          const fallbackArticle = batch[index];
          processedArticles.push({
            ...fallbackArticle,
            intelligence: {
              relevanceScore: 20,
              confidenceLevel: 30,
              priority: 'LOW',
              categories: [fallbackArticle.source?.category || 'GENERAL'],
              entities: { countries: [], organizations: [], technologies: [], weapons: [] },
              tags: fallbackArticle.source?.tags?.slice(0, 3) || ['UNKNOWN'],
              isAdvertisement: false,
              isDuplicate: false,
              duplicateOf: null,
              isSignificantUpdate: false
            }
          });
        }
      });

      // Brief pause between batches to respect rate limits
      if (i + batchSize < articles.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

    } catch (error) {
      console.error(`❌ Batch processing error:`, error);
      // Add all batch articles with fallback analysis
      batch.forEach(article => {
        processedArticles.push({
          ...article,
          intelligence: {
            relevanceScore: 20,
            confidenceLevel: 30,
            priority: 'LOW',
            categories: [article.source?.category || 'GENERAL'],
            entities: { countries: [], organizations: [], technologies: [], weapons: [] },
            tags: article.source?.tags?.slice(0, 3) || ['UNKNOWN'],
            isAdvertisement: false,
            isDuplicate: false,
            duplicateOf: null,
            isSignificantUpdate: false
          }
        });
      });
    }
  }

  console.log(`🏁 Claude batch processing complete: ${processedArticles.length} articles processed`);
  return processedArticles;
}

module.exports = { 
  analyzeArticleWithClaude,
  processArticlesBatch
};