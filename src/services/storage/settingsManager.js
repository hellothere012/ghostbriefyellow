// Settings Management Module for Ghost Brief
// Specialized application settings and user preferences

/**
 * Settings Manager Service
 * Handles all application settings and user preferences
 */
export class SettingsManagerService {
  constructor() {
    this.STORAGE_KEY = 'ghost_brief_settings';
    this.DEFAULTS = {
      autoRefreshInterval: 30, // minutes
      maxArticlesToStore: 1000,
      defaultView: 'dashboard',
      theme: 'dark',
      notifications: {
        enabled: true,
        criticalAlerts: true,
        briefingReady: true,
        feedErrors: false
      },
      filtering: {
        minRelevanceScore: 40,
        showLowPriority: true,
        hideAdvertisements: true,
        maxArticleAge: 168 // hours (7 days)
      },
      briefing: {
        autoGenerate: true,
        generationTime: '06:00',
        includeWeekends: false,
        minSignalsRequired: 5
      },
      display: {
        articlesPerPage: 20,
        showThumbnails: true,
        compactView: false,
        sortBy: 'publishedAt',
        sortOrder: 'desc'
      },
      advanced: {
        enableDeveloperMode: false,
        verboseLogging: false,
        experimentalFeatures: false
      }
    };
  }

  /**
   * Get all settings
   * @returns {Object} Settings object
   */
  getSettings() {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      const userSettings = stored ? JSON.parse(stored) : {};
      
      // Merge with defaults to ensure all settings exist
      return this.mergeWithDefaults(userSettings);
    } catch (error) {
      console.error('❌ Failed to get settings:', error);
      return this.DEFAULTS;
    }
  }

  /**
   * Save settings
   * @param {Object} settings - Settings to save
   * @returns {boolean} Success status
   */
  saveSettings(settings) {
    try {
      if (!settings || typeof settings !== 'object') {
        throw new Error('Invalid settings object');
      }

      // Validate settings before saving
      const validatedSettings = this.validateSettings(settings);
      
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(validatedSettings));
      console.log('✅ Settings saved successfully');
      return true;
    } catch (error) {
      console.error('❌ Failed to save settings:', error);
      return false;
    }
  }

  /**
   * Update specific setting
   * @param {string} key - Setting key (dot notation supported)
   * @param {any} value - Setting value
   * @returns {boolean} Success status
   */
  updateSetting(key, value) {
    try {
      const settings = this.getSettings();
      
      // Support dot notation for nested keys
      const keys = key.split('.');
      let current = settings;
      
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) {
          current[keys[i]] = {};
        }
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]] = value;
      
      return this.saveSettings(settings);
    } catch (error) {
      console.error('❌ Failed to update setting:', error);
      return false;
    }
  }

  /**
   * Get specific setting
   * @param {string} key - Setting key (dot notation supported)
   * @param {any} defaultValue - Default value if not found
   * @returns {any} Setting value
   */
  getSetting(key, defaultValue = null) {
    try {
      const settings = this.getSettings();
      
      // Support dot notation for nested keys
      const keys = key.split('.');
      let current = settings;
      
      for (const k of keys) {
        if (current[k] === undefined) {
          return defaultValue;
        }
        current = current[k];
      }
      
      return current;
    } catch (error) {
      console.error('❌ Failed to get setting:', error);
      return defaultValue;
    }
  }

  /**
   * Reset settings to defaults
   * @returns {boolean} Success status
   */
  resetSettings() {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
      console.log('✅ Settings reset to defaults');
      return true;
    } catch (error) {
      console.error('❌ Failed to reset settings:', error);
      return false;
    }
  }

  /**
   * Reset specific section to defaults
   * @param {string} section - Section to reset
   * @returns {boolean} Success status
   */
  resetSection(section) {
    try {
      const settings = this.getSettings();
      
      if (this.DEFAULTS[section]) {
        settings[section] = { ...this.DEFAULTS[section] };
        return this.saveSettings(settings);
      } else {
        throw new Error(`Unknown section: ${section}`);
      }
    } catch (error) {
      console.error('❌ Failed to reset section:', error);
      return false;
    }
  }

  /**
   * Merge user settings with defaults
   * @param {Object} userSettings - User settings
   * @returns {Object} Merged settings
   */
  mergeWithDefaults(userSettings) {
    const merged = { ...this.DEFAULTS };
    
    Object.keys(userSettings).forEach(key => {
      if (typeof merged[key] === 'object' && !Array.isArray(merged[key])) {
        merged[key] = { ...merged[key], ...userSettings[key] };
      } else {
        merged[key] = userSettings[key];
      }
    });
    
    return merged;
  }

  /**
   * Validate settings before saving
   * @param {Object} settings - Settings to validate
   * @returns {Object} Validated settings
   */
  validateSettings(settings) {
    const validated = { ...settings };
    
    // Validate autoRefreshInterval
    if (validated.autoRefreshInterval !== undefined) {
      validated.autoRefreshInterval = Math.max(1, Math.min(validated.autoRefreshInterval, 1440));
    }
    
    // Validate maxArticlesToStore
    if (validated.maxArticlesToStore !== undefined) {
      validated.maxArticlesToStore = Math.max(100, Math.min(validated.maxArticlesToStore, 10000));
    }
    
    // Validate theme
    if (validated.theme !== undefined) {
      const validThemes = ['light', 'dark', 'auto'];
      if (!validThemes.includes(validated.theme)) {
        validated.theme = 'dark';
      }
    }
    
    // Validate filtering settings
    if (validated.filtering) {
      if (validated.filtering.minRelevanceScore !== undefined) {
        validated.filtering.minRelevanceScore = Math.max(0, Math.min(validated.filtering.minRelevanceScore, 100));
      }
      
      if (validated.filtering.maxArticleAge !== undefined) {
        validated.filtering.maxArticleAge = Math.max(1, Math.min(validated.filtering.maxArticleAge, 8760)); // 1 year max
      }
    }
    
    // Validate display settings
    if (validated.display) {
      if (validated.display.articlesPerPage !== undefined) {
        validated.display.articlesPerPage = Math.max(5, Math.min(validated.display.articlesPerPage, 100));
      }
      
      const validSortBy = ['publishedAt', 'relevanceScore', 'priority', 'title'];
      if (validated.display.sortBy && !validSortBy.includes(validated.display.sortBy)) {
        validated.display.sortBy = 'publishedAt';
      }
      
      const validSortOrder = ['asc', 'desc'];
      if (validated.display.sortOrder && !validSortOrder.includes(validated.display.sortOrder)) {
        validated.display.sortOrder = 'desc';
      }
    }
    
    // Validate briefing settings
    if (validated.briefing) {
      if (validated.briefing.generationTime !== undefined) {
        // Validate time format (HH:MM)
        const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
        if (!timeRegex.test(validated.briefing.generationTime)) {
          validated.briefing.generationTime = '06:00';
        }
      }
      
      if (validated.briefing.minSignalsRequired !== undefined) {
        validated.briefing.minSignalsRequired = Math.max(1, Math.min(validated.briefing.minSignalsRequired, 100));
      }
    }
    
    return validated;
  }

  /**
   * Get default settings
   * @returns {Object} Default settings
   */
  getDefaultSettings() {
    return { ...this.DEFAULTS };
  }

  /**
   * Check if settings are at defaults
   * @returns {boolean} Whether settings are default
   */
  areSettingsDefault() {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return !stored;
    } catch (error) {
      return true;
    }
  }

  /**
   * Export settings for backup
   * @returns {Object} Export data
   */
  exportSettings() {
    try {
      const settings = this.getSettings();
      
      return {
        settings,
        exportedAt: new Date().toISOString(),
        version: '1.0'
      };
    } catch (error) {
      console.error('❌ Failed to export settings:', error);
      return { settings: this.DEFAULTS, exportedAt: new Date().toISOString() };
    }
  }

  /**
   * Import settings from backup
   * @param {Object} exportData - Exported settings data
   * @returns {boolean} Success status
   */
  importSettings(exportData) {
    try {
      if (!exportData.settings || typeof exportData.settings !== 'object') {
        throw new Error('Invalid export data format');
      }

      console.log('📥 Importing settings...');
      const success = this.saveSettings(exportData.settings);
      
      if (success) {
        console.log('✅ Successfully imported settings');
      }
      
      return success;
    } catch (error) {
      console.error('❌ Failed to import settings:', error);
      return false;
    }
  }

  /**
   * Get settings summary for display
   * @returns {Object} Settings summary
   */
  getSettingsSummary() {
    try {
      const settings = this.getSettings();
      
      return {
        autoRefresh: `${settings.autoRefreshInterval} minutes`,
        maxArticles: settings.maxArticlesToStore,
        theme: settings.theme,
        notifications: settings.notifications.enabled ? 'Enabled' : 'Disabled',
        minRelevance: `${settings.filtering.minRelevanceScore}%`,
        autoGenerate: settings.briefing.autoGenerate ? 'Enabled' : 'Disabled',
        generationTime: settings.briefing.generationTime,
        articlesPerPage: settings.display.articlesPerPage,
        sortBy: settings.display.sortBy,
        developerMode: settings.advanced.enableDeveloperMode ? 'Enabled' : 'Disabled'
      };
    } catch (error) {
      console.error('❌ Failed to get settings summary:', error);
      return {};
    }
  }

  /**
   * Validate notification settings
   * @param {Object} notifications - Notification settings
   * @returns {boolean} Whether valid
   */
  validateNotifications(notifications) {
    const requiredFields = ['enabled', 'criticalAlerts', 'briefingReady', 'feedErrors'];
    return requiredFields.every(field => typeof notifications[field] === 'boolean');
  }

  /**
   * Validate filtering settings
   * @param {Object} filtering - Filtering settings
   * @returns {boolean} Whether valid
   */
  validateFiltering(filtering) {
    return (
      typeof filtering.minRelevanceScore === 'number' &&
      filtering.minRelevanceScore >= 0 &&
      filtering.minRelevanceScore <= 100 &&
      typeof filtering.showLowPriority === 'boolean' &&
      typeof filtering.hideAdvertisements === 'boolean' &&
      typeof filtering.maxArticleAge === 'number' &&
      filtering.maxArticleAge > 0
    );
  }

  /**
   * Get theme preference
   * @returns {string} Theme preference
   */
  getTheme() {
    return this.getSetting('theme', 'dark');
  }

  /**
   * Set theme preference
   * @param {string} theme - Theme name
   * @returns {boolean} Success status
   */
  setTheme(theme) {
    const validThemes = ['light', 'dark', 'auto'];
    if (!validThemes.includes(theme)) {
      return false;
    }
    
    return this.updateSetting('theme', theme);
  }

  /**
   * Toggle notification setting
   * @param {string} type - Notification type
   * @returns {boolean} Success status
   */
  toggleNotification(type) {
    const currentValue = this.getSetting(`notifications.${type}`, false);
    return this.updateSetting(`notifications.${type}`, !currentValue);
  }
}

// Export singleton instance
export const settingsManagerService = new SettingsManagerService();