
import { Copy, Eye, Pencil, Check, Loader2 } from "lucide-react";
import { Button } from "../common/Button";
import { Badge } from "../common/UiElements";
import { useState } from "react";

export function TemplatePreview({ template, liveData, isLiveMode, previewText, isLoading }) {
    if (!template) {
        return (
            <div className="h-full flex flex-col items-center justify-center text-slate-500 p-8 text-center bg-slate-900/30">
                <p>Select a template to view details</p>
            </div>
        );
    }

    // Helper to highlight variables
    const renderContent = () => {
        // If live mode, show backend preview or loading
        if (isLiveMode) {
            if (isLoading) {
                return (
                    <div className="flex items-center justify-center p-8 text-slate-500">
                        <Loader2 className="w-5 h-5 animate-spin mr-2" />
                        Generating preview...
                    </div>
                );
            }
            return <div className="leading-relaxed whitespace-pre-wrap">{previewText || "Preview not available."}</div>;
        }

        let content = template.content;

        // Default: Highlight syntax
        const parts = content.split(/(\{\{[^}]+\}\})/g);
        return (
            <div className="leading-relaxed whitespace-pre-wrap font-mono text-sm">
                {parts.map((part, i) => {
                    if (part.startsWith('{{') && part.endsWith('}}')) {
                        return (
                            <span key={i} className="text-amber-400 bg-amber-400/10 px-1 rounded mx-0.5 border border-amber-400/20">
                                {part}
                            </span>
                        );
                    }
                    return <span key={i} className="text-slate-300">{part}</span>;
                })}
            </div>
        );
    };

    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        const textToCopy = isLiveMode && previewText ? previewText : template.content;
        try {
            await navigator.clipboard.writeText(textToCopy);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy', err);
        }
    };

    return (
        <div className="h-full flex flex-col bg-slate-900/30">
            {/* Header */}
            <div className="p-6 border-b border-white/5 flex items-center justify-between flex-shrink-0">
                <div>
                    <h2 className="text-xl font-bold text-white flex items-center gap-3">
                        {template.name}
                        <Badge variant={template.isActive ? 'success' : 'warning'}>
                            {template.isActive ? 'Active' : 'Draft'}
                        </Badge>
                    </h2>
                    <p className="text-sm text-slate-400 mt-1">
                        {template.department} &bull; {template.language === 'en' ? 'English' : 'Hindi'}
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="secondary" size="sm" onClick={handleCopy}>
                        {copied ? <Check className="w-4 h-4 mr-2 text-emerald-500" /> : <Copy className="w-4 h-4 mr-2" />}
                        {copied ? 'Copied!' : 'Copy'}
                    </Button>
                </div>
            </div>

            {/* Editor/Preview Area */}
            <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar relative min-h-0">
                <div className="max-w-3xl mx-auto bg-white/5 p-8 rounded-xl border border-white/5 shadow-2xl min-h-full pb-20">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
}
