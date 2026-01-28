/**
 * Validation Service
 * Purpose: Evaluate the quality and completeness of RTI drafts
 */
class ValidationService {
  constructor() {
    this.validationRules = {
      applicantName: { weight: 15, required: true },
      applicantAddress: { weight: 10, required: false },
      department: { weight: 15, required: true },
      location: { weight: 10, required: false },
      questions: { weight: 25, required: true, minCount: 1 },
      draftText: { weight: 25, required: true, minLength: 100 }
    };
  }

  /**
   * Validate an RTI draft
   * @param {Object} draft - Draft to validate
   * @returns {Object} - Validation result with score and warnings
   */
  validateDraft(draft) {
    const warnings = [];
    const suggestions = [];
    let totalScore = 0;
    let maxScore = 0;

    // Check each validation rule
    for (const [field, rule] of Object.entries(this.validationRules)) {
      maxScore += rule.weight;
      const value = draft[field];

      if (rule.required && !this.hasValue(value)) {
        warnings.push(`Missing required field: ${this.formatFieldName(field)}`);
      } else if (!rule.required && !this.hasValue(value)) {
        suggestions.push(`Consider adding: ${this.formatFieldName(field)}`);
        totalScore += rule.weight * 0.5;
      } else {
        const fieldScore = this.validateField(field, value, rule, warnings, suggestions);
        totalScore += fieldScore;
      }
    }

    // Additional content-based validations
    this.validateContent(draft, warnings, suggestions);

    const score = Math.round((totalScore / maxScore) * 100);

    return {
      score: Math.min(score, 100),
      warnings,
      suggestions,
      isValid: warnings.filter(w => w.includes('Missing required')).length === 0,
      completeness: this.calculateCompleteness(draft)
    };
  }

  /**
   * Check if a value exists
   * @param {*} value - Value to check
   * @returns {boolean} - Whether value exists
   */
  hasValue(value) {
    if (value === null || value === undefined) return false;
    if (typeof value === 'string') return value.trim().length > 0;
    if (Array.isArray(value)) return value.length > 0;
    return true;
  }

  /**
   * Validate a specific field
   * @param {string} field - Field name
   * @param {*} value - Field value
   * @param {Object} rule - Validation rule
   * @param {Array} warnings - Warnings array
   * @param {Array} suggestions - Suggestions array
   * @returns {number} - Score for this field
   */
  validateField(field, value, rule, warnings, suggestions) {
    let score = rule.weight;

    switch (field) {
      case 'questions':
        if (Array.isArray(value)) {
          if (value.length < (rule.minCount || 1)) {
            warnings.push('At least one question is required');
            score *= 0.5;
          } else if (value.length < 3) {
            suggestions.push('Consider adding more specific questions for better results');
            score *= 0.8;
          }
        }
        break;

      case 'draftText':
        if (typeof value === 'string') {
          if (value.length < (rule.minLength || 100)) {
            warnings.push('Draft text seems incomplete');
            score *= 0.7;
          }
          if (value.includes('[Your Name]') || value.includes('[Department Name]')) {
            warnings.push('Draft contains placeholder text that needs to be filled');
            score *= 0.8;
          }
        }
        break;

      case 'applicantName':
        if (typeof value === 'string' && value.length < 3) {
          warnings.push('Applicant name seems incomplete');
          score *= 0.7;
        }
        break;
    }

    return score;
  }

  /**
   * Perform content-based validations
   * @param {Object} draft - Draft to validate
   * @param {Array} warnings - Warnings array
   * @param {Array} suggestions - Suggestions array
   */
  validateContent(draft, warnings, suggestions) {
    const { draftText } = draft;
    if (!draftText) return;

    if (!draftText.toLowerCase().includes('right to information') && 
        !draftText.toLowerCase().includes('rti act')) {
      suggestions.push('Consider explicitly mentioning the RTI Act, 2005');
    }

    if (!draftText.toLowerCase().includes('yours faithfully') && 
        !draftText.toLowerCase().includes('yours sincerely')) {
      suggestions.push('Consider adding a formal closing (Yours faithfully)');
    }
  }

  /**
   * Format field name for display
   * @param {string} field - Field name
   * @returns {string} - Formatted name
   */
  formatFieldName(field) {
    const nameMap = {
      applicantName: 'Applicant Name',
      applicantAddress: 'Applicant Address',
      department: 'Department',
      location: 'Location',
      questions: 'Questions',
      draftText: 'Draft Text'
    };
    return nameMap[field] || field;
  }

  /**
   * Calculate completeness percentage
   * @param {Object} draft - Draft to check
   * @returns {Object} - Completeness metrics
   */
  calculateCompleteness(draft) {
    const fields = ['applicantName', 'applicantAddress', 'department', 'location', 'questions'];
    let filled = 0;

    for (const field of fields) {
      if (this.hasValue(draft[field])) {
        filled++;
      }
    }

    return {
      percentage: Math.round((filled / fields.length) * 100),
      filledFields: filled,
      totalFields: fields.length
    };
  }

  /**
   * Get validation summary
   * @param {Object} validationResult - Validation result
   * @returns {Object} - Summary
   */
  getSummary(validationResult) {
    const { score, warnings, suggestions, completeness } = validationResult;

    let status;
    if (score >= 80) status = 'excellent';
    else if (score >= 60) status = 'good';
    else if (score >= 40) status = 'fair';
    else status = 'needs_improvement';

    return {
      status,
      score,
      completeness: completeness.percentage,
      issueCount: warnings.length,
      suggestionCount: suggestions.length
    };
  }
}

module.exports = new ValidationService();
