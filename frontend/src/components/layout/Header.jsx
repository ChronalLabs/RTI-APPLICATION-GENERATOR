import { Link, useLocation } from 'react-router-dom';
import { Github, Zap, FileText, LayoutTemplate, Network, ChevronLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Header() {
    const location = useLocation();
    const { i18n, t } = useTranslation();
    const isActive = (path) => location.pathname === path;
    const isHomePage = location.pathname === '/';
    const currentLang = i18n.language;

    const changeLanguage = (lng) => i18n.changeLanguage(lng);

    const navLinks = [
        { path: '/generate', label: t('app.nav.generator', 'Generator'), icon: FileText },
        { path: '/templates', label: t('app.nav.templates', 'Templates'), icon: LayoutTemplate },
        { path: '/graph', label: t('app.nav.insights', 'Graph'), icon: Network },
    ];

    return (
        <header className="fixed top-0 w-full z-50 transition-all duration-300 backdrop-blur-md border-b border-white/5 bg-black/60">
            <div className="max-w-[1800px] mx-auto px-6">
                <div className="flex items-center justify-between h-16">
                    {/* Brand + Back Button */}
                    <div className="flex items-center gap-4">
                        {!isHomePage && (
                            <Link
                                to="/"
                                className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors text-sm"
                            >
                                <ChevronLeft className="w-4 h-4" />
                                Home
                            </Link>
                        )}
                        <Link to="/" className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-black shadow-lg shadow-emerald-500/20">
                                <Zap className="w-5 h-5 fill-current" />
                            </div>
                            <span className="text-lg font-bold tracking-tight text-white">{t('app.title', 'RTI-Gen')}</span>
                        </Link>
                    </div>

                    {/* Nav - Pill Style */}
                    <nav className="hidden md:flex items-center gap-1 bg-white/5 rounded-full px-1 py-1">
                        {navLinks.map((link) => {
                            const Icon = link.icon;
                            const active = isActive(link.path);
                            return (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${active
                                            ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20'
                                            : 'text-slate-400 hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    <Icon className="w-4 h-4" />
                                    {link.label}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Actions */}
                    <div className="flex items-center gap-4">
                        <a href="https://github.com" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white">
                            <Github className="w-5 h-5" />
                        </a>

                        <div className="h-4 w-[1px] bg-white/10" />

                        {/* Language Toggle with Active State */}
                        <div className="flex items-center gap-1 text-xs font-medium bg-white/5 rounded-full px-1 py-1">
                            <button
                                onClick={() => changeLanguage('en')}
                                className={`px-2 py-1 rounded-full transition-all ${currentLang === 'en'
                                        ? 'bg-emerald-500 text-black'
                                        : 'text-slate-400 hover:text-white'
                                    }`}
                            >
                                EN
                            </button>
                            <button
                                onClick={() => changeLanguage('hi')}
                                className={`px-2 py-1 rounded-full transition-all ${currentLang === 'hi'
                                        ? 'bg-emerald-500 text-black'
                                        : 'text-slate-400 hover:text-white'
                                    }`}
                            >
                                HI
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
