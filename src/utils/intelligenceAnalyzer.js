// Enhanced Intelligence Analyzer for Ghost Brief
// Professional-grade AI analysis engine with multi-factor scoring

import { INTELLIGENCE_KEYWORDS, AD_DETECTION_PATTERNS, DUPLICATE_DETECTION } from '../data/mockData';
import { multiFactorScoringService } from '../services/multiFactorScoringService';
import { advancedEntityExtractionService } from '../services/advancedEntityExtraction';

/**
 * Enhanced Intelligence Analysis Engine
 * Provides sophisticated content analysis for intelligence assessment
 */
export class IntelligenceAnalyzer {
  constructor() {
    this.keywordDatabase = INTELLIGENCE_KEYWORDS;
    this.adPatterns = AD_DETECTION_PATTERNS;
    this.duplicateConfig = DUPLICATE_DETECTION;
    
    // Enhanced geopolitical entities database
    this.entityDatabase = {
      countries: [
        'CHINA', 'RUSSIA', 'IRAN', 'NORTH KOREA', 'UKRAINE', 'TAIWAN', 'SYRIA', 'ISRAEL',
        'PAKISTAN', 'INDIA', 'TURKEY', 'SAUDI ARABIA', 'VENEZUELA', 'MYANMAR', 'AFGHANISTAN',
        'USA', 'UNITED STATES', 'UK', 'BRITAIN', 'FRANCE', 'GERMANY', 'JAPAN', 'SOUTH KOREA',
        'NATO', 'EU', 'EUROPEAN UNION', 'ASEAN', 'BRICS'
      ],
      organizations: [
        'NATO', 'UN', 'IAEA', 'WHO', 'CIA', 'FSB', 'MSS', 'MOSSAD', 'MI6', 'BND',
        'PENTAGON', 'KREMLIN', 'PLA', 'IRANIAN REVOLUTIONARY GUARD', 'HEZBOLLAH', 'HAMAS',
        'ISIS', 'AL-QAEDA', 'TALIBAN', 'WAGNER GROUP', 'LAZARUS GROUP', 'APT', 'SCADA'
      ],
      technologies: [
        'HYPERSONIC', 'QUANTUM', 'AI', 'ARTIFICIAL INTELLIGENCE', 'NUCLEAR', 'CYBER',
        'SATELLITE', 'DRONE', 'UAV', 'STEALTH', 'RADAR', 'SONAR', 'GPS', 'BLOCKCHAIN',
        'CRYPTOCURRENCY', 'DEEPFAKE', 'BIOMETRIC', 'FACIAL RECOGNITION', 'SURVEILLANCE',
        'ENCRYPTION', 'ZERO-DAY', 'MALWARE', 'RANSOMWARE', 'BOTNET', 'DDOS'
      ],
      weapons: [
        'MISSILE', 'ICBM', 'SLBM', 'HYPERSONIC MISSILE', 'CRUISE MISSILE', 'BALLISTIC MISSILE',
        'NUCLEAR WEAPON', 'BIOWEAPON', 'CHEMICAL WEAPON', 'EMP', 'LASER WEAPON', 'RAILGUN',
        'F-35', 'F-22', 'SU-57', 'J-20', 'B-21', 'B-52', 'AIRCRAFT CARRIER', 'SUBMARINE',
        'DESTROYER', 'FRIGATE', 'TANK', 'APACHE', 'PREDATOR', 'REAPER', 'JAVELIN', 'PATRIOT'
      ]
    };

    // Intelligence priority scoring weights
    this.scoringWeights = {
      keywordRelevance: 0.35,
      entityDensity: 0.25,
      sourceCredibility: 0.20,
      recency: 0.10,
      geopoliticalContext: 0.10
    };

    // Enhanced keyword scoring with context awareness
    this.keywordScores = {
      CRITICAL: 90,
      HIGH: 70,
      MEDIUM: 50,
      GEOPOLITICAL: 40,
      TECHNOLOGY: 35,
      HEALTH: 30
    };
  }

  /**
   * Comprehensive intelligence analysis of article content
   * @param {Object} article - Article object to analyze
   * @param {Array} existingArticles - Existing articles for duplicate detection
   * @param {Object} options - Analysis options
   * @returns {Object} Enhanced article with intelligence metadata
   */
  async analyzeArticleIntelligence(article, existingArticles = [], options = {}) {
    try {
      console.log(`🔍 Analyzing intelligence content: ${article.title.substring(0, 50)}...`);

      // Step 1: Content preprocessing and normalization
      const processedContent = this.preprocessContent(article);
      
      // Step 2: Advanced entity extraction with enhanced service
      const basicEntityAnalysis = this.extractIntelligenceEntities(processedContent);
      const enhancedEntityAnalysis = advancedEntityExtractionService.extractAdvancedEntities(processedContent, article);
      
      // Combine basic and advanced entity extraction results
      const entityAnalysis = this.combineEntityAnalyses(basicEntityAnalysis, enhancedEntityAnalysis);
      
      // Step 3: Enhanced multi-factor scoring analysis
      const multiFactorAnalysis = multiFactorScoringService.calculateMultiFactorScore(
        article, 
        entityAnalysis, 
        existingArticles,
        options
      );
      
      // Step 4: Legacy relevance scoring for compatibility
      const relevanceAnalysis = this.calculateRelevanceScore(processedContent, article);
      
      // Step 5: Priority classification (now using multi-factor results)
      const priorityAnalysis = {
        priority: multiFactorAnalysis.priority,
        confidence: multiFactorAnalysis.priorityConfidence
      };
      
      // Step 5: Geopolitical context assessment
      const contextAnalysis = this.assessGeopoliticalContext(entityAnalysis, processedContent);
      
      // Step 6: Threat and strategic implications analysis
      const threatAnalysis = this.analyzeThreatImplications(processedContent, entityAnalysis);
      
      // Step 7: Advertisement detection
      const isAdvertisement = this.detectAdvertisement(article);
      
      // Step 8: Duplicate detection with similarity analysis
      const duplicateAnalysis = this.detectDuplicates(article, existingArticles);
      
      // Step 9: Category classification
      const categories = this.classifyIntelligenceCategories(entityAnalysis, relevanceAnalysis);
      
      // Step 10: Generate intelligence tags
      const tags = this.generateIntelligenceTags(entityAnalysis, categories, processedContent);

      // Compile comprehensive intelligence assessment using multi-factor analysis
      const intelligence = {
        relevanceScore: multiFactorAnalysis.overallScore,
        confidenceLevel: multiFactorAnalysis.confidenceLevel,
        priority: priorityAnalysis.priority,
        categories: categories,
        tags: tags,
        entities: entityAnalysis,
        isAdvertisement: isAdvertisement,
        isDuplicate: duplicateAnalysis.isDuplicate,
        duplicateOf: duplicateAnalysis.duplicateOf,
        isSignificantUpdate: duplicateAnalysis.isSignificantUpdate,
        threatAssessment: threatAnalysis.level,
        strategicImplications: threatAnalysis.implications,
        temporalRelevance: this.calculateTemporalRelevance(article),
        geopoliticalContext: contextAnalysis.summary,
        analysisBreakdown: {
          // Enhanced breakdown with multi-factor details
          keywordMatches: relevanceAnalysis.keywords,
          entityDensity: entityAnalysis.density,
          sourceCredibility: article.source?.credibilityScore || 70,
          contextualFactors: contextAnalysis.factors,
          multiFactorBreakdown: multiFactorAnalysis.factorBreakdown,
          scoringAlgorithm: multiFactorAnalysis.scoringMetadata.algorithm
        },
        // Enhanced metadata with multi-factor scoring details
        enhancedAnalysis: {
          multiFactorScore: multiFactorAnalysis.overallScore,
          factorBreakdown: multiFactorAnalysis.factorBreakdown,
          detailedAnalysis: multiFactorAnalysis.detailedAnalysis,
          priorityReasoning: multiFactorAnalysis.priorityConfidence || priorityAnalysis.confidence,
          scoringVersion: multiFactorAnalysis.scoringMetadata.algorithm,
          
          // Advanced entity extraction details
          entityExtraction: {
            totalEntities: entityAnalysis.totalEntities,
            uniqueEntities: entityAnalysis.uniqueEntities,
            relationships: entityAnalysis.relationships,
            criticalCombinations: entityAnalysis.criticalCombinations,
            escalationIndicators: entityAnalysis.escalationIndicators,
            significance: entityAnalysis.significance,
            technicalDesignations: entityAnalysis.technicalDesignations,
            quantitativeData: entityAnalysis.quantitativeData,
            extractionMethods: entityAnalysis.extractionMethods
          }
        }
      };

      console.log(`✅ Intelligence analysis complete: Score ${intelligence.relevanceScore}, Priority ${intelligence.priority}`);

      return {
        ...article,
        intelligence
      };

    } catch (error) {
      console.error('❌ Intelligence analysis failed:', error);
      return this.createFallbackAnalysis(article);
    }
  }

  /**
   * Preprocesses article content for analysis
   * @param {Object} article - Article object
   * @returns {Object} Processed content object
   */
  preprocessContent(article) {
    const title = (article.title || '').toUpperCase();
    const content = (article.content || article.summary || '').toUpperCase();
    const combined = `${title} ${content}`;

    return {
      title,
      content,
      combined,
      wordCount: combined.split(/\s+/).length,
      sentences: combined.split(/[.!?]+/).filter(s => s.trim().length > 0)
    };
  }

  /**
   * Multi-factor relevance scoring algorithm
   * @param {Object} processedContent - Processed content object
   * @param {Object} article - Original article
   * @returns {Object} Relevance analysis
   */
  calculateRelevanceScore(processedContent, article) {
    let totalScore = 0;
    let confidence = 50;
    const matchedKeywords = [];

    // Enhanced keyword matching with context weighting
    Object.entries(this.keywordDatabase).forEach(([category, keywords]) => {
      const categoryScore = this.keywordScores[category] || 20;
      
      keywords.forEach(keyword => {
        const keywordUpper = keyword.toUpperCase();
        const titleMatches = (processedContent.title.match(new RegExp(keywordUpper, 'g')) || []).length;
        const contentMatches = (processedContent.content.match(new RegExp(keywordUpper, 'g')) || []).length;
        
        if (titleMatches > 0 || contentMatches > 0) {
          // Title matches are weighted more heavily
          const keywordScore = (titleMatches * 2 + contentMatches) * categoryScore * 0.01;
          totalScore += keywordScore;
          confidence += titleMatches * 5 + contentMatches * 2;
          
          matchedKeywords.push({
            keyword: keyword,
            category: category,
            titleMatches,
            contentMatches,
            score: keywordScore
          });
        }
      });
    });

    // Source credibility factor
    const credibilityBonus = (article.source?.credibilityScore || 70) * 0.3;
    totalScore += credibilityBonus;

    // Content depth factor
    const depthFactor = Math.min(processedContent.wordCount / 200, 1) * 10;
    totalScore += depthFactor;

    // Recency factor (newer content gets slight boost)
    const recencyFactor = this.calculateRecencyBoost(article);
    totalScore += recencyFactor;

    return {
      score: Math.min(totalScore, 100),
      confidence: Math.min(confidence, 100),
      keywords: matchedKeywords,
      factors: {
        keywordScore: totalScore - credibilityBonus - depthFactor - recencyFactor,
        credibilityBonus,
        depthFactor,
        recencyFactor
      }
    };
  }

  /**
   * Advanced entity extraction for intelligence assessment
   * @param {Object} processedContent - Processed content
   * @returns {Object} Entity analysis
   */
  extractIntelligenceEntities(processedContent) {
    const entities = {
      countries: [],
      organizations: [],
      technologies: [],
      weapons: []
    };

    let totalMatches = 0;

    // Extract entities with frequency counting
    Object.entries(this.entityDatabase).forEach(([entityType, entityList]) => {
      entityList.forEach(entity => {
        const matches = (processedContent.combined.match(new RegExp(entity, 'g')) || []).length;
        if (matches > 0) {
          entities[entityType].push({
            name: entity,
            frequency: matches,
            inTitle: processedContent.title.includes(entity)
          });
          totalMatches += matches;
        }
      });
    });

    // Sort entities by frequency and relevance
    Object.keys(entities).forEach(entityType => {
      entities[entityType] = entities[entityType]
        .sort((a, b) => {
          // Prioritize entities in title, then by frequency
          if (a.inTitle && !b.inTitle) return -1;
          if (!a.inTitle && b.inTitle) return 1;
          return b.frequency - a.frequency;
        })
        .slice(0, 10) // Limit to top 10 per category
        .map(e => e.name);
    });

    return {
      ...entities,
      density: Math.min((totalMatches / processedContent.wordCount) * 100, 100),
      totalMatches
    };
  }

  /**
   * Intelligence priority classification with confidence scoring
   * @param {Object} relevanceAnalysis - Relevance analysis results
   * @param {Object} entityAnalysis - Entity analysis results
   * @returns {Object} Priority classification
   */
  classifyIntelligencePriority(relevanceAnalysis, entityAnalysis) {
    const score = relevanceAnalysis.score;
    const criticalKeywords = relevanceAnalysis.keywords.filter(k => k.category === 'CRITICAL');
    const highKeywords = relevanceAnalysis.keywords.filter(k => k.category === 'HIGH');
    const hasNuclearEntities = entityAnalysis.weapons.some(w => w.includes('NUCLEAR'));
    const hasCriticalCountries = entityAnalysis.countries.some(c => 
      ['CHINA', 'RUSSIA', 'IRAN', 'NORTH KOREA'].includes(c)
    );

    // Enhanced priority classification logic
    if (score >= 80 && (criticalKeywords.length >= 2 || hasNuclearEntities)) {
      return { priority: 'CRITICAL', confidence: 95 };
    }
    
    if (score >= 65 && (criticalKeywords.length >= 1 || highKeywords.length >= 2 || hasCriticalCountries)) {
      return { priority: 'HIGH', confidence: 85 };
    }
    
    if (score >= 40 && (highKeywords.length >= 1 || entityAnalysis.density > 3)) {
      return { priority: 'MEDIUM', confidence: 75 };
    }
    
    return { priority: 'LOW', confidence: 60 };
  }

  /**
   * Geopolitical context assessment
   * @param {Object} entityAnalysis - Entity analysis
   * @param {Object} processedContent - Processed content
   * @returns {Object} Context analysis
   */
  assessGeopoliticalContext(entityAnalysis, processedContent) {
    const contexts = [];
    const factors = [];

    // Regional tension analysis
    const tensionRegions = {
      'EAST_ASIA': ['CHINA', 'TAIWAN', 'NORTH KOREA', 'SOUTH KOREA', 'JAPAN'],
      'MIDDLE_EAST': ['IRAN', 'ISRAEL', 'SYRIA', 'SAUDI ARABIA', 'TURKEY'],
      'EASTERN_EUROPE': ['RUSSIA', 'UKRAINE', 'NATO', 'EU'],
      'SOUTH_ASIA': ['INDIA', 'PAKISTAN', 'AFGHANISTAN']
    };

    Object.entries(tensionRegions).forEach(([region, countries]) => {
      const regionMatches = countries.filter(country => 
        entityAnalysis.countries.includes(country)
      );
      
      if (regionMatches.length >= 2) {
        contexts.push(`${region.replace('_', ' ')} regional tensions`);
        factors.push({
          region,
          countries: regionMatches,
          tensionLevel: regionMatches.length >= 3 ? 'HIGH' : 'MEDIUM'
        });
      }
    });

    // Technology competition context
    const techKeywords = ['AI', 'QUANTUM', 'HYPERSONIC', 'CYBER', 'SPACE'];
    const techMatches = techKeywords.filter(tech => 
      processedContent.combined.includes(tech)
    );
    
    if (techMatches.length >= 2 && entityAnalysis.countries.length >= 2) {
      contexts.push('Technology competition dynamics');
      factors.push({
        type: 'TECHNOLOGY_COMPETITION',
        technologies: techMatches,
        countries: entityAnalysis.countries
      });
    }

    return {
      summary: contexts.join(', ') || 'General intelligence context',
      factors,
      complexity: factors.length
    };
  }

  /**
   * Threat and strategic implications analysis
   * @param {Object} processedContent - Processed content
   * @param {Object} entityAnalysis - Entity analysis
   * @returns {Object} Threat analysis
   */
  analyzeThreatImplications(processedContent, entityAnalysis) {
    const threatIndicators = [];
    const implications = [];

    // Nuclear threat assessment
    const nuclearTerms = ['NUCLEAR', 'ICBM', 'URANIUM', 'ENRICHMENT', 'WARHEAD'];
    const nuclearMatches = nuclearTerms.filter(term => 
      processedContent.combined.includes(term)
    );
    
    if (nuclearMatches.length >= 2) {
      threatIndicators.push('NUCLEAR');
      implications.push('Nuclear escalation potential');
    }

    // Cyber threat assessment
    const cyberTerms = ['CYBER', 'MALWARE', 'HACK', 'BREACH', 'RANSOMWARE'];
    const cyberMatches = cyberTerms.filter(term => 
      processedContent.combined.includes(term)
    );
    
    if (cyberMatches.length >= 2) {
      threatIndicators.push('CYBER');
      implications.push('Cybersecurity implications');
    }

    // Military escalation assessment
    const militaryTerms = ['DEPLOYMENT', 'MISSILE', 'AIRCRAFT', 'NAVAL', 'STRIKE'];
    const militaryMatches = militaryTerms.filter(term => 
      processedContent.combined.includes(term)
    );
    
    if (militaryMatches.length >= 2 && entityAnalysis.countries.length >= 2) {
      threatIndicators.push('MILITARY');
      implications.push('Military escalation risk');
    }

    // Determine overall threat level
    let threatLevel = 'LOW';
    if (threatIndicators.includes('NUCLEAR')) {
      threatLevel = 'CRITICAL';
    } else if (threatIndicators.length >= 2) {
      threatLevel = 'HIGH';
    } else if (threatIndicators.length >= 1) {
      threatLevel = 'MEDIUM';
    }

    return {
      level: threatLevel,
      indicators: threatIndicators,
      implications: implications.join(', ') || 'Standard intelligence monitoring'
    };
  }

  /**
   * Enhanced advertisement detection
   * @param {Object} article - Article object
   * @returns {boolean} True if advertisement detected
   */
  detectAdvertisement(article) {
    const url = article.url || '';
    const title = (article.title || '').toLowerCase();
    const content = (article.content || article.summary || '').toLowerCase();

    // URL-based detection
    const hasAdUrl = this.adPatterns.some(pattern => pattern.test(url));
    if (hasAdUrl) return true;

    // Content-based detection
    const adIndicators = [
      'sponsored', 'advertisement', 'promoted', 'affiliate',
      'buy now', 'limited time', 'click here', '% off',
      'free trial', 'subscribe now', 'special offer',
      'deal of the day', 'discount', 'coupon'
    ];

    const adMatches = adIndicators.filter(indicator => 
      title.includes(indicator) || content.includes(indicator)
    );

    return adMatches.length >= 2;
  }

  /**
   * Advanced duplicate detection with similarity analysis
   * @param {Object} article - Current article
   * @param {Array} existingArticles - Existing articles
   * @returns {Object} Duplicate analysis
   */
  detectDuplicates(article, existingArticles) {
    const timeWindow = this.duplicateConfig.timeWindowHours * 60 * 60 * 1000;
    const articleTime = new Date(article.publishedAt || article.fetchedAt).getTime();
    
    // Filter articles within time window
    const recentArticles = existingArticles.filter(existing => {
      const existingTime = new Date(existing.publishedAt || existing.fetchedAt).getTime();
      return Math.abs(articleTime - existingTime) < timeWindow;
    });

    for (const existing of recentArticles) {
      const similarity = this.calculateContentSimilarity(article, existing);
      
      if (similarity.overall > this.duplicateConfig.titleSimilarityThreshold) {
        // Check if this is a significant update
        const isSignificantUpdate = this.isSignificantUpdate(article, existing);
        
        return {
          isDuplicate: true,
          duplicateOf: existing.id,
          similarity: similarity.overall,
          isSignificantUpdate
        };
      }
    }

    return {
      isDuplicate: false,
      duplicateOf: null,
      isSignificantUpdate: false
    };
  }

  /**
   * Calculate content similarity between articles
   * @param {Object} article1 - First article
   * @param {Object} article2 - Second article
   * @returns {Object} Similarity analysis
   */
  calculateContentSimilarity(article1, article2) {
    const title1 = this.normalizeForComparison(article1.title || '');
    const title2 = this.normalizeForComparison(article2.title || '');
    const content1 = this.normalizeForComparison(article1.content || article1.summary || '');
    const content2 = this.normalizeForComparison(article2.content || article2.summary || '');

    const titleSimilarity = this.calculateStringSimilarity(title1, title2);
    const contentSimilarity = this.calculateStringSimilarity(content1, content2);
    
    // Weight title similarity more heavily
    const overall = (titleSimilarity * 0.7) + (contentSimilarity * 0.3);

    return {
      title: titleSimilarity,
      content: contentSimilarity,
      overall
    };
  }

  /**
   * Check if article is a significant update to existing content
   * @param {Object} newArticle - New article
   * @param {Object} existingArticle - Existing article
   * @returns {boolean} True if significant update
   */
  isSignificantUpdate(newArticle, existingArticle) {
    const newTime = new Date(newArticle.publishedAt || newArticle.fetchedAt).getTime();
    const existingTime = new Date(existingArticle.publishedAt || existingArticle.fetchedAt).getTime();
    
    // Must be newer
    if (newTime <= existingTime) return false;

    // Check for update indicators
    const updateIndicators = [
      'update', 'breaking', 'latest', 'new details', 'confirmed',
      'revised', 'additional', 'more', 'further', 'now'
    ];

    const newTitle = (newArticle.title || '').toLowerCase();
    const hasUpdateIndicator = updateIndicators.some(indicator => 
      newTitle.includes(indicator)
    );

    return hasUpdateIndicator;
  }

  /**
   * Classify intelligence categories based on analysis
   * @param {Object} entityAnalysis - Entity analysis
   * @param {Object} relevanceAnalysis - Relevance analysis
   * @returns {Array} Category classifications
   */
  classifyIntelligenceCategories(entityAnalysis, relevanceAnalysis) {
    const categories = new Set();

    // Entity-based categorization
    if (entityAnalysis.weapons.length > 0 || entityAnalysis.technologies.some(t => 
      ['MISSILE', 'NUCLEAR', 'MILITARY'].some(m => t.includes(m))
    )) {
      categories.add('MILITARY');
    }

    if (entityAnalysis.technologies.some(t => 
      ['CYBER', 'AI', 'QUANTUM', 'COMPUTER'].some(tech => t.includes(tech))
    )) {
      categories.add('TECHNOLOGY');
    }

    if (entityAnalysis.countries.length >= 2) {
      categories.add('GEOPOLITICS');
    }

    if (entityAnalysis.technologies.some(t => t.includes('NUCLEAR')) ||
        entityAnalysis.weapons.some(w => w.includes('NUCLEAR'))) {
      categories.add('NUCLEAR');
    }

    // Keyword-based categorization
    relevanceAnalysis.keywords.forEach(keyword => {
      if (keyword.category === 'HEALTH') categories.add('HEALTH');
      if (keyword.keyword.toLowerCase().includes('cyber')) categories.add('CYBERSECURITY');
      if (keyword.keyword.toLowerCase().includes('financ')) categories.add('FINANCE');
    });

    // Default category if none detected
    if (categories.size === 0) {
      categories.add('GENERAL');
    }

    return Array.from(categories);
  }

  /**
   * Generate comprehensive intelligence tags
   * @param {Object} entityAnalysis - Entity analysis
   * @param {Array} categories - Categories
   * @param {Object} processedContent - Processed content
   * @returns {Array} Intelligence tags
   */
  generateIntelligenceTags(entityAnalysis, categories, processedContent) {
    const tags = new Set();

    // Add top entities as tags
    entityAnalysis.countries.slice(0, 3).forEach(country => tags.add(country));
    entityAnalysis.organizations.slice(0, 2).forEach(org => tags.add(org));
    entityAnalysis.technologies.slice(0, 3).forEach(tech => tags.add(tech));
    entityAnalysis.weapons.slice(0, 2).forEach(weapon => tags.add(weapon));

    // Add category-based tags
    categories.forEach(category => tags.add(category));

    // Add contextual tags based on content analysis
    const contextTags = this.extractContextualTags(processedContent);
    contextTags.forEach(tag => tags.add(tag));

    // Clean and format tags
    return Array.from(tags)
      .filter(tag => tag && tag.length > 2)
      .slice(0, 15) // Limit to 15 tags
      .sort();
  }

  /**
   * Extract contextual tags from content
   * @param {Object} processedContent - Processed content
   * @returns {Array} Contextual tags
   */
  extractContextualTags(processedContent) {
    const contextualKeywords = [
      'DEPLOYMENT', 'SANCTIONS', 'TREATY', 'ALLIANCE', 'SUMMIT',
      'BREACH', 'ATTACK', 'DEFENSE', 'STRATEGY', 'OPERATION',
      'INTELLIGENCE', 'SURVEILLANCE', 'RECONNAISSANCE', 'ANALYSIS'
    ];

    return contextualKeywords.filter(keyword => 
      processedContent.combined.includes(keyword)
    );
  }

  /**
   * Calculate temporal relevance factor
   * @param {Object} article - Article object
   * @returns {number} Temporal relevance score (0-100)
   */
  calculateTemporalRelevance(article) {
    const articleTime = new Date(article.publishedAt || article.fetchedAt).getTime();
    const now = Date.now();
    const ageHours = (now - articleTime) / (1000 * 60 * 60);

    // Relevance decreases over time but stabilizes
    if (ageHours < 1) return 100;
    if (ageHours < 6) return 95;
    if (ageHours < 24) return 85;
    if (ageHours < 72) return 70;
    if (ageHours < 168) return 50; // 1 week
    return 30;
  }

  /**
   * Calculate recency boost for scoring
   * @param {Object} article - Article object
   * @returns {number} Recency boost score
   */
  calculateRecencyBoost(article) {
    const articleTime = new Date(article.publishedAt || article.fetchedAt).getTime();
    const now = Date.now();
    const ageHours = (now - articleTime) / (1000 * 60 * 60);

    if (ageHours < 1) return 5;
    if (ageHours < 6) return 3;
    if (ageHours < 24) return 1;
    return 0;
  }

  /**
   * String similarity calculation using Jaccard similarity
   * @param {string} str1 - First string
   * @param {string} str2 - Second string
   * @returns {number} Similarity score (0-1)
   */
  calculateStringSimilarity(str1, str2) {
    if (!str1 || !str2) return 0;

    const set1 = new Set(str1.split(/\s+/));
    const set2 = new Set(str2.split(/\s+/));
    
    const intersection = new Set([...set1].filter(x => set2.has(x)));
    const union = new Set([...set1, ...set2]);
    
    return intersection.size / union.size;
  }

  /**
   * Normalize string for comparison
   * @param {string} str - String to normalize
   * @returns {string} Normalized string
   */
  normalizeForComparison(str) {
    return str.toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  /**
   * Combine basic and advanced entity extraction results
   * @param {Object} basicAnalysis - Basic entity extraction results
   * @param {Object} enhancedAnalysis - Advanced entity extraction results
   * @returns {Object} Combined entity analysis
   */
  combineEntityAnalyses(basicAnalysis, enhancedAnalysis) {
    // Merge entity lists, prioritizing enhanced results while preserving basic structure
    const combined = {
      // Standard entities (enhanced takes precedence, fallback to basic)
      countries: enhancedAnalysis.countries.length > 0 ? enhancedAnalysis.countries : basicAnalysis.countries,
      organizations: enhancedAnalysis.organizations.length > 0 ? enhancedAnalysis.organizations : basicAnalysis.organizations,
      technologies: enhancedAnalysis.technologies.length > 0 ? enhancedAnalysis.technologies : basicAnalysis.technologies,
      weapons: enhancedAnalysis.weapons.length > 0 ? enhancedAnalysis.weapons : basicAnalysis.weapons,
      
      // Advanced entities (only from enhanced service)
      weaponSystems: enhancedAnalysis.weaponSystems || [],
      locations: enhancedAnalysis.locations || [],
      technicalDesignations: enhancedAnalysis.technicalDesignations || {},
      quantitativeData: enhancedAnalysis.quantitativeData || {},
      relationships: enhancedAnalysis.relationships || [],
      
      // Combined metrics
      density: Math.max(basicAnalysis.density || 0, enhancedAnalysis.density || 0),
      totalMatches: (basicAnalysis.totalMatches || 0) + (enhancedAnalysis.totalEntities || 0),
      
      // Enhanced analysis metadata
      significance: enhancedAnalysis.significance || { overall: 'LOW', factors: [] },
      criticalCombinations: enhancedAnalysis.criticalCombinations || [],
      escalationIndicators: enhancedAnalysis.escalationIndicators || [],
      
      // Legacy compatibility
      totalEntities: enhancedAnalysis.totalEntities || Object.values(basicAnalysis).flat().length,
      uniqueEntities: enhancedAnalysis.uniqueEntities || 0,
      
      // Analysis metadata
      extractionMethods: ['basic', 'advanced'],
      enhancedExtractionUsed: true
    };

    console.log(`🔗 Combined entity analysis: ${combined.totalEntities} entities, ${combined.relationships.length} relationships`);
    return combined;
  }

  /**
   * Create fallback analysis for failed processing
   * @param {Object} article - Original article
   * @returns {Object} Article with fallback intelligence
   */
  createFallbackAnalysis(article) {
    return {
      ...article,
      intelligence: {
        relevanceScore: 25,
        confidenceLevel: 40,
        priority: 'LOW',
        categories: ['GENERAL'],
        tags: ['UNPROCESSED'],
        entities: {
          countries: [],
          organizations: [],
          technologies: [],
          weapons: []
        },
        isAdvertisement: false,
        isDuplicate: false,
        duplicateOf: null,
        isSignificantUpdate: false,
        threatAssessment: 'LOW',
        strategicImplications: 'Requires manual review',
        temporalRelevance: this.calculateTemporalRelevance(article),
        geopoliticalContext: 'Unknown context',
        analysisBreakdown: {
          error: 'Analysis failed, fallback applied'
        }
      }
    };
  }
}

// Utility functions for external use

/**
 * Filter articles by relevance threshold
 * @param {Array} articles - Articles to filter
 * @param {number} threshold - Minimum relevance score
 * @returns {Array} Filtered articles
 */
export function filterByRelevance(articles, threshold = 40) {
  return articles.filter(article => 
    article.intelligence && 
    !article.intelligence.isAdvertisement &&
    article.intelligence.relevanceScore >= threshold
  );
}

/**
 * Sort articles by intelligence priority and relevance
 * @param {Array} articles - Articles to sort
 * @returns {Array} Sorted articles
 */
export function sortByIntelligencePriority(articles) {
  const priorityWeight = {
    'CRITICAL': 1000,
    'HIGH': 100,
    'MEDIUM': 10,
    'LOW': 1
  };

  return articles.sort((a, b) => {
    const aWeight = priorityWeight[a.intelligence?.priority || 'LOW'] + (a.intelligence?.relevanceScore || 0);
    const bWeight = priorityWeight[b.intelligence?.priority || 'LOW'] + (b.intelligence?.relevanceScore || 0);
    return bWeight - aWeight;
  });
}

/**
 * Get intelligence summary statistics
 * @param {Array} articles - Articles to analyze
 * @returns {Object} Summary statistics
 */
export function getIntelligenceSummary(articles) {
  const validArticles = articles.filter(a => a.intelligence);
  
  if (validArticles.length === 0) {
    return {
      total: 0,
      averageRelevance: 0,
      priorityCounts: { CRITICAL: 0, HIGH: 0, MEDIUM: 0, LOW: 0 },
      topCategories: [],
      threatLevels: { CRITICAL: 0, HIGH: 0, MEDIUM: 0, LOW: 0 }
    };
  }

  const priorityCounts = validArticles.reduce((acc, article) => {
    const priority = article.intelligence.priority || 'LOW';
    acc[priority] = (acc[priority] || 0) + 1;
    return acc;
  }, {});

  const threatLevels = validArticles.reduce((acc, article) => {
    const threat = article.intelligence.threatAssessment || 'LOW';
    acc[threat] = (acc[threat] || 0) + 1;
    return acc;
  }, {});

  const allCategories = validArticles.flatMap(a => a.intelligence.categories || []);
  const categoryCount = allCategories.reduce((acc, cat) => {
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {});

  const topCategories = Object.entries(categoryCount)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .map(([cat, count]) => ({ category: cat, count }));

  const averageRelevance = validArticles.reduce((sum, article) => 
    sum + (article.intelligence.relevanceScore || 0), 0
  ) / validArticles.length;

  return {
    total: validArticles.length,
    averageRelevance: Math.round(averageRelevance),
    priorityCounts,
    topCategories,
    threatLevels
  };
}

// Export singleton instance
export const intelligenceAnalyzer = new IntelligenceAnalyzer();

// Named export for analysis function
export const analyzeArticleIntelligence = intelligenceAnalyzer.analyzeArticleIntelligence.bind(intelligenceAnalyzer);