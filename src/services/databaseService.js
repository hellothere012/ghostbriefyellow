// Database Service for Ghost Brief
// Handles API communication with the new Prisma-based backend

import { apiConfig } from '../config/api';

export class DatabaseService {
  constructor() {
    this.baseUrl = apiConfig.get('apiBaseUrl');
  }

  /**
   * Signals Management
   */
  async getSignals(filters = {}) {
    try {
      const params = new URLSearchParams();
      
      if (filters.limit) params.append('limit', filters.limit);
      if (filters.offset) params.append('offset', filters.offset);
      if (filters.category && filters.category !== 'all') params.append('category', filters.category);
      if (filters.escalationRisk && filters.escalationRisk !== 'all') params.append('escalationRisk', filters.escalationRisk);
      if (filters.minScore) params.append('minScore', filters.minScore);

      const response = await fetch(`${this.baseUrl}/api/signals?${params}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching signals:', error);
      throw error;
    }
  }

  async createSignal(signalData) {
    try {
      const response = await fetch(`${this.baseUrl}/api/signals`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(signalData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating signal:', error);
      throw error;
    }
  }

  /**
   * Briefs Management
   */
  async getBriefs(filters = {}) {
    try {
      const params = new URLSearchParams();
      
      if (filters.limit) params.append('limit', filters.limit);
      if (filters.offset) params.append('offset', filters.offset);

      const response = await fetch(`${this.baseUrl}/api/briefs?${params}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching briefs:', error);
      throw error;
    }
  }

  async createBrief(briefData) {
    try {
      const response = await fetch(`${this.baseUrl}/api/briefs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(briefData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating brief:', error);
      throw error;
    }
  }

  async updateBrief(briefData) {
    try {
      const response = await fetch(`${this.baseUrl}/api/briefs`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(briefData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating brief:', error);
      throw error;
    }
  }

  async deleteBrief(briefId) {
    try {
      const response = await fetch(`${this.baseUrl}/api/briefs?id=${briefId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error deleting brief:', error);
      throw error;
    }
  }

  /**
   * RSS Feeds Management
   */
  async getFeeds() {
    try {
      const response = await fetch(`${this.baseUrl}/api/feeds`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching feeds:', error);
      throw error;
    }
  }

  async initializeDefaultFeeds() {
    try {
      const response = await fetch(`${this.baseUrl}/api/feeds`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ action: 'initialize' })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error initializing feeds:', error);
      throw error;
    }
  }

  async createFeed(feedData) {
    try {
      const response = await fetch(`${this.baseUrl}/api/feeds`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(feedData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating feed:', error);
      throw error;
    }
  }

  async updateFeed(feedData) {
    try {
      const response = await fetch(`${this.baseUrl}/api/feeds`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(feedData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating feed:', error);
      throw error;
    }
  }

  async deleteFeed(feedId) {
    try {
      const response = await fetch(`${this.baseUrl}/api/feeds?id=${feedId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error deleting feed:', error);
      throw error;
    }
  }

  /**
   * RSS Processing
   */
  async processRSSFeeds() {
    try {
      console.log('🚀 Triggering RSS processing...');
      
      const response = await fetch(`${this.baseUrl}/api/process-rss`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('✅ RSS processing completed:', result);
      
      return result;
    } catch (error) {
      console.error('Error processing RSS feeds:', error);
      throw error;
    }
  }

  /**
   * Statistics
   */
  async getStats() {
    try {
      const response = await fetch(`${this.baseUrl}/api/stats`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching stats:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const databaseService = new DatabaseService();