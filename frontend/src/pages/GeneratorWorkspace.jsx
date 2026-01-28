import { useState } from 'react';
import { Bot, MapPin, Building2, ChevronRight, FileText, Send, Sparkles, AlertCircle, CheckCircle2, Loader2, Download } from 'lucide-react';
import { questionService, rtiService } from '../services/api';
import { Badge } from '../components/common/UiElements';

export default function GeneratorWorkspace() {
    // Context State
    const [issueText, setIssueText] = useState('');
    const [location, setLocation] = useState('');
    const [language, setLanguage] = useState('en');

    // AI State
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [isGeneratingQuestions, setIsGeneratingQuestions] = useState(false);
    const [isGeneratingDraft, setIsGeneratingDraft] = useState(false);
    const [isScoring, setIsScoring] = useState(false);
    const [suggestedQuestions, setSuggestedQuestions] = useState([]);

    // Output State
    const [selectedQuestions, setSelectedQuestions] = useState({});
    const [generatedDraft, setGeneratedDraft] = useState(null);
    const [validationStats, setValidationStats] = useState({ score: 0, riskLevel: 'Low', suggestions: [] });
    const [detectedIntent, setDetectedIntent] = useState({ department: null, confidence: 0, keywords: [] });

    // Step 1: Analyze Context (Intent Detection)
    const handleAnalyze = async () => {
        if (!issueText.trim()) return;

        setIsAnalyzing(true);
        try {
            const response = await rtiService.analyze({ problem: issueText });
            if (response.success) {
                setDetectedIntent(response.data);
            }
        } catch (error) {
            console.error("Failed to analyze:", error);
        } finally {
            setIsAnalyzing(false);
        }
    };

    // Step 2: Get Questions based on Analysis
    const handleGetQuestions = async () => {
        if (!issueText.trim()) return;

        // If not analyzed yet, analyze first
        if (!detectedIntent.department) {
            await handleAnalyze();
        }

        setIsGeneratingQuestions(true);
        try {
            const response = await rtiService.getQuestions({
                problem: issueText,
                department: detectedIntent.department || "Municipal Corporation", // Logic will use detected if avail
                intent: detectedIntent.intent,
                language: language
            });

            if (response.success && response.data && response.data.questions) {
                const suggestions = response.data.questions;
                setSuggestedQuestions(suggestions);

                // Auto-select all by default
                const newSelected = {};
                suggestions.forEach(q => newSelected[q.id] = true);
                setSelectedQuestions(newSelected);
            }
        } catch (error) {
            console.error("Failed to get questions:", error);
            setSuggestedQuestions([
                { id: 1, question: "Could not connect to AI. Please check server.", category: "error", explanation: "Connection Error" }
            ]);
        } finally {
            setIsGeneratingQuestions(false);
        }
    };

    // Step 2: Generate Draft & Validate
    const handleGenerateDraft = async () => {
        const questionsToAsk = suggestedQuestions
            .filter(q => selectedQuestions[q.id])
            .map(q => q.question);

        if (questionsToAsk.length === 0) return;

        setIsGeneratingDraft(true);
        try {
            // 1. Generate Draft
            const draftResponse = await rtiService.generateDraft({
                applicantName: "Citizen",
                department: "Public Authority",
                applicantAddress: location || "India",
                location: location || "India",
                description: issueText,
                selectedQuestions: questionsToAsk
            });


            if (draftResponse.success) {
                setGeneratedDraft(draftResponse.data);

                // Step 5.5: Call Intelligence Engine for Real Scoring
                setIsScoring(true);
                try {
                    const scoreResponse = await rtiService.score({
                        questions: questionsToAsk,
                        department: detectedIntent.department,
                        intent: detectedIntent.intent
                    });

                    if (scoreResponse.success) {
                        setValidationStats(scoreResponse.data);
                    }
                } catch (scoreError) {
                    console.error("Scoring failed:", scoreError);
                    // Fallback to draft response data if available as backup
                    setValidationStats({
                        score: draftResponse.data.score || 0,
                        riskLevel: draftResponse.data.riskLevel || 'Low',
                        suggestions: draftResponse.data.suggestions || [],
                        completeness: draftResponse.data.completeness || 0
                    });
                } finally {
                    setIsScoring(false);
                }
            }
        } catch (error) {
            console.error("Failed to generate draft:", error);
        } finally {
            setIsGeneratingDraft(false);
        }
    };

    const toggleQuestion = (id) => {
        setSelectedQuestions(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const handleDraftEdit = (e) => {
        if (generatedDraft) {
            setGeneratedDraft({ ...generatedDraft, draft: e.target.value });
        }
    };

    const handleDownloadPdf = async () => {
        if (!generatedDraft || !generatedDraft.draft) return;

        try {
            const blob = await rtiService.downloadPdf({
                draft: generatedDraft.draft,
                department: detectedIntent.department
            });

            // Create blob link to download
            const url = window.URL.createObjectURL(new Blob([blob]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `rti-application-${Date.now()}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
        } catch (error) {
            console.error("Failed to download PDF", error);
        }
    };

    return (
        <div className="h-screen pt-16 flex flex-col overflow-hidden bg-black/20">
            <div className="flex-1 max-w-[1800px] mx-auto w-full p-4 grid grid-cols-12 gap-4 h-full">

                {/* Left Panel: Context & Input (3 cols) */}
                <div className="col-span-3 h-full flex flex-col gap-4">
                    <div className="glass-panel p-5 rounded-xl flex-1 flex flex-col">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                                <FileText className="w-4 h-4 text-emerald-400" />
                            </div>
                            <h2 className="text-sm font-semibold text-white">Context Input</h2>
                        </div>

                        <div className="space-y-4 flex-1">
                            <div>
                                <label className="text-xs font-medium text-slate-400 mb-1.5 block">Describe the Issue</label>
                                <textarea
                                    className="w-full h-48 input-saas p-3 text-sm resize-none"
                                    placeholder="e.g., The road construction in my sector 45 has been stalled..."
                                    value={issueText}
                                    onChange={(e) => setIssueText(e.target.value)}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-xs font-medium text-slate-400 mb-1.5 block">Location</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-2.5 top-2.5 w-4 h-4 text-slate-500" />
                                        <input
                                            type="text"
                                            className="w-full input-saas pl-9 py-2 text-sm"
                                            placeholder="City/Area"
                                            value={location}
                                            onChange={(e) => setLocation(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-slate-400 mb-1.5 block">Language</label>
                                    <select
                                        className="w-full input-saas py-2 px-3 text-sm appearance-none"
                                        value={language}
                                        onChange={(e) => setLanguage(e.target.value)}
                                    >
                                        <option value="en">English</option>
                                        <option value="hi">Hindi</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-2 mt-4">
                            <button
                                className="btn-secondary flex-1 py-2.5 flex items-center justify-center gap-2 text-sm disabled:opacity-50"
                                onClick={handleAnalyze}
                                disabled={isAnalyzing || !issueText}
                            >
                                {isAnalyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Building2 className="w-4 h-4" />}
                                Analyze
                            </button>
                            <button
                                className="btn-primary flex-1 py-2.5 flex items-center justify-center gap-2 text-sm disabled:opacity-50"
                                onClick={handleGetQuestions}
                                disabled={isGeneratingQuestions || !issueText}
                            >
                                {isGeneratingQuestions ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                                Questions
                            </button>
                        </div>

                    </div>

                    {/* Detected Info Card */}
                    <div className="glass-panel p-4 rounded-xl h-auto">
                        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">AI Detection</h3>
                        <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5 mb-2">
                            <div className="flex items-center gap-2">
                                <Building2 className="w-4 h-4 text-cyan-400" />
                                <span className="text-sm text-slate-200">{detectedIntent.department || 'Awaiting analysis...'}</span>
                            </div>
                            {detectedIntent.confidence > 0 && (
                                <Badge variant="success" className="text-[10px]">{detectedIntent.confidence}%</Badge>
                            )}
                        </div>
                        {detectedIntent.keywords && detectedIntent.keywords.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                                {detectedIntent.keywords.slice(0, 3).map((kw, i) => (
                                    <span key={i} className="text-[10px] text-slate-400 bg-white/5 px-1.5 py-0.5 rounded">{kw}</span>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Center Panel: Logic & Questions (5 cols) */}
                <div className="col-span-5 h-full flex flex-col gap-4">
                    <div className="glass-panel p-5 rounded-xl h-full flex flex-col">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                                    <Bot className="w-4 h-4 text-cyan-400" />
                                </div>
                                <h2 className="text-sm font-semibold text-white">Question Logic</h2>
                            </div>
                            <span className="text-xs text-slate-500">
                                {suggestedQuestions.length > 0 ? `${suggestedQuestions.length} Suggested` : 'Waiting for context...'}
                            </span>
                        </div>

                        <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                            {suggestedQuestions.length > 0 ? (
                                suggestedQuestions.map((q) => (
                                    <div
                                        key={q.id}
                                        className={`p-4 rounded-lg border transition-all cursor-pointer ${selectedQuestions[q.id]
                                            ? 'bg-emerald-500/5 border-emerald-500/30'
                                            : 'bg-white/5 border-white/5 hover:border-white/10'
                                            }`}
                                        onClick={() => toggleQuestion(q.id)}
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className={`mt-1 w-4 h-4 rounded border flex items-center justify-center transition-colors ${selectedQuestions[q.id] ? 'bg-emerald-500 border-emerald-500' : 'border-slate-600'
                                                }`}>
                                                {selectedQuestions[q.id] && <CheckCircle2 className="w-3 h-3 text-white" />}
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm text-slate-200 leading-relaxed">{q.question}</p>
                                                {q.explanation && (
                                                    <p className="text-xs text-slate-500 mt-1.5 italic">
                                                        " {q.explanation} "
                                                    </p>
                                                )}
                                                <div className="flex gap-2 mt-2">
                                                    <span className="text-[10px] uppercase font-bold text-cyan-400 bg-cyan-950/30 px-1.5 py-0.5 rounded border border-cyan-500/20">
                                                        {q.category}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-slate-500 opacity-60">
                                    <Bot className="w-12 h-12 mb-4" />
                                    <p className="text-sm">Describe your issue in the left panel to get AI suggestions.</p>
                                </div>
                            )}
                        </div>

                        {/* Action Button - Always visible at bottom of Question Logic */}
                        {suggestedQuestions.length > 0 && (
                            <button
                                className="btn-primary w-full py-3 mt-4 text-sm flex items-center justify-center gap-2 disabled:opacity-50 shrink-0"
                                onClick={handleGenerateDraft}
                                disabled={isGeneratingDraft || Object.values(selectedQuestions).filter(Boolean).length === 0}
                            >
                                {isGeneratingDraft ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                                {isGeneratingDraft ? 'Generating Draft...' : `Generate RTI Draft (${Object.values(selectedQuestions).filter(Boolean).length} questions)`}
                            </button>
                        )}
                    </div>
                </div>

                {/* Right Panel: Intelligence & Preview (4 cols) */}
                <div className="col-span-4 h-full flex flex-col gap-4 overflow-hidden">
                    <div className="glass-panel p-5 rounded-xl flex-1 flex flex-col overflow-hidden">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-sm font-semibold text-white">Live Intelligence</h2>
                            <span className={`text-xs font-mono font-bold ${validationStats.score > 80 ? 'text-emerald-400' : 'text-amber-400'
                                }`}>
                                SCORE: {validationStats.score}/100
                            </span>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 gap-3 mb-6">
                            <div className="p-3 rounded-lg bg-white/5 border border-white/5">
                                <span className="text-[10px] text-slate-400 uppercase font-bold">Risk Level</span>
                                <div className={`text-lg font-bold mt-0.5 ${validationStats.riskLevel === 'Low' ? 'text-emerald-400' : 'text-amber-400'
                                    }`}>
                                    {validationStats.riskLevel}
                                </div>
                            </div>
                            <div className="p-3 rounded-lg bg-white/5 border border-white/5">
                                <span className="text-[10px] text-slate-400 uppercase font-bold">Completeness</span>
                                <div className="text-lg font-bold text-white mt-0.5">
                                    {validationStats.completeness || 0}%
                                </div>
                            </div>
                        </div>

                        {/* Suggestions List */}
                        {validationStats.suggestions && validationStats.suggestions.length > 0 && (
                            <div className="mb-4">
                                <h3 className="text-xs font-medium text-slate-500 mb-2 uppercase">Improvements</h3>
                                <div className="space-y-2 max-h-32 overflow-y-auto custom-scrollbar">
                                    {validationStats.suggestions.map((s, i) => (
                                        <div key={i} className="flex items-start gap-2 text-xs text-slate-300">
                                            <AlertCircle className="w-3 h-3 text-amber-500 shrink-0 mt-0.5" />
                                            <span>{s}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="flex-1 border-t border-white/5 pt-4 flex flex-col min-h-0 overflow-hidden">
                            <h3 className="text-xs font-medium text-slate-400 mb-3 shrink-0">Draft Preview</h3>
                            <div className="bg-black/40 rounded-lg p-4 flex-1 overflow-hidden font-mono text-xs text-slate-300 leading-relaxed border border-white/5 min-h-[100px] flex flex-col">
                                {generatedDraft ? (
                                    <textarea
                                        className="w-full h-full bg-transparent resize-none focus:outline-none text-slate-300 leading-relaxed"
                                        value={generatedDraft.draft}
                                        onChange={handleDraftEdit}
                                    />
                                ) : (
                                    <div className="h-full flex items-center justify-center text-slate-600 italic">
                                        Waiting for draft generation...
                                    </div>
                                )}
                            </div>
                        </div>

                        {generatedDraft ? (
                            <div className="flex gap-2 mt-4 shrink-0">
                                <button
                                    className="btn-secondary flex-1 py-3 text-sm flex items-center justify-center gap-2"
                                    onClick={handleGenerateDraft}
                                    disabled={isGeneratingDraft}
                                >
                                    <Sparkles className="w-4 h-4" />
                                    Regenerate
                                </button>
                                <button
                                    className="btn-primary flex-1 py-3 text-sm flex items-center justify-center gap-2"
                                    onClick={handleDownloadPdf}
                                >
                                    <Download className="w-4 h-4" />
                                    Download PDF
                                </button>
                            </div>
                        ) : (
                            <button
                                className="btn-primary w-full py-3 mt-4 text-sm flex items-center justify-center gap-2 disabled:opacity-50 shrink-0"
                                onClick={handleGenerateDraft}
                                disabled={isGeneratingDraft || suggestedQuestions.length === 0}
                            >
                                {isGeneratingDraft ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                                Generate & Evaluate
                            </button>
                        )}
                    </div>
                </div>

            </div>
        </div >
    );
}
