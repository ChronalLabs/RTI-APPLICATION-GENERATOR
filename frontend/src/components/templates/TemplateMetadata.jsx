import { Info, Tag, Layers, Play, BarChart2, Globe } from "lucide-react";
import { Button } from "../common/Button";
import { Badge } from "../common/UiElements";
import { useEffect, useState } from "react";
import { templateService } from "../../services/api"; // Corrected path

export function TemplateMetadata({ template, liveData, setLiveData, isLiveMode, toggleLiveMode }) {
    const [metadata, setMetadata] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (template?._id) {
            loadMetadata(template._id);
        }
    }, [template?._id]);

    const loadMetadata = async (id) => {
        setLoading(true);
        try {
            const response = await templateService.getMeta(id);
            if (response.success) {
                setMetadata(response.data);
            }
        } catch (error) {
            console.error("Failed to load metadata", error);
        } finally {
            setLoading(false);
        }
    };

    if (!template) return null;

    // Use fetched metadata variables or fall back to template variables (if any)
    const variables = metadata?.variables || template.variables || [];
    const tags = template.metadata?.tags || []; // Keep existing tags source if not in meta

    // Derived Intent/Department from metadata if available
    const department = metadata?.department || template.department;
    const intent = metadata?.intent;
    const usageCount = metadata?.usageCount;

    return (
        <div className="flex flex-col h-full bg-black/20">
            <div className="p-4 border-b border-white/5">
                <h3 className="text-sm font-semibold text-white mb-0.5">Template Intelligence</h3>
                <p className="text-[10px] text-slate-500 font-mono">ID: {template._id}</p>
            </div>

            <div className="p-4 space-y-6 flex-1 overflow-y-auto custom-scrollbar">
                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-2">
                    <div className="p-2 rounded bg-white/5 border border-white/5">
                        <span className="text-[10px] text-slate-500 block">Department</span>
                        <span className="text-xs font-semibold text-slate-300 truncate block" title={department}>{department}</span>
                    </div>
                    <div className="p-2 rounded bg-white/5 border border-white/5">
                        <span className="text-[10px] text-slate-500 block">Intent</span>
                        <span className="text-xs font-semibold text-emerald-400 truncate block" title={intent}>{intent || 'N/A'}</span>
                    </div>
                </div>

                {/* Live Tester */}
                <div className="p-4 rounded-lg bg-white/5 border border-white/5">
                    <h4 className="text-xs font-bold text-slate-300 mb-3 flex items-center gap-2 uppercase tracking-wide">
                        <Play className="w-3.5 h-3.5 text-emerald-500" />
                        Live Tester
                    </h4>

                    <div className={`space-y-3 transition-opacity duration-200 ${isLiveMode ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
                        {variables.length > 0 ? variables.map(v => (
                            <div key={v}>
                                <label className="text-[10px] font-medium text-slate-400 uppercase mb-1.5 block">{v}</label>
                                <input
                                    type="text"
                                    className="input-saas w-full px-3 py-2 text-xs"
                                    placeholder="Value..."
                                    value={liveData[v] || ''}
                                    onChange={(e) => setLiveData({ ...liveData, [v]: e.target.value })}
                                />
                            </div>
                        )) : (
                            <div className="text-xs text-slate-500 italic">No variables detected.</div>
                        )}
                    </div>

                    <Button
                        onClick={toggleLiveMode}
                        variant={isLiveMode ? 'primary' : 'secondary'}
                        className="w-full mt-4 text-xs font-medium py-2"
                        size="sm"
                    >
                        {isLiveMode ? 'Reset Tester' : 'Start Live Test'}
                    </Button>
                </div>

                {/* Variables List */}
                <div>
                    <h4 className="text-xs font-bold text-slate-300 mb-2.5 flex items-center gap-2 uppercase tracking-wide">
                        <Layers className="w-3.5 h-3.5 text-slate-500" />
                        Detected Variables
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                        {loading ? (
                            <span className="text-xs text-slate-500">Scanning template...</span>
                        ) : variables.map(v => (
                            <span key={v} className="px-2 py-1 rounded bg-white/5 border border-white/5 text-slate-400 text-[10px] font-mono">
                                {`{{${v}}}`}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Tags */}
                <div>
                    <h4 className="text-xs font-bold text-slate-300 mb-2.5 flex items-center gap-2 uppercase tracking-wide">
                        <Tag className="w-3.5 h-3.5 text-slate-500" />
                        Tags
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                        {tags.map(t => (
                            <Badge key={t} variant="default" className="capitalize text-[10px] px-2 py-0.5">{t}</Badge>
                        ))}
                    </div>
                </div>

                <div className="pt-4 border-t border-white/5">
                    <h4 className="text-xs font-bold text-slate-300 mb-2 flex items-center gap-2 uppercase tracking-wide">
                        <Info className="w-3.5 h-3.5 text-slate-500" />
                        Description
                    </h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                        {template.metadata?.description || "No description available."}
                    </p>
                </div>
            </div>
        </div>
    );
}
