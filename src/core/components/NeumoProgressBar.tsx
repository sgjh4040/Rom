import React from 'react';
import '../../styles/neumorphism.css';

interface NeumoProgressBarProps {
    label: string;
    percentage: number;
    gradient?: string;
}

export const NeumoProgressBar: React.FC<NeumoProgressBarProps> = ({
    label,
    percentage,
    gradient = 'var(--grad-relax)'
}) => {
    return (
        <div className="flex flex-col items-center gap-6 flex-shrink-0" style={{ margin: '0 30px' }}>
            <div
                className="neumo-inset relative flex flex-col justify-end overflow-hidden"
                style={{ width: 85, height: 240, padding: 8, borderRadius: '24px' }}
            >
                <div
                    className="w-full rounded-2xl transition-all duration-500 ease-out"
                    style={{
                        height: `${percentage}%`,
                        background: gradient,
                        boxShadow: '0 0 20px rgba(0,0,0,0.2)'
                    }}
                />
            </div>
            <div className="text-center">
                <p className="text-lg font-black opacity-75">{label}</p>
                <p className="text-3xl font-black">{percentage}%</p>
            </div>
        </div>
    );
};
