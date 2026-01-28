class ScoreService {
    /**
     * Calculate intelligence score for RTI application
     * @param {Object} data - { questions, department, intent }
     * @returns {Object} - { score, risk, suggestions }
     */
    calculateScore(data) {
        const { questions = [], department, intent } = data;
        let score = 0;
        const suggestions = [];
        let risk = 'Low';

        // 1. Question Count Logic
        if (questions.length === 0) {
            suggestions.push('Add at least one question to your application.');
        } else if (questions.length < 3) {
            score += 40;
            suggestions.push('Adding more specific questions increases response probability.');
        } else if (questions.length > 10) {
            score += 70;
            risk = 'Medium';
            suggestions.push('Too many questions might lead to rejection under "disproportionate diversion of resources".');
        } else {
            score += 80;
        }

        // 2. Department & Intent Specific Rules
        // This supports the "Rule Engine" concept
        const rules = this.getRules();

        // Check Intent Specifics
        if (intent === 'contractor' || intent === 'budget') {
            // Financial queries are higher risk but high value
            score += 10;
            risk = 'Medium';
            if (!questions.some(q => q.toLowerCase().includes('contract') || q.toLowerCase().includes('audit'))) {
                suggestions.push('Ask for "copies of contracts" or "audit reports" for better evidence.');
            }
        }

        if (intent === 'timeline' || intent === 'personnel') {
            score += 10;
            if (!questions.some(q => q.toLowerCase().includes('name') || q.toLowerCase().includes('designation'))) {
                suggestions.push('Ask for "Name and Designation" of responsible officers.');
            }
        }

        // 3. Completeness Check
        if (department) score += 5;
        else suggestions.push('Specifying a department helps route the application correctly.');

        // Cap score at 100
        if (score > 100) score = 100;

        return {
            score,
            risk,
            suggestions: [...new Set(suggestions)] // Unique
        };
    }

    /**
     * Analyze draft content (Wrapper for calculateScore with extra DraftService fields)
     * @param {Object} data 
     */
    analyzeDraft(data) {
        const result = this.calculateScore(data);
        return {
            score: result.score,
            riskLevel: result.risk,
            suggestions: result.suggestions,
            completeness: Math.min(result.score + 10, 100) // Simple completeness heuristic
        };
    }

    /**
     * Simple Rule Engine Definition
     * In a real app, this would come from DB
     */
    getRules() {
        return [
            {
                if: { intent: 'power_outage' },
                then: { addQuestions: ['maintenance_log', 'complaint_book'] }
            }
        ];
    }
}

module.exports = new ScoreService();
