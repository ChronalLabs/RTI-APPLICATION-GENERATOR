/**
 * Utility Helper Functions
 */

/**
 * Async handler wrapper to catch errors
 * @param {Function} fn - Async function
 * @returns {Function} - Wrapped function
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

/**
 * Create a custom error with status code
 * @param {string} message - Error message
 * @param {number} statusCode - HTTP status code
 * @returns {Error} - Custom error object
 */
const createError = (message, statusCode = 500) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

/**
 * Format API response
 * @param {boolean} success - Success status
 * @param {*} data - Response data
 * @param {string} message - Optional message
 * @returns {Object} - Formatted response
 */
const formatResponse = (success, data, message = null) => {
  const response = { success };
  
  if (data !== undefined) {
    response.data = data;
  }
  
  if (message) {
    response.message = message;
  }
  
  return response;
};

/**
 * Capitalize first letter of string
 * @param {string} str - Input string
 * @returns {string} - Capitalized string
 */
const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Sleep utility for async operations
 * @param {number} ms - Milliseconds to sleep
 * @returns {Promise} - Promise that resolves after ms
 */
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Check if value is empty (null, undefined, empty string, empty array, empty object)
 * @param {*} value - Value to check
 * @returns {boolean} - Whether value is empty
 */
const isEmpty = (value) => {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim().length === 0;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
};

module.exports = {
  asyncHandler,
  createError,
  formatResponse,
  capitalize,
  sleep,
  isEmpty
};
