/**
 * Briefing Section Generators
 * Individual generators for each section of the daily intelligence briefing
 */


/**
 * Section Generation Service for Daily Briefings
 * Generates individual sections with specialized analysis
 */
export class BriefingSectionGenerators {
  constructor() {
    // Threat assessment matrix for different threat types
    this.threatMatrix = {
      NUCLEAR: {
        keywords: ['NUCLEAR', 'URANIUM', 'PLUTONIUM', 'ENRICHMENT', 'REACTOR', 'WARHEAD'],
        severity: 'CRITICAL',
        timeframe: 'IMMEDIATE'
      },
      CYBER: {
        keywords: ['CYBER', 'HACK', 'MALWARE', 'RANSOMWARE', 'BREACH', 'ZERO-DAY'],
        severity: 'HIGH',
        timeframe: 'HOURS'
      },
      MILITARY: {
        keywords: ['MISSILE', 'DEPLOYMENT', 'INVASION', 'STRIKE', 'COMBAT', 'TROOPS'],
        severity: 'HIGH',
        timeframe: 'DAYS'
      },
      TERRORIST: {
        keywords: ['TERRORIST', 'BOMBING', 'ATTACK', 'EXTREMIST', 'PLOT', 'CELL'],
        severity: 'HIGH',
        timeframe: 'IMMEDIATE'
      },
      ECONOMIC: {
        keywords: ['SANCTIONS', 'EMBARGO', 'COLLAPSE', 'INFLATION', 'CRISIS', 'MARKET'],
        severity: 'MEDIUM',
        timeframe: 'WEEKS'
      }
    };

    // Technology intelligence areas
    this.technologyAreas = {
      ARTIFICIAL_INTELLIGENCE: {
        keywords: ['AI', 'ARTIFICIAL INTELLIGENCE', 'MACHINE LEARNING', 'NEURAL', 'DEEP LEARNING'],
        strategicImpact: 'HIGH',
        timeframe: 'MONTHS'
      },
      QUANTUM_TECHNOLOGY: {
        keywords: ['QUANTUM', 'QUANTUM COMPUTING', 'QUANTUM ENCRYPTION', 'QUBITS'],
        strategicImpact: 'CRITICAL',
        timeframe: 'YEARS'
      },
      HYPERSONIC_WEAPONS: {
        keywords: ['HYPERSONIC', 'MACH', 'GLIDE VEHICLE', 'SCRAMJET'],
        strategicImpact: 'CRITICAL',
        timeframe: 'MONTHS'
      },
      SPACE_TECHNOLOGY: {
        keywords: ['SATELLITE', 'SPACE', 'ORBITAL', 'LAUNCH', 'CONSTELLATION'],
        strategicImpact: 'HIGH',
        timeframe: 'MONTHS'
      },
      BIOTECHNOLOGY: {
        keywords: ['BIOWEAPON', 'GENETIC', 'CRISPR', 'BIOTECHNOLOGY', 'PATHOGEN'],
        strategicImpact: 'HIGH',
        timeframe: 'YEARS'
      }
    };
  }

  /**
   * Generate Executive Summary section
   * @param {Array} signals - Filtered signals for analysis
   * @param {Object} patterns - Pattern analysis results
   * @returns {Object} Executive summary section
   */
  async generateExecutiveSummary(signals, patterns) {
    const criticalSignals = signals.filter(s => s.intelligence?.priority === 'CRITICAL');
    const highSignals = signals.filter(s => s.intelligence?.priority === 'HIGH');

    const topThemes = Object.entries(patterns.themes)
      .slice(0, 3)
      .map(([theme, count]) => ({ theme, count }));

    // Top entities analysis
    Object.entries(patterns.entities.countries || {})
      .slice(0, 5)
      .map(([country, count]) => ({ country, count }));

    return {
      title: 'Executive Summary',
      content: {
        overviewStatement: this.generateOverallAssessment(signals, patterns),
        keyHighlights: [
          `${criticalSignals.length} critical intelligence developments identified`,
          `${Object.keys(patterns.regions).length} regions showing significant activity`,
          `Primary focus areas: ${topThemes.map(t => t.theme).join(', ')}`
        ],
        criticalDevelopments: criticalSignals.slice(0, 3).map(signal => ({
          title: signal.title,
          priority: signal.intelligence?.priority,
          entities: signal.intelligence?.entities?.countries?.slice(0, 3) || [],
          timeframe: this.calculateTimeframe(signal)
        })),
        recommendedActions: this.generateExecutiveRecommendations(criticalSignals, patterns)
      },
      metadata: {
        signalCount: signals.length,
        criticalCount: criticalSignals.length,
        highCount: highSignals.length,
        confidence: this.calculateSectionConfidence(signals.slice(0, 5))
      }
    };
  }

  /**
   * Generate Priority Developments section
   * @param {Array} signals - Filtered signals for analysis
   * @returns {Object} Priority developments section
   */
  async generatePriorityDevelopments(signals) {
    const prioritySignals = signals.filter(s => 
      ['CRITICAL', 'HIGH'].includes(s.intelligence?.priority)
    ).slice(0, 8);

    const developments = prioritySignals.map(signal => ({
      title: signal.title,
      summary: this.generateSignalSummary(signal),
      priority: signal.intelligence?.priority,
      relevanceScore: signal.intelligence?.relevanceScore,
      entities: signal.intelligence?.entities,
      timeframe: this.calculateTimeframe(signal),
      source: {
        name: signal.source?.feedName || 'Unknown',
        credibility: signal.source?.credibilityScore || 70
      }
    }));

    return {
      title: 'Priority Intelligence Developments',
      content: {
        developments,
        summary: `${developments.length} priority developments requiring attention`,
        trends: this.identifyDevelopmentTrends(developments)
      },
      metadata: {
        totalDevelopments: developments.length,
        averagePriority: this.calculateAveragePriority(prioritySignals),
        confidence: this.calculateSectionConfidence(prioritySignals)
      }
    };
  }

  /**
   * Generate Threat Assessment section
   * @param {Array} signals - Filtered signals for analysis
   * @param {Object} patterns - Pattern analysis results
   * @returns {Object} Threat assessment section
   */
  async generateThreatAssessment(signals, patterns) {
    const threatSignals = signals.filter(s => 
      ['CRITICAL', 'HIGH'].includes(s.intelligence?.priority)
    );

    const threatsByType = {};

    // Categorize threats by type
    Object.entries(this.threatMatrix).forEach(([threatType, config]) => {
      const relevantSignals = threatSignals.filter(signal => {
        const content = (signal.title + ' ' + (signal.content || signal.summary || '')).toUpperCase();
        return config.keywords.some(keyword => content.includes(keyword));
      });

      if (relevantSignals.length > 0) {
        threatsByType[threatType] = {
          type: threatType,
          signalCount: relevantSignals.length,
          severity: config.severity,
          timeframe: config.timeframe,
          signals: relevantSignals.slice(0, 3),
          riskLevel: this.assessRiskLevel(relevantSignals)
        };
      }
    });

    return {
      title: 'Current Threat Assessment',
      content: {
        threatsByType,
        overallThreatLevel: this.calculateOverallThreatLevel(patterns.threats),
        immediateThreats: this.identifyImmediateThreats(threatSignals),
        emergingThreats: this.identifyEmergingThreats(signals),
        threatTrends: this.analyzeThreatTrends(threatsByType),
        recommendation: this.generateThreatRecommendation(threatsByType)
      },
      metadata: {
        totalThreats: Object.keys(threatsByType).length,
        criticalThreats: Object.values(threatsByType).filter(t => t.severity === 'CRITICAL').length,
        confidence: this.calculateSectionConfidence(threatSignals)
      }
    };
  }

  /**
   * Generate Regional Analysis section
   * @param {Array} signals - Filtered signals for analysis
   * @returns {Object} Regional analysis section
   */
  async generateRegionalAnalysis(signals) {
    const regionalBreakdown = {};

    // Regional classification
    const regionalClassification = {
      'EAST_ASIA': ['CHINA', 'JAPAN', 'SOUTH KOREA', 'NORTH KOREA', 'TAIWAN'],
      'MIDDLE_EAST': ['IRAN', 'ISRAEL', 'SAUDI ARABIA', 'TURKEY', 'UAE', 'IRAQ', 'SYRIA'],
      'EUROPE': ['RUSSIA', 'UKRAINE', 'GERMANY', 'FRANCE', 'UK', 'POLAND'],
      'NORTH_AMERICA': ['USA', 'UNITED STATES', 'CANADA', 'MEXICO'],
      'SOUTH_ASIA': ['INDIA', 'PAKISTAN', 'BANGLADESH', 'AFGHANISTAN']
    };

    Object.entries(regionalClassification).forEach(([region, countries]) => {
      const regionalSignals = signals.filter(signal => {
        const signalCountries = signal.intelligence?.entities?.countries || [];
        return countries.some(country => signalCountries.includes(country));
      });

      if (regionalSignals.length > 0) {
        regionalBreakdown[region] = {
          signalCount: regionalSignals.length,
          primaryCountries: this.getTopEntities(regionalSignals, 'countries', 3),
          dominantThemes: this.getTopCategories(regionalSignals, 3),
          threatLevel: this.calculateRegionalThreatLevel(regionalSignals),
          keyDevelopments: regionalSignals.slice(0, 2).map(signal => ({
            title: signal.title,
            priority: signal.intelligence?.priority,
            entities: signal.intelligence?.entities?.countries || []
          })),
          stabilityIndicators: this.calculateStabilityIndicators(regionalSignals)
        };
      }
    });

    return {
      title: 'Regional Intelligence Analysis',
      content: {
        regionalBreakdown,
        activeRegions: Object.keys(regionalBreakdown).length,
        globalHotspots: this.identifyGlobalHotspots(regionalBreakdown),
        hotspots: this.identifyRegionalHotspots(regionalBreakdown),
        stabilityAssessment: this.assessGlobalStability(regionalBreakdown),
        crossRegionalTrends: this.identifyCrossRegionalTrends(regionalBreakdown)
      },
      metadata: {
        regionsAnalyzed: Object.keys(regionalBreakdown).length,
        totalRegionalSignals: signals.filter(s => 
          s.intelligence?.entities?.countries?.length > 0
        ).length,
        confidence: this.calculateSectionConfidence(signals.filter(s => 
          s.intelligence?.entities?.countries?.length > 0
        ))
      }
    };
  }

  /**
   * Generate Technology Intelligence section
   * @param {Array} signals - Filtered signals for analysis
   * @returns {Object} Technology intelligence section
   */
  async generateTechnologyIntelligence(signals) {
    const techSignals = signals.filter(s => 
      s.intelligence?.categories?.some(cat => 
        ['TECHNOLOGY', 'CYBERSECURITY', 'SCIENCE'].includes(cat)
      )
    );

    const technologyAreas = { ...this.technologyAreas };

    // Analyze each technology area
    Object.entries(technologyAreas).forEach(([area, config]) => {
      config.signals = techSignals.filter(signal => {
        const content = (signal.title + ' ' + (signal.content || signal.summary || '')).toUpperCase();
        return config.keywords.some(keyword => content.includes(keyword));
      });
      config.activityLevel = this.calculateTechnologyActivityLevel(config.signals);
      config.strategicImportance = this.assessStrategicImportance(config.signals, area);
    });

    return {
      title: 'Technology Intelligence Watch',
      content: {
        technologyAreas: Object.fromEntries(
          Object.entries(technologyAreas)
            .filter(([, config]) => config.signals.length > 0)
            .map(([area, config]) => [area, {
              area,
              signalCount: config.signals.length,
              strategicImpact: config.strategicImpact,
              timeframe: config.timeframe,
              activityLevel: config.activityLevel,
              developments: config.signals.slice(0, 2).map(s => ({
                title: s.title,
                priority: s.intelligence?.priority,
                relevance: s.intelligence?.relevanceScore
              })),
              strategicImportance: config.strategicImportance
            }])
        ),
        cyberThreats: this.analyzeCyberThreats(techSignals),
        technologyTrends: this.identifyTechnologyTrends(techSignals),
        emergingTechnologies: this.identifyEmergingTechnologies(techSignals),
        recommendations: this.generateTechnologyRecommendations(technologyAreas)
      },
      metadata: {
        totalTechSignals: techSignals.length,
        activeTechnologyAreas: Object.values(technologyAreas).filter(config => config.signals.length > 0).length,
        confidence: this.calculateSectionConfidence(techSignals)
      }
    };
  }

  /**
   * Generate Strategic Implications section
   * @param {Array} signals - Filtered signals for analysis
   * @param {Object} patterns - Pattern analysis results
   * @returns {Object} Strategic implications section
   */
  async generateStrategicImplications(signals, patterns) {
    const strategicSignals = signals.filter(s => 
      s.intelligence?.relevanceScore >= 70 || 
      ['CRITICAL', 'HIGH'].includes(s.intelligence?.priority)
    );

    return {
      title: 'Strategic Implications Assessment',
      content: {
        timeframes: {
          immediate: this.generateImplications(strategicSignals, 'immediate'),
          shortTerm: this.generateImplications(strategicSignals, 'short_term'),
          longTerm: this.generateImplications(strategicSignals, 'long_term')
        },
        geopoliticalShifts: this.identifyGeopoliticalShifts(patterns),
        powerDynamics: this.analyzePowerDynamics(signals),
        riskFactors: this.identifyRiskFactors(signals),
        opportunities: this.identifyOpportunities(signals),
        scenarios: this.generateStrategicScenarios(strategicSignals, patterns)
      },
      metadata: {
        strategicSignals: strategicSignals.length,
        implicationsAssessed: 3, // immediate, short-term, long-term
        confidence: this.calculateSectionConfidence(strategicSignals)
      }
    };
  }

  /**
   * Generate Recommendations section
   * @param {Array} signals - Filtered signals for analysis
   * @param {Object} patterns - Pattern analysis results
   * @returns {Object} Recommendations section
   */
  async generateRecommendations(signals, patterns) {
    const recommendations = {
      immediate: [],
      shortTerm: [],
      strategic: []
    };

    // Immediate actions for critical signals
    const urgentSignals = signals.filter(s => s.intelligence?.priority === 'CRITICAL');
    urgentSignals.forEach(signal => {
      recommendations.immediate.push({
        action: `Monitor and assess: ${signal.title}`,
        rationale: `Critical priority signal with ${signal.intelligence?.relevanceScore}% relevance`,
        timeframe: 'Immediate (next 6 hours)',
        priority: 'CRITICAL',
        entities: signal.intelligence?.entities?.countries?.slice(0, 3) || []
      });
    });

    // Short-term actions for high priority patterns
    const highPrioritySignals = signals.filter(s => s.intelligence?.priority === 'HIGH');
    if (highPrioritySignals.length > 0) {
      recommendations.shortTerm.push({
        action: `Enhanced monitoring of ${highPrioritySignals.length} high-priority developments`,
        rationale: 'Multiple high-priority signals indicate elevated threat environment',
        timeframe: '24-72 hours',
        priority: 'HIGH',
        affectedRegions: this.getAffectedRegions(highPrioritySignals)
      });
    }

    // Strategic recommendations based on dominant themes
    const dominantThemes = Object.entries(patterns.themes)
      .slice(0, 3)
      .map(([theme, count]) => ({ theme, count }));

    dominantThemes.forEach(({ theme, count }) => {
      recommendations.strategic.push({
        action: `Develop comprehensive ${theme.toLowerCase()} intelligence framework`,
        rationale: `${count} signals in ${theme} category indicate sustained pattern`,
        timeframe: '1-4 weeks',
        priority: 'MEDIUM',
        expectedOutcome: `Enhanced situational awareness in ${theme.toLowerCase()} domain`
      });
    });

    return {
      title: 'Intelligence Recommendations',
      content: {
        immediate: recommendations.immediate,
        shortTerm: recommendations.shortTerm,
        strategic: recommendations.strategic,
        priorityMatrix: this.createPriorityMatrix(recommendations),
        resourceRequirements: this.assessResourceRequirements(recommendations)
      },
      metadata: {
        totalRecommendations: recommendations.immediate.length + recommendations.shortTerm.length + recommendations.strategic.length,
        criticalActions: recommendations.immediate.length,
        confidence: this.calculateSectionConfidence(signals.slice(0, 10))
      }
    };
  }

  // Helper methods

  generateOverallAssessment(signals, patterns) {
    const criticalCount = signals.filter(s => s.intelligence?.priority === 'CRITICAL').length;
    const highCount = signals.filter(s => s.intelligence?.priority === 'HIGH').length;

    if (criticalCount >= 3) {
      return 'HEIGHTENED: Multiple critical intelligence developments require immediate attention';
    } else if (criticalCount >= 1 || highCount >= 5) {
      return 'ELEVATED: Significant intelligence activity with high-priority developments';
    } else if (highCount >= 2) {
      return 'MODERATE: Standard intelligence activity with some priority developments';
    } else {
      return 'ROUTINE: Normal intelligence activity levels observed';
    }
  }

  generateExecutiveRecommendations(criticalSignals, patterns) {
    const recommendations = [];

    if (criticalSignals.length > 0) {
      recommendations.push('Immediate assessment and monitoring of critical developments');
    }

    const topRegion = Object.entries(patterns.regions)[0];
    if (topRegion) {
      recommendations.push(`Enhanced focus on ${topRegion[0].replace('_', ' ')} regional developments`);
    }

    recommendations.push('Continue routine intelligence collection and analysis');

    return recommendations;
  }

  calculateTimeframe(signal) {
    const ageHours = (Date.now() - new Date(signal.publishedAt || signal.fetchedAt).getTime()) / (1000 * 60 * 60);
    if (ageHours < 6) return 'IMMEDIATE';
    if (ageHours < 24) return 'RECENT';
    if (ageHours < 72) return 'CURRENT';
    return 'HISTORICAL';
  }

  calculateSectionConfidence(signals) {
    if (signals.length === 0) return 50;

    const avgConfidence = signals.reduce((sum, signal) => 
      sum + (signal.intelligence?.confidenceLevel || 50), 0) / signals.length;

    const sourceCredibility = signals.reduce((sum, signal) => 
      sum + (signal.source?.credibilityScore || 70), 0) / signals.length;

    return Math.round((avgConfidence * 0.6) + (sourceCredibility * 0.4));
  }

  generateSignalSummary(signal) {
    return signal.summary || signal.content?.substring(0, 200) + '...' || 'Summary not available';
  }

  assessRiskLevel(signals) {
    const avgRelevance = signals.reduce((sum, s) => sum + (s.intelligence?.relevanceScore || 50), 0) / signals.length;
    if (avgRelevance >= 80) return 'HIGH';
    if (avgRelevance >= 60) return 'MEDIUM';
    return 'LOW';
  }

  calculateOverallThreatLevel(threats) {
    const criticalCount = threats.CRITICAL || 0;
    const highCount = threats.HIGH || 0;

    if (criticalCount >= 3) return 'CRITICAL';
    if (criticalCount >= 1 || highCount >= 5) return 'HIGH';
    if (highCount >= 2) return 'MEDIUM';
    return 'LOW';
  }

  getTopEntities(signals, entityType, limit) {
    const entityCounts = {};
    signals.forEach(signal => {
      const entities = signal.intelligence?.entities?.[entityType] || [];
      entities.forEach(entity => {
        entityCounts[entity] = (entityCounts[entity] || 0) + 1;
      });
    });

    return Object.entries(entityCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, limit)
      .map(([entity]) => entity);
  }

  getTopCategories(signals, limit) {
    const categoryCounts = {};
    signals.forEach(signal => {
      const categories = signal.intelligence?.categories || [];
      categories.forEach(category => {
        categoryCounts[category] = (categoryCounts[category] || 0) + 1;
      });
    });

    return Object.entries(categoryCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, limit)
      .map(([category]) => category);
  }

  // Placeholder methods for complex analysis (to be implemented)
  identifyDevelopmentTrends(developments) {
    return ['Increasing military activity', 'Technology advancement acceleration'];
  }

  calculateAveragePriority(signals) {
    const priorityWeights = { CRITICAL: 4, HIGH: 3, MEDIUM: 2, LOW: 1 };
    const totalWeight = signals.reduce((sum, s) => sum + (priorityWeights[s.intelligence?.priority] || 1), 0);
    return totalWeight / signals.length;
  }

  identifyImmediateThreats(signals) {
    return signals.filter(s => s.intelligence?.priority === 'CRITICAL').slice(0, 3);
  }

  identifyEmergingThreats(signals) {
    return ['AI-powered cyberattacks', 'Quantum encryption vulnerabilities'];
  }

  analyzeThreatTrends(threatsByType) {
    return Object.keys(threatsByType).length > 2 ? 'Multiple threat vectors active' : 'Concentrated threat focus';
  }

  generateThreatRecommendation(threatsByType) {
    const threatCount = Object.keys(threatsByType).length;
    if (threatCount >= 3) return 'Enhanced monitoring and immediate threat assessment required';
    if (threatCount >= 2) return 'Continued monitoring with periodic threat review';
    return 'Maintain standard threat monitoring protocols';
  }

  calculateRegionalThreatLevel(signals) {
    const threatSignals = signals.filter(s => ['CRITICAL', 'HIGH'].includes(s.intelligence?.priority));
    const threatRatio = threatSignals.length / signals.length;

    if (threatRatio >= 0.5) return 'HIGH';
    if (threatRatio >= 0.3) return 'MEDIUM';
    return 'LOW';
  }

  identifyRegionalHotspots(regionalBreakdown) {
    return Object.entries(regionalBreakdown)
      .filter(([, data]) => data.threatLevel === 'HIGH')
      .map(([region]) => region);
  }

  assessGlobalStability(regionalBreakdown) {
    const hotspots = this.identifyRegionalHotspots(regionalBreakdown);
    if (hotspots.length >= 3) return 'UNSTABLE';
    if (hotspots.length >= 2) return 'CONCERNING';
    if (hotspots.length >= 1) return 'MONITORED';
    return 'STABLE';
  }

  // Additional placeholder methods
  calculateStabilityIndicators(signals) { return 'Moderate'; }
  identifyGlobalHotspots(breakdown) { return Object.keys(breakdown).slice(0, 2); }
  identifyCrossRegionalTrends(breakdown) { return ['Increased cooperation', 'Trade tensions']; }
  calculateTechnologyActivityLevel(signals) { return signals.length > 5 ? 'High' : 'Moderate'; }
  assessStrategicImportance(signals, area) { return 'High'; }
  analyzeCyberThreats(signals) { return 'Multiple vectors identified'; }
  identifyTechnologyTrends(signals) { return ['AI advancement', 'Quantum research']; }
  identifyEmergingTechnologies(signals) { return ['Neural interfaces', 'Quantum sensors']; }
  generateTechnologyRecommendations(areas) { return ['Monitor AI developments', 'Assess quantum threats']; }
  generateImplications(signals, timeframe) { return [`${timeframe} implications identified`]; }
  identifyGeopoliticalShifts(patterns) { return ['Power balance changes']; }
  analyzePowerDynamics(signals) { return 'Shifting alliances observed'; }
  identifyRiskFactors(signals) { return ['Regional instability', 'Technology gaps']; }
  identifyOpportunities(signals) { return ['Diplomatic openings', 'Technology partnerships']; }
  generateStrategicScenarios(signals, patterns) { return ['Best case', 'Most likely', 'Worst case']; }
  getAffectedRegions(signals) { return ['East Asia', 'Middle East']; }
  createPriorityMatrix(recommendations) { return 'High impact, medium effort'; }
  assessResourceRequirements(recommendations) { return 'Standard analytical resources'; }
}

// Export singleton instance
export const briefingSectionGenerators = new BriefingSectionGenerators();