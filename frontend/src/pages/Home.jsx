import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Header from '../components/layout/Header';
import RTIForm from '../components/rti/RTIForm';
import DraftPreview from '../components/rti/DraftPreview';
import { Sparkles, Building2, ShieldCheck } from 'lucide-react';
import { Badge } from '../components/common/UiElements';

export default function HomePage() {
    const [generatedDraft, setGeneratedDraft] = useState(null);
    const { t } = useTranslation();

    return (
        <div className="min-h-screen">
            <Header />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
                {/* Hero Section */}
                <div className="text-center mb-16 animate-enter">
                    <Badge variant="info" className="mb-6 px-3 py-1 bg-gradient-to-r from-sky-500/20 to-purple-500/20 border-sky-500/30">
                        <span className="relative flex h-2 w-2 mr-2 inline-block">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
                        </span>
                        {t('hero.badge')}
                    </Badge>

                    <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight leading-tight">
                        {t('hero.title_prefix')}
                        <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-purple-400 to-emerald-400">{t('hero.title_highlight')}</span>
                    </h1>

                    <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed mb-8">
                        {t('hero.subtitle')}
                    </p>

                    <div className="flex justify-center gap-4 text-xs font-semibold text-slate-500 uppercase tracking-widest">
                        <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/5 bg-white/5">
                            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Smart Suggestions
                        </span>
                        <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/5 bg-white/5">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Risk Analyzer
                        </span>
                        <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/5 bg-white/5">
                            <Building2 className="w-3.5 h-3.5 text-sky-400" /> Dept Graph
                        </span>
                    </div>
                </div>

                {/* Main Interface Grid */}
                <div className="grid lg:grid-cols-12 gap-8 items-start relative">
                    {/* Decorative Glow */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-4xl bg-sky-500/5 blur-[100px] rounded-full -z-10" />

                    {/* Left: Form (7 cols) */}
                    <div className="lg:col-span-7 animate-enter delay-100 h-full">
                        <RTIForm onDraftGenerated={setGeneratedDraft} />
                    </div>

                    {/* Right: Preview (5 cols) */}
                    <div className="lg:col-span-5 animate-enter delay-200 lg:sticky lg:top-24 h-full">
                        <DraftPreview draft={generatedDraft} />
                    </div>
                </div>

                {/* Features Section */}
                <div className="mt-32 grid md:grid-cols-3 gap-8">
                    {[
                        {
                            icon: <Sparkles className="w-6 h-6" />,
                            title: 'Smart Suggestions',
                            description: 'AI analyzes your intent to suggest high-impact questions that get results.',
                            color: 'text-amber-400',
                            bg: 'bg-amber-400/10 border-amber-400/20'
                        },
                        {
                            icon: <Building2 className="w-6 h-6" />,
                            title: 'Department Mapping',
                            description: 'Automatically routes your query to the correct ministry or public authority.',
                            color: 'text-sky-400',
                            bg: 'bg-sky-400/10 border-sky-400/20'
                        },
                        {
                            icon: <ShieldCheck className="w-6 h-6" />,
                            title: 'Legal Validation',
                            description: 'Checks your draft against RIA Act 2005 rules for maximum acceptance rate.',
                            color: 'text-emerald-400',
                            bg: 'bg-emerald-400/10 border-emerald-400/20'
                        },
                    ].map((feature, idx) => (
                        <div
                            key={idx}
                            className="group p-8 rounded-3xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all duration-300"
                        >
                            <div className={`w-12 h-12 rounded-2xl ${feature.bg} ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3 font-display">{feature.title}</h3>
                            <p className="text-slate-400 leading-relaxed">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </main>

            {/* Footer */}
            <footer className="mt-20 py-12 border-t border-white/5">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <p className="text-slate-600 text-sm">
                        Empowering citizens since 2026. Made with ❤️ for India.
                    </p>
                </div>
            </footer>
        </div>
    );
}
