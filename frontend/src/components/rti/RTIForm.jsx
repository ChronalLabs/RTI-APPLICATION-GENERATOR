import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { questionService, rtiService } from '../../services/api';
import InputForm from './InputForm';
import QuestionList from './QuestionList';
import DraftPreview from './DraftPreview'; // We still need to create this one properly
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { Card } from '../common/UiElements';

export default function RTIForm({ onDraftGenerated }) {
    const { t, i18n } = useTranslation();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // State for data
    const [departments, setDepartments] = useState([]);
    const [formData, setFormData] = useState({ description: '', department: '' });
    const [suggestedQuestions, setSuggestedQuestions] = useState([]);
    const [selectedQuestions, setSelectedQuestions] = useState([]);
    const [suggestedDepartment, setSuggestedDepartment] = useState('');

    // Load departments on mount
    useEffect(() => {
        questionService.getDepartments().then(res => {
            if (res.success) setDepartments(res.data);
        });
    }, []);

    const handleSuggest = async (data) => {
        setLoading(true);
        setError('');
        setFormData(data);

        try {
            const descriptionData = { ...data, language: i18n.language }; // Add language
            const response = await questionService.suggestQuestions(descriptionData); // Pass updated object (or check api signature)
            if (response.success) {
                const questions = response.data.questions || response.data.suggestions || [];
                setSuggestedQuestions(questions);
                setSelectedQuestions(
                    questions.filter(q => q.selected).map(q => q.question) || []
                );
                if (response.data.suggestedDepartment) {
                    setSuggestedDepartment(response.data.suggestedDepartment);
                }
                setStep(2);
            }
        } catch (err) {
            setError('Failed to suggest questions. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleToggleQuestion = (question) => {
        setSelectedQuestions(prev =>
            prev.includes(question)
                ? prev.filter(q => q !== question)
                : [...prev, question]
        );
    };

    const handleGenerate = async () => {
        setLoading(true);
        setError('');

        try {
            const response = await rtiService.generateDraft({
                description: formData.description,
                questions: selectedQuestions,
                department: suggestedDepartment || formData.department,
                language: i18n.language // Pass current language
            });

            if (response.success) {
                onDraftGenerated(response.data);
                setStep(3);
            }
        } catch (err) {
            setError('Failed to generate draft.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="glass-panel rounded-3xl p-8 relative overflow-hidden h-full">
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

            {/* Progress Steps */}
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

            {step === 1 && (
                <InputForm
                    onSubmit={handleSuggest}
                    initialData={formData}
                    isLoading={loading}
                    departments={departments}
                />
            )}

            {step === 2 && (
                <QuestionList
                    questions={suggestedQuestions}
                    selected={selectedQuestions}
                    onToggle={handleToggleQuestion}
                    onGenerate={handleGenerate}
                    onBack={() => setStep(1)}
                    isLoading={loading}
                    suggestedDepartment={suggestedDepartment}
                />
            )}

            {step === 3 && (
                <div className="text-center py-12 animate-enter">
                    <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-emerald-500/10 flex items-center justify-center relative">
                        <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping" />
                        <CheckCircle2 className="w-12 h-12 text-emerald-400 relative z-10" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">Draft Ready!</h3>
                    <p className="text-slate-400 mb-8 max-w-xs mx-auto">
                        Your RTI application has been generated. Check the preview panel.
                    </p>
                    <button
                        onClick={() => {
                            setStep(1);
                            setFormData({ description: '', department: '' });
                            setSuggestedQuestions([]);
                            setSelectedQuestions([]);
                            onDraftGenerated(null);
                        }}
                        className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-colors"
                    >
                        Start New Application
                    </button>
                </div>
            )}
        </div>
    );
}
