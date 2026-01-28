import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles, Shield, ChevronRight } from 'lucide-react';

export default function LandingPage() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex flex-col pt-16 relative overflow-hidden">
            {/* Background Glows */}
            <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px]" />
            <div className="absolute top-[20%] right-[-10%] w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[120px]" />

            <main className="flex-1 max-w-7xl mx-auto px-6 w-full grid lg:grid-cols-2 gap-12 items-center">
                {/* Left: Copy */}
                <div className="space-y-8 z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-emerald-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        AI-Powered Legal Intelligence
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-balance leading-[1.1]">
                        Generate Powerful RTI Applications with
                        <span className="text-gradient-brand"> AI Intelligence</span>
                    </h1>

                    <p className="text-lg text-slate-400 max-w-xl leading-relaxed">
                        Navigate bureaucracy with confidence. Our AI analyzes your grievance, drafts legally precise applications, and routes them to the correct department instantly.
                    </p>

                    <div className="flex flex-wrap items-center gap-4">
                        <button
                            onClick={() => navigate('/generate')}
                            className="btn-primary px-8 py-3.5 flex items-center gap-2 text-sm"
                        >
                            Start Generating
                            <ArrowRight className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => navigate('/templates')}
                            className="btn-secondary px-6 py-3.5 flex items-center gap-2 text-sm"
                        >
                            View Templates
                            <ChevronRight className="w-4 h-4 text-slate-500" />
                        </button>
                    </div>

                    <div className="pt-8 border-t border-white/5 flex items-center gap-8 text-sm text-slate-500">
                        <div className="flex items-center gap-2">
                            <Shield className="w-4 h-4 text-emerald-500" />
                            <span>100% Private & Secure</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-cyan-500" />
                            <span>GPT-4o Integration</span>
                        </div>
                    </div>
                </div>

                {/* Right: Visuals (Asymmetrical) */}
                <div className="relative h-[600px] hidden lg:flex items-center justify-center">
                    {/* Floating Interface Cards */}

                    {/* Card 1: Main Draft */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] glass-panel rounded-xl p-6 z-20 animate-float">
                        <div className="flex items-center gap-3 mb-4 pb-4 border-b border-white/5">
                            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                                <Sparkles className="w-4 h-4 text-emerald-400" />
                            </div>
                            <div>
                                <div className="text-sm font-semibold text-white">Application Generated</div>
                                <div className="text-[10px] text-emerald-400">Perfect Score (98/100)</div>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <div className="h-2 w-3/4 bg-white/10 rounded-full" />
                            <div className="h-2 w-full bg-white/10 rounded-full" />
                            <div className="h-2 w-5/6 bg-white/10 rounded-full" />
                            <div className="h-2 w-full bg-white/5 rounded-full" />
                        </div>
                        <div className="mt-4 pt-3 flex gap-2">
                            <span className="px-2 py-1 rounded-md bg-white/5 border border-white/5 text-[10px] text-slate-400">Public Works Dept</span>
                            <span className="px-2 py-1 rounded-md bg-white/5 border border-white/5 text-[10px] text-slate-400">Corruption</span>
                        </div>
                    </div>

                    {/* Card 2: Suggestions (Behind) */}
                    <div className="absolute top-[20%] right-0 w-[280px] glass-panel rounded-xl p-4 z-10 opacity-60 scale-90 blur-[1px] animate-pulse-soft">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                            <span className="text-xs font-medium text-cyan-400">AI Suggestion</span>
                        </div>
                        <p className="text-xs text-slate-300 leading-normal">
                            "Ask about funds allocated vs. funds utilized for the project in FY 2024-25."
                        </p>
                    </div>

                    {/* Card 3: Department (Bottom Left) */}
                    <div className="absolute bottom-[20%] left-0 w-[260px] glass-panel rounded-xl p-4 z-30 animate-float" style={{ animationDelay: '2s' }}>
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-xs font-medium text-slate-400">Authority Detected</span>
                            <div className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px]">High Confidence</div>
                        </div>
                        <div className="font-semibold text-sm text-white">Municipal Corporation</div>
                        <div className="text-[10px] text-slate-500 mt-0.5">Civil Lines Zone, Delhi</div>
                    </div>

                </div>
            </main>
        </div>
    );
}
