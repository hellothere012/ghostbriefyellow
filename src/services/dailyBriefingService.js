/**
 * Daily Briefing Service (Legacy Compatibility Layer)
 * Maintains backward compatibility while using the new modular briefing system
 */

import { dailyBriefingGenerator } from './briefing/index.js';

/**
 * Legacy Daily Briefing Service
 * Wrapper around the new modular briefing system for backward compatibility
 */
export class DailyBriefingService {
  constructor() {
    console.log('📰 Daily Briefing Service initialized (using modular architecture)');
  }

  /**
   * Generate daily briefing (legacy method signature)
   * @param {Array} signals - Array of intelligence signals
   * @param {Object} options - Generation options
   * @returns {Object} Generated briefing
   */
  async generateDailyBriefing(signals, options = {}) {
    console.log('🔄 Using legacy compatibility layer - consider migrating to new API');
    
    try {
      const result = await dailyBriefingGenerator.generateDailyBriefing(signals, options);
      
      if (result.success) {
        return result.briefing;
      } else {
        throw new Error(result.error || 'Briefing generation failed');
      }
    } catch (error) {
      console.error('❌ Legacy briefing service error:', error);
      // Return minimal briefing for compatibility
      return dailyBriefingGenerator.generateMinimalBriefing(signals, error.message);
    }
  }

  /**
   * Generate minimal briefing (legacy method)
   * @param {Array} signals - Available signals
   * @param {string} reason - Reason for minimal briefing
   * @returns {Object} Minimal briefing
   */
  generateMinimalBriefing(signals, reason) {
    return dailyBriefingGenerator.generateMinimalBriefing(signals, reason);
  }

  /**
   * Get service statistics (legacy method)
   * @returns {Object} Service statistics
   */
  getStatistics() {
    return dailyBriefingGenerator.getStatistics();
  }

  // Legacy helper methods (simplified versions)
  
  prepareSignalsForBriefing(signals) {
    console.warn('⚠️ prepareSignalsForBriefing is deprecated - handled internally by new system');
    return signals;
  }

  analyzeSignalPatterns(signals) {
    console.warn('⚠️ analyzeSignalPatterns is deprecated - use briefingPatternAnalyzer directly');
    return {};
  }

  assessBriefingQuality(briefing) {
    console.warn('⚠️ assessBriefingQuality is deprecated - use briefingQualityAssessor directly');
    return { overallScore: 70 };
  }

  compileFinalBriefing(briefingData, signals) {
    console.warn('⚠️ compileFinalBriefing is deprecated - use briefingTemplateManager directly');
    return briefingData;
  }
}

// Export singleton instance for backward compatibility
export const dailyBriefingService = new DailyBriefingService();

// Also export the new modular services for migration
export { dailyBriefingGenerator } from './briefing/index.js';