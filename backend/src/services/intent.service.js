const Department = require('../models/Department');
const { DEPARTMENTS, STOP_WORDS } = require('../constants/departments');

/**
 * Intent Service
 * Purpose: Identify keywords and departments from user input
 */
class IntentService {
  /**
   * Detect intent from user description
   * @param {string} description - User's issue description
   * @returns {Object} - Detected keywords and department
   */
  async detectIntent(description) {
    if (!description || typeof description !== 'string') {
      return { keywords: [], department: null, confidence: 0 };
    }

    const normalizedText = description.toLowerCase().trim();
    const keywords = this.extractKeywords(normalizedText);
    const department = await this.mapToDepartment(keywords);

    return {
      keywords,
      department: department?.name || null,
      departmentId: department?._id || null,
      confidence: this.calculateConfidence(keywords, department)
    };
  }

  /**
   * Extract keywords from text
   * @param {string} text - Input text
   * @returns {Array} - Extracted keywords
   */
  extractKeywords(text) {
    // Split text into words and filter
    const words = text
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 2 && !STOP_WORDS.includes(word));

    // Remove duplicates
    return [...new Set(words)];
  }

  /**
   * Map keywords to department
   * @param {Array} keywords - Extracted keywords
   * @returns {Object|null} - Matched department
   */
  async mapToDepartment(keywords) {
    if (!keywords || keywords.length === 0) {
      return null;
    }

    // First try to find from database
    const dbDepartments = await Department.find({ isActive: true });
    
    if (dbDepartments.length > 0) {
      let bestMatch = null;
      let maxScore = 0;

      for (const dept of dbDepartments) {
        const deptKeywords = dept.keywords.map(k => k.toLowerCase());
        const matchCount = keywords.filter(k => deptKeywords.includes(k)).length;
        
        if (matchCount > maxScore) {
          maxScore = matchCount;
          bestMatch = dept;
        }
      }

      if (bestMatch) return bestMatch;
    }

    // Fallback to constants
    let bestMatch = null;
    let maxScore = 0;

    for (const [key, dept] of Object.entries(DEPARTMENTS)) {
      const deptKeywords = dept.keywords.map(k => k.toLowerCase());
      const matchCount = keywords.filter(k => deptKeywords.includes(k)).length;
      
      if (matchCount > maxScore) {
        maxScore = matchCount;
        bestMatch = { name: dept.name, displayName: dept.displayName, keywords: dept.keywords };
      }
    }

    return bestMatch;
  }

  /**
   * Calculate confidence score
   * @param {Array} keywords - Extracted keywords
   * @param {Object} department - Matched department
   * @returns {number} - Confidence score (0-100)
   */
  calculateConfidence(keywords, department) {
    if (!department || keywords.length === 0) {
      return 0;
    }

    const deptKeywords = (department.keywords || []).map(k => k.toLowerCase());
    const matchCount = keywords.filter(k => deptKeywords.includes(k)).length;
    
    // Calculate confidence based on match ratio
    const confidence = Math.min((matchCount / Math.max(keywords.length, 1)) * 100, 100);
    return Math.round(confidence);
  }

  /**
   * Get all departments
   * @returns {Array} - List of departments
   */
  async getAllDepartments() {
    const dbDepartments = await Department.find({ isActive: true });
    
    if (dbDepartments.length > 0) {
      return dbDepartments;
    }

    // Return from constants
    return Object.values(DEPARTMENTS).map(dept => ({
      name: dept.name,
      displayName: dept.displayName,
      keywords: dept.keywords,
      description: dept.description
    }));
  }
}

module.exports = new IntentService();
