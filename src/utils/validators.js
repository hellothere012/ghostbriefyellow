/**
 * Validation Utility Functions
 * Centralized validation logic for data integrity and user input
 */

/**
 * Validate RSS feed URL
 * @param {string} url - URL to validate
 * @returns {Object} Validation result with isValid and error message
 */
export const validateFeedUrl = (url) => {
  if (!url || typeof url !== 'string') {
    return { isValid: false, error: 'URL is required' };
  }

  const trimmedUrl = url.trim();
  
  if (trimmedUrl.length === 0) {
    return { isValid: false, error: 'URL cannot be empty' };
  }

  // Check basic URL format
  try {
    const urlObj = new URL(trimmedUrl);
    
    // Must be HTTP or HTTPS
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      return { isValid: false, error: 'URL must use HTTP or HTTPS protocol' };
    }

    // Check for common RSS/feed patterns
    const path = urlObj.pathname.toLowerCase();
    const isLikelyFeed = path.includes('rss') || 
                        path.includes('feed') || 
                        path.includes('atom') ||
                        path.endsWith('.xml') ||
                        path.endsWith('.rss');

    if (!isLikelyFeed) {
      return { 
        isValid: true, 
        warning: 'URL does not appear to be a standard RSS feed format' 
      };
    }

    return { isValid: true };
  } catch (error) {
    return { isValid: false, error: 'Invalid URL format' };
  }
};

/**
 * Validate feed configuration object
 * @param {Object} feed - Feed configuration to validate
 * @returns {Object} Validation result with isValid and errors array
 */
export const validateFeedConfig = (feed) => {
  const errors = [];
  
  if (!feed || typeof feed !== 'object') {
    return { isValid: false, errors: ['Feed configuration must be an object'] };
  }

  // Required fields
  const requiredFields = ['id', 'name', 'url', 'category'];
  requiredFields.forEach(field => {
    if (!feed[field] || (typeof feed[field] === 'string' && feed[field].trim() === '')) {
      errors.push(`${field} is required`);
    }
  });

  // Validate specific fields
  if (feed.name && (feed.name.length < 3 || feed.name.length > 100)) {
    errors.push('Feed name must be between 3 and 100 characters');
  }

  if (feed.url) {
    const urlValidation = validateFeedUrl(feed.url);
    if (!urlValidation.isValid) {
      errors.push(`Feed URL: ${urlValidation.error}`);
    }
  }

  if (feed.category && !['MILITARY', 'TECHNOLOGY', 'CYBERSECURITY', 'GEOPOLITICS', 'FINANCE', 'SCIENCE'].includes(feed.category)) {
    errors.push('Invalid category');
  }

  if (feed.credibilityScore !== undefined) {
    const score = Number(feed.credibilityScore);
    if (isNaN(score) || score < 0 || score > 100) {
      errors.push('Credibility score must be a number between 0 and 100');
    }
  }

  return { isValid: errors.length === 0, errors };
};

/**
 * Validate article/signal object
 * @param {Object} article - Article to validate
 * @returns {Object} Validation result with isValid and errors array
 */
export const validateArticle = (article) => {
  const errors = [];
  
  if (!article || typeof article !== 'object') {
    return { isValid: false, errors: ['Article must be an object'] };
  }

  // Required fields
  const requiredFields = ['id', 'title', 'url', 'publishedAt'];
  requiredFields.forEach(field => {
    if (!article[field]) {
      errors.push(`${field} is required`);
    }
  });

  // Validate title
  if (article.title) {
    if (typeof article.title !== 'string') {
      errors.push('Title must be a string');
    } else if (article.title.length < 5 || article.title.length > 500) {
      errors.push('Title must be between 5 and 500 characters');
    }
  }

  // Validate URL
  if (article.url) {
    try {
      new URL(article.url);
    } catch {
      errors.push('Invalid article URL format');
    }
  }

  // Validate date
  if (article.publishedAt) {
    const date = new Date(article.publishedAt);
    if (isNaN(date.getTime())) {
      errors.push('Invalid publishedAt date');
    }
  }

  // Validate intelligence object if present
  if (article.intelligence) {
    const intErrors = validateIntelligenceData(article.intelligence);
    errors.push(...intErrors);
  }

  return { isValid: errors.length === 0, errors };
};

/**
 * Validate intelligence analysis data
 * @param {Object} intelligence - Intelligence data to validate
 * @returns {Array} Array of error messages
 */
export const validateIntelligenceData = (intelligence) => {
  const errors = [];
  
  if (!intelligence || typeof intelligence !== 'object') {
    return ['Intelligence data must be an object'];
  }

  // Validate scores
  if (intelligence.relevanceScore !== undefined) {
    const score = Number(intelligence.relevanceScore);
    if (isNaN(score) || score < 0 || score > 100) {
      errors.push('Relevance score must be between 0 and 100');
    }
  }

  if (intelligence.confidenceLevel !== undefined) {
    const level = Number(intelligence.confidenceLevel);
    if (isNaN(level) || level < 0 || level > 100) {
      errors.push('Confidence level must be between 0 and 100');
    }
  }

  // Validate priority
  if (intelligence.priority && !['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].includes(intelligence.priority)) {
    errors.push('Invalid priority level');
  }

  // Validate categories
  if (intelligence.categories) {
    if (!Array.isArray(intelligence.categories)) {
      errors.push('Categories must be an array');
    } else {
      const validCategories = ['MILITARY', 'TECHNOLOGY', 'CYBERSECURITY', 'GEOPOLITICS', 'FINANCE', 'SCIENCE', 'HEALTH'];
      intelligence.categories.forEach(category => {
        if (!validCategories.includes(category)) {
          errors.push(`Invalid category: ${category}`);
        }
      });
    }
  }

  // Validate entities
  if (intelligence.entities) {
    if (typeof intelligence.entities !== 'object') {
      errors.push('Entities must be an object');
    } else {
      const entityTypes = ['countries', 'organizations', 'technologies', 'weapons'];
      entityTypes.forEach(type => {
        if (intelligence.entities[type] && !Array.isArray(intelligence.entities[type])) {
          errors.push(`${type} must be an array`);
        }
      });
    }
  }

  return errors;
};

/**
 * Validate briefing object
 * @param {Object} briefing - Briefing to validate
 * @returns {Object} Validation result with isValid and errors array
 */
export const validateBriefing = (briefing) => {
  const errors = [];
  
  if (!briefing || typeof briefing !== 'object') {
    return { isValid: false, errors: ['Briefing must be an object'] };
  }

  // Required fields
  const requiredFields = ['id', 'title', 'generatedAt', 'content'];
  requiredFields.forEach(field => {
    if (!briefing[field]) {
      errors.push(`${field} is required`);
    }
  });

  // Validate title
  if (briefing.title && (briefing.title.length < 10 || briefing.title.length > 200)) {
    errors.push('Briefing title must be between 10 and 200 characters');
  }

  // Validate content structure
  if (briefing.content) {
    if (typeof briefing.content !== 'object') {
      errors.push('Briefing content must be an object');
    } else {
      const requiredSections = ['executiveSummary', 'priorityDevelopments', 'threatAssessment'];
      requiredSections.forEach(section => {
        if (!briefing.content[section]) {
          errors.push(`Missing required section: ${section}`);
        }
      });
    }
  }

  // Validate quality if present
  if (briefing.quality) {
    if (typeof briefing.quality !== 'object') {
      errors.push('Quality must be an object');
    } else if (briefing.quality.overallScore !== undefined) {
      const score = Number(briefing.quality.overallScore);
      if (isNaN(score) || score < 0 || score > 100) {
        errors.push('Quality overall score must be between 0 and 100');
      }
    }
  }

  return { isValid: errors.length === 0, errors };
};

/**
 * Validate storage data before save
 * @param {string} storeName - Name of the object store
 * @param {Object} data - Data to validate
 * @returns {Object} Validation result
 */
export const validateStorageData = (storeName, data) => {
  const errors = [];
  
  if (!data || typeof data !== 'object') {
    return { isValid: false, errors: ['Data must be an object'] };
  }

  switch (storeName) {
    case 'articles':
      return validateArticle(data);
    case 'briefs':
      return validateBriefing(data);
    case 'feeds':
      return validateFeedConfig(data);
    default:
      // Basic validation for other stores
      if (!data.id) {
        errors.push('ID is required');
      }
      break;
  }

  return { isValid: errors.length === 0, errors };
};

/**
 * Validate email address format
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid email format
 */
export const validateEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

/**
 * Validate text length within bounds
 * @param {string} text - Text to validate
 * @param {number} minLength - Minimum length
 * @param {number} maxLength - Maximum length
 * @returns {Object} Validation result
 */
export const validateTextLength = (text, minLength = 0, maxLength = Infinity) => {
  if (!text || typeof text !== 'string') {
    return { isValid: false, error: 'Text is required' };
  }

  const trimmed = text.trim();
  
  if (trimmed.length < minLength) {
    return { isValid: false, error: `Text must be at least ${minLength} characters` };
  }

  if (trimmed.length > maxLength) {
    return { isValid: false, error: `Text must not exceed ${maxLength} characters` };
  }

  return { isValid: true };
};

/**
 * Sanitize text input to prevent XSS
 * @param {string} text - Text to sanitize
 * @returns {string} Sanitized text
 */
export const sanitizeText = (text) => {
  if (!text || typeof text !== 'string') return '';
  
  return text
    .replace(/[<>]/g, '') // Remove angle brackets
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim();
};