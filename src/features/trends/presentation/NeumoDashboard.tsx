import React from 'react';
import { NeumoCircularGauge } from '../../../core/components/NeumoCircularGauge';
import { NeumoProgressBar } from '../../../core/components/NeumoProgressBar';
import { getTotalCompletionPercentage, getPhasePercentage } from '../../session/data/cesTimeTracker';
import type { RomSession } from '../../../lib/romTypes';

interface NeumoDashboardProps {
    sessions: RomSession[];
    selectedSessionId: string | null;
    onSelectSession: (id: string) => void;
}

export const NeumoDashboard: React.FC<NeumoDashboardProps> = ({
    sessions,
    selectedSessionId,
    onSelectSession
}) => {
    const totalProgress = getTotalCompletionPercentage(selectedSessionId || undefined);
    const inhibitPercent = getPhasePercentage('inhibit', selectedSessionId || undefined);
    const lengthenPercent = getPhasePercentage('lengthen', selectedSessionId || undefined);
    const activatePercent = getPhasePercentage('activate', selectedSessionId || undefined);
    const integratePercent = getPhasePercentage('integrate', selectedSessionId || undefined);

    return (
        <div className="flex flex-col items-center" style={{ width: '100%', gap: '32px', padding: '10px 0' }}>
            {/* Session Selector */}
            <div className="w-full no-scrollbar" style={{ overflowX: 'auto', paddingBottom: '32px', paddingLeft: '16px', paddingRight: '16px' }}>
                <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', alignItems: 'center', minWidth: 'max-content', padding: '16px 0' }}>
                    {sessions.map((s, i) => (
                        <button
                            key={s.createdAt}
                            className={`neumo-btn ${selectedSessionId === s.createdAt ? 'active' : ''}`}
                            onClick={() => onSelectSession(s.createdAt)}
                            style={{
                                color: selectedSessionId === s.createdAt ? 'var(--neumo-accent)' : 'var(--neumo-text)',
                                minWidth: '140px',
                                padding: '16px 24px',
                                fontSize: '1rem',
                                fontWeight: '800',
                                whiteSpace: 'nowrap',
                                flexShrink: 0,
                                margin: '0 8px'
                            }}
                        >
                            {sessions.length - i}회차 ({new Date(s.createdAt).toLocaleDateString().slice(5).replace(/\.$/, '')})
                        </button>
                    ))}
                </div>
            </div>

            <h2 className="text-2xl font-black tracking-tighter opacity-95" style={{ marginBottom: '8px', marginTop: '16px', fontSize: '1.5rem' }}>Statistics</h2>

            <div style={{
                display: 'flex',
                flexWrap: 'wrap', 
                justifyContent: 'center',
                alignItems: 'center',
                gap: '40px', 
                width: '100%',
                maxWidth: '900px', 
                marginTop: '16px',
                padding: '16px 8px'
            }}>
                {/* 1. 좌측 (또는 상단): 원형 통계 게이지 */}
                <div className="flex flex-col items-center justify-center" style={{ 
                    flex: '1 1 40%', 
                    minWidth: '200px',
                    marginTop: '10px',
                    paddingBottom: '10px' 
                }}>
                    <NeumoCircularGauge percentage={totalProgress} />
                    <div style={{ marginTop: '24px', textAlign: 'center' }}>
                        <p className="text-xl font-black opacity-80" style={{ letterSpacing: '2px', color: 'var(--text-primary)' }}>TOTAL</p>
                        <p className="text-sm font-bold opacity-50" style={{ color: 'var(--text-secondary)' }}>전체 달성률</p>
                    </div>
                </div>

                {/* 2. 우측 (또는 하단): 4개의 세부 막대 바 */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '12px',       // 막대기 사이의 간격
                    flexWrap: 'nowrap', // 막대기 4개는 절대 줄바꿈 되지 않게 강제 결속
                    flex: '1 1 50%',   // 폭의 나머지 반(50%)을 차지하게 함
                    minWidth: '280px'   // 화면이 이보다 더 좁아지면 통째로 밑으로 내려감
                }}>
                    <NeumoProgressBar label="Inhibit" percentage={inhibitPercent} gradient="var(--grad-relax)" />
                    <NeumoProgressBar label="Lengthen" percentage={lengthenPercent} gradient="var(--grad-cardio)" />
                    <NeumoProgressBar label="Activate" percentage={activatePercent} gradient="var(--grad-strength)" />
                    <NeumoProgressBar label="Integrate" percentage={integratePercent} gradient="var(--grad-stretch)" />
                </div>
            </div>
        </div>
    );
};
