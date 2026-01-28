const express = require('express');
const router = express.Router();
const rtiController = require('../controllers/rti.controller');
const { validateRTIGenerate } = require('../middlewares/validate.middleware');

/**
 * RTI Routes
 * Base path: /api/v1/rti
 */

// Step 2: Analyze user input (Intent Detection)
router.post('/analyze', rtiController.analyze);

// Step 3: Get Smart Questions
router.post('/questions', rtiController.questions);

// Step 5: Generate RTI draft
router.post('/generate', validateRTIGenerate, rtiController.generate);

// Step 5.5: Score/Validate (Intelligence)
router.post('/score', rtiController.score);

// Step 7: Download PDF
router.post('/pdf', rtiController.downloadPdf); // Changed to /pdf to match spec
router.post('/download-pdf', rtiController.downloadPdf); // Keep for backward compatibility if needed

// Validate RTI draft
router.post('/validate', rtiController.validate);

// Save RTI draft
router.post('/save', rtiController.save);

// Get draft by ID
router.get('/:id', rtiController.getById);

// Update draft
router.put('/:id', rtiController.update);

module.exports = router;
