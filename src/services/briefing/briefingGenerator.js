/**
 * Daily Briefing Generator
 * Main orchestrator for generating comprehensive intelligence briefings
 */

import { briefingPatternAnalyzer } from './patternAnalyzer.js';
import { briefingSectionGenerators } from './sectionGenerators.js';
import { briefingQualityAssessor } from './qualityAssessor.js';
import { briefingTemplateManager } from './templateManager.js';
import { formatIntelligenceDate } from '../../utils/dateHelpers.js';
import { withErrorHandling } from '../../utils/errorHelpers.js';

/**
 * Daily Briefing Generator Service
 * Orchestrates the complete briefing generation process
 */
export class DailyBriefingGenerator {
  constructor() {
    // Briefing generation configuration
    this.config = {
      DAILY_ANALYSIS_HOURS: 24,
      MINIMUM_SIGNALS_FOR_BRIEFING: 3,
      MAXIMUM_SIGNALS_PER_BRIEFING: 15,
      PRIORITY_WEIGHT_MULTIPLIER: {
        'CRITICAL': 5.0,
        'HIGH': 3.0,
        'MEDIUM': 1.5,
        'LOW': 1.0
      },
      DEFAULT_TEMPLATE: 'STANDARD',
      QUALITY_THRESHOLD: 70
    };

    // Generation statistics
    this.statistics = {
      briefingsGenerated: 0,
      averageQualityScore: 0,
      lastGenerationTime: null,
      totalProcessingTime: 0
    };
  }

  /**
   * Generate complete daily intelligence briefing
   * @param {Array} signals - Array of intelligence signals
   * @param {Object} options - Generation options
   * @returns {Object} Complete briefing with quality assessment
   */
  async generateDailyBriefing(signals, options = {}) {
    const startTime = Date.now();
    console.log(`📰 Generating daily intelligence briefing from ${signals.length} signals...`);

    try {
      // Initialize briefing data structure
      const briefingData = {
        metadata: this.createBriefingMetadata(options),
        sections: {},
        patterns: null,
        quality: null
      };

      // Step 1: Prepare and filter signals
      const preparedSignals = this.prepareSignalsForBriefing(signals);
      console.log(`📊 Prepared ${preparedSignals.length} signals for analysis`);

      // Check minimum signal requirement
      if (preparedSignals.length < this.config.MINIMUM_SIGNALS_FOR_BRIEFING) {
        console.warn(`⚠️ Insufficient signals (${preparedSignals.length}) for comprehensive briefing`);
        return this.generateMinimalBriefing(preparedSignals, 'Insufficient signals for comprehensive briefing');
      }

      // Step 2: Analyze signal patterns
      console.log('🔍 Analyzing signal patterns...');
      briefingData.patterns = briefingPatternAnalyzer.analyzeSignalPatterns(preparedSignals);

      // Step 3: Generate individual sections
      console.log('📝 Generating briefing sections...');
      await this.generateAllSections(briefingData, preparedSignals);

      // Step 4: Compile final briefing
      console.log('📋 Compiling final briefing...');
      const templateType = options.template || this.config.DEFAULT_TEMPLATE;
      const compiledBriefing = briefingTemplateManager.compileFinalBriefing(
        briefingData,
        preparedSignals,
        templateType
      );

      // Step 5: Assess briefing quality
      console.log('🎯 Assessing briefing quality...');
      compiledBriefing.quality = briefingQualityAssessor.assessBriefingQuality(compiledBriefing);

      // Step 6: Update statistics
      const processingTime = Date.now() - startTime;
      this.updateStatistics(compiledBriefing.quality.overallScore, processingTime);

      console.log(`✅ Daily briefing generated successfully`);
      console.log(`   - Quality Score: ${compiledBriefing.quality.overallScore}%`);
      console.log(`   - Processing Time: ${processingTime}ms`);
      console.log(`   - Sections: ${Object.keys(briefingData.sections).length}`);

      return {
        success: true,
        briefing: compiledBriefing,
        statistics: {
          signalsProcessed: preparedSignals.length,
          sectionsGenerated: Object.keys(briefingData.sections).length,
          qualityScore: compiledBriefing.quality.overallScore,
          processingTimeMs: processingTime
        },
        generatedAt: new Date().toISOString()
      };

    } catch (error) {
      console.error('❌ Daily briefing generation failed:', error);
      
      return {
        success: false,
        error: error.message,
        fallbackBriefing: this.generateMinimalBriefing(signals, error.message),
        generatedAt: new Date().toISOString()
      };
    }
  }

  /**
   * Generate all briefing sections
   * @param {Object} briefingData - Briefing data object to populate
   * @param {Array} signals - Prepared signals
   */
  async generateAllSections(briefingData, signals) {
    const patterns = briefingData.patterns;

    // Generate sections in parallel for better performance
    const sectionPromises = [
      this.generateSectionSafely('EXECUTIVE_SUMMARY', 
        briefingSectionGenerators.generateExecutiveSummary(signals, patterns)),
      
      this.generateSectionSafely('PRIORITY_DEVELOPMENTS', 
        briefingSectionGenerators.generatePriorityDevelopments(signals)),
      
      this.generateSectionSafely('THREAT_ASSESSMENT', 
        briefingSectionGenerators.generateThreatAssessment(signals, patterns)),
      
      this.generateSectionSafely('REGIONAL_ANALYSIS', 
        briefingSectionGenerators.generateRegionalAnalysis(signals)),
      
      this.generateSectionSafely('TECHNOLOGY_INTELLIGENCE', 
        briefingSectionGenerators.generateTechnologyIntelligence(signals)),
      
      this.generateSectionSafely('STRATEGIC_IMPLICATIONS', 
        briefingSectionGenerators.generateStrategicImplications(signals, patterns)),
      
      this.generateSectionSafely('RECOMMENDATIONS', 
        briefingSectionGenerators.generateRecommendations(signals, patterns))
    ];

    // Wait for all sections to complete
    const sectionResults = await Promise.allSettled(sectionPromises);

    // Process results and handle any failures
    const sectionNames = [
      'EXECUTIVE_SUMMARY', 'PRIORITY_DEVELOPMENTS', 'THREAT_ASSESSMENT',
      'REGIONAL_ANALYSIS', 'TECHNOLOGY_INTELLIGENCE', 'STRATEGIC_IMPLICATIONS', 'RECOMMENDATIONS'
    ];

    sectionResults.forEach((result, index) => {
      const sectionName = sectionNames[index];
      
      if (result.status === 'fulfilled' && result.value) {
        briefingData.sections[sectionName] = result.value;
        console.log(`✅ Generated ${sectionName} section`);
      } else {
        console.warn(`⚠️ Failed to generate ${sectionName} section:`, result.reason);
        briefingData.sections[sectionName] = this.createFallbackSection(sectionName, result.reason);
      }
    });
  }

  /**
   * Generate section with error handling
   * @param {string} sectionName - Name of the section
   * @param {Promise} sectionPromise - Promise that generates the section
   * @returns {Promise} Section result
   */
  async generateSectionSafely(sectionName, sectionPromise) {
    try {
      return await sectionPromise;
    } catch (error) {
      console.error(`Error generating ${sectionName}:`, error);
      throw error;
    }
  }

  /**
   * Create briefing metadata
   * @param {Object} options - Generation options
   * @returns {Object} Briefing metadata
   */
  createBriefingMetadata(options) {
    const now = new Date();
    const dateString = now.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });

    return {
      title: `Daily Intelligence Briefing - ${dateString}`,
      classification: 'INTELLIGENCE ASSESSMENT',
      generatedAt: now.toISOString(),
      reportingPeriod: `${new Date(now - 24*60*60*1000).toISOString().split('T')[0]} to ${now.toISOString().split('T')[0]}`,
      briefingId: `DIB-${now.toISOString().split('T')[0].replace(/-/g, '')}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      version: '2.0',
      templateType: options.template || this.config.DEFAULT_TEMPLATE,
      generatedBy: 'Ghost Brief Intelligence Platform',
      ...options.metadata
    };
  }

  /**
   * Prepare signals for briefing generation
   * @param {Array} signals - Raw signals array
   * @returns {Array} Filtered and weighted signals
   */
  prepareSignalsForBriefing(signals) {
    const now = Date.now();
    const analysisWindow = this.config.DAILY_ANALYSIS_HOURS * 60 * 60 * 1000;
    const cutoffTime = now - analysisWindow;

    // Filter signals within analysis window
    const recentSignals = signals.filter(signal => {
      const signalTime = new Date(signal.publishedAt || signal.fetchedAt).getTime();
      return signalTime >= cutoffTime;
    });

    // Add briefing weight to each signal
    const weightedSignals = recentSignals.map(signal => ({
      ...signal,
      briefingWeight: this.calculateBriefingWeight(signal)
    }));

    // Sort by briefing weight and limit to maximum
    return weightedSignals
      .sort((a, b) => b.briefingWeight - a.briefingWeight)
      .slice(0, this.config.MAXIMUM_SIGNALS_PER_BRIEFING);
  }

  /**
   * Calculate briefing weight for signal prioritization
   * @param {Object} signal - Signal object
   * @returns {number} Briefing weight score
   */
  calculateBriefingWeight(signal) {
    const relevanceScore = signal.intelligence?.relevanceScore || 50;
    const confidenceLevel = signal.intelligence?.confidenceLevel || 50;
    const priority = signal.intelligence?.priority || 'LOW';
    const priorityMultiplier = this.config.PRIORITY_WEIGHT_MULTIPLIER[priority] || 1.0;

    // Time decay factor (newer signals get higher weight)
    const ageHours = (Date.now() - new Date(signal.publishedAt || signal.fetchedAt).getTime()) / (1000 * 60 * 60);
    const timeFactor = Math.max(0.3, 1.0 - (ageHours / 24));

    // Source credibility factor
    const credibilityFactor = (signal.source?.credibilityScore || 70) / 100;

    return (relevanceScore * 0.3 + confidenceLevel * 0.2) * priorityMultiplier * timeFactor * credibilityFactor;
  }

  /**
   * Generate minimal briefing for error cases or insufficient data
   * @param {Array} signals - Available signals
   * @param {string} reason - Reason for minimal briefing
   * @returns {Object} Minimal briefing object
   */
  generateMinimalBriefing(signals, reason) {
    const now = new Date();
    const dateString = now.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });

    const briefingText = `# Minimal Intelligence Briefing - ${dateString}

**Classification:** INTELLIGENCE UPDATE  
**Date:** ${formatIntelligenceDate(now)}  
**Status:** LIMITED DATA BRIEFING  

## Status Notice

${reason}

## Available Intelligence

${signals.length > 0 ? 
  signals.slice(0, 3).map((signal, index) => 
    `${index + 1}. **${signal.title}** (${signal.intelligence?.priority || 'MEDIUM'})\n   - Source: ${signal.source?.feedName || 'Unknown'}\n   - Time: ${new Date(signal.publishedAt || signal.fetchedAt).toLocaleString()}`
  ).join('\n\n') : 
  'No recent intelligence signals available for analysis.'
}

## Recommendations

- Monitor for additional intelligence signals
- Maintain standard operational awareness
- Next full briefing scheduled for tomorrow at 06:00 UTC

---

**Generated:** ${formatIntelligenceDate(now)}  
**Distribution:** AUTHORIZED PERSONNEL ONLY  

*This is a minimal briefing due to insufficient data. Full briefing capabilities will resume when adequate intelligence signals are available.*`;

    return {
      id: `DIB-MINIMAL-${now.toISOString().split('T')[0].replace(/-/g, '')}`,
      title: `Minimal Intelligence Briefing - ${dateString}`,
      content: briefingText.trim(),
      sections: { MINIMAL: { title: 'Minimal Update', content: reason } },
      quality: { overallScore: 45, qualityGrade: 'D (Minimal Data)' },
      metadata: this.createBriefingMetadata({ template: 'MINIMAL' }),
      statistics: { signalsProcessed: signals.length, qualityScore: 45 },
      generatedAt: now.toISOString()
    };
  }

  /**
   * Create fallback section for failed generation
   * @param {string} sectionName - Name of the section
   * @param {Error} error - Error that caused failure
   * @returns {Object} Fallback section
   */
  createFallbackSection(sectionName, error) {
    return {
      title: sectionName.replace('_', ' '),
      content: {
        error: 'Section generation failed',
        reason: error?.message || 'Unknown error',
        fallbackMessage: `Unable to generate ${sectionName.toLowerCase()} section. Manual review recommended.`
      },
      metadata: {
        confidence: 0,
        generationFailed: true,
        errorTime: new Date().toISOString()
      }
    };
  }

  /**
   * Update generation statistics
   * @param {number} qualityScore - Quality score of generated briefing
   * @param {number} processingTime - Processing time in milliseconds
   */
  updateStatistics(qualityScore, processingTime) {
    this.statistics.briefingsGenerated++;
    this.statistics.lastGenerationTime = Date.now();
    this.statistics.totalProcessingTime += processingTime;
    
    // Update rolling average quality score
    const currentAvg = this.statistics.averageQualityScore;
    const count = this.statistics.briefingsGenerated;
    this.statistics.averageQualityScore = (currentAvg * (count - 1) + qualityScore) / count;
  }

  /**
   * Get generation statistics
   * @returns {Object} Current statistics
   */
  getStatistics() {
    return {
      ...this.statistics,
      averageProcessingTime: this.statistics.totalProcessingTime / Math.max(this.statistics.briefingsGenerated, 1)
    };
  }

  /**
   * Reset statistics (for testing or maintenance)
   */
  resetStatistics() {
    this.statistics = {
      briefingsGenerated: 0,
      averageQualityScore: 0,
      lastGenerationTime: null,
      totalProcessingTime: 0
    };
  }

  /**
   * Validate briefing generation requirements
   * @param {Array} signals - Input signals
   * @param {Object} options - Generation options
   * @returns {Object} Validation result
   */
  validateGenerationRequirements(signals, options = {}) {
    const validation = {
      isValid: true,
      errors: [],
      warnings: []
    };

    if (!Array.isArray(signals)) {
      validation.errors.push('Signals must be an array');
      validation.isValid = false;
    }

    if (signals.length === 0) {
      validation.errors.push('No signals provided for briefing generation');
      validation.isValid = false;
    }

    if (signals.length < this.config.MINIMUM_SIGNALS_FOR_BRIEFING) {
      validation.warnings.push(`Low signal count (${signals.length}). Minimum recommended: ${this.config.MINIMUM_SIGNALS_FOR_BRIEFING}`);
    }

    const recentSignals = signals.filter(signal => {
      const ageHours = (Date.now() - new Date(signal.publishedAt || signal.fetchedAt)) / (1000 * 60 * 60);
      return ageHours <= this.config.DAILY_ANALYSIS_HOURS;
    });

    if (recentSignals.length < signals.length * 0.5) {
      validation.warnings.push('Most signals are older than analysis window. Briefing may lack current intelligence.');
    }

    if (options.template && !briefingTemplateManager.templates[options.template]) {
      validation.errors.push(`Unknown template type: ${options.template}`);
      validation.isValid = false;
    }

    return validation;
  }
}

// Create and export wrapped service with error handling
const briefingGeneratorInstance = new DailyBriefingGenerator();

export const dailyBriefingGenerator = {
  generateDailyBriefing: withErrorHandling(
    briefingGeneratorInstance.generateDailyBriefing.bind(briefingGeneratorInstance),
    'dailyBriefingGeneration'
  ),
  generateMinimalBriefing: briefingGeneratorInstance.generateMinimalBriefing.bind(briefingGeneratorInstance),
  validateGenerationRequirements: briefingGeneratorInstance.validateGenerationRequirements.bind(briefingGeneratorInstance),
  getStatistics: briefingGeneratorInstance.getStatistics.bind(briefingGeneratorInstance),
  resetStatistics: briefingGeneratorInstance.resetStatistics.bind(briefingGeneratorInstance)
};

// Class already exported above