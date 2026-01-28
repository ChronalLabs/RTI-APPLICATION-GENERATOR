const intentService = require('../services/intent.service');
const questionService = require('../services/question.service');

/**
 * Question Controller
 * Handles question suggestion and generation
 */

/**
 * Suggest questions based on description
 * POST /api/v1/questions/suggest
 */
exports.suggest = async (req, res, next) => {
  try {
    const { description, department, maxQuestions = 5, categories = [] } = req.body;

    // Detect intent from description
    const intent = await intentService.detectIntent(description);

    // Override department if provided
    if (department) {
      intent.department = department;
    }

    // Generate questions with explanations
    const suggestions = questionService.getSuggestionsWithExplanations(intent, {
      maxQuestions,
      categories,
      language: req.body.language || 'en'
    });

    res.status(200).json({
      success: true,
      data: {
        intent: {
          keywords: intent.keywords,
          department: intent.department,
          confidence: intent.confidence
        },
        suggestions
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Generate questions
 * POST /api/v1/questions/generate
 */
exports.generate = async (req, res, next) => {
  try {
    const { description, department, maxQuestions = 5 } = req.body;

    const intent = await intentService.detectIntent(description);

    if (department) {
      intent.department = department;
    }

    const questions = questionService.generateQuestions(intent, { maxQuestions });

    res.status(200).json({
      success: true,
      data: {
        questions,
        intent: {
          keywords: intent.keywords,
          department: intent.department
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get question categories
 * GET /api/v1/questions/categories
 */
exports.getCategories = async (req, res, next) => {
  try {
    const categories = questionService.getCategories();

    res.status(200).json({
      success: true,
      data: categories
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all departments
 * GET /api/v1/questions/departments
 */
exports.getDepartments = async (req, res, next) => {
  try {
    const departments = await intentService.getAllDepartments();

    res.status(200).json({
      success: true,
      data: departments
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get graph data
 * GET /api/v1/questions/graph
 */
exports.getGraphData = async (req, res, next) => {
  try {
    const graphData = questionService.getGraphData();
    res.status(200).json({
      success: true,
      data: graphData
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get question domains
 * GET /api/v1/questions/domains
 */
exports.getDomains = async (req, res, next) => {
  try {
    const domains = questionService.getDomains();
    res.status(200).json({
      success: true,
      data: domains
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get question library (browse)
 * GET /api/v1/questions/library
 */
exports.getLibrary = async (req, res, next) => {
  try {
    const { domain, intent } = req.query;
    const questions = questionService.getAllQuestions(domain, intent);
    res.status(200).json({
      success: true,
      data: questions
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Add new question
 * POST /api/v1/questions/add
 */
exports.addQuestion = async (req, res, next) => {
  try {
    const { domain, question } = req.body;
    if (!domain || !question) {
      return res.status(400).json({ success: false, error: 'Domain and Question are required' });
    }
    const result = questionService.addQuestion(domain, question);
    res.status(201).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};
