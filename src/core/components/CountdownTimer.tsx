import React, { useState, useEffect, useRef } from 'react';

interface CountdownTimerProps {
    initialSeconds: number;
    onComplete?: () => void;
    autoStart?: boolean;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({
    initialSeconds,
    onComplete,
    autoStart = false
}) => {
    const [timeLeft, setTimeLeft] = useState(initialSeconds);
    const [isActive, setIsActive] = useState(autoStart);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    useEffect(() => {
        setTimeLeft(initialSeconds);
    }, [initialSeconds]);

    useEffect(() => {
        if (isActive && timeLeft > 0) {
            timerRef.current = setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            setIsActive(false);
            onComplete?.();
        }
        return () => { if (timerRef.current) clearInterval(timerRef.current); };
    }, [isActive, timeLeft, onComplete]);

    const toggle = () => setIsActive(!isActive);
    const reset = () => {
        setIsActive(false);
        setTimeLeft(initialSeconds);
    };

    return (
        <div className="flex flex-col items-center gap-2">
            <div
                className="neumo-inset flex items-center justify-center"
                style={{ width: 100, height: 40, borderRadius: 10 }}
            >
                <span className="text-xl font-mono font-bold" style={{ color: timeLeft <= 5 ? 'var(--danger)' : 'var(--primary)' }}>
                    {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                </span>
            </div>
            <div className="flex gap-2">
                <button className="neumo-btn px-2 py-1 text-xs font-bold" onClick={toggle}>
                    {isActive ? 'STOP' : 'START'}
                </button>
                <button className="neumo-btn px-2 py-1 text-xs font-bold" onClick={reset}>
                    RESET
                </button>
            </div>
        </div>
    );
};
