// useTimer — countdown timer hook for mock test sessions
import { useState, useEffect, useRef, useCallback } from 'react';

interface UseTimerOptions {
    initialSeconds: number;
    onExpire?: () => void;
    autoStart?: boolean;
}

interface UseTimerResult {
    timeRemaining: number;
    isRunning: boolean;
    isPaused: boolean;
    start: () => void;
    pause: () => void;
    resume: () => void;
    reset: (newSeconds?: number) => void;
    formatTime: () => string;
}

/**
 * Singleton-style countdown timer hook for mock test sessions.
 * Survives re-renders by keeping state in refs internally.
 * Calls onExpire when time reaches 0.
 */
export const useTimer = ({
    initialSeconds,
    onExpire,
    autoStart = false,
}: UseTimerOptions): UseTimerResult => {
    const [timeRemaining, setTimeRemaining] = useState(initialSeconds);
    const [isRunning, setIsRunning] = useState(autoStart);
    const [isPaused, setIsPaused] = useState(false);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const onExpireRef = useRef(onExpire);

    // Keep onExpire ref current without restarting the timer
    useEffect(() => {
        onExpireRef.current = onExpire;
    }, [onExpire]);

    const clearTimer = useCallback(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    }, []);

    const start = useCallback(() => {
        clearTimer();
        setIsRunning(true);
        setIsPaused(false);
        intervalRef.current = setInterval(() => {
            setTimeRemaining(prev => {
                if (prev <= 1) {
                    clearTimer();
                    setIsRunning(false);
                    onExpireRef.current?.();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    }, [clearTimer]);

    const pause = useCallback(() => {
        clearTimer();
        setIsRunning(false);
        setIsPaused(true);
    }, [clearTimer]);

    const resume = useCallback(() => {
        if (isPaused) {
            start();
        }
    }, [isPaused, start]);

    const reset = useCallback(
        (newSeconds?: number) => {
            clearTimer();
            setIsRunning(false);
            setIsPaused(false);
            setTimeRemaining(newSeconds ?? initialSeconds);
        },
        [clearTimer, initialSeconds]
    );

    // Auto-start if requested
    useEffect(() => {
        if (autoStart) {
            start();
        }
        return clearTimer;
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const formatTime = useCallback((): string => {
        const hours = Math.floor(timeRemaining / 3600);
        const minutes = Math.floor((timeRemaining % 3600) / 60);
        const seconds = timeRemaining % 60;

        if (hours > 0) {
            return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        }
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }, [timeRemaining]);

    return {
        timeRemaining,
        isRunning,
        isPaused,
        start,
        pause,
        resume,
        reset,
        formatTime,
    };
};

export default useTimer;
