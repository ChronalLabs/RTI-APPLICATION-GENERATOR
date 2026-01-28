import { Copy, Download, FileText, CheckCircle2, AlertTriangle, Edit } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from "../../utils";
import { rtiService } from '../../services/api';
import ValidationPanel from './ValidationPanel';

export default function DraftPreview({ draft }) {
    const { t } = useTranslation();
    const [copied, setCopied] = useState(false);
    const [content, setContent] = useState('');
    const [isEditing, setIsEditing] = useState(false);

    // Update local state when draft prop changes
    useEffect(() => {
        if (draft && draft.draft) {
            setContent(draft.draft);
        }
    }, [draft]);

    if (!draft) {
        return (
            <div className="glass-panel h-full min-h-[500px] flex flex-col items-center justify-center text-center p-8 rounded-3xl border-dashed border-2 border-white/5">
                <div className="w-20 h-20 mb-6 rounded-3xl bg-white/5 flex items-center justify-center rotate-3 transition-transform hover:rotate-6">
                    <FileText className="w-10 h-10 text-slate-500" strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2 font-display">
                    Preview Canvas
                </h3>
                <p className="text-slate-500 max-w-xs text-sm leading-relaxed">
                    Your generated RTI application will appear here, ready for review and download.
                </p>
            </div>
        );
    }

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(content);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const handleDownload = () => {
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'rti-application.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handlePdfDownload = async () => {
        try {
            const blob = await rtiService.downloadPdf({
                content: content,
                department: draft.department || 'Unknown Department'
            });
            const url = window.URL.createObjectURL(new Blob([blob]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'rti-application.pdf');
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
        } catch (error) {
            console.error('Failed to download PDF', error);
        }
    };

    const toggleEdit = () => {
        setIsEditing(!isEditing);
    };

    return (
        <div className="flex flex-col gap-6 h-full animate-enter">
            {/* 1. Intelligence Dashboard (Outside Card) */}
            <ValidationPanel validation={draft.validation || {
                score: draft.score,
                suggestions: draft.suggestions,
                riskLevel: draft.riskLevel || 'Low',
                completeness: draft.completeness
            }} />

            {/* 2. Draft Editor (Main Card) */}
            <div className="glass-panel flex-1 flex flex-col rounded-3xl overflow-hidden shadow-2xl shadow-black/20">
                {/* Header */}
                <div className="p-6 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                            <FileText className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-white leading-tight">{t('preview.header')}</h2>
                            <p className="text-xs text-slate-400">
                                {isEditing ? t('preview.editing') : t('preview.ready')}
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={toggleEdit}
                            className={cn(
                                "p-2.5 rounded-xl transition-all duration-200 border",
                                isEditing
                                    ? "bg-sky-500/20 text-sky-400 border-sky-500/20 hover:bg-sky-500/30"
                                    : "bg-white/5 text-slate-300 border-white/5 hover:bg-white/10 hover:text-white"
                            )}
                            title={isEditing ? "Finish editing" : "Edit draft"}
                        >
                            {isEditing ? <CheckCircle2 className="w-5 h-5" /> : <Edit className="w-5 h-5" />}
                        </button>
                        <button
                            onClick={handleCopy}
                            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-all duration-200 border border-white/5"
                            title="Copy to clipboard"
                        >
                            {copied ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : <Copy className="w-5 h-5" />}
                        </button>
                        <button
                            onClick={handlePdfDownload}
                            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-all duration-200 border border-white/5"
                            title="Download as PDF"
                        >
                            <FileText className="w-5 h-5 text-red-400" />
                        </button>
                        <button
                            onClick={handleDownload}
                            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-all duration-200 border border-white/5"
                            title="Download as text file"
                        >
                            <Download className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Draft Content - Editable */}
                <div className={cn(
                    "flex-1 overflow-hidden relative group p-8 transition-colors duration-300 min-h-[500px]",
                    isEditing ? "bg-white/[0.02]" : ""
                )}>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        readOnly={!isEditing}
                        className={cn(
                            "w-full h-full bg-transparent border-0 resize-none font-mono text-sm leading-7 transition-colors focus:outline-none focus:ring-0 custom-scrollbar",
                            isEditing
                                ? "text-white placeholder-slate-500"
                                : "text-slate-300 cursor-default"
                        )}
                        style={{ whiteSpace: 'pre-wrap' }}
                        spellCheck={isEditing}
                    />
                </div>
            </div>
        </div>
    );
}
