import { Search, Hash, FileText, ChevronRight } from "lucide-react";
import { Badge } from "../common/UiElements";
import { cn } from "../../utils";

export function TemplateList({ templates, selectedId, onSelect, searchQuery, onSearch }) {
    // Group by department
    const grouped = templates.reduce((acc, t) => {
        const dept = t.department || 'Other';
        if (!acc[dept]) acc[dept] = [];
        acc[dept].push(t);
        return acc;
    }, {});

    const filteredGroups = Object.keys(grouped).reduce((acc, dept) => {
        const filtered = grouped[dept].filter(t =>
            t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            t.department.toLowerCase().includes(searchQuery.toLowerCase())
        );
        if (filtered.length > 0) acc[dept] = filtered;
        return acc;
    }, {});

    return (
        <div className="flex flex-col h-full bg-black/20">
            {/* Search Header */}
            <div className="p-4 border-b border-white/5">
                <h2 className="text-sm font-semibold text-white mb-3">Templates</h2>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                        type="text"
                        placeholder="Search templates..."
                        value={searchQuery}
                        onChange={(e) => onSearch(e.target.value)}
                        className="w-full input-saas pl-9 pr-4 py-2 text-sm"
                    />
                </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-2 custom-scrollbar">
                {Object.keys(filteredGroups).length > 0 ? (
                    Object.entries(filteredGroups).map(([dept, items]) => (
                        <div key={dept} className="mb-4 last:mb-0">
                            <div className="flex items-center gap-2 mb-2 px-3 pt-2">
                                <Hash className="w-3 h-3 text-slate-500" />
                                <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                    {dept}
                                </span>
                            </div>
                            <div className="space-y-0.5">
                                {items.map(template => (
                                    <button
                                        key={template._id}
                                        onClick={() => onSelect(template)}
                                        className={cn(
                                            "w-full text-left px-3 py-2.5 rounded-lg transition-all duration-200 group flex items-center justify-between",
                                            selectedId === template._id
                                                ? "bg-emerald-500/10 text-white shadow-sm ring-1 ring-inset ring-emerald-500/20"
                                                : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
                                        )}
                                    >
                                        <div className="flex items-center gap-3 overflow-hidden">
                                            <FileText className={cn(
                                                "w-4 h-4 shrink-0",
                                                selectedId === template._id ? "text-emerald-400" : "text-slate-500 group-hover:text-slate-400"
                                            )} />
                                            <span className="truncate text-sm font-medium">
                                                {template.name}
                                            </span>
                                        </div>
                                        {selectedId === template._id && <ChevronRight className="w-3.5 h-3.5 text-emerald-400 opacity-50" />}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-10 text-slate-500 text-sm">
                        No templates found.
                    </div>
                )}
            </div>
        </div>
    );
}
