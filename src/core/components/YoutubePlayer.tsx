import React, { useState } from 'react';

interface Props {
    /** YouTube 영상 ID (youtu.be 또는 youtube.com/watch?v= 뒤의 값) */
    youtubeId: string;
    title?: string;
}

/** 유튜브 플레이어 — youtubeId가 비어있으면 업로드 안내 플레이스홀더 표시 */
export const YoutubePlayer: React.FC<Props> = ({ youtubeId, title }) => {
    const [loaded, setLoaded] = useState(false);

    if (!youtubeId) {
        return (
            <div style={{
                width: '100%', aspectRatio: '16/9',
                backgroundColor: 'var(--bg-color)',
                border: '2px dashed var(--border-color)',
                borderRadius: '10px',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                color: 'var(--text-secondary)', gap: '0.5rem',
            }}>
                <span style={{ fontSize: '2rem' }}>🎬</span>
                <p style={{ fontSize: '0.875rem', textAlign: 'center', lineHeight: 1.5 }}>
                    영상 준비 중<br />
                    <span style={{ fontSize: '0.75rem' }}>유튜브 업로드 후 youtubeId를 입력하면 표시됩니다</span>
                </p>
            </div>
        );
    }

    return (
        <div style={{ width: '100%', aspectRatio: '16/9', borderRadius: '10px', overflow: 'hidden', position: 'relative', backgroundColor: '#000' }}>
            {!loaded && (
                <div style={{
                    position: 'absolute', inset: 0, display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                    backgroundColor: 'var(--bg-color)',
                }}>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>로딩 중...</span>
                </div>
            )}
            <iframe
                src={`https://www.youtube.com/embed/${youtubeId}?rel=0`}
                title={title ?? '운동 영상'}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                onLoad={() => setLoaded(true)}
                style={{ width: '100%', height: '100%', border: 'none' }}
            />
        </div>
    );
};
