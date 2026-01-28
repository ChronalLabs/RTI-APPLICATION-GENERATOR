const express = require('express');
const router = express.Router();
const questionController = require('../controllers/question.controller');

/**
 * Graph Routes
 * Base path: /api/v1/graph
 */

// Step 9: Knowledge Graph Flow
router.get('/', questionController.getGraphData);

module.exports = router;
