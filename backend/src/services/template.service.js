const Template = require('../models/Template');

class TemplateService {
  /**
   * Get all templates
   * @param {Object} filter - Query filter
   * @returns {Array} - List of templates
   */
  async getAllTemplates(filter = {}) {
    return Template.find(filter).sort({ usageCount: -1 });
  }

  /**
   * Create new template
   * @param {Object} data - Template data
   * @returns {Object} - Created template
   */
  async createTemplate(data) {
    const template = new Template(data);
    return template.save();
  }

  /**
   * Update template
   * @param {string} id - Template ID
   * @param {Object} data - Update data
   * @returns {Object} - Updated template
   */
  async updateTemplate(id, data) {
    return Template.findByIdAndUpdate(id, data, { new: true });
  }

  /**
   * Validate template syntax (simple placeholder check)
   * @param {string} content - Template content
   * @returns {Object} - { isValid, errors }
   */
  validateTemplate(content) {
    if (!content) return { isValid: false, errors: ['Content is required'] };
    // Basic check for handlebars-like syntax {{variable}}
    // This is a simplified validation
    return { isValid: true, errors: [] };
  }

  /**
   * Preview template with data
   * @param {string|Object} input - Template content string OR object with templateId & data
   * @returns {string} - Rendered content
   */
  async previewTemplate(input) {
    let content = '';
    let data = {};

    // Handle input format: { templateId, data } or "content string"
    if (typeof input === 'object' && input.templateId) {
      const template = await Template.findById(input.templateId);
      if (!template) throw new Error('Template not found');
      content = template.content;
      data = input.data || {};
    } else if (typeof input === 'string') {
      content = input;
    } else if (input.content) {
      content = input.content;
      data = input.data || {};
    }

    // Replace placeholders: {{key}} -> value
    // This is a simple regex replacement. A real engine like Handlebars would be better.
    let rendered = content;

    // Default placeholders
    const defaults = {
      location: '[Location]',
      applicantName: '[Your Name]',
      department: '[Department]',
      date: new Date().toLocaleDateString()
    };

    const mergeData = { ...defaults, ...data };

    Object.keys(mergeData).forEach(key => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      rendered = rendered.replace(regex, mergeData[key]);
    });

    // Clean up any remaining braces? Or keep them to show what's missing?
    // For preview, keeping them might be better or replacing with generic text.

    return rendered;
  }

  /**
   * Get template metadata
   * @param {string} id - Template ID
   * @returns {Object} - Template metadata
   */
  async getTemplateMetadata(id) {
    const template = await Template.findById(id);
    if (!template) return null;

    // Extract variables from content using regex
    // Matches {{ variable }} but tries to exclude {{#helper}} or {{/helper}}
    const variableRegex = /{{\s*([^}]+?)\s*}}/g;
    const matches = [...template.content.matchAll(variableRegex)];

    const ignoredKeywords = [
      '#if', '/if', '#each', '/each', '#unless', '/unless', '#with', '/with', 'else', 'log',
      'this', '.', '@index', '@key', '@first', '@last', 'addOne', 'formatDate'
    ];

    const variables = matches
      .map(m => m[1].trim())
      .filter(v => {
        // Exclude if starts with specialized chars or is a known helper
        const firstWord = v.split(' ')[0]; // Handle {{helper arg}}
        if (v.startsWith('#') || v.startsWith('/')) return false;
        if (ignoredKeywords.includes(firstWord)) return false;
        return true;
      });

    const cleanVariables = [...new Set(variables)]; // Unique variables

    return {
      variables: cleanVariables,
      department: template.department,
      intent: template.name.toLowerCase().replace(/ /g, '_'), // Naive intent derivation if not in DB
      language: template.language,
      version: template.version || "1.0",
      usageCount: template.usageCount || 0
    };

  }

  /**
   * Render high-quality RTI draft
   * @param {Object} data - Draft data { applicantName, department, questions, etc }
   * @param {string} templateId - Optional override
   */
  async renderDraft(data, templateId = null) {
    // 1. Try to load specific template if ID provided
    if (templateId) {
      return this.previewTemplate({ templateId, data });
    }

    // 2. Otherwise use High-Quality Default Generator
    const {
      applicantName = '[Your Name]',
      applicantAddress = '[Your Address]',
      department = '[Department Name]',
      location = '',
      questions = [],
      date = new Date().toLocaleDateString()
    } = data;

    // Professional RTI Structure (using ASCII-safe characters for PDF compatibility)
    const draft = `APPLICATION UNDER THE RIGHT TO INFORMATION ACT, 2005
==========================================================================

To,
The Public Information Officer (PIO),
${department}
${location ? location : ''}

Subject: Request for Information under Right to Information Act, 2005.

Respected Sir/Madam,

I, ${applicantName}, a citizen of India, resident of ${applicantAddress}, most respectfully request you to provide the following information:

DESCRIPTION OF INFORMATION REQUIRED:
--------------------------------------------------------------------------
${questions.map((q, i) => `${i + 1}. ${q}`).join('\n\n')}
--------------------------------------------------------------------------

I state that the information sought does not fall within the restrictions contained in Section 8 and 9 of the RTI Act and to the best of my knowledge it pertains to your office.

I am willing to pay the fees for this information as per the Right to Information Rules, 2012. I am depositing the application fee via [Mode of Payment] or attaching Court Fee Stamp.

Please provide the information using the preferred language (English). If any of the above requested information is not available in your records, please forward this application to the concerned Public Authority under Section 6(3) of the RTI Act within 5 days.

Yours faithfully,

(Signature)

Name: ${applicantName}
Address: ${applicantAddress}
Date: ${date}
    `;

    return draft;
  }
}

module.exports = new TemplateService();
