import { Copy, Download, FileText, CheckCircle2, AlertTriangle, AlertOctagon } from 'lucide-react';
import { useState } from 'react';

export default function DraftPreview({ draft }) {
    const [copied, setCopied] = useState(false);

    if (!draft) {
        return (
            <div className="tech-card h-full min-h-[500px] flex flex-col items-center justify-center text-center p-8 border border-dashed border-[var(--border-dim)]">
                <div className="w-20 h-20 mb-6 flex items-center justify-center animate-pulse">
                    <FileText className="w-10 h-10 text-[var(--accent-secondary)]" strokeWidth={1} />
                </div>
                <h3 className="text-xl font-bold text-[var(--text-main)] mb-2 font-display tracking-widest uppercase">
                    SYSTEM_IDLE
                </h3>
                <p className="text-[var(--text-muted)] max-w-xs text-sm font-mono">
                    {'>'} Awaiting generation input...
                </p>
            </div>
        );
    }

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(draft.draft);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const handleDownload = () => {
        const blob = new Blob([draft.draft], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'rti-application.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const scoreColor = (score) => {
        if (score >= 80) return 'text-[var(--accent-secondary)]';
        if (score >= 60) return 'text-[var(--accent-tertiary)]';
        return 'text-[var(--accent-primary)]';
    };

    const scoreBg = (score) => {
        if (score >= 80) return 'bg-[var(--accent-secondary)]';
        if (score >= 60) return 'bg-[var(--accent-tertiary)]';
        return 'bg-[var(--accent-primary)]';
    };

    return (
        <div className="tech-card h-full flex flex-col overflow-hidden animate-enter border-none">
            {/* Header */}
            <div className="p-4 border-b border-[var(--border-dim)] bg-[var(--bg-surface)] flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 flex items-center justify-center bg-[var(--accent-secondary)]/10 border border-[var(--accent-secondary)]/20 rounded-none">
                        <FileText className="w-5 h-5 text-[var(--accent-secondary)]" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-[var(--text-main)] leading-tight font-display tracking-wide">DRAFT_PREVIEW</h2>
                        <p className="text-xs text-[var(--text-muted)] font-mono">STATUS: READY_TO_SUBMIT</p>
                    </div>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={handleCopy}
                        className="p-2.5 rounded-none btn-cyber-ghost transition-all duration-200"
                        title="Copy to clipboard"
                    >
                        {copied ? <CheckCircle2 className="w-5 h-5 text-[var(--accent-secondary)]" /> : <Copy className="w-5 h-5" />}
                    </button>
                    <button
                        onClick={handleDownload}
                        className="p-2.5 rounded-none btn-cyber-ghost transition-all duration-200"
                        title="Download as text file"
                    >
                        <Download className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Validation Score */}
            {draft.validation && (
                <div className="px-6 py-4 bg-[var(--bg-void)] border-b border-[var(--border-dim)]">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-medium text-[var(--text-muted)] font-mono uppercase tracking-wider">{'>'} COMPLETENESS_SCORE</span>
                        <span className={`text-lg font-bold font-display ${scoreColor(draft.validation.score)}`}>
                            {draft.validation.score}%
                        </span>
                    </div>
                    <div className="h-1 bg-[var(--bg-card)] w-full mb-4 relative overflow-hidden">
                        <div
                            className={`h-full transition-all duration-1000 ease-out ${scoreBg(draft.validation.score)}`}
                            style={{ width: `${draft.validation.score}%`, boxShadow: `0 0 10px var(--accent-secondary)` }}
                        />
                    </div>

                    {/* Suggestions */}
                    {draft.validation.suggestions?.length > 0 && (
                        <div className="space-y-2">
                            {draft.validation.suggestions.map((suggestion, idx) => (
                                <div key={idx} className="flex items-start gap-2 text-xs text-[var(--accent-tertiary)] bg-[var(--accent-tertiary)]/5 p-2 border border-[var(--accent-tertiary)]/10 font-mono">
                                    <AlertTriangle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                                    {suggestion}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Draft Content - Scrollable */}
            <div className="flex-1 overflow-hidden relative group bg-[var(--bg-void)]">
                <div className="absolute inset-0 overflow-y-auto custom-scrollbar p-6">
                    <div className="font-mono text-sm leading-7 text-[var(--text-main)] whitespace-pre-wrap select-text opacity-90">
                        {draft.draft}
                    </div>
                </div>
            </div>

            {/* Footer Meta */}
            {(draft.metadata || draft.appliedRules) && (
                <div className="p-4 border-t border-[var(--border-dim)] bg-[var(--bg-surface)] flex flex-wrap gap-2 text-xs font-mono">
                    {draft.metadata?.department && (
                        <span className="px-2 py-1 text-[var(--accent-secondary)] border border-[var(--accent-secondary)]/30">
                            DEPT: {draft.metadata.department}
                        </span>
                    )}
                    {draft.appliedRules?.length > 0 && (
                        <span className="px-2 py-1 text-[var(--accent-primary)] border border-[var(--accent-primary)]/30">
                            RULES: {draft.appliedRules.length} APPLIED
                        </span>
                    )}
                </div>
            )}
        </div>
    );
}
