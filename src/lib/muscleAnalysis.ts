// ────────────────────────────────────────────────────────
// muscleAnalysis.ts — ROM 결과 → 근육 불균형 분류 + CES 처방 생성
// [PRD 1] Data Layer: UI와 완전히 분리된 분석 로직
// ────────────────────────────────────────────────────────

import { calculateSeverity } from './romCalculations';
import { ALL_CES_DATA } from './ces/index';
import type { CesExercise, CesAnalysisResult } from './ces/cesTypes';
import type { RomSession, Side } from './romTypes';
import { JOINTS } from './romData';

/** 중복 운동 제거 헬퍼 (id 또는 name 하나라도 겹치면 제거) */
const dedup = (exercises: CesExercise[]): CesExercise[] => {
    const seenIds = new Set<string>();
    const seenNames = new Set<string>();
    return exercises.filter((ex) => {
        if (seenIds.has(ex.id) || seenNames.has(ex.name)) return false;
        seenIds.add(ex.id);
        seenNames.add(ex.name);
        return true;
    });
};

/** 중복 문자열 제거 헬퍼 */
const dedupStr = (arr: string[]): string[] => [...new Set(arr)];

/**
 * ROM 세션 전체를 분석해 CES 처방 결과를 반환합니다.
 * 레고 비유: ROM 측정 결과지를 받아서 어떤 근육이 뭉쳐있고 약한지 찾아주는 번역가입니다.
 *
 * @param session - 저장된 ROM 세션 데이터
 * @param targetJointId - CES 처방을 산출할 관절 ID
 * @param targetSide - 처방 기준 방향 (좌측/우측 — 양쪽이면 호출 2회)
 */
export const analyzeMuscles = (
    session: RomSession,
    targetJointId: string,
    targetSide: Side,
): CesAnalysisResult => {
    const joint = JOINTS.find((j) => j.id === targetJointId);
    const cesData = ALL_CES_DATA[targetJointId];

    // [PRD 4-2] Early return
    if (!joint || !cesData) {
        return { overactiveMuscles: [], underactiveMuscles: [], inhibit: [], lengthen: [], activate: [], integrate: [] };
    }

    const sideMeasurements = session.measurements?.[targetJointId]?.[targetSide] ?? {};

    const overactive: string[] = [];
    const underactive: string[] = [];
    const inhibit: CesExercise[] = [];
    const lengthen: CesExercise[] = [];
    const activate: CesExercise[] = [];

    joint.movements.forEach((movement) => {
        const measured = sideMeasurements[movement.id] ?? 0;

        // 정성적 평가(isQualitative)와 정량적 평가의 판정 로직 분리
        const severity = movement.isQualitative
            ? (measured === 1 ? '심각한제한' : '정상')
            : calculateSeverity(measured, movement.normalRange);

        // 정상이면 근육 불균형 없음 → 스킵
        if (severity === '정상') return;

        const muscles = cesData.muscleMap[movement.id];
        const protocol = cesData.protocol[movement.id];

        if (muscles) {
            overactive.push(...muscles.overactive);
            underactive.push(...muscles.underactive);
        }
        if (protocol) {
            inhibit.push(...protocol.inhibit);
            lengthen.push(...protocol.lengthen);
            activate.push(...protocol.activate);
        }
    });

    return {
        overactiveMuscles: dedupStr(overactive),
        underactiveMuscles: dedupStr(underactive),
        inhibit: dedup(inhibit),
        lengthen: dedup(lengthen),
        activate: dedup(activate),
        integrate: cesData.integrate,  // Stage 4는 관절 전체 공통
    };
};
