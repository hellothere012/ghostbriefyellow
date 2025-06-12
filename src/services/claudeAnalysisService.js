// Enhanced Claude Analysis Service for Ghost Brief
// Professional intelligence analysis with sophisticated prompts

/**
 * Enhanced Claude Analysis Service
 * Provides professional-grade prompts and analysis coordination
 */
export class ClaudeAnalysisService {
  constructor() {
    this.analysisVersion = '3.0-professional';
    this.promptTemplates = this.initializePromptTemplates();
  }

  /**
   * Initialize professional intelligence analysis prompt templates
   */
  initializePromptTemplates() {
    return {
      // Main intelligence analysis prompt
      intelligenceAnalysis: `You are an expert intelligence analyst working for a professional intelligence organization. Analyze the provided article content for intelligence value and provide a comprehensive assessment.

ANALYSIS REQUIREMENTS:
1. RELEVANCE SCORING (0-100): Assess intelligence value based on:
   - Strategic importance to national/international security
   - Operational implications for military/security forces
   - Geopolitical significance and regional stability impact
   - Technological advancement implications
   - Economic/financial security considerations

2. PRIORITY CLASSIFICATION:
   - CRITICAL: Immediate threat to national security, nuclear issues, major cyber attacks, armed conflicts, terrorist activities
   - HIGH: Military deployments, significant weapons systems, major diplomatic developments, serious cyber incidents
   - MEDIUM: Defense technology advances, diplomatic tensions, trade/economic security issues
   - LOW: General military/security news without immediate operational impact

3. ENTITY EXTRACTION:
   - Countries: All nations, territories, and regional blocs mentioned
   - Organizations: Military, intelligence, terrorist, international organizations
   - Technologies: Weapons systems, cyber tools, surveillance tech, dual-use technology
   - Weapons: Specific weapon systems, missile types, military platforms

4. CATEGORY CLASSIFICATION:
   - MILITARY: Armed forces, weapons, defense systems, military operations
   - TECHNOLOGY: Cyber, AI, quantum, space, dual-use technologies
   - GEOPOLITICS: International relations, diplomacy, territorial disputes
   - CYBERSECURITY: Cyber attacks, data breaches, digital warfare
   - NUCLEAR: Nuclear weapons, facilities, materials, proliferation
   - FINANCE: Economic warfare, sanctions, financial crimes, market manipulation
   - HEALTH: Bioweapons, pandemic threats, health security
   - SCIENCE: Research with security implications, space technology

5. THREAT ASSESSMENT:
   - Evaluate immediate and long-term threat implications
   - Assess strategic impact on regional/global stability
   - Consider escalation potential and response requirements

6. CONFIDENCE LEVEL (0-100):
   - Based on source credibility, information specificity, corroboration needs
   - Account for potential disinformation or propaganda elements

CONTENT QUALITY CHECKS:
- Advertisement Detection: Identify promotional content, sponsored articles, commercial messaging
- Duplicate Analysis: Check for similar content patterns, recurring themes, information redundancy
- Temporal Relevance: Assess time-sensitivity and operational urgency

OUTPUT FORMAT:
Provide analysis as a structured JSON object with the following fields:
{
  "relevanceScore": number (0-100),
  "confidenceLevel": number (0-100),
  "priority": "CRITICAL|HIGH|MEDIUM|LOW",
  "categories": ["category1", "category2"],
  "tags": ["tag1", "tag2", "tag3"],
  "entities": {
    "countries": ["country1", "country2"],
    "organizations": ["org1", "org2"],
    "technologies": ["tech1", "tech2"],
    "weapons": ["weapon1", "weapon2"]
  },
  "isAdvertisement": boolean,
  "isDuplicate": boolean,
  "threatAssessment": "CRITICAL|HIGH|MEDIUM|LOW",
  "strategicImplications": "brief description of strategic implications",
  "geopoliticalContext": "relevant geopolitical context",
  "analysisRationale": "explanation of scoring and classification decisions"
}

ANALYSIS STANDARDS:
- Apply intelligence community analytical standards
- Consider multiple perspectives and potential biases
- Evaluate information reliability and source credibility
- Assess operational implications and response requirements
- Maintain professional objectivity and analytical rigor`,

      // Geopolitical context analysis prompt
      geopoliticalContext: `As a geopolitical intelligence specialist, analyze the broader strategic context of this article.

CONTEXT ANALYSIS REQUIREMENTS:
1. Regional Dynamics: Identify relevant regional tensions, alliances, and power balances
2. Historical Patterns: Note connections to historical conflicts, agreements, or patterns
3. Actor Motivations: Assess likely motivations of key state and non-state actors
4. Escalation Potential: Evaluate potential for conflict escalation or de-escalation
5. International Implications: Consider broader international system impacts

Focus on providing strategic context that helps understand the significance of the reported events within the broader geopolitical landscape.`,

      // Threat assessment prompt
      threatAssessment: `As a threat assessment specialist, evaluate the security implications of this content.

THREAT EVALUATION CRITERIA:
1. Immediate Threats: Direct and imminent security risks
2. Emerging Threats: Developing capabilities or intentions that pose future risks
3. Systemic Risks: Threats to broader security architecture or stability
4. Cascade Effects: Potential for threat escalation or spread to other domains
5. Mitigation Requirements: Assessment of response and countermeasure needs

Provide a comprehensive threat evaluation that prioritizes risks and identifies key security considerations.`,

      // Technology assessment prompt
      technologyAssessment: `As a technology intelligence analyst, assess the technological significance and implications.

TECHNOLOGY ANALYSIS FOCUS:
1. Capability Assessment: Evaluate technical capabilities and advancement levels
2. Dual-Use Potential: Identify civilian and military application possibilities
3. Strategic Impact: Assess impact on military balance, deterrence, or security
4. Proliferation Risk: Evaluate potential for technology transfer or proliferation
5. Countermeasure Requirements: Identify needs for defensive or competitive responses

Focus on understanding how technology developments affect security, military capabilities, and strategic balance.`,

      // Economic security prompt
      economicSecurity: `As an economic security analyst, evaluate the financial and economic intelligence implications.

ECONOMIC ANALYSIS REQUIREMENTS:
1. Financial Warfare: Assess use of economic tools as weapons
2. Supply Chain Security: Evaluate critical supply chain vulnerabilities or dependencies
3. Sanctions Impact: Analyze sanctions effectiveness and economic consequences
4. Resource Competition: Identify strategic resource competition and implications
5. Market Manipulation: Assess potential for market interference or manipulation

Provide analysis of economic factors that impact national security and strategic stability.`
    };
  }

  /**
   * Generate comprehensive intelligence analysis prompt
   * @param {Object} article - Article to analyze
   * @param {Array} existingArticles - Existing articles for context
   * @param {Object} options - Analysis options
   * @returns {Object} Analysis prompt and parameters
   */
  generateIntelligencePrompt(article, existingArticles = [], options = {}) {
    const context = this.buildAnalysisContext(article, existingArticles);
    const primaryPrompt = this.promptTemplates.intelligenceAnalysis;
    
    const analysisRequest = {
      prompt: primaryPrompt,
      context: context,
      article: {
        title: article.title,
        content: article.content || article.summary,
        url: article.url,
        publishedAt: article.publishedAt,
        source: article.source
      },
      parameters: {
        analysisDepth: options.depth || 'comprehensive',
        focusAreas: options.focusAreas || ['all'],
        confidenceThreshold: options.confidenceThreshold || 70,
        version: this.analysisVersion
      }
    };

    return analysisRequest;
  }

  /**
   * Generate specialized analysis prompts for specific domains
   * @param {Object} article - Article to analyze
   * @param {string} domain - Analysis domain
   * @returns {Object} Specialized prompt
   */
  generateSpecializedPrompt(article, domain) {
    const prompts = {
      geopolitical: this.promptTemplates.geopoliticalContext,
      threat: this.promptTemplates.threatAssessment,
      technology: this.promptTemplates.technologyAssessment,
      economic: this.promptTemplates.economicSecurity
    };

    const basePrompt = prompts[domain] || prompts.geopolitical;
    
    return {
      prompt: basePrompt,
      article: {
        title: article.title,
        content: article.content || article.summary,
        source: article.source
      },
      domain: domain,
      version: this.analysisVersion
    };
  }

  /**
   * Build analysis context from existing articles and patterns
   * @param {Object} currentArticle - Current article being analyzed
   * @param {Array} existingArticles - Existing articles for context
   * @returns {Object} Analysis context
   */
  buildAnalysisContext(currentArticle, existingArticles) {
    // Get recent articles from similar sources or topics
    const recentArticles = existingArticles
      .filter(article => {
        const articleTime = new Date(article.publishedAt || article.fetchedAt).getTime();
        const daysSince = (Date.now() - articleTime) / (1000 * 60 * 60 * 24);
        return daysSince <= 7; // Last 7 days
      })
      .slice(0, 10); // Limit context size

    // Extract relevant entities and themes
    const contextEntities = this.extractContextEntities(recentArticles);
    const trendingTopics = this.identifyTrendingTopics(recentArticles);

    return {
      recentTrends: trendingTopics,
      activeEntities: contextEntities,
      sourceCredibility: currentArticle.source?.credibilityScore || 70,
      temporalContext: this.getTemporalContext(),
      analysisNotes: 'Professional intelligence analysis standards applied'
    };
  }

  /**
   * Extract relevant entities from context articles
   * @param {Array} articles - Context articles
   * @returns {Object} Extracted entities
   */
  extractContextEntities(articles) {
    const entities = {
      countries: new Set(),
      organizations: new Set(),
      technologies: new Set(),
      themes: new Set()
    };

    articles.forEach(article => {
      if (article.intelligence?.entities) {
        article.intelligence.entities.countries?.forEach(country => 
          entities.countries.add(country)
        );
        article.intelligence.entities.organizations?.forEach(org => 
          entities.organizations.add(org)
        );
        article.intelligence.entities.technologies?.forEach(tech => 
          entities.technologies.add(tech)
        );
      }
      
      article.intelligence?.categories?.forEach(category => 
        entities.themes.add(category)
      );
    });

    return {
      countries: Array.from(entities.countries).slice(0, 10),
      organizations: Array.from(entities.organizations).slice(0, 10),
      technologies: Array.from(entities.technologies).slice(0, 10),
      themes: Array.from(entities.themes).slice(0, 5)
    };
  }

  /**
   * Identify trending topics from recent articles
   * @param {Array} articles - Recent articles
   * @returns {Array} Trending topics with frequency
   */
  identifyTrendingTopics(articles) {
    const topicCounts = {};

    articles.forEach(article => {
      article.intelligence?.tags?.forEach(tag => {
        topicCounts[tag] = (topicCounts[tag] || 0) + 1;
      });
    });

    return Object.entries(topicCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([topic, count]) => ({ topic, frequency: count }));
  }

  /**
   * Get temporal context for analysis
   * @returns {Object} Temporal context information
   */
  getTemporalContext() {
    const now = new Date();
    const currentEvents = this.getCurrentEventContext();
    
    return {
      analysisTime: now.toISOString(),
      globalContext: currentEvents,
      analyticalPerspective: 'Real-time intelligence assessment',
      temporalFactors: 'Consider recency and time-sensitive implications'
    };
  }

  /**
   * Get current event context for analysis
   * @returns {Array} Current event considerations
   */
  getCurrentEventContext() {
    // This would ideally be updated with current major events
    // For now, providing general context categories
    return [
      'Ongoing geopolitical tensions',
      'Cybersecurity threat landscape evolution',
      'Technology competition dynamics',
      'Regional security developments',
      'Economic security considerations'
    ];
  }

  /**
   * Validate and enhance Claude API response
   * @param {Object} response - Raw Claude API response
   * @param {Object} article - Original article
   * @returns {Object} Enhanced and validated response
   */
  validateAndEnhanceResponse(response, article) {
    try {
      // Parse response if it's a string
      const analysis = typeof response === 'string' ? JSON.parse(response) : response;
      
      // Validate required fields and apply defaults
      const validatedAnalysis = {
        relevanceScore: this.validateScore(analysis.relevanceScore, 0, 100, 25),
        confidenceLevel: this.validateScore(analysis.confidenceLevel, 0, 100, 60),
        priority: this.validatePriority(analysis.priority),
        categories: this.validateCategories(analysis.categories),
        tags: this.validateTags(analysis.tags),
        entities: this.validateEntities(analysis.entities),
        isAdvertisement: Boolean(analysis.isAdvertisement),
        isDuplicate: Boolean(analysis.isDuplicate),
        duplicateOf: analysis.duplicateOf || null,
        isSignificantUpdate: Boolean(analysis.isSignificantUpdate),
        threatAssessment: this.validateThreatLevel(analysis.threatAssessment),
        strategicImplications: analysis.strategicImplications || 'Standard intelligence monitoring',
        temporalRelevance: this.calculateTemporalRelevance(article),
        geopoliticalContext: analysis.geopoliticalContext || 'General international context',
        analysisRationale: analysis.analysisRationale || 'Professional intelligence assessment completed',
        analysisMetadata: {
          version: this.analysisVersion,
          processedAt: new Date().toISOString(),
          model: 'claude-3-sonnet-professional',
          analysisType: 'comprehensive_intelligence_assessment'
        }
      };

      // Cross-validate scores and priorities for consistency
      this.crossValidateAnalysis(validatedAnalysis);

      return validatedAnalysis;

    } catch (error) {
      console.error('❌ Failed to validate Claude response:', error);
      return this.createFallbackAnalysis(article);
    }
  }

  /**
   * Cross-validate analysis for internal consistency
   * @param {Object} analysis - Analysis to validate
   */
  crossValidateAnalysis(analysis) {
    // Ensure priority aligns with relevance score
    const scoreToPriority = {
      'CRITICAL': 80,
      'HIGH': 60,
      'MEDIUM': 40,
      'LOW': 0
    };

    const expectedMinScore = scoreToPriority[analysis.priority] || 0;
    if (analysis.relevanceScore < expectedMinScore) {
      console.warn(`⚠️ Relevance score (${analysis.relevanceScore}) may be too low for priority ${analysis.priority}`);
    }

    // Ensure threat assessment aligns with priority
    const priorityToThreat = {
      'CRITICAL': ['CRITICAL', 'HIGH'],
      'HIGH': ['CRITICAL', 'HIGH', 'MEDIUM'],
      'MEDIUM': ['HIGH', 'MEDIUM', 'LOW'],
      'LOW': ['MEDIUM', 'LOW']
    };

    const validThreats = priorityToThreat[analysis.priority] || ['LOW'];
    if (!validThreats.includes(analysis.threatAssessment)) {
      console.warn(`⚠️ Threat assessment (${analysis.threatAssessment}) may not align with priority ${analysis.priority}`);
    }
  }

  /**
   * Validate numeric score within range
   * @param {*} score - Score to validate
   * @param {number} min - Minimum value
   * @param {number} max - Maximum value
   * @param {number} defaultValue - Default if invalid
   * @returns {number} Validated score
   */
  validateScore(score, min, max, defaultValue) {
    const numScore = Number(score);
    if (isNaN(numScore) || numScore < min || numScore > max) {
      return defaultValue;
    }
    return Math.round(numScore);
  }

  /**
   * Validate priority classification
   * @param {*} priority - Priority to validate
   * @returns {string} Valid priority
   */
  validatePriority(priority) {
    const validPriorities = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'];
    return validPriorities.includes(priority) ? priority : 'LOW';
  }

  /**
   * Validate threat level
   * @param {*} threat - Threat level to validate
   * @returns {string} Valid threat level
   */
  validateThreatLevel(threat) {
    const validThreats = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'];
    return validThreats.includes(threat) ? threat : 'LOW';
  }

  /**
   * Validate categories array
   * @param {*} categories - Categories to validate
   * @returns {Array} Valid categories
   */
  validateCategories(categories) {
    if (!Array.isArray(categories)) return ['GENERAL'];
    
    const validCategories = [
      'MILITARY', 'TECHNOLOGY', 'GEOPOLITICS', 'CYBERSECURITY', 
      'NUCLEAR', 'FINANCE', 'HEALTH', 'SCIENCE', 'GENERAL'
    ];

    const filtered = categories.filter(cat => 
      typeof cat === 'string' && validCategories.includes(cat.toUpperCase())
    );

    return filtered.length > 0 ? filtered : ['GENERAL'];
  }

  /**
   * Validate tags array
   * @param {*} tags - Tags to validate
   * @returns {Array} Valid tags
   */
  validateTags(tags) {
    if (!Array.isArray(tags)) return [];
    
    return tags
      .filter(tag => typeof tag === 'string' && tag.length > 1)
      .map(tag => tag.toUpperCase())
      .slice(0, 15); // Limit to 15 tags
  }

  /**
   * Validate entities object
   * @param {*} entities - Entities to validate
   * @returns {Object} Valid entities
   */
  validateEntities(entities) {
    const defaultEntities = {
      countries: [],
      organizations: [],
      technologies: [],
      weapons: []
    };

    if (!entities || typeof entities !== 'object') {
      return defaultEntities;
    }

    Object.keys(defaultEntities).forEach(key => {
      if (!Array.isArray(entities[key])) {
        entities[key] = [];
      } else {
        entities[key] = entities[key]
          .filter(item => typeof item === 'string' && item.length > 1)
          .map(item => item.toUpperCase())
          .slice(0, 10); // Limit each category
      }
    });

    return { ...defaultEntities, ...entities };
  }

  /**
   * Calculate temporal relevance
   * @param {Object} article - Article object
   * @returns {number} Temporal relevance score
   */
  calculateTemporalRelevance(article) {
    const articleTime = new Date(article.publishedAt || article.fetchedAt).getTime();
    const now = Date.now();
    const ageHours = (now - articleTime) / (1000 * 60 * 60);

    if (ageHours < 1) return 100;
    if (ageHours < 6) return 95;
    if (ageHours < 24) return 85;
    if (ageHours < 72) return 70;
    if (ageHours < 168) return 50; // 1 week
    return 30;
  }

  /**
   * Create fallback analysis for failed processing
   * @param {Object} article - Original article
   * @returns {Object} Fallback intelligence analysis
   */
  createFallbackAnalysis(article) {
    return {
      relevanceScore: 30,
      confidenceLevel: 50,
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
      geopoliticalContext: 'Context unavailable',
      analysisRationale: 'Fallback analysis applied due to processing error',
      analysisMetadata: {
        version: this.analysisVersion,
        processedAt: new Date().toISOString(),
        model: 'fallback-analysis',
        analysisType: 'fallback_assessment'
      }
    };
  }

  /**
   * Generate analysis quality report
   * @param {Array} articles - Analyzed articles
   * @returns {Object} Quality report
   */
  generateQualityReport(articles) {
    const validArticles = articles.filter(a => a.intelligence);
    
    if (validArticles.length === 0) {
      return { error: 'No analyzed articles available' };
    }

    const avgRelevance = validArticles.reduce((sum, a) => 
      sum + a.intelligence.relevanceScore, 0) / validArticles.length;
    
    const avgConfidence = validArticles.reduce((sum, a) => 
      sum + a.intelligence.confidenceLevel, 0) / validArticles.length;

    const priorityDistribution = validArticles.reduce((acc, a) => {
      const priority = a.intelligence.priority;
      acc[priority] = (acc[priority] || 0) + 1;
      return acc;
    }, {});

    return {
      totalAnalyzed: validArticles.length,
      averageRelevance: Math.round(avgRelevance),
      averageConfidence: Math.round(avgConfidence),
      priorityDistribution,
      analysisVersion: this.analysisVersion,
      reportGenerated: new Date().toISOString()
    };
  }
}

// Export singleton instance
export const claudeAnalysisService = new ClaudeAnalysisService();