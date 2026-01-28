const draftService = require('../services/draft.service');
const validationService = require('../services/validation.service');
const pdfService = require('../services/pdf.service');
const intentService = require('../services/intent.service');
const questionService = require('../services/question.service');

/**
 * RTI Controller
 * Handles RTI draft generation and validation
 */

/**
 * Step 2: Analyze user input
 * POST /api/v1/rti/analyze
 */
exports.analyze = async (req, res, next) => {
  try {
    const { problem } = req.body;

    if (!problem) {
      return res.status(400).json({ success: false, error: 'Problem description is required' });
    }

    // Backend Flow: Controller -> Intent Engine -> Department Mapper
    const intent = await intentService.detectIntent(problem);

    res.status(200).json({
      success: true,
      data: {
        detectedDepartment: intent.department,
        department: intent.department, // Added for frontend compatibility
        intent: intent.keywords ? intent.keywords[0] : 'general', // Simplified intent name
        confidence: intent.confidence,
        keywords: intent.keywords // Keep this for UI tags
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Step 3: Get Smart Question Suggestions
 * POST /api/v1/rti/questions
 */
exports.questions = async (req, res, next) => {
  try {
    const { problem, department, intent } = req.body;

    // Backend Flow: Controller -> Question Engine
    // We assume getSuggestionsWithExplanations can handle the input
    const suggestions = questionService.getSuggestionsWithExplanations({
      department: department,
      keywords: intent ? [intent] : [] // Simplification for now
    }, {
      maxQuestions: 5,
      language: req.body.language || 'en'
    });

    res.status(200).json({
      success: true,
      data: {
        questions: suggestions // Return as "questions" array per spec (mapped frontend can invoke this)
      }
    });

  } catch (error) {
    next(error);
  }
};


/**
 * Generate RTI draft
 * POST /api/v1/rti/generate
 */
exports.generate = async (req, res, next) => {
  try {
    const {
      problem, // Changed from description to match spec
      description, // Backward compatibility
      department,
      location,
      language,
      applicantName,
      applicantAddress,
      questions
    } = req.body;

    const result = await draftService.generateDraft({
      description: problem || description,
      department,
      location,
      language,
      applicantName,
      applicantAddress,
      selectedQuestions: questions || []
    });

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Validate RTI draft
 * POST /api/v1/rti/validate
 */
exports.validate = async (req, res, next) => {
  try {
    const draft = req.body;

    const validationResult = validationService.validateDraft(draft);
    const summary = validationService.getSummary(validationResult);

    res.status(200).json({
      success: true,
      data: {
        ...validationResult,
        summary
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Save RTI draft
 * POST /api/v1/rti/save
 */
exports.save = async (req, res, next) => {
  try {
    const draftData = req.body;
    const savedDraft = await draftService.saveDraft(draftData);

    res.status(201).json({
      success: true,
      data: savedDraft
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get RTI draft by ID
 * GET /api/v1/rti/:id
 */
exports.getById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const draft = await draftService.getDraft(id);

    if (!draft) {
      return res.status(404).json({
        success: false,
        error: 'Draft not found'
      });
    }

    res.status(200).json({
      success: true,
      data: draft
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update RTI draft
 * PUT /api/v1/rti/:id
 */
exports.update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedDraft = await draftService.updateDraft(id, updateData);

    if (!updatedDraft) {
      return res.status(404).json({
        success: false,
        error: 'Draft not found'
      });
    }

    res.status(200).json({
      success: true,
      data: updatedDraft
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Download RTI draft as PDF
 * POST /api/v1/rti/pdf
 */
exports.downloadPdf = async (req, res, next) => {
  try {
    // The spec says { draft: "..." }, but our service might need more content
    // We'll support both "draft" string or "content"
    const { content, draft, department } = req.body;

    const pdfContent = draft || content;

    if (!pdfContent) {
      return res.status(400).json({ success: false, error: 'Draft content is required' });
    }

    const doc = pdfService.createPdf(pdfContent, { department });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=rti-application.pdf');

    doc.pipe(res);
    doc.end();
  } catch (error) {
    next(error);
  }


};

/**
 * Score RTI application (Intelligence Engine)
 * POST /api/v1/rti/score
 */
exports.score = async (req, res, next) => {
  try {
    const { questions, department, intent } = req.body;

    // Use ScoreService (lazy loading or import at top if prefer)
    const scoreService = require('../services/score.service');
    // Use analyzeDraft to get consistent format (riskLevel, completeness)
    const result = scoreService.analyzeDraft({ questions, department, intent });

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};
