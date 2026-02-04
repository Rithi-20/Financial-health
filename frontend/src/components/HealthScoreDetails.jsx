import React from 'react';
import {
    Activity,
    ArrowRight,
    CheckCircle2,
    AlertCircle,
    TrendingUp,
    ShieldCheck,
    BarChart3,
    Sigma
} from 'lucide-react';
import { translations } from '../translations';

const HealthScoreDetails = ({ data, lang = 'en' }) => {
    const [showRoadmap, setShowRoadmap] = React.useState(false);
    if (!data) return null;
    const { health_score, ratios } = data;
    const t = (key) => translations[lang][key] || translations['en'][key] || key;

    const RoadmapModal = () => (
        <div className={`fixed inset-0 z-[110] flex items-center justify-center p-6 ${showRoadmap ? 'visible opacity-100' : 'invisible opacity-0'} transition-all duration-300`}>
            <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-md" onClick={() => setShowRoadmap(false)}></div>
            <div className="relative bg-white border border-emerald-200 rounded-[3rem] w-full max-w-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
                <div className="p-10">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <span className="text-[10px] text-emerald-700 font-black uppercase tracking-[0.3em] mb-2 block">{lang === 'hi' ? 'रणनीतिक सफलता' : 'Strategic Success'}</span>
                            <h3 className="text-3xl font-black text-gray-900 tracking-tighter">{lang === 'hi' ? 'जीतने का' : 'Blueprint for'} <span className="text-emerald-600">{lang === 'hi' ? 'ब्लूप्रिंट' : 'Success'}</span></h3>
                        </div>
                        <button onClick={() => setShowRoadmap(false)} className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-900 hover:bg-gray-200 transition-colors">
                            <Activity className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="space-y-6">
                        {[
                            { step: "01", task: lang === 'hi' ? 'जेड-स्कोर अनुकूलन' : 'Z-Score Optimization', desc: lang === 'hi' ? 'अपने जेड-स्कोर को 4.5 से ऊपर ले जाने के लिए बनाए रखा कमाई (Retained Earnings) को 20% बढ़ाएं।' : 'Increase Retained Earnings by 20% to push Z-Score above 4.5 for prime lending rates.' },
                            { step: "02", task: lang === 'hi' ? 'तरलता बफर' : 'Liquidity Buffer', desc: lang === 'hi' ? 'आपातकालीन रिजर्व में मासिक खर्च का 4 गुना बनाए रखें।' : 'Maintain 4x monthly expenses in emergency reserves to withstand market shocks.' },
                            { step: "03", task: lang === 'hi' ? 'परिचालन दक्षता' : 'Operational Efficiency', desc: lang === 'hi' ? 'अपने शुद्ध मार्जिन को 15% तक बढ़ाने के लिए गैर-जरूरी खर्चों में 10% की कटौती करें।' : 'Reduce non-essential overheads by 10% to boost net margins to 15%+.' },
                        ].map((item, idx) => (
                            <div key={idx} className="flex gap-6">
                                <div className="w-12 h-12 rounded-2xl bg-emerald-600 flex items-center justify-center text-white font-black text-lg shrink-0 shadow-lg shadow-emerald-500/20">
                                    {item.step}
                                </div>
                                <div className="pt-2">
                                    <h4 className="text-sm font-black text-gray-900 uppercase tracking-tight mb-1">{item.task}</h4>
                                    <p className="text-xs text-gray-600 font-medium leading-relaxed">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-10 p-6 bg-emerald-50 rounded-3xl border border-emerald-100 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <ShieldCheck className="w-6 h-6 text-emerald-600" />
                            <p className="text-xs text-emerald-800 font-bold">{lang === 'hi' ? 'अगला लक्ष्य: यूनिकॉर्न फाइनेंशियल हेल्थ' : 'Next Goal: Unicorn Financial Health'}</p>
                        </div>
                        <button onClick={() => setShowRoadmap(false)} className="px-6 py-2 bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-700 transition-all">
                            {lang === 'hi' ? 'समझा' : 'Understood'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    const components = [
        {
            name: lang === 'hi' ? 'शोधन क्षमता (Z-स्कोर)' : 'Solvency (Z-Score)',
            value: ratios?.z_score?.toFixed(2) || '0.00',
            status: ratios?.z_score > 3 ? (lang === 'hi' ? 'सुरक्षित' : 'Safe') : (lang === 'hi' ? 'सावधानी' : 'Caution'),
            desc: lang === 'hi' ? 'यही स्कोर आपकी दिवालियापन संभावना को मापता है।' : 'Calculates the probability of bankruptcy.',
            color: ratios?.z_score > 3 ? 'emerald' : 'orange'
        },
        {
            name: lang === 'hi' ? 'ऋण सेवा कवरेज' : 'Debt Service Coverage',
            value: ratios?.dscr?.toFixed(2) || '0.00',
            status: ratios?.dscr > 1.25 ? (lang === 'hi' ? 'स्वस्थ' : 'Healthy') : (lang === 'hi' ? 'कम' : 'Low'),
            desc: lang === 'hi' ? 'ऋण चुकाने की आपकी वर्तमान क्षमता।' : 'Current capacity to repay business debt.',
            color: ratios?.dscr > 1.25 ? 'emerald' : 'red'
        },
        {
            name: lang === 'hi' ? 'शुद्ध लाभ मार्जिन' : 'Net Profit Margin',
            value: ((ratios?.net_margin || 0) * 100).toFixed(1) + '%',
            status: ratios?.net_margin > 0.1 ? (lang === 'hi' ? 'अच्छा' : 'Good') : (lang === 'hi' ? 'कम' : 'Low'),
            desc: lang === 'hi' ? 'खर्चों के बाद हाथ में रहने वाला पैसा।' : 'Profits remaining after all operations.',
            color: ratios?.net_margin > 0.1 ? 'emerald' : 'yellow'
        }
    ];

    return (
        <div className="animate-in fade-in slide-in-from-right-8 duration-1000">
            <RoadmapModal />
            {/* Header */}
            <div className="mb-12">
                <div className="flex items-center gap-3 mb-4">
                    <Sigma className="w-5 h-5 text-purple-400" />
                    <span className="text-xs font-black text-purple-500 uppercase tracking-[0.3em]">{lang === 'hi' ? 'गणना की गहराई' : 'Calculation Depth'}</span>
                </div>
                <h2 className="text-5xl font-black text-gray-900 tracking-tighter leading-tight">
                    {lang === 'hi' ? 'स्वास्थ्य विश्लेषण' : 'Health'} <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">{lang === 'hi' ? 'विवरण' : 'Analytics'}</span>
                </h2>
                <p className="text-gray-600/60 mt-4 text-lg max-w-2xl font-medium leading-relaxed">
                    {lang === 'hi' ?
                        "हमारा मालिकाना स्कोरिंग एल्गोरिदम आपके व्यवसाय की स्थिरता को निर्धारित करने के लिए कई वित्तीय डेटा बिंदुओं को जोड़ता है।" :
                        "Our proprietary scoring algorithm combines multiple financial data points to determine your business stability."}
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-12">
                {components.map((comp, i) => (
                    <div key={i} className="bg-white border border-gray-200 rounded-[2.5rem] p-8 hover:bg-gray-50 transition-all group shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{comp.name}</span>
                            <div className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${comp.color === 'emerald' ? 'bg-emerald-50 text-emerald-600' :
                                comp.color === 'orange' ? 'bg-orange-50 text-orange-600' :
                                    comp.color === 'red' ? 'bg-red-50 text-red-600' :
                                        comp.color === 'yellow' ? 'bg-yellow-50 text-yellow-600' :
                                            'bg-gray-100 text-gray-600'
                                }`}>
                                {comp.status}
                            </div>
                        </div>
                        <div className="text-4xl font-black text-gray-900 tracking-tighter mb-4">{comp.value}</div>
                        <p className="text-xs text-gray-600/60 leading-relaxed font-medium mb-6">{comp.desc}</p>
                        <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                            <div
                                className={`h-full transition-all duration-1000 ${comp.color === 'emerald' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]' :
                                    comp.color === 'orange' ? 'bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.4)]' :
                                        comp.color === 'red' ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]' :
                                            'bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.4)]'
                                    }`}
                                style={{ width: i === 1 ? `${Math.min(parseFloat(comp.value) * 50, 100)}%` : i === 0 ? `${Math.min(parseFloat(comp.value) * 20, 100)}%` : '70%' }}
                            ></div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-12">
                {/* Score Breakdown / Why this Score? */}
                <div className="lg:col-span-12 bg-white/60 border border-emerald-200 rounded-[3rem] p-10 shadow-2xl backdrop-blur-md">
                    <div className="flex items-center gap-3 mb-8">
                        <TrendingUp className="w-6 h-6 text-emerald-600" />
                        <h3 className="text-2xl font-black text-gray-900 tracking-tighter uppercase">{t('why_this_score')}</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {data.score_factors?.map((factor, idx) => (
                            <div key={idx} className={`p-6 rounded-[2rem] border transition-all ${factor.impact === 'positive' ? 'bg-emerald-50/50 border-emerald-100 hover:border-emerald-300' : 'bg-red-50/50 border-red-100 hover:border-red-300'}`}>
                                <div className="flex items-center gap-3 mb-4">
                                    {factor.impact === 'positive' ? (
                                        <div className="p-2 bg-emerald-500 rounded-xl text-white">
                                            <CheckCircle2 className="w-4 h-4" />
                                        </div>
                                    ) : (
                                        <div className="p-2 bg-red-500 rounded-xl text-white">
                                            <AlertCircle className="w-4 h-4" />
                                        </div>
                                    )}
                                    <span className={`text-[10px] font-black uppercase tracking-widest ${factor.impact === 'positive' ? 'text-emerald-700' : 'text-red-700'}`}>
                                        {factor.impact === 'positive' ? t('positive') : t('negative')}
                                    </span>
                                </div>
                                <p className={`text-xs font-bold leading-relaxed ${factor.impact === 'positive' ? 'text-emerald-900' : 'text-red-900'}`}>
                                    {factor.text}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Methodology */}
                <div className="lg:col-span-8 bg-white border border-emerald-200 rounded-[3rem] p-12 shadow-xl relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 to-transparent"></div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-4 mb-8">
                            <ShieldCheck className="w-10 h-10 text-emerald-600" />
                            <div>
                                <h3 className="text-2xl font-black text-gray-900 tracking-tighter uppercase">{lang === 'hi' ? 'स्कोरिंग कार्यप्रणाली' : 'Scoring Methodology'}</h3>
                                <p className="text-xs text-emerald-600/60 font-black uppercase tracking-widest">{lang === 'hi' ? 'एआई-संचालित सटीक रेटिंग' : 'AI-Powered Precision Rating'}</p>
                            </div>
                        </div>

                        <div className="space-y-8">
                            <div className="bg-emerald-50 rounded-3xl p-8 border border-emerald-100">
                                <h4 className="text-sm font-black text-emerald-900 uppercase mb-4 flex items-center gap-2">
                                    <Activity className="w-4 h-4 text-emerald-600" /> {lang === 'hi' ? 'अल्टमैन जेड-स्कोर के बारे में' : 'About Altman Z-Score'}
                                </h4>
                                <p className="text-xs text-emerald-800 leading-relaxed font-semibold">
                                    {lang === 'hi' ?
                                        "अल्टमैन जेड-स्कोर एक वित्तीय माप है जो यह अनुमान लगाता है कि क्या कोई व्यवसाय दिवालिया होने की ओर बढ़ रहा है। 3.0 से ऊपर का स्कोर व्यवसाय को 'सुरक्षित' क्षेत्र में रखता है। आपका वर्तमान स्कोर इंगित करता है कि आपका व्यवसाय सुरक्षित है।" :
                                        "The Altman Z-score is a financial metric that predicts whether a business is headed for bankruptcy. A score above 3.0 places the business in the 'Safe' zone. Your current score indicates your business is secure."}
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="flex gap-4 items-start">
                                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                                    <div>
                                        <h5 className="text-xs font-black text-gray-900 uppercase mb-1">{lang === 'hi' ? 'डेटा अखंडता' : 'Data Integrity'}</h5>
                                        <p className="text-[10px] text-gray-600 font-bold">{lang === 'hi' ? 'सभी डेटा आधिकारिक बैंक विवरणों से प्राप्त किया गया है।' : 'All data sourced from official bank statements.'}</p>
                                    </div>
                                </div>
                                <div className="flex gap-4 items-start">
                                    <AlertCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                                    <div>
                                        <h5 className="text-xs font-black text-gray-900 uppercase mb-1">{lang === 'hi' ? 'रीयल-टाइम अपडेट' : 'Real-time Updates'}</h5>
                                        <p className="text-[10px] text-gray-600 font-bold">{lang === 'hi' ? 'हर बार जब आप नया डेटा अपलोड करते हैं तो आपका स्कोर अपडेट होता है।' : 'Your score updates every time you upload new data.'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Performance Box */}
                <div className="lg:col-span-4 bg-white border border-gray-200 rounded-[3rem] p-10 flex flex-col justify-between shadow-xl">
                    <div>
                        <BarChart3 className="w-10 h-10 text-emerald-400 mb-8" />
                        <h4 className="text-2xl font-black text-gray-900 tracking-tighter uppercase mb-2">{lang === 'hi' ? 'मजबूत स्थिति' : 'Strong Position'}</h4>
                        <p className="text-[11px] text-gray-700 font-bold italic leading-relaxed">
                            {lang === 'hi' ?
                                `आपका व्यवसाय वर्तमान में स्कोर के आधार पर 'स्वस्थ' श्रेणी में है। इसका मतलब है कि आप अनुकूल बैंक शर्तों के लिए योग्य हैं।` :
                                `Your business is currently in the 'Healthy' category based on scores. This means you qualify for favorable bank terms.`}
                        </p>
                    </div>
                    <button
                        onClick={() => setShowRoadmap(true)}
                        className="mt-8 w-full py-4 bg-emerald-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
                    >
                        {lang === 'hi' ? 'सफलता का मार्ग' : 'Path to Success'} <ArrowRight className="w-3 h-3" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HealthScoreDetails;
