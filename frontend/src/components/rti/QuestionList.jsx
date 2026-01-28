import { Button } from "../common/Button";
import { Card, Badge } from "../common/UiElements";
import { CheckCircle2, HelpCircle, ArrowRight, Loader2, ChevronDown } from "lucide-react";
import { cn } from "../../utils";
import { useState } from "react";

export default function QuestionList({
    questions,
    selected,
    onToggle,
    onGenerate,
    onBack,
    isLoading,
    suggestedDepartment
}) {
    return (
        <Card className="animate-enter">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-bold text-white">Select Questions</h3>
                    <p className="text-sm text-slate-400">Choose the most relevant questions for your request</p>
                </div>
                <Badge variant="info">
                    {selected.length} selected
                </Badge>
            </div>

            {suggestedDepartment && (
                <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between">
                    <span className="text-sm text-emerald-400">Suggested Department:</span>
                    <span className="font-bold text-emerald-300">{suggestedDepartment}</span>
                </div>
            )}

            {/* Group questions by category with Accordion */}
            {Object.entries(questions.reduce((groups, q) => {
                const category = q.category || 'General Questions';
                const groupTitle = category.charAt(0).toUpperCase() + category.slice(1);
                if (!groups[groupTitle]) groups[groupTitle] = [];
                groups[groupTitle].push(q);
                return groups;
            }, {})).map(([category, categoryQuestions]) => {
                const [isOpen, setIsOpen] = useState(true); // Default open

                return (
                    <div key={category} className="space-y-2">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="w-full flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider ml-1 py-2 hover:text-slate-300 transition-colors"
                        >
                            <span>{category}</span>
                            <span className="bg-white/5 px-2 py-0.5 rounded text-[10px]">{categoryQuestions.length}</span>
                        </button>

                        {isOpen && (
                            <div className="space-y-3 animate-enter">
                                {categoryQuestions.map((q, idx) => (
                                    <label
                                        key={idx}
                                        className={cn(
                                            "group flex items-start gap-4 p-4 rounded-xl cursor-pointer transition-all duration-200 border",
                                            selected.includes(q.question)
                                                ? "bg-sky-500/10 border-sky-500/50 shadow-md shadow-sky-500/5"
                                                : "bg-white/5 border-white/5 hover:border-white/10"
                                        )}
                                    >
                                        <div className={cn(
                                            "mt-1 w-5 h-5 rounded-md border flex items-center justify-center transition-colors shrink-0",
                                            selected.includes(q.question)
                                                ? "bg-sky-500 border-sky-500"
                                                : "border-slate-500 group-hover:border-slate-400"
                                        )}>
                                            {selected.includes(q.question) && (
                                                <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                                            )}
                                        </div>
                                        <input
                                            type="checkbox"
                                            checked={selected.includes(q.question)}
                                            onChange={() => onToggle(q.question)}
                                            className="hidden"
                                        />
                                        <div className="flex-1">
                                            <p className={cn(
                                                "text-sm leading-relaxed",
                                                selected.includes(q.question) ? "text-white font-medium" : "text-slate-300"
                                            )}>
                                                {q.question}
                                            </p>

                                            {/* Explainability UI */}
                                            {q.explanation && (
                                                <div className="mt-2 text-xs flex items-start gap-1.5 text-slate-500 bg-black/20 p-2 rounded-lg border border-white/5">
                                                    <HelpCircle className="w-3 h-3 shrink-0 mt-0.5" />
                                                    <span>
                                                        <strong className="text-slate-400">Why this? </strong>
                                                        {q.explanation}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>
                );
            })}

            <div className="flex gap-4">
                <Button variant="ghost" onClick={onBack}>
                    Back
                </Button>
                <Button
                    onClick={onGenerate}
                    disabled={selected.length === 0}
                    isLoading={isLoading}
                    className="flex-1 btn-primary-glow"
                >
                    {isLoading ? "Generating..." : (
                        <>
                            Generate Draft
                            <ArrowRight className="w-5 h-5" />
                        </>
                    )}
                </Button>
            </div>
        </Card>
    );
}
