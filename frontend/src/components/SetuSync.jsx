import React, { useState, useEffect } from 'react';
import { ShieldCheck, RefreshCw, Smartphone, CheckCircle2, ExternalLink } from 'lucide-react';
import api from '../api';

const SetuSync = ({ lang, t }) => {
    const [vua, setVua] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [status, setStatus] = useState('NONE'); // NONE, PENDING, ACTIVE
    const [consentUrl, setConsentUrl] = useState(null);

    // Check status on mount and poll if pending
    useEffect(() => {
        let interval;
        const checkStatus = async () => {
            try {
                const data = await api.get('/banking/setu/status').then(r => r.data);
                setStatus(data.status);
                if (data.url) setConsentUrl(data.url);
                if (data.status === 'ACTIVE') {
                    clearInterval(interval);
                }
            } catch (e) {
                console.error("Status check failed", e);
            }
        };

        checkStatus();

        if (status === 'PENDING' || status === 'NONE') {
            interval = setInterval(checkStatus, 3000);
        }

        return () => clearInterval(interval);
    }, [status]);

    const handleConnect = async () => {
        if (!vua) return;
        setLoading(true);
        try {
            const data = await api.post('/banking/setu/initiate', { vua }).then(r => r.data);

            if (data.url) {
                setConsentUrl(data.url);
                window.open(data.url, '_blank');
                setStatus('PENDING');
            }
        } catch (e) {
            const errorMsg = e.response?.data?.detail || e.message || "Connection failed";
            setError(errorMsg);
        }
        setLoading(false);
    };

    const handleReset = async () => {
        try {
            await api.post('/banking/setu/reset');
            setStatus('NONE');
            setVua('');
            setConsentUrl(null);
        } catch (e) {
            console.error("Reset failed", e);
        }
    };

    if (status === 'ACTIVE') {
        return (
            <div className="bg-white p-6 rounded-[2.5rem] border border-emerald-200 shadow-xl flex items-center justify-between group">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
                        <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div>
                        <h4 className="text-sm font-black text-gray-900 uppercase tracking-tight">{t('live_banking')}</h4>
                        <p className="text-[10px] text-emerald-600 font-black uppercase tracking-widest">{t('connected')}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 text-[10px] font-black rounded-xl uppercase tracking-widest border border-emerald-100 italic">
                    <RefreshCw className="w-3 h-3 animate-spin-slow" />
                    Real-time
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white p-6 rounded-[2.5rem] border border-emerald-100 shadow-xl hover:border-emerald-300 transition-all group overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <ShieldCheck className="w-20 h-20 text-emerald-600" />
            </div>

            <div className="flex flex-col gap-4 relative z-10">
                <div className="flex items-center justify-between">
                    <h4 className="text-sm font-black text-gray-900 uppercase tracking-tight flex items-center gap-2">
                        <Smartphone className="w-4 h-4 text-emerald-600" />
                        {t('live_banking')}
                    </h4>
                    <span className="text-[8px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-black uppercase tracking-widest animate-pulse">Alpha</span>
                </div>

                <p className="text-[10px] text-gray-600 font-medium leading-relaxed max-w-[200px]">
                    {t('live_banking_desc')}
                </p>

                {status === 'PENDING' ? (
                    <div className="space-y-3">
                        <div className="text-[10px] font-black text-amber-600 bg-amber-50 p-3 rounded-xl border border-amber-100 flex items-center gap-2">
                            <RefreshCw className="w-3 h-3 animate-spin" />
                            Awaiting Approval...
                        </div>
                        <a
                            href={consentUrl || '#'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-xl transition-all flex items-center justify-center gap-2"
                        >
                            Open Consent <ExternalLink className="w-3 h-3" />
                        </a>
                        <button
                            onClick={handleReset}
                            className="w-full text-[9px] text-gray-400 font-bold hover:text-emerald-600 transition-all uppercase tracking-widest"
                        >
                            ← Try Another ID / Restart
                        </button>
                    </div>
                ) : (
                    <div className="space-y-3">
                        <input
                            type="text"
                            placeholder={t('vua_placeholder')}
                            value={vua}
                            onChange={(e) => setVua(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-[10px] font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 placeholder:text-gray-300"
                        />
                        <button
                            onClick={handleConnect}
                            disabled={loading || !vua}
                            className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-xl transition-all disabled:opacity-50 shadow-lg shadow-emerald-500/20 active:scale-95"
                        >
                            {loading ? 'Initializing...' : t('connect_bank')}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SetuSync;
