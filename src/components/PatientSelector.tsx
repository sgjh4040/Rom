import React from 'react';
import type { Patient } from '../lib/romTypes';

interface PatientSelectorProps {
    patients: Patient[];
    patientId?: string;
    isManaging: boolean;
    setIsManaging: (val: boolean) => void;
    handleSelectPatient: (p: Patient) => void;
    handleDeletePatient: (id: string) => void;
    handleNewPatient: () => void;
}

export const PatientSelector: React.FC<PatientSelectorProps> = ({
    patients, patientId, isManaging, setIsManaging,
    handleSelectPatient, handleDeletePatient, handleNewPatient
}) => {
    if (patients.length === 0 && !patientId) return null;

    return (
        <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
                <label className="form-label mb-0">환자 관리 및 선택</label>
                <div className="flex gap-2">
                    {patients.length > 0 && (
                        <button type="button" className={`btn btn-small ${isManaging ? 'btn-primary' : 'btn-outline'}`}
                            onClick={() => setIsManaging(!isManaging)}>
                            {isManaging ? '완료' : '⚙️ 관리'}
                        </button>
                    )}
                    {(patients.length > 0 || patientId) && (
                        <button type="button" className="btn btn-outline btn-small" onClick={handleNewPatient}>
                            🆕 새 환자
                        </button>
                    )}
                </div>
            </div>

            {patients.length > 0 && !isManaging && (
                <div className="flex gap-2 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
                    {patients.slice(-5).reverse().map(p => (
                        <button
                            key={p.id}
                            type="button"
                            className={`btn ${patientId === p.id ? 'btn-primary' : 'btn-outline'}`}
                            style={{ whiteSpace: 'nowrap', fontSize: '0.875rem' }}
                            onClick={() => handleSelectPatient(p)}
                        >
                            {p.name} ({p.age})
                        </button>
                    ))}
                </div>
            )}

            {isManaging && (
                <div className="panel" style={{ background: 'var(--bg-color)', padding: '1rem', border: '1px solid #ddd' }}>
                    <div className="flex flex-col gap-2">
                        {patients.slice().reverse().map(p => (
                            <div key={p.id} className="flex justify-between items-center p-2 bg-white rounded-md shadow-sm">
                                <div onClick={() => { handleSelectPatient(p); setIsManaging(false); }} style={{ cursor: 'pointer' }}>
                                    <strong>{p.name}</strong> <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>({p.age}세)</span>
                                </div>
                                <button className="btn btn-danger btn-small" style={{ padding: '0.2rem 0.4rem', fontSize: '0.75rem' }}
                                    onClick={() => handleDeletePatient(p.id)}>삭제</button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
