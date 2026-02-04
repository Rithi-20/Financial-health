import React, { useEffect, useState } from 'react';
import { fetchMetrics, downloadReport, fetchNotifications } from '../api';
import HealthGauge from './HealthGauge';
import FileUploader from './FileUploader';
import HealthScoreDetails from './HealthScoreDetails';
import CashFlowManager from './CashFlowManager';
import RiskRadar from './RiskRadar';
import FundingHub from './FundingHub';
import IndustryComparison from './IndustryComparison';
import SetuSync from './SetuSync';
import { translations } from '../translations';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import {
    Activity,
    AlertTriangle,
    TrendingUp,
    Wallet,
    CheckCircle,
    Upload,
    FileText,
    XCircle,
    RefreshCcw,
    Bell,
    FileDown,
    Calendar,
    Sigma,
    ArrowRight,
    Droplets,
    ShieldAlert,
    Radar,
    HandCoins,
    Globe,
    Languages,
    Cpu
} from 'lucide-react';

const Dashboard = ({ user, onLogout }) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitted, setSubmitted] = useState(false);
    const [activeTab, setActiveTab] = useState('overview');
    const [notifications, setNotifications] = useState([]);
    const [showNotifs, setShowNotifs] = useState(false);
    const [lang, setLang] = useState('en');
    const t = (key) => translations[lang][key] || translations['en'][key] || key;

    const [uploads, setUploads] = useState({
        bank: false,
        accounting: false,
        gst: false
    });

    useEffect(() => {
        const load = async () => {
            try {
                const [metricsRes, notifsRes] = await Promise.all([
                    fetchMetrics(),
                    fetchNotifications()
                ]);

                if (metricsRes) {
                    setData(metricsRes);
                    if (metricsRes.has_any_data) {
                        setSubmitted(true);
                    }
                }
                setNotifications(notifsRes || []);
            } catch (e) {
                console.error("Fetch Error:", e);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const handleUploadSuccess = (type) => {
        setUploads(prev => ({ ...prev, [type]: true }));
    };

    const [downloading, setDownloading] = useState(false);

    const handleDownload = async () => {
        try {
            setDownloading(true);
            await downloadReport();
        } catch (e) {
            alert("Report generation failed. Please ensure you have uploaded documents.");
        } finally {
            setDownloading(false);
        }
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const res = await fetchMetrics();
            setData(res);
            setSubmitted(true);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-10 text-center">
            <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-xl font-semibold text-gray-900">Processing Financial Intelligence...</p>
        </div>
    );

    const allUploaded = uploads.bank && uploads.accounting && uploads.gst;
    const chartData = data?.forecast?.months?.map((m, i) => ({
        name: m,
        cash: data.forecast.values?.[i] || 0,
        upper: data.forecast.upper?.[i] || 0,
        lower: data.forecast.lower?.[i] || 0
    })) || [];

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 flex font-sans selection:bg-emerald-500 selection:text-white relative h-screen overflow-hidden">
            {/* Sidebar Left */}
            {submitted && (
                <div className="w-64 bg-white border-r border-gray-200 flex flex-col p-6 gap-8 shadow-xl">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center font-bold text-white shadow-lg">H</div>
                        <span className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Health Engine</span>
                    </div>

                    <nav className="flex flex-col gap-2">
                        <button
                            onClick={() => setActiveTab('overview')}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'overview' ? 'bg-emerald-600 text-white shadow-lg' : 'text-gray-700 hover:bg-emerald-50 hover:text-emerald-700'}`}
                        >
                            <Activity className="w-5 h-5" />
                            <span className="font-semibold text-sm">{t('overview')}</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('health-score')}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'health-score' ? 'bg-emerald-600 text-white shadow-lg' : 'text-gray-700 hover:bg-emerald-50 hover:text-emerald-700'}`}
                        >
                            <TrendingUp className="w-5 h-5" />
                            <span className="font-semibold text-sm">{t('health_score')}</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('cash-flow')}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'cash-flow' ? 'bg-emerald-600 text-white shadow-lg' : 'text-gray-700 hover:bg-emerald-50 hover:text-emerald-700'}`}
                        >
                            <Droplets className="w-5 h-5" />
                            <span className="font-semibold text-sm">{t('cash_flow')}</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('risk-radar')}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'risk-radar' ? 'bg-emerald-600 text-white shadow-lg' : 'text-gray-700 hover:bg-emerald-50 hover:text-emerald-700'}`}
                        >
                            <Radar className="w-5 h-5" />
                            <span className="font-semibold text-sm">{t('risk_radar')}</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('funding')}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'funding' ? 'bg-emerald-600 text-white shadow-lg' : 'text-gray-700 hover:bg-emerald-50 hover:text-emerald-700'}`}
                        >
                            <HandCoins className="w-5 h-5" />
                            <span className="font-semibold text-sm">{t('funding')}</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('benchmarking')}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'benchmarking' ? 'bg-emerald-600 text-white shadow-lg' : 'text-gray-700 hover:bg-emerald-50 hover:text-emerald-700'}`}
                        >
                            <Globe className="w-5 h-5" />
                            <span className="font-semibold text-sm">{t('benchmarking')}</span>
                        </button>
                    </nav>

                    <div className="mt-auto p-4 bg-emerald-50 rounded-2xl border border-emerald-200">
                        <p className="text-[10px] text-emerald-700 font-bold uppercase mb-2">{t('security_status')}</p>
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-[10px] text-emerald-600 font-medium">
                                <ShieldAlert className="w-3 h-3" />
                                <span>{data?.compliance?.encryption || 'AES-256 Secured'}</span>
                            </div>
                            <div className="flex items-center gap-2 text-[10px] text-emerald-600 font-medium">
                                <CheckCircle className="w-3 h-3" />
                                <span>{data?.compliance?.regulatory || 'RBI/DPDP Compliant'}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                <header className="flex-shrink-0 flex justify-between items-center bg-white px-8 py-5 border-b border-gray-200 sticky top-0 z-50 shadow-sm">
                    <div className="flex items-center gap-6">
                        {!submitted && (
                            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                                <span className="text-white font-bold text-xl uppercase">{user?.company_name?.[0] || 'F'}</span>
                            </div>
                        )}
                        <div>
                            <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                                {activeTab === 'overview' ? t('dashboard') : activeTab === 'health-score' ? t('health_score') : activeTab === 'cash-flow' ? t('cash_flow') : activeTab === 'risk-radar' ? t('risk_radar') : activeTab === 'funding' ? t('funding') : t('benchmarking')}
                            </h1>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-gray-700 font-medium">{user?.full_name}</span>
                                <span className="text-gray-400">•</span>
                                <span className="text-emerald-600 text-sm font-semibold">{user?.company_name}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setSubmitted(false)}
                            className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-100 transition-all border border-emerald-200 shadow-lg group relative"
                            title="Update Data"
                        >
                            <Upload className="w-5 h-5" />
                            <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Update Files</span>
                        </button>

                        <div className="relative">
                            <button onClick={() => setShowNotifs(!showNotifs)} className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-100 transition-all border border-emerald-200 shadow-lg">
                                <Bell className="w-5 h-5" />
                                {notifications.length > 0 && (
                                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse border-2 border-slate-900">
                                        {notifications.length}
                                    </span>
                                )}
                            </button>
                            {showNotifs && (
                                <div className="absolute right-0 mt-3 w-80 bg-white border border-emerald-200 rounded-2xl shadow-2xl p-4 z-[100]">
                                    <h4 className="text-gray-900 font-bold mb-3 flex items-center gap-2"><Calendar className="w-4 h-4 text-emerald-600" /> Deadlines</h4>
                                    <div className="space-y-3">
                                        {notifications.map(n => (
                                            <div key={n.id} className="p-3 bg-emerald-50 rounded-xl border border-gray-200">
                                                <p className="text-xs font-bold text-gray-700">{n.title}</p>
                                                <p className="text-[10px] text-gray-600">{n.message}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <button onClick={handleDownload} disabled={downloading} className={`flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-600/20 to-teal-600/20 text-emerald-600 font-bold rounded-xl transition-all border border-emerald-500/30 shadow-lg ${downloading ? 'opacity-50' : ''}`}>
                            <FileDown className="w-4 h-4" />
                            <span className="text-sm">{downloading ? 'Generating...' : t('download_report')}</span>
                        </button>

                        <button onClick={onLogout} className="px-5 py-2.5 bg-red-900/10 hover:bg-red-500 hover:text-white text-red-700 rounded-xl text-sm font-bold transition-all border border-red-500/20 shadow-lg">
                            {t('logout')}
                        </button>

                        <button onClick={() => setLang(lang === 'en' ? 'hi' : 'en')} className="p-2.5 bg-gray-100 text-gray-600 rounded-xl flex items-center gap-2 hover:bg-gray-200 transition-all border border-gray-200">
                            <Languages className="w-5 h-5" />
                            <span className="text-xs font-bold uppercase">{lang}</span>
                        </button>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-8">
                    {!submitted ? (
                        <div className="max-w-4xl mx-auto py-12">
                            <div className="text-center mb-12 animate-in fade-in slide-in-from-top-4 duration-1000">
                                <div className="w-20 h-20 bg-emerald-500/10 rounded-3xl flex items-center justify-center mx-auto mb-6 rotate-3">
                                    <Cpu className="w-10 h-10 text-emerald-600" />
                                </div>
                                <h2 className="text-5xl font-black text-gray-900 mb-6 tracking-tighter leading-tight">{t('welcome')}</h2>
                                <p className="text-gray-600 text-xl max-w-2xl mx-auto font-medium leading-relaxed">{t('upload_docs')}</p>

                                {data && (
                                    <button
                                        onClick={() => setSubmitted(true)}
                                        className="mt-8 flex items-center gap-2 mx-auto text-emerald-600 font-bold hover:text-emerald-700 transition-all px-4 py-2 rounded-lg border border-emerald-200 bg-emerald-50 shadow-sm"
                                    >
                                        <ArrowRight className="w-4 h-4 rotate-180" />
                                        Back to Dashboard
                                    </button>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                                <FileUploader label={`1. ${t('bank_statement')}`} type="bank" isUploaded={uploads.bank} onSuccess={() => handleUploadSuccess('bank')} />
                                <FileUploader label={`2. ${t('accounting_data')}`} type="accounting" isUploaded={uploads.accounting} onSuccess={() => handleUploadSuccess('accounting')} />
                                <FileUploader label={`3. ${t('gst_returns')}`} type="gst" isUploaded={uploads.gst} onSuccess={() => handleUploadSuccess('gst')} />
                                <div className="md:col-span-1">
                                    <SetuSync lang={lang} t={t} />
                                </div>
                            </div>

                            <div className="flex justify-center">
                                <button
                                    onClick={handleSubmit}
                                    disabled={!uploads.bank || !uploads.accounting || !uploads.gst}
                                    className="px-12 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-2xl transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-xl text-lg"
                                >
                                    {t('calculate')}
                                </button>
                            </div>
                        </div>
                    ) : (
                        activeTab === 'overview' ? (
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                                <div className="space-y-6">
                                    <HealthGauge score={data?.health_score?.value || 0} onClick={() => setActiveTab('health-score')} lang={lang} />
                                    <div className="bg-white p-6 rounded-xl border border-emerald-200 shadow-lg">
                                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><Wallet className="w-5 h-5 text-emerald-600" /> {lang === 'hi' ? 'व्यवसाय स्वास्थ्य' : 'Business Health'}</h3>
                                        <div className="space-y-4">
                                            <div className="flex justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                                                <span className="text-sm text-gray-600">{t('solvency_simple')}</span>
                                                <span className="font-mono font-bold text-gray-900">{data?.health_score?.label || 'Good'}</span>
                                            </div>
                                            <div className="flex justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                                                <span className="text-sm text-gray-600">{t('profit_simple')}</span>
                                                <span className={`font-mono font-bold ${data?.ratios?.net_margin >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>{((data?.ratios?.net_margin || 0) * 100).toFixed(1)}%</span>
                                            </div>
                                        </div>
                                    </div>
                                    <SetuSync lang={lang} t={t} />
                                </div>

                                <div className="lg:col-span-2 space-y-6">
                                    <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-2xl relative group">
                                        <h3 className="text-xl font-bold mb-6 flex items-center gap-2"><Activity className="w-5 h-5 text-emerald-600" /> {lang === 'hi' ? 'नकद प्रवाह प्रक्षेपण' : 'Cash Flow Projection'}</h3>
                                        <div className="h-[250px] w-full min-w-0">
                                            <ResponsiveContainer width="100%" height="100%" minHeight={250}>
                                                <LineChart data={chartData}>
                                                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                                                    <YAxis stroke="#94a3b8" fontSize={12} tickFormatter={(v) => `₹${v / 1000}k`} />
                                                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px', color: '#fff' }} />

                                                    {/* Confidence Interval Lines */}
                                                    <Line type="monotone" dataKey="upper" stroke="#10b981" strokeWidth={1} strokeDasharray="5 5" dot={false} opacity={0.3} />
                                                    <Line type="monotone" dataKey="lower" stroke="#10b981" strokeWidth={1} strokeDasharray="5 5" dot={false} opacity={0.3} />

                                                    <Line type="monotone" dataKey="cash" stroke="#10b981" strokeWidth={4} dot={{ fill: '#10b981', r: 6 }} />
                                                </LineChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>

                                    <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-lg">
                                        <h4 className="text-lg font-bold text-emerald-600 uppercase mb-6 tracking-widest flex items-center gap-2"><FileText className="w-5 h-5" /> {lang === 'hi' ? 'एआई अवलोकन और जोखिम अलर्ट' : 'AI Observations & Risk Alerts'}</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {data?.insights?.map((insight, i) => (
                                                <div key={i} className="flex gap-3 p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                                                    <div className="mt-1.5 w-2 h-2 bg-emerald-500 rounded-full shrink-0"></div>
                                                    <p className="text-sm text-gray-900 leading-relaxed font-medium">{insight}</p>
                                                </div>
                                            ))}
                                            {data?.anomalies?.map((anomaly, i) => (
                                                <div key={`anom-${i}`} className="flex gap-3 p-4 bg-red-50 rounded-xl border border-red-200">
                                                    <AlertTriangle className="w-5 h-5 text-red-700 shrink-0 mt-1" />
                                                    <p className="text-sm text-red-800 leading-relaxed font-semibold">{anomaly.description || anomaly}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : activeTab === 'health-score' ? (
                            <HealthScoreDetails data={data} lang={lang} />
                        ) : activeTab === 'cash-flow' ? (
                            <CashFlowManager data={data} lang={lang} />
                        ) : activeTab === 'risk-radar' ? (
                            <RiskRadar data={data} lang={lang} />
                        ) : activeTab === 'funding' ? (
                            <FundingHub data={data} lang={lang} />
                        ) : activeTab === 'benchmarking' ? (
                            <IndustryComparison data={data} lang={lang} />
                        ) : (
                            <div className="p-8 text-center bg-white rounded-2xl border border-gray-200">
                                <h2 className="text-xl font-bold">Select a tab to view details</h2>
                            </div>
                        )
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
