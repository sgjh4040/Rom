import React from 'react';

interface QualitativeInputProps {
    value: number; // 1 for Yes (Checked/Found), 0 for No (Normal)
    onChange: (val: number) => void;
    label: string;
}

// 질적 입력
export const QualitativeInput: React.FC<QualitativeInputProps> = ({
    value, onChange, label
}) => {
    return (
        <div className="qualitative-input">
            <h3 className="qualitative-label">{label}</h3>
            <div className="qualitative-options">
                <button
                    type="button"
                    className={`qualitative-btn ${value === 0 ? 'active' : ''}`}
                    onClick={() => onChange(0)}
                >
                    <span className="icon">✓</span>
                    <span className="text">정상 (없음)</span>
                </button>
                <button
                    type="button"
                    className={`qualitative-btn ${value === 1 ? 'active' : ''}`}
                    onClick={() => onChange(1)}
                >
                    <span className="icon">⚠</span>
                    <span className="text">발견 (있음)</span>
                </button>
            </div>

            <style>{`
                .qualitative-input {
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 20px;
                    padding: 2rem;
                    text-align: center;
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                }
                .qualitative-label {
                    font-size: 1.25rem;
                    margin-bottom: 2rem;
                    color: var(--text-primary);
                }
                .qualitative-options {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1rem;
                }
                .qualitative-btn {
                    background: var(--bg-card);
                    border: none;
                    border-radius: 16px;
                    padding: 1.5rem 1rem;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 0.75rem;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    box-shadow: 5px 5px 10px rgba(0,0,0,0.3), 
                                -5px -5px 10px rgba(255,255,255,0.05);
                    color: var(--text-secondary);
                }
                .qualitative-btn.active {
                    color: var(--primary-color);
                    box-shadow: inset 5px 5px 10px rgba(0,0,0,0.3), 
                                inset -5px -5px 10px rgba(255,255,255,0.05);
                    transform: scale(0.98);
                }
                .qualitative-btn .icon {
                    font-size: 1.5rem;
                }
                .qualitative-btn .text {
                    font-size: 0.9rem;
                    font-weight: 600;
                }
            `}</style>
        </div>
    );
};
