import { CheckCircle2, AlertTriangle, AlertOctagon } from "lucide-react";
import { cn } from "../../utils";

export default function ValidationPanel({ validation }) {
    if (!validation) return null;

    const { score, suggestions, riskLevel = 'Low' } = validation;

    const getScoreColor = (s) => {
        if (s >= 80) return "text-emerald-400";
        if (s >= 60) return "text-amber-400";
        return "text-red-400";
    };

    const getProgressColor = (s) => {
        if (s >= 80) return "bg-emerald-500";
        if (s >= 60) return "bg-amber-500";
        return "bg-red-500";
    };

    const getRiskColor = (risk) => {
        switch (risk?.toLowerCase()) {
            case 'low': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
            case 'medium': return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
            case 'high': return 'text-red-400 bg-red-400/10 border-red-400/20';
            default: return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
        }
    };

    return (
        <div className="mt-6 border-t border-white/5 pt-6 animate-enter delay-100">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 mb-4">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center">
                            <CheckCircle2 className="w-5 h-5 text-indigo-400" />
                        </div>
                        <div>
                            <h4 className="font-bold text-white text-sm">Draft Intelligence</h4>
                            <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">AI Analysis</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className={cn("text-2xl font-bold", getScoreColor(score))}>
                            {score}%
                        </div>
                        <div className={cn("text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border", getRiskColor(riskLevel))}>
                            {riskLevel} Risk
                        </div>
                    </div>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                    <div className="bg-black/20 rounded-lg p-2 text-center">
                        <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">Structure</div>
                        <div className="text-xs font-bold text-white">{validation.completeness || 0}%</div>
                    </div>
                    <div className="bg-black/20 rounded-lg p-2 text-center">
                        <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">Tone</div>
                        <div className="text-xs font-bold text-emerald-400">Neutral</div>
                    </div>
                    <div className="bg-black/20 rounded-lg p-2 text-center">
                        <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">Issues</div>
                        <div className="text-xs font-bold text-amber-400">{suggestions?.length || 0}</div>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden mb-1">
                    <div
                        className={cn("h-full transition-all duration-1000 ease-out rounded-full", getProgressColor(score))}
                        style={{ width: `${score}%` }}
                    />
                </div>
            </div>

            {/* Suggestions List */}
            {suggestions?.length > 0 && (
                <div className="space-y-2">
                    <h5 className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1 mb-2">Recommended Improvements</h5>
                    {suggestions.map((suggestion, idx) => (
                        <div
                            key={idx}
                            className="flex items-start gap-2 text-xs text-slate-300 bg-white/5 p-3 rounded-xl border border-white/5 hover:bg-white/10 transition-colors"
                        >
                            <AlertTriangle className="w-3.5 h-3.5 mt-0.5 shrink-0 text-amber-400" />
                            {suggestion}
                        </div>
                    ))}
                </div>
            )}

            {score >= 90 && suggestions?.length === 0 && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    Excellent! This draft has a high probability of acceptance.
                </div>
            )}
        </div>
    );
}
