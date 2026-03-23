import React, { useEffect, useState } from 'react';
import type { Movement } from '../../../lib/romData';

// 각도 표시 패널
interface AngleDisplayPanelProps {
    activeMov: Movement | undefined;
    activeVal: number;
    handleChange: (val: number) => void;
}

export const AngleDisplayPanel: React.FC<AngleDisplayPanelProps> = ({
    activeMov,
    activeVal,
    handleChange
}) => {
    const maxVal = Math.max(180, activeMov?.normalRange ?? 180);
    const normalVal = activeMov?.normalRange ?? 0;

    const [displayVal, setDisplayVal] = useState(activeVal);
    useEffect(() => setDisplayVal(activeVal), [activeVal]);

    const isNormal = activeVal >= normalVal && normalVal > 0;
    const isActive = activeVal > 0;

    const valueClass = isNormal
        ? 'rom-angle__value rom-angle__value--normal'
        : isActive
            ? 'rom-angle__value rom-angle__value--active'
            : 'rom-angle__value';

    return (
        <>
            {/* Title */}
            <div className="rom-title">
                <h2 className="rom-title__name">{activeMov?.name ?? '동작 선택'}</h2>
                <div className="rom-title__badge">
                    <span className={isNormal ? 'rom-title__dot rom-title__dot--normal' : 'rom-title__dot'} />
                    <span>목표 각도: <strong>{normalVal}°</strong></span>
                </div>
            </div>

            {/* Giant Angle */}
            <div className="rom-angle">
                <span className={valueClass}>{displayVal}</span>
                <span className="rom-angle__unit">°</span>
                {isNormal && (
                    <span className="rom-angle__tag">
                        <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#34d399' }} />
                        정상
                    </span>
                )}
            </div>

            {/* Slider */}
            <div className="rom-slider">
                <input
                    type="range"
                    min="0"
                    max={maxVal}
                    value={activeVal}
                    onChange={(e) => handleChange(parseInt(e.target.value, 10) || 0)}
                    style={{
                        background: `linear-gradient(to right, ${isNormal ? '#34d399' : '#3b82f6'} 0%, ${isNormal ? '#34d399' : '#3b82f6'} ${(activeVal / maxVal) * 100}%, rgba(255,255,255,0.06) ${(activeVal / maxVal) * 100}%, rgba(255,255,255,0.06) 100%)`
                    }}
                />
                {normalVal > 0 && (
                    <div
                        className="rom-slider__marker"
                        style={{ left: `${(normalVal / maxVal) * 100}%` }}
                    />
                )}
                <div className="rom-slider__labels">
                    <span>0°</span>
                    <span>{maxVal}°</span>
                </div>
            </div>
        </>
    );
};
