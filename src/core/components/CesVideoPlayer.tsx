// CesVideoPlayer.tsx — A 영역: 영상 플레이어 (PRD 4-0: 200줄 이하)
import React, { useRef, useEffect } from 'react';

interface CesVideoPlayerProps {
    videoUrl: string;
    nextVideoUrl?: string;
    exerciseName: string;
}

const PLACEHOLDER_COLORS: Record<number, string> = {
    0: '#1a1a2e', 1: '#16213e', 2: '#0f3460', 3: '#533483',
};

export const CesVideoPlayer: React.FC<CesVideoPlayerProps> = ({
    videoUrl, nextVideoUrl, exerciseName,
}) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    // 영상 URL 변경 시 처음부터 재생
    useEffect(() => {
        if (videoRef.current && videoUrl) {
            videoRef.current.load();
            void videoRef.current.play();
        }
    }, [videoUrl]);

    const bgIdx = Math.abs(exerciseName.charCodeAt(0)) % 4;
    const bgColor = PLACEHOLDER_COLORS[bgIdx] ?? '#1a1a2e';

    return (
        <div style={{ position: 'relative', width: '100%', background: bgColor, borderRadius: '12px', overflow: 'hidden', aspectRatio: '16/9' }}>
            {videoUrl ? (
                <video
                    ref={videoRef}
                    autoPlay
                    loop
                    muted
                    playsInline
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                >
                    <source src={videoUrl} type="video/mp4" />
                </video>
            ) : (
                /* 영상 없을 때 플레이스홀더 */
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '1rem' }}>
                    <div style={{ fontSize: '3.5rem' }}>🎬</div>
                    <p style={{ color: 'rgba(255,255,255,0.7)', fontWeight: 700, fontSize: '1rem', textAlign: 'center', padding: '0 1rem' }}>
                        {exerciseName}
                    </p>
                    <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem' }}>영상 준비 중</p>
                </div>
            )}

            {/* 다음 영상 pre-loading (숨김 video 태그) */}
            {nextVideoUrl && (
                <video style={{ display: 'none' }} preload="auto" muted>
                    <source src={nextVideoUrl} type="video/mp4" />
                </video>
            )}
        </div>
    );
};
