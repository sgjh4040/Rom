// cesProtocolHelpers.ts — CesProtocol 전용 헬퍼 함수 (PRD 4-0: 200줄 이하)
import type React from 'react';
import type { CesExercise } from '../../lib/ces/cesTypes';

/** 운동 이름에서 근육명을 파악해 해부도 위 하이라이트 위치·색상을 반환 */
export const getMuscleHighlightStyle = (muscleName: string): React.CSSProperties => {
    if (muscleName.includes('대흉근') || muscleName.includes('소흉근') || muscleName.includes('가슴')) {
        return { top: '25%', left: '35%', backgroundColor: 'rgba(255,0,0,0.45)', boxShadow: '0 0 16px rgba(255,0,0,0.55)' };
    }
    if (muscleName.includes('대퇴') || muscleName.includes('장요근') || muscleName.includes('슬굴곡근') || muscleName.includes('허벅지')) {
        return { top: '55%', left: '42%', backgroundColor: 'rgba(255,0,0,0.9)', boxShadow: '0 0 16px rgba(255,0,0,0.8)' };
    }
    if (muscleName.includes('대둔근') || muscleName.includes('중둔근') || muscleName.includes('소둔근')) {
        return { top: '48%', left: '45%' };
    }
    if (muscleName.includes('승모근') || muscleName.includes('견갑거근') || muscleName.includes('목')) {
        return { top: '12%', left: '43%' };
    }
    if (muscleName.includes('삼각근') || muscleName.includes('어깨')) {
        return { top: '22%', left: '28%' };
    }
    if (muscleName.includes('광배근') || muscleName.includes('대원근') || muscleName.includes('소원근') || muscleName.includes('등')) {
        return { top: '32%', left: '27%' };
    }
    if (muscleName.includes('종아리') || muscleName.includes('비복근') || muscleName.includes('가자미근') || muscleName.includes('비골근')) {
        return { top: '75%', left: '40%' };
    }
    if (muscleName.includes('전경골근') || muscleName.includes('발목')) {
        return { top: '80%', left: '41%' };
    }
    if (muscleName.includes('이두근') || muscleName.includes('삼두근') || muscleName.includes('팔')) {
        return { top: '35%', left: '24%' };
    }
    return { top: '30%', left: '40%' };
};

/** 현재 운동의 세트·횟수·초 정보를 보기 좋은 문자열로 반환 */
export const getExMeta = (ex: CesExercise): string => {
    const parts: string[] = [];
    if (ex.sets) parts.push(`${ex.sets}세트`);
    if (ex.reps) parts.push(`${ex.reps}회`);
    if (ex.holdSeconds) parts.push(`${ex.holdSeconds}초 유지`);
    return parts.join(' · ');
};

/** 초(second)를 HH:MM:SS 포맷 문자열로 변환 */
export const formatTime = (totalSeconds: number): string => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return [hrs, mins, secs].map(v => String(v).padStart(2, '0')).join(':');
};
