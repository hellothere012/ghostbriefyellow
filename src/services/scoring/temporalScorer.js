// Temporal Relevance Scoring Module for Ghost Brief
// Time-based intelligence relevance assessment and scoring

/**
 * Temporal Scorer Service
 * Analyzes time-based factors affecting intelligence value
 */
export class TemporalScorerService {
  constructor() {
    // Time decay configuration
    this.timeDecayConfig = {
      BREAKING: { maxHours: 1, score: 100, urgencyFactor: 1.0 },
      RECENT: { maxHours: 6, score: 95, urgencyFactor: 0.95 },
      CURRENT: { maxHours: 24, score: 85, urgencyFactor: 0.85 },
      DAILY: { maxHours: 72, score: 70, urgencyFactor: 0.7 },
      WEEKLY: { maxHours: 168, score: 50, urgencyFactor: 0.5 },
      HISTORICAL: { maxHours: Infinity, score: 30, urgencyFactor: 0.3 }
    };

    // Temporal keywords that affect scoring
    this.temporalKeywords = {
      IMMEDIATE: {
        multiplier: 1.3,
        keywords: ['breaking', 'urgent', 'immediate', 'emergency', 'alert', 'now', 'just in']
      },
      RECENT: {
        multiplier: 1.2,
        keywords: ['today', 'this morning', 'this afternoon', 'tonight', 'earlier today']
      },
      ONGOING: {
        multiplier: 1.15,
        keywords: ['ongoing', 'continues', 'developing', 'evolving', 'unfolding']
      },
      FUTURE: {
        multiplier: 1.1,
        keywords: ['will', 'planned', 'scheduled', 'upcoming', 'next', 'soon']
      },
      PAST: {
        multiplier: 0.9,
        keywords: ['yesterday', 'last week', 'previous', 'earlier', 'former']
      }
    };

    // Event urgency indicators
    this.urgencyIndicators = {
      CRITICAL: {
        multiplier: 1.4,
        keywords: ['attack', 'invasion', 'nuclear', 'crisis', 'emergency', 'threat']
      },
      HIGH: {
        multiplier: 1.2,
        keywords: ['deployment', 'escalation', 'breach', 'incident', 'alert']
      },
      MEDIUM: {
        multiplier: 1.1,
        keywords: ['exercise', 'test', 'meeting', 'announcement', 'statement']
      }
    };

    // Seasonal/cyclical factors
    this.cyclicalFactors = {
      GEOPOLITICAL_EVENTS: {
        'UN_GENERAL_ASSEMBLY': { months: [9], multiplier: 1.1 },
        'NATO_SUMMIT': { irregular: true, multiplier: 1.2 },
        'G7_G20_SUMMITS': { irregular: true, multiplier: 1.15 }
      },
      MILITARY_CYCLES: {
        'BUDGET_CYCLES': { quarters: [1, 4], multiplier: 1.05 },
        'EXERCISE_SEASONS': { months: [3, 4, 5, 9, 10], multiplier: 1.1 }
      }
    };
  }

  /**
   * Calculate temporal factors affecting intelligence value
   * @param {Object} article - Article object with timestamp
   * @returns {Object} Temporal analysis results
   */
  calculateTemporalFactors(article) {
    const articleTime = new Date(article.publishedAt || article.fetchedAt).getTime();
    const now = Date.now();
    const ageHours = (now - articleTime) / (1000 * 60 * 60);

    // Base temporal score
    const baseScore = this.calculateBaseTemporalScore(ageHours);
    
    // Content-based temporal modifiers
    const contentModifiers = this.analyzeTemporalContent(article);
    
    // Urgency assessment
    const urgencyFactor = this.assessUrgency(article);
    
    // Cyclical factors
    const cyclicalFactor = this.calculateCyclicalFactors(new Date(articleTime));
    
    // Combined temporal score
    const finalScore = this.combineTemporalFactors({
      baseScore,
      contentModifiers,
      urgencyFactor,
      cyclicalFactor
    });

    return {
      score: Math.min(Math.max(finalScore, 0), 100),
      ageHours: Math.round(ageHours),
      urgencyFactor: urgencyFactor.factor,
      timeCategory: this.categorizeAge(ageHours),
      breakdown: {
        baseScore,
        contentModifiers,
        urgencyFactor,
        cyclicalFactor,
        finalScore
      },
      analysis: {
        isBreaking: ageHours < 1,
        isRecent: ageHours < 24,
        isCurrent: ageHours < 72,
        isTimeSensitive: urgencyFactor.factor > 1.2
      }
    };
  }

  /**
   * Calculate base temporal score based on article age
   * @param {number} ageHours - Age in hours
   * @returns {Object} Base score analysis
   */
  calculateBaseTemporalScore(ageHours) {
    for (const [category, config] of Object.entries(this.timeDecayConfig)) {
      if (ageHours <= config.maxHours) {
        // Apply exponential decay within category
        const decayFactor = Math.exp(-ageHours / (config.maxHours * 0.3));
        const adjustedScore = config.score * decayFactor;
        
        return {
          score: adjustedScore,
          category,
          urgencyFactor: config.urgencyFactor,
          decayFactor
        };
      }
    }
    
    // Default to historical
    return {
      score: this.timeDecayConfig.HISTORICAL.score,
      category: 'HISTORICAL',
      urgencyFactor: this.timeDecayConfig.HISTORICAL.urgencyFactor,
      decayFactor: 0.1
    };
  }

  /**
   * Analyze temporal content for keywords and indicators
   * @param {Object} article - Article object
   * @returns {Object} Content temporal analysis
   */
  analyzeTemporalContent(article) {
    const content = (article.title + ' ' + (article.content || article.summary || '')).toLowerCase();
    let maxMultiplier = 1.0;
    const matchedKeywords = [];

    // Check temporal keywords
    Object.entries(this.temporalKeywords).forEach(([category, data]) => {
      data.keywords.forEach(keyword => {
        if (content.includes(keyword)) {
          maxMultiplier = Math.max(maxMultiplier, data.multiplier);
          matchedKeywords.push({ category, keyword, multiplier: data.multiplier });
        }
      });
    });

    return {
      multiplier: maxMultiplier,
      matchedKeywords,
      hasTemporalIndicators: matchedKeywords.length > 0
    };
  }

  /**
   * Assess urgency based on content indicators
   * @param {Object} article - Article object
   * @returns {Object} Urgency assessment
   */
  assessUrgency(article) {
    const content = (article.title + ' ' + (article.content || article.summary || '')).toLowerCase();
    let maxUrgency = 1.0;
    let urgencyLevel = 'STANDARD';
    const urgencyIndicators = [];

    // Check urgency indicators
    Object.entries(this.urgencyIndicators).forEach(([level, data]) => {
      data.keywords.forEach(keyword => {
        if (content.includes(keyword)) {
          if (data.multiplier > maxUrgency) {
            maxUrgency = data.multiplier;
            urgencyLevel = level;
          }
          urgencyIndicators.push({ level, keyword, multiplier: data.multiplier });
        }
      });
    });

    return {
      factor: maxUrgency,
      level: urgencyLevel,
      indicators: urgencyIndicators,
      isUrgent: maxUrgency > 1.2
    };
  }

  /**
   * Calculate cyclical factors (seasonal, budget cycles, etc.)
   * @param {Date} articleDate - Article publication date
   * @returns {Object} Cyclical factor analysis
   */
  calculateCyclicalFactors(articleDate) {
    const month = articleDate.getMonth() + 1; // 1-12
    const quarter = Math.ceil(month / 3);
    let cyclicalMultiplier = 1.0;
    const activeCycles = [];

    // Check geopolitical event cycles
    Object.entries(this.cyclicalFactors.GEOPOLITICAL_EVENTS).forEach(([event, config]) => {
      if (config.months && config.months.includes(month)) {
        cyclicalMultiplier = Math.max(cyclicalMultiplier, config.multiplier);
        activeCycles.push({ event, type: 'GEOPOLITICAL', multiplier: config.multiplier });
      }
    });

    // Check military cycles
    Object.entries(this.cyclicalFactors.MILITARY_CYCLES).forEach(([event, config]) => {
      if (config.months && config.months.includes(month)) {
        cyclicalMultiplier = Math.max(cyclicalMultiplier, config.multiplier);
        activeCycles.push({ event, type: 'MILITARY', multiplier: config.multiplier });
      }
      if (config.quarters && config.quarters.includes(quarter)) {
        cyclicalMultiplier = Math.max(cyclicalMultiplier, config.multiplier);
        activeCycles.push({ event, type: 'MILITARY', multiplier: config.multiplier });
      }
    });

    return {
      multiplier: cyclicalMultiplier,
      activeCycles,
      month,
      quarter,
      hasCyclicalFactors: activeCycles.length > 0
    };
  }

  /**
   * Combine all temporal factors into final score
   * @param {Object} factors - All temporal factors
   * @returns {number} Combined temporal score
   */
  combineTemporalFactors({ baseScore, contentModifiers, urgencyFactor, cyclicalFactor }) {
    // Start with base score
    let score = baseScore.score;
    
    // Apply content modifiers
    score *= contentModifiers.multiplier;
    
    // Apply urgency factor
    score *= urgencyFactor.factor;
    
    // Apply cyclical factor
    score *= cyclicalFactor.multiplier;
    
    // Ensure score doesn't exceed 100
    return Math.min(score, 100);
  }

  /**
   * Categorize article age into descriptive categories
   * @param {number} ageHours - Age in hours
   * @returns {string} Age category
   */
  categorizeAge(ageHours) {
    if (ageHours < 1) return 'BREAKING';
    if (ageHours < 6) return 'RECENT';
    if (ageHours < 24) return 'CURRENT';
    if (ageHours < 72) return 'RECENT_PAST';
    if (ageHours < 168) return 'WEEKLY';
    return 'HISTORICAL';
  }

  /**
   * Calculate time-sensitive event priority
   * @param {Object} article - Article object
   * @param {Object} temporalFactors - Calculated temporal factors
   * @returns {Object} Time sensitivity analysis
   */
  calculateTimeSensitivity(article, temporalFactors) {
    const { urgencyFactor, timeCategory } = temporalFactors;
    
    let sensitivity = 'LOW';
    let priority = 'STANDARD';
    
    // Breaking news with high urgency
    if (timeCategory === 'BREAKING' && urgencyFactor.factor > 1.3) {
      sensitivity = 'CRITICAL';
      priority = 'IMMEDIATE';
    }
    // Recent with urgency indicators
    else if (timeCategory === 'RECENT' && urgencyFactor.factor > 1.2) {
      sensitivity = 'HIGH';
      priority = 'HIGH';
    }
    // Current events with moderate urgency
    else if (timeCategory === 'CURRENT' && urgencyFactor.factor > 1.1) {
      sensitivity = 'MEDIUM';
      priority = 'MEDIUM';
    }
    
    return {
      sensitivity,
      priority,
      reasoning: `${timeCategory} event with ${urgencyFactor.level} urgency`,
      actionRequired: sensitivity === 'CRITICAL' || sensitivity === 'HIGH',
      timeWindow: this.calculateActionTimeWindow(sensitivity)
    };
  }

  /**
   * Calculate action time window based on sensitivity
   * @param {string} sensitivity - Time sensitivity level
   * @returns {Object} Action time window
   */
  calculateActionTimeWindow(sensitivity) {
    const windows = {
      CRITICAL: { hours: 1, description: 'Immediate action required' },
      HIGH: { hours: 6, description: 'Action required within 6 hours' },
      MEDIUM: { hours: 24, description: 'Action required within 24 hours' },
      LOW: { hours: 72, description: 'Monitor for developments' }
    };
    
    return windows[sensitivity] || windows.LOW;
  }
}

// Export singleton instance
export const temporalScorerService = new TemporalScorerService();