// Brief Management Module for Ghost Brief
// Specialized brief storage operations and lifecycle management

import { indexedDBService } from '../indexedDBService.js';

/**
 * Brief Manager Service
 * Handles all brief-related storage operations with permanent persistence
 */
export class BriefManagerService {
  constructor() {
    this.STORAGE_KEY = 'ghost_brief_briefs';
    this.MAX_BRIEFS_DISPLAY = 50; // Limit for UI performance
  }

  /**
   * Save a brief to permanent storage
   * @param {Object} brief - Brief to save
   * @returns {Promise<boolean>} Success status
   */
  async saveBrief(brief) {
    try {
      if (!brief || !brief.id) {
        throw new Error('Invalid brief data');
      }

      console.log(`💾 Saving brief "${brief.title}" to permanent storage...`);

      const briefWithMetadata = {
        ...brief,
        savedAt: new Date().toISOString(),
        isPermanent: true,
        version: '1.0'
      };

      if (await this.isIndexedDBAvailable()) {
        await indexedDBService.saveBrief(briefWithMetadata);
        console.log(`✅ Brief saved to IndexedDB: ${brief.title}`);
      } else {
        await this.saveBriefToLocalStorage(briefWithMetadata);
      }

      return true;
    } catch (error) {
      console.error('❌ Failed to save brief:', error);
      return false;
    }
  }

  /**
   * Save multiple briefs to storage
   * @param {Array} briefs - Briefs to save
   * @returns {Promise<boolean>} Success status
   */
  async saveBriefs(briefs) {
    try {
      if (!Array.isArray(briefs) || briefs.length === 0) {
        return true;
      }

      console.log(`💾 Saving ${briefs.length} briefs to permanent storage...`);

      let successCount = 0;
      for (const brief of briefs) {
        const success = await this.saveBrief(brief);
        if (success) successCount++;
      }

      console.log(`✅ Successfully saved ${successCount}/${briefs.length} briefs`);
      return successCount === briefs.length;
    } catch (error) {
      console.error('❌ Failed to save briefs:', error);
      return false;
    }
  }

  /**
   * Get all briefs from storage
   * @param {Object} options - Query options
   * @returns {Promise<Array>} Array of briefs
   */
  async getBriefs(options = {}) {
    try {
      const { limit, sortBy = 'generatedAt', sortOrder = 'desc' } = options;

      let briefs;
      if (await this.isIndexedDBAvailable()) {
        briefs = await indexedDBService.getBriefs();
        console.log(`📖 Retrieved ${briefs.length} briefs from IndexedDB`);
      } else {
        briefs = this.getBriefsFromLocalStorage();
      }

      // Sort briefs
      briefs.sort((a, b) => {
        const aValue = this.getSortValue(a, sortBy);
        const bValue = this.getSortValue(b, sortBy);
        
        if (sortOrder === 'desc') {
          return bValue - aValue;
        } else {
          return aValue - bValue;
        }
      });

      // Apply limit for UI performance
      if (limit) {
        briefs = briefs.slice(0, limit);
      }

      return briefs;
    } catch (error) {
      console.error('❌ Failed to get briefs:', error);
      return [];
    }
  }

  /**
   * Get a specific brief by ID
   * @param {string} briefId - Brief ID
   * @returns {Promise<Object|null>} Brief object or null
   */
  async getBrief(briefId) {
    try {
      if (await this.isIndexedDBAvailable()) {
        return await indexedDBService.getBrief(briefId);
      } else {
        const briefs = this.getBriefsFromLocalStorage();
        return briefs.find(brief => brief.id === briefId) || null;
      }
    } catch (error) {
      console.error('❌ Failed to get brief:', error);
      return null;
    }
  }

  /**
   * Get filtered briefs based on criteria
   * @param {Object} filters - Filter criteria
   * @returns {Promise<Array>} Filtered briefs
   */
  async getFilteredBriefs(filters = {}) {
    try {
      const {
        type,
        dateFrom,
        dateTo,
        searchTerm,
        minQuality,
        tags,
        limit,
        offset = 0
      } = filters;

      let briefs = await this.getBriefs();

      // Apply filters
      if (type) {
        briefs = briefs.filter(brief => brief.type === type);
      }

      if (dateFrom) {
        const fromDate = new Date(dateFrom);
        briefs = briefs.filter(brief => new Date(brief.generatedAt) >= fromDate);
      }

      if (dateTo) {
        const toDate = new Date(dateTo);
        briefs = briefs.filter(brief => new Date(brief.generatedAt) <= toDate);
      }

      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        briefs = briefs.filter(brief => 
          brief.title?.toLowerCase().includes(searchLower) ||
          brief.content?.toLowerCase().includes(searchLower) ||
          brief.executiveSummary?.toLowerCase().includes(searchLower)
        );
      }

      if (minQuality !== undefined) {
        briefs = briefs.filter(brief => 
          (brief.qualityScore || 0) >= minQuality
        );
      }

      if (tags && tags.length > 0) {
        briefs = briefs.filter(brief => 
          brief.tags && brief.tags.some(tag => tags.includes(tag))
        );
      }

      // Apply pagination
      if (limit) {
        briefs = briefs.slice(offset, offset + limit);
      }

      return briefs;
    } catch (error) {
      console.error('❌ Failed to get filtered briefs:', error);
      return [];
    }
  }

  /**
   * Update a brief
   * @param {string} briefId - Brief ID
   * @param {Object} updates - Updates to apply
   * @returns {Promise<boolean>} Success status
   */
  async updateBrief(briefId, updates) {
    try {
      const existing = await this.getBrief(briefId);
      if (!existing) {
        throw new Error(`Brief ${briefId} not found`);
      }

      const updatedBrief = {
        ...existing,
        ...updates,
        updatedAt: new Date().toISOString()
      };

      console.log(`📝 Updating brief: ${existing.title}`);

      if (await this.isIndexedDBAvailable()) {
        await indexedDBService.updateBrief(briefId, updatedBrief);
      } else {
        await this.updateBriefInLocalStorage(briefId, updatedBrief);
      }

      console.log(`✅ Brief updated successfully`);
      return true;
    } catch (error) {
      console.error('❌ Failed to update brief:', error);
      return false;
    }
  }

  /**
   * Delete a brief
   * @param {string} briefId - Brief ID to delete
   * @returns {Promise<boolean>} Success status
   */
  async deleteBrief(briefId) {
    try {
      console.log(`🗑️ Deleting brief: ${briefId}`);

      if (await this.isIndexedDBAvailable()) {
        await indexedDBService.deleteBrief(briefId);
      } else {
        await this.deleteBriefFromLocalStorage(briefId);
      }

      console.log(`✅ Brief deleted successfully`);
      return true;
    } catch (error) {
      console.error('❌ Failed to delete brief:', error);
      return false;
    }
  }

  /**
   * Delete multiple briefs
   * @param {Array} briefIds - Brief IDs to delete
   * @returns {Promise<boolean>} Success status
   */
  async deleteBriefs(briefIds) {
    try {
      if (!Array.isArray(briefIds) || briefIds.length === 0) {
        return true;
      }

      console.log(`🗑️ Deleting ${briefIds.length} briefs...`);

      let successCount = 0;
      for (const briefId of briefIds) {
        const success = await this.deleteBrief(briefId);
        if (success) successCount++;
      }

      console.log(`✅ Successfully deleted ${successCount}/${briefIds.length} briefs`);
      return successCount === briefIds.length;
    } catch (error) {
      console.error('❌ Failed to delete briefs:', error);
      return false;
    }
  }

  /**
   * Get brief statistics
   * @returns {Promise<Object>} Brief statistics
   */
  async getBriefStatistics() {
    try {
      const briefs = await this.getBriefs();
      
      const stats = {
        total: briefs.length,
        byType: {},
        byQuality: {
          excellent: 0,
          good: 0,
          acceptable: 0,
          poor: 0
        },
        averageQuality: 0,
        oldestBrief: null,
        newestBrief: null,
        totalSections: 0
      };

      let totalQuality = 0;

      briefs.forEach(brief => {
        // Type distribution
        const type = brief.type || 'unknown';
        stats.byType[type] = (stats.byType[type] || 0) + 1;

        // Quality distribution
        const quality = brief.qualityScore || 0;
        totalQuality += quality;
        
        if (quality >= 90) stats.byQuality.excellent++;
        else if (quality >= 75) stats.byQuality.good++;
        else if (quality >= 60) stats.byQuality.acceptable++;
        else stats.byQuality.poor++;

        // Section count
        if (brief.sections) {
          stats.totalSections += brief.sections.length;
        }

        // Age tracking
        const briefTime = new Date(brief.generatedAt);
        if (!stats.oldestBrief || briefTime < new Date(stats.oldestBrief.generatedAt)) {
          stats.oldestBrief = brief;
        }
        if (!stats.newestBrief || briefTime > new Date(stats.newestBrief.generatedAt)) {
          stats.newestBrief = brief;
        }
      });

      stats.averageQuality = briefs.length > 0 ? Math.round(totalQuality / briefs.length) : 0;

      return stats;
    } catch (error) {
      console.error('❌ Failed to get brief statistics:', error);
      return { total: 0, byType: {}, byQuality: {}, averageQuality: 0 };
    }
  }

  /**
   * Save brief to localStorage
   * @param {Object} brief - Brief to save
   */
  async saveBriefToLocalStorage(brief) {
    try {
      const existingBriefs = this.getBriefsFromLocalStorage();
      
      // Remove existing brief with same ID
      const filteredBriefs = existingBriefs.filter(existing => existing.id !== brief.id);
      
      // Add new brief
      const updatedBriefs = [brief, ...filteredBriefs];
      
      // Limit briefs to prevent localStorage overflow
      const limitedBriefs = updatedBriefs.slice(0, this.MAX_BRIEFS_DISPLAY);

      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(limitedBriefs));
      console.log(`✅ Brief saved to localStorage: ${brief.title}`);
    } catch (error) {
      console.error('❌ Failed to save brief to localStorage:', error);
      throw error;
    }
  }

  /**
   * Get briefs from localStorage
   * @returns {Array} Briefs array
   */
  getBriefsFromLocalStorage() {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('❌ Failed to parse briefs from localStorage:', error);
      return [];
    }
  }

  /**
   * Update brief in localStorage
   * @param {string} briefId - Brief ID
   * @param {Object} updatedBrief - Updated brief data
   */
  async updateBriefInLocalStorage(briefId, updatedBrief) {
    try {
      const briefs = this.getBriefsFromLocalStorage();
      const briefIndex = briefs.findIndex(brief => brief.id === briefId);
      
      if (briefIndex === -1) {
        throw new Error(`Brief ${briefId} not found in localStorage`);
      }

      briefs[briefIndex] = updatedBrief;
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(briefs));
    } catch (error) {
      console.error('❌ Failed to update brief in localStorage:', error);
      throw error;
    }
  }

  /**
   * Delete brief from localStorage
   * @param {string} briefId - Brief ID to delete
   */
  async deleteBriefFromLocalStorage(briefId) {
    try {
      const briefs = this.getBriefsFromLocalStorage();
      const filteredBriefs = briefs.filter(brief => brief.id !== briefId);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filteredBriefs));
    } catch (error) {
      console.error('❌ Failed to delete brief from localStorage:', error);
      throw error;
    }
  }

  /**
   * Get sort value for brief sorting
   * @param {Object} brief - Brief object
   * @param {string} sortBy - Sort field
   * @returns {number} Sort value
   */
  getSortValue(brief, sortBy) {
    switch (sortBy) {
      case 'generatedAt':
        return new Date(brief.generatedAt).getTime();
      case 'updatedAt':
        return new Date(brief.updatedAt || brief.generatedAt).getTime();
      case 'qualityScore':
        return brief.qualityScore || 0;
      case 'title':
        return brief.title || '';
      default:
        return 0;
    }
  }

  /**
   * Check if IndexedDB is available
   * @returns {Promise<boolean>} IndexedDB availability
   */
  async isIndexedDBAvailable() {
    try {
      if (!window.indexedDB) {
        return false;
      }
      await indexedDBService.ensureDB();
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Export briefs for backup
   * @returns {Promise<Object>} Export data
   */
  async exportBriefs() {
    try {
      const briefs = await this.getBriefs();
      const stats = await this.getBriefStatistics();
      
      return {
        briefs,
        statistics: stats,
        exportedAt: new Date().toISOString(),
        version: '1.0'
      };
    } catch (error) {
      console.error('❌ Failed to export briefs:', error);
      return { briefs: [], statistics: {}, exportedAt: new Date().toISOString() };
    }
  }

  /**
   * Import briefs from backup
   * @param {Object} exportData - Exported brief data
   * @returns {Promise<boolean>} Success status
   */
  async importBriefs(exportData) {
    try {
      if (!exportData.briefs || !Array.isArray(exportData.briefs)) {
        throw new Error('Invalid export data format');
      }

      console.log(`📥 Importing ${exportData.briefs.length} briefs...`);
      await this.saveBriefs(exportData.briefs);
      
      console.log(`✅ Successfully imported ${exportData.briefs.length} briefs`);
      return true;
    } catch (error) {
      console.error('❌ Failed to import briefs:', error);
      return false;
    }
  }

  /**
   * Clear all briefs (use with caution)
   * @returns {Promise<boolean>} Success status
   */
  async clearAllBriefs() {
    try {
      console.log('🗑️ Clearing all briefs...');

      if (await this.isIndexedDBAvailable()) {
        await indexedDBService.clearBriefs();
      } else {
        localStorage.removeItem(this.STORAGE_KEY);
      }

      console.log('✅ All briefs cleared');
      return true;
    } catch (error) {
      console.error('❌ Failed to clear briefs:', error);
      return false;
    }
  }
}

// Export singleton instance
export const briefManagerService = new BriefManagerService();