const { body, param, validationResult } = require('express-validator');

/**
 * Validation middleware to check for validation errors
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: 'Validation Error',
      details: errors.array().map(e => e.msg)
    });
  }
  next();
};

/**
 * RTI Generation validation
 */
const validateRTIGenerate = [
  body('description')
    .optional()
    .isString()
    .withMessage('Description must be a string')
    .isLength({ max: 2000 })
    .withMessage('Description cannot exceed 2000 characters'),
  
  body('department')
    .optional()
    .isString()
    .withMessage('Department must be a string'),
  
  body('location')
    .optional()
    .isString()
    .withMessage('Location must be a string'),
  
  body('language')
    .optional()
    .isIn(['en', 'hi'])
    .withMessage('Language must be either "en" or "hi"'),
  
  body('applicantName')
    .optional()
    .isString()
    .withMessage('Applicant name must be a string'),
  
  body('selectedQuestions')
    .optional()
    .isArray()
    .withMessage('Selected questions must be an array'),

  handleValidationErrors
];

/**
 * Question suggestion validation
 */
const validateQuestionSuggest = [
  body('description')
    .notEmpty()
    .withMessage('Description is required')
    .isString()
    .withMessage('Description must be a string'),
  
  body('maxQuestions')
    .optional()
    .isInt({ min: 1, max: 20 })
    .withMessage('Max questions must be between 1 and 20'),

  handleValidationErrors
];

/**
 * Template validation
 */
const validateTemplate = [
  body('name')
    .notEmpty()
    .withMessage('Template name is required')
    .isString()
    .withMessage('Template name must be a string'),
  
  body('department')
    .notEmpty()
    .withMessage('Department is required')
    .isString()
    .withMessage('Department must be a string'),
  
  body('content')
    .notEmpty()
    .withMessage('Template content is required')
    .isString()
    .withMessage('Template content must be a string'),
  
  body('language')
    .optional()
    .isIn(['en', 'hi'])
    .withMessage('Language must be either "en" or "hi"'),

  handleValidationErrors
];

/**
 * MongoDB ObjectId validation
 */
const validateMongoId = [
  param('id')
    .isMongoId()
    .withMessage('Invalid ID format'),

  handleValidationErrors
];

module.exports = {
  handleValidationErrors,
  validateRTIGenerate,
  validateQuestionSuggest,
  validateTemplate,
  validateMongoId
};
