/**
 * Briefing Quality Assessor
 * Evaluates and scores the quality of generated intelligence briefings
 */


/**
 * Quality Assessment Service for Daily Briefings
 * Provides comprehensive quality evaluation and scoring
 */
export class BriefingQualityAssessor {
  constructor() {
    // Quality assessment criteria and weights
    this.qualityStandards = {
      MINIMUM_WORD_COUNT: 500,
      MAXIMUM_WORD_COUNT: 3000,
      REQUIRED_SECTIONS: 5,
      MINIMUM_SOURCES: 3,
      CONFIDENCE_THRESHOLD: 70,
      RELEVANCE_THRESHOLD: 60,
      ENTITY_DIVERSITY_THRESHOLD: 5
    };

    // Scoring weights for different quality aspects
    this.scoringWeights = {
      contentQuality: 0.25,
      structuralIntegrity: 0.20,
      sourceCredibility: 0.15,
      analyticalDepth: 0.15,
      timeliness: 0.10,
      entityRichness: 0.10,
      confidence: 0.05
    };

    // Quality assessment rubric
    this.qualityRubric = {
      contentQuality: {
        excellent: { min: 90, criteria: 'Comprehensive analysis with clear insights' },
        good: { min: 75, criteria: 'Solid analysis with relevant information' },
        fair: { min: 60, criteria: 'Basic analysis with some gaps' },
        poor: { min: 0, criteria: 'Limited or unclear analysis' }
      },
      structuralIntegrity: {
        excellent: { min: 90, criteria: 'All sections complete and well-organized' },
        good: { min: 75, criteria: 'Most sections complete with good flow' },
        fair: { min: 60, criteria: 'Some sections missing or poorly organized' },
        poor: { min: 0, criteria: 'Major structural issues' }
      },
      sourceCredibility: {
        excellent: { min: 90, criteria: 'High-credibility sources with verification' },
        good: { min: 75, criteria: 'Reliable sources with good coverage' },
        fair: { min: 60, criteria: 'Mixed source quality' },
        poor: { min: 0, criteria: 'Low-credibility or insufficient sources' }
      }
    };
  }

  /**
   * Assess overall briefing quality
   * @param {Object} briefing - Complete briefing object
   * @returns {Object} Quality assessment results
   */
  assessBriefingQuality(briefing) {
    const assessment = {
      overallScore: 0,
      categoryScores: {},
      qualityIndicators: {},
      recommendations: [],
      strengths: [],
      weaknesses: [],
      timestamp: new Date().toISOString()
    };

    // Assess individual quality categories
    assessment.categoryScores.contentQuality = this.assessContentQuality(briefing);
    assessment.categoryScores.structuralIntegrity = this.assessStructuralIntegrity(briefing);
    assessment.categoryScores.sourceCredibility = this.assessSourceCredibility(briefing);
    assessment.categoryScores.analyticalDepth = this.assessAnalyticalDepth(briefing);
    assessment.categoryScores.timeliness = this.assessTimeliness(briefing);
    assessment.categoryScores.entityRichness = this.assessEntityRichness(briefing);
    assessment.categoryScores.confidence = this.assessConfidenceLevel(briefing);

    // Calculate weighted overall score
    assessment.overallScore = this.calculateOverallScore(assessment.categoryScores);

    // Generate quality indicators
    assessment.qualityIndicators = this.generateQualityIndicators(briefing, assessment.categoryScores);

    // Generate recommendations and feedback
    assessment.recommendations = this.generateQualityRecommendations(assessment.categoryScores);
    assessment.strengths = this.identifyStrengths(assessment.categoryScores);
    assessment.weaknesses = this.identifyWeaknesses(assessment.categoryScores);

    // Assign quality grade
    assessment.qualityGrade = this.assignQualityGrade(assessment.overallScore);

    return assessment;
  }

  /**
   * Assess content quality of the briefing
   * @param {Object} briefing - Briefing object
   * @returns {number} Content quality score (0-100)
   */
  assessContentQuality(briefing) {
    let score = 0;
    const content = briefing.content || '';
    const wordCount = content.split(/\s+/).filter(word => word.length > 0).length;

    // Word count assessment
    if (wordCount >= this.qualityStandards.MINIMUM_WORD_COUNT) score += 15;
    if (wordCount <= this.qualityStandards.MAXIMUM_WORD_COUNT) score += 10;

    // Content depth assessment
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const avgSentenceLength = sentences.reduce((sum, s) => sum + s.trim().split(/\s+/).length, 0) / sentences.length;

    if (avgSentenceLength >= 10 && avgSentenceLength <= 25) score += 15; // Optimal sentence length
    if (sentences.length >= 20) score += 10; // Sufficient detail

    // Information density assessment
    const informationKeywords = ['analysis', 'assessment', 'intelligence', 'threat', 'development', 'implication'];
    const keywordDensity = informationKeywords.filter(keyword => 
      content.toLowerCase().includes(keyword)
    ).length / informationKeywords.length;

    score += Math.round(keywordDensity * 20);

    // Analytical language assessment
    const analyticalPhrases = ['indicates', 'suggests', 'assessment shows', 'analysis reveals', 'implications include'];
    const analyticalScore = analyticalPhrases.filter(phrase => 
      content.toLowerCase().includes(phrase)
    ).length;

    score += Math.min(analyticalScore * 5, 20);

    // Clarity and readability assessment
    const readabilityScore = this.assessReadability(content);
    score += Math.round(readabilityScore * 0.1);

    return Math.min(score, 100);
  }

  /**
   * Assess structural integrity of the briefing
   * @param {Object} briefing - Briefing object
   * @returns {number} Structural integrity score (0-100)
   */
  assessStructuralIntegrity(briefing) {
    let score = 0;

    // Section completeness
    const sections = briefing.sections || {};
    const sectionCount = Object.keys(sections).length;
    
    if (sectionCount >= this.qualityStandards.REQUIRED_SECTIONS) score += 25;
    else score += Math.round((sectionCount / this.qualityStandards.REQUIRED_SECTIONS) * 25);

    // Required sections presence
    const requiredSections = ['EXECUTIVE_SUMMARY', 'PRIORITY_DEVELOPMENTS', 'THREAT_ASSESSMENT'];
    const presentSections = requiredSections.filter(section => sections[section]);
    score += (presentSections.length / requiredSections.length) * 20;

    // Section balance assessment
    const sectionLengths = Object.values(sections).map(section => 
      (section.content ? JSON.stringify(section.content).length : 0)
    );
    const avgSectionLength = sectionLengths.reduce((sum, len) => sum + len, 0) / sectionLengths.length;
    const lengthVariance = sectionLengths.reduce((sum, len) => sum + Math.pow(len - avgSectionLength, 2), 0) / sectionLengths.length;
    const lengthBalance = Math.max(0, 100 - (lengthVariance / 1000));
    score += Math.round(lengthBalance * 0.15);

    // Metadata completeness
    const metadata = briefing.metadata || {};
    const requiredMetadata = ['generatedAt', 'briefingId', 'classification'];
    const presentMetadata = requiredMetadata.filter(field => metadata[field]);
    score += (presentMetadata.length / requiredMetadata.length) * 15;

    // Logical flow assessment
    if (this.assessLogicalFlow(sections)) score += 15;

    return Math.min(score, 100);
  }

  /**
   * Assess source credibility and diversity
   * @param {Object} briefing - Briefing object
   * @returns {number} Source credibility score (0-100)
   */
  assessSourceCredibility(briefing) {
    let score = 0;
    const sourceAnalysis = briefing.analysis?.sourceAnalysis || {};
    
    // Source count assessment
    const sourceCount = sourceAnalysis.totalSources || 0;
    if (sourceCount >= this.qualityStandards.MINIMUM_SOURCES) score += 20;
    else score += Math.round((sourceCount / this.qualityStandards.MINIMUM_SOURCES) * 20);

    // Average source credibility
    const avgCredibility = sourceAnalysis.averageCredibility || 70;
    score += Math.round((avgCredibility / 100) * 25);

    // Source diversity
    const sourceDiversity = sourceAnalysis.sourceDiversity || 0.5;
    score += Math.round(sourceDiversity * 20);

    // High-credibility source ratio
    const highCredibilityRatio = sourceAnalysis.highCredibilityRatio || 0.6;
    score += Math.round(highCredibilityRatio * 15);

    // Source freshness
    const sourceRecentRatio = sourceAnalysis.recentSourceRatio || 0.7;
    score += Math.round(sourceRecentRatio * 20);

    return Math.min(score, 100);
  }

  /**
   * Assess analytical depth and insight quality
   * @param {Object} briefing - Briefing object
   * @returns {number} Analytical depth score (0-100)
   */
  assessAnalyticalDepth(briefing) {
    let score = 0;
    const analysis = briefing.analysis || {};

    // Entity analysis depth
    const entities = analysis.entities || {};
    const entityTypes = Object.keys(entities).length;
    const totalEntities = Object.values(entities).reduce((sum, entityList) => sum + entityList.length, 0);
    
    if (totalEntities >= this.qualityStandards.ENTITY_DIVERSITY_THRESHOLD) score += 15;
    score += Math.min(entityTypes * 5, 15); // Bonus for entity type diversity

    // Pattern analysis presence
    if (analysis.patterns) score += 20;

    // Correlation analysis
    if (analysis.correlations) score += 15;

    // Strategic implications
    const sections = briefing.sections || {};
    if (sections.STRATEGIC_IMPLICATIONS) score += 15;

    // Recommendations quality
    if (sections.RECOMMENDATIONS) {
      const recommendations = sections.RECOMMENDATIONS.content || {};
      const recCount = (recommendations.immediate?.length || 0) + 
                      (recommendations.shortTerm?.length || 0) + 
                      (recommendations.strategic?.length || 0);
      score += Math.min(recCount * 2, 20);
    }

    // Threat assessment sophistication
    if (sections.THREAT_ASSESSMENT) {
      const threatAssessment = sections.THREAT_ASSESSMENT.content || {};
      if (threatAssessment.threatsByType) score += 10;
      if (threatAssessment.emergingThreats) score += 5;
    }

    return Math.min(score, 100);
  }

  /**
   * Assess timeliness and relevance
   * @param {Object} briefing - Briefing object
   * @returns {number} Timeliness score (0-100)
   */
  assessTimeliness(briefing) {
    let score = 0;
    const metadata = briefing.metadata || {};
    const generatedAt = new Date(metadata.generatedAt || Date.now());
    const now = new Date();

    // Generation recency
    const ageHours = (now - generatedAt) / (1000 * 60 * 60);
    if (ageHours <= 1) score += 30;
    else if (ageHours <= 6) score += 25;
    else if (ageHours <= 24) score += 15;
    else score += 5;

    // Signal recency analysis
    const signalAnalysis = briefing.analysis?.signalAnalysis || {};
    const recentSignalRatio = signalAnalysis.recentSignalRatio || 0.7;
    score += Math.round(recentSignalRatio * 25);

    // Breaking news responsiveness
    const prioritySignals = signalAnalysis.prioritySignalCount || 0;
    score += Math.min(prioritySignals * 3, 15);

    // Real-time indicators
    if (metadata.realTimeProcessing) score += 15;

    // Update frequency appropriateness
    if (metadata.updateFrequency === 'daily') score += 15;

    return Math.min(score, 100);
  }

  /**
   * Assess entity richness and diversity
   * @param {Object} briefing - Briefing object
   * @returns {number} Entity richness score (0-100)
   */
  assessEntityRichness(briefing) {
    let score = 0;
    const entities = briefing.analysis?.entities || {};

    // Entity type diversity
    const entityTypes = Object.keys(entities);
    score += Math.min(entityTypes.length * 15, 60);

    // Entity quantity per type
    Object.values(entities).forEach(entityList => {
      if (Array.isArray(entityList)) {
        score += Math.min(entityList.length * 2, 10);
      }
    });

    // Geographic diversity
    const countries = entities.countries || [];
    const uniqueRegions = new Set();
    // Simplified region mapping for assessment
    countries.forEach(country => {
      if (['USA', 'CANADA'].includes(country)) uniqueRegions.add('NORTH_AMERICA');
      else if (['CHINA', 'JAPAN', 'KOREA'].includes(country)) uniqueRegions.add('EAST_ASIA');
      else if (['RUSSIA', 'UKRAINE', 'GERMANY'].includes(country)) uniqueRegions.add('EUROPE');
      // Add more region mappings as needed
    });
    score += uniqueRegions.size * 5;

    return Math.min(score, 100);
  }

  /**
   * Assess overall confidence level
   * @param {Object} briefing - Briefing object
   * @returns {number} Confidence score (0-100)
   */
  assessConfidenceLevel(briefing) {
    const sections = briefing.sections || {};
    const confidenceValues = [];

    // Collect confidence values from sections
    Object.values(sections).forEach(section => {
      if (section.metadata?.confidence) {
        confidenceValues.push(section.metadata.confidence);
      }
    });

    if (confidenceValues.length === 0) return 50; // Default confidence

    const avgConfidence = confidenceValues.reduce((sum, conf) => sum + conf, 0) / confidenceValues.length;
    
    // Bonus for consistent confidence across sections
    const confidenceVariance = confidenceValues.reduce((sum, conf) => 
      sum + Math.pow(conf - avgConfidence, 2), 0) / confidenceValues.length;
    
    const consistencyBonus = Math.max(0, 10 - (confidenceVariance / 10));
    
    return Math.min(avgConfidence + consistencyBonus, 100);
  }

  /**
   * Calculate weighted overall score
   * @param {Object} categoryScores - Individual category scores
   * @returns {number} Overall weighted score (0-100)
   */
  calculateOverallScore(categoryScores) {
    let weightedSum = 0;
    let totalWeight = 0;

    Object.entries(this.scoringWeights).forEach(([category, weight]) => {
      if (categoryScores[category] !== undefined) {
        weightedSum += categoryScores[category] * weight;
        totalWeight += weight;
      }
    });

    return totalWeight > 0 ? Math.round(weightedSum / totalWeight) : 0;
  }

  /**
   * Generate quality indicators
   * @param {Object} briefing - Briefing object
   * @param {Object} categoryScores - Category scores
   * @returns {Object} Quality indicators
   */
  generateQualityIndicators(briefing, categoryScores) {
    const content = briefing.content || '';
    const wordCount = content.split(/\s+/).filter(word => word.length > 0).length;
    const sections = briefing.sections || {};

    return {
      wordCount,
      sectionCount: Object.keys(sections).length,
      averageSectionScore: Object.values(categoryScores).reduce((sum, score) => sum + score, 0) / Object.keys(categoryScores).length,
      readabilityLevel: this.assessReadability(content),
      informationDensity: this.calculateInformationDensity(content),
      analyticalDepthRating: this.rateAnalyticalDepth(categoryScores.analyticalDepth),
      sourceQualityRating: this.rateSourceQuality(categoryScores.sourceCredibility),
      timelinessRating: this.rateTimeliness(categoryScores.timeliness)
    };
  }

  /**
   * Generate quality improvement recommendations
   * @param {Object} categoryScores - Category scores
   * @returns {Array} Array of recommendations
   */
  generateQualityRecommendations(categoryScores) {
    const recommendations = [];

    if (categoryScores.contentQuality < 70) {
      recommendations.push('Enhance content depth with more detailed analysis and insights');
    }

    if (categoryScores.structuralIntegrity < 75) {
      recommendations.push('Improve briefing structure by ensuring all required sections are complete');
    }

    if (categoryScores.sourceCredibility < 70) {
      recommendations.push('Increase source diversity and utilize higher-credibility sources');
    }

    if (categoryScores.analyticalDepth < 65) {
      recommendations.push('Strengthen analytical depth with more comprehensive pattern analysis');
    }

    if (categoryScores.timeliness < 80) {
      recommendations.push('Improve signal freshness and reduce generation latency');
    }

    if (categoryScores.entityRichness < 60) {
      recommendations.push('Enhance entity extraction to increase geographic and organizational diversity');
    }

    if (categoryScores.confidence < 75) {
      recommendations.push('Improve confidence levels through better source validation and analysis');
    }

    return recommendations;
  }

  /**
   * Identify briefing strengths
   * @param {Object} categoryScores - Category scores
   * @returns {Array} Array of strengths
   */
  identifyStrengths(categoryScores) {
    const strengths = [];

    if (categoryScores.contentQuality >= 85) strengths.push('Excellent content quality and depth');
    if (categoryScores.structuralIntegrity >= 90) strengths.push('Well-structured and comprehensive');
    if (categoryScores.sourceCredibility >= 85) strengths.push('High-quality, credible sources');
    if (categoryScores.analyticalDepth >= 80) strengths.push('Strong analytical insights');
    if (categoryScores.timeliness >= 90) strengths.push('Highly timely and relevant');
    if (categoryScores.entityRichness >= 80) strengths.push('Rich entity diversity and coverage');
    if (categoryScores.confidence >= 85) strengths.push('High confidence and reliability');

    return strengths;
  }

  /**
   * Identify briefing weaknesses
   * @param {Object} categoryScores - Category scores
   * @returns {Array} Array of weaknesses
   */
  identifyWeaknesses(categoryScores) {
    const weaknesses = [];

    if (categoryScores.contentQuality < 60) weaknesses.push('Content lacks sufficient depth and detail');
    if (categoryScores.structuralIntegrity < 65) weaknesses.push('Structural issues and missing sections');
    if (categoryScores.sourceCredibility < 60) weaknesses.push('Limited or low-credibility sources');
    if (categoryScores.analyticalDepth < 55) weaknesses.push('Insufficient analytical depth');
    if (categoryScores.timeliness < 70) weaknesses.push('Timeliness concerns with outdated information');
    if (categoryScores.entityRichness < 50) weaknesses.push('Limited entity coverage and diversity');
    if (categoryScores.confidence < 65) weaknesses.push('Low confidence levels affecting reliability');

    return weaknesses;
  }

  /**
   * Assign quality grade based on overall score
   * @param {number} overallScore - Overall quality score
   * @returns {string} Quality grade
   */
  assignQualityGrade(overallScore) {
    if (overallScore >= 90) return 'A+ (Exceptional)';
    if (overallScore >= 85) return 'A (Excellent)';
    if (overallScore >= 80) return 'B+ (Very Good)';
    if (overallScore >= 75) return 'B (Good)';
    if (overallScore >= 70) return 'C+ (Fair)';
    if (overallScore >= 65) return 'C (Acceptable)';
    if (overallScore >= 60) return 'D+ (Below Average)';
    if (overallScore >= 55) return 'D (Poor)';
    return 'F (Inadequate)';
  }

  // Helper methods for quality assessment

  assessReadability(content) {
    // Simplified readability assessment
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const words = content.split(/\s+/).filter(w => w.length > 0);
    const avgWordsPerSentence = words.length / sentences.length;
    
    // Optimal range: 15-20 words per sentence
    if (avgWordsPerSentence >= 15 && avgWordsPerSentence <= 20) return 85;
    if (avgWordsPerSentence >= 10 && avgWordsPerSentence <= 25) return 75;
    return 60;
  }

  assessLogicalFlow(sections) {
    const expectedOrder = ['EXECUTIVE_SUMMARY', 'PRIORITY_DEVELOPMENTS', 'THREAT_ASSESSMENT', 'REGIONAL_ANALYSIS'];
    const actualOrder = Object.keys(sections);
    
    let orderScore = 0;
    expectedOrder.forEach((section, index) => {
      if (actualOrder.indexOf(section) === index) orderScore++;
    });
    
    return orderScore >= expectedOrder.length * 0.75;
  }

  calculateInformationDensity(content) {
    const words = content.split(/\s+/).filter(w => w.length > 0);
    const informationWords = words.filter(word => 
      word.length > 6 && /^[A-Z]/.test(word) // Simplified: long words starting with capital
    );
    return Math.round((informationWords.length / words.length) * 100);
  }

  rateAnalyticalDepth(score) {
    if (score >= 80) return 'Deep';
    if (score >= 65) return 'Moderate';
    if (score >= 50) return 'Basic';
    return 'Shallow';
  }

  rateSourceQuality(score) {
    if (score >= 85) return 'Premium';
    if (score >= 70) return 'Good';
    if (score >= 55) return 'Adequate';
    return 'Limited';
  }

  rateTimeliness(score) {
    if (score >= 85) return 'Real-time';
    if (score >= 70) return 'Current';
    if (score >= 55) return 'Recent';
    return 'Outdated';
  }
}

// Export singleton instance
export const briefingQualityAssessor = new BriefingQualityAssessor();