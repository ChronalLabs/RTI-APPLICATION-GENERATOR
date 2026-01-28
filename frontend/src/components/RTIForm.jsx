import { useState, useEffect } from 'react';
import { questionService, rtiService } from '../services/api';
import { Search, CheckCircle2, AlertCircle, ArrowRight, Loader2, Sparkles, HelpCircle } from 'lucide-react';

export default function RTIForm({ onDraftGenerated }) {
    const [description, setDescription] = useState('');
    const [departments, setDepartments] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState('');
    const [suggestedQuestions, setSuggestedQuestions] = useState([]);
    const [selectedQuestions, setSelectedQuestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1);
    const [error, setError] = useState('');

    useEffect(() => {
        loadDepartments();
    }, []);

    const loadDepartments = async () => {
        try {
            const response = await questionService.getDepartments();
            if (response.success) {
                setDepartments(response.data);
            }
        } catch (err) {
            console.error('Failed to load departments:', err);
        }
    };

    const handleSuggestQuestions = async () => {
        if (!description.trim()) {
            setError('Please describe your RTI request');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await questionService.suggestQuestions(description, selectedDepartment);
            if (response.success) {
                // Backend returns 'suggestions', frontend expected 'questions'. content-check safe.
                const questions = response.data.suggestions || response.data.questions || [];
                setSuggestedQuestions(questions);
                setSelectedQuestions(
                    questions.filter(q => q.selected).map(q => q.question) || []
                );
                if (response.data.intent?.department) {
                    setSelectedDepartment(response.data.intent.department);
                }
                setStep(2);
            }
        } catch (err) {
            const errorMsg = err.response?.data?.error || err.message || 'Failed to suggest questions.';
            setError(`Error: ${errorMsg}`);
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const toggleQuestion = (question) => {
        setSelectedQuestions(prev =>
            prev.includes(question)
                ? prev.filter(q => q !== question)
                : [...prev, question]
        );
    };

    const handleGenerateDraft = async () => {
        if (selectedQuestions.length === 0) {
            setError('Please select at least one question');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await rtiService.generateDraft({
                description,
                questions: selectedQuestions,
                department: selectedDepartment,
            });

            if (response.success) {
                onDraftGenerated(response.data);
                setStep(3);
            }
        } catch (err) {
            setError('Failed to generate draft. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setDescription('');
        setSelectedDepartment('');
        setSuggestedQuestions([]);
        setSelectedQuestions([]);
        setStep(1);
        setError('');
    };

    return (
        <div className="glass-panel rounded-3xl p-8 relative overflow-hidden">
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

            {/* Steps Indicator */}
            <div className="flex items-center justify-between mb-8 relative z-10">
                {[
                    { num: 1, label: 'Describe' },
                    { num: 2, label: 'Select' },
                    { num: 3, label: 'Review' }
                ].map((s, idx) => (
                    <div key={s.num} className="flex flex-col items-center gap-2 relative">
                        <div
                            className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm transition-all duration-500 ${step >= s.num
                                ? 'bg-gradient-to-br from-sky-500 to-sky-600 text-white shadow-lg shadow-sky-500/25 scale-110'
                                : 'bg-white/5 text-slate-500 border border-white/10'
                                }`}
                        >
                            {step > s.num ? <CheckCircle2 className="w-5 h-5" /> : s.num}
                        </div>
                        <span className={`text-xs font-medium uppercase tracking-wider ${step >= s.num ? 'text-sky-400' : 'text-slate-600'
                            }`}>
                            {s.label}
                        </span>

                        {/* Connector Line */}
                        {idx < 2 && (
                            <div className="absolute top-5 left-14 w-[calc(100%_+_2rem)] h-[2px] -z-10 bg-slate-800">
                                <div
                                    className={`h-full bg-sky-500 transition-all duration-700 ease-out`}
                                    style={{ width: step > s.num ? '100%' : '0%' }}
                                />
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {error && (
                <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center gap-3 animate-enter">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <p className="text-sm font-medium">{error}</p>
                </div>
            )}

            {/* Step 1: Description */}
            {step === 1 && (
                <div className="animate-enter">
                    <label className="block text-sm font-medium text-slate-300 mb-2 ml-1">
                        What information do you need?
                    </label>
                    <div className="relative mb-6">
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="e.g., I want to know the total budget allocated for road repairs in Ward 12..."
                            className="input-premium min-h-[160px] resize-none pb-12"
                        />
                        <div className="absolute bottom-4 right-4 flex gap-2">
                            <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-slate-500">
                                AI Powered
                            </div>
                        </div>
                    </div>

                    <div className="mb-8">
                        <label className="block text-sm font-medium text-slate-300 mb-2 ml-1">
                            Department (Optional)
                        </label>
                        <div className="relative">
                            <select
                                value={selectedDepartment}
                                onChange={(e) => setSelectedDepartment(e.target.value)}
                                className="input-premium appearance-none cursor-pointer"
                            >
                                <option value="">Auto-detect from description... ✨</option>
                                {departments.map((dept) => (
                                    <option key={dept.name} value={dept.name}>
                                        {dept.displayName}
                                    </option>
                                ))}
                            </select>
                            <ArrowRight className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none rotate-90" />
                        </div>
                    </div>

                    <button
                        onClick={handleSuggestQuestions}
                        disabled={loading}
                        className="btn-core btn-primary-glow w-full"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Analyzing Request...
                            </>
                        ) : (
                            <>
                                <Sparkles className="w-5 h-5" />
                                Suggest Questions
                            </>
                        )}
                    </button>
                </div>
            )}

            {/* Step 2: Question Selection */}
            {step === 2 && (
                <div className="animate-enter">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-white">Select Questions</h3>
                        <span className="text-xs px-2 py-1 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20">
                            {selectedQuestions.length} selected
                        </span>
                    </div>

                    <div className="space-y-3 mb-8 max-h-[400px] overflow-y-auto pr-2 scrollbar-hide hover:scrollbar-default">
                        {suggestedQuestions.map((q, idx) => (
                            <label
                                key={idx}
                                className={`group flex items-start gap-4 p-4 rounded-xl cursor-pointer transition-all duration-200 border ${selectedQuestions.includes(q.question)
                                    ? 'bg-sky-500/10 border-sky-500/50 shadow-md shadow-sky-500/5'
                                    : 'bg-white/5 border-white/5 hover:border-white/10'
                                    }`}
                            >
                                <div className={`mt-1 w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${selectedQuestions.includes(q.question)
                                    ? 'bg-sky-500 border-sky-500'
                                    : 'border-slate-500 group-hover:border-slate-400'
                                    }`}>
                                    {selectedQuestions.includes(q.question) && (
                                        <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                                    )}
                                </div>
                                <input
                                    type="checkbox"
                                    checked={selectedQuestions.includes(q.question)}
                                    onChange={() => toggleQuestion(q.question)}
                                    className="hidden"
                                />
                                <div className="flex-1">
                                    <p className={`text-sm leading-relaxed ${selectedQuestions.includes(q.question) ? 'text-white font-medium' : 'text-slate-300'
                                        }`}>
                                        {q.question}
                                    </p>
                                    {q.explanation && (
                                        <p className="text-xs text-slate-500 mt-1.5 flex items-center gap-1.5">
                                            <HelpCircle className="w-3 h-3" />
                                            {q.explanation}
                                        </p>
                                    )}
                                </div>
                            </label>
                        ))}
                    </div>

                    <div className="flex gap-4">
                        <button
                            onClick={() => setStep(1)}
                            className="px-6 py-3 rounded-xl font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                        >
                            Back
                        </button>
                        <button
                            onClick={handleGenerateDraft}
                            disabled={loading || selectedQuestions.length === 0}
                            className="btn-core btn-primary-glow flex-1"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Generating...
                                </>
                            ) : (
                                <>
                                    Generate Draft
                                    <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </button>
                    </div>
                </div>
            )}

            {/* Step 3: Check Animation */}
            {step === 3 && (
                <div className="text-center py-12 animate-enter">
                    <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-emerald-500/10 flex items-center justify-center relative">
                        <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping" />
                        <CheckCircle2 className="w-12 h-12 text-emerald-400 relative z-10" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">Draft Ready!</h3>
                    <p className="text-slate-400 mb-8 max-w-xs mx-auto">
                        Your RTI application has been generated and validated. Check the preview panel.
                    </p>
                    <button
                        onClick={resetForm}
                        className="btn-core btn-secondary-glass w-full"
                    >
                        Start New Application
                    </button>
                </div>
            )}
        </div>
    );
}
