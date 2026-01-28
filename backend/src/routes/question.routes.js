const express = require('express');
const router = express.Router();
const questionController = require('../controllers/question.controller');
const { validateQuestionSuggest } = require('../middlewares/validate.middleware');

/**
 * Question Routes
 * Base path: /api/v1/questions
 */

// Suggest questions based on description
router.post('/suggest', validateQuestionSuggest, questionController.suggest);

// Generate questions
router.post('/generate', questionController.generate);

// Get question categories
router.get('/categories', questionController.getCategories);

// Get all departments
router.get('/departments', questionController.getDepartments);

// Get graph data
router.get('/graph', questionController.getGraphData);

// Library - Get Domains
router.get('/domains', questionController.getDomains);

// Library - Browse Questions
router.get('/library', questionController.getLibrary);

// Library - Add Question
router.post('/add', questionController.addQuestion);

module.exports = router;
