import React from 'react';
import {
    ArrowUpCircle,
    ArrowDownCircle,
    TrendingDown,
    Clock,
    AlertTriangle,
    Wallet,
    Droplets,
    BarChart3,
    ArrowRightLeft
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { translations } from '../translations';

const CashFlowManager = ({ data, lang = 'en' }) => {
    if (!data || !data.cash_flow) return null;

    const { cash_flow } = data;
    const t = (key) => translations[lang][key] || translations['en'][key] || key;

    const StatCard = ({ title, value, sub, icon: Icon, color }) => (
        <div className="bg-white/60 border border-gray-200 rounded-3xl p-8 backdrop-blur-md shadow-2xl relative overflow-hidden group">
            <div className={`absolute -right-4 -top-4 w-24 h-24 bg-${color}-500/5 rounded-full blur-2xl`}></div>
            <div className="flex items-start justify-between relative z-10">
                <div>
                    <p className="text-[10px] text-emerald-700 font-black uppercase tracking-[0.2em] mb-2">{title}</p>
                    <p className="text-3xl font-black text-gray-900 tracking-tighter">₹{value.toLocaleString()}</p>
                    <p className="text-xs text-gray-600/60 mt-1 font-medium">{sub}</p>
                </div>
                <div className={`p-4 rounded-2xl bg-${color}-500/10 text-${color}-400 ring-1 ring-${color}-500/20`}>
                    <Icon className="w-6 h-6" />
                </div>
            </div>
        </div>
    );

    return (
        <div className="animate-in fade-in slide-in-from-right-8 duration-1000">
            {/* Header */}
            <div className="mb-12">
                <div className="flex items-center gap-3 mb-4">
                    <Droplets className="w-5 h-5 text-emerald-600" />
                    <span className="text-xs font-black text-emerald-700 uppercase tracking-[0.3em]">{t('liquidity_pulse')}</span>
                </div>
                <h2 className="text-5xl font-black text-gray-900 tracking-tighter leading-tight">
                    {lang === 'hi' ? 'नकद प्रवाह' : 'Cash Flow'} <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">{lang === 'hi' ? 'इंटेलिजेंस' : 'Intelligence'}</span>
                </h2>
                <p className="text-gray-600/60 mt-4 text-lg max-w-2xl font-medium leading-relaxed">
                    {lang === 'hi' ?
                        "पैसे कहाँ गए, यह सोचना छोड़ें। अपने व्यावसायिक परिवेश में आने और जाने वाले प्रत्येक रुपये पर नज़र रखें।" :
                        "Stop wondering where the money went. Track every rupee flowing in and out of your business ecosystem."}
                </p>
            </div>

            {/* Top Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                <StatCard
                    title={t('total_inflow')}
                    value={cash_flow.inflow}
                    sub={lang === 'hi' ? "इस अवधि में अर्जित राजस्व" : "Revenue captured this period"}
                    icon={ArrowUpCircle}
                    color="green"
                />
                <StatCard
                    title={t('total_outflow')}
                    value={cash_flow.outflow}
                    sub={lang === 'hi' ? "कुल खर्च और सूची" : "Total expenses & inventory"}
                    icon={ArrowDownCircle}
                    color="red"
                />
                <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-3xl p-8 shadow-2xl relative overflow-hidden group">
                    <div className="relative z-10">
                        <p className="text-[10px] text-white/60 font-black uppercase tracking-[0.2em] mb-2">{t('net_cash')}</p>
                        <p className="text-3xl font-black text-white tracking-tighter">₹{cash_flow.net.toLocaleString()}</p>
                        <div className="mt-4 flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full w-fit">
                            <BarChart3 className="w-3 h-3 text-white" />
                            <span className="text-[10px] font-black text-white uppercase">{cash_flow.net > 0 ? (lang === 'hi' ? 'अधिशेष' : 'Surplus') : (lang === 'hi' ? 'घाटा' : 'Deficit')}</span>
                        </div>
                    </div>
                    <div className="absolute right-0 bottom-0 p-4 opacity-10 group-hover:scale-125 transition-transform duration-700">
                        <Wallet className="w-24 h-24 text-gray-900" />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Outflow Breakdown Chart */}
                <div className="lg:col-span-8 bg-white/60 border border-gray-200 rounded-[2.5rem] p-10 shadow-2xl backdrop-blur-md">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xl font-black text-gray-900 tracking-tight uppercase">{t('outflow_breakdown')}</h3>
                        <div className="text-[10px] font-black text-emerald-700 uppercase tracking-widest bg-emerald-50 px-4 py-2 rounded-full border border-emerald-200">
                            {lang === 'hi' ? "पैसा कहाँ जाता है" : "Where the money goes"}
                        </div>
                    </div>

                    <div className="h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={cash_flow.categories} layout="vertical" margin={{ left: 40, right: 30 }}>
                                <XAxis type="number" hide />
                                <YAxis
                                    dataKey="name"
                                    type="category"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 'bold' }}
                                    width={120}
                                />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e5e7eb', borderRadius: '16px', fontSize: '12px' }}
                                    itemStyle={{ color: '#111827', fontWeight: 'bold' }}
                                    cursor={{ fill: 'transparent' }}
                                />
                                <Bar dataKey="value" radius={[0, 10, 10, 0]} barSize={40}>
                                    {cash_flow.categories.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-6 pt-10 border-t border-white/5">
                        {cash_flow.categories.map((cat, i) => (
                            <div key={i}>
                                <div className="flex items-center gap-2 mb-1">
                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }}></div>
                                    <span className="text-[10px] font-black text-gray-600/60 uppercase truncate">{cat.name}</span>
                                </div>
                                <p className="text-sm font-bold text-gray-900">₹{cat.value.toLocaleString()}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Survival Clock & Alerts */}
                <div className="lg:col-span-4 space-y-10">
                    <div className="bg-white border-2 border-emerald-200 rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden">
                        <div className="text-center">
                            <Clock className="w-10 h-10 text-emerald-600 mx-auto mb-6" />
                            <p className="text-xs font-black text-emerald-700 uppercase tracking-[0.3em] mb-4">{t('survival_runway')}</p>
                            <div className="text-7xl font-black text-emerald-700 tracking-tighter mb-2">
                                {cash_flow.survival_months}
                            </div>
                            <p className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-6">{t('months_left')}</p>
                            <div className="p-4 bg-white/5 rounded-2xl border border-white/5 text-[11px] text-gray-600 leading-relaxed font-semibold italic">
                                {lang === 'hi' ?
                                    `"यदि आपकी बिक्री आज पूरी तरह से बंद हो जाती है, तो आप अपनी वर्तमान बर्न दर के आधार पर ${cash_flow.survival_months} महीनों तक जीवित रह सकते हैं।"` :
                                    `"If your sales stop completely today, you can survive for ${cash_flow.survival_months} months based on your current burn rate."`}
                            </div>
                        </div>
                    </div>

                    <div className="bg-red-50 border border-red-200 rounded-[2.5rem] p-8 shadow-lg">
                        <div className="flex items-center gap-3 mb-6">
                            <AlertTriangle className="w-5 h-5 text-red-600" />
                            <h4 className="text-sm font-black text-red-800 uppercase tracking-tighter">{t('ai_risk_alerts')}</h4>
                        </div>
                        <div className="space-y-4">
                            {data.insights && data.insights.map((insight, idx) => (
                                <div key={idx} className="flex gap-4 items-start">
                                    <TrendingDown className="w-4 h-4 text-red-600 shrink-0 mt-1" />
                                    <p className="text-xs text-red-950 leading-relaxed font-bold">
                                        {insight}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Savings Advisor */}
            {data.savings && (
                <div className="mt-12 bg-white/40 border border-emerald-500/20 rounded-[2.5rem] p-10 backdrop-blur-md">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="p-4 bg-emerald-500/10 rounded-2xl text-emerald-600">
                            <Wallet className="w-8 h-8" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-black text-gray-900 tracking-tighter uppercase">{t('savings_title')}</h3>
                            <p className="text-xs text-gray-600/60 font-bold">{t('savings_desc')}</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {data.savings.map((action, i) => (
                            <div key={i} className="bg-white/40 border border-white/5 rounded-[2rem] p-8 hover:border-emerald-500/30 transition-all group">
                                <div className="flex justify-between items-start mb-6">
                                    <TrendingDown className="w-5 h-5 text-emerald-400 opacity-50" />
                                    <div className="text-right">
                                        <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest leading-none mb-1">{t('potential_savings')}</p>
                                        <p className="text-xl font-black text-emerald-600 tracking-tight">{action.savings}</p>
                                    </div>
                                </div>
                                <h4 className="font-black text-gray-900 uppercase text-sm mb-2">{action.title}</h4>
                                <p className="text-xs text-gray-900/60 leading-relaxed font-medium">
                                    {action.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CashFlowManager;

