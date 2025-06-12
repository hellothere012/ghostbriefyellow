/**
 * Briefing Pattern Analyzer
 * Analyzes patterns and trends in intelligence signals for briefing generation
 */


/**
 * Pattern Analysis Service for Daily Briefings
 * Extracts themes, entities, threats, and regional patterns from signals
 */
export class BriefingPatternAnalyzer {
  constructor() {
    // Regional classification for geopolitical analysis
    this.regionalClassification = {
      'EAST_ASIA': ['CHINA', 'JAPAN', 'SOUTH KOREA', 'NORTH KOREA', 'TAIWAN', 'MONGOLIA'],
      'SOUTH_ASIA': ['INDIA', 'PAKISTAN', 'BANGLADESH', 'SRI LANKA', 'AFGHANISTAN', 'NEPAL'],
      'SOUTHEAST_ASIA': ['VIETNAM', 'THAILAND', 'SINGAPORE', 'MALAYSIA', 'INDONESIA', 'PHILIPPINES'],
      'MIDDLE_EAST': ['IRAN', 'ISRAEL', 'SAUDI ARABIA', 'TURKEY', 'UAE', 'IRAQ', 'SYRIA', 'LEBANON'],
      'EUROPE': ['RUSSIA', 'UKRAINE', 'GERMANY', 'FRANCE', 'UK', 'POLAND', 'ITALY', 'SPAIN'],
      'NORTH_AMERICA': ['USA', 'UNITED STATES', 'CANADA', 'MEXICO'],
      'SOUTH_AMERICA': ['BRAZIL', 'ARGENTINA', 'VENEZUELA', 'COLOMBIA', 'CHILE', 'PERU'],
      'AFRICA': ['SOUTH AFRICA', 'NIGERIA', 'EGYPT', 'ETHIOPIA', 'KENYA', 'MOROCCO'],
      'OCEANIA': ['AUSTRALIA', 'NEW ZEALAND', 'FIJI', 'PAPUA NEW GUINEA']
    };
  }

  /**
   * Analyze comprehensive patterns in signal data
   * @param {Array} signals - Array of signal objects
   * @returns {Object} Pattern analysis results
   */
  analyzeSignalPatterns(signals) {
    const patterns = {
      themes: {},
      entities: { countries: {}, organizations: {}, technologies: {}, weapons: {} },
      threats: { CRITICAL: 0, HIGH: 0, MEDIUM: 0, LOW: 0 },
      regions: {},
      timeline: this.analyzeTemporalPatterns(signals),
      correlations: this.findSignalCorrelations(signals)
    };

    // Analyze thematic patterns
    this.analyzeThematicPatterns(signals, patterns);
    
    // Analyze entity patterns
    this.analyzeEntityPatterns(signals, patterns);
    
    // Analyze threat patterns
    this.analyzeThreatPatterns(signals, patterns);
    
    // Analyze regional patterns
    this.analyzeRegionalPatterns(signals, patterns);

    return patterns;
  }

  /**
   * Analyze thematic patterns in signals
   * @param {Array} signals - Signal array
   * @param {Object} patterns - Pattern object to populate
   */
  analyzeThematicPatterns(signals, patterns) {
    signals.forEach(signal => {
      const categories = signal.intelligence?.categories || [];
      categories.forEach(category => {
        patterns.themes[category] = (patterns.themes[category] || 0) + 1;
      });
    });

    // Sort themes by frequency
    patterns.themes = Object.fromEntries(
      Object.entries(patterns.themes)
        .sort(([,a], [,b]) => b - a)
    );
  }

  /**
   * Analyze entity patterns across signals
   * @param {Array} signals - Signal array
   * @param {Object} patterns - Pattern object to populate
   */
  analyzeEntityPatterns(signals, patterns) {
    signals.forEach(signal => {
      const entities = signal.intelligence?.entities || {};
      Object.entries(entities).forEach(([entityType, entityList]) => {
        if (!patterns.entities[entityType]) patterns.entities[entityType] = {};
        
        entityList.forEach(entity => {
          patterns.entities[entityType][entity] = (patterns.entities[entityType][entity] || 0) + 1;
        });
      });
    });

    // Sort entities by frequency within each type
    Object.keys(patterns.entities).forEach(entityType => {
      patterns.entities[entityType] = Object.fromEntries(
        Object.entries(patterns.entities[entityType])
          .sort(([,a], [,b]) => b - a)
          .slice(0, 10) // Keep top 10 entities per type
      );
    });
  }

  /**
   * Analyze threat level patterns
   * @param {Array} signals - Signal array
   * @param {Object} patterns - Pattern object to populate
   */
  analyzeThreatPatterns(signals, patterns) {
    signals.forEach(signal => {
      const threatLevel = signal.intelligence?.priority || 'LOW';
      patterns.threats[threatLevel] = (patterns.threats[threatLevel] || 0) + 1;
    });
  }

  /**
   * Analyze regional distribution patterns
   * @param {Array} signals - Signal array
   * @param {Object} patterns - Pattern object to populate
   */
  analyzeRegionalPatterns(signals, patterns) {
    signals.forEach(signal => {
      const countries = signal.intelligence?.entities?.countries || [];
      countries.forEach(country => {
        const region = this.getRegionForCountry(country);
        if (region) {
          patterns.regions[region] = (patterns.regions[region] || 0) + 1;
        }
      });
    });

    // Sort regions by activity level
    patterns.regions = Object.fromEntries(
      Object.entries(patterns.regions)
        .sort(([,a], [,b]) => b - a)
    );
  }

  /**
   * Analyze temporal patterns in signals
   * @param {Array} signals - Signal array
   * @returns {Object} Temporal pattern analysis
   */
  analyzeTemporalPatterns(signals) {
    const timeline = {
      hourlyDistribution: new Array(24).fill(0),
      trendDirection: 'stable',
      peakHours: [],
      activityLevel: 'normal'
    };

    // Analyze hourly distribution
    signals.forEach(signal => {
      const date = new Date(signal.publishedAt || signal.fetchedAt);
      const hour = date.getHours();
      timeline.hourlyDistribution[hour]++;
    });

    // Find peak activity hours
    const maxActivity = Math.max(...timeline.hourlyDistribution);
    timeline.peakHours = timeline.hourlyDistribution
      .map((count, hour) => ({ hour, count }))
      .filter(({ count }) => count >= maxActivity * 0.8)
      .map(({ hour }) => hour);

    // Determine activity level
    const totalSignals = signals.length;
    if (totalSignals > 50) timeline.activityLevel = 'high';
    else if (totalSignals > 20) timeline.activityLevel = 'elevated';
    else if (totalSignals < 5) timeline.activityLevel = 'low';

    return timeline;
  }

  /**
   * Find correlations between signals
   * @param {Array} signals - Signal array
   * @returns {Object} Correlation analysis
   */
  findSignalCorrelations(signals) {
    const correlations = {
      entityCoOccurrence: {},
      categoryOverlap: {},
      temporalClusters: []
    };

    // Analyze entity co-occurrence
    this.analyzeEntityCoOccurrence(signals, correlations);
    
    // Analyze category overlap
    this.analyzeCategoryOverlap(signals, correlations);
    
    // Find temporal clusters
    this.findTemporalClusters(signals, correlations);

    return correlations;
  }

  /**
   * Analyze entity co-occurrence patterns
   * @param {Array} signals - Signal array
   * @param {Object} correlations - Correlation object to populate
   */
  analyzeEntityCoOccurrence(signals, correlations) {
    signals.forEach(signal => {
      const entities = signal.intelligence?.entities || {};
      const countries = entities.countries || [];
      const organizations = entities.organizations || [];

      // Find country-organization pairs
      countries.forEach(country => {
        organizations.forEach(org => {
          const pair = `${country}|${org}`;
          correlations.entityCoOccurrence[pair] = (correlations.entityCoOccurrence[pair] || 0) + 1;
        });
      });
    });

    // Keep only significant co-occurrences (appears more than once)
    correlations.entityCoOccurrence = Object.fromEntries(
      Object.entries(correlations.entityCoOccurrence)
        .filter(([, count]) => count > 1)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 20)
    );
  }

  /**
   * Analyze category overlap patterns
   * @param {Array} signals - Signal array
   * @param {Object} correlations - Correlation object to populate
   */
  analyzeCategoryOverlap(signals, correlations) {
    signals.forEach(signal => {
      const categories = signal.intelligence?.categories || [];
      
      // Find category pairs that appear together
      for (let i = 0; i < categories.length; i++) {
        for (let j = i + 1; j < categories.length; j++) {
          const pair = [categories[i], categories[j]].sort().join('|');
          correlations.categoryOverlap[pair] = (correlations.categoryOverlap[pair] || 0) + 1;
        }
      }
    });

    // Keep significant overlaps
    correlations.categoryOverlap = Object.fromEntries(
      Object.entries(correlations.categoryOverlap)
        .filter(([, count]) => count > 1)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 10)
    );
  }

  /**
   * Find temporal clusters of related signals
   * @param {Array} signals - Signal array
   * @param {Object} correlations - Correlation object to populate
   */
  findTemporalClusters(signals, correlations) {
    const timeWindows = [1, 3, 6, 12]; // Hours
    
    timeWindows.forEach(windowHours => {
      const clusters = this.findClustersInTimeWindow(signals, windowHours);
      if (clusters.length > 0) {
        correlations.temporalClusters.push({
          windowHours,
          clusters: clusters.slice(0, 5) // Top 5 clusters
        });
      }
    });
  }

  /**
   * Find signal clusters within a specific time window
   * @param {Array} signals - Signal array
   * @param {number} windowHours - Time window in hours
   * @returns {Array} Array of signal clusters
   */
  findClustersInTimeWindow(signals, windowHours) {
    const clusters = [];
    const windowMs = windowHours * 60 * 60 * 1000;
    
    // Sort signals by time
    const sortedSignals = signals.sort((a, b) => 
      new Date(a.publishedAt || a.fetchedAt) - new Date(b.publishedAt || b.fetchedAt)
    );

    // Find clusters using sliding window
    for (let i = 0; i < sortedSignals.length; i++) {
      const baseTime = new Date(sortedSignals[i].publishedAt || sortedSignals[i].fetchedAt);
      const cluster = [sortedSignals[i]];

      for (let j = i + 1; j < sortedSignals.length; j++) {
        const signalTime = new Date(sortedSignals[j].publishedAt || sortedSignals[j].fetchedAt);
        if (signalTime - baseTime <= windowMs) {
          cluster.push(sortedSignals[j]);
        } else {
          break;
        }
      }

      if (cluster.length >= 3) { // Minimum cluster size
        clusters.push({
          timeWindow: { start: baseTime, end: new Date(baseTime.getTime() + windowMs) },
          signalCount: cluster.length,
          averageRelevance: cluster.reduce((sum, s) => sum + (s.intelligence?.relevanceScore || 0), 0) / cluster.length,
          dominantCategories: this.getDominantCategories(cluster),
          topEntities: this.getTopEntitiesFromCluster(cluster)
        });
      }
    }

    return clusters.sort((a, b) => b.signalCount - a.signalCount);
  }

  /**
   * Get dominant categories from a cluster of signals
   * @param {Array} cluster - Signal cluster
   * @returns {Array} Dominant categories
   */
  getDominantCategories(cluster) {
    const categories = {};
    cluster.forEach(signal => {
      (signal.intelligence?.categories || []).forEach(category => {
        categories[category] = (categories[category] || 0) + 1;
      });
    });

    return Object.entries(categories)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([category]) => category);
  }

  /**
   * Get top entities from a signal cluster
   * @param {Array} cluster - Signal cluster
   * @returns {Object} Top entities by type
   */
  getTopEntitiesFromCluster(cluster) {
    const entities = { countries: {}, organizations: {}, technologies: {} };
    
    cluster.forEach(signal => {
      const signalEntities = signal.intelligence?.entities || {};
      Object.entries(signalEntities).forEach(([type, entityList]) => {
        if (entities[type]) {
          entityList.forEach(entity => {
            entities[type][entity] = (entities[type][entity] || 0) + 1;
          });
        }
      });
    });

    // Return top 3 entities per type
    return Object.fromEntries(
      Object.entries(entities).map(([type, entityCounts]) => [
        type,
        Object.entries(entityCounts)
          .sort(([,a], [,b]) => b - a)
          .slice(0, 3)
          .map(([entity]) => entity)
      ])
    );
  }

  /**
   * Get region for a country
   * @param {string} country - Country name
   * @returns {string|null} Region name or null
   */
  getRegionForCountry(country) {
    for (const [region, countries] of Object.entries(this.regionalClassification)) {
      if (countries.includes(country.toUpperCase())) {
        return region;
      }
    }
    return null;
  }

  /**
   * Calculate pattern significance score
   * @param {Object} patterns - Pattern analysis results
   * @returns {number} Significance score (0-100)
   */
  calculatePatternSignificance(patterns) {
    let score = 0;

    // Theme diversity
    const themeCount = Object.keys(patterns.themes).length;
    score += Math.min(themeCount * 5, 25);

    // Entity richness
    const totalEntities = Object.values(patterns.entities)
      .reduce((sum, entityType) => sum + Object.keys(entityType).length, 0);
    score += Math.min(totalEntities * 2, 20);

    // Threat distribution
    const threatLevels = Object.keys(patterns.threats).filter(level => patterns.threats[level] > 0);
    score += threatLevels.length * 10;

    // Regional coverage
    const regionCount = Object.keys(patterns.regions).length;
    score += Math.min(regionCount * 5, 25);

    // Correlation complexity
    const correlationCount = Object.keys(patterns.correlations.entityCoOccurrence).length +
                           Object.keys(patterns.correlations.categoryOverlap).length;
    score += Math.min(correlationCount * 2, 20);

    return Math.min(score, 100);
  }
}

// Export singleton instance
export const briefingPatternAnalyzer = new BriefingPatternAnalyzer();