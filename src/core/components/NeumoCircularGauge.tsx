import React from 'react';
import '../../styles/neumorphism.css';

interface NeumoCircularGaugeProps {
    percentage: number;
    size?: number;
    strokeWidth?: number;
}

export const NeumoCircularGauge: React.FC<NeumoCircularGaugeProps> = ({
    percentage,
    size = 200,
    strokeWidth = 20
}) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (percentage / 100) * circumference;

    return (
        <div className="flex flex-col items-center justify-center w-full h-full">
            <div
                className="neumo-card flex items-center justify-center relative"
                style={{ 
                    width: '100%', 
                    maxWidth: '220px', 
                    minWidth: '120px', 
                    aspectRatio: '1 / 1',
                    padding: '8%' // 반응형 여백
                }}
            >
                <svg viewBox={`0 0 ${size} ${size}`} width="100%" height="100%" className="transform -rotate-90">
                    {/* Background circle (inset look) */}
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        stroke="var(--neumo-shadow-dark)"
                        strokeWidth={strokeWidth}
                        fill="transparent"
                        style={{ opacity: 0.1 }}
                    />
                    {/* Progress circle */}
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        stroke="url(#gradient)"
                        strokeWidth={strokeWidth}
                        fill="transparent"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        strokeLinecap="round"
                        style={{ transition: 'stroke-dashoffset 0.5s ease' }}
                    />
                    <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#8e84ff" />
                            <stop offset="100%" stopColor="#6d5dfc" />
                        </linearGradient>
                    </defs>
                </svg>
                <div className="absolute flex flex-col items-center">
                    <span className="font-bold" style={{ color: 'var(--neumo-accent)', fontSize: 'clamp(1.2rem, 5vw, 2rem)' }}>{percentage}%</span>
                </div>
            </div>
        </div>
    );
};
