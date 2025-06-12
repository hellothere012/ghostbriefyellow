/**
 * Error Handling Utility Functions
 * Centralized error handling, logging, and user-friendly error messages
 */

import { ERROR_CODES, ERROR_MESSAGES } from '../constants/api.js';

// Add missing error codes that might not be in api.js
const ADDITIONAL_ERROR_CODES = {
  UNKNOWN: 'UNKNOWN',
  ...ERROR_CODES
};

/**
 * Enhanced Error class with additional context
 */
export class GhostBriefError extends Error {
  constructor(message, code = ADDITIONAL_ERROR_CODES.UNKNOWN, context = {}) {
    super(message);
    this.name = 'GhostBriefError';
    this.code = code;
    this.context = context;
    this.timestamp = new Date().toISOString();
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      context: this.context,
      timestamp: this.timestamp,
      stack: this.stack
    };
  }
}

/**
 * Create standardized error object
 * @param {string} code - Error code from ERROR_CODES
 * @param {string} customMessage - Custom error message (optional)
 * @param {Object} context - Additional error context
 * @returns {GhostBriefError} Standardized error object
 */
export const createError = (code, customMessage = null, context = {}) => {
  const message = customMessage || ERROR_MESSAGES[code] || 'Unknown error occurred';
  return new GhostBriefError(message, code, context);
};

/**
 * Handle network errors with retry logic
 * @param {Error} error - Original error
 * @param {Object} requestInfo - Request information for context
 * @returns {GhostBriefError} Processed network error
 */
export const handleNetworkError = (error, requestInfo = {}) => {
  const context = {
    url: requestInfo.url,
    method: requestInfo.method,
    timeout: requestInfo.timeout,
    originalError: error.message
  };

  if (error.name === 'AbortError' || error.message.includes('timeout')) {
    return createError(ERROR_CODES.TIMEOUT_ERROR, 'Request timed out', context);
  }

  if (error.message.includes('Failed to fetch') || error.message.includes('Network Error')) {
    return createError(ERROR_CODES.NETWORK_ERROR, 'Network connection failed', context);
  }

  return createError(ERROR_CODES.NETWORK_ERROR, error.message, context);
};

/**
 * Handle API response errors
 * @param {Response} response - Fetch response object
 * @param {Object} responseData - Parsed response data (optional)
 * @returns {GhostBriefError} Processed API error
 */
export const handleApiError = (response, responseData = null) => {
  const context = {
    status: response.status,
    statusText: response.statusText,
    url: response.url,
    responseData
  };

  switch (response.status) {
    case 400:
      return createError(ERROR_CODES.VALIDATION_ERROR, 'Invalid request data', context);
    case 401:
      return createError(ERROR_CODES.API_ERROR, 'Authentication required', context);
    case 403:
      return createError(ERROR_CODES.API_ERROR, 'Access forbidden', context);
    case 404:
      return createError(ERROR_CODES.API_ERROR, 'Resource not found', context);
    case 429:
      return createError(ERROR_CODES.RATE_LIMIT_ERROR, 'Rate limit exceeded', context);
    case 500:
    case 502:
    case 503:
    case 504:
      return createError(ERROR_CODES.API_ERROR, 'Server error occurred', context);
    default:
      return createError(ERROR_CODES.API_ERROR, `HTTP ${response.status} error`, context);
  }
};

/**
 * Handle storage/database errors
 * @param {Error} error - Original storage error
 * @param {string} operation - Storage operation being performed
 * @param {Object} data - Data being processed (optional)
 * @returns {GhostBriefError} Processed storage error
 */
export const handleStorageError = (error, operation, data = null) => {
  const context = {
    operation,
    originalError: error.message,
    errorName: error.name,
    data: data ? { id: data.id, type: typeof data } : null
  };

  if (error.name === 'QuotaExceededError') {
    return createError(ERROR_CODES.STORAGE_ERROR, 'Storage quota exceeded', context);
  }

  if (error.name === 'VersionError') {
    return createError(ERROR_CODES.STORAGE_ERROR, 'Database version conflict', context);
  }

  if (error.name === 'InvalidStateError') {
    return createError(ERROR_CODES.STORAGE_ERROR, 'Database in invalid state', context);
  }

  return createError(ERROR_CODES.STORAGE_ERROR, `Storage operation failed: ${operation}`, context);
};

/**
 * Handle RSS parsing errors
 * @param {Error} error - Original parsing error
 * @param {string} feedUrl - RSS feed URL
 * @param {string} content - Raw RSS content (optional)
 * @returns {GhostBriefError} Processed parsing error
 */
export const handleParsingError = (error, feedUrl, content = null) => {
  const context = {
    feedUrl,
    originalError: error.message,
    contentLength: content ? content.length : 0,
    contentPreview: content ? content.substring(0, 200) : null
  };

  if (error.message.includes('XML') || error.message.includes('parsing')) {
    return createError(ERROR_CODES.PARSING_ERROR, 'Invalid RSS/XML format', context);
  }

  return createError(ERROR_CODES.PARSING_ERROR, 'Failed to parse RSS feed', context);
};

/**
 * Log error with appropriate level and context
 * @param {Error|GhostBriefError} error - Error to log
 * @param {string} level - Log level (error, warn, info)
 * @param {Object} additionalContext - Extra context for logging
 */
export const logError = (error, level = 'error', additionalContext = {}) => {
  const errorInfo = {
    message: error.message,
    code: error.code || 'UNKNOWN',
    timestamp: new Date().toISOString(),
    context: {
      ...(error.context || {}),
      ...additionalContext
    }
  };

  // Add stack trace for development
  if (process.env.NODE_ENV === 'development') {
    errorInfo.stack = error.stack;
  }

  switch (level) {
    case 'error':
      console.error('Ghost Brief Error:', errorInfo);
      break;
    case 'warn':
      console.warn('Ghost Brief Warning:', errorInfo);
      break;
    case 'info':
      console.info('Ghost Brief Info:', errorInfo);
      break;
    default:
      console.log('Ghost Brief Log:', errorInfo);
  }

  // In production, you might want to send to error tracking service
  if (process.env.NODE_ENV === 'production' && level === 'error') {
    // Example: Send to error tracking service
    // errorTrackingService.captureError(errorInfo);
  }
};

/**
 * Get user-friendly error message for display
 * @param {Error|GhostBriefError} error - Error object
 * @returns {string} User-friendly error message
 */
export const getUserErrorMessage = (error) => {
  if (!error) return 'An unknown error occurred';

  // If it's our custom error with a user-friendly message
  if (error instanceof GhostBriefError && error.code in ERROR_MESSAGES) {
    return ERROR_MESSAGES[error.code];
  }

  // Handle common error patterns
  if (error.message.includes('fetch')) {
    return 'Unable to connect to the service. Please check your internet connection.';
  }

  if (error.message.includes('timeout')) {
    return 'The request took too long to complete. Please try again.';
  }

  if (error.message.includes('quota') || error.message.includes('storage')) {
    return 'Storage limit reached. Please clear some data and try again.';
  }

  if (error.message.includes('parsing') || error.message.includes('XML')) {
    return 'The RSS feed format is invalid or corrupted.';
  }

  // Fallback to original message if it's user-friendly
  if (error.message && error.message.length < 100 && !error.message.includes('Error:')) {
    return error.message;
  }

  return 'An unexpected error occurred. Please try again later.';
};

/**
 * Retry function with exponential backoff
 * @param {Function} fn - Function to retry
 * @param {Object} options - Retry options
 * @returns {Promise} Promise that resolves with function result or rejects with final error
 */
export const retryWithBackoff = async (fn, options = {}) => {
  const {
    maxAttempts = 3,
    initialDelay = 1000,
    backoffMultiplier = 2,
    maxDelay = 10000
  } = options;

  let lastError;
  let delay = initialDelay;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      if (attempt === maxAttempts) {
        logError(error, 'error', { 
          retryAttempts: maxAttempts,
          finalAttempt: true 
        });
        break;
      }

      logError(error, 'warn', { 
        retryAttempt: attempt,
        nextDelayMs: delay 
      });

      // Wait before next attempt
      const currentDelay = delay;
      await new Promise(resolve => setTimeout(resolve, currentDelay));
      
      // Increase delay for next attempt
      delay = Math.min(delay * backoffMultiplier, maxDelay);
    }
  }

  throw lastError;
};

/**
 * Wrap async functions with error handling
 * @param {Function} fn - Async function to wrap
 * @param {string} operationName - Name of operation for error context
 * @returns {Function} Wrapped function with error handling
 */
export const withErrorHandling = (fn, operationName = 'operation') => {
  return async (...args) => {
    try {
      return await fn(...args);
    } catch (error) {
      const wrappedError = error instanceof GhostBriefError 
        ? error 
        : createError(ERROR_CODES.UNKNOWN, `${operationName} failed: ${error.message}`, {
            operationName,
            args: args.map(arg => typeof arg)
          });
      
      logError(wrappedError);
      throw wrappedError;
    }
  };
};

/**
 * Create error boundary handler for React components
 * @param {string} componentName - Name of component for error context
 * @returns {Function} Error boundary handler
 */
export const createErrorBoundaryHandler = (componentName) => {
  return (error, errorInfo) => {
    const boundaryError = createError(
      ERROR_CODES.UNKNOWN,
      `Component error in ${componentName}`,
      {
        componentName,
        errorInfo,
        componentStack: errorInfo.componentStack
      }
    );

    logError(boundaryError, 'error', {
      type: 'component_error',
      component: componentName
    });

    return boundaryError;
  };
};