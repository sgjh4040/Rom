import React from 'react';
import '../../styles/neumorphism.css';

interface NeumoToggleProps {
    label: string;
    isOn: boolean;
    onToggle: () => void;
}

export const NeumoToggle: React.FC<NeumoToggleProps> = ({
    label,
    isOn,
    onToggle
}) => {
    return (
        <div className="flex flex-col items-center gap-2">
            <div
                className={`neumo-card relative flex items-center p-1 transition-all duration-300`}
                style={{ width: 80, height: 40, cursor: 'pointer', borderRadius: 20 }}
                onClick={onToggle}
            >
                <div
                    className={`absolute h-8 w-8 rounded-full transition-all duration-300 flex items-center justify-center`}
                    style={{
                        left: isOn ? 'calc(100% - 36px)' : '4px',
                        background: 'var(--neumo-bg)',
                        boxShadow: '2px 2px 5px var(--neumo-shadow-dark), -2px -2px 5px var(--neumo-shadow-light)',
                        color: isOn ? 'var(--neumo-accent)' : 'var(--text-muted)'
                    }}
                >
                    <div style={{ width: 4, height: 4, borderRadius: '50%', background: 'currentColor', boxShadow: '6px 0 0 currentColor, 0 6px 0 currentColor, 6px 6px 0 currentColor' }} />
                </div>
            </div>
            <span className="text-xs font-bold opacity-60 uppercase tracking-widest">{label}</span>
        </div>
    );
};
