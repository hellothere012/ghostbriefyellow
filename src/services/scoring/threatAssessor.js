// Threat Assessment Module for Ghost Brief
// Professional threat level analysis and classification

/**
 * Threat Assessor Service
 * Analyzes and classifies threat levels based on intelligence content
 */
export class ThreatAssessorService {
  constructor() {
    // Threat category definitions with escalation risk
    this.threatCategories = {
      NUCLEAR: {
        escalationRisk: 1.0,
        severity: 'CRITICAL',
        keywords: [
          'NUCLEAR WEAPON', 'NUCLEAR WARHEAD', 'ICBM', 'SLBM', 'NUCLEAR STRIKE',
          'URANIUM ENRICHMENT', 'PLUTONIUM', 'NUCLEAR REACTOR', 'NUCLEAR FACILITY',
          'NUCLEAR PROGRAM', 'NUCLEAR TEST', 'NUCLEAR THREAT', 'NUCLEAR ARSENAL'
        ],
        patterns: [
          'nuclear.*weapon', 'nuclear.*strike', 'nuclear.*threat', 'nuclear.*test',
          'ballistic.*missile', 'enriched.*uranium', 'nuclear.*program'
        ]
      },
      MILITARY: {
        escalationRisk: 0.8,
        severity: 'HIGH',
        keywords: [
          'MILITARY DEPLOYMENT', 'TROOP BUILDUP', 'MOBILIZATION', 'INVASION',
          'MILITARY EXERCISE', 'NAVAL BLOCKADE', 'AIR STRIKE', 'MISSILE ATTACK',
          'MILITARY READINESS', 'COMBAT OPERATIONS', 'ARMED CONFLICT', 'WAR'
        ],
        patterns: [
          'military.*deployment', 'troop.*buildup', 'missile.*attack', 'air.*strike',
          'naval.*blockade', 'combat.*operations'
        ]
      },
      CYBER: {
        escalationRisk: 0.7,
        severity: 'HIGH',
        keywords: [
          'CYBER ATTACK', 'CYBER WARFARE', 'MALWARE', 'RANSOMWARE', 'DATA BREACH',
          'HACKING', 'BOTNET', 'ZERO-DAY', 'DDOS', 'CYBER ESPIONAGE',
          'CRITICAL INFRASTRUCTURE', 'POWER GRID', 'FINANCIAL SYSTEM'
        ],
        patterns: [
          'cyber.*attack', 'cyber.*warfare', 'data.*breach', 'critical.*infrastructure',
          'power.*grid', 'financial.*system'
        ]
      },
      TERRORIST: {
        escalationRisk: 0.9,
        severity: 'CRITICAL',
        keywords: [
          'TERRORIST ATTACK', 'TERRORISM', 'BOMB', 'EXPLOSIVE', 'SUICIDE BOMBER',
          'TERRORIST GROUP', 'ISIS', 'AL-QAEDA', 'TALIBAN', 'ASSASSINATION',
          'HOSTAGE', 'KIDNAPPING', 'CHEMICAL ATTACK', 'BIOLOGICAL WEAPON'
        ],
        patterns: [
          'terrorist.*attack', 'suicide.*bomber', 'chemical.*attack', 'biological.*weapon',
          'terrorist.*group'
        ]
      },
      ECONOMIC: {
        escalationRisk: 0.6,
        severity: 'MEDIUM',
        keywords: [
          'ECONOMIC SANCTIONS', 'TRADE WAR', 'FINANCIAL WARFARE', 'EMBARGO',
          'CURRENCY MANIPULATION', 'SUPPLY CHAIN', 'ENERGY CRISIS', 'MARKET CRASH',
          'BANKING SYSTEM', 'FINANCIAL INSTABILITY', 'ECONOMIC COLLAPSE'
        ],
        patterns: [
          'economic.*sanctions', 'trade.*war', 'financial.*warfare', 'supply.*chain',
          'market.*crash', 'economic.*collapse'
        ]
      },
      DIPLOMATIC: {
        escalationRisk: 0.4,
        severity: 'MEDIUM',
        keywords: [
          'DIPLOMATIC CRISIS', 'AMBASSADOR EXPELLED', 'EMBASSY CLOSED', 'SANCTIONS',
          'INTERNATIONAL INCIDENT', 'DIPLOMATIC TENSIONS', 'WITHDRAWAL FROM TREATY',
          'CONDEMNATION', 'PROTEST', 'DIPLOMATIC RELATIONS'
        ],
        patterns: [
          'diplomatic.*crisis', 'ambassador.*expelled', 'embassy.*closed',
          'diplomatic.*tensions', 'international.*incident'
        ]
      },
      HEALTH: {
        escalationRisk: 0.5,
        severity: 'MEDIUM',
        keywords: [
          'PANDEMIC', 'EPIDEMIC', 'OUTBREAK', 'BIOWEAPON', 'BIOLOGICAL THREAT',
          'QUARANTINE', 'PUBLIC HEALTH EMERGENCY', 'INFECTIOUS DISEASE',
          'HEALTH CRISIS', 'CONTAMINATION', 'BIOLOGICAL WARFARE'
        ],
        patterns: [
          'public.*health.*emergency', 'biological.*threat', 'biological.*warfare',
          'infectious.*disease'
        ]
      }
    };

    // Threat escalation indicators
    this.escalationIndicators = {
      IMMEDIATE: {
        multiplier: 1.5,
        keywords: ['imminent', 'immediate', 'urgent', 'emergency', 'alert', 'breaking'],
        timeFrames: ['minutes', 'hours', 'now', 'today']
      },
      SHORT_TERM: {
        multiplier: 1.3,
        keywords: ['planned', 'scheduled', 'preparation', 'mobilizing'],
        timeFrames: ['days', 'this week', 'soon', 'upcoming']
      },
      MEDIUM_TERM: {
        multiplier: 1.1,
        keywords: ['developing', 'building', 'increasing', 'growing'],
        timeFrames: ['weeks', 'next month', 'coming months']
      },
      LONG_TERM: {
        multiplier: 1.0,
        keywords: ['strategic', 'long-term', 'planning', 'future'],
        timeFrames: ['months', 'years', 'long-term']
      }
    };

    // Geographic threat multipliers
    this.geographicMultipliers = {
      CRITICAL_REGIONS: {
        multiplier: 1.4,
        regions: ['MIDDLE EAST', 'KOREAN PENINSULA', 'TAIWAN STRAIT', 'UKRAINE', 'SOUTH CHINA SEA']
      },
      HIGH_TENSION: {
        multiplier: 1.2,
        regions: ['INDO-PACIFIC', 'EASTERN EUROPE', 'PERSIAN GULF', 'KASHMIR']
      },
      MODERATE_TENSION: {
        multiplier: 1.1,
        regions: ['BALKANS', 'CENTRAL ASIA', 'HORN OF AFRICA']
      },
      STANDARD: {
        multiplier: 1.0,
        regions: ['OTHER_REGIONS']
      }
    };

    // Threat actor significance
    this.threatActors = {
      STATE_ACTORS: {
        multiplier: 1.3,
        actors: ['CHINA', 'RUSSIA', 'IRAN', 'NORTH KOREA', 'PAKISTAN']
      },
      PROXY_FORCES: {
        multiplier: 1.2,
        actors: ['HEZBOLLAH', 'HOUTHIS', 'IRANIAN PROXIES', 'WAGNER GROUP']
      },
      TERRORIST_GROUPS: {
        multiplier: 1.4,
        actors: ['ISIS', 'AL-QAEDA', 'TALIBAN', 'BOKO HARAM']
      },
      NON_STATE: {
        multiplier: 1.1,
        actors: ['CRIMINAL ORGANIZATIONS', 'HACKTIVISTS', 'SEPARATIST GROUPS']
      }
    };

    // Confidence indicators
    this.confidenceFactors = {
      HIGH_CONFIDENCE: {
        multiplier: 1.0,
        indicators: ['confirmed', 'verified', 'intelligence sources', 'multiple sources']
      },
      MEDIUM_CONFIDENCE: {
        multiplier: 0.9,
        indicators: ['reported', 'sources say', 'according to', 'officials indicate']
      },
      LOW_CONFIDENCE: {
        multiplier: 0.7,
        indicators: ['alleged', 'rumored', 'unconfirmed', 'speculation', 'claims']
      }
    };
  }

  /**
   * Calculate comprehensive threat level assessment
   * @param {Object} article - Article object
   * @param {Object} entityAnalysis - Entity analysis results
   * @returns {Object} Threat assessment
   */
  calculateThreatLevel(article, entityAnalysis) {
    const content = (article.title + ' ' + (article.content || article.summary || '')).toUpperCase();
    
    // Primary threat detection
    const threatDetection = this.detectThreatCategories(content);
    
    // Escalation analysis
    const escalationAnalysis = this.analyzeEscalationFactors(content);
    
    // Geographic assessment
    const geographicAssessment = this.assessGeographicFactors(content, entityAnalysis);
    
    // Threat actor analysis
    const actorAnalysis = this.analyzeThreatActors(content, entityAnalysis);
    
    // Confidence assessment
    const confidenceAssessment = this.assessConfidence(content);
    
    // Calculate final threat score
    const threatScore = this.calculateFinalThreatScore({
      threatDetection,
      escalationAnalysis,
      geographicAssessment,
      actorAnalysis,
      confidenceAssessment
    });

    const threatLevel = this.scoreToThreatLevel(threatScore.score);

    return {
      score: Math.round(threatScore.score),
      level: threatLevel,
      confidence: Math.round(confidenceAssessment.confidence),
      detectedThreats: threatDetection.categories,
      analysis: this.generateThreatAnalysis(threatDetection, escalationAnalysis, geographicAssessment),
      breakdown: {
        baseThreat: threatDetection.maxScore,
        escalationMultiplier: escalationAnalysis.multiplier,
        geographicMultiplier: geographicAssessment.multiplier,
        actorMultiplier: actorAnalysis.multiplier,
        confidenceMultiplier: confidenceAssessment.multiplier,
        finalScore: threatScore.score
      },
      recommendations: this.generateThreatRecommendations(threatLevel, threatScore.score),
      timeFrame: escalationAnalysis.timeFrame,
      primaryThreat: threatDetection.primaryThreat,
      riskFactors: this.identifyRiskFactors(threatDetection, escalationAnalysis, actorAnalysis)
    };
  }

  /**
   * Detect threat categories in content
   * @param {string} content - Article content
   * @returns {Object} Threat detection results
   */
  detectThreatCategories(content) {
    let maxScore = 0;
    let primaryThreat = null;
    const detectedCategories = [];

    Object.entries(this.threatCategories).forEach(([threatType, threatData]) => {
      let categoryScore = 0;
      const matchedKeywords = [];
      const matchedPatterns = [];

      // Check keywords
      threatData.keywords.forEach(keyword => {
        if (content.includes(keyword)) {
          categoryScore += 20;
          matchedKeywords.push(keyword);
        }
      });

      // Check patterns (if any)
      if (threatData.patterns) {
        threatData.patterns.forEach(pattern => {
          const regex = new RegExp(pattern, 'gi');
          if (regex.test(content)) {
            categoryScore += 25;
            matchedPatterns.push(pattern);
          }
        });
      }

      if (categoryScore > 0) {
        const adjustedScore = Math.min(categoryScore * threatData.escalationRisk, 100);
        
        if (adjustedScore > maxScore) {
          maxScore = adjustedScore;
          primaryThreat = threatType;
        }

        detectedCategories.push({
          type: threatType,
          severity: threatData.severity,
          escalationRisk: threatData.escalationRisk,
          score: adjustedScore,
          matchedKeywords,
          matchedPatterns
        });
      }
    });

    return {
      maxScore,
      primaryThreat,
      categories: detectedCategories,
      threatCount: detectedCategories.length
    };
  }

  /**
   * Analyze escalation factors
   * @param {string} content - Article content
   * @returns {Object} Escalation analysis
   */
  analyzeEscalationFactors(content) {
    let maxMultiplier = 1.0;
    let timeFrame = 'LONG_TERM';
    const matchedIndicators = [];

    Object.entries(this.escalationIndicators).forEach(([frameType, frameData]) => {
      let frameMatched = false;

      // Check keywords
      frameData.keywords.forEach(keyword => {
        if (content.includes(keyword.toUpperCase())) {
          frameMatched = true;
          matchedIndicators.push({ type: 'KEYWORD', timeFrame: frameType, indicator: keyword });
        }
      });

      // Check time frames
      frameData.timeFrames.forEach(timeRef => {
        if (content.includes(timeRef.toUpperCase())) {
          frameMatched = true;
          matchedIndicators.push({ type: 'TIME_FRAME', timeFrame: frameType, indicator: timeRef });
        }
      });

      if (frameMatched && frameData.multiplier > maxMultiplier) {
        maxMultiplier = frameData.multiplier;
        timeFrame = frameType;
      }
    });

    return {
      multiplier: maxMultiplier,
      timeFrame,
      matchedIndicators,
      urgency: this.categorizeUrgency(timeFrame)
    };
  }

  /**
   * Assess geographic threat factors
   * @param {string} content - Article content
   * @param {Object} entityAnalysis - Entity analysis
   * @returns {Object} Geographic assessment
   */
  assessGeographicFactors(content, entityAnalysis) {
    let maxMultiplier = 1.0;
    let relevantRegion = 'STANDARD';
    const detectedRegions = [];

    Object.entries(this.geographicMultipliers).forEach(([regionType, regionData]) => {
      regionData.regions.forEach(region => {
        if (content.includes(region) || this.isRegionInEntities(region, entityAnalysis)) {
          if (regionData.multiplier > maxMultiplier) {
            maxMultiplier = regionData.multiplier;
            relevantRegion = regionType;
          }
          detectedRegions.push({ region, type: regionType, multiplier: regionData.multiplier });
        }
      });
    });

    return {
      multiplier: maxMultiplier,
      relevantRegion,
      detectedRegions,
      hasHighRiskRegion: maxMultiplier > 1.2
    };
  }

  /**
   * Check if region is mentioned in entities
   * @param {string} region - Region to check
   * @param {Object} entityAnalysis - Entity analysis
   * @returns {boolean} Whether region is detected
   */
  isRegionInEntities(region, entityAnalysis) {
    const countries = entityAnalysis.countries || [];
    const regionMapping = {
      'MIDDLE EAST': ['IRAN', 'ISRAEL', 'SAUDI ARABIA', 'SYRIA', 'IRAQ'],
      'KOREAN PENINSULA': ['NORTH KOREA', 'SOUTH KOREA'],
      'TAIWAN STRAIT': ['TAIWAN', 'CHINA'],
      'SOUTH CHINA SEA': ['CHINA', 'PHILIPPINES', 'VIETNAM']
    };

    if (regionMapping[region]) {
      return regionMapping[region].some(country => countries.includes(country));
    }

    return false;
  }

  /**
   * Analyze threat actors
   * @param {string} content - Article content
   * @param {Object} entityAnalysis - Entity analysis
   * @returns {Object} Threat actor analysis
   */
  analyzeThreatActors(content, entityAnalysis) {
    let maxMultiplier = 1.0;
    let primaryActorType = 'STANDARD';
    const detectedActors = [];

    Object.entries(this.threatActors).forEach(([actorType, actorData]) => {
      actorData.actors.forEach(actor => {
        if (content.includes(actor) || this.isActorInEntities(actor, entityAnalysis)) {
          if (actorData.multiplier > maxMultiplier) {
            maxMultiplier = actorData.multiplier;
            primaryActorType = actorType;
          }
          detectedActors.push({ actor, type: actorType, multiplier: actorData.multiplier });
        }
      });
    });

    return {
      multiplier: maxMultiplier,
      primaryActorType,
      detectedActors,
      hasHighThreatActor: maxMultiplier > 1.3
    };
  }

  /**
   * Check if actor is mentioned in entities
   * @param {string} actor - Actor to check
   * @param {Object} entityAnalysis - Entity analysis
   * @returns {boolean} Whether actor is detected
   */
  isActorInEntities(actor, entityAnalysis) {
    const countries = entityAnalysis.countries || [];
    const organizations = entityAnalysis.organizations || [];
    
    return countries.includes(actor) || organizations.includes(actor);
  }

  /**
   * Assess confidence level
   * @param {string} content - Article content
   * @returns {Object} Confidence assessment
   */
  assessConfidence(content) {
    let confidence = 70; // Base confidence
    let multiplier = 1.0;
    let confidenceLevel = 'MEDIUM_CONFIDENCE';
    const matchedIndicators = [];

    Object.entries(this.confidenceFactors).forEach(([level, data]) => {
      data.indicators.forEach(indicator => {
        if (content.includes(indicator.toUpperCase())) {
          multiplier = data.multiplier;
          confidenceLevel = level;
          matchedIndicators.push({ level, indicator });
          
          // Adjust confidence score
          if (level === 'HIGH_CONFIDENCE') confidence += 20;
          else if (level === 'LOW_CONFIDENCE') confidence -= 20;
        }
      });
    });

    return {
      confidence: Math.min(Math.max(confidence, 30), 95),
      multiplier,
      level: confidenceLevel,
      matchedIndicators
    };
  }

  /**
   * Calculate final threat score
   * @param {Object} factors - All threat factors
   * @returns {Object} Final threat score
   */
  calculateFinalThreatScore(factors) {
    const { threatDetection, escalationAnalysis, geographicAssessment, actorAnalysis, confidenceAssessment } = factors;
    
    // Start with base threat score
    let score = threatDetection.maxScore;
    
    // Apply escalation multiplier
    score *= escalationAnalysis.multiplier;
    
    // Apply geographic multiplier
    score *= geographicAssessment.multiplier;
    
    // Apply threat actor multiplier
    score *= actorAnalysis.multiplier;
    
    // Apply confidence multiplier
    score *= confidenceAssessment.multiplier;
    
    return {
      score: Math.min(Math.max(score, 0), 100),
      factors: {
        base: threatDetection.maxScore,
        escalation: escalationAnalysis.multiplier,
        geographic: geographicAssessment.multiplier,
        actor: actorAnalysis.multiplier,
        confidence: confidenceAssessment.multiplier
      }
    };
  }

  /**
   * Convert threat score to threat level
   * @param {number} score - Threat score
   * @returns {string} Threat level
   */
  scoreToThreatLevel(score) {
    if (score >= 80) return 'CRITICAL';
    if (score >= 60) return 'HIGH';
    if (score >= 40) return 'MEDIUM';
    return 'LOW';
  }

  /**
   * Categorize urgency based on time frame
   * @param {string} timeFrame - Time frame category
   * @returns {string} Urgency category
   */
  categorizeUrgency(timeFrame) {
    const urgencyMap = {
      'IMMEDIATE': 'URGENT',
      'SHORT_TERM': 'HIGH',
      'MEDIUM_TERM': 'MODERATE',
      'LONG_TERM': 'LOW'
    };
    return urgencyMap[timeFrame] || 'LOW';
  }

  /**
   * Generate threat analysis summary
   * @param {Object} threatDetection - Threat detection results
   * @param {Object} escalationAnalysis - Escalation analysis
   * @param {Object} geographicAssessment - Geographic assessment
   * @returns {string} Analysis summary
   */
  generateThreatAnalysis(threatDetection, escalationAnalysis, geographicAssessment) {
    const { primaryThreat, threatCount } = threatDetection;
    const { timeFrame } = escalationAnalysis;
    const { relevantRegion } = geographicAssessment;
    
    let analysis = `${threatCount} threat categor${threatCount === 1 ? 'y' : 'ies'} detected`;
    
    if (primaryThreat) {
      analysis += `, primary: ${primaryThreat}`;
    }
    
    if (timeFrame !== 'LONG_TERM') {
      analysis += `, timeframe: ${timeFrame}`;
    }
    
    if (relevantRegion !== 'STANDARD') {
      analysis += `, region: ${relevantRegion}`;
    }
    
    return analysis;
  }

  /**
   * Generate threat recommendations
   * @param {string} threatLevel - Threat level
   * @param {number} score - Threat score
   * @returns {Array} List of recommendations
   */
  generateThreatRecommendations(threatLevel, score) {
    const recommendations = [];
    
    switch (threatLevel) {
      case 'CRITICAL':
        recommendations.push('Immediate escalation to senior leadership required');
        recommendations.push('Activate crisis response protocols');
        recommendations.push('Monitor for real-time developments');
        break;
      case 'HIGH':
        recommendations.push('Escalate to relevant decision makers');
        recommendations.push('Increase monitoring frequency');
        recommendations.push('Prepare contingency responses');
        break;
      case 'MEDIUM':
        recommendations.push('Continue monitoring situation');
        recommendations.push('Brief relevant stakeholders');
        recommendations.push('Track for escalation indicators');
        break;
      case 'LOW':
        recommendations.push('Standard monitoring protocols');
        recommendations.push('Include in routine briefings');
        break;
      default:
        recommendations.push('Review and assess threat level');
        break;
    }
    
    if (score > 90) {
      recommendations.push('Consider activating emergency response team');
    }
    
    return recommendations;
  }

  /**
   * Identify risk factors
   * @param {Object} threatDetection - Threat detection results
   * @param {Object} escalationAnalysis - Escalation analysis
   * @param {Object} actorAnalysis - Actor analysis
   * @returns {Array} List of risk factors
   */
  identifyRiskFactors(threatDetection, escalationAnalysis, actorAnalysis) {
    const riskFactors = [];
    
    if (threatDetection.threatCount > 2) {
      riskFactors.push('Multiple threat categories detected');
    }
    
    if (escalationAnalysis.timeFrame === 'IMMEDIATE') {
      riskFactors.push('Immediate time frame - high urgency');
    }
    
    if (actorAnalysis.hasHighThreatActor) {
      riskFactors.push('High-threat actor involvement');
    }
    
    if (threatDetection.primaryThreat === 'NUCLEAR') {
      riskFactors.push('Nuclear threat indicators');
    }
    
    return riskFactors;
  }
}

// Export singleton instance
export const threatAssessorService = new ThreatAssessorService();