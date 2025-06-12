/**
 * Formatting Utility Functions
 * Centralized text formatting, data transformation, and display utilities
 */

/**
 * Format intelligence score as percentage with color coding
 * @param {number} score - Score from 0-100
 * @returns {Object} Formatted score with display text and CSS class
 */
export const formatIntelligenceScore = (score) => {
  const numScore = Number(score);
  
  if (isNaN(numScore)) {
    return { text: 'N/A', class: 'score-unknown', color: '#888888' };
  }

  const clampedScore = Math.max(0, Math.min(100, numScore));
  const text = `${clampedScore}%`;
  
  if (clampedScore >= 85) {
    return { text, class: 'score-critical', color: '#ff4444' };
  } else if (clampedScore >= 65) {
    return { text, class: 'score-high', color: '#ffaa00' };
  } else if (clampedScore >= 45) {
    return { text, class: 'score-medium', color: '#4488ff' };
  } else {
    return { text, class: 'score-low', color: '#888888' };
  }
};

/**
 * Format priority level with appropriate styling
 * @param {string} priority - Priority level (CRITICAL, HIGH, MEDIUM, LOW)
 * @returns {Object} Formatted priority with display text, icon, and color
 */
export const formatPriority = (priority) => {
  if (!priority || typeof priority !== 'string') {
    return { text: 'Unknown', icon: '⚪', color: '#888888', class: 'priority-unknown' };
  }

  const upperPriority = priority.toUpperCase();
  
  switch (upperPriority) {
    case 'CRITICAL':
      return { text: 'Critical', icon: '🔴', color: '#ff4444', class: 'priority-critical' };
    case 'HIGH':
      return { text: 'High', icon: '🟡', color: '#ffaa00', class: 'priority-high' };
    case 'MEDIUM':
      return { text: 'Medium', icon: '🔵', color: '#4488ff', class: 'priority-medium' };
    case 'LOW':
      return { text: 'Low', icon: '⚪', color: '#888888', class: 'priority-low' };
    default:
      return { text: priority, icon: '⚪', color: '#888888', class: 'priority-unknown' };
  }
};

/**
 * Format category with appropriate icon and styling
 * @param {string} category - Intelligence category
 * @returns {Object} Formatted category with display text, icon, and color
 */
export const formatCategory = (category) => {
  if (!category || typeof category !== 'string') {
    return { text: 'General', icon: '📄', color: '#888888' };
  }

  const upperCategory = category.toUpperCase();
  
  switch (upperCategory) {
    case 'MILITARY':
      return { text: 'Military & Defense', icon: '🛡️', color: '#ff4444' };
    case 'TECHNOLOGY':
      return { text: 'Technology', icon: '💻', color: '#4444ff' };
    case 'CYBERSECURITY':
      return { text: 'Cybersecurity', icon: '🔒', color: '#ff8800' };
    case 'GEOPOLITICS':
      return { text: 'Geopolitics', icon: '🌍', color: '#00aa44' };
    case 'FINANCE':
      return { text: 'Finance & Economics', icon: '💰', color: '#8844ff' };
    case 'SCIENCE':
      return { text: 'Science & Health', icon: '🔬', color: '#00aaaa' };
    case 'HEALTH':
      return { text: 'Health & Medical', icon: '🏥', color: '#00aaaa' };
    default:
      return { text: category, icon: '📄', color: '#888888' };
  }
};

/**
 * Format article content preview with ellipsis
 * @param {string} content - Full content text
 * @param {number} maxLength - Maximum length for preview (default 200)
 * @returns {string} Truncated content with ellipsis if needed
 */
export const formatContentPreview = (content, maxLength = 200) => {
  if (!content || typeof content !== 'string') {
    return 'No content available';
  }

  const cleanContent = content.trim().replace(/\s+/g, ' ');
  
  if (cleanContent.length <= maxLength) {
    return cleanContent;
  }

  // Find the last complete word within the limit
  let truncated = cleanContent.substring(0, maxLength);
  const lastSpaceIndex = truncated.lastIndexOf(' ');
  
  if (lastSpaceIndex > maxLength * 0.8) {
    truncated = truncated.substring(0, lastSpaceIndex);
  }
  
  return `${truncated}...`;
};

/**
 * Format entity list for display
 * @param {Array} entities - Array of entity names
 * @param {number} maxCount - Maximum number to show (default 3)
 * @returns {string} Formatted entity list
 */
export const formatEntityList = (entities, maxCount = 3) => {
  if (!Array.isArray(entities) || entities.length === 0) {
    return 'None identified';
  }

  const uniqueEntities = [...new Set(entities)];
  
  if (uniqueEntities.length <= maxCount) {
    return uniqueEntities.join(', ');
  }

  const displayed = uniqueEntities.slice(0, maxCount);
  const remaining = uniqueEntities.length - maxCount;
  
  return `${displayed.join(', ')} +${remaining} more`;
};

/**
 * Format file size in human-readable format
 * @param {number} bytes - Size in bytes
 * @returns {string} Formatted size (e.g., "1.2 MB", "500 KB")
 */
export const formatFileSize = (bytes) => {
  if (!bytes || typeof bytes !== 'number' || bytes < 0) {
    return '0 B';
  }

  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let size = bytes;
  let unitIndex = 0;
  
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  
  const formatted = unitIndex === 0 ? size.toString() : size.toFixed(1);
  return `${formatted} ${units[unitIndex]}`;
};

/**
 * Format confidence level as descriptive text
 * @param {number} confidence - Confidence score 0-100
 * @returns {Object} Formatted confidence with text and color
 */
export const formatConfidence = (confidence) => {
  const numConfidence = Number(confidence);
  
  if (isNaN(numConfidence)) {
    return { text: 'Unknown', color: '#888888' };
  }

  const clampedConfidence = Math.max(0, Math.min(100, numConfidence));
  
  if (clampedConfidence >= 90) {
    return { text: 'Very High', color: '#00ff88' };
  } else if (clampedConfidence >= 75) {
    return { text: 'High', color: '#88ff00' };
  } else if (clampedConfidence >= 50) {
    return { text: 'Medium', color: '#ffaa00' };
  } else if (clampedConfidence >= 25) {
    return { text: 'Low', color: '#ff8800' };
  } else {
    return { text: 'Very Low', color: '#ff4444' };
  }
};

/**
 * Format large numbers with appropriate suffixes
 * @param {number} num - Number to format
 * @returns {string} Formatted number (e.g., "1.2K", "3.5M")
 */
export const formatLargeNumber = (num) => {
  const numValue = Number(num);
  
  if (isNaN(numValue)) return '0';
  
  if (numValue < 1000) return numValue.toString();
  if (numValue < 1000000) return `${(numValue / 1000).toFixed(1)}K`;
  if (numValue < 1000000000) return `${(numValue / 1000000).toFixed(1)}M`;
  
  return `${(numValue / 1000000000).toFixed(1)}B`;
};

/**
 * Format URL for display (remove protocol, truncate if long)
 * @param {string} url - URL to format
 * @param {number} maxLength - Maximum display length
 * @returns {string} Formatted URL
 */
export const formatDisplayUrl = (url, maxLength = 50) => {
  if (!url || typeof url !== 'string') {
    return 'Invalid URL';
  }

  try {
    const urlObj = new URL(url);
    let displayUrl = urlObj.hostname + urlObj.pathname;
    
    if (displayUrl.length > maxLength) {
      displayUrl = displayUrl.substring(0, maxLength - 3) + '...';
    }
    
    return displayUrl;
  } catch {
    // Fallback for invalid URLs
    let cleanUrl = url.replace(/^https?:\/\//, '');
    if (cleanUrl.length > maxLength) {
      cleanUrl = cleanUrl.substring(0, maxLength - 3) + '...';
    }
    return cleanUrl;
  }
};

/**
 * Format text for search highlighting
 * @param {string} text - Text to format
 * @param {string} searchTerm - Term to highlight
 * @returns {string} Text with highlighted search terms
 */
export const formatSearchHighlight = (text, searchTerm) => {
  if (!text || !searchTerm || typeof text !== 'string') {
    return text || '';
  }

  const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  return text.replace(regex, '<mark>$1</mark>');
};

/**
 * Format threat level for display
 * @param {string} threatLevel - Threat level string
 * @returns {Object} Formatted threat level with styling
 */
export const formatThreatLevel = (threatLevel) => {
  if (!threatLevel || typeof threatLevel !== 'string') {
    return { text: 'Unknown', color: '#888888', icon: '❓' };
  }

  const upperLevel = threatLevel.toUpperCase();
  
  switch (upperLevel) {
    case 'CRITICAL':
    case 'SEVERE':
      return { text: 'Critical', color: '#ff0000', icon: '🚨' };
    case 'HIGH':
    case 'ELEVATED':
      return { text: 'High', color: '#ff4400', icon: '⚠️' };
    case 'MEDIUM':
    case 'MODERATE':
      return { text: 'Medium', color: '#ffaa00', icon: '🔶' };
    case 'LOW':
    case 'MINIMAL':
      return { text: 'Low', color: '#00aa00', icon: '🟢' };
    default:
      return { text: threatLevel, color: '#888888', icon: '❓' };
  }
};

/**
 * Format JSON data for display in UI
 * @param {Object} data - Data to format
 * @param {number} indent - Indentation level
 * @returns {string} Formatted JSON string
 */
export const formatJsonDisplay = (data, indent = 2) => {
  try {
    return JSON.stringify(data, null, indent);
  } catch (error) {
    return 'Invalid JSON data';
  }
};

/**
 * Capitalize first letter of each word
 * @param {string} text - Text to capitalize
 * @returns {string} Title-cased text
 */
export const toTitleCase = (text) => {
  if (!text || typeof text !== 'string') return '';
  
  return text
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};