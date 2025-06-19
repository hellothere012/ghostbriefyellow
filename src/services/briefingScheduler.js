// Briefing Scheduler Service for Ghost Brief
// Manages automated daily briefing generation and storage

import { dailyBriefingService } from './dailyBriefingService';

/**
 * Briefing Scheduler Service
 * Handles automatic briefing generation and scheduling
 */
export class BriefingSchedulerService {
  constructor(storageService) {
    this.storageService = storageService;
    this.schedulerConfig = {
      DAILY_BRIEFING_HOUR: 6, // 6 AM local time
      AUTO_GENERATION_ENABLED: true,
      RETENTION_DAYS: 30,
      MAX_BRIEFINGS_STORED: 100
    };
    
    this.briefingHistory = [];
    this.lastBriefingDate = null;
    this.scheduledIntervals = [];
  }

  /**
   * Initialize briefing scheduler
   * @param {Object} options - Scheduler options
   */
  async initialize(options = {}) {
    console.log('📅 Initializing briefing scheduler...');
    
    try {
      // Load existing briefing history
      await this.loadBriefingHistory();
      
      // Check if daily briefing is needed
      await this.checkDailyBriefingStatus();
      
      // Set up automatic scheduling if enabled
      if (options.enableAutoScheduling !== false) {
        this.setupAutomaticScheduling();
      }
      
      console.log('✅ Briefing scheduler initialized successfully');
      return true;
      
    } catch (error) {
      console.error('❌ Failed to initialize briefing scheduler:', error);
      return false;
    }
  }

  /**
   * Generate daily briefing from available signals
   * @param {Object} options - Generation options
   * @returns {Object} Briefing generation result
   */
  async generateDailyBriefing(options = {}) {
    console.log('📰 Generating daily intelligence briefing...');
    
    try {
      // Get all recent signals
      const signals = await this.storageService.getArticles();
      
      if (!signals || signals.length === 0) {
        console.log('⚠️ No signals available for briefing generation');
        return {
          success: false,
          reason: 'No signals available',
          briefing: null
        };
      }

      // Generate the briefing
      const briefingResult = await dailyBriefingService.generateDailyBriefing(signals, options);
      
      if (briefingResult.success) {
        // Store the briefing
        const stored = await this.storeBriefing(briefingResult.briefing);
        
        if (stored) {
          console.log(`✅ Daily briefing generated and stored: ${briefingResult.briefing.id}`);
          this.lastBriefingDate = new Date().toISOString().split('T')[0];
          
          return {
            success: true,
            briefing: briefingResult.briefing,
            metadata: briefingResult.metadata,
            qualityMetrics: briefingResult.qualityMetrics,
            stored: true
          };
        } else {
          console.error('❌ Failed to store briefing');
          return {
            success: true,
            briefing: briefingResult.briefing,
            metadata: briefingResult.metadata,
            qualityMetrics: briefingResult.qualityMetrics,
            stored: false,
            warning: 'Briefing generated but storage failed'
          };
        }
      } else {
        console.log('⚠️ Briefing generation failed, using fallback');
        return {
          success: false,
          reason: briefingResult.error,
          fallbackBriefing: briefingResult.fallbackBriefing
        };
      }
      
    } catch (error) {
      console.error('❌ Daily briefing generation failed:', error);
      return {
        success: false,
        error: error.message,
        briefing: null
      };
    }
  }

  /**
   * Store briefing in the storage system
   * @param {Object} briefing - Briefing to store
   * @returns {boolean} Storage success
   */
  async storeBriefing(briefing) {
    try {
      // Add briefing metadata
      const briefingToStore = {
        ...briefing,
        isPermanent: true,
        type: 'DAILY_BRIEFING',
        createdAt: new Date().toISOString(),
        briefingDate: new Date().toISOString().split('T')[0]
      };
      
      // Store as a permanent brief
      const success = await this.storageService.addBrief(briefingToStore);
      
      if (success) {
        // Update briefing history
        this.briefingHistory.unshift({
          id: briefing.id,
          title: briefing.title,
          date: briefingToStore.briefingDate,
          wordCount: briefing.wordCount,
          sourceSignals: briefing.sourceSignals,
          qualityLevel: briefing.qualityLevel || 'STANDARD'
        });
        
        // Limit history size
        if (this.briefingHistory.length > this.schedulerConfig.MAX_BRIEFINGS_STORED) {
          this.briefingHistory = this.briefingHistory.slice(0, this.schedulerConfig.MAX_BRIEFINGS_STORED);
        }
        
        // Save history
        await this.saveBriefingHistory();
      }
      
      return success;
      
    } catch (error) {
      console.error('❌ Failed to store briefing:', error);
      return false;
    }
  }

  /**
   * Check if daily briefing should be generated
   * @returns {boolean} True if briefing is needed
   */
  async checkDailyBriefingStatus() {
    const today = new Date().toISOString().split('T')[0];
    
    // Check if briefing already generated today
    if (this.lastBriefingDate === today) {
      console.log('📅 Daily briefing already generated for today');
      return false;
    }
    
    // Check if there are any briefings for today in storage
    const existingBriefs = await this.storageService.getBriefs();
    const todaysBriefings = existingBriefs.filter(brief => 
      brief.type === 'DAILY_BRIEFING' && 
      brief.briefingDate === today
    );
    
    if (todaysBriefings.length > 0) {
      console.log('📅 Daily briefing found in storage for today');
      this.lastBriefingDate = today;
      return false;
    }
    
    console.log('📅 Daily briefing needed for today');
    return true;
  }

  /**
   * Set up automatic briefing scheduling
   */
  setupAutomaticScheduling() {
    console.log('⏰ Setting up automatic briefing scheduling...');
    
    // Check every hour if it's time for daily briefing
    const hourlyCheck = setInterval(async () => {
      const now = new Date();
      const currentHour = now.getHours();
      
      // Generate briefing at scheduled hour
      if (currentHour === this.schedulerConfig.DAILY_BRIEFING_HOUR) {
        const needsBriefing = await this.checkDailyBriefingStatus();
        
        if (needsBriefing) {
          console.log('⏰ Scheduled daily briefing generation triggered');
          await this.generateDailyBriefing({
            automated: true,
            scheduledTime: now.toISOString()
          });
        }
      }
    }, 60 * 60 * 1000); // Check every hour
    
    this.scheduledIntervals.push(hourlyCheck);
    
    // Cleanup old briefings daily
    const dailyCleanup = setInterval(async () => {
      await this.cleanupOldBriefings();
    }, 24 * 60 * 60 * 1000); // Once per day
    
    this.scheduledIntervals.push(dailyCleanup);
    
    console.log('✅ Automatic scheduling configured');
  }

  /**
   * Manually trigger daily briefing generation
   * @param {Object} options - Generation options
   * @returns {Object} Generation result
   */
  async triggerManualBriefing(options = {}) {
    console.log('🔧 Manual briefing generation triggered');
    
    return await this.generateDailyBriefing({
      ...options,
      manual: true,
      triggeredAt: new Date().toISOString()
    });
  }

  /**
   * Get recent briefing history
   * @param {number} limit - Number of briefings to return
   * @returns {Array} Recent briefings
   */
  getRecentBriefings(limit = 10) {
    return this.briefingHistory.slice(0, limit);
  }

  /**
   * Get briefing statistics
   * @returns {Object} Briefing statistics
   */
  getBriefingStatistics() {
    const totalBriefings = this.briefingHistory.length;
    const last7Days = this.briefingHistory.filter(briefing => {
      const briefingDate = new Date(briefing.date);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return briefingDate >= weekAgo;
    });
    
    const avgWordCount = totalBriefings > 0 
      ? Math.round(this.briefingHistory.reduce((sum, b) => sum + (b.wordCount || 0), 0) / totalBriefings)
      : 0;
    
    const avgSourceSignals = totalBriefings > 0
      ? Math.round(this.briefingHistory.reduce((sum, b) => sum + (b.sourceSignals || 0), 0) / totalBriefings)
      : 0;

    return {
      totalBriefings,
      briefingsLast7Days: last7Days.length,
      averageWordCount: avgWordCount,
      averageSourceSignals: avgSourceSignals,
      lastBriefingDate: this.lastBriefingDate,
      qualityDistribution: this.calculateQualityDistribution()
    };
  }

  /**
   * Calculate quality distribution of briefings
   * @returns {Object} Quality distribution
   */
  calculateQualityDistribution() {
    const distribution = { PREMIUM: 0, HIGH: 0, STANDARD: 0, BASIC: 0 };
    
    this.briefingHistory.forEach(briefing => {
      const quality = briefing.qualityLevel || 'STANDARD';
      distribution[quality]++;
    });
    
    return distribution;
  }

  /**
   * Load briefing history from storage
   */
  async loadBriefingHistory() {
    try {
      const settings = await this.storageService.getSettings();
      this.briefingHistory = settings.briefingHistory || [];
      this.lastBriefingDate = settings.lastBriefingDate || null;
      
      console.log(`📚 Loaded briefing history: ${this.briefingHistory.length} briefings`);
      
    } catch (error) {
      console.error('❌ Failed to load briefing history:', error);
      this.briefingHistory = [];
      this.lastBriefingDate = null;
    }
  }

  /**
   * Save briefing history to storage
   */
  async saveBriefingHistory() {
    try {
      const settings = await this.storageService.getSettings();
      const updatedSettings = {
        ...settings,
        briefingHistory: this.briefingHistory,
        lastBriefingDate: this.lastBriefingDate
      };
      
      await this.storageService.saveSettings(updatedSettings);
      
    } catch (error) {
      console.error('❌ Failed to save briefing history:', error);
    }
  }

  /**
   * Cleanup old briefings based on retention policy
   */
  async cleanupOldBriefings() {
    try {
      console.log('🧹 Starting briefing cleanup...');
      
      const retentionDate = new Date();
      retentionDate.setDate(retentionDate.getDate() - this.schedulerConfig.RETENTION_DAYS);
      
      // Filter briefing history
      const beforeCount = this.briefingHistory.length;
      this.briefingHistory = this.briefingHistory.filter(briefing => {
        const briefingDate = new Date(briefing.date);
        return briefingDate >= retentionDate;
      });
      
      if (this.briefingHistory.length < beforeCount) {
        await this.saveBriefingHistory();
        console.log(`🧹 Cleaned up ${beforeCount - this.briefingHistory.length} old briefing records`);
      }
      
      // Note: Actual brief documents in storage are managed by the storage service's cleanup
      
    } catch (error) {
      console.error('❌ Briefing cleanup failed:', error);
    }
  }

  /**
   * Update scheduler configuration
   * @param {Object} newConfig - New configuration options
   */
  updateConfig(newConfig) {
    this.schedulerConfig = {
      ...this.schedulerConfig,
      ...newConfig
    };
    
    console.log('⚙️ Briefing scheduler configuration updated');
  }

  /**
   * Disable automatic scheduling
   */
  disableAutoScheduling() {
    this.scheduledIntervals.forEach(interval => clearInterval(interval));
    this.scheduledIntervals = [];
    this.schedulerConfig.AUTO_GENERATION_ENABLED = false;
    
    console.log('⏹️ Automatic briefing scheduling disabled');
  }

  /**
   * Enable automatic scheduling
   */
  enableAutoScheduling() {
    if (this.schedulerConfig.AUTO_GENERATION_ENABLED) {
      console.log('⏰ Automatic scheduling already enabled');
      return;
    }
    
    this.schedulerConfig.AUTO_GENERATION_ENABLED = true;
    this.setupAutomaticScheduling();
    
    console.log('▶️ Automatic briefing scheduling enabled');
  }

  /**
   * Get scheduler status
   * @returns {Object} Scheduler status
   */
  getSchedulerStatus() {
    return {
      autoGenerationEnabled: this.schedulerConfig.AUTO_GENERATION_ENABLED,
      dailyBriefingHour: this.schedulerConfig.DAILY_BRIEFING_HOUR,
      activeIntervals: this.scheduledIntervals.length,
      lastBriefingDate: this.lastBriefingDate,
      retentionDays: this.schedulerConfig.RETENTION_DAYS,
      maxBriefingsStored: this.schedulerConfig.MAX_BRIEFINGS_STORED
    };
  }
}

// Export already handled above at line 10