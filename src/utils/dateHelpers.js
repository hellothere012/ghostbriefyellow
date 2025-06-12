/**
 * Date Utility Functions
 * Centralized date formatting, manipulation, and calculation utilities
 */

/**
 * Format date to human-readable relative time
 * @param {Date|string|number} date - Date to format
 * @returns {string} Formatted relative time (e.g., "2 hours ago", "3 days ago")
 */
export const formatTimeAgo = (date) => {
  const now = new Date();
  const targetDate = new Date(date);
  const diffMs = now - targetDate;
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);

  if (diffSeconds < 60) return 'Just now';
  if (diffMinutes < 60) return `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
  if (diffWeeks < 4) return `${diffWeeks} week${diffWeeks !== 1 ? 's' : ''} ago`;
  if (diffMonths < 12) return `${diffMonths} month${diffMonths !== 1 ? 's' : ''} ago`;
  
  const diffYears = Math.floor(diffMonths / 12);
  return `${diffYears} year${diffYears !== 1 ? 's' : ''} ago`;
};

/**
 * Format date for intelligence briefings
 * @param {Date|string|number} date - Date to format
 * @returns {string} Formatted date (e.g., "2024-01-15 14:30 UTC")
 */
export const formatIntelligenceDate = (date) => {
  const targetDate = new Date(date);
  return targetDate.toISOString().replace('T', ' ').replace(/\.\d{3}Z$/, ' UTC');
};

/**
 * Format date for display in UI
 * @param {Date|string|number} date - Date to format
 * @returns {string} Formatted date (e.g., "Jan 15, 2024 2:30 PM")
 */
export const formatDisplayDate = (date) => {
  const targetDate = new Date(date);
  return targetDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
};

/**
 * Check if date is within specified hours from now
 * @param {Date|string|number} date - Date to check
 * @param {number} hours - Hours threshold
 * @returns {boolean} True if date is within threshold
 */
export const isWithinHours = (date, hours) => {
  const now = new Date();
  const targetDate = new Date(date);
  const diffMs = Math.abs(now - targetDate);
  const diffHours = diffMs / (1000 * 60 * 60);
  return diffHours <= hours;
};

/**
 * Check if date is within specified days from now
 * @param {Date|string|number} date - Date to check
 * @param {number} days - Days threshold
 * @returns {boolean} True if date is within threshold
 */
export const isWithinDays = (date, days) => {
  const now = new Date();
  const targetDate = new Date(date);
  const diffMs = Math.abs(now - targetDate);
  const diffDays = diffMs / (1000 * 60 * 60 * 24);
  return diffDays <= days;
};

/**
 * Get date range for analysis (e.g., last 24 hours)
 * @param {number} hours - Hours to look back
 * @returns {Object} Object with start and end dates
 */
export const getDateRange = (hours = 24) => {
  const end = new Date();
  const start = new Date(end.getTime() - (hours * 60 * 60 * 1000));
  return { start, end };
};

/**
 * Calculate temporal relevance score based on article age
 * @param {Date|string|number} date - Article date
 * @param {number} maxAgeHours - Maximum age for full score (default 6)
 * @returns {number} Score from 0-100 (100 = very recent, 0 = very old)
 */
export const calculateTemporalRelevance = (date, maxAgeHours = 6) => {
  const now = new Date();
  const targetDate = new Date(date);
  const ageMs = now - targetDate;
  const ageHours = ageMs / (1000 * 60 * 60);
  
  if (ageHours < 0) return 100; // Future dates get max score
  if (ageHours <= maxAgeHours) return 100;
  if (ageHours <= 24) return Math.max(0, 100 - ((ageHours - maxAgeHours) * 5));
  if (ageHours <= 72) return Math.max(0, 50 - ((ageHours - 24) * 1));
  
  return Math.max(0, 20 - (ageHours - 72) * 0.1);
};

/**
 * Get start of day for a given date
 * @param {Date|string|number} date - Input date
 * @returns {Date} Date set to start of day (00:00:00)
 */
export const getStartOfDay = (date = new Date()) => {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
};

/**
 * Get end of day for a given date
 * @param {Date|string|number} date - Input date
 * @returns {Date} Date set to end of day (23:59:59.999)
 */
export const getEndOfDay = (date = new Date()) => {
  const result = new Date(date);
  result.setHours(23, 59, 59, 999);
  return result;
};

/**
 * Check if two dates are on the same day
 * @param {Date|string|number} date1 - First date
 * @param {Date|string|number} date2 - Second date
 * @returns {boolean} True if dates are on same day
 */
export const isSameDay = (date1, date2) => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  return d1.getFullYear() === d2.getFullYear() &&
         d1.getMonth() === d2.getMonth() &&
         d1.getDate() === d2.getDate();
};

/**
 * Parse various date formats to Date object
 * @param {string|Date|number} dateInput - Date in various formats
 * @returns {Date|null} Parsed Date object or null if invalid
 */
export const parseDate = (dateInput) => {
  if (!dateInput) return null;
  
  try {
    if (dateInput instanceof Date) return dateInput;
    if (typeof dateInput === 'number') return new Date(dateInput);
    
    // Handle common RSS date formats
    const cleanInput = dateInput.toString().trim();
    const parsed = new Date(cleanInput);
    
    return isNaN(parsed.getTime()) ? null : parsed;
  } catch (error) {
    console.warn('Date parsing failed:', error);
    return null;
  }
};

/**
 * Generate timestamp for file naming
 * @returns {string} Timestamp in YYYYMMDD_HHMMSS format
 */
export const generateTimestamp = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  
  return `${year}${month}${day}_${hours}${minutes}${seconds}`;
};

/**
 * Get scheduled briefing time for today
 * @param {string} timeString - Time in HH:MM format (e.g., "06:00")
 * @returns {Date} Date object for scheduled time today
 */
export const getScheduledTime = (timeString = "06:00") => {
  const [hours, minutes] = timeString.split(':').map(Number);
  const scheduled = new Date();
  scheduled.setHours(hours, minutes, 0, 0);
  
  // If time has passed today, schedule for tomorrow
  if (scheduled < new Date()) {
    scheduled.setDate(scheduled.getDate() + 1);
  }
  
  return scheduled;
};