// Multi-Factor Intelligence Scoring Service for Ghost Brief
// Advanced scoring algorithms for professional intelligence assessment
// NOTE: This service has been modularized - individual modules are in src/services/scoring/

// Import modular scoring services
import { keywordScorerService } from './scoring/keywordScorer.js';
import { entityScorerService } from './scoring/entityScorer.js';
import { temporalScorerService } from './scoring/temporalScorer.js';
import { sourceAssessorService } from './scoring/sourceAssessor.js';
import { threatAssessorService } from './scoring/threatAssessor.js';
import { scoreCombinerService } from './scoring/scoreCombiner.js';

/**
 * Advanced Multi-Factor Intelligence Scoring Service
 * Orchestrates modular scoring components for comprehensive intelligence assessment
 * 
 * COMPATIBILITY LAYER: This service maintains the original API while using
 * modular components for improved maintainability and testability.
 */
export class MultiFactorScoringService {
  constructor() {
    // Enhanced scoring weights with professional intelligence standards
    this.primaryWeights = {
      keywordRelevance: 0.30,      // Intelligence keyword density and importance
      entitySignificance: 0.25,    // Geopolitical entity importance and relationships
      sourceCredibility: 0.20,     // Source reliability and track record
      temporalRelevance: 0.10,     // Time-sensitive intelligence value
      geopoliticalContext: 0.08,   // Regional/global context significance
      threatAssessment: 0.07       // Direct threat level indicators
    };

    // Secondary scoring factors for fine-tuning
    this.secondaryWeights = {
      contentDepth: 0.15,          // Article depth and detail level
      linguisticIndicators: 0.20,  // Language patterns indicating intelligence value
      crossReference: 0.25,        // Corroboration with other sources
      operationalRelevance: 0.25,  // Immediate operational implications
      strategicImportance: 0.15    // Long-term strategic significance
    };

    // Enhanced keyword scoring with context-aware weights
    this.keywordTiers = {
      TIER_1_CRITICAL: {
        weight: 100,
        keywords: [
          'NUCLEAR WEAPON', 'ICBM', 'TERRORIST ATTACK', 'CYBER ATTACK', 'BIOWEAPON',
          'CHEMICAL WEAPON', 'ASSASSINATION', 'COUP', 'INVASION', 'WAR DECLARATION'
        ]
      },
      TIER_2_HIGH: {
        weight: 80,
        keywords: [
          'MILITARY DEPLOYMENT', 'MISSILE TEST', 'SANCTIONS', 'ESPIONAGE', 'SURVEILLANCE',
          'HYPERSONIC', 'QUANTUM COMPUTER', 'AI WEAPON', 'DRONE STRIKE', 'SUBMARINE'
        ]
      },
      TIER_3_MEDIUM: {
        weight: 60,
        keywords: [
          'DIPLOMATIC CRISIS', 'TRADE WAR', 'ALLIANCE', 'DEFENSE PACT', 'TECHNOLOGY TRANSFER',
          'EMBARGO', 'SUMMIT', 'NEGOTIATION', 'TREATY', 'COOPERATION'
        ]
      },
      TIER_4_LOW: {
        weight: 40,
        keywords: [
          'EXERCISE', 'PATROL', 'VISIT', 'MEETING', 'STATEMENT', 'ANNOUNCEMENT',
          'DEVELOPMENT', 'RESEARCH', 'STUDY', 'ANALYSIS'
        ]
      }
    };

    // Geopolitical relationship matrix for context scoring
    this.geopoliticalMatrix = {
      'CHINA-USA': { tension: 0.9, importance: 1.0 },
      'RUSSIA-NATO': { tension: 0.95, importance: 1.0 },
      'IRAN-ISRAEL': { tension: 0.9, importance: 0.8 },
      'INDIA-PAKISTAN': { tension: 0.85, importance: 0.7 },
      'NORTH_KOREA-USA': { tension: 0.8, importance: 0.9 },
      'CHINA-TAIWAN': { tension: 0.9, importance: 0.9 }
    };

    // Threat escalation indicators
    this.threatIndicators = {
      NUCLEAR: {
        escalationRisk: 1.0,
        keywords: ['NUCLEAR', 'URANIUM', 'PLUTONIUM', 'ENRICHMENT', 'REACTOR', 'WARHEAD']
      },
      MILITARY: {
        escalationRisk: 0.8,
        keywords: ['DEPLOYMENT', 'MOBILIZATION', 'EXERCISES', 'BUILDUP', 'READINESS']
      },
      CYBER: {
        escalationRisk: 0.7,
        keywords: ['CYBER ATTACK', 'MALWARE', 'BREACH', 'HACK', 'RANSOMWARE', 'BOTNET']
      },
      ECONOMIC: {
        escalationRisk: 0.6,
        keywords: ['SANCTIONS', 'EMBARGO', 'TRADE WAR', 'TARIFFS', 'FINANCIAL WARFARE']
      },
      DIPLOMATIC: {
        escalationRisk: 0.4,
        keywords: ['CRISIS', 'WITHDRAWAL', 'EXPULSION', 'PROTEST', 'CONDEMNATION']
      }
    };

    // Source credibility scoring matrix
    this.sourceCredibilityMatrix = {
      TIER_1_PREMIUM: {
        baseScore: 95,
        sources: ['REUTERS', 'BBC', 'AP', 'DEFENSE NEWS', 'JANES', 'MIT TECH REVIEW']
      },
      TIER_2_RELIABLE: {
        baseScore: 85,
        sources: ['CNN', 'BLOOMBERG', 'WSJO', 'FOREIGN POLICY', 'BREAKING DEFENSE']
      },
      TIER_3_STANDARD: {
        baseScore: 70,
        sources: ['STANDARD NEWS OUTLETS']
      },
      TIER_4_UNVERIFIED: {
        baseScore: 40,
        sources: ['UNKNOWN', 'SOCIAL MEDIA', 'BLOGS']
      }
    };
  }

  /**
   * Calculate comprehensive multi-factor intelligence score
   * @param {Object} article - Article with processed content
   * @param {Object} entityAnalysis - Entity extraction results
   * @param {Array} existingArticles - Context articles
   * @param {Object} options - Scoring options
   * @returns {Object} Comprehensive scoring analysis
   */
  calculateMultiFactorScore(article, entityAnalysis, existingArticles = [], options = {}) {
    console.log(`🎯 Calculating multi-factor intelligence score for: ${article.title.substring(0, 50)}...`);

    // Step 1: Enhanced keyword scoring using modular service
    const keywordAnalysis = keywordScorerService.calculateEnhancedKeywordScore(
      (article.title + ' ' + (article.content || article.summary || '')).toUpperCase()
    );

    // Step 2: Entity significance analysis using modular service
    const entitySignificance = entityScorerService.calculateEntitySignificance(entityAnalysis);

    // Step 3: Primary factor scoring (legacy compatibility)
    const primaryScores = {
      keywords: keywordAnalysis.score,
      keywordDetails: keywordAnalysis.details,
      entities: entitySignificance.score,
      entityDetails: entitySignificance.details,
      contentDepth: this.calculateContentDepth(article),
      composite: (keywordAnalysis.score + entitySignificance.score + this.calculateContentDepth(article)) / 3
    };
    
    // Step 4: Secondary factor scoring (legacy compatibility)
    const secondaryScores = this.calculateSecondaryFactors(article, entityAnalysis, existingArticles);
    
    // Step 5: Context-aware adjustments (legacy compatibility)
    const contextAdjustments = this.calculateContextAdjustments(article, entityAnalysis, existingArticles);
    
    // Step 6: Threat level assessment using modular service
    const threatAssessment = threatAssessorService.calculateThreatLevel(article, entityAnalysis);
    
    // Step 7: Temporal relevance calculation using modular service
    const temporalFactors = temporalScorerService.calculateTemporalFactors(article);
    
    // Step 8: Source credibility assessment using modular service
    const sourceAssessment = sourceAssessorService.assessSourceCredibility(article);
    
    // Step 9: Geopolitical context scoring (legacy compatibility)
    const geopoliticalScore = this.calculateGeopoliticalScore(entityAnalysis);

    // Step 10: Combine all factors using modular service
    const finalScore = scoreCombinerService.combineFactorsWithWeights({
      primary: primaryScores,
      secondary: secondaryScores,
      context: contextAdjustments,
      threat: threatAssessment,
      temporal: temporalFactors,
      source: sourceAssessment,
      geopolitical: geopoliticalScore
    });

    // Extract values for legacy compatibility
    const confidenceLevel = finalScore.confidence;
    const priorityClassification = {
      priority: finalScore.priority,
      confidence: finalScore.priorityConfidence,
      reasoning: finalScore.assessment?.recommendedAction || 'Standard processing'
    };

    // Maintain backward compatibility with original API structure
    const comprehensiveAnalysis = {
      overallScore: Math.round(finalScore.overall),
      confidenceLevel: Math.round(confidenceLevel),
      priority: priorityClassification.priority,
      priorityConfidence: priorityClassification.confidence,
      factorBreakdown: {
        keywordRelevance: Math.round(primaryScores.keywords),
        entitySignificance: Math.round(primaryScores.entities),
        sourceCredibility: Math.round(sourceAssessment.score),
        temporalRelevance: Math.round(temporalFactors.score),
        geopoliticalContext: Math.round(geopoliticalScore.score),
        threatLevel: Math.round(threatAssessment.score)
      },
      detailedAnalysis: {
        primaryFactors: primaryScores,
        secondaryFactors: secondaryScores,
        contextAdjustments: contextAdjustments,
        threatAssessment: threatAssessment,
        temporalFactors: temporalFactors,
        sourceAssessment: sourceAssessment,
        geopoliticalAnalysis: geopoliticalScore,
        // Enhanced analysis from modular services
        modularAnalysis: {
          keywordAnalysis,
          entitySignificance,
          finalScoreDetails: finalScore
        }
      },
      scoringMetadata: {
        algorithm: 'multi-factor-v3.0-modular',
        architecture: 'modular-services',
        modules: {
          keyword: 'keywordScorerService',
          entity: 'entityScorerService',
          temporal: 'temporalScorerService',
          source: 'sourceAssessorService',
          threat: 'threatAssessorService',
          combiner: 'scoreCombinerService'
        },
        primaryWeights: this.primaryWeights,
        secondaryWeights: this.secondaryWeights,
        calculatedAt: new Date().toISOString()
      }
    };

    console.log(`✅ Multi-factor scoring complete (modular): ${comprehensiveAnalysis.overallScore}/100 (${comprehensiveAnalysis.priority})`);
    return comprehensiveAnalysis;
  }

  /**
   * Calculate primary intelligence factors
   * @param {Object} article - Article object
   * @param {Object} entityAnalysis - Entity analysis
   * @param {Array} existingArticles - Context articles
   * @returns {Object} Primary factor scores
   */
  calculatePrimaryFactors(article, entityAnalysis, existingArticles) {
    const content = (article.title + ' ' + (article.content || article.summary || '')).toUpperCase();
    
    // Enhanced keyword relevance scoring
    const keywordScore = this.calculateEnhancedKeywordScore(content);
    
    // Entity significance scoring
    const entityScore = this.calculateEntitySignificance(entityAnalysis);
    
    // Content depth assessment
    const depthScore = this.calculateContentDepth(article);

    return {
      keywords: keywordScore.score,
      keywordDetails: keywordScore.details,
      entities: entityScore.score,
      entityDetails: entityScore.details,
      contentDepth: depthScore,
      composite: (keywordScore.score + entityScore.score + depthScore) / 3
    };
  }

  /**
   * Calculate enhanced keyword relevance score
   * @param {string} content - Article content
   * @returns {Object} Keyword scoring analysis
   */
  calculateEnhancedKeywordScore(content) {
    let totalScore = 0;
    const matchedKeywords = [];
    let maxTierScore = 0;

    // Analyze keywords by tier for weighted scoring
    Object.entries(this.keywordTiers).forEach(([tierName, tierData]) => {
      tierData.keywords.forEach(keyword => {
        const regex = new RegExp(keyword, 'g');
        const matches = (content.match(regex) || []).length;
        
        if (matches > 0) {
          const keywordScore = matches * tierData.weight * 0.1;
          totalScore += keywordScore;
          maxTierScore = Math.max(maxTierScore, tierData.weight);
          
          matchedKeywords.push({
            keyword,
            tier: tierName,
            matches,
            weight: tierData.weight,
            score: keywordScore
          });
        }
      });
    });

    // Apply diminishing returns for keyword saturation
    const saturatedScore = totalScore > 80 ? 80 + Math.log(totalScore - 80) * 10 : totalScore;
    
    // Bonus for high-tier keyword presence
    const tierBonus = maxTierScore >= 100 ? 15 : maxTierScore >= 80 ? 10 : maxTierScore >= 60 ? 5 : 0;
    
    const finalScore = Math.min(saturatedScore + tierBonus, 100);

    return {
      score: finalScore,
      details: {
        rawScore: totalScore,
        saturatedScore,
        tierBonus,
        maxTierFound: maxTierScore,
        keywordMatches: matchedKeywords
      }
    };
  }

  /**
   * Calculate entity significance score
   * @param {Object} entityAnalysis - Entity analysis results
   * @returns {Object} Entity significance analysis
   */
  calculateEntitySignificance(entityAnalysis) {
    let entityScore = 0;
    const significanceFactors = [];

    // Country significance (higher for tension-prone regions)
    const countrySignificance = this.calculateCountrySignificance(entityAnalysis.countries || []);
    entityScore += countrySignificance.score * 0.4;
    significanceFactors.push({ type: 'countries', ...countrySignificance });

    // Organization significance (intelligence/military orgs weighted higher)
    const orgSignificance = this.calculateOrganizationSignificance(entityAnalysis.organizations || []);
    entityScore += orgSignificance.score * 0.3;
    significanceFactors.push({ type: 'organizations', ...orgSignificance });

    // Technology significance (dual-use and military tech weighted higher)
    const techSignificance = this.calculateTechnologySignificance(entityAnalysis.technologies || []);
    entityScore += techSignificance.score * 0.2;
    significanceFactors.push({ type: 'technologies', ...techSignificance });

    // Weapons significance (advanced weapons systems)
    const weaponSignificance = this.calculateWeaponSignificance(entityAnalysis.weapons || []);
    entityScore += weaponSignificance.score * 0.1;
    significanceFactors.push({ type: 'weapons', ...weaponSignificance });

    return {
      score: Math.min(entityScore, 100),
      details: {
        factors: significanceFactors,
        totalEntities: Object.values(entityAnalysis).flat().length,
        density: entityAnalysis.density || 0
      }
    };
  }

  /**
   * Calculate country significance based on geopolitical importance
   * @param {Array} countries - Detected countries
   * @returns {Object} Country significance analysis
   */
  calculateCountrySignificance(countries) {
    const majorPowers = ['USA', 'CHINA', 'RUSSIA', 'UNITED STATES'];
    const conflictZones = ['UKRAINE', 'TAIWAN', 'SYRIA', 'IRAN', 'ISRAEL', 'NORTH KOREA'];
    const regionalPowers = ['INDIA', 'PAKISTAN', 'TURKEY', 'SAUDI ARABIA', 'JAPAN'];

    let score = 0;
    const analysis = [];

    countries.forEach(country => {
      let countryScore = 10; // Base score
      
      if (majorPowers.includes(country)) {
        countryScore = 30;
        analysis.push({ country, type: 'MAJOR_POWER', score: countryScore });
      } else if (conflictZones.includes(country)) {
        countryScore = 25;
        analysis.push({ country, type: 'CONFLICT_ZONE', score: countryScore });
      } else if (regionalPowers.includes(country)) {
        countryScore = 20;
        analysis.push({ country, type: 'REGIONAL_POWER', score: countryScore });
      } else {
        analysis.push({ country, type: 'STANDARD', score: countryScore });
      }
      
      score += countryScore;
    });

    // Check for multi-country tensions
    const tensionPairs = this.detectTensionPairs(countries);
    if (tensionPairs.length > 0) {
      score += tensionPairs.length * 15;
      analysis.push({ type: 'TENSION_PAIRS', pairs: tensionPairs, bonus: tensionPairs.length * 15 });
    }

    return {
      score: Math.min(score, 100),
      details: analysis
    };
  }

  /**
   * Detect tension pairs between countries
   * @param {Array} countries - Detected countries
   * @returns {Array} Tension pairs
   */
  detectTensionPairs(countries) {
    const tensionPairs = [];
    const knownTensions = [
      ['CHINA', 'USA'], ['CHINA', 'TAIWAN'], ['RUSSIA', 'NATO'], ['RUSSIA', 'UKRAINE'],
      ['IRAN', 'ISRAEL'], ['INDIA', 'PAKISTAN'], ['NORTH KOREA', 'USA'], ['NORTH KOREA', 'SOUTH KOREA']
    ];

    knownTensions.forEach(([country1, country2]) => {
      if (countries.includes(country1) && countries.includes(country2)) {
        tensionPairs.push([country1, country2]);
      }
    });

    return tensionPairs;
  }

  /**
   * Calculate organization significance
   * @param {Array} organizations - Detected organizations
   * @returns {Object} Organization significance analysis
   */
  calculateOrganizationSignificance(organizations) {
    const intelligence = ['CIA', 'FSB', 'MSS', 'MOSSAD', 'MI6', 'BND'];
    const military = ['NATO', 'PENTAGON', 'PLA', 'IRANIAN REVOLUTIONARY GUARD'];
    const terrorist = ['ISIS', 'AL-QAEDA', 'TALIBAN', 'HEZBOLLAH', 'HAMAS'];
    const international = ['UN', 'IAEA', 'WHO'];

    let score = 0;
    const analysis = [];

    organizations.forEach(org => {
      let orgScore = 5; // Base score
      
      if (intelligence.includes(org)) {
        orgScore = 25;
        analysis.push({ organization: org, type: 'INTELLIGENCE', score: orgScore });
      } else if (military.includes(org)) {
        orgScore = 20;
        analysis.push({ organization: org, type: 'MILITARY', score: orgScore });
      } else if (terrorist.includes(org)) {
        orgScore = 30;
        analysis.push({ organization: org, type: 'TERRORIST', score: orgScore });
      } else if (international.includes(org)) {
        orgScore = 15;
        analysis.push({ organization: org, type: 'INTERNATIONAL', score: orgScore });
      } else {
        analysis.push({ organization: org, type: 'STANDARD', score: orgScore });
      }
      
      score += orgScore;
    });

    return {
      score: Math.min(score, 100),
      details: analysis
    };
  }

  /**
   * Calculate technology significance
   * @param {Array} technologies - Detected technologies
   * @returns {Object} Technology significance analysis
   */
  calculateTechnologySignificance(technologies) {
    const strategic = ['NUCLEAR', 'QUANTUM', 'HYPERSONIC', 'AI', 'SATELLITE'];
    const cyber = ['CYBER', 'MALWARE', 'ENCRYPTION', 'ZERO-DAY', 'RANSOMWARE'];
    const military = ['STEALTH', 'RADAR', 'DRONE', 'UAV', 'MISSILE'];

    let score = 0;
    const analysis = [];

    technologies.forEach(tech => {
      let techScore = 5; // Base score
      
      if (strategic.includes(tech)) {
        techScore = 25;
        analysis.push({ technology: tech, type: 'STRATEGIC', score: techScore });
      } else if (cyber.includes(tech)) {
        techScore = 20;
        analysis.push({ technology: tech, type: 'CYBER', score: techScore });
      } else if (military.includes(tech)) {
        techScore = 15;
        analysis.push({ technology: tech, type: 'MILITARY', score: techScore });
      } else {
        analysis.push({ technology: tech, type: 'STANDARD', score: techScore });
      }
      
      score += techScore;
    });

    return {
      score: Math.min(score, 100),
      details: analysis
    };
  }

  /**
   * Calculate weapon significance
   * @param {Array} weapons - Detected weapons
   * @returns {Object} Weapon significance analysis
   */
  calculateWeaponSignificance(weapons) {
    const strategic = ['NUCLEAR WEAPON', 'ICBM', 'SLBM', 'HYPERSONIC MISSILE'];
    const advanced = ['F-35', 'F-22', 'SU-57', 'J-20', 'B-21'];
    const conventional = ['MISSILE', 'TANK', 'SUBMARINE', 'AIRCRAFT CARRIER'];

    let score = 0;
    const analysis = [];

    weapons.forEach(weapon => {
      let weaponScore = 5; // Base score
      
      if (strategic.includes(weapon)) {
        weaponScore = 30;
        analysis.push({ weapon, type: 'STRATEGIC', score: weaponScore });
      } else if (advanced.includes(weapon)) {
        weaponScore = 20;
        analysis.push({ weapon, type: 'ADVANCED', score: weaponScore });
      } else if (conventional.includes(weapon)) {
        weaponScore = 10;
        analysis.push({ weapon, type: 'CONVENTIONAL', score: weaponScore });
      } else {
        analysis.push({ weapon, type: 'STANDARD', score: weaponScore });
      }
      
      score += weaponScore;
    });

    return {
      score: Math.min(score, 100),
      details: analysis
    };
  }

  /**
   * Calculate secondary factors
   * @param {Object} article - Article object
   * @param {Object} entityAnalysis - Entity analysis
   * @param {Array} existingArticles - Context articles
   * @returns {Object} Secondary factor scores
   */
  calculateSecondaryFactors(article, entityAnalysis, existingArticles) {
    const contentDepth = this.calculateContentDepth(article);
    const linguisticIndicators = this.calculateLinguisticIndicators(article);
    const crossReference = this.calculateCrossReference(article, existingArticles);
    const operationalRelevance = this.calculateOperationalRelevance(article, entityAnalysis);
    const strategicImportance = this.calculateStrategicImportance(article, entityAnalysis);

    return {
      contentDepth,
      linguisticIndicators,
      crossReference,
      operationalRelevance,
      strategicImportance,
      composite: (contentDepth + linguisticIndicators + crossReference + operationalRelevance + strategicImportance) / 5
    };
  }

  /**
   * Calculate content depth score
   * @param {Object} article - Article object
   * @returns {number} Content depth score
   */
  calculateContentDepth(article) {
    const content = article.content || article.summary || '';
    const title = article.title || '';
    
    const wordCount = content.split(/\s+/).length;
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
    const hasDetails = /\d{1,2}\/\d{1,2}\/\d{4}|\d{1,2}:\d{2}|specific|according to|reported|confirmed|sources/i.test(content);
    const hasQuotes = /"[^"]*"/g.test(content) || /'[^']*'/g.test(content);
    
    let score = 0;
    
    // Word count scoring
    if (wordCount > 500) score += 30;
    else if (wordCount > 300) score += 20;
    else if (wordCount > 150) score += 10;
    
    // Sentence complexity
    if (sentences > 10) score += 20;
    else if (sentences > 5) score += 10;
    
    // Detail indicators
    if (hasDetails) score += 25;
    if (hasQuotes) score += 15;
    
    // Title informativeness
    if (title.length > 60) score += 10;
    
    return Math.min(score, 100);
  }

  /**
   * Calculate linguistic indicators of intelligence value
   * @param {Object} article - Article object
   * @returns {number} Linguistic indicators score
   */
  calculateLinguisticIndicators(article) {
    const content = (article.title + ' ' + (article.content || article.summary || '')).toLowerCase();
    
    const urgencyIndicators = ['breaking', 'urgent', 'immediate', 'alert', 'emergency', 'critical'];
    const authorityIndicators = ['official', 'confirmed', 'verified', 'authenticated', 'disclosed'];
    const exclusivityIndicators = ['exclusive', 'first reported', 'obtained', 'leaked', 'revealed'];
    const uncertaintyIndicators = ['alleged', 'rumored', 'unconfirmed', 'speculation', 'possibly'];
    
    let score = 50; // Base score
    
    // Positive indicators
    urgencyIndicators.forEach(indicator => {
      if (content.includes(indicator)) score += 10;
    });
    
    authorityIndicators.forEach(indicator => {
      if (content.includes(indicator)) score += 8;
    });
    
    exclusivityIndicators.forEach(indicator => {
      if (content.includes(indicator)) score += 12;
    });
    
    // Negative indicators (reduce confidence)
    uncertaintyIndicators.forEach(indicator => {
      if (content.includes(indicator)) score -= 5;
    });
    
    return Math.max(Math.min(score, 100), 0);
  }

  /**
   * Calculate cross-reference score with existing articles
   * @param {Object} article - Current article
   * @param {Array} existingArticles - Existing articles
   * @returns {number} Cross-reference score
   */
  calculateCrossReference(article, existingArticles) {
    if (!existingArticles || existingArticles.length === 0) return 50;
    
    const recentArticles = existingArticles.filter(existing => {
      const existingTime = new Date(existing.publishedAt || existing.fetchedAt).getTime();
      const currentTime = new Date(article.publishedAt || article.fetchedAt).getTime();
      const daysDiff = (currentTime - existingTime) / (1000 * 60 * 60 * 24);
      return daysDiff <= 7; // Last 7 days
    });
    
    let correlationScore = 0;
    const currentEntities = this.extractSimpleEntities(article);
    
    recentArticles.forEach(existing => {
      const existingEntities = this.extractSimpleEntities(existing);
      const commonEntities = currentEntities.filter(entity => existingEntities.includes(entity));
      
      if (commonEntities.length > 0) {
        correlationScore += commonEntities.length * 5;
      }
    });
    
    // Bonus for multiple corroborations
    if (correlationScore > 50) correlationScore += 20;
    
    return Math.min(correlationScore + 30, 100); // Base 30 + correlation bonus
  }

  /**
   * Extract simple entities for cross-reference
   * @param {Object} article - Article object
   * @returns {Array} Simple entity list
   */
  extractSimpleEntities(article) {
    const content = (article.title + ' ' + (article.content || article.summary || '')).toUpperCase();
    const entities = [];
    
    const simpleEntityList = [
      'CHINA', 'RUSSIA', 'USA', 'IRAN', 'NORTH KOREA', 'UKRAINE', 'TAIWAN',
      'NUCLEAR', 'MISSILE', 'CYBER', 'MILITARY', 'INTELLIGENCE'
    ];
    
    simpleEntityList.forEach(entity => {
      if (content.includes(entity)) {
        entities.push(entity);
      }
    });
    
    return entities;
  }

  /**
   * Calculate operational relevance score
   * @param {Object} article - Article object
   * @param {Object} entityAnalysis - Entity analysis
   * @returns {number} Operational relevance score
   */
  calculateOperationalRelevance(article, entityAnalysis) {
    const content = (article.title + ' ' + (article.content || article.summary || '')).toLowerCase();
    
    const operationalKeywords = [
      'deployment', 'operation', 'exercise', 'patrol', 'mission', 'task force',
      'readiness', 'alert', 'response', 'capability', 'threat', 'security'
    ];
    
    const immediateKeywords = [
      'now', 'today', 'immediate', 'urgent', 'emergency', 'rapid', 'breaking'
    ];
    
    let score = 0;
    
    // Operational keyword presence
    operationalKeywords.forEach(keyword => {
      if (content.includes(keyword)) score += 8;
    });
    
    // Immediacy indicators
    immediateKeywords.forEach(keyword => {
      if (content.includes(keyword)) score += 10;
    });
    
    // High-value entities boost operational relevance
    const highValueEntities = ['USA', 'CHINA', 'RUSSIA', 'NATO', 'NUCLEAR'];
    const hasHighValueEntity = highValueEntities.some(entity => 
      (entityAnalysis.countries || []).includes(entity) || 
      (entityAnalysis.technologies || []).includes(entity)
    );
    
    if (hasHighValueEntity) score += 20;
    
    return Math.min(score, 100);
  }

  /**
   * Calculate strategic importance score
   * @param {Object} article - Article object
   * @param {Object} entityAnalysis - Entity analysis
   * @returns {number} Strategic importance score
   */
  calculateStrategicImportance(article, entityAnalysis) {
    const content = (article.title + ' ' + (article.content || article.summary || '')).toLowerCase();
    
    const strategicKeywords = [
      'strategy', 'doctrine', 'policy', 'alliance', 'treaty', 'agreement',
      'balance', 'power', 'influence', 'regional', 'global', 'international'
    ];
    
    const futureKeywords = [
      'future', 'plan', 'develop', 'program', 'project', 'initiative',
      'next', 'upcoming', 'long-term', 'strategic'
    ];
    
    let score = 0;
    
    // Strategic keyword presence
    strategicKeywords.forEach(keyword => {
      if (content.includes(keyword)) score += 6;
    });
    
    // Future-oriented content
    futureKeywords.forEach(keyword => {
      if (content.includes(keyword)) score += 5;
    });
    
    // Multiple major powers involvement increases strategic importance
    const majorPowers = ['USA', 'CHINA', 'RUSSIA'];
    const majorPowerCount = majorPowers.filter(power => 
      (entityAnalysis.countries || []).includes(power)
    ).length;
    
    if (majorPowerCount >= 2) score += 30;
    else if (majorPowerCount >= 1) score += 15;
    
    return Math.min(score, 100);
  }

  /**
   * Calculate context adjustments based on recent trends
   * @param {Object} article - Article object
   * @param {Object} entityAnalysis - Entity analysis
   * @param {Array} existingArticles - Context articles
   * @returns {Object} Context adjustment factors
   */
  calculateContextAdjustments(article, entityAnalysis, existingArticles) {
    const trendMultiplier = this.calculateTrendMultiplier(article, existingArticles);
    const noveltyFactor = this.calculateNoveltyFactor(article, existingArticles);
    const confirmationFactor = this.calculateConfirmationFactor(article, existingArticles);
    
    return {
      trendMultiplier,
      noveltyFactor,
      confirmationFactor,
      combinedAdjustment: (trendMultiplier + noveltyFactor + confirmationFactor) / 3
    };
  }

  /**
   * Calculate trend multiplier based on recurring topics
   * @param {Object} article - Article object
   * @param {Array} existingArticles - Context articles
   * @returns {number} Trend multiplier
   */
  calculateTrendMultiplier(article, existingArticles) {
    // Implementation for trend analysis
    return 1.0; // Placeholder - would analyze trending topics
  }

  /**
   * Calculate novelty factor for new information
   * @param {Object} article - Article object
   * @param {Array} existingArticles - Context articles
   * @returns {number} Novelty factor
   */
  calculateNoveltyFactor(article, existingArticles) {
    // Implementation for novelty detection
    return 1.0; // Placeholder - would detect new vs repeated information
  }

  /**
   * Calculate confirmation factor for corroborated information
   * @param {Object} article - Article object
   * @param {Array} existingArticles - Context articles
   * @returns {number} Confirmation factor
   */
  calculateConfirmationFactor(article, existingArticles) {
    // Implementation for confirmation analysis
    return 1.0; // Placeholder - would analyze information confirmation
  }

  /**
   * Calculate threat level assessment
   * @param {Object} article - Article object
   * @param {Object} entityAnalysis - Entity analysis
   * @returns {Object} Threat assessment
   */
  calculateThreatLevel(article, entityAnalysis) {
    const content = (article.title + ' ' + (article.content || article.summary || '')).toUpperCase();
    let maxThreatLevel = 0;
    const detectedThreats = [];

    Object.entries(this.threatIndicators).forEach(([threatType, threatData]) => {
      const matches = threatData.keywords.filter(keyword => content.includes(keyword));
      
      if (matches.length > 0) {
        const threatScore = matches.length * threatData.escalationRisk * 20;
        maxThreatLevel = Math.max(maxThreatLevel, threatScore);
        
        detectedThreats.push({
          type: threatType,
          keywords: matches,
          escalationRisk: threatData.escalationRisk,
          score: threatScore
        });
      }
    });

    return {
      score: Math.min(maxThreatLevel, 100),
      level: this.scoreTToThreatLevel(maxThreatLevel),
      detectedThreats,
      analysis: `${detectedThreats.length} threat categories detected`
    };
  }

  /**
   * Convert threat score to threat level
   * @param {number} score - Threat score
   * @returns {string} Threat level
   */
  scoreTToThreatLevel(score) {
    if (score >= 80) return 'CRITICAL';
    if (score >= 60) return 'HIGH';
    if (score >= 40) return 'MEDIUM';
    return 'LOW';
  }

  /**
   * Calculate temporal factors
   * @param {Object} article - Article object
   * @returns {Object} Temporal analysis
   */
  calculateTemporalFactors(article) {
    const articleTime = new Date(article.publishedAt || article.fetchedAt).getTime();
    const now = Date.now();
    const ageHours = (now - articleTime) / (1000 * 60 * 60);

    let temporalScore = 100;
    let urgencyFactor = 1.0;

    // Time decay function
    if (ageHours > 168) { // > 1 week
      temporalScore = 30;
      urgencyFactor = 0.3;
    } else if (ageHours > 72) { // > 3 days
      temporalScore = 50;
      urgencyFactor = 0.5;
    } else if (ageHours > 24) { // > 1 day
      temporalScore = 70;
      urgencyFactor = 0.7;
    } else if (ageHours > 6) { // > 6 hours
      temporalScore = 85;
      urgencyFactor = 0.85;
    } else if (ageHours > 1) { // > 1 hour
      temporalScore = 95;
      urgencyFactor = 0.95;
    }

    return {
      score: temporalScore,
      ageHours: Math.round(ageHours),
      urgencyFactor,
      timeCategory: this.categorizeAge(ageHours)
    };
  }

  /**
   * Categorize article age
   * @param {number} ageHours - Age in hours
   * @returns {string} Age category
   */
  categorizeAge(ageHours) {
    if (ageHours < 1) return 'BREAKING';
    if (ageHours < 6) return 'RECENT';
    if (ageHours < 24) return 'CURRENT';
    if (ageHours < 72) return 'RECENT_PAST';
    return 'HISTORICAL';
  }

  /**
   * Assess source credibility
   * @param {Object} article - Article object
   * @returns {Object} Source assessment
   */
  assessSourceCredibility(article) {
    const domain = article.source?.domain || '';
    const sourceName = article.source?.feedName || '';
    const providedScore = article.source?.credibilityScore || 70;

    // Find source tier
    let sourceTier = 'TIER_3_STANDARD';
    let baseScore = 70;

    Object.entries(this.sourceCredibilityMatrix).forEach(([tier, tierData]) => {
      if (tierData.sources.some(source => 
        domain.includes(source.toLowerCase()) || 
        sourceName.toUpperCase().includes(source)
      )) {
        sourceTier = tier;
        baseScore = tierData.baseScore;
      }
    });

    // Combine provided score with tier-based assessment
    const finalScore = Math.round((providedScore + baseScore) / 2);

    return {
      score: finalScore,
      tier: sourceTier,
      baseScore,
      providedScore,
      domain,
      sourceName
    };
  }

  /**
   * Calculate geopolitical context score
   * @param {Object} entityAnalysis - Entity analysis
   * @returns {Object} Geopolitical scoring
   */
  calculateGeopoliticalScore(entityAnalysis) {
    const countries = entityAnalysis.countries || [];
    let contextScore = 0;
    const detectedRelationships = [];

    // Check for known tension relationships
    Object.entries(this.geopoliticalMatrix).forEach(([relationship, data]) => {
      const [country1, country2] = relationship.split('-');
      
      if (countries.includes(country1) && countries.includes(country2)) {
        const relationshipScore = data.tension * data.importance * 50;
        contextScore += relationshipScore;
        
        detectedRelationships.push({
          relationship,
          countries: [country1, country2],
          tension: data.tension,
          importance: data.importance,
          score: relationshipScore
        });
      }
    });

    return {
      score: Math.min(contextScore, 100),
      relationships: detectedRelationships,
      analysis: `${detectedRelationships.length} geopolitical relationships detected`
    };
  }

  /**
   * Combine all factors with weighted algorithm
   * @param {Object} factors - All scoring factors
   * @returns {Object} Combined score analysis
   */
  combineFactorsWithWeights(factors) {
    const primary = factors.primary;
    const secondary = factors.secondary;
    
    // Primary factor combination
    const primaryScore = 
      (primary.keywords * this.primaryWeights.keywordRelevance) +
      (primary.entities * this.primaryWeights.entitySignificance) +
      (factors.source.score * this.primaryWeights.sourceCredibility) +
      (factors.temporal.score * this.primaryWeights.temporalRelevance) +
      (factors.geopolitical.score * this.primaryWeights.geopoliticalContext) +
      (factors.threat.score * this.primaryWeights.threatAssessment);

    // Secondary factor combination
    const secondaryScore = 
      (secondary.contentDepth * this.secondaryWeights.contentDepth) +
      (secondary.linguisticIndicators * this.secondaryWeights.linguisticIndicators) +
      (secondary.crossReference * this.secondaryWeights.crossReference) +
      (secondary.operationalRelevance * this.secondaryWeights.operationalRelevance) +
      (secondary.strategicImportance * this.secondaryWeights.strategicImportance);

    // Combine primary and secondary (70% primary, 30% secondary)
    const combinedScore = (primaryScore * 0.7) + (secondaryScore * 0.3);

    // Apply context adjustments
    const contextAdjustment = factors.context.combinedAdjustment;
    const finalScore = combinedScore * contextAdjustment;

    return {
      overall: Math.min(Math.max(finalScore, 0), 100),
      primary: primaryScore,
      secondary: secondaryScore,
      contextAdjusted: finalScore,
      breakdown: {
        primaryContribution: primaryScore * 0.7,
        secondaryContribution: secondaryScore * 0.3,
        contextMultiplier: contextAdjustment
      }
    };
  }

  /**
   * Calculate confidence level based on score consistency
   * @param {Object} finalScore - Final score breakdown
   * @param {Object} factors - All factors
   * @returns {number} Confidence level (0-100)
   */
  calculateConfidenceLevel(finalScore, factors) {
    const scores = [
      factors.primary.keywords,
      factors.primary.entities,
      factors.secondary.contentDepth,
      factors.source.score
    ];

    // Calculate standard deviation of scores
    const mean = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    const variance = scores.reduce((sum, score) => sum + Math.pow(score - mean, 2), 0) / scores.length;
    const stdDev = Math.sqrt(variance);

    // Lower standard deviation = higher confidence
    const consistencyFactor = Math.max(0, 100 - (stdDev * 2));
    
    // Source credibility affects confidence
    const sourceConfidence = factors.source.score;
    
    // Combine factors
    const confidence = (consistencyFactor * 0.6) + (sourceConfidence * 0.4);
    
    return Math.round(Math.min(Math.max(confidence, 30), 100));
  }

  /**
   * Classify priority based on overall score and threat assessment
   * @param {number} overallScore - Overall intelligence score
   * @param {Object} threatAssessment - Threat assessment results
   * @param {Object} geopoliticalScore - Geopolitical score results
   * @returns {Object} Priority classification
   */
  classifyPriority(overallScore, threatAssessment, geopoliticalScore) {
    let priority = 'LOW';
    let confidence = 60;

    // Primary classification based on overall score
    if (overallScore >= 85) {
      priority = 'CRITICAL';
      confidence = 95;
    } else if (overallScore >= 70) {
      priority = 'HIGH';
      confidence = 85;
    } else if (overallScore >= 50) {
      priority = 'MEDIUM';
      confidence = 75;
    }

    // Threat assessment can elevate priority
    if (threatAssessment.level === 'CRITICAL' && priority !== 'CRITICAL') {
      priority = 'CRITICAL';
      confidence = Math.max(confidence, 90);
    } else if (threatAssessment.level === 'HIGH' && priority === 'LOW') {
      priority = 'MEDIUM';
      confidence = Math.max(confidence, 80);
    }

    // Geopolitical relationships can influence priority
    if (geopoliticalScore.relationships.length >= 2 && priority === 'LOW') {
      priority = 'MEDIUM';
      confidence = Math.max(confidence, 75);
    }

    return {
      priority,
      confidence,
      reasoning: `Score: ${Math.round(overallScore)}, Threat: ${threatAssessment.level}, Geopolitical: ${geopoliticalScore.relationships.length} relationships`
    };
  }
}

// Export singleton instance
export const multiFactorScoringService = new MultiFactorScoringService();