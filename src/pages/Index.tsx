import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMeasurementQueue, saveRomSession, getPatients } from '../lib/romData';
import type { Side, Patient } from '../lib/romData';
import { PatientSelector } from '../components/PatientSelector';
import { PainAssessment } from '../components/PainAssessment';
import { JointSelector } from '../components/JointSelector';

type SideMode = '좌측만' | '우측만' | '양쪽';
const SIDE_MODE_MAP: Record<SideMode, Side[]> = {
    '좌측만': ['좌측'], '우측만': ['우측'], '양쪽': ['좌측', '우측'],
};

export const Index: React.FC = () => {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [painArea, setPainArea] = useState('');
    const [vasScore, setVasScore] = useState<number>(0);
    const [patientId, setPatientId] = useState<string | undefined>(undefined);
    const [sideMode, setSideMode] = useState<SideMode>('좌측만');
    const [selectedJointIds, setSelectedJointIds] = useState<string[]>([]);
    const [isManaging, setIsManaging] = useState(false);

    const patients = getPatients();
    const sides = SIDE_MODE_MAP[sideMode];
    const totalSteps = getMeasurementQueue({
        patientId: '', patientName: '', patientAge: 0,
        selectedJointIds, selectedSides: sides, measurements: {}, createdAt: ''
    } as any).length;

    const handleSelectPatient = (p: Patient) => {
        setPatientId(p.id); setName(p.name); setAge(p.age.toString());
        setPainArea(p.painArea || ''); setVasScore(p.vasScore || 0);
    };

    const handleNewPatient = () => {
        setPatientId(undefined); setName(''); setAge('');
        setPainArea(''); setVasScore(0); setIsManaging(false);
    };

    const handleDeletePatient = (id: string) => {
        if (!confirm('정말 삭제하시겠습니까?')) return;
        import('../lib/romData').then(m => m.deletePatient(id));
        if (patientId === id) handleNewPatient();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !age) return alert('정보를 입력해주세요.');
        if (selectedJointIds.length === 0) return alert('관절을 선택해 주세요.');

        saveRomSession({
            patientId: patientId || `p_${Date.now()}`,
            patientName: name, patientAge: parseInt(age, 10),
            painArea, vasScore, selectedJointIds,
            selectedSides: sides, measurements: {},
            createdAt: new Date().toISOString(),
        });

        const queue = getMeasurementQueue({
            selectedJointIds, selectedSides: sides
        } as any);
        navigate(`/measure?joint=${queue[0].jointId}&side=${queue[0].side}`);
    };

    return (
        <div className="bg-full-viewport page-bg-home">
            <div className="container pb-10">
                <div className="page-header">
                    <button onClick={() => navigate('/settings')} className="btn-settings-top">⚙️</button>
                    <h1>ROM 측정 시스템</h1>
                    <p>평가 및 재활 처방</p>
                </div>

                <div className="card">
                    <PatientSelector
                        patients={patients} patientId={patientId} isManaging={isManaging}
                        setIsManaging={setIsManaging} handleSelectPatient={handleSelectPatient}
                        handleDeletePatient={handleDeletePatient} handleNewPatient={handleNewPatient}
                    />

                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div className="form-group">
                                <label className="form-label">이름</label>
                                <input type="text" className="form-input" placeholder="성함" value={name} onChange={(e) => setName(e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">나이</label>
                                <input type="number" className="form-input" placeholder="세" value={age} onChange={(e) => setAge(e.target.value)} />
                            </div>
                        </div>

                        <PainAssessment painArea={painArea} setPainArea={setPainArea} vasScore={vasScore} setVasScore={setVasScore} />

                        <div className="form-group mt-6">
                            <label className="form-label">방향 선택</label>
                            <div className="radio-input">
                                <div className="glass"><div className="glass-inner"></div></div>
                                <div className="selector">
                                    {(Object.keys(SIDE_MODE_MAP) as SideMode[]).map((mode) => (
                                        <div key={mode} className="choice">
                                            <div>
                                                <input type="radio" name="side-mode" id={`m-${mode}`} className="choice-circle" checked={sideMode === mode} onChange={() => setSideMode(mode)} />
                                                <div className="ball"></div>
                                            </div>
                                            <label htmlFor={`m-${mode}`} className="choice-name">{mode}</label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <p style={{ fontSize: '0.6rem', color: 'var(--text-secondary)', textAlign: 'right', marginTop: '-15px' }}>© 2026 LilaRest</p>
                        </div>

                        <JointSelector selectedJointIds={selectedJointIds} toggleJoint={(id) => setSelectedJointIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])} />

                        <div className="grid grid-cols-2 gap-4 mt-4">
                            <button type="submit" className="btn btn-primary btn-large w-full">
                                측정 시작하기 ({totalSteps}단계)
                            </button>
                            {patientId && (
                                <button type="button" className="btn btn-outline btn-large w-full" onClick={() => navigate(`/trends?patientId=${patientId}`)}>
                                    📈 추이 보기
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
