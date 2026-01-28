const { QUESTION_CATEGORIES, DEPARTMENTS } = require('../constants/departments');

/**
 * Question Service
 * Purpose: Convert vague intent into structured RTI questions
 */
class QuestionService {
  constructor() {
    // Question templates by category
    this.questionTemplates = {
      budget: [
        'Provide detailed budget allocation for {topic}.',
        'Provide expenditure details for {topic} for the last {years} years.',
        'Provide copies of all financial approvals related to {topic}.',
        'Provide audit reports related to {topic}.'
      ],
      contractor: [
        'Provide details of contractors involved in {topic}.',
        'Provide copies of contracts awarded for {topic}.',
        'Provide information about the tendering process for {topic}.',
        'Provide details of work orders issued for {topic}.'
      ],
      timeline: [
        'Provide project timeline and milestones for {topic}.',
        'Provide reasons for any delays in {topic}.',
        'Provide expected completion date for {topic}.',
        'Provide current status of {topic}.'
      ],
      documents: [
        'Provide copies of all official documents related to {topic}.',
        'Provide meeting minutes and decisions regarding {topic}.',
        'Provide correspondence related to {topic}.',
        'Provide inspection reports related to {topic}.'
      ],
      personnel: [
        'Provide details of officials responsible for {topic}.',
        'Provide organizational structure related to {topic}.',
        'Provide contact information of the concerned department for {topic}.',
        'Provide details of action taken by officials regarding {topic}.'
      ],
      general: [
        'Provide complete details regarding {topic}.',
        'Provide current status of {topic}.',
        'Provide any reports or studies conducted on {topic}.',
        'Provide records of complaints received regarding {topic}.'
      ],
      general: [
        'Provide complete details regarding {topic}.',
        'Provide current status of {topic}.',
        'Provide any reports or studies conducted on {topic}.',
        'Provide records of complaints received regarding {topic}.'
      ]
    };

    // Hindi Question Templates
    this.questionTemplatesHi = {
      general: [
        '{topic} के संबंध में पूर्ण विवरण प्रदान करें।',
        '{topic} की वर्तमान स्थिति प्रदान करें।',
        '{topic} पर की गई किसी भी रिपोर्ट या अध्ययन की प्रति प्रदान करें।',
        '{topic} के संबंध में प्राप्त शिकायतों का रिकॉर्ड प्रदान करें।'
      ]
    };
  }

  /**
   * Generate questions based on intent
   * @param {Object} intent - Intent object with keywords and department
   * @param {Object} options - Additional options
   * @returns {Array} - Generated questions
   */
  generateQuestions(intent, options = {}) {
    const { keywords = [], department } = intent;
    const { maxQuestions = 5, categories = [] } = options;

    if (!keywords || keywords.length === 0) {
      return this.getDefaultQuestions(department);
    }

    const topic = keywords.join(' ');
    const questions = [];
    const selectedCategories = categories.length > 0
      ? categories
      : this.inferCategories(keywords);

    // Generate questions from selected categories
    for (const category of selectedCategories) {
      const templates = this.questionTemplates[category] || this.questionTemplates.general;

      for (const template of templates) {
        if (questions.length >= maxQuestions) break;

        const question = this.fillTemplate(template, { topic, years: 3 });
        if (!questions.includes(question)) {
          questions.push(question);
        }
      }
    }

    // Fill remaining slots with general questions
    while (questions.length < maxQuestions) {
      const generalTemplates = this.questionTemplates.general;
      for (const template of generalTemplates) {
        if (questions.length >= maxQuestions) break;

        const question = this.fillTemplate(template, { topic, years: 3 });
        if (!questions.includes(question)) {
          questions.push(question);
        }
      }
      break;
    }

    return questions;
  }

  /**
   * Infer question categories from keywords
   * @param {Array} keywords - Extracted keywords
   * @returns {Array} - Inferred categories
   */
  inferCategories(keywords) {
    const inferredCategories = new Set();

    for (const keyword of keywords) {
      for (const [key, category] of Object.entries(QUESTION_CATEGORIES)) {
        if (category.keywords.some(ck => keyword.includes(ck) || ck.includes(keyword))) {
          inferredCategories.add(category.id);
        }
      }
    }

    // Always include general if nothing specific found
    if (inferredCategories.size === 0) {
      inferredCategories.add('general');
    }

    return Array.from(inferredCategories);
  }

  /**
   * Fill template with values
   * @param {string} template - Question template
   * @param {Object} values - Values to fill
   * @returns {string} - Filled question
   */
  fillTemplate(template, values) {
    let result = template;
    for (const [key, value] of Object.entries(values)) {
      result = result.replace(new RegExp(`{${key}}`, 'g'), value);
    }
    return result;
  }

  /**
   * Get default questions for a department
   * @param {string} department - Department name
   * @returns {Array} - Default questions
   */
  getDefaultQuestions(department, language = 'en') {
    if (language === 'hi') {
      return [
        `${department || 'विभाग'} की हालिया गतिविधियों के बारे में जानकारी प्रदान करें।`,
        'बजट आवंटन और व्यय विवरण प्रदान करें।',
        'चल रही परियोजनाओं का विवरण प्रदान करें।',
        'संगठनात्मक संरचना और संपर्क विवरण प्रदान करें।',
        'लंबित शिकायतों या शिकायतों का विवरण प्रदान करें।'
      ];
    }
    return [
      `Provide information about recent activities of ${department || 'the department'}.`,
      'Provide budget allocation and expenditure details.',
      'Provide details of ongoing projects.',
      'Provide organizational structure and contact details.',
      'Provide any pending complaints or grievances.'
    ];
  }

  /**
   * Get suggested questions with explanations
   * @param {Object} intent - Intent object
   * @param {Object} options - Options
   * @returns {Array} - Questions with explanations
   */
  getSuggestionsWithExplanations(intent, options = {}) {
    const questions = this.generateQuestions(intent, options);
    const categories = this.inferCategories(intent.keywords || []);

    return questions.map((question, index) => ({
      id: index + 1,
      question,
      category: categories[index % categories.length] || 'general',
      explanation: this.getExplanation(question, intent.keywords || []),
      selected: true
    }));
  }

  /**
   * Generate explanation for why a question was suggested
   * @param {string} question - The question
   * @param {Array} keywords - Keywords that triggered it
   * @returns {string} - Explanation
   */
  getExplanation(question, keywords) {
    if (keywords.length === 0) {
      return 'This is a standard RTI question for comprehensive information.';
    }
    return `Suggested because your issue relates to "${keywords.slice(0, 3).join(', ')}".`;
  }

  /**
   * Get knowledge graph data
   * @returns {Object} - Graph nodes and edges representation
   */
  /**
   * Get knowledge graph data (Dynamic)
   * Nodes: Department -> Intent -> Questions -> Template
   * @returns {Object} - Graph nodes and edges representation
   */
  getGraphData() {
    const nodes = [];
    const edges = [];

    // 1. Central Hub
    nodes.push({ id: 'root', data: { label: 'RTI AI Engine' }, type: 'root' });

    // 2. Iterate over our known domains (treating them as Intents/Categories for now)
    // In a real DB, we'd fetch Departments -> Intents -> Questions
    const domains = this.getDomains();

    // Simple mapping of Domain -> Department (Mock logic for separation)
    const deptMap = {
      'electricity': 'Electricity Dept',
      'municipal': 'Municipal Corp',
      'police': 'Police Dept',
      'health': 'Health Dept',
      'revenue': 'Revenue Dept',
      'budget': 'Finance Dept',
      'contractor': 'Public Works',
      'timeline': 'Project Monitoring',
      'documents': 'Record Room',
      'personnel': 'HR Dept',
      'general': 'General Admin'
    };

    // Keep track of added departments to avoid duplicates
    const addedDepts = new Set();

    domains.forEach((domain, idx) => {
      // 2a. Add Department Node
      const deptName = deptMap[domain] || 'General Dept';
      const deptId = `dept-${deptName.replace(/\s/g, '-')}`;

      if (!addedDepts.has(deptId)) {
        nodes.push({ id: deptId, data: { label: deptName }, type: 'department' });
        edges.push({ source: 'root', target: deptId, label: 'manages' });
        addedDepts.add(deptId);
      }

      // 2b. Add Intent/Domain Node
      const intentId = `intent-${domain}`;
      nodes.push({ id: intentId, data: { label: domain.charAt(0).toUpperCase() + domain.slice(1) }, type: 'intent' });
      edges.push({ source: deptId, target: intentId });

      // 2c. Add Question Nodes (Limit 2 per domain to keep graph clean)
      const questions = this.questionTemplates[domain] || [];
      questions.slice(0, 2).forEach((q, qIdx) => {
        const qId = `q-${domain}-${qIdx}`;
        // Truncate long questions
        const label = q.length > 30 ? q.substring(0, 30) + '...' : q;
        nodes.push({ id: qId, data: { label: label }, type: 'question' });
        edges.push({ source: intentId, target: qId });
      });

      // 2d. Add Template Node (Mock link to a standard template)
      const tId = `tpl-${domain}`;
      nodes.push({ id: tId, data: { label: `${domain.toUpperCase()} Template` }, type: 'template' });
      edges.push({ source: intentId, target: tId });
    });

    return { nodes, edges };
  }

  /**
   * Get all question categories (domains)
   * @returns {Array} - Categories list
   */
  getCategories() {
    return Object.values(QUESTION_CATEGORIES).map(cat => ({
      id: cat.id,
      name: cat.name,
      keywords: cat.keywords
    }));
  }

  /**
   * Get all domains available in the library
   * @returns {Array} - List of domains
   */
  getDomains() {
    return Object.keys(this.questionTemplates);
  }

  /**
   * Get questions filtered by domain/intent
   * @param {string} domain - Domain name
   * @param {string} intent - Intent (optional)
   * @returns {Array} - List of questions
   */
  getAllQuestions(domain, intent) {
    // If domain provided, return questions for that domain
    if (domain && this.questionTemplates[domain]) {
      return this.questionTemplates[domain];
    }

    // If intent provided, try to map intent to category
    if (intent) {
      // Simple heuristic: intent often matches domain keys
      if (this.questionTemplates[intent]) {
        return this.questionTemplates[intent];
      }
    }

    // Default: Return all
    let all = [];
    Object.values(this.questionTemplates).forEach(qs => {
      all = [...all, ...qs];
    });
    return [...new Set(all)]; // Unique
  }

  /**
   * Add new question (In-memory for now, ideally DB)
   * @param {string} domain - Domain key
   * @param {string} question - Question text
   */
  addQuestion(domain, question) {
    if (!this.questionTemplates[domain]) {
      this.questionTemplates[domain] = [];
    }
    this.questionTemplates[domain].push(question);
    return { success: true, domain, total: this.questionTemplates[domain].length };
  }
}

module.exports = new QuestionService();
