import { cn } from "../../utils";
import { Copy, CheckCircle2, AlertTriangle, Download, FileText } from 'lucide-react';

export function Card({ className, children, ...props }) {
    return (
        <div className={cn("glass-panel rounded-3xl p-6", className)} {...props}>
            {children}
        </div>
    );
}

export function Badge({ children, variant = 'default', className }) {
    const variants = {
        default: "bg-slate-500/10 text-slate-400 border-slate-500/20",
        success: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
        warning: "bg-amber-500/10 text-amber-400 border-amber-500/20",
        info: "bg-sky-500/10 text-sky-400 border-sky-500/20",
        purple: "bg-purple-500/10 text-purple-400 border-purple-500/20"
    };

    return (
        <span className={cn("px-2.5 py-1 rounded-md text-xs font-medium border", variants[variant], className)}>
            {children}
        </span>
    );
}
