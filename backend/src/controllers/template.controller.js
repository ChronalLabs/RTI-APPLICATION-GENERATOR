const templateService = require('../services/template.service');
const Template = require('../models/Template');

/**
 * Template Controller
 * Handles template CRUD operations
 */

/**
 * Get all templates
 * GET /api/v1/templates
 */
exports.getAll = async (req, res, next) => {
  try {
    const { department, language } = req.query;

    const filter = {};
    if (department) filter.department = department;
    if (language) filter.language = language;

    const templates = await templateService.getAllTemplates(filter);

    res.status(200).json({
      success: true,
      count: templates.length,
      data: templates
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get template by ID
 * GET /api/v1/templates/:id
 */
exports.getById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const template = await Template.findById(id);

    if (!template) {
      return res.status(404).json({
        success: false,
        error: 'Template not found'
      });
    }

    res.status(200).json({
      success: true,
      data: template
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create new template
 * POST /api/v1/templates
 */
exports.create = async (req, res, next) => {
  try {
    const templateData = req.body;

    // Validate template syntax
    const validation = templateService.validateTemplate(templateData.content);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        error: 'Invalid template syntax',
        details: validation.errors
      });
    }

    const template = await templateService.createTemplate(templateData);

    res.status(201).json({
      success: true,
      data: template
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update template
 * PUT /api/v1/templates/:id
 */
exports.update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (updateData.content) {
      const validation = templateService.validateTemplate(updateData.content);
      if (!validation.isValid) {
        return res.status(400).json({
          success: false,
          error: 'Invalid template syntax',
          details: validation.errors
        });
      }
    }

    const template = await templateService.updateTemplate(id, updateData);

    if (!template) {
      return res.status(404).json({
        success: false,
        error: 'Template not found'
      });
    }

    res.status(200).json({
      success: true,
      data: template
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete template (soft delete)
 * DELETE /api/v1/templates/:id
 */
exports.delete = async (req, res, next) => {
  try {
    const { id } = req.params;
    const template = await templateService.updateTemplate(id, { isActive: false });

    if (!template) {
      return res.status(404).json({
        success: false,
        error: 'Template not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Template deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Preview template with sample data
 * POST /api/v1/templates/preview
 */
exports.preview = async (req, res, next) => {
  try {
    const { content, templateId, data } = req.body;

    // Use content if provided (direct preview), otherwise use templateId
    let preview;
    if (content) {
      const validation = templateService.validateTemplate(content);
      if (!validation.isValid) {
        return res.status(400).json({
          success: false,
          error: 'Invalid template syntax',
          details: validation.errors
        });
      }
      preview = await templateService.previewTemplate({ content, data });
    } else if (templateId) {
      preview = await templateService.previewTemplate({ templateId, data });
    } else {
      return res.status(400).json({ success: false, error: 'Template content or ID is required' });
    }

    res.status(200).json({
      success: true,
      data: { preview }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get template metadata
 * GET /api/v1/templates/:id/meta
 */
exports.getMeta = async (req, res, next) => {
  try {
    const { id } = req.params;
    const meta = await templateService.getTemplateMetadata(id);

    if (!meta) {
      return res.status(404).json({
        success: false,
        error: 'Template not found'
      });
    }

    res.status(200).json({
      success: true,
      data: meta
    });
  } catch (error) {
    next(error);
  }
};
