/**
 * Keyword Scoring Service
 * Analyzes keyword relevance and context for intelligence scoring
 */

import { INTELLIGENCE_KEYWORDS } from '../../constants/intelligence.js';

/**
 * Keyword Intelligence Scoring Service
 * Provides sophisticated keyword analysis and relevance scoring
 */
export class KeywordScorer {
  constructor() {
    // Enhanced keyword scoring with context-aware weights
    this.keywordTiers = {
      CRITICAL: {
        weight: 5.0,
        keywords: INTELLIGENCE_KEYWORDS.CRITICAL,
        contextMultiplier: 1.5,
        proximityBonus: 2.0
      },
      HIGH: {
        weight: 3.0,
        keywords: INTELLIGENCE_KEYWORDS.HIGH,
        contextMultiplier: 1.3,
        proximityBonus: 1.5
      },
      MEDIUM: {
        weight: 1.8,
        keywords: INTELLIGENCE_KEYWORDS.MEDIUM,
        contextMultiplier: 1.1,
        proximityBonus: 1.2
      },
      GEOPOLITICAL: {
        weight: 2.5,
        keywords: INTELLIGENCE_KEYWORDS.GEOPOLITICAL,
        contextMultiplier: 1.4,
        proximityBonus: 1.3
      },
      TECHNOLOGY: {
        weight: 2.2,
        keywords: INTELLIGENCE_KEYWORDS.TECHNOLOGY,
        contextMultiplier: 1.2,
        proximityBonus: 1.1
      },
      HEALTH: {
        weight: 1.9,
        keywords: INTELLIGENCE_KEYWORDS.HEALTH,
        contextMultiplier: 1.1,
        proximityBonus: 1.0
      }
    };

    // Context-enhancing keywords that amplify other keywords when present
    this.contextEnhancers = {
      'BREAKING': 2.5,
      'URGENT': 2.3,
      'CONFIRMED': 1.8,
      'EXCLUSIVE': 1.6,
      'OFFICIAL': 1.5,
      'CLASSIFIED': 3.0,
      'INTELLIGENCE': 1.7,
      'ASSESSMENT': 1.4,
      'ANALYSIS': 1.3,
      'SOURCES': 1.2
    };

    // Negation patterns that reduce keyword significance
    this.negationPatterns = [
      /NOT\s+(\w+)/gi,
      /NO\s+(\w+)/gi,
      /DENIES?\s+(\w+)/gi,
      /REJECTS?\s+(\w+)/gi,
      /DISMISSES?\s+(\w+)/gi,
      /CONTRADICTS?\s+(\w+)/gi
    ];

    // Phrase patterns that increase keyword significance
    this.amplificationPatterns = [
      /CONFIRMS?\s+(\w+)/gi,
      /REPORTS?\s+(\w+)/gi,
      /REVEALS?\s+(\w+)/gi,
      /INDICATES?\s+(\w+)/gi,
      /SUGGESTS?\s+(\w+)/gi,
      /SHOWS?\s+(\w+)/gi
    ];
  }

  /**
   * Calculate keyword relevance score for article content
   * @param {Object} article - Article object with title and content
   * @param {Object} options - Scoring options
   * @returns {Object} Keyword scoring results
   */
  calculateKeywordRelevance(article, options = {}) {
    const content = this.prepareContentForAnalysis(article);
    const keywordAnalysis = this.analyzeKeywordPresence(content);
    const contextAnalysis = this.analyzeContextualFactors(content, keywordAnalysis);
    const proximityAnalysis = this.analyzeKeywordProximity(content, keywordAnalysis);
    
    return {
      baseScore: this.calculateBaseKeywordScore(keywordAnalysis),
      contextAdjustedScore: this.applyContextualAdjustments(keywordAnalysis, contextAnalysis),
      proximityBonus: this.calculateProximityBonus(proximityAnalysis),
      finalScore: this.calculateFinalKeywordScore(keywordAnalysis, contextAnalysis, proximityAnalysis),
      keywordDetails: keywordAnalysis,
      contextFactors: contextAnalysis,
      proximityFactors: proximityAnalysis
    };
  }

  /**
   * Prepare content for keyword analysis
   * @param {Object} article - Article object
   * @returns {string} Normalized content for analysis
   */
  prepareContentForAnalysis(article) {
    const title = article.title || '';
    const content = article.content || article.summary || '';
    
    // Combine title and content with title weight boost
    const combinedContent = `${title} ${title} ${content}`.toUpperCase();
    
    // Clean and normalize text
    return combinedContent
      .replace(/[^\w\s]/g, ' ')  // Remove punctuation
      .replace(/\s+/g, ' ')      // Normalize whitespace
      .trim();
  }

  /**
   * Analyze keyword presence across all tiers
   * @param {string} content - Normalized content
   * @returns {Object} Keyword analysis results
   */
  analyzeKeywordPresence(content) {
    const analysis = {
      foundKeywords: {},
      tierScores: {},
      totalMatches: 0,
      uniqueKeywords: 0,
      keywordDensity: 0
    };

    Object.entries(this.keywordTiers).forEach(([tier, config]) => {
      analysis.foundKeywords[tier] = [];
      analysis.tierScores[tier] = 0;

      config.keywords.forEach(keyword => {
        const keywordRegex = new RegExp(`\\b${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
        const matches = content.match(keywordRegex) || [];
        
        if (matches.length > 0) {
          analysis.foundKeywords[tier].push({
            keyword,
            count: matches.length,
            weight: config.weight,
            score: matches.length * config.weight
          });
          
          analysis.tierScores[tier] += matches.length * config.weight;
          analysis.totalMatches += matches.length;
        }
      });

      analysis.uniqueKeywords += analysis.foundKeywords[tier].length;
    });

    // Calculate keyword density
    const wordCount = content.split(/\s+/).length;
    analysis.keywordDensity = wordCount > 0 ? (analysis.totalMatches / wordCount) * 100 : 0;

    return analysis;
  }

  /**
   * Analyze contextual factors that enhance or diminish keyword significance
   * @param {string} content - Normalized content
   * @param {Object} keywordAnalysis - Keyword analysis results
   * @returns {Object} Context analysis results
   */
  analyzeContextualFactors(content, keywordAnalysis) {
    const contextFactors = {
      enhancers: [],
      negations: [],
      amplifications: [],
      overallMultiplier: 1.0
    };

    // Check for context enhancing keywords
    Object.entries(this.contextEnhancers).forEach(([enhancer, multiplier]) => {
      const enhancerRegex = new RegExp(`\\b${enhancer}\\b`, 'gi');
      const matches = content.match(enhancerRegex) || [];
      
      if (matches.length > 0) {
        contextFactors.enhancers.push({
          keyword: enhancer,
          count: matches.length,
          multiplier
        });
      }
    });

    // Check for negation patterns
    this.negationPatterns.forEach(pattern => {
      const matches = content.match(pattern) || [];
      contextFactors.negations.push(...matches);
    });

    // Check for amplification patterns
    this.amplificationPatterns.forEach(pattern => {
      const matches = content.match(pattern) || [];
      contextFactors.amplifications.push(...matches);
    });

    // Calculate overall context multiplier
    contextFactors.overallMultiplier = this.calculateContextMultiplier(contextFactors);

    return contextFactors;
  }

  /**
   * Analyze keyword proximity and clustering
   * @param {string} content - Normalized content
   * @param {Object} keywordAnalysis - Keyword analysis results
   * @returns {Object} Proximity analysis results
   */
  analyzeKeywordProximity(content, keywordAnalysis) {
    const proximityAnalysis = {
      clusters: [],
      averageDistance: 0,
      proximityBonus: 0
    };

    const words = content.split(/\s+/);
    const keywordPositions = this.findKeywordPositions(words, keywordAnalysis);

    if (keywordPositions.length < 2) {
      return proximityAnalysis;
    }

    // Find keyword clusters (keywords within 10 words of each other)
    proximityAnalysis.clusters = this.findKeywordClusters(keywordPositions, 10);
    
    // Calculate average distance between keywords
    proximityAnalysis.averageDistance = this.calculateAverageKeywordDistance(keywordPositions);
    
    // Calculate proximity bonus based on clustering
    proximityAnalysis.proximityBonus = this.calculateProximityBonus(proximityAnalysis);

    return proximityAnalysis;
  }

  /**
   * Calculate base keyword score before adjustments
   * @param {Object} keywordAnalysis - Keyword analysis results
   * @returns {number} Base keyword score
   */
  calculateBaseKeywordScore(keywordAnalysis) {
    let baseScore = 0;
    
    // Sum weighted scores from all tiers
    Object.values(keywordAnalysis.tierScores).forEach(tierScore => {
      baseScore += tierScore;
    });

    // Apply keyword diversity bonus
    const diversityBonus = Math.min(keywordAnalysis.uniqueKeywords * 2, 20);
    baseScore += diversityBonus;

    // Apply keyword density factor (optimal density: 2-5%)
    const densityFactor = this.calculateDensityFactor(keywordAnalysis.keywordDensity);
    baseScore *= densityFactor;

    return Math.min(baseScore, 100);
  }

  /**
   * Apply contextual adjustments to keyword score
   * @param {Object} keywordAnalysis - Keyword analysis results
   * @param {Object} contextAnalysis - Context analysis results
   * @returns {number} Context-adjusted score
   */
  applyContextualAdjustments(keywordAnalysis, contextAnalysis) {
    let adjustedScore = this.calculateBaseKeywordScore(keywordAnalysis);

    // Apply context enhancer multiplier
    adjustedScore *= contextAnalysis.overallMultiplier;

    // Reduce score for negations (each negation reduces score by 10%)
    const negationPenalty = Math.min(contextAnalysis.negations.length * 0.1, 0.5);
    adjustedScore *= (1 - negationPenalty);

    // Boost score for amplifications (each amplification increases score by 5%)
    const amplificationBonus = Math.min(contextAnalysis.amplifications.length * 0.05, 0.3);
    adjustedScore *= (1 + amplificationBonus);

    return Math.min(adjustedScore, 100);
  }

  /**
   * Calculate final keyword score with all factors
   * @param {Object} keywordAnalysis - Keyword analysis results
   * @param {Object} contextAnalysis - Context analysis results
   * @param {Object} proximityAnalysis - Proximity analysis results
   * @returns {number} Final keyword score
   */
  calculateFinalKeywordScore(keywordAnalysis, contextAnalysis, proximityAnalysis) {
    let finalScore = this.applyContextualAdjustments(keywordAnalysis, contextAnalysis);
    
    // Add proximity bonus
    finalScore += proximityAnalysis.proximityBonus;

    // Apply tier-specific context multipliers
    Object.entries(keywordAnalysis.foundKeywords).forEach(([tier, keywords]) => {
      if (keywords.length > 0) {
        const tierConfig = this.keywordTiers[tier];
        const tierBonus = keywords.length * tierConfig.contextMultiplier * 0.5;
        finalScore += tierBonus;
      }
    });

    return Math.min(finalScore, 100);
  }

  /**
   * Calculate context multiplier from enhancing factors
   * @param {Object} contextFactors - Context factors object
   * @returns {number} Context multiplier
   */
  calculateContextMultiplier(contextFactors) {
    let multiplier = 1.0;

    // Apply enhancer multipliers with diminishing returns
    contextFactors.enhancers.forEach((enhancer, index) => {
      const diminishingFactor = Math.pow(0.8, index); // Each additional enhancer has less impact
      multiplier += (enhancer.multiplier - 1.0) * diminishingFactor;
    });

    // Cap the maximum multiplier to prevent extreme scores
    return Math.min(multiplier, 3.0);
  }

  /**
   * Calculate density factor for keyword density optimization
   * @param {number} density - Keyword density percentage
   * @returns {number} Density factor (0.5 to 1.2)
   */
  calculateDensityFactor(density) {
    if (density >= 2.0 && density <= 5.0) {
      return 1.2; // Optimal density range
    } else if (density >= 1.0 && density < 2.0) {
      return 1.0 + (density - 1.0) * 0.2; // Gradually increasing
    } else if (density > 5.0 && density <= 10.0) {
      return 1.2 - ((density - 5.0) * 0.1); // Gradually decreasing
    } else if (density > 10.0) {
      return 0.5; // Keyword stuffing penalty
    } else {
      return 0.7; // Low density penalty
    }
  }

  /**
   * Find positions of all keywords in content
   * @param {Array} words - Array of words from content
   * @param {Object} keywordAnalysis - Keyword analysis results
   * @returns {Array} Array of keyword positions
   */
  findKeywordPositions(words, keywordAnalysis) {
    const positions = [];

    Object.entries(keywordAnalysis.foundKeywords).forEach(([tier, keywords]) => {
      keywords.forEach(keywordData => {
        words.forEach((word, index) => {
          if (word === keywordData.keyword.toUpperCase()) {
            positions.push({
              keyword: keywordData.keyword,
              tier,
              position: index,
              weight: keywordData.weight
            });
          }
        });
      });
    });

    return positions.sort((a, b) => a.position - b.position);
  }

  /**
   * Find clusters of keywords within specified distance
   * @param {Array} keywordPositions - Array of keyword positions
   * @param {number} maxDistance - Maximum distance for clustering
   * @returns {Array} Array of keyword clusters
   */
  findKeywordClusters(keywordPositions, maxDistance) {
    const clusters = [];
    let currentCluster = [];

    for (let i = 0; i < keywordPositions.length; i++) {
      const currentKeyword = keywordPositions[i];
      
      if (currentCluster.length === 0) {
        currentCluster.push(currentKeyword);
      } else {
        const lastKeyword = currentCluster[currentCluster.length - 1];
        const distance = currentKeyword.position - lastKeyword.position;
        
        if (distance <= maxDistance) {
          currentCluster.push(currentKeyword);
        } else {
          if (currentCluster.length >= 2) {
            clusters.push([...currentCluster]);
          }
          currentCluster = [currentKeyword];
        }
      }
    }

    // Add final cluster if it has multiple keywords
    if (currentCluster.length >= 2) {
      clusters.push(currentCluster);
    }

    return clusters;
  }

  /**
   * Calculate average distance between keywords
   * @param {Array} keywordPositions - Array of keyword positions
   * @returns {number} Average distance between keywords
   */
  calculateAverageKeywordDistance(keywordPositions) {
    if (keywordPositions.length < 2) return 0;

    let totalDistance = 0;
    let distanceCount = 0;

    for (let i = 1; i < keywordPositions.length; i++) {
      totalDistance += keywordPositions[i].position - keywordPositions[i - 1].position;
      distanceCount++;
    }

    return distanceCount > 0 ? totalDistance / distanceCount : 0;
  }

  /**
   * Calculate proximity bonus based on keyword clustering
   * @param {Object} proximityAnalysis - Proximity analysis results
   * @returns {number} Proximity bonus score
   */
  calculateProximityBonus(proximityAnalysis) {
    let bonus = 0;

    // Bonus for each cluster
    proximityAnalysis.clusters.forEach(cluster => {
      const clusterSize = cluster.length;
      const clusterWeight = cluster.reduce((sum, kw) => sum + kw.weight, 0);
      
      // Bonus increases with cluster size and weight
      bonus += (clusterSize - 1) * clusterWeight * 0.5;
    });

    // Bonus for tight keyword spacing
    if (proximityAnalysis.averageDistance > 0 && proximityAnalysis.averageDistance <= 5) {
      bonus += 5; // Close proximity bonus
    } else if (proximityAnalysis.averageDistance <= 10) {
      bonus += 2; // Moderate proximity bonus
    }

    return Math.min(bonus, 20); // Cap proximity bonus
  }

  /**
   * Get keyword analysis summary for debugging
   * @param {Object} article - Article object
   * @returns {Object} Analysis summary
   */
  getAnalysisSummary(article) {
    const result = this.calculateKeywordRelevance(article);
    
    return {
      finalScore: result.finalScore,
      keywordCount: result.keywordDetails.totalMatches,
      uniqueKeywords: result.keywordDetails.uniqueKeywords,
      keywordDensity: result.keywordDetails.keywordDensity,
      topKeywords: this.getTopKeywords(result.keywordDetails, 5),
      contextEnhancers: result.contextFactors.enhancers.length,
      proximityBonus: result.proximityBonus
    };
  }

  /**
   * Get top keywords by score
   * @param {Object} keywordDetails - Keyword analysis details
   * @param {number} limit - Number of top keywords to return
   * @returns {Array} Top keywords with scores
   */
  getTopKeywords(keywordDetails, limit = 5) {
    const allKeywords = [];
    
    Object.entries(keywordDetails.foundKeywords).forEach(([tier, keywords]) => {
      keywords.forEach(kw => {
        allKeywords.push({
          keyword: kw.keyword,
          tier,
          count: kw.count,
          score: kw.score
        });
      });
    });

    return allKeywords
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }
}

// Export singleton instance
export const keywordScorerService = new KeywordScorer();