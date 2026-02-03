import React from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Cell
} from 'recharts';
import { Globe, TrendingUp, Info, AlertCircle } from 'lucide-react';
import { translations } from '../translations';

const IndustryComparison = React.memo(({ data, lang = 'en' }) => {
    if (!data?.benchmarks) return null;
    const { industry, comparisons } = data.benchmarks;
    const t = (key) => translations[lang][key] || translations['en'][key] || key;

    const translatedComparisons = React.useMemo(() =>
        comparisons.map(c => ({
            ...c,
            metric: c.metric === 'Net Margin' ? (lang === 'hi' ? 'नेट मार्जिन' : 'Net Margin') :
                c.metric === 'DSCR' ? (lang === 'hi' ? 'डीएससीआर' : 'DSCR') :
                    c.metric === 'Quick Ratio' ? (lang === 'hi' ? 'क्विक रेशियो' : 'Quick Ratio') : c.metric
        })), [comparisons, lang]
    );

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <div className="flex items-center gap-3 mb-4">
                    <Globe className="w-5 h-5 text-emerald-600" />
                    <span className="text-xs font-black text-emerald-700 uppercase tracking-[0.3em]">{t('market_context')}</span>
                </div>
                <h2 className="text-5xl font-black text-gray-900 tracking-tighter leading-tight">
                    {lang === 'hi' ? 'उद्योग' : 'Industry'} <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">{lang === 'hi' ? 'बेंचमार्किंग' : 'Benchmarking'}</span>
                </h2>
                <div className="flex items-center gap-3 mt-4">
                    <span className="px-4 py-1.5 bg-emerald-50 border border-emerald-200 rounded-full text-emerald-700 text-[10px] font-black uppercase tracking-widest">{t('sector')}: {industry}</span>
                </div>
                <p className="text-gray-600 mt-4 text-lg max-w-2xl font-medium leading-relaxed">
                    {lang === 'hi' ?
                        `हमने ${industry} क्षेत्र में हजारों समान व्यवसायों की तुलना में आपके प्रदर्शन का विश्लेषण किया है।` :
                        `We've analyzed your performance compared to thousands of similar businesses in the ${industry} sector.`}
                </p>
            </div>

            {/* Explanation Banner */}
            <div className="bg-emerald-50 border-l-4 border-emerald-500 p-6 rounded-lg">
                <div className="flex items-start gap-4">
                    <AlertCircle className="w-6 h-6 text-emerald-600 shrink-0 mt-1" />
                    <div>
                        <h3 className="text-sm font-black text-emerald-900 uppercase mb-2">
                            {lang === 'hi' ? 'तुलना कैसे काम करती है' : 'How Comparison Works'}
                        </h3>
                        <p className="text-sm text-emerald-800 leading-relaxed">
                            {lang === 'hi' ?
                                `हरी पट्टियाँ आपके वास्तविक प्रदर्शन को दर्शाती हैं। बैंगनी पट्टियाँ ${industry} क्षेत्र में हजारों व्यवसायों का औसत दर्शाती हैं। नकारात्मक मान (नीचे की ओर) का मतलब है कि आप वर्तमान में घाटे में चल रहे हैं या उद्योग औसत से कम हैं।` :
                                `Green bars show YOUR actual performance. Purple bars show the average of thousands of businesses in the ${industry} sector. Negative values (pointing down) mean you're currently operating at a loss or below industry average in that metric.`}
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Graph Area */}
                <div className="lg:col-span-8 bg-white border border-gray-200 rounded-3xl p-10 shadow-lg">
                    <div className="h-[400px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={translatedComparisons} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                                <XAxis
                                    dataKey="metric"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#6b7280', fontSize: 10, fontWeight: 900 }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#6b7280', fontSize: 10, fontWeight: 900 }}
                                />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '16px', fontSize: '10px' }}
                                    itemStyle={{ fontWeight: 900, textTransform: 'uppercase' }}
                                />
                                <Legend
                                    wrapperStyle={{ paddingTop: '20px', fontSize: '10px', fontWeight: 900, textTransform: 'uppercase' }}
                                />
                                <Bar dataKey="user" name={t('your_perf')} fill="#10b981" radius={[4, 4, 0, 0]} barSize={40} />
                                <Bar dataKey="industry" name={t('ind_avg')} fill="#a855f7" radius={[4, 4, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Insights Area */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-3xl p-8">
                        <TrendingUp className="w-8 h-8 text-emerald-600 mb-6" />
                        <h4 className="text-xl font-black text-gray-900 tracking-tight leading-tight mb-4 uppercase">{t('growth_snapshot')}</h4>
                        <div className="space-y-6">
                            {translatedComparisons.map((c, i) => {
                                const diff = c.user - c.industry;
                                return (
                                    <div key={i} className="flex justify-between items-center pb-4 border-b border-emerald-200 last:border-0">
                                        <div>
                                            <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">{c.metric}</p>
                                            <p className={`text-xs font-black mt-1 ${diff >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                                                {diff >= 0 ? '+' : ''}{diff.toFixed(1)}{c.metric.includes('Margin') ? '%' : ''} {t('vs_market')}
                                            </p>
                                        </div>
                                        <div className={`w-2 h-2 rounded-full ${diff >= 0 ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-3xl p-8">
                        <div className="flex items-start gap-4">
                            <Info className="w-5 h-5 text-emerald-600 shrink-0 mt-1" />
                            <p className="text-[11px] text-gray-600 leading-relaxed font-semibold">
                                {lang === 'hi' ?
                                    `${industry} क्षेत्र में उद्योग औसत सार्वजनिक रूप से कारोबार करने वाली फर्मों और अज्ञात SME डेटासेट से एकत्रित किए गए हैं।` :
                                    `Industry averages are aggregated from publicly traded firms and anonymized SME datasets in the ${industry} sector.`}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
});

IndustryComparison.displayName = 'IndustryComparison';

export default IndustryComparison;
