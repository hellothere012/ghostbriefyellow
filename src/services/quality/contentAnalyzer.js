// Content Quality Analysis Module for Ghost Brief
// Specialized content assessment and quality evaluation

/**
 * Content Analyzer Service
 * Analyzes content quality for intelligence assessment
 */
export class ContentAnalyzerService {
  constructor() {
    // Content quality indicators and their weights
    this.contentIndicators = {
      HIGH_QUALITY: {
        weight: 3,
        indicators: [
          'according to', 'confirmed by', 'verified', 'official statement',
          'intelligence sources', 'classified document', 'leaked', 'exclusive',
          'first reported', 'investigation reveals', 'analysis shows',
          'multiple sources', 'corroborated', 'authenticated'
        ]
      },
      MEDIUM_QUALITY: {
        weight: 2,
        indicators: [
          'reported', 'sources say', 'officials indicate', 'appears to',
          'analysis suggests', 'evidence indicates', 'documents show',
          'according to reports', 'informed sources', 'reliable sources'
        ]
      },
      LOW_QUALITY: {
        weight: 1,
        indicators: [
          'rumored', 'alleged', 'speculation', 'unconfirmed', 'claims',
          'reportedly', 'possibly', 'might', 'could be', 'appears',
          'social media reports', 'unverified claims'
        ]
      },
      DISQUALIFYING: {
        weight: -10,
        indicators: [
          'sponsored', 'advertisement', 'promotional', 'buy now',
          'click here', 'subscribe', 'offer', 'deal', 'discount',
          'affiliate link', 'sponsored content', 'paid promotion'
        ]
      }
    };

    // Content depth metrics
    this.depthMetrics = {
      WORD_COUNT: {
        excellent: 800,
        good: 400,
        acceptable: 200,
        poor: 100
      },
      SENTENCE_COUNT: {
        excellent: 20,
        good: 10,
        acceptable: 5,
        poor: 2
      },
      PARAGRAPH_COUNT: {
        excellent: 6,
        good: 4,
        acceptable: 2,
        poor: 1
      }
    };

    // Technical detail indicators
    this.technicalIndicators = {
      DATES: /\b\d{1,2}\/\d{1,2}\/\d{4}\b|\b\d{4}-\d{2}-\d{2}\b/g,
      TIMES: /\b\d{1,2}:\d{2}(?::\d{2})?\s*(?:AM|PM|UTC|GMT)?\b/gi,
      NUMBERS: /\b\d+(?:,\d{3})*(?:\.\d+)?\b/g,
      COORDINATES: /\b\d+(?:\.\d+)?°?\s*[NS],?\s*\d+(?:\.\d+)?°?\s*[EW]\b/gi,
      TECHNICAL_TERMS: /\b(?:MHz|GHz|km|miles|meters|feet|tons|degrees|celsius|fahrenheit)\b/gi,
      CURRENCIES: /\$\d+(?:,\d{3})*(?:\.\d{2})?|\b\d+(?:,\d{3})*\s*(?:USD|EUR|GBP|JPY|CNY)\b/gi
    };

    // Language quality indicators
    this.languageQuality = {
      FORMAL_LANGUAGE: [
        'furthermore', 'however', 'nevertheless', 'consequently', 'therefore',
        'moreover', 'additionally', 'specifically', 'particularly', 'notably'
      ],
      ANALYTICAL_LANGUAGE: [
        'analysis', 'assessment', 'evaluation', 'examination', 'investigation',
        'indicates', 'suggests', 'demonstrates', 'reveals', 'confirms'
      ],
      UNCERTAINTY_LANGUAGE: [
        'might', 'could', 'possibly', 'perhaps', 'maybe', 'likely',
        'appears', 'seems', 'suggests', 'indicates'
      ]
    };

    // Content structure indicators
    this.structureIndicators = {
      QUOTES: /"[^"]*"/g,
      CITATIONS: /\[[^\]]*\]/g,
      REFERENCES: /(?:ref|reference|source|according to|citing)/gi,
      HEADINGS: /^#{1,6}\s+.+$/gm,
      LISTS: /^\s*[-*+]\s+.+$/gm
    };
  }

  /**
   * Perform comprehensive content analysis
   * @param {Array} signals - Signals to analyze
   * @returns {Object} Content analysis results
   */
  async contentAnalysis(signals) {
    console.log(`📝 Analyzing content quality for ${signals.length} signals...`);

    const results = {
      input: signals.length,
      passed: [],
      rejected: [],
      qualityScores: [],
      analysis: {
        averageDepth: 0,
        averageQuality: 0,
        technicalDetailLevel: 0,
        languageQualityLevel: 0
      }
    };

    let totalDepth = 0;
    let totalQuality = 0;
    let totalTechnical = 0;
    let totalLanguage = 0;

    for (const signal of signals) {
      const contentAnalysis = this.analyzeContentQuality(signal);
      
      // Calculate overall content score
      const overallScore = this.calculateOverallContentScore(contentAnalysis);
      
      // Add quality metadata to signal
      signal.qualityAnalysis = {
        ...contentAnalysis,
        overallScore,
        contentQualityLevel: this.categorizeContentQuality(overallScore)
      };

      // Track aggregated metrics
      totalDepth += contentAnalysis.depthScore;
      totalQuality += contentAnalysis.qualityIndicatorScore;
      totalTechnical += contentAnalysis.technicalDetailScore;
      totalLanguage += contentAnalysis.languageQualityScore;

      results.qualityScores.push({
        id: signal.id,
        overallScore,
        breakdown: contentAnalysis
      });

      // Apply filtering threshold
      if (overallScore >= 40) { // Minimum content quality threshold
        results.passed.push(signal);
      } else {
        signal.rejectionReason = `Content quality too low: ${overallScore}/100`;
        results.rejected.push(signal);
      }
    }

    // Calculate averages
    const count = signals.length;
    results.analysis = {
      averageDepth: Math.round(totalDepth / count),
      averageQuality: Math.round(totalQuality / count),
      technicalDetailLevel: Math.round(totalTechnical / count),
      languageQualityLevel: Math.round(totalLanguage / count),
      overallContentQuality: Math.round((totalDepth + totalQuality + totalTechnical + totalLanguage) / (count * 4) * 100)
    };

    console.log(`✅ Content analysis complete: ${results.passed.length}/${signals.length} passed (avg quality: ${results.analysis.overallContentQuality}%)`);
    return results;
  }

  /**
   * Analyze content quality for a single signal
   * @param {Object} signal - Signal to analyze
   * @returns {Object} Content quality analysis
   */
  analyzeContentQuality(signal) {
    const content = (signal.title + ' ' + (signal.content || signal.summary || '')).toLowerCase();
    const originalContent = signal.title + ' ' + (signal.content || signal.summary || '');

    return {
      depthScore: this.assessContentDepth(originalContent),
      qualityIndicatorScore: this.assessQualityIndicators(content),
      technicalDetailScore: this.assessTechnicalDetails(originalContent),
      languageQualityScore: this.assessLanguageQuality(content),
      structureScore: this.assessContentStructure(originalContent),
      readabilityScore: this.assessReadability(originalContent)
    };
  }

  /**
   * Assess content depth and detail level
   * @param {string} content - Content to assess
   * @returns {number} Depth score (0-100)
   */
  assessContentDepth(content) {
    const wordCount = content.split(/\s+/).filter(word => word.length > 0).length;
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
    const paragraphs = content.split(/\n\s*\n/).filter(p => p.trim().length > 0).length;

    let depthScore = 0;

    // Word count scoring
    if (wordCount >= this.depthMetrics.WORD_COUNT.excellent) depthScore += 40;
    else if (wordCount >= this.depthMetrics.WORD_COUNT.good) depthScore += 30;
    else if (wordCount >= this.depthMetrics.WORD_COUNT.acceptable) depthScore += 20;
    else if (wordCount >= this.depthMetrics.WORD_COUNT.poor) depthScore += 10;

    // Sentence count scoring
    if (sentences >= this.depthMetrics.SENTENCE_COUNT.excellent) depthScore += 30;
    else if (sentences >= this.depthMetrics.SENTENCE_COUNT.good) depthScore += 20;
    else if (sentences >= this.depthMetrics.SENTENCE_COUNT.acceptable) depthScore += 15;
    else if (sentences >= this.depthMetrics.SENTENCE_COUNT.poor) depthScore += 5;

    // Paragraph structure scoring
    if (paragraphs >= this.depthMetrics.PARAGRAPH_COUNT.excellent) depthScore += 30;
    else if (paragraphs >= this.depthMetrics.PARAGRAPH_COUNT.good) depthScore += 20;
    else if (paragraphs >= this.depthMetrics.PARAGRAPH_COUNT.acceptable) depthScore += 10;

    return Math.min(depthScore, 100);
  }

  /**
   * Assess content quality indicators
   * @param {string} content - Content to assess
   * @returns {number} Quality indicator score (0-100)
   */
  assessQualityIndicators(content) {
    let qualityScore = 50; // Base score
    const matchedIndicators = [];

    Object.entries(this.contentIndicators).forEach(([level, data]) => {
      data.indicators.forEach(indicator => {
        if (content.includes(indicator)) {
          qualityScore += data.weight * 5;
          matchedIndicators.push({ level, indicator, weight: data.weight });
        }
      });
    });

    // Apply diminishing returns for too many indicators
    if (qualityScore > 100) {
      qualityScore = 100 - Math.log(qualityScore - 100) * 5;
    }

    return Math.max(Math.min(qualityScore, 100), 0);
  }

  /**
   * Assess technical details and specificity
   * @param {string} content - Content to assess
   * @returns {number} Technical detail score (0-100)
   */
  assessTechnicalDetails(content) {
    let technicalScore = 0;
    const detectedDetails = {};

    Object.entries(this.technicalIndicators).forEach(([type, regex]) => {
      const matches = content.match(regex) || [];
      detectedDetails[type] = matches.length;
      
      // Score based on presence and quantity of technical details
      if (matches.length > 0) {
        technicalScore += Math.min(matches.length * 10, 30);
      }
    });

    // Bonus for multiple types of technical details
    const detailTypes = Object.values(detectedDetails).filter(count => count > 0).length;
    if (detailTypes >= 3) technicalScore += 20;
    else if (detailTypes >= 2) technicalScore += 10;

    return Math.min(technicalScore, 100);
  }

  /**
   * Assess language quality and sophistication
   * @param {string} content - Content to assess
   * @returns {number} Language quality score (0-100)
   */
  assessLanguageQuality(content) {
    let languageScore = 50; // Base score
    
    // Check for formal language
    const formalMatches = this.languageQuality.FORMAL_LANGUAGE.filter(word => 
      content.includes(word)
    ).length;
    languageScore += Math.min(formalMatches * 5, 20);

    // Check for analytical language
    const analyticalMatches = this.languageQuality.ANALYTICAL_LANGUAGE.filter(word => 
      content.includes(word)
    ).length;
    languageScore += Math.min(analyticalMatches * 4, 15);

    // Penalize excessive uncertainty language
    const uncertaintyMatches = this.languageQuality.UNCERTAINTY_LANGUAGE.filter(word => 
      content.includes(word)
    ).length;
    if (uncertaintyMatches > 5) {
      languageScore -= (uncertaintyMatches - 5) * 2;
    }

    return Math.max(Math.min(languageScore, 100), 0);
  }

  /**
   * Assess content structure and formatting
   * @param {string} content - Content to assess
   * @returns {number} Structure score (0-100)
   */
  assessContentStructure(content) {
    let structureScore = 40; // Base score
    
    Object.entries(this.structureIndicators).forEach(([type, regex]) => {
      const matches = content.match(regex) || [];
      if (matches.length > 0) {
        structureScore += 10;
      }
    });

    // Check for proper sentence structure
    const avgSentenceLength = this.calculateAverageSentenceLength(content);
    if (avgSentenceLength >= 10 && avgSentenceLength <= 25) {
      structureScore += 10; // Good sentence length
    }

    return Math.min(structureScore, 100);
  }

  /**
   * Assess readability and clarity
   * @param {string} content - Content to assess
   * @returns {number} Readability score (0-100)
   */
  assessReadability(content) {
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const words = content.split(/\s+/).filter(w => w.length > 0);
    
    if (sentences.length === 0 || words.length === 0) return 0;

    const avgSentenceLength = words.length / sentences.length;
    const avgWordLength = words.reduce((sum, word) => sum + word.length, 0) / words.length;

    // Simple readability calculation (inverse complexity)
    let readabilityScore = 100;
    
    // Penalize very long sentences
    if (avgSentenceLength > 30) readabilityScore -= 20;
    else if (avgSentenceLength > 20) readabilityScore -= 10;
    
    // Penalize very long words
    if (avgWordLength > 7) readabilityScore -= 15;
    else if (avgWordLength > 6) readabilityScore -= 5;

    return Math.max(readabilityScore, 0);
  }

  /**
   * Calculate average sentence length
   * @param {string} content - Content to analyze
   * @returns {number} Average sentence length
   */
  calculateAverageSentenceLength(content) {
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const words = content.split(/\s+/).filter(w => w.length > 0);
    
    return sentences.length > 0 ? words.length / sentences.length : 0;
  }

  /**
   * Calculate overall content score
   * @param {Object} analysis - Content analysis results
   * @returns {number} Overall content score
   */
  calculateOverallContentScore(analysis) {
    const weights = {
      depth: 0.25,
      quality: 0.25,
      technical: 0.20,
      language: 0.15,
      structure: 0.10,
      readability: 0.05
    };

    return Math.round(
      (analysis.depthScore * weights.depth) +
      (analysis.qualityIndicatorScore * weights.quality) +
      (analysis.technicalDetailScore * weights.technical) +
      (analysis.languageQualityScore * weights.language) +
      (analysis.structureScore * weights.structure) +
      (analysis.readabilityScore * weights.readability)
    );
  }

  /**
   * Categorize content quality level
   * @param {number} score - Content quality score
   * @returns {string} Quality category
   */
  categorizeContentQuality(score) {
    if (score >= 85) return 'EXCELLENT';
    if (score >= 70) return 'GOOD';
    if (score >= 55) return 'ACCEPTABLE';
    if (score >= 40) return 'POOR';
    return 'INADEQUATE';
  }

  /**
   * Generate content improvement recommendations
   * @param {Object} analysis - Content analysis results
   * @returns {Array} Improvement recommendations
   */
  generateContentRecommendations(analysis) {
    const recommendations = [];

    if (analysis.depthScore < 50) {
      recommendations.push('Increase content depth with more detailed information');
    }

    if (analysis.qualityIndicatorScore < 60) {
      recommendations.push('Add more authoritative sources and verification indicators');
    }

    if (analysis.technicalDetailScore < 40) {
      recommendations.push('Include specific technical details, dates, and numbers');
    }

    if (analysis.languageQualityScore < 50) {
      recommendations.push('Use more formal and analytical language');
    }

    if (analysis.structureScore < 60) {
      recommendations.push('Improve content structure with better formatting');
    }

    return recommendations;
  }
}

// Export singleton instance
export const contentAnalyzerService = new ContentAnalyzerService();