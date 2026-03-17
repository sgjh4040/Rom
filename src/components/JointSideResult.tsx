import React from 'react';
import { JOINTS, calculateSeverity } from '../lib/romData';
import type { RomSession, Side } from '../lib/romData';
import { RomGauge } from './RomGauge';

interface JointSideResultProps {
    session: RomSession;
    jointId: string;
    side: Side;
    firstSession?: RomSession;
}

export const JointSideResult: React.FC<JointSideResultProps> = ({
    session, jointId, side, firstSession
}) => {
    const joint = JOINTS.find((j) => j.id === jointId);
    if (!joint) return null;

    const sideMeasurements = session.measurements?.[jointId]?.[side] ?? {};
    const firstSideMeasurements = firstSession?.measurements?.[jointId]?.[side] ?? {};

    const results = joint.movements.map((m) => {
        const measured = sideMeasurements[m.id] ?? 0;
        const firstMeasured = firstSideMeasurements[m.id];
        const diff = firstMeasured !== undefined ? measured - firstMeasured : null;

        return {
            ...m,
            measured,
            severity: m.isQualitative
                ? (measured === 1 ? '심각한제한' : '정상')
                : calculateSeverity(measured, m.normalRange),
            diff
        };
    });
    const hasLimitation = results.some((r) => r.severity !== '정상');

    const severityColor = (s: string) => ({
        '정상': 'var(--success-text)', '경도제한': 'var(--warning-text)',
        '중등도제한': 'var(--danger-text)', '심각한제한': 'var(--danger-text)',
    })[s] ?? 'var(--text-secondary)';

    return (
        <div className="panel" style={{ marginBottom: '1rem' }}>
            <div className="panel-header">
                <h3>{joint.name}{joint.isSymmetric ? '' : ` — ${side}`}</h3>
                <span className={`badge ${hasLimitation ? 'badge-warning' : 'badge-success'}`}>
                    {hasLimitation ? '⚠️ 제한 있음' : '✅ 정상'}
                </span>
            </div>
            {results.map((res) => (
                <div key={res.id} className="file-item" style={{ cursor: 'default' }}>
                    <div className="file-icon"
                        style={{
                            background: `${severityColor(res.severity)}18`,
                            fontSize: res.isQualitative ? '0.6rem' : '0.7rem',
                            fontWeight: 700,
                            color: severityColor(res.severity),
                            width: res.isQualitative ? 'auto' : '2.5rem',
                            padding: res.isQualitative ? '0 0.5rem' : '0'
                        }}>
                        {res.isQualitative
                            ? (res.measured === 1 ? '발견' : '정상')
                            : `${res.measured}°`
                        }
                    </div>
                    <div className="file-info">
                        <div className="flex items-center gap-2">
                            <p className="file-name">{res.name}</p>
                            {res.diff !== null && res.diff !== 0 && (
                                <span style={{
                                    fontSize: '0.75rem',
                                    color: res.diff > 0 ? 'var(--success-text)' : 'var(--danger-text)',
                                    fontWeight: 600
                                }}>
                                    {res.diff > 0 ? '↑' : '↓'} {Math.abs(res.diff)}°
                                </span>
                            )}
                        </div>
                        <p className="file-meta">
                            {res.isQualitative ? '정성 분석' : `정상 ${res.normalRange}°`} · {res.severity}
                        </p>
                    </div>
                    {!res.isQualitative && (
                        <RomGauge label="" measured={res.measured} normal={res.normalRange} severity={res.severity} />
                    )}
                </div>
            ))}
        </div>
    );
};
