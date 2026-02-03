import React from 'react';

const HealthGauge = React.memo(({ score, onClick, lang = 'en' }) => {
    // score is 0-100
    const radius = 50;
    const stroke = 8;
    const normalizedRadius = radius - stroke * 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDashoffset = circumference - (score / 100) * circumference;

    let color = "text-red-500";
    if (score > 50) color = "text-amber-500";
    if (score > 75) color = "text-emerald-500";

    return (
        <div
            onClick={onClick}
            className={`flex flex-col items-center justify-center p-6 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border border-emerald-200 shadow-lg ${onClick ? 'cursor-pointer hover:border-emerald-400 hover:shadow-xl transition-all group' : ''}`}
        >
            <div className="relative flex items-center justify-center">
                <svg
                    height={radius * 2}
                    width={radius * 2}
                    className="rotate-[-90deg] transition-all duration-500"
                >
                    <circle
                        stroke="currentColor"
                        strokeWidth={stroke}
                        fill="transparent"
                        r={normalizedRadius}
                        cx={radius}
                        cy={radius}
                        className="text-gray-200"
                    />
                    <circle
                        stroke="currentColor"
                        strokeWidth={stroke}
                        strokeDasharray={circumference + ' ' + circumference}
                        style={{ strokeDashoffset }}
                        strokeLinecap="round"
                        fill="transparent"
                        r={normalizedRadius}
                        cx={radius}
                        cy={radius}
                        className={color}
                    />
                </svg>
                <div className="absolute text-3xl font-bold font-mono text-gray-900">{score}</div>
            </div>
            <h3 className="mt-4 text-sm font-medium text-gray-700 uppercase tracking-wider">{lang === 'hi' ? 'स्वास्थ्य स्कोर' : 'Health Score'}</h3>
        </div>
    );
});

HealthGauge.displayName = 'HealthGauge';

export default HealthGauge;
