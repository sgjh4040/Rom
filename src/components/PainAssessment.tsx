import React from 'react';

interface PainAssessmentProps {
    painArea: string;
    setPainArea: (val: string) => void;
    vasScore: number;
    setVasScore: (val: number) => void;
}

export const PainAssessment: React.FC<PainAssessmentProps> = ({
    painArea, setPainArea, vasScore, setVasScore
}) => {
    return (
        <div className="neumorphic-container">
            <div className="form-group mb-4">
                <label className="form-label" style={{ color: 'var(--primary)', fontWeight: 700 }}>통증 부위</label>
                <input
                    type="text"
                    className="form-input"
                    style={{ background: '#e0e0e0', border: 'none', boxShadow: 'inset 2px 2px 5px #bebebe, inset -2px -2px 5px #ffffff' }}
                    placeholder="예: 오른쪽 어깨"
                    value={painArea}
                    onChange={(e) => setPainArea(e.target.value)}
                />
            </div>

            <div className="form-group">
                <label className="form-label" style={{ color: 'var(--primary)', fontWeight: 700 }}>
                    통증 지수 (VAS)
                </label>

                <div className="vas-indicator-neumorphic mb-4">
                    {vasScore}
                </div>

                <input
                    type="range"
                    min="0"
                    max="10"
                    step="1"
                    className="vas-slider-neumorphic"
                    value={vasScore}
                    onChange={(e) => setVasScore(parseInt(e.target.value, 10))}
                />

                <div className="flex justify-between text-xs font-bold px-2" style={{ color: 'var(--text-secondary)' }}>
                    <span>무통 (0)</span>
                    <span>중간 (5)</span>
                    <span>극심 (10)</span>
                </div>
            </div>
        </div>
    );
};
