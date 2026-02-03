import React from 'react';
import {
    HandCoins,
    TrendingUp,
    ShieldCheck,
    ArrowRight,
    Lock,
    Zap,
    Building2,
    Clock,
    Percent,
    Banknote,
    Info,
    XCircle
} from 'lucide-react';
import { translations } from '../translations';

const FundingHub = ({ data, lang = 'en' }) => {
    const [showRoadmap, setShowRoadmap] = React.useState(false);
    if (!data?.lending) return null;

    const { score, loans, roadmap } = data.lending;
    const t = (key) => translations[lang][key] || translations['en'][key] || key;

    const RoadmapOverlay = () => (
        <div className={`fixed inset-0 z-[100] flex items-center justify-center p-6 ${showRoadmap ? 'visible opacity-100' : 'invisible opacity-0'} transition-all duration-300`}>
            <div className="absolute inset-0 bg-white/80 backdrop-blur-xl" onClick={() => setShowRoadmap(false)}></div>
            <div className="relative bg-white border border-emerald-200 rounded-[3rem] w-full max-w-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
                <div className="p-10">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <span className="text-[10px] text-emerald-700 font-black uppercase tracking-[0.3em] mb-2 block">{lang === 'hi' ? 'रणनीतिक विकास' : 'Strategic Growth'}</span>
                            <h3 className="text-3xl font-black text-gray-900 tracking-tighter">{lang === 'hi' ? 'स्कोर' : 'Score'} <span className="text-emerald-600">{lang === 'hi' ? 'रोडमैप' : 'Roadmap'}</span></h3>
                        </div>
                        <button onClick={() => setShowRoadmap(false)} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-900 hover:bg-white/10 transition-colors">
                            <XCircle className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="space-y-8 max-h-[50vh] overflow-y-auto pr-4 custom-scrollbar">
                        {roadmap?.map((item, idx) => (
                            <div key={idx} className="flex gap-6 relative">
                                {idx !== roadmap.length - 1 && (
                                    <div className="absolute left-6 top-10 bottom-0 w-px bg-white/5"></div>
                                )}
                                <div className="w-12 h-12 rounded-2xl bg-emerald-600 flex items-center justify-center text-white font-black text-lg shrink-0 shadow-lg shadow-emerald-600/20 z-10">
                                    {item.step}
                                </div>
                                <div className="pt-2">
                                    <h4 className="text-sm font-black text-gray-900 uppercase tracking-tight mb-2 flex items-center gap-2">
                                        {item.task}
                                        {item.impact && <span className="text-[8px] bg-emerald-400/10 text-emerald-400 px-2 py-0.5 rounded-full uppercase">{lang === 'hi' ? 'प्रभाव' : 'Impact'}: {item.impact}</span>}
                                    </h4>
                                    <p className="text-xs text-gray-600/60 leading-relaxed font-medium">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-12 p-6 bg-emerald-50 rounded-3xl border border-gray-200 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <ShieldCheck className="w-6 h-6 text-emerald-600" />
                            <p className="text-[10px] text-gray-600/60 font-medium">{lang === 'hi' ? 'अनुमानित स्कोर वृद्धि:' : 'Estimated score boost:'} <span className="text-emerald-600 font-black">+80-120 Points</span></p>
                        </div>
                        <button onClick={() => setShowRoadmap(false)} className="text-[10px] font-black text-white uppercase tracking-widest bg-emerald-600 px-6 py-3 rounded-xl hover:bg-emerald-500 transition-colors">
                            {lang === 'hi' ? 'मैं इस पर हूँ' : "I'm on it"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    const ScoreMeter = ({ score }) => {
        const percentage = ((score - 300) / 600) * 100;
        const color = score > 750 ? '#10b981' : score > 650 ? '#059669' : '#f59e0b';

        return (
            <div className="relative w-48 h-48 mx-auto">
                <svg className="w-full h-full transform -rotate-90">
                    <circle cx="96" cy="96" r="88" strokeWidth="12" stroke="currentColor" fill="transparent" className="text-slate-800" />
                    <circle
                        cx="96" cy="96" r="88" strokeWidth="12" strokeDasharray={552.92} strokeDashoffset={552.92 * (1 - percentage / 100)}
                        strokeLinecap="round" stroke={color} fill="transparent" className="transition-all duration-1000 ease-out"
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-black text-gray-900 tracking-tighter">{score}</span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 mt-1">{t('live_score')}</span>
                </div>
            </div>
        );
    };

    return (
        <div className="animate-in fade-in slide-in-from-right-8 duration-1000">
            <RoadmapOverlay />
            {/* Header */}
            <div className="mb-12">
                <div className="flex items-center gap-3 mb-4">
                    <HandCoins className="w-5 h-5 text-emerald-600" />
                    <span className="text-xs font-black text-emerald-700 uppercase tracking-[0.3em]">{t('capital_fuel')}</span>
                </div>
                <h2 className="text-5xl font-black text-gray-900 tracking-tighter leading-tight">{lang === 'hi' ? 'फंडिंग खोज' : 'Funding Discovery'}</h2>
                <p className="text-gray-600/60 mt-4 text-lg max-w-2xl font-medium leading-relaxed">
                    {lang === 'hi' ?
                        "बैंक-तैयार क्रेडिट स्कोरिंग और तत्काल उत्पाद मिलान के साथ अपने विकास के अगले चरण को गति दें।" :
                        "Fuel your next phase of growth with bank-ready credit scoring and instant product matching."}
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Score Column */}
                <div className="lg:col-span-4 space-y-8">
                    <div className="bg-white border border-emerald-200 rounded-[2.5rem] p-10 text-center shadow-2xl">
                        <h3 className="text-xl font-black text-gray-900 tracking-tight uppercase mb-8">{t('credit_power')}</h3>
                        <ScoreMeter score={score} />
                        <div className="mt-10 p-6 bg-emerald-50 rounded-3xl border border-gray-200">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">{lang === 'hi' ? 'स्वास्थ्य' : 'Health'}</span>
                                <span className={`text-[10px] font-black uppercase tracking-widest ${score > 750 ? 'text-emerald-400' : 'text-emerald-600'}`}>
                                    {score > 750 ? (lang === 'hi' ? 'उत्कृष्ट' : 'Excellent') : (lang === 'hi' ? 'औसत' : 'Average')}
                                </span>
                            </div>
                            <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                                <div className={`h-full transition-all duration-1000 ${score > 750 ? 'bg-emerald-500' : 'bg-emerald-600'}`} style={{ width: `${(score / 900) * 100}%` }}></div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-emerald-600 rounded-[2.5rem] p-10 shadow-2xl shadow-emerald-600/20 relative overflow-hidden group">
                        <div className="relative z-10">
                            <Zap className="w-8 h-8 text-white mb-4" />
                            <h4 className="text-xl font-black text-white tracking-tight mb-2 uppercase">{t('boost_score')}</h4>
                            <p className="text-white/80 text-xs leading-relaxed font-medium">
                                {lang === 'hi' ?
                                    "सस्ते ब्याज दरों को अनलॉक करने के लिए 1.5 से ऊपर डीएससीआर बनाए रखें और अल्पकालिक देनदारियों को कम करें।" :
                                    "Maintain a DSCR above 1.5 and reduce short-term liabilities to unlock cheaper interest rates."}
                            </p>
                            <button
                                onClick={() => setShowRoadmap(true)}
                                className="mt-6 px-6 py-2 bg-white text-emerald-700 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-emerald-50 transition-colors"
                            >
                                {t('road_map')}
                            </button>
                        </div>
                        <Building2 className="absolute -right-4 -bottom-4 w-32 h-32 text-gray-900/10 group-hover:scale-110 transition-transform duration-700" />
                    </div>
                </div>

                {/* Loans Column */}
                <div className="lg:col-span-8 space-y-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-black text-gray-900 tracking-tight uppercase">{t('tailored_offers')}</h3>
                        <div className="text-[10px] font-black text-emerald-400 uppercase tracking-widest bg-emerald-400/10 px-4 py-2 rounded-full border border-emerald-400/20">
                            {loans.filter(l => l.is_eligible).length} {lang === 'hi' ? 'मिलान मिले' : 'Matches Found'}
                        </div>
                    </div>

                    <div className="grid gap-6">
                        {loans.map((loan, idx) => (
                            <div key={idx} className={`bg-white/60 border rounded-[2rem] p-8 transition-all hover:bg-white/80 group ${loan.is_eligible ? 'border-emerald-500/20' : 'border-white/5 opacity-60'}`}>
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                    <div className="flex items-start gap-6">
                                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 ${loan.is_eligible ? 'bg-emerald-500/10 text-emerald-400' : 'bg-gray-100 text-slate-500'}`}>
                                            {loan.is_eligible ? <Zap className="w-8 h-8" /> : <Lock className="w-8 h-8" />}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-3 mb-2">
                                                <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">{loan.bank}</span>
                                                {!loan.is_eligible && <span className="text-[8px] bg-gray-100 text-slate-400 px-2 py-0.5 rounded-full uppercase">Target: {loan.min_score}</span>}
                                            </div>
                                            <h4 className="text-xl font-black text-gray-900 tracking-tight uppercase mb-4">{loan.name}</h4>

                                            <div className="flex flex-wrap gap-4">
                                                <div className="flex items-center gap-2">
                                                    <Banknote className="w-3.5 h-3.5 text-emerald-600" />
                                                    <span className="text-xs font-black text-gray-900">{loan.amount}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Percent className="w-3.5 h-3.5 text-emerald-600" />
                                                    <span className="text-xs font-black text-gray-900">{loan.rate}</span>
                                                </div>
                                                <div className="hidden md:flex items-center gap-2">
                                                    <Clock className="w-3.5 h-3.5 text-emerald-600" />
                                                    <span className="text-xs font-black text-gray-900">{lang === 'hi' ? '48 घंटे की स्वीकृति' : '48hr Approval'}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {loan.is_eligible ? (
                                        <a
                                            href={loan.apply_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest bg-emerald-500 text-gray-900 shadow-lg shadow-emerald-500/20 hover:scale-105 transition-all text-center no-underline flex items-center justify-center min-w-[140px]"
                                        >
                                            {t('apply_now')}
                                        </a>
                                    ) : (
                                        <button
                                            disabled
                                            className="px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest bg-gray-100 text-slate-500 cursor-not-allowed min-w-[140px]"
                                        >
                                            {lang === 'hi' ? 'लॉक्ड' : 'Locked'}
                                        </button>
                                    )}
                                </div>

                                <div className="mt-6 pt-6 border-t border-white/5 flex items-center gap-2">
                                    <Info className="w-3.5 h-3.5 text-emerald-600/60" />
                                    <p className="text-[10px] text-gray-600/40 font-medium italic">{loan.purpose}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="p-8 bg-white border border-white/5 rounded-[2rem] text-center">
                        <p className="text-[11px] text-slate-500 font-medium leading-relaxed italic">
                            {lang === 'hi' ?
                                "पारदर्शिता नोट: ऋण मिलान आपके पिछले 12 महीनों के विश्लेषण किए गए बैंकिंग डेटा पर आधारित हैं। अंतिम स्वीकृति उधार देने वाले संस्थानों की क्रेडिट नीतियों के अधीन है।" :
                                "Transparency Note: Loan matches are based on your analyzed banking data from the past 12 months. Final approval is subject to the credit policies of the lending institutions."}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FundingHub;


