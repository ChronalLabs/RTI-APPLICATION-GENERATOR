import { cn } from "../../utils";
import { Loader2 } from "lucide-react";

export function Button({
    children,
    variant = 'primary',
    size = 'md',
    className,
    isLoading,
    disabled,
    ...props
}) {
    const variants = {
        primary: "bg-gradient-to-br from-sky-500 to-sky-600 text-white shadow-lg shadow-sky-500/25 hover:shadow-sky-500/40 hover:-translate-y-0.5 active:translate-y-0",
        secondary: "bg-white/5 border border-white/10 text-slate-200 hover:bg-white/10 hover:border-white/20 active:bg-white/5",
        ghost: "text-slate-400 hover:text-white hover:bg-white/5",
        danger: "bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20",
        success: "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 hover:bg-emerald-500/20"
    };

    const sizes = {
        sm: "px-3 py-1.5 text-xs",
        md: "px-6 py-3 text-sm",
        lg: "px-8 py-4 text-base",
        icon: "p-2"
    };

    return (
        <button
            className={cn(
                "rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2 font-display disabled:opacity-50 disabled:pointer-events-none",
                variants[variant],
                sizes[size],
                className
            )}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            {children}
        </button>
    );
}
