import React from 'react';
import {
    ShieldAlert,
    Radar,
    TrendingDown,
    AlertTriangle,
    CheckCircle2,
    Activity,
    ShieldCheck,
    Lock,
    Wallet
} from 'lucide-react';
import { translations } from '../translations';

const RiskRadar = ({ data, lang = 'en' }) => {
    const t = (key) => translations[lang][key] || translations['en'][key] || key;

    if (!data || !data.health_score) return (
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-8">
            <ShieldAlert className="w-16 h-16 text-gray-300 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">{lang === 'hi' ? 'कोई डेटा उपलब्ध नहीं' : 'No Data Available'}</h3>
            <p className="text-gray-500 max-w-md mx-auto">
                {lang === 'hi'
                    ? 'कृपया जोखिम विश्लेषण देखने के लिए अपने वित्तीय दस्तावेज़ (बैंक विवरण, जीएसटी, आदि) अपलोड करें।'
                    : 'Please upload your financial documents (Bank Statements, GST, etc.) to view the Risk Analysis.'}
            </p>
        </div>
    );

    const riskLevel = data.health_score?.value < 40 ? 'High' : data.health_score?.value < 70 ? 'Moderate' : 'Low';

    const risks = [
        {
            title: lang === 'hi' ? 'कैश बर्न रिस्क' : 'Cash Burn Risk',
            simpleTitle: lang === 'hi' ? 'पैसे की कमी' : 'Low Cash Warning',
            status: data.cash_flow?.burn_rate > data.cash_flow?.inflow ? (lang === 'hi' ? 'क्रिटिकल' : 'Critical') : (lang === 'hi' ? 'स्थिर' : 'Stable'),
            desc: lang === 'hi' ? 'आपका मासिक खर्च आपकी आय से अधिक है।' : 'Your monthly expenses are higher than your income.',
            severity: data.cash_flow?.burn_rate > data.cash_flow?.inflow ? 'red' : 'green'
        },
        {
            title: lang === 'hi' ? 'ऋण क्षमता' : 'Debt Capacity',
            simpleTitle: lang === 'hi' ? 'कर्ज लेने की क्षमता' : 'Loan Eligibility',
            status: data.ratios?.dscr > 1.5 ? (lang === 'hi' ? 'मजबूत' : 'Strong') : (lang === 'hi' ? 'सीमित' : 'Limited'),
            desc: t('repayment_desc'),
            severity: data.ratios?.dscr > 1.5 ? 'green' : 'yellow'
        },
        {
            title: lang === 'hi' ? 'कर अनुपालन' : 'Tax Compliance',
            simpleTitle: lang === 'hi' ? 'सरकारी टैक्स स्थिति' : 'Govt Tax Status',
            status: lang === 'hi' ? 'सक्रिय' : 'Active',
            desc: lang === 'hi' ? 'जीएसटी और आयकर दाखिल करने की स्थिति।' : 'Status of GST and Income Tax filings.',
            severity: 'green'
        }
    ];

    return (
        <div className="animate-in fade-in slide-in-from-right-8 duration-1000">
            {/* Header */}
            <div className="mb-12">
                <div className="flex items-center gap-3 mb-4">
                    <ShieldAlert className="w-5 h-5 text-red-400" />
                    <span className="text-xs font-black text-red-500 uppercase tracking-[0.3em]">{lang === 'hi' ? 'रक्षा परत' : 'Defense Layer'}</span>
                </div>
                <h2 className="text-5xl font-black text-gray-900 tracking-tighter leading-tight">
                    {lang === 'hi' ? 'परिचालन' : 'Operational'} <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-600">{lang === 'hi' ? 'जोखिम रडार' : 'Risk Radar'}</span>
                </h2>
                <p className="text-gray-600/60 mt-4 text-lg max-w-2xl font-medium leading-relaxed">
                    {lang === 'hi' ?
                        "खतरों को आपके व्यवसाय को नुकसान पहुँचाने से पहले ही पहचानें। हमारा एआई लगातार आपकी वित्तीय विसंगतियों को स्कैन करता है।" :
                        "Detect threats before they damage your business. Our AI continuously scans your financial perimeter for anomalies."}
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Visual Radar Placeholder */}
                <div className="lg:col-span-12 bg-white border border-white/5 rounded-[3rem] p-12 overflow-hidden relative group">
                    <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent"></div>
                    <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
                        <div className="relative">
                            <div className="w-64 h-64 rounded-full border border-red-500/20 flex items-center justify-center animate-pulse">
                                <div className="w-48 h-48 rounded-full border border-red-500/20 flex items-center justify-center">
                                    <div className="w-32 h-32 rounded-full border border-red-500/20 flex items-center justify-center">
                                        <Radar className="w-12 h-12 text-red-500 animate-spin" style={{ animationDuration: '4s' }} />
                                    </div>
                                </div>
                            </div>
                            <div className="absolute -top-4 -right-4 bg-red-500 text-gray-900 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg animate-bounce">
                                {lang === 'hi' ? 'स्कैनिंग' : 'Scanning'}...
                            </div>
                        </div>

                        <div className="flex-1">
                            <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tighter mb-4">{lang === 'hi' ? 'वर्तमान एआई जोखिम विश्लेषण' : 'Current AI Risk Profile'}</h3>
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 mb-8 font-black uppercase tracking-widest text-xs">
                                <AlertTriangle className="w-4 h-4" />
                                {lang === 'hi' ? 'स्तर' : 'Level'}: {lang === 'hi' ? (riskLevel === 'High' ? 'उच्च' : riskLevel === 'Moderate' ? 'मध्यम' : 'कम') : riskLevel}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {risks.map((risk, i) => (
                                    <div key={i} className="bg-white/40 border border-white/5 rounded-2xl p-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <div>
                                                <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest block mb-1">{risk.title}</span>
                                                <span className="text-[11px] text-red-600 font-bold">{risk.simpleTitle}</span>
                                            </div>
                                            <div className={`w-2 h-2 rounded-full ${risk.severity === 'red' ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]' :
                                                risk.severity === 'green' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]' :
                                                    'bg-yellow-500 shadow-[0_0_8px_rgba(245,158,11,0.4)]'
                                                }`}></div>
                                        </div>
                                        <p className="text-lg font-black text-gray-900 uppercase tracking-tight mb-1">{risk.status}</p>
                                        <p className="text-[10px] text-gray-600/60 font-medium leading-relaxed">{risk.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Threat Log */}
                <div className="lg:col-span-8 space-y-6">
                    <h3 className="text-xl font-black text-gray-900 tracking-tight uppercase mb-4">{lang === 'hi' ? 'सुरक्षा लॉग' : 'Security Log'}</h3>
                    <div className="space-y-4">
                        {[
                            { time: '2h ago', event: lang === 'hi' ? 'अनियमित लेनदेन का पता चला' : 'Irregular transaction detected', impact: 'Medium', status: 'Flagged' },
                            { time: '5h ago', event: lang === 'hi' ? 'नकद रनवे की गणना' : 'Cash runway calculation', impact: 'Low', status: 'Logged' },
                            { time: '1d ago', event: lang === 'hi' ? 'राजस्व विसंगति स्कैन' : 'Revenue anomaly scan', impact: 'None', status: 'Clean' }
                        ].map((log, i) => (
                            <div key={i} className="bg-white/40 border border-white/5 rounded-2xl p-6 flex items-center justify-between">
                                <div className="flex items-center gap-6">
                                    <span className="text-[10px] font-black text-slate-500 uppercase min-w-[50px]">{log.time}</span>
                                    <div>
                                        <p className="text-sm font-black text-gray-900 uppercase tracking-tight">{log.event}</p>
                                        <p className="text-[10px] text-gray-600/60 font-medium">{lang === 'hi' ? 'प्रभाव' : 'Impact'}: {log.impact}</p>
                                    </div>
                                </div>
                                <div className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${log.status === 'Clean' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-gray-100 text-slate-500'}`}>
                                    {log.status}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Prevention Tips */}
                <div className="lg:col-span-4 bg-gradient-to-br from-emerald-600/10 to-transparent border border-gray-200 rounded-[2.5rem] p-10">
                    <ShieldCheck className="w-10 h-10 text-emerald-600 mb-6" />
                    <h4 className="text-xl font-black text-gray-900 tracking-tight mb-4 uppercase">{lang === 'hi' ? 'अनुकूलन युक्तियाँ' : 'Mitigation Tips'}</h4>
                    <ul className="space-y-6">
                        {[
                            { text: lang === 'hi' ? 'आपात स्थितियों के लिए 3 महीने का कैश रिजर्व रखें।' : 'Maintain 3 months of cash reserve for emergencies.', icon: Wallet },
                            { text: lang === 'hi' ? 'बैंक स्टेटमेंट का साप्ताहिक समाधान करें।' : 'Review bank statements weekly for reconcilliations.', icon: CheckCircle2 },
                            { text: lang === 'hi' ? 'क्रेडिट स्कोर सुधारने के लिए डीएससीआर को 1.25 से ऊपर रखें।' : 'Keep DSCR > 1.25 to improve credit rating.', icon: TrendingDown }
                        ].map((tip, i) => (
                            <li key={i} className="flex gap-4 items-start">
                                <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
                                    <tip.icon className="w-4 h-4" />
                                </div>
                                <p className="text-xs text-gray-900/70 leading-relaxed font-medium">{tip.text}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default RiskRadar;

