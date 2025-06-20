// Source Verification Module for Ghost Brief
// Professional source reliability verification and validation

/**
 * Source Verifier Service
 * Verifies source reliability and credibility for quality filtering
 */
export class SourceVerifierService {
  constructor() {
    // Source reliability tiers with detailed criteria
    this.sourceReliability = {
      TIER_1_PREMIUM: {
        credibilityScore: 95,
        trustLevel: 'HIGHEST',
        domains: [
          'reuters.com', 'bbc.com', 'apnews.com', 'defensenews.com',
          'janes.com', 'technologyreview.com', 'foreignaffairs.com'
        ],
        characteristics: [
          'established_reputation', 'fact_checking', 'editorial_standards',
          'correction_policy', 'source_verification', 'independence'
        ],
        verificationLevel: 'COMPREHENSIVE'
      },
      TIER_2_RELIABLE: {
        credibilityScore: 85,
        trustLevel: 'HIGH',
        domains: [
          'cnn.com', 'bloomberg.com', 'wsj.com', 'ft.com',
          'foreignpolicy.com', 'breakingdefense.com', 'theguardian.com'
        ],
        characteristics: [
          'professional_standards', 'verification_process',
          'experienced_reporters', 'editorial_oversight'
        ],
        verificationLevel: 'STANDARD'
      },
      TIER_3_STANDARD: {
        credibilityScore: 70,
        trustLevel: 'MEDIUM',
        domains: ['general_news_outlets'],
        characteristics: [
          'basic_editorial_standards', 'general_reporting',
          'variable_quality'
        ],
        verificationLevel: 'BASIC'
      },
      TIER_4_QUESTIONABLE: {
        credibilityScore: 40,
        trustLevel: 'LOW',
        domains: [
          'unknown_sources', 'blogs', 'social_media',
          'unverified_outlets', 'anonymous_sites'
        ],
        characteristics: [
          'limited_verification', 'potential_bias',
          'unreliable_sources', 'no_editorial_oversight'
        ],
        verificationLevel: 'MINIMAL'
      }
    };

    // Domain verification patterns
    this.domainVerification = {
      GOVERNMENT: {
        patterns: ['.gov', '.mil', 'state.gov', 'defense.gov', 'whitehouse.gov'],
        credibilityBonus: 15,
        trustLevel: 'OFFICIAL'
      },
      ACADEMIC: {
        patterns: ['.edu', 'university', 'institute', 'research', 'academic'],
        credibilityBonus: 10,
        trustLevel: 'SCHOLARLY'
      },
      INTERNATIONAL_ORG: {
        patterns: ['un.org', 'nato.int', 'who.int', 'iaea.org', 'worldbank.org'],
        credibilityBonus: 12,
        trustLevel: 'INSTITUTIONAL'
      },
      THINK_TANK: {
        patterns: ['brookings', 'rand.org', 'csis.org', 'cfr.org', 'heritage.org'],
        credibilityBonus: 8,
        trustLevel: 'ANALYTICAL'
      },
      NEWS_WIRE: {
        patterns: ['reuters', 'ap.org', 'bloomberg', 'afp.com'],
        credibilityBonus: 5,
        trustLevel: 'WIRE_SERVICE'
      }
    };

    // Source blacklist and warning indicators
    this.sourceWarnings = {
      PROPAGANDA: {
        indicators: ['state-controlled', 'propaganda', 'disinformation'],
        penalty: -30,
        warningLevel: 'CRITICAL'
      },
      BIAS: {
        indicators: ['extreme bias', 'partisan', 'advocacy site'],
        penalty: -15,
        warningLevel: 'HIGH'
      },
      UNRELIABLE: {
        indicators: ['fake news', 'conspiracy', 'satire', 'parody'],
        penalty: -40,
        warningLevel: 'CRITICAL'
      },
      COMMERCIAL: {
        indicators: ['sponsored content', 'native advertising', 'promotional'],
        penalty: -20,
        warningLevel: 'MEDIUM'
      }
    };

    // Track record indicators
    this.trackRecordFactors = {
      ACCURACY: {
        EXCELLENT: { threshold: 95, bonus: 10 },
        GOOD: { threshold: 85, bonus: 5 },
        AVERAGE: { threshold: 70, bonus: 0 },
        POOR: { threshold: 50, penalty: -10 }
      },
      CORRECTIONS: {
        TRANSPARENT: { bonus: 5 },
        ADEQUATE: { bonus: 0 },
        POOR: { penalty: -5 },
        NONE: { penalty: -10 }
      },
      INDEPENDENCE: {
        INDEPENDENT: { bonus: 8 },
        PARTIALLY_INDEPENDENT: { bonus: 3 },
        DEPENDENT: { penalty: -5 },
        CONTROLLED: { penalty: -15 }
      }
    };

    // Verification checks
    this.verificationChecks = [
      'DOMAIN_VERIFICATION',
      'CREDIBILITY_ASSESSMENT',
      'BIAS_EVALUATION',
      'TRACK_RECORD_ANALYSIS',
      'WARNING_FLAG_CHECK',
      'CONTENT_ATTRIBUTION_CHECK'
    ];
  }

  /**
   * Perform comprehensive source verification
   * @param {Array} signals - Signals to verify
   * @returns {Object} Source verification results
   */
  async sourceVerification(signals) {
    console.log(`🔍 Verifying source reliability for ${signals.length} signals...`);

    const results = {
      input: signals.length,
      passed: [],
      rejected: [],
      sourceAnalysis: [],
      verificationSummary: {
        tier1Sources: 0,
        tier2Sources: 0,
        tier3Sources: 0,
        tier4Sources: 0,
        flaggedSources: 0,
        averageCredibility: 0
      }
    };

    let totalCredibility = 0;

    for (const signal of signals) {
      const sourceAnalysis = this.verifySource(signal);
      
      // Add source analysis to signal
      signal.sourceVerification = sourceAnalysis;

      // Track verification summary
      results.sourceAnalysis.push({
        id: signal.id,
        source: signal.source?.feedName || 'Unknown',
        domain: signal.source?.domain || 'Unknown',
        ...sourceAnalysis
      });

      // Update summary counters
      this.updateVerificationSummary(results.verificationSummary, sourceAnalysis);
      totalCredibility += sourceAnalysis.finalCredibilityScore;

      // Apply filtering threshold
      if (sourceAnalysis.finalCredibilityScore >= 50 && !sourceAnalysis.isFlagged) {
        results.passed.push(signal);
      } else {
        signal.rejectionReason = sourceAnalysis.rejectionReason || 
          `Source credibility too low: ${sourceAnalysis.finalCredibilityScore}/100`;
        results.rejected.push(signal);
      }
    }

    // Calculate average credibility
    results.verificationSummary.averageCredibility = Math.round(totalCredibility / signals.length);

    console.log(`✅ Source verification complete: ${results.passed.length}/${signals.length} passed (avg credibility: ${results.verificationSummary.averageCredibility}%)`);
    return results;
  }

  /**
   * Verify a single source
   * @param {Object} signal - Signal with source information
   * @returns {Object} Source verification analysis
   */
  verifySource(signal) {
    const sourceInfo = this.extractSourceInfo(signal);
    
    // Step 1: Domain verification
    const domainAnalysis = this.verifyDomain(sourceInfo);
    
    // Step 2: Credibility tier assessment
    const tierAssessment = this.assessCredibilityTier(sourceInfo);
    
    // Step 3: Bias and warning evaluation
    const warningAnalysis = this.evaluateWarnings(sourceInfo);
    
    // Step 4: Track record analysis
    const trackRecordAnalysis = this.analyzeTrackRecord(sourceInfo);
    
    // Step 5: Content attribution check
    const attributionAnalysis = this.checkContentAttribution(signal);
    
    // Step 6: Calculate final credibility score
    const finalScore = this.calculateFinalCredibilityScore({
      domain: domainAnalysis,
      tier: tierAssessment,
      warnings: warningAnalysis,
      trackRecord: trackRecordAnalysis,
      attribution: attributionAnalysis
    });

    return {
      sourceInfo,
      domainAnalysis,
      tierAssessment,
      warningAnalysis,
      trackRecordAnalysis,
      attributionAnalysis,
      finalCredibilityScore: finalScore.score,
      credibilityLevel: finalScore.level,
      trustLevel: finalScore.trustLevel,
      isFlagged: warningAnalysis.isFlagged,
      verificationStatus: finalScore.status,
      rejectionReason: finalScore.rejectionReason,
      recommendations: this.generateSourceRecommendations(finalScore)
    };
  }

  /**
   * Extract source information from signal
   * @param {Object} signal - Signal object
   * @returns {Object} Extracted source information
   */
  extractSourceInfo(signal) {
    return {
      domain: signal.source?.domain || '',
      feedName: signal.source?.feedName || '',
      url: signal.url || '',
      providedCredibility: signal.source?.credibilityScore || 70,
      title: signal.title || '',
      content: signal.content || signal.summary || ''
    };
  }

  /**
   * Verify domain characteristics
   * @param {Object} sourceInfo - Source information
   * @returns {Object} Domain verification analysis
   */
  verifyDomain(sourceInfo) {
    const { domain, url } = sourceInfo;
    const fullDomain = (domain + url).toLowerCase();
    
    let domainType = 'STANDARD';
    let credibilityBonus = 0;
    let trustLevel = 'STANDARD';
    const matchedPatterns = [];

    // Check domain verification patterns
    Object.entries(this.domainVerification).forEach(([type, config]) => {
      config.patterns.forEach(pattern => {
        if (fullDomain.includes(pattern.toLowerCase())) {
          domainType = type;
          credibilityBonus = Math.max(credibilityBonus, config.credibilityBonus);
          trustLevel = config.trustLevel;
          matchedPatterns.push({ type, pattern, bonus: config.credibilityBonus });
        }
      });
    });

    return {
      domainType,
      credibilityBonus,
      trustLevel,
      matchedPatterns,
      isVerifiedDomain: matchedPatterns.length > 0
    };
  }

  /**
   * Assess credibility tier
   * @param {Object} sourceInfo - Source information
   * @returns {Object} Tier assessment
   */
  assessCredibilityTier(sourceInfo) {
    const { domain, feedName } = sourceInfo;
    
    // Find matching tier
    for (const [tierName, tierData] of Object.entries(this.sourceReliability)) {
      // Check domain matches
      if (tierData.domains.some(sourceDomain => 
        domain.toLowerCase().includes(sourceDomain.toLowerCase())
      )) {
        return {
          tier: tierName,
          baseCredibility: tierData.credibilityScore,
          trustLevel: tierData.trustLevel,
          verificationLevel: tierData.verificationLevel,
          characteristics: tierData.characteristics,
          matchType: 'DOMAIN'
        };
      }
      
      // Check feed name matches
      if (tierData.domains.some(source => 
        feedName.toLowerCase().includes(source.toLowerCase()) ||
        source.toLowerCase().includes(feedName.toLowerCase())
      )) {
        return {
          tier: tierName,
          baseCredibility: tierData.credibilityScore,
          trustLevel: tierData.trustLevel,
          verificationLevel: tierData.verificationLevel,
          characteristics: tierData.characteristics,
          matchType: 'FEED_NAME'
        };
      }
    }
    
    // Default to standard tier
    return {
      tier: 'TIER_3_STANDARD',
      baseCredibility: this.sourceReliability.TIER_3_STANDARD.credibilityScore,
      trustLevel: this.sourceReliability.TIER_3_STANDARD.trustLevel,
      verificationLevel: this.sourceReliability.TIER_3_STANDARD.verificationLevel,
      characteristics: this.sourceReliability.TIER_3_STANDARD.characteristics,
      matchType: 'DEFAULT'
    };
  }

  /**
   * Evaluate warning flags and bias indicators
   * @param {Object} sourceInfo - Source information
   * @returns {Object} Warning analysis
   */
  evaluateWarnings(sourceInfo) {
    const { domain, feedName, content } = sourceInfo;
    const searchText = (domain + ' ' + feedName + ' ' + content).toLowerCase();
    
    let totalPenalty = 0;
    let maxWarningLevel = 'NONE';
    const detectedWarnings = [];
    let isFlagged = false;

    Object.entries(this.sourceWarnings).forEach(([warningType, warningData]) => {
      warningData.indicators.forEach(indicator => {
        if (searchText.includes(indicator.toLowerCase())) {
          totalPenalty += warningData.penalty;
          detectedWarnings.push({
            type: warningType,
            indicator,
            penalty: warningData.penalty,
            level: warningData.warningLevel
          });
          
          if (warningData.warningLevel === 'CRITICAL') {
            maxWarningLevel = 'CRITICAL';
            isFlagged = true;
          } else if (warningData.warningLevel === 'HIGH' && maxWarningLevel !== 'CRITICAL') {
            maxWarningLevel = 'HIGH';
            isFlagged = true;
          }
        }
      });
    });

    return {
      totalPenalty,
      maxWarningLevel,
      detectedWarnings,
      isFlagged,
      warningCount: detectedWarnings.length
    };
  }

  /**
   * Analyze track record factors
   * @param {Object} sourceInfo - Source information
   * @returns {Object} Track record analysis
   */
  analyzeTrackRecord(sourceInfo) {
    const { providedCredibility } = sourceInfo;
    
    // Use provided credibility to infer track record
    let accuracyLevel = 'AVERAGE';
    let accuracyAdjustment = 0;
    
    if (providedCredibility >= 95) {
      accuracyLevel = 'EXCELLENT';
      accuracyAdjustment = this.trackRecordFactors.ACCURACY.EXCELLENT.bonus;
    } else if (providedCredibility >= 85) {
      accuracyLevel = 'GOOD';
      accuracyAdjustment = this.trackRecordFactors.ACCURACY.GOOD.bonus;
    } else if (providedCredibility >= 70) {
      accuracyLevel = 'AVERAGE';
      accuracyAdjustment = this.trackRecordFactors.ACCURACY.AVERAGE.bonus;
    } else {
      accuracyLevel = 'POOR';
      accuracyAdjustment = this.trackRecordFactors.ACCURACY.POOR.penalty;
    }

    // Default assumptions for other factors
    const correctionAdjustment = this.trackRecordFactors.CORRECTIONS.ADEQUATE.bonus;
    const independenceAdjustment = this.trackRecordFactors.INDEPENDENCE.INDEPENDENT.bonus;

    return {
      accuracyLevel,
      accuracyAdjustment,
      correctionAdjustment,
      independenceAdjustment,
      totalTrackRecordAdjustment: accuracyAdjustment + correctionAdjustment + independenceAdjustment
    };
  }

  /**
   * Check content attribution quality
   * @param {Object} signal - Signal object
   * @returns {Object} Attribution analysis
   */
  checkContentAttribution(signal) {
    const content = (signal.title + ' ' + (signal.content || signal.summary || '')).toLowerCase();
    
    const attributionIndicators = {
      STRONG: ['according to', 'sources said', 'officials confirmed', 'documents show'],
      MEDIUM: ['reported', 'sources say', 'officials indicate'],
      WEAK: ['alleged', 'rumored', 'claims', 'speculation'],
      NONE: []
    };

    let attributionLevel = 'NONE';
    let attributionScore = 40; // Base score
    const foundIndicators = [];

    Object.entries(attributionIndicators).forEach(([level, indicators]) => {
      indicators.forEach(indicator => {
        if (content.includes(indicator)) {
          attributionLevel = level;
          foundIndicators.push({ level, indicator });
          
          // Score adjustments
          switch (level) {
            case 'STRONG': attributionScore += 20; break;
            case 'MEDIUM': attributionScore += 10; break;
            case 'WEAK': attributionScore -= 10; break;
            default: break;
          }
        }
      });
    });

    return {
      attributionLevel,
      attributionScore: Math.min(Math.max(attributionScore, 0), 100),
      foundIndicators,
      hasAttribution: foundIndicators.length > 0
    };
  }

  /**
   * Calculate final credibility score
   * @param {Object} analyses - All analysis results
   * @returns {Object} Final credibility assessment
   */
  calculateFinalCredibilityScore(analyses) {
    const { domain, tier, warnings, trackRecord, attribution } = analyses;
    
    // Start with base credibility from tier
    let finalScore = tier.baseCredibility;
    
    // Add domain bonus
    finalScore += domain.credibilityBonus;
    
    // Apply warning penalties
    finalScore += warnings.totalPenalty;
    
    // Apply track record adjustments
    finalScore += trackRecord.totalTrackRecordAdjustment;
    
    // Apply attribution score (weighted)
    finalScore += (attribution.attributionScore - 50) * 0.1;
    
    // Ensure score is within bounds
    finalScore = Math.min(Math.max(finalScore, 0), 100);
    
    // Determine credibility level and status
    const credibilityLevel = this.determineCredibilityLevel(finalScore);
    const trustLevel = this.determineTrustLevel(finalScore, warnings.isFlagged);
    const status = this.determineVerificationStatus(finalScore, warnings.isFlagged);
    
    return {
      score: Math.round(finalScore),
      level: credibilityLevel,
      trustLevel,
      status,
      rejectionReason: status === 'REJECTED' ? this.generateRejectionReason(analyses) : null
    };
  }

  /**
   * Determine credibility level from score
   * @param {number} score - Credibility score
   * @returns {string} Credibility level
   */
  determineCredibilityLevel(score) {
    if (score >= 90) return 'EXCELLENT';
    if (score >= 75) return 'GOOD';
    if (score >= 60) return 'ACCEPTABLE';
    if (score >= 45) return 'POOR';
    return 'INADEQUATE';
  }

  /**
   * Determine trust level
   * @param {number} score - Credibility score
   * @param {boolean} isFlagged - Whether source is flagged
   * @returns {string} Trust level
   */
  determineTrustLevel(score, isFlagged) {
    if (isFlagged) return 'QUESTIONABLE';
    if (score >= 85) return 'HIGH';
    if (score >= 70) return 'MEDIUM';
    if (score >= 50) return 'LOW';
    return 'VERY_LOW';
  }

  /**
   * Determine verification status
   * @param {number} score - Credibility score
   * @param {boolean} isFlagged - Whether source is flagged
   * @returns {string} Verification status
   */
  determineVerificationStatus(score, isFlagged) {
    if (isFlagged || score < 50) return 'REJECTED';
    if (score >= 85) return 'VERIFIED';
    if (score >= 70) return 'VALIDATED';
    return 'ACCEPTED';
  }

  /**
   * Generate rejection reason
   * @param {Object} analyses - Analysis results
   * @returns {string} Rejection reason
   */
  generateRejectionReason(analyses) {
    const { warnings, tier } = analyses;
    
    if (warnings.isFlagged) {
      return `Source flagged: ${warnings.maxWarningLevel} warning detected`;
    }
    
    if (tier.baseCredibility < 50) {
      return `Source credibility too low: Tier ${tier.tier}`;
    }
    
    return 'Source verification failed';
  }

  /**
   * Update verification summary counters
   * @param {Object} summary - Summary object to update
   * @param {Object} analysis - Source analysis
   */
  updateVerificationSummary(summary, analysis) {
    // Count by tier
    switch (analysis.tierAssessment.tier) {
      case 'TIER_1_PREMIUM': summary.tier1Sources++; break;
      case 'TIER_2_RELIABLE': summary.tier2Sources++; break;
      case 'TIER_3_STANDARD': summary.tier3Sources++; break;
      case 'TIER_4_QUESTIONABLE': summary.tier4Sources++; break;
      default: break;
    }
    
    // Count flagged sources
    if (analysis.isFlagged) {
      summary.flaggedSources++;
    }
  }

  /**
   * Generate source recommendations
   * @param {Object} finalScore - Final score assessment
   * @returns {Array} Recommendations
   */
  generateSourceRecommendations(finalScore) {
    const recommendations = [];
    const { score, trustLevel } = finalScore;
    
    if (score >= 85) {
      recommendations.push('Highly reliable source - suitable for high-priority intelligence');
    } else if (score >= 70) {
      recommendations.push('Reliable source - suitable for standard intelligence reporting');
    } else if (score >= 50) {
      recommendations.push('Moderate reliability - verify with additional sources');
    } else {
      recommendations.push('Low reliability - require multiple source confirmation');
    }
    
    if (trustLevel === 'QUESTIONABLE') {
      recommendations.push('Exercise caution - source has warning flags');
    }
    
    if (trustLevel === 'CRITICAL') {
      recommendations.push('Immediate review of source flagged for critical issues');
    }
    
    return recommendations.join('. ');
  }
}

// Export singleton instance
export const sourceVerifierService = new SourceVerifierService();