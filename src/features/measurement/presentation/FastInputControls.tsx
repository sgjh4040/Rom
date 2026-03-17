import React, { useState } from 'react';
import { Camera } from 'lucide-react';
import { ImageAngleMeasurer } from '../../../core/components/ImageAngleMeasurer';
import type { Movement } from '../../../lib/romData';

interface FastInputControlsProps {
    activeMov: Movement | undefined;
    activeVal: number;
    handleFast: (pct: number) => void;
    handlePhoto: (angle: number) => void;
}

export const FastInputControls: React.FC<FastInputControlsProps> = ({
    activeMov,
    activeVal,
    handleFast,
    handlePhoto
}) => {
    const [showPhoto, setShowPhoto] = useState(false);

    const onPhotoConfirmed = (angle: number) => {
        handlePhoto(angle);
        setShowPhoto(false);
    };

    const maxVal = activeMov?.normalRange ?? 180;
    const isNormalSelected = activeVal === maxVal && activeVal > 0;

    return (
        <>
            {/* Segmented Control */}
            <div className="rom-seg">
                {[25, 50, 75].map(pct => {
                    const targetVal = Math.round((maxVal * pct) / 100);
                    const isSelected = activeVal === targetVal && activeVal > 0;

                    return (
                        <button
                            key={pct}
                            onClick={() => handleFast(pct)}
                            className={`rom-seg__btn ${isSelected ? 'rom-seg__btn--active' : ''}`}
                        >
                            {pct}%
                        </button>
                    );
                })}
                <button
                    onClick={() => handleFast(100)}
                    className={`rom-seg__btn ${isNormalSelected ? 'rom-seg__btn--normal' : ''}`}
                >
                    목표치
                </button>
            </div>

            {/* Photo Button */}
            <button
                onClick={() => setShowPhoto(!showPhoto)}
                className={`rom-photo-btn ${showPhoto ? 'rom-photo-btn--open' : ''}`}
            >
                <Camera style={{ width: 18, height: 18 }} />
                {showPhoto ? '사진 분석기 닫기' : '카메라로 정밀 분석하기'}
            </button>

            {showPhoto && (
                <div className="rom-photo-wrap">
                    <ImageAngleMeasurer onAngleConfirmed={onPhotoConfirmed} />
                </div>
            )}
        </>
    );
};
