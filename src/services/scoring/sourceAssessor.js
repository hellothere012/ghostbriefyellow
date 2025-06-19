// Source Credibility Assessment Module for Ghost Brief
// Professional source reliability evaluation and scoring

/**
 * Source Assessor Service
 * Evaluates source credibility and reliability for intelligence assessment
 */
export class SourceAssessorService {
  constructor() {
    // Source credibility matrix with detailed classifications
    this.sourceCredibilityMatrix = {
      TIER_1_PREMIUM: {
        baseScore: 95,
        reliability: 'HIGHEST',
        sources: ['REUTERS', 'BBC', 'AP', 'DEFENSE NEWS', 'JANES', 'MIT TECH REVIEW'],
        domains: ['reuters.com', 'bbc.com', 'apnews.com', 'defensenews.com', 'janes.com', 'technologyreview.com'],
        characteristics: [
          'established_reputation',
          'rigorous_fact_checking', 
          'editorial_standards',
          'source_verification',
          'correction_policy'
        ]
      },
      TIER_2_RELIABLE: {
        baseScore: 85,
        reliability: 'HIGH',
        sources: ['CNN', 'BLOOMBERG', 'WSJ', 'FOREIGN POLICY', 'BREAKING DEFENSE', 'THE GUARDIAN'],
        domains: ['cnn.com', 'bloomberg.com', 'wsj.com', 'foreignpolicy.com', 'breakingdefense.com', 'theguardian.com'],
        characteristics: [
          'professional_standards',
          'verification_process',
          'experienced_reporters',
          'editorial_oversight'
        ]
      },
      TIER_3_STANDARD: {
        baseScore: 70,
        reliability: 'MEDIUM',
        sources: ['GENERAL NEWS OUTLETS'],
        domains: ['standard_news_domains'],
        characteristics: [
          'basic_editorial_standards',
          'general_reporting',
          'variable_quality'
        ]
      },
      TIER_4_QUESTIONABLE: {
        baseScore: 40,
        reliability: 'LOW',
        sources: ['UNKNOWN', 'SOCIAL MEDIA', 'BLOGS', 'UNVERIFIED'],
        domains: ['unknown_sources', 'social_platforms', 'blog_networks'],
        characteristics: [
          'limited_verification',
          'potential_bias',
          'unreliable_sources',
          'no_editorial_oversight'
        ]
      }
    };

    // Domain-specific credibility modifiers
    this.domainModifiers = {
      GOVERNMENT: {
        modifier: 1.1,
        domains: ['.gov', '.mil', 'state.gov', 'defense.gov'],
        reliability: 'OFFICIAL'
      },
      ACADEMIC: {
        modifier: 1.05,
        domains: ['.edu', 'university', 'institute', 'research'],
        reliability: 'SCHOLARLY'
      },
      THINK_TANK: {
        modifier: 1.0,
        domains: ['brookings', 'rand.org', 'csis.org', 'cfr.org'],
        reliability: 'ANALYTICAL'
      },
      COMMERCIAL: {
        modifier: 0.9,
        domains: ['.com', 'commercial'],
        reliability: 'COMMERCIAL'
      },
      SOCIAL_MEDIA: {
        modifier: 0.6,
        domains: ['twitter', 'facebook', 'telegram', 'reddit'],
        reliability: 'UNVERIFIED'
      }
    };

    // Bias indicators and their impact on credibility
    this.biasIndicators = {
      STRONG_BIAS: {
        impact: -20,
        indicators: ['propaganda', 'state-controlled', 'partisan', 'advocacy']
      },
      MODERATE_BIAS: {
        impact: -10,
        indicators: ['editorial slant', 'political leaning', 'selective reporting']
      },
      MINIMAL_BIAS: {
        impact: -2,
        indicators: ['slight leaning', 'occasional bias']
      }
    };

    // Track record factors
    this.trackRecordFactors = {
      ACCURACY_HISTORY: {
        EXCELLENT: { modifier: 1.15, threshold: 95 },
        GOOD: { modifier: 1.05, threshold: 85 },
        AVERAGE: { modifier: 1.0, threshold: 70 },
        POOR: { modifier: 0.85, threshold: 50 }
      },
      CORRECTION_POLICY: {
        TRANSPARENT: { modifier: 1.1 },
        STANDARD: { modifier: 1.0 },
        POOR: { modifier: 0.9 },
        NONE: { modifier: 0.8 }
      },
      EXCLUSIVITY: {
        FIRST_REPORTER: { bonus: 10 },
        EXCLUSIVE_ACCESS: { bonus: 8 },
        INVESTIGATIVE: { bonus: 12 },
        STANDARD: { bonus: 0 }
      }
    };

    // Content quality indicators that affect source assessment
    this.contentQualityIndicators = {
      HIGH_QUALITY: {
        impact: 5,
        indicators: [
          'multiple sources',
          'on-the-record quotes',
          'document verification',
          'expert analysis',
          'detailed investigation'
        ]
      },
      MEDIUM_QUALITY: {
        impact: 2,
        indicators: [
          'single source',
          'background quotes',
          'standard reporting',
          'basic verification'
        ]
      },
      LOW_QUALITY: {
        impact: -5,
        indicators: [
          'anonymous sources only',
          'unverified claims',
          'speculation',
          'rumor-based'
        ]
      }
    };
  }

  /**
   * Assess source credibility comprehensively
   * @param {Object} article - Article object with source information
   * @returns {Object} Source credibility assessment
   */
  assessSourceCredibility(article) {
    const sourceInfo = this.extractSourceInfo(article);
    
    // Base credibility score
    const baseAssessment = this.calculateBaseCredibility(sourceInfo);
    
    // Domain-specific modifiers
    const domainAssessment = this.assessDomainCredibility(sourceInfo);
    
    // Bias evaluation
    const biasAssessment = this.evaluateBias(article, sourceInfo);
    
    // Track record evaluation
    const trackRecordAssessment = this.evaluateTrackRecord(sourceInfo);
    
    // Content quality impact
    const contentQualityImpact = this.assessContentQuality(article);
    
    // Combine all factors
    const finalScore = this.combineCredibilityFactors({
      base: baseAssessment,
      domain: domainAssessment,
      bias: biasAssessment,
      trackRecord: trackRecordAssessment,
      contentQuality: contentQualityImpact
    });

    return {
      score: Math.round(Math.min(Math.max(finalScore.score, 0), 100)),
      tier: baseAssessment.tier,
      reliability: baseAssessment.reliability,
      confidence: this.calculateAssessmentConfidence(finalScore),
      breakdown: {
        baseScore: baseAssessment.score,
        domainModifier: domainAssessment.modifier,
        biasImpact: biasAssessment.impact,
        trackRecordModifier: trackRecordAssessment.modifier,
        contentQualityImpact: contentQualityImpact.impact
      },
      sourceInfo,
      analysis: {
        strengths: this.identifySourceStrengths(baseAssessment, domainAssessment, trackRecordAssessment),
        weaknesses: this.identifySourceWeaknesses(biasAssessment, contentQualityImpact),
        recommendations: this.generateSourceRecommendations(finalScore.score, baseAssessment.tier)
      }
    };
  }

  /**
   * Extract source information from article
   * @param {Object} article - Article object
   * @returns {Object} Extracted source information
   */
  extractSourceInfo(article) {
    return {
      domain: article.source?.domain || '',
      feedName: article.source?.feedName || '',
      url: article.url || '',
      providedScore: article.source?.credibilityScore || 70,
      title: article.title || '',
      content: article.content || article.summary || ''
    };
  }

  /**
   * Calculate base credibility score from source tier
   * @param {Object} sourceInfo - Source information
   * @returns {Object} Base credibility assessment
   */
  calculateBaseCredibility(sourceInfo) {
    const { domain, feedName } = sourceInfo;
    
    // Find matching tier
    for (const [tierName, tierData] of Object.entries(this.sourceCredibilityMatrix)) {
      // Check domain matches
      if (tierData.domains.some(sourceDomain => 
        domain.toLowerCase().includes(sourceDomain.toLowerCase())
      )) {
        return {
          score: tierData.baseScore,
          tier: tierName,
          reliability: tierData.reliability,
          matchType: 'DOMAIN',
          matchedSource: domain
        };
      }
      
      // Check feed name matches
      if (tierData.sources.some(source => 
        feedName.toUpperCase().includes(source) || 
        source.includes(feedName.toUpperCase())
      )) {
        return {
          score: tierData.baseScore,
          tier: tierName,
          reliability: tierData.reliability,
          matchType: 'FEED_NAME',
          matchedSource: feedName
        };
      }
    }
    
    // Default to standard tier
    return {
      score: this.sourceCredibilityMatrix.TIER_3_STANDARD.baseScore,
      tier: 'TIER_3_STANDARD',
      reliability: 'MEDIUM',
      matchType: 'DEFAULT',
      matchedSource: domain || feedName
    };
  }

  /**
   * Assess domain-specific credibility
   * @param {Object} sourceInfo - Source information
   * @returns {Object} Domain credibility assessment
   */
  assessDomainCredibility(sourceInfo) {
    const { domain, url } = sourceInfo;
    const fullUrl = url.toLowerCase() + domain.toLowerCase();
    
    for (const [category, categoryData] of Object.entries(this.domainModifiers)) {
      if (categoryData.domains.some(domainPattern => 
        fullUrl.includes(domainPattern.toLowerCase())
      )) {
        return {
          category,
          modifier: categoryData.modifier,
          reliability: categoryData.reliability,
          matchedPattern: categoryData.domains.find(pattern => 
            fullUrl.includes(pattern.toLowerCase())
          )
        };
      }
    }
    
    return {
      category: 'GENERAL',
      modifier: 1.0,
      reliability: 'STANDARD',
      matchedPattern: null
    };
  }

  /**
   * Evaluate potential bias in source
   * @param {Object} article - Article object
   * @param {Object} sourceInfo - Source information
   * @returns {Object} Bias assessment
   */
  evaluateBias(article, sourceInfo) {
    const content = (article.title + ' ' + sourceInfo.content).toLowerCase();
    const { feedName, domain } = sourceInfo;
    
    let biasImpact = 0;
    const detectedBias = [];
    
    // Check for bias indicators in content and source
    Object.entries(this.biasIndicators).forEach(([biasLevel, biasData]) => {
      biasData.indicators.forEach(indicator => {
        if (content.includes(indicator) || 
            feedName.toLowerCase().includes(indicator) || 
            domain.toLowerCase().includes(indicator)) {
          biasImpact += biasData.impact;
          detectedBias.push({
            level: biasLevel,
            indicator,
            impact: biasData.impact
          });
        }
      });
    });
    
    return {
      impact: biasImpact,
      detectedBias,
      biasLevel: this.categorizeBiasLevel(biasImpact),
      hasBias: detectedBias.length > 0
    };
  }

  /**
   * Categorize bias level based on impact
   * @param {number} biasImpact - Calculated bias impact
   * @returns {string} Bias level category
   */
  categorizeBiasLevel(biasImpact) {
    if (biasImpact <= -15) return 'STRONG';
    if (biasImpact <= -8) return 'MODERATE';
    if (biasImpact <= -3) return 'MINIMAL';
    return 'NONE';
  }

  /**
   * Evaluate track record and exclusivity
   * @param {Object} sourceInfo - Source information
   * @returns {Object} Track record assessment
   */
  evaluateTrackRecord(sourceInfo) {
    const { providedScore, content } = sourceInfo;
    
    // Use provided credibility score to infer track record
    let accuracyCategory = 'AVERAGE';
    if (providedScore >= 95) accuracyCategory = 'EXCELLENT';
    else if (providedScore >= 85) accuracyCategory = 'GOOD';
    else if (providedScore < 50) accuracyCategory = 'POOR';
    
    const accuracyModifier = this.trackRecordFactors.ACCURACY_HISTORY[accuracyCategory].modifier;
    
    // Check for exclusivity indicators
    let exclusivityBonus = 0;
    const exclusivityIndicators = [];
    
    Object.entries(this.trackRecordFactors.EXCLUSIVITY).forEach(([type, data]) => {
      const indicators = {
        FIRST_REPORTER: ['first to report', 'breaking', 'exclusive'],
        EXCLUSIVE_ACCESS: ['exclusive interview', 'exclusive access', 'obtained by'],
        INVESTIGATIVE: ['investigation', 'months-long', 'uncovered', 'revealed'],
        STANDARD: []
      };
      
      if (indicators[type]) {
        indicators[type].forEach(indicator => {
          if (content.toLowerCase().includes(indicator)) {
            exclusivityBonus = Math.max(exclusivityBonus, data.bonus);
            exclusivityIndicators.push({ type, indicator, bonus: data.bonus });
          }
        });
      }
    });
    
    return {
      modifier: accuracyModifier,
      accuracyCategory,
      exclusivityBonus,
      exclusivityIndicators,
      totalBonus: exclusivityBonus
    };
  }

  /**
   * Assess content quality impact on source credibility
   * @param {Object} article - Article object
   * @returns {Object} Content quality assessment
   */
  assessContentQuality(article) {
    const content = (article.title + ' ' + (article.content || article.summary || '')).toLowerCase();
    let qualityImpact = 0;
    const qualityIndicators = [];
    
    Object.entries(this.contentQualityIndicators).forEach(([qualityLevel, qualityData]) => {
      qualityData.indicators.forEach(indicator => {
        if (content.includes(indicator)) {
          qualityImpact += qualityData.impact;
          qualityIndicators.push({
            level: qualityLevel,
            indicator,
            impact: qualityData.impact
          });
        }
      });
    });
    
    return {
      impact: qualityImpact,
      qualityIndicators,
      qualityLevel: this.categorizeContentQuality(qualityImpact),
      hasQualityIndicators: qualityIndicators.length > 0
    };
  }

  /**
   * Categorize content quality based on impact
   * @param {number} qualityImpact - Calculated quality impact
   * @returns {string} Quality level category
   */
  categorizeContentQuality(qualityImpact) {
    if (qualityImpact >= 8) return 'HIGH';
    if (qualityImpact >= 3) return 'MEDIUM';
    if (qualityImpact <= -3) return 'LOW';
    return 'STANDARD';
  }

  /**
   * Combine all credibility factors
   * @param {Object} factors - All credibility factors
   * @returns {Object} Combined credibility score
   */
  combineCredibilityFactors({ base, domain, bias, trackRecord, contentQuality }) {
    // Start with base score
    let score = base.score;
    
    // Apply domain modifier
    score *= domain.modifier;
    
    // Apply bias impact
    score += bias.impact;
    
    // Apply track record modifier
    score *= trackRecord.modifier;
    
    // Add track record bonus
    score += trackRecord.totalBonus;
    
    // Apply content quality impact
    score += contentQuality.impact;
    
    return {
      score: Math.min(Math.max(score, 0), 100),
      breakdown: {
        base: base.score,
        afterDomain: base.score * domain.modifier,
        afterBias: (base.score * domain.modifier) + bias.impact,
        afterTrackRecord: ((base.score * domain.modifier) + bias.impact) * trackRecord.modifier,
        final: score
      }
    };
  }

  /**
   * Calculate confidence in credibility assessment
   * @param {Object} finalScore - Final score calculation
   * @returns {number} Confidence level (0-100)
   */
  calculateAssessmentConfidence(finalScore) {
    // Higher confidence for well-known sources with clear indicators
    let confidence = 70; // Base confidence
    
    // Adjust based on score stability
    const scoreRange = finalScore.breakdown.final - finalScore.breakdown.base;
    if (Math.abs(scoreRange) < 10) confidence += 20; // Stable score
    else if (Math.abs(scoreRange) > 30) confidence -= 15; // Volatile score
    
    return Math.min(Math.max(confidence, 30), 95);
  }

  /**
   * Identify source strengths
   * @param {Object} baseAssessment - Base assessment
   * @param {Object} domainAssessment - Domain assessment
   * @param {Object} trackRecordAssessment - Track record assessment
   * @returns {Array} List of strengths
   */
  identifySourceStrengths(baseAssessment, domainAssessment, trackRecordAssessment) {
    const strengths = [];
    
    if (baseAssessment.tier === 'TIER_1_PREMIUM') {
      strengths.push('Premium tier source with highest credibility');
    }
    
    if (domainAssessment.category === 'GOVERNMENT') {
      strengths.push('Official government source');
    }
    
    if (trackRecordAssessment.accuracyCategory === 'EXCELLENT') {
      strengths.push('Excellent accuracy track record');
    }
    
    if (trackRecordAssessment.exclusivityBonus > 0) {
      strengths.push('Exclusive or investigative reporting');
    }
    
    return strengths;
  }

  /**
   * Identify source weaknesses
   * @param {Object} biasAssessment - Bias assessment
   * @param {Object} contentQualityImpact - Content quality impact
   * @returns {Array} List of weaknesses
   */
  identifySourceWeaknesses(biasAssessment, contentQualityImpact) {
    const weaknesses = [];
    
    if (biasAssessment.biasLevel === 'STRONG') {
      weaknesses.push('Strong bias indicators detected');
    }
    
    if (contentQualityImpact.qualityLevel === 'LOW') {
      weaknesses.push('Low content quality indicators');
    }
    
    if (biasAssessment.detectedBias.length > 2) {
      weaknesses.push('Multiple bias indicators present');
    }
    
    return weaknesses;
  }

  /**
   * Generate source recommendations
   * @param {number} score - Final credibility score
   * @param {string} tier - Source tier
   * @returns {Array} List of recommendations
   */
  generateSourceRecommendations(score, tier) {
    const recommendations = [];
    
    if (score >= 90) {
      recommendations.push('Highly reliable source - suitable for high-priority intelligence');
    } else if (score >= 75) {
      recommendations.push('Reliable source - suitable for standard intelligence reporting');
    } else if (score >= 60) {
      recommendations.push('Moderate reliability - verify with additional sources');
    } else {
      recommendations.push('Low reliability - require multiple source confirmation');
    }
    
    if (tier === 'TIER_4_QUESTIONABLE') {
      recommendations.push('Consider upgrading to higher-tier sources when possible');
    }
    
    return recommendations;
  }
}

// Export singleton instance
export const sourceAssessorService = new SourceAssessorService();