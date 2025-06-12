// Signal Quality Filtering Pipeline for Ghost Brief
// Professional intelligence signal filtering and quality assurance
// NOTE: This service has been modularized - individual modules are in src/services/quality/

// Import modular quality services
import { contentAnalyzerService } from './quality/contentAnalyzer.js';
import { sourceVerifierService } from './quality/sourceVerifier.js';
import { duplicateDetectorService } from './quality/duplicateDetector.js';

/**
 * Signal Quality Filtering Service
 * Orchestrates modular quality components for comprehensive signal filtering
 * 
 * COMPATIBILITY LAYER: This service maintains the original API while using
 * modular components for improved maintainability and testability.
 */
export class SignalQualityFilterService {
  constructor() {
    // Quality filtering criteria with professional intelligence standards
    this.qualityThresholds = {
      MINIMUM_RELEVANCE: 40,
      MINIMUM_CONFIDENCE: 60,
      MINIMUM_SOURCE_CREDIBILITY: 50,
      MAXIMUM_AGE_HOURS: 168, // 7 days
      MINIMUM_CONTENT_LENGTH: 100,
      MAXIMUM_DUPLICATE_SIMILARITY: 0.85
    };

    // Signal quality dimensions
    this.qualityDimensions = {
      CONTENT_QUALITY: {
        weight: 0.25,
        factors: ['depth', 'specificity', 'sources', 'verification']
      },
      SOURCE_RELIABILITY: {
        weight: 0.20,
        factors: ['credibility', 'track_record', 'bias_assessment', 'independence']
      },
      INTELLIGENCE_VALUE: {
        weight: 0.25,
        factors: ['relevance', 'actionability', 'novelty', 'strategic_importance']
      },
      TEMPORAL_RELEVANCE: {
        weight: 0.15,
        factors: ['recency', 'time_sensitivity', 'event_horizon']
      },
      TECHNICAL_ACCURACY: {
        weight: 0.15,
        factors: ['factual_accuracy', 'technical_detail', 'consistency', 'verifiability']
      }
    };

    // Content quality indicators
    this.contentIndicators = {
      HIGH_QUALITY: [
        'according to', 'confirmed by', 'verified', 'official statement',
        'intelligence sources', 'classified document', 'leaked', 'exclusive',
        'first reported', 'investigation reveals', 'analysis shows'
      ],
      MEDIUM_QUALITY: [
        'reported', 'sources say', 'officials indicate', 'appears to',
        'analysis suggests', 'evidence indicates', 'documents show'
      ],
      LOW_QUALITY: [
        'rumored', 'alleged', 'speculation', 'unconfirmed', 'claims',
        'reportedly', 'possibly', 'might', 'could be', 'appears'
      ],
      DISQUALIFYING: [
        'sponsored', 'advertisement', 'promotional', 'buy now',
        'click here', 'subscribe', 'offer', 'deal', 'discount'
      ]
    };

    // Source reliability matrix
    this.sourceReliability = {
      TIER_1_PREMIUM: {
        credibilityScore: 95,
        domains: ['reuters.com', 'bbc.com', 'apnews.com', 'defensenews.com'],
        characteristics: ['established_reputation', 'fact_checking', 'editorial_standards']
      },
      TIER_2_RELIABLE: {
        credibilityScore: 85,
        domains: ['cnn.com', 'bloomberg.com', 'wsj.com', 'ft.com'],
        characteristics: ['professional_standards', 'verification_process']
      },
      TIER_3_STANDARD: {
        credibilityScore: 70,
        domains: ['general_news_outlets'],
        characteristics: ['basic_editorial_standards']
      },
      TIER_4_QUESTIONABLE: {
        credibilityScore: 40,
        domains: ['unknown_sources', 'blogs', 'social_media'],
        characteristics: ['limited_verification', 'potential_bias']
      }
    };

    // Filtering pipeline stages
    this.pipelineStages = [
      'INITIAL_SCREENING',
      'CONTENT_ANALYSIS',
      'SOURCE_VERIFICATION',
      'DUPLICATE_DETECTION',
      'QUALITY_SCORING',
      'INTELLIGENCE_ASSESSMENT',
      'FINAL_VALIDATION'
    ];

    // Quality metrics
    this.qualityMetrics = {
      CONTENT_DEPTH: 'Assess information detail and specificity',
      SOURCE_ATTRIBUTION: 'Evaluate source citation and credibility',
      FACTUAL_CONSISTENCY: 'Check for internal consistency and accuracy',
      INTELLIGENCE_NOVELTY: 'Assess new information value',
      OPERATIONAL_RELEVANCE: 'Evaluate actionable intelligence potential',
      STRATEGIC_IMPORTANCE: 'Assess long-term significance'
    };
  }

  /**
   * Process signals through comprehensive quality filtering pipeline
   * @param {Array} signals - Raw signals to filter
   * @param {Object} options - Filtering options
   * @returns {Object} Filtered signals with quality analysis
   */
  async processSignalsPipeline(signals, options = {}) {
    console.log(`🔍 Starting signal quality filtering pipeline for ${signals.length} signals...`);

    const pipelineResults = {
      input: signals.length,
      stages: {},
      output: [],
      qualityReport: {},
      rejectedSignals: [],
      processingMetadata: {
        startTime: new Date().toISOString(),
        pipeline: 'signal-quality-v2.0',
        thresholds: this.qualityThresholds
      }
    };

    let currentSignals = [...signals];

    // Stage 1: Initial Screening
    console.log(`📋 Stage 1: Initial screening of ${currentSignals.length} signals...`);
    const screeningResults = await this.initialScreening(currentSignals);
    currentSignals = screeningResults.passed;
    pipelineResults.stages.INITIAL_SCREENING = {
      input: screeningResults.input,
      passed: screeningResults.passed.length,
      rejected: screeningResults.rejected.length,
      rejectionReasons: screeningResults.rejectionReasons
    };

    // Stage 2: Content Analysis (using modular service)
    console.log(`📝 Stage 2: Content analysis of ${currentSignals.length} signals...`);
    const contentResults = await contentAnalyzerService.contentAnalysis(currentSignals);
    currentSignals = contentResults.passed;
    pipelineResults.stages.CONTENT_ANALYSIS = {
      input: contentResults.input,
      passed: contentResults.passed.length,
      rejected: contentResults.rejected.length,
      qualityScores: contentResults.qualityScores
    };

    // Stage 3: Source Verification (using modular service)
    console.log(`🔍 Stage 3: Source verification of ${currentSignals.length} signals...`);
    const sourceResults = await sourceVerifierService.sourceVerification(currentSignals);
    currentSignals = sourceResults.passed;
    pipelineResults.stages.SOURCE_VERIFICATION = {
      input: sourceResults.input,
      passed: sourceResults.passed.length,
      rejected: sourceResults.rejected.length,
      sourceAnalysis: sourceResults.sourceAnalysis
    };

    // Stage 4: Duplicate Detection (using modular service)
    console.log(`🔗 Stage 4: Duplicate detection of ${currentSignals.length} signals...`);
    const duplicateResults = await duplicateDetectorService.advancedDuplicateDetection(currentSignals);
    currentSignals = duplicateResults.passed;
    pipelineResults.stages.DUPLICATE_DETECTION = {
      input: duplicateResults.input,
      passed: duplicateResults.passed.length,
      rejected: duplicateResults.rejected.length,
      duplicatePairs: duplicateResults.duplicatePairs
    };

    // Stage 5: Quality Scoring
    console.log(`📊 Stage 5: Quality scoring of ${currentSignals.length} signals...`);
    const qualityResults = await this.comprehensiveQualityScoring(currentSignals);
    currentSignals = qualityResults.passed;
    pipelineResults.stages.QUALITY_SCORING = {
      input: qualityResults.input,
      passed: qualityResults.passed.length,
      rejected: qualityResults.rejected.length,
      averageQuality: qualityResults.averageQuality
    };

    // Stage 6: Intelligence Assessment
    console.log(`🎯 Stage 6: Intelligence assessment of ${currentSignals.length} signals...`);
    const intelligenceResults = await this.intelligenceAssessment(currentSignals);
    currentSignals = intelligenceResults.passed;
    pipelineResults.stages.INTELLIGENCE_ASSESSMENT = {
      input: intelligenceResults.input,
      passed: intelligenceResults.passed.length,
      rejected: intelligenceResults.rejected.length,
      intelligenceValue: intelligenceResults.intelligenceValue
    };

    // Stage 7: Final Validation
    console.log(`✅ Stage 7: Final validation of ${currentSignals.length} signals...`);
    const validationResults = await this.finalValidation(currentSignals);
    pipelineResults.output = validationResults.validated;
    pipelineResults.stages.FINAL_VALIDATION = {
      input: validationResults.input,
      validated: validationResults.validated.length,
      finalQuality: validationResults.finalQuality
    };

    // Generate comprehensive quality report
    pipelineResults.qualityReport = this.generateQualityReport(pipelineResults);
    pipelineResults.processingMetadata.endTime = new Date().toISOString();
    pipelineResults.processingMetadata.totalProcessingTime = Date.now() - new Date(pipelineResults.processingMetadata.startTime).getTime();

    console.log(`🏁 Signal quality filtering complete: ${pipelineResults.input} → ${pipelineResults.output.length} signals (${Math.round(pipelineResults.output.length / pipelineResults.input * 100)}% pass rate)`);

    return pipelineResults;
  }

  /**
   * Initial screening stage - basic quality checks
   * @param {Array} signals - Signals to screen
   * @returns {Object} Screening results
   */
  async initialScreening(signals) {
    const passed = [];
    const rejected = [];
    const rejectionReasons = {};

    for (const signal of signals) {
      const rejectionReason = this.checkBasicQuality(signal);
      
      if (!rejectionReason) {
        passed.push(signal);
      } else {
        rejected.push(signal);
        rejectionReasons[signal.id] = rejectionReason;
      }
    }

    return {
      input: signals.length,
      passed,
      rejected,
      rejectionReasons
    };
  }

  /**
   * Check basic quality requirements
   * @param {Object} signal - Signal to check
   * @returns {string|null} Rejection reason or null if passed
   */
  checkBasicQuality(signal) {
    // Check minimum content length
    const content = (signal.title || '') + ' ' + (signal.content || signal.summary || '');
    if (content.length < this.qualityThresholds.MINIMUM_CONTENT_LENGTH) {
      return 'Insufficient content length';
    }

    // Check for advertisement indicators
    if (this.isAdvertisement(signal)) {
      return 'Advertisement detected';
    }

    // Check for minimum relevance score
    if (signal.intelligence && signal.intelligence.relevanceScore < this.qualityThresholds.MINIMUM_RELEVANCE) {
      return 'Below minimum relevance threshold';
    }

    // Check age threshold
    const ageHours = this.calculateAgeHours(signal);
    if (ageHours > this.qualityThresholds.MAXIMUM_AGE_HOURS) {
      return 'Content too old';
    }

    // Check for required fields
    if (!signal.title || !signal.url) {
      return 'Missing required fields';
    }

    return null; // Passed all basic checks
  }

  /**
   * Content analysis stage - assess content quality
   * @param {Array} signals - Signals to analyze
   * @returns {Object} Content analysis results
   */
  async contentAnalysis(signals) {
    const passed = [];
    const rejected = [];
    const qualityScores = {};

    for (const signal of signals) {
      const contentQuality = this.assessContentQuality(signal);
      qualityScores[signal.id] = contentQuality;

      if (contentQuality.overallScore >= 60) {
        // Add quality metadata to signal
        signal.qualityAnalysis = {
          contentQuality: contentQuality.overallScore,
          indicators: contentQuality.indicators,
          factors: contentQuality.factors
        };
        passed.push(signal);
      } else {
        rejected.push(signal);
      }
    }

    return {
      input: signals.length,
      passed,
      rejected,
      qualityScores
    };
  }

  /**
   * Assess content quality using multiple indicators
   * @param {Object} signal - Signal to assess
   * @returns {Object} Content quality assessment
   */
  assessContentQuality(signal) {
    const content = (signal.title || '') + ' ' + (signal.content || signal.summary || '');
    const contentLower = content.toLowerCase();

    let qualityScore = 50; // Base score
    const indicators = [];
    const factors = {};

    // High quality indicators
    this.contentIndicators.HIGH_QUALITY.forEach(indicator => {
      if (contentLower.includes(indicator)) {
        qualityScore += 10;
        indicators.push({ type: 'HIGH_QUALITY', indicator, bonus: 10 });
      }
    });

    // Medium quality indicators
    this.contentIndicators.MEDIUM_QUALITY.forEach(indicator => {
      if (contentLower.includes(indicator)) {
        qualityScore += 5;
        indicators.push({ type: 'MEDIUM_QUALITY', indicator, bonus: 5 });
      }
    });

    // Low quality indicators (penalties)
    this.contentIndicators.LOW_QUALITY.forEach(indicator => {
      if (contentLower.includes(indicator)) {
        qualityScore -= 8;
        indicators.push({ type: 'LOW_QUALITY', indicator, penalty: -8 });
      }
    });

    // Disqualifying indicators (major penalties)
    this.contentIndicators.DISQUALIFYING.forEach(indicator => {
      if (contentLower.includes(indicator)) {
        qualityScore -= 20;
        indicators.push({ type: 'DISQUALIFYING', indicator, penalty: -20 });
      }
    });

    // Content depth factors
    const wordCount = content.split(/\s+/).length;
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
    const hasNumbers = /\d/.test(content);
    const hasQuotes = /"[^"]*"/.test(content);

    factors.wordCount = wordCount;
    factors.sentences = sentences;
    factors.hasNumbers = hasNumbers;
    factors.hasQuotes = hasQuotes;

    // Bonus for depth
    if (wordCount > 500) qualityScore += 10;
    else if (wordCount > 300) qualityScore += 5;
    
    if (sentences > 10) qualityScore += 5;
    if (hasNumbers) qualityScore += 5;
    if (hasQuotes) qualityScore += 5;

    return {
      overallScore: Math.max(Math.min(qualityScore, 100), 0),
      indicators,
      factors,
      assessment: this.categorizeContentQuality(qualityScore)
    };
  }

  /**
   * Categorize content quality score
   * @param {number} score - Quality score
   * @returns {string} Quality category
   */
  categorizeContentQuality(score) {
    if (score >= 85) return 'EXCELLENT';
    if (score >= 75) return 'HIGH';
    if (score >= 60) return 'GOOD';
    if (score >= 45) return 'FAIR';
    return 'POOR';
  }

  /**
   * Source verification stage
   * @param {Array} signals - Signals to verify
   * @returns {Object} Source verification results
   */
  async sourceVerification(signals) {
    const passed = [];
    const rejected = [];
    const sourceAnalysis = {};

    for (const signal of signals) {
      const sourceAssessment = this.assessSourceReliability(signal);
      sourceAnalysis[signal.id] = sourceAssessment;

      if (sourceAssessment.credibilityScore >= this.qualityThresholds.MINIMUM_SOURCE_CREDIBILITY) {
        // Add source metadata to signal
        signal.sourceVerification = {
          credibilityScore: sourceAssessment.credibilityScore,
          tier: sourceAssessment.tier,
          reliability: sourceAssessment.reliability,
          verificationStatus: 'VERIFIED'
        };
        passed.push(signal);
      } else {
        rejected.push(signal);
      }
    }

    return {
      input: signals.length,
      passed,
      rejected,
      sourceAnalysis
    };
  }

  /**
   * Assess source reliability and credibility
   * @param {Object} signal - Signal to assess
   * @returns {Object} Source assessment
   */
  assessSourceReliability(signal) {
    const domain = signal.source?.domain || '';
    const sourceName = signal.source?.feedName || '';
    const providedScore = signal.source?.credibilityScore || 50;

    // Find source tier
    let tier = 'TIER_4_QUESTIONABLE';
    let baseScore = 40;

    Object.entries(this.sourceReliability).forEach(([tierName, tierData]) => {
      if (tierData.domains.some(sourceDomain => 
        domain.includes(sourceDomain) || sourceName.toLowerCase().includes(sourceDomain)
      )) {
        tier = tierName;
        baseScore = tierData.credibilityScore;
      }
    });

    // Combine scores with weighting
    const finalScore = Math.round((providedScore * 0.4) + (baseScore * 0.6));

    return {
      credibilityScore: finalScore,
      tier,
      baseScore,
      providedScore,
      reliability: this.categorizeReliability(finalScore),
      domain,
      sourceName
    };
  }

  /**
   * Categorize source reliability
   * @param {number} score - Credibility score
   * @returns {string} Reliability category
   */
  categorizeReliability(score) {
    if (score >= 90) return 'HIGHLY_RELIABLE';
    if (score >= 80) return 'RELIABLE';
    if (score >= 70) return 'MODERATELY_RELIABLE';
    if (score >= 50) return 'QUESTIONABLE';
    return 'UNRELIABLE';
  }

  /**
   * Advanced duplicate detection stage
   * @param {Array} signals - Signals to check for duplicates
   * @returns {Object} Duplicate detection results
   */
  async advancedDuplicateDetection(signals) {
    const passed = [];
    const rejected = [];
    const duplicatePairs = [];
    const processed = new Set();

    for (let i = 0; i < signals.length; i++) {
      const signal = signals[i];
      
      if (processed.has(signal.id)) {
        continue; // Already processed as duplicate
      }

      let isDuplicate = false;
      
      for (let j = i + 1; j < signals.length; j++) {
        const otherSignal = signals[j];
        
        if (processed.has(otherSignal.id)) {
          continue;
        }

        const similarity = this.calculateAdvancedSimilarity(signal, otherSignal);
        
        if (similarity.overall > this.qualityThresholds.MAXIMUM_DUPLICATE_SIMILARITY) {
          // Determine which signal to keep (higher quality wins)
          const signalQuality = this.calculateOverallQuality(signal);
          const otherQuality = this.calculateOverallQuality(otherSignal);
          
          if (signalQuality >= otherQuality) {
            rejected.push(otherSignal);
            processed.add(otherSignal.id);
          } else {
            isDuplicate = true;
            processed.add(signal.id);
          }
          
          duplicatePairs.push({
            signal1: signal.id,
            signal2: otherSignal.id,
            similarity: similarity.overall,
            kept: signalQuality >= otherQuality ? signal.id : otherSignal.id,
            reason: 'High content similarity'
          });
        }
      }
      
      if (!isDuplicate) {
        passed.push(signal);
      } else {
        rejected.push(signal);
      }
      
      processed.add(signal.id);
    }

    return {
      input: signals.length,
      passed,
      rejected,
      duplicatePairs
    };
  }

  /**
   * Calculate advanced content similarity
   * @param {Object} signal1 - First signal
   * @param {Object} signal2 - Second signal
   * @returns {Object} Similarity analysis
   */
  calculateAdvancedSimilarity(signal1, signal2) {
    const title1 = this.normalizeText(signal1.title || '');
    const title2 = this.normalizeText(signal2.title || '');
    const content1 = this.normalizeText(signal1.content || signal1.summary || '');
    const content2 = this.normalizeText(signal2.content || signal2.summary || '');

    const titleSim = this.calculateJaccardSimilarity(title1, title2);
    const contentSim = this.calculateJaccardSimilarity(content1, content2);
    const urlSim = signal1.url === signal2.url ? 1.0 : 0.0;

    // Time proximity factor
    const time1 = new Date(signal1.publishedAt || signal1.fetchedAt).getTime();
    const time2 = new Date(signal2.publishedAt || signal2.fetchedAt).getTime();
    const timeDiff = Math.abs(time1 - time2) / (1000 * 60 * 60); // Hours
    const timeProximity = timeDiff < 24 ? 1.0 - (timeDiff / 24) : 0.0;

    // Overall similarity with weights
    const overall = (titleSim * 0.4) + (contentSim * 0.3) + (urlSim * 0.2) + (timeProximity * 0.1);

    return {
      title: titleSim,
      content: contentSim,
      url: urlSim,
      timeProximity,
      overall
    };
  }

  /**
   * Calculate Jaccard similarity between two texts
   * @param {string} text1 - First text
   * @param {string} text2 - Second text
   * @returns {number} Jaccard similarity (0-1)
   */
  calculateJaccardSimilarity(text1, text2) {
    const words1 = new Set(text1.split(/\s+/).filter(w => w.length > 2));
    const words2 = new Set(text2.split(/\s+/).filter(w => w.length > 2));
    
    const intersection = new Set([...words1].filter(w => words2.has(w)));
    const union = new Set([...words1, ...words2]);
    
    return union.size > 0 ? intersection.size / union.size : 0;
  }

  /**
   * Comprehensive quality scoring stage
   * @param {Array} signals - Signals to score
   * @returns {Object} Quality scoring results
   */
  async comprehensiveQualityScoring(signals) {
    const passed = [];
    const rejected = [];
    let totalQuality = 0;

    for (const signal of signals) {
      const qualityScore = this.calculateOverallQuality(signal);
      totalQuality += qualityScore;

      if (qualityScore >= 65) { // Quality threshold
        signal.overallQuality = qualityScore;
        passed.push(signal);
      } else {
        rejected.push(signal);
      }
    }

    return {
      input: signals.length,
      passed,
      rejected,
      averageQuality: signals.length > 0 ? totalQuality / signals.length : 0
    };
  }

  /**
   * Calculate overall quality score for signal
   * @param {Object} signal - Signal to score
   * @returns {number} Overall quality score
   */
  calculateOverallQuality(signal) {
    const factors = {
      intelligence: signal.intelligence?.relevanceScore || 50,
      confidence: signal.intelligence?.confidenceLevel || 50,
      source: signal.source?.credibilityScore || 50,
      content: signal.qualityAnalysis?.contentQuality || 50,
      temporal: this.calculateTemporalRelevance(signal)
    };

    // Weighted combination
    const weights = {
      intelligence: 0.3,
      confidence: 0.2,
      source: 0.2,
      content: 0.2,
      temporal: 0.1
    };

    let overallScore = 0;
    Object.entries(factors).forEach(([factor, score]) => {
      overallScore += score * weights[factor];
    });

    return Math.round(overallScore);
  }

  /**
   * Intelligence assessment stage
   * @param {Array} signals - Signals to assess
   * @returns {Object} Intelligence assessment results
   */
  async intelligenceAssessment(signals) {
    const passed = [];
    const rejected = [];
    let totalIntelligenceValue = 0;

    for (const signal of signals) {
      const intelligenceValue = this.assessIntelligenceValue(signal);
      totalIntelligenceValue += intelligenceValue.score;

      if (intelligenceValue.score >= 70) {
        signal.intelligenceAssessment = intelligenceValue;
        passed.push(signal);
      } else {
        rejected.push(signal);
      }
    }

    return {
      input: signals.length,
      passed,
      rejected,
      intelligenceValue: signals.length > 0 ? totalIntelligenceValue / signals.length : 0
    };
  }

  /**
   * Assess intelligence value of signal
   * @param {Object} signal - Signal to assess
   * @returns {Object} Intelligence value assessment
   */
  assessIntelligenceValue(signal) {
    const intelligence = signal.intelligence || {};
    const entities = intelligence.entities || {};
    
    let score = intelligence.relevanceScore || 50;
    const factors = [];

    // Priority bonus
    const priorityBonus = {
      'CRITICAL': 20,
      'HIGH': 15,
      'MEDIUM': 5,
      'LOW': 0
    };
    score += priorityBonus[intelligence.priority] || 0;
    factors.push(`Priority: ${intelligence.priority}`);

    // Entity richness bonus
    const entityCount = Object.values(entities).flat().length;
    if (entityCount >= 5) {
      score += 10;
      factors.push('Rich entity content');
    }

    // Threat assessment bonus
    if (intelligence.threatAssessment === 'CRITICAL') {
      score += 15;
      factors.push('Critical threat level');
    } else if (intelligence.threatAssessment === 'HIGH') {
      score += 10;
      factors.push('High threat level');
    }

    // Strategic implications bonus
    if (intelligence.strategicImplications && 
        intelligence.strategicImplications.toLowerCase().includes('significant')) {
      score += 10;
      factors.push('Strategic significance');
    }

    return {
      score: Math.min(score, 100),
      factors,
      assessment: this.categorizeIntelligenceValue(score)
    };
  }

  /**
   * Categorize intelligence value
   * @param {number} score - Intelligence value score
   * @returns {string} Intelligence value category
   */
  categorizeIntelligenceValue(score) {
    if (score >= 90) return 'EXCEPTIONAL';
    if (score >= 80) return 'HIGH';
    if (score >= 70) return 'MODERATE';
    if (score >= 60) return 'LIMITED';
    return 'MINIMAL';
  }

  /**
   * Final validation stage
   * @param {Array} signals - Signals for final validation
   * @returns {Object} Validation results
   */
  async finalValidation(signals) {
    const validated = [];
    let totalQuality = 0;

    for (const signal of signals) {
      // Final quality check
      const finalScore = this.performFinalQualityCheck(signal);
      
      if (finalScore >= 70) {
        signal.finalQualityScore = finalScore;
        signal.validationStatus = 'APPROVED';
        signal.qualityLevel = this.determineQualityLevel(finalScore);
        validated.push(signal);
        totalQuality += finalScore;
      }
    }

    return {
      input: signals.length,
      validated,
      finalQuality: signals.length > 0 ? totalQuality / validated.length : 0
    };
  }

  /**
   * Perform final quality check
   * @param {Object} signal - Signal for final check
   * @returns {number} Final quality score
   */
  performFinalQualityCheck(signal) {
    const scores = {
      overall: signal.overallQuality || 50,
      intelligence: signal.intelligenceAssessment?.score || 50,
      content: signal.qualityAnalysis?.contentQuality || 50,
      source: signal.sourceVerification?.credibilityScore || 50
    };

    // Weighted final score
    const finalScore = 
      (scores.overall * 0.3) +
      (scores.intelligence * 0.3) +
      (scores.content * 0.2) +
      (scores.source * 0.2);

    return Math.round(finalScore);
  }

  /**
   * Determine quality level based on final score
   * @param {number} score - Final quality score
   * @returns {string} Quality level
   */
  determineQualityLevel(score) {
    if (score >= 90) return 'PREMIUM';
    if (score >= 80) return 'HIGH';
    if (score >= 70) return 'STANDARD';
    return 'BASIC';
  }

  /**
   * Generate comprehensive quality report
   * @param {Object} pipelineResults - Pipeline processing results
   * @returns {Object} Quality report
   */
  generateQualityReport(pipelineResults) {
    const report = {
      summary: {
        inputSignals: pipelineResults.input,
        outputSignals: pipelineResults.output.length,
        passRate: Math.round((pipelineResults.output.length / pipelineResults.input) * 100),
        processingTime: pipelineResults.processingMetadata.totalProcessingTime
      },
      stageAnalysis: {},
      qualityDistribution: {},
      recommendations: []
    };

    // Analyze each stage
    Object.entries(pipelineResults.stages).forEach(([stage, results]) => {
      if (results.input && results.passed !== undefined) {
        report.stageAnalysis[stage] = {
          passRate: Math.round((results.passed / results.input) * 100),
          rejectionRate: Math.round(((results.input - results.passed) / results.input) * 100)
        };
      }
    });

    // Quality distribution
    const qualityLevels = { PREMIUM: 0, HIGH: 0, STANDARD: 0, BASIC: 0 };
    pipelineResults.output.forEach(signal => {
      const level = signal.qualityLevel || 'BASIC';
      qualityLevels[level]++;
    });
    report.qualityDistribution = qualityLevels;

    // Generate recommendations
    if (report.summary.passRate < 50) {
      report.recommendations.push('Consider reviewing source selection criteria');
    }
    if (qualityLevels.PREMIUM + qualityLevels.HIGH < pipelineResults.output.length * 0.3) {
      report.recommendations.push('Focus on higher-quality sources for better intelligence value');
    }

    return report;
  }

  /**
   * Helper methods
   */

  isAdvertisement(signal) {
    const content = (signal.title || '') + ' ' + (signal.content || signal.summary || '');
    return this.contentIndicators.DISQUALIFYING.some(indicator => 
      content.toLowerCase().includes(indicator)
    );
  }

  calculateAgeHours(signal) {
    const signalTime = new Date(signal.publishedAt || signal.fetchedAt).getTime();
    const now = Date.now();
    return (now - signalTime) / (1000 * 60 * 60);
  }

  calculateTemporalRelevance(signal) {
    const ageHours = this.calculateAgeHours(signal);
    
    if (ageHours < 1) return 100;
    if (ageHours < 6) return 95;
    if (ageHours < 24) return 85;
    if (ageHours < 72) return 70;
    if (ageHours < 168) return 50;
    return 30;
  }

  normalizeText(text) {
    return text.toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }
}

// Export singleton instance
export const signalQualityFilterService = new SignalQualityFilterService();