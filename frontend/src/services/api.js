import axios from 'axios';

const API_BASE_URL = '/api/v1';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Question API
export const questionService = {
    // Deprecated: Use rtiService.getQuestions instead
    suggestQuestions: async (descriptionOrData, department) => {
        let payload;
        if (typeof descriptionOrData === 'object') {
            payload = {
                description: descriptionOrData.description,
                department: descriptionOrData.department || department
            };
        } else {
            payload = { description: descriptionOrData, department };
        }
        // Fallback to old endpoint if needed during migration, or new one
        const response = await api.post('/questions/suggest', payload);
        return response.data;
    },

    generateQuestions: async (data) => {
        const response = await api.post('/questions/generate', data);
        return response.data;
    },

    getCategories: async () => {
        const response = await api.get('/questions/categories');
        return response.data;
    },

    getDepartments: async () => {
        const response = await api.get('/questions/departments');
        return response.data;
    },

    getDomains: async () => {
        const response = await api.get('/questions/domains');
        return response.data;
    },

    getLibrary: async (domain, intent) => {
        const response = await api.get('/questions/library', { params: { domain, intent } });
        return response.data;
    },

    add: async (data) => {
        const response = await api.post('/questions/add', data);
        return response.data;
    },

    getGraphData: async () => {
        const response = await api.get('/graph');
        return response.data;
    },
};

// RTI API
export const rtiService = {
    // Step 2: Analyze
    analyze: async (data) => {
        const response = await api.post('/rti/analyze', data);
        return response.data;
    },

    // Step 3: Get Questions (New)
    getQuestions: async (data) => {
        const response = await api.post('/rti/questions', data);
        return response.data;
    },

    // Step 5: Generate Draft
    generateDraft: async (data) => {
        const response = await api.post('/rti/generate', data);
        return response.data;
    },

    // Step 5.5: Score (Intelligence Engine)
    score: async (data) => {
        const response = await api.post('/rti/score', data);
        return response.data;
    },

    validateDraft: async (data) => {
        const response = await api.post('/rti/validate', data);
        return response.data;
    },

    saveDraft: async (data) => {
        const response = await api.post('/rti/save', data);
        return response.data;
    },

    getDraftById: async (id) => {
        const response = await api.get(`/rti/${id}`);
        return response.data;
    },

    updateDraft: async (id, data) => {
        const response = await api.put(`/rti/${id}`, data);
        return response.data;
    },

    // Step 7: Download PDF
    downloadPdf: async (data) => {
        const response = await api.post('/rti/pdf', data, {
            responseType: 'blob'
        });
        return response.data;
    },
};

// Template API
export const templateService = {
    getAll: async () => {
        const response = await api.get('/templates');
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get(`/templates/${id}`);
        return response.data;
    },

    // New Meta Endpoint
    getMeta: async (id) => {
        const response = await api.get(`/templates/${id}/meta`);
        return response.data;
    },

    create: async (data) => {
        const response = await api.post('/templates', data);
        return response.data;
    },

    update: async (id, data) => {
        const response = await api.put(`/templates/${id}`, data);
        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete(`/templates/${id}`);
        return response.data;
    },

    preview: async (data) => {
        const response = await api.post('/templates/preview', data);
        return response.data;
    },
};

export default api;
