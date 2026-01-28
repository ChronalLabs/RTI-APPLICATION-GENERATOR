const intentService = require('./intent.service');
const questionService = require('./question.service');
const ruleService = require('./rule.service');
const templateService = require('./template.service');
const scoreService = require('./score.service');
const Draft = require('../models/Draft');

/**
 * Draft Service
 * Purpose: Orchestrate all services to generate complete RTI drafts
 */
class DraftService {
  /**
   * Generate a complete RTI draft
   * @param {Object} input - User input
   * @returns {Object} - Generated draft with metadata
   */
  async generateDraft(input) {
    const {
      description,
      department: inputDepartment,
      location,
      language = 'en',
      applicantName,
      applicantAddress,
      selectedQuestions
    } = input;

    // Step 1: Detect intent from description
    const intent = await intentService.detectIntent(description);

    // Use provided department or detected one
    const department = inputDepartment || intent.department;

    // Step 2: Generate questions
    let questions;
    if (selectedQuestions && selectedQuestions.length > 0) {
      questions = selectedQuestions;
    } else {
      questions = questionService.generateQuestions({
        ...intent,
        department
      });
    }

    // Step 3: Build context for rule evaluation
    const context = {
      description,
      department,
      location,
      language,
      applicantName,
      applicantAddress,
      questions,
      questionsCount: questions.length,
      intent
    };

    // Step 4: Apply rules
    const ruleResults = await ruleService.evaluateRules(context);

    // Add any additional questions from rules
    if (ruleResults.additionalQuestions && ruleResults.additionalQuestions.length > 0) {
      questions.push(...ruleResults.additionalQuestions);
    }

    // Step 5: Render draft using template
    const draftData = {
      applicantName: applicantName || '[Your Name]',
      applicantAddress: applicantAddress || '',
      department: department || '[Department Name]',
      location: location || '',
      language,
      language,
      questions,
      topic: intent.keywords ? intent.keywords.join(' ') : ''
    };

    const draftText = await templateService.renderDraft(
      draftData,
      ruleResults.templateOverride
    );

    // Step 6: Validate & Score draft
    const analysis = scoreService.analyzeDraft({
      ...draftData,
      draftText
    });

    // Step 7: Compile final result
    return {
      draft: draftText,
      questions,
      department,
      intent: {
        keywords: intent.keywords,
        confidence: intent.confidence
      },
      score: analysis.score,
      riskLevel: analysis.riskLevel, // New Field
      warnings: analysis.suggestions, // Mapping suggestions to warnings for frontend compatibility
      suggestions: analysis.suggestions,
      completeness: analysis.completeness,
      appliedRules: ruleResults.appliedRules,
      metadata: {
        generatedAt: new Date(),
        language,
        templateUsed: ruleResults.templateOverride || 'default'
      }
    };
  }

  /**
   * Save draft to database
   * @param {Object} draftData - Draft data to save
   * @returns {Object} - Saved draft
   */
  async saveDraft(draftData) {
    const draft = new Draft({
      applicantName: draftData.applicantName,
      applicantAddress: draftData.applicantAddress,
      department: draftData.department,
      location: draftData.location,
      description: draftData.description,
      questions: draftData.questions,
      draftText: draftData.draft,
      score: draftData.score,
      warnings: draftData.warnings,
      language: draftData.language || 'en'
    });

    await draft.save();
    return draft;
  }

  /**
   * Get draft by ID
   * @param {string} draftId - Draft ID
   * @returns {Object} - Draft
   */
  async getDraft(draftId) {
    return Draft.findById(draftId);
  }

  /**
   * Update draft
   * @param {string} draftId - Draft ID
   * @param {Object} updateData - Data to update
   * @returns {Object} - Updated draft
   */
  async updateDraft(draftId, updateData) {
    return Draft.findByIdAndUpdate(draftId, updateData, { new: true });
  }
}

module.exports = new DraftService();
