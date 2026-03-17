// ces/index.ts — 전체 CES 데이터 통합 export
// [PRD 4-0] 200줄 이하
import { SHOULDER_CES } from './shoulder';
import { ELBOW_CES } from './elbow';
import { WRIST_CES } from './wrist';
import { HIP_CES } from './hip';
import { KNEE_CES } from './knee';
import { ANKLE_CES } from './ankle';
import { WAIST_CES } from './waist';
import type { JointCesData } from './cesTypes';

export type { CesExercise, CesStage, MovementMuscles, MovementProtocol, JointCesData, CesAnalysisResult } from './cesTypes';

/** 관절 ID → JointCesData 전체 맵 */
export const ALL_CES_DATA: Record<string, JointCesData> = {
    shoulder: SHOULDER_CES,
    elbow: ELBOW_CES,
    wrist: WRIST_CES,
    hip: HIP_CES,
    knee: KNEE_CES,
    ankle: ANKLE_CES,
    waist: WAIST_CES,
};
