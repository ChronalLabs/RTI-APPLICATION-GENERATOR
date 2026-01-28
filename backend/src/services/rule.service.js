const Rule = require('../models/Rule');

/**
 * Rule Service
 * Purpose: Apply RTI-specific rules dynamically
 */
class RuleService {
  /**
   * Evaluate all rules against context
   * @param {Object} context - The context to evaluate rules against
   * @returns {Object} - Results with applied actions and warnings
   */
  async evaluateRules(context) {
    const rules = await Rule.find({ isActive: true }).sort({ priority: -1 });
    
    const results = {
      appliedRules: [],
      actions: [],
      warnings: [],
      templateOverride: null,
      scoreModifiers: [],
      additionalQuestions: []
    };

    for (const rule of rules) {
      if (this.evaluateConditions(rule.conditions, context)) {
        results.appliedRules.push(rule.name);
        
        for (const action of rule.actions) {
          this.applyAction(action, results, context);
        }
      }
    }

    return results;
  }

  /**
   * Evaluate all conditions for a rule
   * @param {Array} conditions - Rule conditions
   * @param {Object} context - Evaluation context
   * @returns {boolean} - Whether all conditions are met
   */
  evaluateConditions(conditions, context) {
    return conditions.every(condition => this.evaluateCondition(condition, context));
  }

  /**
   * Evaluate a single condition
   * @param {Object} condition - The condition to evaluate
   * @param {Object} context - Evaluation context
   * @returns {boolean} - Whether condition is met
   */
  evaluateCondition(condition, context) {
    const { field, operator, value } = condition;
    const contextValue = this.getNestedValue(context, field);

    switch (operator) {
      case 'equals':
        return contextValue === value;
      case 'not_equals':
        return contextValue !== value;
      case 'contains':
        if (Array.isArray(contextValue)) {
          return contextValue.includes(value);
        }
        if (typeof contextValue === 'string') {
          return contextValue.toLowerCase().includes(value.toLowerCase());
        }
        return false;
      case 'greater_than':
        return Number(contextValue) > Number(value);
      case 'less_than':
        return Number(contextValue) < Number(value);
      case 'in':
        return Array.isArray(value) && value.includes(contextValue);
      case 'not_in':
        return Array.isArray(value) && !value.includes(contextValue);
      default:
        return false;
    }
  }

  /**
   * Get nested value from object using dot notation
   * @param {Object} obj - The object
   * @param {string} path - Dot-separated path
   * @returns {*} - The value
   */
  getNestedValue(obj, path) {
    return path.split('.').reduce((current, key) => {
      return current && current[key] !== undefined ? current[key] : undefined;
    }, obj);
  }

  /**
   * Apply an action based on rule evaluation
   * @param {Object} action - The action to apply
   * @param {Object} results - Results object to modify
   * @param {Object} context - Current context
   */
  applyAction(action, results, context) {
    switch (action.type) {
      case 'setTemplate':
        results.templateOverride = action.value;
        results.actions.push({ type: 'setTemplate', value: action.value });
        break;
      case 'addWarning':
        results.warnings.push(action.value);
        results.actions.push({ type: 'addWarning', value: action.value });
        break;
      case 'setScore':
        results.scoreModifiers.push({ type: 'set', value: action.value });
        results.actions.push({ type: 'setScore', value: action.value });
        break;
      case 'addQuestion':
        results.additionalQuestions.push(action.value);
        results.actions.push({ type: 'addQuestion', value: action.value });
        break;
      default:
        console.warn(`Unknown action type: ${action.type}`);
    }
  }

  /**
   * Create a new rule
   * @param {Object} ruleData - Rule data
   * @returns {Object} - Created rule
   */
  async createRule(ruleData) {
    const rule = new Rule(ruleData);
    await rule.save();
    return rule;
  }

  /**
   * Get all active rules
   * @returns {Array} - List of active rules
   */
  async getActiveRules() {
    return Rule.find({ isActive: true }).sort({ priority: -1 });
  }
}

module.exports = new RuleService();
