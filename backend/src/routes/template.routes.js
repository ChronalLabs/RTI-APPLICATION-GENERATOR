const express = require('express');
const router = express.Router();
const templateController = require('../controllers/template.controller');
const { validateTemplate } = require('../middlewares/validate.middleware');

/**
 * Template Routes
 * Base path: /api/v1/templates
 */

// Get all templates
router.get('/', templateController.getAll);

// Preview template
router.post('/preview', templateController.preview);

// Get template by ID
router.get('/:id', templateController.getById);

// Get template metadata
router.get('/:id/meta', templateController.getMeta);

// Create new template
router.post('/', validateTemplate, templateController.create);

// Update template
router.put('/:id', templateController.update);

// Delete template
router.delete('/:id', templateController.delete);

module.exports = router;
