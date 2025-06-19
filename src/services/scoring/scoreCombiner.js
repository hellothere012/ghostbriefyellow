// Score Combination Module for Ghost Brief
// Final intelligence score calculation and priority classification

/**
 * Score Combiner Service
 * Combines all scoring factors into final intelligence assessment
 */
export class ScoreCombinerService {
  constructor() {
    // Primary factor weights for final score calculation
    this.primaryWeights = {
      keywordRelevance: 0.30,      // Intelligence keyword density and importance
      entitySignificance: 0.25,    // Geopolitical entity importance and relationships
      sourceCredibility: 0.20,     // Source reliability and track record
      temporalRelevance: 0.10,     // Time-sensitive intelligence value
      geopoliticalContext: 0.08,   // Regional/global context significance
      threatAssessment: 0.07       // Direct threat level indicators
    };

    // Secondary factor weights for nuanced scoring
    this.secondaryWeights = {
      contentDepth: 0.15,          // Article depth and detail level
      linguisticIndicators: 0.20,  // Language patterns indicating intelligence value
      crossReference: 0.25,        // Corroboration with other sources
      operationalRelevance: 0.25,  // Immediate operational implications
      strategicImportance: 0.15    // Long-term strategic significance
    };

    // Context adjustment factors
    this.contextWeights = {
      primary: 0.7,               // Primary factors contribution
      secondary: 0.3              // Secondary factors contribution
    };

    // Priority classification thresholds
    this.priorityThresholds = {
      CRITICAL: { min: 85, confidence: 95 },
      HIGH: { min: 70, confidence: 85 },
      MEDIUM: { min: 50, confidence: 75 },
      LOW: { min: 0, confidence: 60 }
    };

    // Confidence calculation factors
    this.confidenceFactors = {
      scoreConsistency: 0.4,      // How consistent scores are across factors
      sourceReliability: 0.3,     // Source credibility contribution
      entityConfidence: 0.2,      // Entity detection confidence
      temporalFactor: 0.1         // Time-based confidence adjustment
    };

    // Quality assurance thresholds
    this.qualityThresholds = {
      minimumScore: 15,           // Minimum viable intelligence score
      maximumVariance: 30,        // Maximum acceptable score variance
      confidenceFloor: 30,        // Minimum confidence level
      confidenceCeiling: 95       // Maximum confidence level
    };
  }

  /**
   * Combine all scoring factors into final intelligence assessment
   * @param {Object} factors - All scoring factors from different modules
   * @returns {Object} Final combined score and assessment
   */
  combineFactorsWithWeights(factors) {
    console.log('🔄 Combining multi-factor intelligence scores...');

    // Validate input factors
    const validationResult = this.validateInputFactors(factors);
    if (!validationResult.isValid) {
      console.warn('⚠️ Invalid input factors detected:', validationResult.issues);
    }

    // Calculate primary factor score
    const primaryScore = this.calculatePrimaryScore(factors);
    
    // Calculate secondary factor score
    const secondaryScore = this.calculateSecondaryScore(factors);
    
    // Combine primary and secondary scores
    const combinedScore = this.calculateCombinedScore(primaryScore, secondaryScore);
    
    // Apply context adjustments
    const contextAdjustedScore = this.applyContextAdjustments(combinedScore, factors);
    
    // Calculate confidence level
    const confidence = this.calculateConfidenceLevel(factors, contextAdjustedScore);
    
    // Determine priority classification
    const priority = this.classifyPriority(contextAdjustedScore.overall, factors.threat, factors.geopolitical, confidence);
    
    // Generate quality metrics
    const qualityMetrics = this.generateQualityMetrics(factors, contextAdjustedScore, confidence);

    const finalAssessment = {
      overall: Math.min(Math.max(contextAdjustedScore.overall, 0), 100),
      primary: primaryScore.composite,
      secondary: secondaryScore.composite,
      contextAdjusted: contextAdjustedScore.overall,
      confidence: Math.round(confidence),
      priority: priority.priority,
      priorityConfidence: priority.confidence,
      breakdown: {
        primaryContribution: primaryScore.composite * this.contextWeights.primary,
        secondaryContribution: secondaryScore.composite * this.contextWeights.secondary,
        contextMultiplier: factors.context?.combinedAdjustment || 1.0,
        finalScore: contextAdjustedScore.overall
      },
      factorDetails: {
        primary: primaryScore.details,
        secondary: secondaryScore.details,
        confidence: confidence,
        quality: qualityMetrics
      },
      assessment: {
        isHighQuality: qualityMetrics.overallQuality >= 75,
        isActionable: contextAdjustedScore.overall >= 60 && confidence >= 70,
        requiresEscalation: priority.priority === 'CRITICAL' || priority.priority === 'HIGH',
        recommendedAction: this.generateActionRecommendation(priority.priority, contextAdjustedScore.overall, confidence)
      }
    };

    console.log(`✅ Score combination complete: ${Math.round(finalAssessment.overall)}/100 (${finalAssessment.priority}, ${Math.round(finalAssessment.confidence)}% confidence)`);
    return finalAssessment;
  }

  /**
   * Validate input factors for completeness and consistency
   * @param {Object} factors - Input factors to validate
   * @returns {Object} Validation result
   */
  validateInputFactors(factors) {
    const issues = [];
    const requiredFactors = ['primary', 'secondary', 'source', 'temporal', 'threat', 'geopolitical'];
    
    requiredFactors.forEach(factor => {
      if (!factors[factor]) {
        issues.push(`Missing required factor: ${factor}`);
      }
    });

    // Check for reasonable score ranges
    if (factors.primary && (factors.primary.keywords < 0 || factors.primary.keywords > 100)) {
      issues.push('Primary keyword score out of range');
    }

    if (factors.source && (factors.source.score < 0 || factors.source.score > 100)) {
      issues.push('Source credibility score out of range');
    }

    return {
      isValid: issues.length === 0,
      issues
    };
  }

  /**
   * Calculate primary factor composite score
   * @param {Object} factors - All factors
   * @returns {Object} Primary score analysis
   */
  calculatePrimaryScore(factors) {
    const { primary, source, temporal, geopolitical, threat } = factors;
    
    const scores = {
      keywords: primary?.keywords || 0,
      entities: primary?.entities || 0,
      source: source?.score || 70,
      temporal: temporal?.score || 50,
      geopolitical: geopolitical?.score || 0,
      threat: threat?.score || 0
    };

    const weightedScore = 
      (scores.keywords * this.primaryWeights.keywordRelevance) +
      (scores.entities * this.primaryWeights.entitySignificance) +
      (scores.source * this.primaryWeights.sourceCredibility) +
      (scores.temporal * this.primaryWeights.temporalRelevance) +
      (scores.geopolitical * this.primaryWeights.geopoliticalContext) +
      (scores.threat * this.primaryWeights.threatAssessment);

    return {
      composite: Math.min(weightedScore, 100),
      details: {
        keywordContribution: scores.keywords * this.primaryWeights.keywordRelevance,
        entityContribution: scores.entities * this.primaryWeights.entitySignificance,
        sourceContribution: scores.source * this.primaryWeights.sourceCredibility,
        temporalContribution: scores.temporal * this.primaryWeights.temporalRelevance,
        geopoliticalContribution: scores.geopolitical * this.primaryWeights.geopoliticalContext,
        threatContribution: scores.threat * this.primaryWeights.threatAssessment
      },
      rawScores: scores
    };
  }

  /**
   * Calculate secondary factor composite score
   * @param {Object} factors - All factors
   * @returns {Object} Secondary score analysis
   */
  calculateSecondaryScore(factors) {
    const { secondary } = factors;
    
    const scores = {
      contentDepth: secondary?.contentDepth || 50,
      linguisticIndicators: secondary?.linguisticIndicators || 50,
      crossReference: secondary?.crossReference || 50,
      operationalRelevance: secondary?.operationalRelevance || 30,
      strategicImportance: secondary?.strategicImportance || 30
    };

    const weightedScore = 
      (scores.contentDepth * this.secondaryWeights.contentDepth) +
      (scores.linguisticIndicators * this.secondaryWeights.linguisticIndicators) +
      (scores.crossReference * this.secondaryWeights.crossReference) +
      (scores.operationalRelevance * this.secondaryWeights.operationalRelevance) +
      (scores.strategicImportance * this.secondaryWeights.strategicImportance);

    return {
      composite: Math.min(weightedScore, 100),
      details: {
        contentDepthContribution: scores.contentDepth * this.secondaryWeights.contentDepth,
        linguisticContribution: scores.linguisticIndicators * this.secondaryWeights.linguisticIndicators,
        crossReferenceContribution: scores.crossReference * this.secondaryWeights.crossReference,
        operationalContribution: scores.operationalRelevance * this.secondaryWeights.operationalRelevance,
        strategicContribution: scores.strategicImportance * this.secondaryWeights.strategicImportance
      },
      rawScores: scores
    };
  }

  /**
   * Calculate combined score from primary and secondary factors
   * @param {Object} primaryScore - Primary score analysis
   * @param {Object} secondaryScore - Secondary score analysis
   * @returns {Object} Combined score
   */
  calculateCombinedScore(primaryScore, secondaryScore) {
    const combined = 
      (primaryScore.composite * this.contextWeights.primary) +
      (secondaryScore.composite * this.contextWeights.secondary);

    return {
      score: combined,
      primaryWeight: this.contextWeights.primary,
      secondaryWeight: this.contextWeights.secondary,
      primaryContribution: primaryScore.composite * this.contextWeights.primary,
      secondaryContribution: secondaryScore.composite * this.contextWeights.secondary
    };
  }

  /**
   * Apply context adjustments to combined score
   * @param {Object} combinedScore - Combined score
   * @param {Object} factors - All factors
   * @returns {Object} Context-adjusted score
   */
  applyContextAdjustments(combinedScore, factors) {
    const contextAdjustment = factors.context?.combinedAdjustment || 1.0;
    const adjustedScore = combinedScore.score * contextAdjustment;

    return {
      overall: Math.min(Math.max(adjustedScore, 0), 100),
      beforeAdjustment: combinedScore.score,
      adjustmentFactor: contextAdjustment,
      adjustmentApplied: Math.abs(contextAdjustment - 1.0) > 0.01
    };
  }

  /**
   * Calculate confidence level based on score consistency and reliability
   * @param {Object} factors - All scoring factors
   * @param {Object} finalScore - Final score calculation
   * @returns {number} Confidence level (0-100)
   */
  calculateConfidenceLevel(factors, finalScore) {
    // Collect all major scores for consistency analysis
    const majorScores = [
      factors.primary?.keywords || 50,
      factors.primary?.entities || 50,
      factors.source?.score || 70,
      factors.temporal?.score || 50
    ];

    // Calculate score consistency (lower variance = higher confidence)
    const mean = majorScores.reduce((sum, score) => sum + score, 0) / majorScores.length;
    const variance = majorScores.reduce((sum, score) => sum + Math.pow(score - mean, 2), 0) / majorScores.length;
    const standardDeviation = Math.sqrt(variance);
    
    // Convert to consistency score (0-100)
    const consistencyScore = Math.max(0, 100 - (standardDeviation * 2));
    
    // Source reliability factor
    const sourceReliability = factors.source?.score || 70;
    
    // Entity confidence (based on detection quality)
    const entityConfidence = factors.primary?.entities ? 
      Math.min(factors.primary.entities + 20, 100) : 70;
    
    // Temporal factor (more recent = higher confidence)
    const temporalConfidence = factors.temporal?.score || 50;
    
    // Weighted confidence calculation
    const confidence = 
      (consistencyScore * this.confidenceFactors.scoreConsistency) +
      (sourceReliability * this.confidenceFactors.sourceReliability) +
      (entityConfidence * this.confidenceFactors.entityConfidence) +
      (temporalConfidence * this.confidenceFactors.temporalFactor);

    // Apply quality thresholds
    return Math.min(Math.max(confidence, this.qualityThresholds.confidenceFloor), this.qualityThresholds.confidenceCeiling);
  }

  /**
   * Classify priority based on score, threat level, and confidence
   * @param {number} overallScore - Overall intelligence score
   * @param {Object} threatAssessment - Threat assessment results
   * @param {Object} geopoliticalScore - Geopolitical score results
   * @param {number} confidence - Confidence level
   * @returns {Object} Priority classification
   */
  classifyPriority(overallScore, threatAssessment, geopoliticalScore, confidence) {
    let priority = 'LOW';
    let priorityConfidence = this.priorityThresholds.LOW.confidence;
    let reasoning = [];

    // Primary classification based on overall score
    for (const [level, thresholds] of Object.entries(this.priorityThresholds)) {
      if (overallScore >= thresholds.min) {
        priority = level;
        priorityConfidence = thresholds.confidence;
        reasoning.push(`Score: ${Math.round(overallScore)}`);
        break;
      }
    }

    // Threat assessment can elevate priority
    if (threatAssessment?.level === 'CRITICAL' && priority !== 'CRITICAL') {
      priority = 'CRITICAL';
      priorityConfidence = Math.max(priorityConfidence, 90);
      reasoning.push('Critical threat level');
    } else if (threatAssessment?.level === 'HIGH' && priority === 'LOW') {
      priority = 'MEDIUM';
      priorityConfidence = Math.max(priorityConfidence, 80);
      reasoning.push('High threat level');
    }

    // Geopolitical relationships can influence priority
    const geopoliticalRelationships = geopoliticalScore?.relationships?.length || 0;
    if (geopoliticalRelationships >= 2 && priority === 'LOW') {
      priority = 'MEDIUM';
      priorityConfidence = Math.max(priorityConfidence, 75);
      reasoning.push(`${geopoliticalRelationships} geopolitical relationships`);
    }

    // Confidence level affects priority confidence
    const confidenceAdjustment = confidence > 80 ? 5 : confidence < 60 ? -10 : 0;
    priorityConfidence = Math.min(Math.max(priorityConfidence + confidenceAdjustment, 30), 95);

    return {
      priority,
      confidence: priorityConfidence,
      reasoning: reasoning.join(', '),
      factors: {
        scoreBasedPriority: this.getScoreBasedPriority(overallScore),
        threatElevation: threatAssessment?.level || 'NONE',
        geopoliticalInfluence: geopoliticalRelationships,
        confidenceAdjustment
      }
    };
  }

  /**
   * Get priority based purely on score
   * @param {number} score - Intelligence score
   * @returns {string} Score-based priority
   */
  getScoreBasedPriority(score) {
    if (score >= this.priorityThresholds.CRITICAL.min) return 'CRITICAL';
    if (score >= this.priorityThresholds.HIGH.min) return 'HIGH';
    if (score >= this.priorityThresholds.MEDIUM.min) return 'MEDIUM';
    return 'LOW';
  }

  /**
   * Generate quality metrics for the scoring process
   * @param {Object} factors - All factors
   * @param {Object} finalScore - Final score
   * @param {number} confidence - Confidence level
   * @returns {Object} Quality metrics
   */
  generateQualityMetrics(factors, finalScore, confidence) {
    const metrics = {
      scoreStability: this.calculateScoreStability(factors),
      factorCompleteness: this.calculateFactorCompleteness(factors),
      dataQuality: this.assessDataQuality(factors),
      overallQuality: 0
    };

    // Calculate overall quality
    metrics.overallQuality = (metrics.scoreStability + metrics.factorCompleteness + metrics.dataQuality) / 3;

    return {
      ...metrics,
      qualityLevel: this.categorizeQuality(metrics.overallQuality),
      passesQualityThreshold: metrics.overallQuality >= 70,
      recommendations: this.generateQualityRecommendations(metrics)
    };
  }

  /**
   * Calculate score stability across factors
   * @param {Object} factors - All factors
   * @returns {number} Stability score
   */
  calculateScoreStability(factors) {
    const scores = [
      factors.primary?.keywords || 50,
      factors.primary?.entities || 50,
      factors.source?.score || 70,
      factors.temporal?.score || 50
    ];

    const mean = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    const variance = scores.reduce((sum, score) => sum + Math.pow(score - mean, 2), 0) / scores.length;
    
    // Lower variance = higher stability
    return Math.max(0, 100 - Math.sqrt(variance));
  }

  /**
   * Calculate factor completeness
   * @param {Object} factors - All factors
   * @returns {number} Completeness score
   */
  calculateFactorCompleteness(factors) {
    const expectedFactors = ['primary', 'secondary', 'source', 'temporal', 'threat', 'geopolitical'];
    const presentFactors = expectedFactors.filter(factor => factors[factor]).length;
    
    return (presentFactors / expectedFactors.length) * 100;
  }

  /**
   * Assess data quality
   * @param {Object} factors - All factors
   * @returns {number} Data quality score
   */
  assessDataQuality(factors) {
    let qualityScore = 70; // Base quality
    
    // Source quality bonus
    if (factors.source?.score >= 85) qualityScore += 15;
    else if (factors.source?.score < 60) qualityScore -= 15;
    
    // Entity detection quality
    if (factors.primary?.entityDetails?.factors?.length > 0) qualityScore += 10;
    
    // Threat assessment quality
    if (factors.threat?.confidence >= 80) qualityScore += 10;
    else if (factors.threat?.confidence < 60) qualityScore -= 10;
    
    return Math.min(Math.max(qualityScore, 0), 100);
  }

  /**
   * Categorize overall quality
   * @param {number} qualityScore - Quality score
   * @returns {string} Quality category
   */
  categorizeQuality(qualityScore) {
    if (qualityScore >= 85) return 'EXCELLENT';
    if (qualityScore >= 75) return 'GOOD';
    if (qualityScore >= 60) return 'ACCEPTABLE';
    return 'POOR';
  }

  /**
   * Generate quality improvement recommendations
   * @param {Object} metrics - Quality metrics
   * @returns {Array} Recommendations
   */
  generateQualityRecommendations(metrics) {
    const recommendations = [];
    
    if (metrics.scoreStability < 70) {
      recommendations.push('Improve score consistency across factors');
    }
    
    if (metrics.factorCompleteness < 90) {
      recommendations.push('Ensure all scoring factors are present');
    }
    
    if (metrics.dataQuality < 70) {
      recommendations.push('Verify data quality and source reliability');
    }
    
    return recommendations;
  }

  /**
   * Generate action recommendation based on priority and confidence
   * @param {string} priority - Priority level
   * @param {number} score - Overall score
   * @param {number} confidence - Confidence level
   * @returns {string} Action recommendation
   */
  generateActionRecommendation(priority, score, confidence) {
    if (priority === 'CRITICAL' && confidence >= 80) {
      return 'IMMEDIATE_ACTION_REQUIRED';
    } else if (priority === 'HIGH' && confidence >= 70) {
      return 'ESCALATE_TO_LEADERSHIP';
    } else if (priority === 'MEDIUM' && confidence >= 60) {
      return 'MONITOR_AND_BRIEF';
    } else if (confidence < 60) {
      return 'VERIFY_WITH_ADDITIONAL_SOURCES';
    } else {
      return 'STANDARD_PROCESSING';
    }
  }
}

// Export singleton instance
export const scoreCombinerService = new ScoreCombinerService();